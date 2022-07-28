import { Gateway } from './Gateway';

import { DiscordConstants } from '../constants/DiscordConstants';
import { DistypeError, DistypeErrorType } from '../errors/DistypeError';
import { LogCallback } from '../types/Log';

import { TypedEmitter } from '@br88c/node-utils';
import * as DiscordTypes from 'discord-api-types/v10';
import { Snowflake } from 'discord-api-types/v10';
import { setTimeout as wait } from 'node:timers/promises';
import { RawData, WebSocket } from 'ws';

/**
 * An item in a {@link GatewayShard gateway shard}'s send queue.
 * @internal
 */
interface GatewayShardQueueItem {
    data: string
    op: DiscordTypes.GatewayOpcodes
    resolve: () => void
    reject: (error?: Error) => void
}

/**
 * {@link GatewayShard Gateway shard} events.
 */
export type GatewayShardEvents = {
    /**
     * When the {@link GatewayShard shard} receives a payload. Data is the parsed payload.
     */
    RECEIVED_MESSAGE: (payload: DiscordTypes.GatewayDispatchPayload) => void
    /**
     * When a payload is sent. Data is the sent payload.
     */
    SENT_PAYLOAD: (payload: string) => void
    /**
     * When the {@link GatewayShard shard} enters an {@link GatewayShardState idle state}.
     */
    IDLE: () => void
    /**
     * When the {@link GatewayShard shard} enters a {@link GatewayShardState connecting state}.
     */
    CONNECTING: () => void
    /**
     * When the {@link GatewayShard shard} enters an {@link GatewayShardState identifying state}.
     */
    IDENTIFYING: () => void
    /**
     * When the {@link GatewayShard shard} enters a {@link GatewayShardState resuming state}.
     */
    RESUMING: () => void
    /**
     * When the {@link GatewayShard shard} enters a {@link GatewayShardState running state}.
     */
    RUNNING: () => void
    /**
     * When a {@link GatewayShard shard} enters a {@link GatewayShardState guilds ready state}.
     */
    GUILDS_READY: () => void
    /**
     * When the {@link GatewayShard shard} enters a {@link GatewayShardState disconnected state}.
     */
    DISCONNECTED: () => void
}

/**
 * {@link GatewayShard Gateway shard} states.
 */
export enum GatewayShardState {
    /**
     * The {@link GatewayShard shard} is not running, and is not pending a reconnect.
     */
    IDLE,
    /**
     * The {@link GatewayShard shard} is connecting to the gateway.
     * During this stage, the {@link GatewayShard shard}:
     * - Initiates the websocket connection
     * - Starts [heartbeating](https://discord.com/developers/docs/topics/gateway#heartbeating)
     */
    CONNECTING,
    /**
     * The {@link GatewayShard shard} is identifying.
     * During this stage, the {@link GatewayShard shard}:
     * - Waits for a [hello payload](https://discord.com/developers/docs/topics/gateway#hello)
     * - The shard sends an [identify payload](https://discord.com/developers/docs/topics/gateway#identify)
     * - Waits for the [READY](https://discord.com/developers/docs/topics/gateway#ready) dispatch
     */
    IDENTIFYING,
    /**
     * The {@link GatewayShard shard} is resuming.
     * During this stage, the {@link GatewayShard shard}:
     * - Sends a [resume payload](https://discord.com/developers/docs/topics/gateway#resume)
     * - Waits for the [RESUME](https://discord.com/developers/docs/topics/gateway#resumed) dispatch
     */
    RESUMING,
    /**
     * The {@link GatewayShard shard} is connected and is operating normally. A [READY](https://discord.com/developers/docs/topics/gateway#ready) or [RESUMED](https://discord.com/developers/docs/topics/gateway#resumed) dispatch has been received.
     */
    RUNNING,
    /**
     * The {@link GatewayShard shard} has received all [GUILD_CREATE](https://discord.com/developers/docs/topics/gateway#guild-create) dispatches (or has timed out).
     */
    GUILDS_READY,
    /**
     * The {@link GatewayShard shard} was disconnected.
     * Note that if the shard is not automatically reconnecting to the gateway, the shard will enter an `IDLE` state and will not enter a `DISCONNECTED` state.
     */
    DISCONNECTED
}

