"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gateway = void 0;
const GatewayShard_1 = require("./GatewayShard");
const Cache_1 = require("../cache/Cache");
const DiscordConstants_1 = require("../constants/DiscordConstants");
const DistypeError_1 = require("../errors/DistypeError");
const Rest_1 = require("../rest/Rest");
const node_utils_1 = require("@br88c/node-utils");
const DiscordTypes = __importStar(require("discord-api-types/v10"));
const url_1 = require("url");
/**
 * The gateway manager.
 * Manages {@link GatewayShard shards}, handles incoming payloads, and sends commands to the Discord gateway.
 *
 * All events are emitted with their entire payload; [Discord API Reference](https://discord.com/developers/docs/topics/gateway#payloads-gateway-payload-structure).
 * Dispatched events are emitted under the {@link GatewayEvents `*`} event prior to being passed through the cache event handler.
 * After being handled by the {@link Cache cache manager}, they are emitted again under their individual event name (example: `GUILD_CREATE`).
 */
class Gateway extends node_utils_1.TypedEmitter {
    /**
     * {@link GatewayShard Gateway shards}.
     * Modifying this map externally may result in unexpected behavior.
     */
    shards = new node_utils_1.ExtendedMap();
    /**
     * The latest self user received from the gateway.
     */
    user = null;
    /**
     * {@link GatewayOptions Options} for the gateway manager.
     * Note that any options not specified are set to a default value.x
     */
    options;
    /**
     * The system string used for emitting {@link DistypeError errors} and for the {@link LogCallback log callback}.
     */
    system = `Gateway`;
    /**
     * The {@link Cache cache manager} to update from incoming events.
     */
    _cache;
    /**
     * The {@link LogCallback log callback} used by the gateway manager.
     */
    _log;
    /**
     * A value to use as `this` in the `this#_log`.
     */
    _logThisArg;
    /**
     * An increment used for creating unique nonce values for [request guild member](https://discord.com/developers/docs/topics/gateway#request-guild-members) payloads.
     */
    _requestGuildMembersNonceIncrement = 0;
    /**
     * The {@link Rest rest manager} to use for fetching gateway endpoints.
     */
    _rest;
    /**
     * Stored calculated sharding options.
     */
    _storedCalculatedShards = null;
    /**
     * Stored response from `Rest#getGatewayBot()`.
     */
    _storedGetGatewayBot = null;
    /**
     * The bot's token.
     */
    // @ts-expect-error Property '_token' has no initializer and is not definitely assigned in the constructor.
    _token;
    /**
     * Create a gateway manager.
     * @param token The bot's token.
     * @param rest The {@link Rest rest manager} to use for fetching gateway endpoints.
     * @param cache The {@link Cache cache} to update from incoming events. If `false` is specified, {@link GatewayEvents gateway events} will not be passed to a cache event handler.
     * @param options {@link GatewayOptions Gateway options}.
     * @param logCallback A {@link LogCallback callback} to be used for logging events internally in the gateway manager.
     * @param logThisArg A value to use as `this` in the `logCallback`.
     */
    constructor(token, rest, cache, options = {}, logCallback = () => { }, logThisArg) {
        super();
        if (typeof token !== `string`)
            throw new TypeError(`Parameter "token" (string) not provided: got ${token} (${typeof token})`);
        if (!(rest instanceof Rest_1.Rest))
            throw new TypeError(`Parameter "rest" (Rest) not provided: got ${rest} (${typeof rest})`);
        if (!(cache instanceof Cache_1.Cache) && cache !== false)
            throw new TypeError(`Parameter "cache" (Cache | false) not provided: got ${cache} (${typeof cache})`);
        if (typeof options !== `object`)
            throw new TypeError(`Parameter "options" (object) type mismatch: got ${options} (${typeof options})`);
        if (typeof logCallback !== `function`)
            throw new TypeError(`Parameter "logCallback" (function) type mismatch: got ${logCallback} (${typeof logCallback})`);
        Object.defineProperty(this, `_token`, {
            configurable: false,
            enumerable: false,
            value: token,
            writable: false
        });
        this._rest = rest;
        if (cache)
            this._cache = cache;
        this.options = {
            customGatewaySocketURL: options.customGatewaySocketURL ?? null,
            customGetGatewayBotURL: options.customGetGatewayBotURL ?? null,
            disableBucketRatelimits: options.disableBucketRatelimits ?? false,
            intents: this._intentsFactory(options.intents),
            largeGuildThreshold: options.largeGuildThreshold ?? 50,
            presence: options.presence ?? null,
            sharding: options.sharding ?? {},
            spawnAttemptDelay: options.spawnAttemptDelay ?? 2500,
            spawnMaxAttempts: options.spawnMaxAttempts ?? 10,
            spawnTimeout: options.spawnTimeout ?? 30000,
            version: options.version ?? 10,
            wsOptions: options.wsOptions ?? {}
        };
        this.on(`*`, (payload) => {
            if (this._cache)
                this._cache.handleEvent(payload);
            if (payload.t === `READY`)
                this.user = payload.d.user;
            if (payload.t === `USER_UPDATE` && payload.d.id === this.user?.id)
                this.user = payload.d;
            this.emit(payload.t, payload);
        });
        this._log = logCallback.bind(logThisArg);
        this._logThisArg = logThisArg;
        this._log(`Initialized gateway manager`, {
            level: `DEBUG`, system: this.system
        });
    }
    /**
     * If all shards are in a {@link GatewayShardState READY} state.
     */
    get shardsRunning() {
        return this.shards.size > 0 && this.shards.every((shard) => shard.state === GatewayShard_1.GatewayShardState.RUNNING);
    }
    /**
     * Connect to the gateway.
     * @param gatewayBot A pre-fetched `GET` `/gateway/bot`. Not required, as this method will fetch it if not specified.
     * @returns The results from {@link GatewayShard shard} spawns.
     */
    async connect(gatewayBot) {
        if (this.shardsRunning)
            throw new DistypeError_1.DistypeError(`Shards are already connected`, DistypeError_1.DistypeErrorType.GATEWAY_ALREADY_CONNECTED, this.system);
        this._log(`Starting connection process`, {
            level: `DEBUG`, system: this.system
        });
        if (gatewayBot)
            this._storedGetGatewayBot = gatewayBot;
        else {
            const customGetGatewayBotURL = this.options.customGetGatewayBotURL ? new url_1.URL(this.options.customGetGatewayBotURL) : undefined;
            this._storedGetGatewayBot = customGetGatewayBotURL ? await this._rest.request(`GET`, customGetGatewayBotURL.pathname, {
                customBaseURL: customGetGatewayBotURL.origin,
                query: Object.fromEntries(customGetGatewayBotURL.searchParams.entries())
            }) : await this._rest.getGatewayBot();
        }
        if (!this._storedGetGatewayBot?.session_start_limit || typeof this._storedGetGatewayBot?.shards !== `number` || (!this.options.customGatewaySocketURL && typeof this._storedGetGatewayBot.url !== `string`))
            throw new DistypeError_1.DistypeError(`Invalid gateway bot response`, DistypeError_1.DistypeErrorType.GATEWAY_INVALID_REST_RESPONSE, this.system);
        const totalBotShards = this.options.sharding.totalBotShards === `auto` ? this._storedGetGatewayBot.shards : (this.options.sharding.totalBotShards ?? this._storedGetGatewayBot.shards);
        this._storedCalculatedShards = {
            totalBotShards,
            shards: this.options.sharding.shards ?? totalBotShards,
            offset: this.options.sharding.offset ?? 0
        };
        if (this._storedCalculatedShards.totalBotShards < this._storedCalculatedShards.shards
            || this._storedCalculatedShards.totalBotShards <= this._storedCalculatedShards.offset
            || this._storedCalculatedShards.totalBotShards < (this._storedCalculatedShards.shards + this._storedCalculatedShards.offset))
            throw new DistypeError_1.DistypeError(`Invalid shard configuration, got ${this._storedCalculatedShards.totalBotShards} total shards, with ${this._storedCalculatedShards.shards} to be spawned with an offset of ${this._storedCalculatedShards.offset}`, DistypeError_1.DistypeErrorType.GATEWAY_INVALID_SHARD_CONFIG, this.system);
        if (this._storedCalculatedShards.shards > this._storedGetGatewayBot.session_start_limit.remaining) {
            throw new DistypeError_1.DistypeError(`Session start limit reached; tried to spawn ${this._storedCalculatedShards.shards} shards when only ${this._storedGetGatewayBot.session_start_limit.remaining} more shards are allowed. Limit will reset in ${this._storedGetGatewayBot.session_start_limit.reset_after / 1000} seconds`, DistypeError_1.DistypeErrorType.GATEWAY_SESSION_START_LIMIT_REACHED, this.system);
        }
        this._log(`Spawning ${this._storedCalculatedShards.shards} shards`, {
            level: `INFO`, system: this.system
        });
        const buckets = new node_utils_1.ExtendedMap();
        for (let i = 0; i < this._storedCalculatedShards.shards; i++) {
            let shard = null;
            if (i >= this._storedCalculatedShards.offset) {
                shard = new GatewayShard_1.GatewayShard(this._token, i, this._storedCalculatedShards.totalBotShards, new url_1.URL(`?${new url_1.URLSearchParams({
                    v: `${this.options.version}`, encoding: `json`
                }).toString()}`, this.options.customGatewaySocketURL ?? this._storedGetGatewayBot.url).toString(), this.options, this._log, this._logThisArg);
                this.shards.set(i, shard);
                shard.on(`RECEIVED_MESSAGE`, (message) => this.emit(`*`, message));
                shard.on(`SENT_PAYLOAD`, (payload) => this.emit(`SENT_PAYLOAD`, payload));
                shard.on(`IDLE`, () => this.emit(`SHARD_IDLE`, shard));
                shard.on(`CONNECTING`, () => this.emit(`SHARD_CONNECTING`, shard));
                shard.on(`IDENTIFYING`, () => this.emit(`SHARD_IDENTIFYING`, shard));
                shard.on(`RESUMING`, () => this.emit(`SHARD_RESUMING`, shard));
                shard.on(`RUNNING`, () => this.emit(`SHARD_RUNNING`, shard));
                shard.on(`DISCONNECTED`, () => this.emit(`SHARD_DISCONNECTED`, shard));
            }
            const bucketId = i % this._storedGetGatewayBot.session_start_limit.max_concurrency;
            if (buckets.has(bucketId))
                buckets.get(bucketId)?.set(i, shard);
            else
                buckets.set(bucketId, new node_utils_1.ExtendedMap()).get(bucketId).set(i, shard);
        }
        const results = [];
        const mostShards = Math.max(...buckets.map((bucket) => bucket.size));
        for (let i = 0; i < mostShards; i++) {
            this._log(`Starting spawn process for shard rate limit key ${i}`, {
                level: `DEBUG`, system: this.system
            });
            const bucketResult = await Promise.allSettled(buckets.filter((bucket) => bucket.get(i) instanceof GatewayShard_1.GatewayShard).map((bucket) => bucket.get(i).spawn()));
            results.push(...bucketResult);
            if (i !== buckets.size - 1 && !this.options.disableBucketRatelimits)
                await (0, node_utils_1.wait)(DiscordConstants_1.DiscordConstants.GATEWAY_SHARD_SPAWN_COOLDOWN);
        }
        const success = results.filter((result) => result.status === `fulfilled`).length;
        const failed = this._storedCalculatedShards.shards - success;
        this.emit(`SHARDS_READY`, success, failed);
        this._log(`${success}/${success + failed} shards spawned`, {
            level: `INFO`, system: this.system
        });
        if (failed > 0)
            this._log(`${failed} shards failed to spawn`, {
                level: `WARN`, system: this.system
            });
        this._log(`Connected to Discord${this.user ? ` as ${this.user.username}#${this.user.discriminator}` : ``}`, {
            level: `INFO`, system: this.system
        });
        return results;
    }
    /**
     * Get a guild's shard.
     * @param guildId The guild's ID.
     * @param ensure If true, an error is thrown if a {@link GatewayShard} is not found.
     * @returns The guild's shard, or a shard ID if the shard is not in this manager.
     * @see [Discord API Reference]
     */
    guildShard(guildId, ensure) {
        const shardId = this._guildShard(guildId, this._storedCalculatedShards?.totalBotShards ?? this._storedGetGatewayBot.shards);
        const shard = this.shards.get(shardId);
        if (ensure && !(shard instanceof GatewayShard_1.GatewayShard))
            throw new DistypeError_1.DistypeError(`No shard with the specified guild ID found on this gateway manager`, DistypeError_1.DistypeErrorType.GATEWAY_NO_SHARD, this.system);
        return (shard ?? shardId);
    }
    /**
     * Get members from a guild.
     * @param guildId The ID of the guild to get members from.
     * @param options Guild member request options.
     * @returns Received members, presences, and missing members.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#request-guild-members)
     */
    getGuildMembers(guildId, options = {}) {
        if (options.query && options.user_ids)
            throw new TypeError(`Cannot have both query and user_ids defined in a request guild members payload`);
        if (options.nonce && Buffer.byteLength(options.nonce, `utf-8`) > DiscordConstants_1.DiscordConstants.GATEWAY_MAX_REQUEST_GUILD_MEMBERS_NONCE_LENGTH)
            throw new DistypeError_1.DistypeError(`nonce length is greater than the allowed ${DiscordConstants_1.DiscordConstants.GATEWAY_MAX_REQUEST_GUILD_MEMBERS_NONCE_LENGTH} bytes`, DistypeError_1.DistypeErrorType.GATEWAY_MEMBER_NONCE_TOO_BIG, this.system);
        const shard = this.guildShard(guildId, true);
        const nonce = options.nonce ?? `${BigInt(this._requestGuildMembersNonceIncrement) % (10n ** BigInt(DiscordConstants_1.DiscordConstants.GATEWAY_MAX_REQUEST_GUILD_MEMBERS_NONCE_LENGTH))}`;
        this._requestGuildMembersNonceIncrement++;
        const members = new node_utils_1.ExtendedMap();
        const presences = new node_utils_1.ExtendedMap();
        const notFound = [];
        return new Promise((resolve, reject) => {
            const listener = (data) => {
                if (data.d.nonce !== nonce || data.d.guild_id !== guildId)
                    return;
                data.d.members.filter((member) => member.user).forEach((member) => members.set(member.user.id, member));
                data.d.presences?.forEach((presence) => presences.set(presence.user.id, presence));
                notFound.push(...(data.d.not_found ?? []));
                if (data.d.chunk_index === (data.d.chunk_count ?? 1) - 1) {
                    this.removeListener(`GUILD_MEMBERS_CHUNK`, listener);
                    resolve({
                        members,
                        presences: presences.size > 0 ? presences : undefined,
                        notFound: notFound.length > 0 ? notFound : undefined
                    });
                }
            };
            this.on(`GUILD_MEMBERS_CHUNK`, listener);
            shard.send({
                op: DiscordTypes.GatewayOpcodes.RequestGuildMembers,
                d: {
                    guild_id: guildId,
                    query: !options.query && !options.user_ids ? `` : options.query,
                    limit: options.limit ?? 0,
                    presences: (this.options.intents & DiscordConstants_1.DiscordConstants.GATEWAY_INTENTS.GUILD_PRESENCES) !== 0,
                    user_ids: options.user_ids,
                    nonce
                }
            }).catch(reject);
        });
    }
    /**
     * Update the bot's voice state.
     * @param guildId The guild to set the voice state in.
     * @param channelId The channel to join. `null`disconnects the bot.
     * @param mute If the bot should self mute.
     * @param deafen If the bot should self deafen.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#update-voice-state)
     */
    async updateVoiceState(guildId, channelId, mute = false, deafen = false) {
        return await this.guildShard(guildId, true).send({
            op: DiscordTypes.GatewayOpcodes.VoiceStateUpdate,
            d: {
                guild_id: guildId,
                channel_id: channelId,
                self_mute: mute,
                self_deaf: deafen
            }
        });
    }
    /**
     * Update the bot's presence.
     * @param presence Presence data.
     * @param shard A shard or shards to set the presence on. A number will set the presence on a single shard with a matching ID, a number array will set the presence on all shards matching am ID in the array, and `all` will set the presence on all shards.
     */
    async updatePresence(presence, shard = `all`) {
        const shards = typeof shard === `number` ? [this.shards.get(shard)] : ((shard instanceof Array) ? this.shards.filter((s) => shard.some((sh) => sh === s.id)) : this.shards).map((s) => s);
        await Promise.all(shards.map((s) => s?.send({
            op: DiscordTypes.GatewayOpcodes.PresenceUpdate,
            d: presence
        })));
    }
    /**
     * Get a guild's shard ID.
     * @param guildId The guild's ID.
     * @param numShards The `numShards` value sent in the identify payload.
     * @returns A shard ID.
     */
    _guildShard(guildId, numShards) {
        return Number((BigInt(guildId) >> 22n) % BigInt(numShards));
    }
    /**
     * Creates intents flags from intents specified in the constructor.
     * @param specified The specified intents.
     * @returns Intents flags.
     */
    _intentsFactory(specified) {
        if (typeof specified === `number`)
            return specified;
        else if (typeof specified === `bigint`)
            return Number(specified);
        else if (specified instanceof Array)
            return specified.reduce((p, c) => p | DiscordConstants_1.DiscordConstants.GATEWAY_INTENTS[c], 0);
        else if (specified === `all`)
            return Object.values(DiscordConstants_1.DiscordConstants.GATEWAY_INTENTS).reduce((p, c) => p | c, 0);
        else
            return Object.values(DiscordConstants_1.DiscordConstants.GATEWAY_PRIVILEGED_INTENTS).reduce((p, c) => p & ~c, Object.values(DiscordConstants_1.DiscordConstants.GATEWAY_INTENTS).reduce((p, c) => p | c, 0));
    }
}
exports.Gateway = Gateway;