/**
 * A gateway shard.
 * Handles the low level ws communication with Discord.
 */
export class GatewayShard extends TypedEmitter<GatewayShardEvents> {
    /**
     * Guilds that belong to the shard.
     * This is populated as the shard is receiving [GUILD_CREATE](https://discord.com/developers/docs/topics/gateway#guild-create) payloads, and is accurate after the shard is in a {@link GatewayShardState guilds ready state}.
     */
    public guilds: Set<Snowflake> = new Set();
    /**
     * The last [sequence number](https://discord.com/developers/docs/topics/gateway#resumed) received.
     */
    public lastSequence: number | null = null;
    /**
     * The shard's ping in milliseconds.
     */
    public ping = 0;
    /**
     * The shard's [session ID](https://discord.com/developers/docs/topics/gateway#ready-ready-event-fields).
     */
    public sessionId: string | null = null;
    /**
     * The shard's {@link GatewayShardState state}.
     */
    public state: GatewayShardState = GatewayShardState.DISCONNECTED;
    /**
     * The [WebSocket](https://github.com/websockets/ws) used by the shard.
     */
    public ws: WebSocket | null = null;

    /**
     * The shard's ID.
     */
    public readonly id: number;
    /**
     * The value to pass to `num_shards` in the [identify payload](https://discord.com/developers/docs/topics/gateway#identifying).
     */
    public readonly numShards: number;
    /**
     * Options for the gateway shard.
     * Note that if you are using a {@link Client} or {@link ClientMaster} / {@link ClientWorker} and not manually creating a {@link Client} separately, these options may differ than the options specified when creating the client due to them being passed through the {@link clientOptionsFactory}.
     */
    public readonly options: Gateway[`options`];
    /**
     * The system string used for emitting {@link DistypeError errors} and for the {@link LogCallback log callback}.
     */
    public readonly system: `Gateway Shard ${number}`;
    /**
     * The URL being used.
     */
    public readonly url: string;

    /**
     * Guilds expected to receive a [GUILD_CREATE](https://discord.com/developers/docs/topics/gateway#guild-create) from.
     */
    private _expectedGuilds: Set<Snowflake> | null = null;
    /**
     * Timeout for waiting for guilds.
     */
    private _expectedGuildsTimeout: NodeJS.Timeout | null = null;
    /**
     * The heartbeat interval timer.
     */
    private _heartbeatIntervalTimer: NodeJS.Timer | null = null;
    /**
     * The time that the heartbeat timer has been waiting for the jitter to start for.
     */
    private _heartbeatJitterActive: number | null = null;
    /**
     * The time the heartbeat has been waiting for an ACK for.
     */
    private _heartbeatWaitingSince: number | null = null;
    /**
     * If the shard was killed. Set back to `false` when a new connection attempt is started.
     */
    private _killed = false;
    /**
     * The {@link LogCallback log callback} used by the shard.
     */
    private _log: LogCallback;
    /**
     * A queue of data to be sent after the socket opens.
     */
    private _queue: GatewayShardQueueItem[] = [];
    /**
     * If the shard has an active spawn or restart loop.
     */
    private _spinning = false;

    /**
     * The bot's token.
     */
    // @ts-expect-error Property '_token' has no initializer and is not definitely assigned in the constructor.
    private readonly _token: string;

    /**
     * Create a gateway shard.
     * @param token The bot's token.
     * @param id The shard's ID.
     * @param url The URL being used to connect to the gateway.
     * @param numShards The value to pass to `num_shards` in the [identify payload](https://discord.com/developers/docs/topics/gateway#identifying).
     * @param options Gateway shard options.
     * @param logCallback A {@link LogCallback callback} to be used for logging events internally in the gateway shard.
     * @param logThisArg A value to use as `this` in the `logCallback`.
     */
    constructor (token: string, id: number, numShards: number, url: string, options: Gateway[`options`], logCallback: LogCallback = (): void => {}, logThisArg?: any) {
        super();

        if (typeof token !== `string`) throw new TypeError(`Parameter "token" (string) not provided: got ${token} (${typeof token})`);
        if (typeof id !== `number`) throw new TypeError(`Parameter "id" (number) not provided: got ${id} (${typeof id})`);
        if (typeof numShards !== `number`) throw new TypeError(`Parameter "numShards" (number) not provided: got ${numShards} (${typeof numShards})`);
        if (typeof url !== `string`) throw new TypeError(`Parameter "url" (string) not provided: got ${url} (${typeof url})`);
        if (typeof options !== `object`) throw new TypeError(`Parameter "options" (object) not provided: got ${options} (${typeof options})`);
        if (typeof logCallback !== `function`) throw new TypeError(`Parameter "logCallback" (function) type mismatch: got ${logCallback} (${typeof logCallback})`);

        Object.defineProperty(this, `_token`, {
            configurable: false,
            enumerable: false,
            value: token as GatewayShard[`_token`],
            writable: false
        });

        this.id = id;
        this.system = `Gateway Shard ${this.id}`;
        this.numShards = numShards;
        this.url = url;
        this.options = options;

        this._log = logCallback.bind(logThisArg);
        this._log(`Initialized gateway shard ${id}`, {
            level: `DEBUG`, system: this.system
        });
    }

    /**
     * If the shard can resume.
     */
    public get canResume (): boolean {
        return this.lastSequence !== null && this.sessionId !== null;
    }

    /**
     * Connect to the gateway.
     * Note that this method does not wait for guilds to be ready to resolve.
     */
    public async spawn (): Promise<void> {
        if (this._spinning) throw new DistypeError(`Shard is already connecting to the gateway`, DistypeErrorType.GATEWAY_SHARD_ALREADY_CONNECTING, this.system);

        this._spinning = true;
        this._killed = false;

        for (let i = 0; i < this.options.spawnMaxAttempts; i++) {
            const attempt = await this._initSocket(false).then(() => true).catch((error) => {
                this._log(`Spawn attempt ${i + 1}/${this.options.spawnMaxAttempts} failed: ${(error?.message ?? error) ?? `Unknown reason`}`, {
                    level: `ERROR`, system: this.system
                });
                return false;
            });

            if (attempt) {
                this._spinning = false;
                this._log(`Spawned after ${i + 1} attempts`, {
                    level: i === 0 ? `DEBUG` : `WARN`, system: this.system
                });
                return;
            }

            if (this._killed) {
                this._enterState(GatewayShardState.IDLE);

                this._spinning = false;
                this._log(`Spawning interrupted by kill`, {
                    level: `DEBUG`, system: this.system
                });
                throw new DistypeError(`Shard spawn attempts interrupted by kill`, DistypeErrorType.GATEWAY_SHARD_INTERRUPT_FROM_KILL, this.system);
            }

            if (i < this.options.spawnMaxAttempts - 1) await wait(this.options.spawnAttemptDelay);
        }

        this._spinning = false;
        this._enterState(GatewayShardState.IDLE);
        throw new DistypeError(`Failed to spawn shard after ${this.options.spawnMaxAttempts} attempts`, DistypeErrorType.GATEWAY_SHARD_MAX_SPAWN_ATTEMPTS_REACHED, this.system);
    }

    /**
     * Restart / resume the shard.
     */
    public async restart (): Promise<void> {
        if (this._spinning) throw new DistypeError(`Shard is already connecting to the gateway`, DistypeErrorType.GATEWAY_SHARD_ALREADY_CONNECTING, this.system);

        this._spinning = true;
        this._killed = false;

        for (let i = 1; ; i++) {
            const attempt = await this._initSocket(true).then(() => true).catch((error) => {
                this._log(`Restart attempt ${i + 1} failed: ${(error?.message ?? error) ?? `Unknown reason`}`, {
                    level: `ERROR`, system: this.system
                });
                return false;
            });

            if (attempt) {
                this._log(`Restarted after ${i} attempts`, {
                    level: i === 1 ? `DEBUG` : `WARN`, system: this.system
                });
                this._spinning = false;
                return;
            }

            if (this._killed) {
                this._enterState(GatewayShardState.IDLE);

                this._log(`Restarting interrupted by kill`, {
                    level: `DEBUG`, system: this.system
                });
                throw new DistypeError(`Shard restart attempts interrupted by kill`, DistypeErrorType.GATEWAY_SHARD_INTERRUPT_FROM_KILL, this.system);
            }

            await wait(this.options.spawnAttemptDelay);
        }
    }

    /**
     * Kill the shard.
     * @param code A socket [close code](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/code). Defaults to `1000`.
     * @param reason The reason the shard is being killed. Defaults to `"Manual kill"`.
     */
    public kill (code = 1000, reason = `Manual kill`): void {
        this._close(false, code, reason);
        this._enterState(GatewayShardState.IDLE);

        this._killed = true;

        this._log(`Shard killed with code ${code}, reason "${reason}"`, {
            level: `WARN`, system: this.system
        });
    }

    /**
     * Send data to the gateway.
     * @param data The data to send.
     */
    public async send (data: DiscordTypes.GatewaySendPayload): Promise<void> {
        return await new Promise((resolve, reject) => {
            if (this.state !== GatewayShardState.RUNNING) {
                this._queue.push({
                    data: JSON.stringify(data),
                    op: data.op,
                    resolve,
                    reject
                });
            } else {
                this._send(JSON.stringify(data), data.op).then(resolve, reject);
            }
        });
    }

    /**
     * Checks if all [GUILD_CREATE](https://discord.com/developers/docs/topics/gateway#guild-create) dispatches have been received.
     */
    private _checkGuildsReady (): void {
        if (this._expectedGuildsTimeout !== null) {
            clearTimeout(this._expectedGuildsTimeout);
            this._expectedGuildsTimeout = null;
        }

        if (!this._expectedGuilds || !this._expectedGuilds.size) {
            this._enterState(GatewayShardState.GUILDS_READY);
            return;
        }

        this._expectedGuildsTimeout = setTimeout(() => {
            this._log(`Timed out while waiting for guilds, emitting GUILDS_READY anyways...`, {
                level: `WARN`, system: this.system
            });

            this._enterState(GatewayShardState.GUILDS_READY);
        }, this.options.guildsReadyTimeout).unref();
    }

    /**
     * Closes the connection, cleans up helper variables and flushes the queue.
     * @param resuming If the shard will be resuming after the close.
     * @param code A socket [close code](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/code).
     * @param reason The reason the shard is being closed.
     */
    private _close (resuming: boolean, code: number, reason: string): void {
        this._log(`Closing... (Code ${code}, reason "${reason}")`, {
            level: `DEBUG`, system: this.system
        });

        this._flushQueue(true);

        this.ws?.removeAllListeners();
        if (this.ws?.readyState !== WebSocket.CLOSED) {
            try {
                this.ws?.close(code, reason);
            } catch {
                this.ws?.terminate();
            }
        }
        this.ws = null;

        this.ping = 0;

        this._expectedGuilds = null;
        if (this._expectedGuildsTimeout !== null) {
            clearTimeout(this._expectedGuildsTimeout);
            this._expectedGuildsTimeout = null;
        }

        if (this._heartbeatIntervalTimer !== null) {
            clearInterval(this._heartbeatIntervalTimer);
            this._heartbeatIntervalTimer = null;
        }
        this._heartbeatJitterActive = null;
        this._heartbeatWaitingSince = null;

        if (!resuming) {
            this.lastSequence = null;
            this.sessionId = null;
        }
    }

    /**
     * Enter a state.
     * @param state The state to enter.
     */
    private _enterState (state: GatewayShardState): void {
        if (this.state !== state) {
            this.state = state;

            this._log(GatewayShardState[state], {
                level: `DEBUG`, system: this.system
            });

            (this.emit as (event: string) => void)(GatewayShardState[state]);
        }
    }

    /**
     * Flushes the send queue.
     * @param reject If the queue shouldn't be sent, and all promises should be rejected.
     */
    private async _flushQueue (reject = false): Promise<void> {
        do {
            const next = this._queue.shift();
            if (next) {
                if (reject) next.reject(new DistypeError(`Send queue force flushed`, DistypeErrorType.GATEWAY_SHARD_SEND_QUEUE_FORCE_FLUSHED, this.system));
                else await this._send(next.data, next.op).then(next.resolve, next.reject);
            }
        }
        while (this._queue.length);

        this._log(`Flushed send queue`, {
            level: `DEBUG`, system: this.system
        });
    }

    /**
     * Sends a heartbeat.
     * @param force If waiting for the ACK check should be omitted. Only use for responding to heartbeat requests.
     */
    private _heartbeat (force = false): void {
        if (this._heartbeatWaitingSince !== null && !force) {
            this._log(`Not receiving heartbeat ACKs (Zombified Connection), restarting...`, {
                level: `WARN`, system: this.system
            });
            this._close(true, 4009, `Did not receive heartbeat ACK`);
            this._enterState(GatewayShardState.DISCONNECTED);
            this._reconnect(true);
        } else {
            this._send(JSON.stringify({
                op: DiscordTypes.GatewayOpcodes.Heartbeat,
                d: this.lastSequence
            }), DiscordTypes.GatewayOpcodes.Heartbeat).then(() => {
                this._heartbeatWaitingSince = Date.now();
            }).catch((error) => {
                this._heartbeatWaitingSince = null;
                this._log(`Failed to send heartbeat: ${(error?.message ?? error) ?? `Unknown reason`}`, {
                    level: `WARN`, system: this.system
                });
            });
        }
    }

    /**
     * Initiate the socket.
     * @param resume If the shard is resuming.
     */
    private async _initSocket (resume: boolean): Promise<void> {
        if (this.state !== GatewayShardState.IDLE && this.state !== GatewayShardState.DISCONNECTED) {
            this._close(resume, resume ? 4000 : 1000, `Restarting`);
            this._enterState(GatewayShardState.DISCONNECTED);
        }

        this._log(`Initiating socket... (Resuming: ${resume})`, {
            level: `DEBUG`, system: this.system
        });

        this._enterState(GatewayShardState.CONNECTING);

        const result = await new Promise<true>((resolve, reject) => {
            const disconnectedListener = (): void => reject(new DistypeError(`Socket disconnected on socket init`, DistypeErrorType.GATEWAY_SHARD_CLOSED_DURING_SOCKET_INIT, this.system));
            this.once(`DISCONNECTED`, disconnectedListener);
            this.once(`IDLE`, disconnectedListener);

            this.ws = new WebSocket(this.url, this.options.wsOptions);

            const closeListener = ((code: number, reason: Buffer): void => reject(new DistypeError(`Socket closed with code ${code}: "${this._parsePayload(reason)}"`, DistypeErrorType.GATEWAY_SHARD_CLOSED_DURING_SOCKET_INIT, this.system))).bind(this);
            this.ws.once(`close`, closeListener);

            const errorListener = ((error: Error): void => reject(error)).bind(this);
            this.ws.once(`error`, errorListener);

            this.ws.once(`open`, () => {
                this._log(`Socket open`, {
                    level: `DEBUG`, system: this.system
                });

                if (resume && this.canResume) this._enterState(GatewayShardState.RESUMING);
                else this._enterState(GatewayShardState.IDENTIFYING);

                this.ws!.on(`close`, this.wsOnClose.bind(this));
                this.ws!.on(`error`, this.wsOnError.bind(this));
                this.ws!.on(`message`, this.wsOnMessage.bind(this));

                TypedEmitter.once(this, `RUNNING`).then(() => {
                    this.removeListener(`DISCONNECTED`, disconnectedListener);
                    this.removeListener(`IDLE`, disconnectedListener);

                    this.ws!.removeListener(`close`, closeListener);
                    this.ws!.removeListener(`error`, errorListener);

                    resolve(true);
                });
            });
        }).catch((error) => {
            if (this.state !== GatewayShardState.DISCONNECTED && this.state !== GatewayShardState.IDLE) {
                this._close(resume, resume ? 4000 : 1000, `Failed to initialize shard`);
                this._enterState(GatewayShardState.DISCONNECTED);
            }
            return error;
        });

        if (result !== true) throw result;
    }

    /**
     * Reconnect the shard.
     * @param resume If the shard should be resumed.
     */
    private _reconnect (resume: boolean): void {
        if (this._spinning) return;

        this._log(`Reconnecting...`, {
            level: `INFO`, system: this.system
        });

        if (resume) {
            this.restart()
                .then(() => this._log(`Reconnected`, {
                    level: `INFO`, system: this.system
                }))
                .catch((error) => this._log(`Error reconnecting (restarting): ${(error?.message ?? error) ?? `Unknown reason`}`, {
                    level: `ERROR`, system: this.system
                }));
        } else {
            this.spawn()
                .then(() => this._log(`Reconnected`, {
                    level: `INFO`, system: this.system
                }))
                .catch((error) => {
                    this._log(`Error reconnecting (spawning): ${(error?.message ?? error) ?? `Unknown reason`}`, {
                        level: `ERROR`, system: this.system
                    });
                });
        }
    }

    /**
     * Send data to the gateway.
     * @param data The data to send.
     * @param op The opcode in the payload (non-consequential, only used for logging).
     */
    private async _send (data: string, op: DiscordTypes.GatewayOpcodes): Promise<void> {
        if (typeof data !== `string`) throw new TypeError(`Parameter "data" (string) not provided: got ${data} (${typeof data})`);

        return await new Promise((resolve, reject) => {
            if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
                reject(new DistypeError(`Cannot send data when the socket is not in an OPEN state`, DistypeErrorType.GATEWAY_SHARD_SEND_WITHOUT_OPEN_SOCKET, this.system));
            } else {
                this.ws.send(data, (error) => {
                    if (error) reject(error);
                    else {
                        this._log(`Sent payload (opcode ${op} ${DiscordTypes.GatewayOpcodes[op]})`, {
                            level: `DEBUG`, system: this.system
                        });

                        this.emit(`SENT_PAYLOAD`, data);

                        resolve();
                    }
                });
            }
        });
    }

    /**
     * Parses an incoming payload.
     * @param data The data to parse.
     * @returns The parsed data.
     */
    private _parsePayload (data: RawData): any {
        if (typeof data !== `object` && typeof data !== `function`) return data;

        try {
            if (Array.isArray(data)) data = Buffer.concat(data);
            else if (data instanceof ArrayBuffer) data = Buffer.from(data);

            try {
                return JSON.parse(data.toString());
            } catch {
                if (typeof data.toString === `function`) return data.toString();
                else return data;
            }
        } catch (error: any) {
            this._log(`Payload parsing error: ${(error?.message ?? error) ?? `Unknown reason`}`, {
                level: `WARN`, system: this.system
            });
        }
    }

    /**
     * When the socket emits a close event.
     */
    private wsOnClose (code: number, reason: Buffer): void {
        const parsedReason = this._parsePayload(reason);

        this._log(`Received close code ${code} with reason "${parsedReason}"`, {
            level: `WARN`, system: this.system
        });

        if (DiscordConstants.GATEWAY_CLOSE_CODES.NOT_RECONNECTABLE.includes(code)) {
            this.kill(1000, parsedReason);
        } else {
            this._close(true, 4000, parsedReason);
            this._enterState(GatewayShardState.DISCONNECTED);
            this._reconnect(true);
        }
    }

    /**
     * When the socket emits an error event.
     */
    private wsOnError (error: Error): void {
        this._log((error?.message ?? error) ?? `Unknown reason`, {
            level: `ERROR`, system: this.system
        });
    }

    /**
     * When the socket emits a message event.
     */
    private wsOnMessage (data: RawData): void {
        const payload = this._parsePayload(data) as DiscordTypes.GatewayReceivePayload;

        if (payload.s !== null) this.lastSequence = payload.s;

        switch (payload.op) {
            case DiscordTypes.GatewayOpcodes.Dispatch: {
                switch (payload.t) {
                    case DiscordTypes.GatewayDispatchEvents.Ready: {
                        this.sessionId = payload.d.session_id;

                        this._enterState(GatewayShardState.RUNNING);

                        payload.d.guilds.forEach((guild) => this.guilds.add(guild.id));
                        if ((DiscordConstants.GATEWAY_INTENTS.GUILDS & this.options.intents) === DiscordConstants.GATEWAY_INTENTS.GUILDS) {
                            this._expectedGuilds = new Set(payload.d.guilds.map((guild) => guild.id));
                            this._checkGuildsReady();
                        } else {
                            this._enterState(GatewayShardState.GUILDS_READY);
                        }
                        break;
                    }
                    case DiscordTypes.GatewayDispatchEvents.Resumed: {
                        this._enterState(GatewayShardState.RUNNING);
                        break;
                    }
                    case DiscordTypes.GatewayDispatchEvents.GuildCreate: {
                        this.guilds.add(payload.d.id);
                        if (this.state < GatewayShardState.GUILDS_READY && this._expectedGuilds) {
                            this._expectedGuilds.delete(payload.d.id);
                            this._checkGuildsReady();
                        }
                        break;
                    }
                    case DiscordTypes.GatewayDispatchEvents.GuildDelete: {
                        if (!payload.d.unavailable) {
                            this.guilds.delete(payload.d.id);
                        }
                    }
                }

                this.emit(`RECEIVED_MESSAGE`, payload);

                break;
            }

            case DiscordTypes.GatewayOpcodes.Heartbeat: {
                this._log(`Got heartbeat request`, {
                    level: `DEBUG`, system: this.system
                });

                this._heartbeat(true);

                break;
            }

            case DiscordTypes.GatewayOpcodes.Reconnect: {
                this._close(true, 4000, `Got Reconnect (opcode ${DiscordTypes.GatewayOpcodes.Reconnect})`);
                this._enterState(GatewayShardState.DISCONNECTED);
                this._reconnect(true);

                break;
            }

            case DiscordTypes.GatewayOpcodes.InvalidSession: {
                this._close(!!payload.d, payload.d ? 4000 : 1000, `Got Invalid Session (opcode ${DiscordTypes.GatewayOpcodes.InvalidSession})`);
                this._enterState(GatewayShardState.DISCONNECTED);
                if (!this._spinning) wait(2500).then(() => this._reconnect(!!payload.d));

                break;
            }

            case DiscordTypes.GatewayOpcodes.Hello: {
                this._log(`Got Hello`, {
                    level: `DEBUG`, system: this.system
                });

                const jitterActive = Date.now();
                this._heartbeatJitterActive = jitterActive;
                wait(payload.d.heartbeat_interval * 0.5).then(() => {
                    if (jitterActive === this._heartbeatJitterActive && (this.state === GatewayShardState.IDENTIFYING || this.state === GatewayShardState.RESUMING || this.state === GatewayShardState.RUNNING)) {
                        this._heartbeatJitterActive = null;
                        this._heartbeat();
                        if (this._heartbeatIntervalTimer !== null) clearInterval(this._heartbeatIntervalTimer);
                        this._heartbeatIntervalTimer = setInterval(() => this._heartbeat(), payload.d.heartbeat_interval).unref();
                    }
                });

                if (this.state === GatewayShardState.RESUMING && this.canResume) {
                    this._send(JSON.stringify({
                        op: DiscordTypes.GatewayOpcodes.Resume,
                        d: {
                            seq: this.lastSequence,
                            session_id: this.sessionId,
                            token: this._token
                        }
                    } as DiscordTypes.GatewayResume), DiscordTypes.GatewayOpcodes.Resume)
                        .catch(() => {
                            this._close(true, 4000, `Failed to send resume payload`);
                            this._enterState(GatewayShardState.DISCONNECTED);
                        });
                } else {
                    this._send(JSON.stringify({
                        op: DiscordTypes.GatewayOpcodes.Identify,
                        d: {
                            intents: this.options.intents,
                            large_threshold: this.options.largeGuildThreshold,
                            presence: this.options.presence ?? undefined,
                            properties: {
                                browser: `distype`,
                                device: `distype`,
                                os: process.platform
                            },
                            shard: [this.id, this.numShards],
                            token: this._token
                        }
                    } as DiscordTypes.GatewayIdentify), DiscordTypes.GatewayOpcodes.Identify)
                        .catch(() => {
                            this._close(false, 1000, `Failed to send identify payload`);
                            this._enterState(GatewayShardState.DISCONNECTED);
                        });
                }

                break;
            }

            case DiscordTypes.GatewayOpcodes.HeartbeatAck: {
                if (this._heartbeatWaitingSince !== null) {
                    this.ping = Date.now() - this._heartbeatWaitingSince;
                    this._heartbeatWaitingSince = null;
                }

                this._log(`Heartbeat ACK (Ping at ${this.ping}ms)`, {
                    level: `DEBUG`, system: this.system
                });

                break;
            }

            default: {
                break;
            }
        }
    }
}
