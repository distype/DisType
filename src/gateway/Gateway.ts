import { Cache } from '../cache/Cache';
import { DiscordConstants } from '../utils/DiscordConstants';
import { GatewayOptions } from './GatewayOptions';
import { GatewayShard } from './GatewayShard';
import { Rest } from '../rest/Rest';
import { TypedEmitter } from '../utils/TypedEmitter';

import Collection from '@discordjs/collection';
import * as DiscordTypes from 'discord-api-types/v9';
import { URL, URLSearchParams } from 'url';

/**
 * Gateway events.
 * Note that with the exception of `SHARDS_READY`, all events are a relay of a `GatewayShard` event emit (For example, `READY` signifies a single shard receiving a `READY` dispatch).
 * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#commands-and-events-gateway-events)
 */
export interface GatewayEvents {
    /**
     * When all shards are spawned and ready.
     */
    SHARDS_READY: null

    /**
     * When a payload is sent. Data is the sent payload.
     */
    SENT: string
    /**
     * When a shard enters a disconnected state.
     */
    SHARD_STATE_DISCONNECTED: GatewayShard
    /**
     * When a shard enters a connecting state.
     */
    SHARD_STATE_CONNECTING: GatewayShard
    /**
     * When a shard enters a resuming state.
     */
    SHARD_STATE_RESUMING: GatewayShard
    /**
     * When a shard enters a connected state.
     */
    SHARD_STATE_CONNECTED: GatewayShard

    '*': DiscordTypes.GatewayDispatchPayload // eslint-disable-line quotes
    DEBUG: string
    READY: DiscordTypes.GatewayReadyDispatch
    RESUMED: DiscordTypes.GatewayResumedDispatch
    CHANNEL_CREATE: DiscordTypes.GatewayChannelCreateDispatch
    CHANNEL_UPDATE: DiscordTypes.GatewayChannelUpdateDispatch
    CHANNEL_DELETE: DiscordTypes.GatewayChannelDeleteDispatch
    CHANNEL_PINS_UPDATE: DiscordTypes.GatewayChannelPinsUpdateDispatch
    THREAD_CREATE: DiscordTypes.GatewayThreadCreateDispatch
    THREAD_UPDATE: DiscordTypes.GatewayThreadUpdateDispatch
    THREAD_DELETE: DiscordTypes.GatewayThreadDeleteDispatch
    THREAD_LIST_SYNC: DiscordTypes.GatewayThreadListSyncDispatch
    THREAD_MEMBER_UPDATE: DiscordTypes.GatewayThreadMemberUpdateDispatch
    THREAD_MEMBERS_UPDATE: DiscordTypes.GatewayThreadMembersUpdateDispatch
    GUILD_CREATE: DiscordTypes.GatewayGuildCreateDispatch
    GUILD_UPDATE: DiscordTypes.GatewayGuildUpdateDispatch
    GUILD_DELETE: DiscordTypes.GatewayGuildDeleteDispatch
    GUILD_BAN_ADD: DiscordTypes.GatewayGuildBanAddDispatch
    GUILD_BAN_REMOVE: DiscordTypes.GatewayGuildBanRemoveDispatch
    GUILD_EMOJIS_UPDATE: DiscordTypes.GatewayGuildEmojisUpdateDispatch
    GUILD_STICKERS_UPDATE: DiscordTypes.GatewayGuildStickersUpdateDispatch
    GUILD_INTEGRATIONS_UPDATE: DiscordTypes.GatewayGuildIntegrationsUpdateDispatch
    GUILD_MEMBER_ADD: DiscordTypes.GatewayGuildMemberAddDispatch
    GUILD_MEMBER_REMOVE: DiscordTypes.GatewayGuildMemberRemoveDispatch
    GUILD_MEMBER_UPDATE: DiscordTypes.GatewayGuildMemberUpdateDispatch
    GUILD_MEMBERS_CHUNK: DiscordTypes.GatewayGuildMembersChunkDispatch
    GUILD_ROLE_CREATE: DiscordTypes.GatewayGuildRoleCreateDispatch
    GUILD_ROLE_UPDATE: DiscordTypes.GatewayGuildRoleUpdateDispatch
    GUILD_ROLE_DELETE: DiscordTypes.GatewayGuildRoleDeleteDispatch
    GUILD_SCHEDULED_EVENT_CREATE: DiscordTypes.GatewayGuildScheduledEventCreateDispatch
    GUILD_SCHEDULED_EVENT_UPDATE: DiscordTypes.GatewayGuildScheduledEventUpdateDispatch
    GUILD_SCHEDULED_EVENT_DELETE: DiscordTypes.GatewayGuildScheduledEventDeleteDispatch
    GUILD_SCHEDULED_EVENT_USER_ADD: DiscordTypes.GatewayGuildScheduledEventUserAddDispatch
    GUILD_SCHEDULED_EVENT_USER_REMOVE: DiscordTypes.GatewayGuildScheduledEventUserRemoveDispatch
    INTEGRATION_CREATE: DiscordTypes.GatewayIntegrationCreateDispatch
    INTEGRATION_UPDATE: DiscordTypes.GatewayIntegrationUpdateDispatch
    INTEGRATION_DELETE: DiscordTypes.GatewayIntegrationDeleteDispatch
    INTERACTION_CREATE: DiscordTypes.GatewayInteractionCreateDispatch
    INVITE_CREATE: DiscordTypes.GatewayInviteCreateDispatch
    INVITE_DELETE: DiscordTypes.GatewayInviteDeleteDispatch
    MESSAGE_CREATE: DiscordTypes.GatewayMessageCreateDispatch
    MESSAGE_UPDATE: DiscordTypes.GatewayMessageUpdateDispatch
    MESSAGE_DELETE: DiscordTypes.GatewayMessageDeleteDispatch
    MESSAGE_DELETE_BULK: DiscordTypes.GatewayMessageDeleteBulkDispatch
    MESSAGE_REACTION_ADD: DiscordTypes.GatewayMessageReactionAddDispatch
    MESSAGE_REACTION_REMOVE: DiscordTypes.GatewayMessageReactionRemoveDispatch
    MESSAGE_REACTION_REMOVE_ALL: DiscordTypes.GatewayMessageReactionRemoveAllDispatch
    MESSAGE_REACTION_REMOVE_EMOJI: DiscordTypes.GatewayMessageReactionRemoveEmojiDispatch
    PRESENCE_UPDATE: DiscordTypes.GatewayPresenceUpdateDispatch
    STAGE_INSTANCE_CREATE: DiscordTypes.GatewayStageInstanceCreateDispatch
    STAGE_INSTANCE_DELETE: DiscordTypes.GatewayStageInstanceDeleteDispatch
    STAGE_INSTANCE_UPDATE: DiscordTypes.GatewayStageInstanceUpdateDispatch
    TYPING_START: DiscordTypes.GatewayTypingStartDispatch
    USER_UPDATE: DiscordTypes.GatewayUserUpdateDispatch
    VOICE_STATE_UPDATE: DiscordTypes.GatewayVoiceStateUpdateDispatch
    VOICE_SERVER_UPDATE: DiscordTypes.GatewayVoiceServerUpdateDispatch
    WEBHOOKS_UPDATE: DiscordTypes.GatewayWebhooksUpdateDispatch
}

/**
 * The gateway manager.
 * Manages shards, handles incoming payloads, and sends commands to the Discord gateway.
 *
 * All events are emitted with their entire payload; [Discord API Reference](https://discord.com/developers/docs/topics/gateway#payloads-gateway-payload-structure).
 * Dispatched events are emitted under the `*` event prior to being passed through the cache manager handler.
 * After being handled by the cache manager, they are emitted again under their individual event name (example: `GUILD_CREATE`).
 */
export class Gateway extends TypedEmitter<GatewayEvents> {
    /**
     * Gateway shards.
     * Modifying this collection externally may result in unexpected behavior.
     */
    public shards: Collection<number, GatewayShard> = new Collection();

    /**
     * Options for the gateway manager.
     * Note that if you are using a `Client` or `ClientWorker` / `ClientMaster` and not manually creating a `Gateway` separately, these options may differ than the options specified when creating the client due to them being passed through the options factory.
     */
    // @ts-expect-error Property 'options' has no initializer and is not definitely assigned in the constructor.
    public readonly options: GatewayOptions;

    /**
     * The cache manager to update from incoming events.
     */
    private _cache?: Cache;
    /**
     * The rest manager to use for fetching gateway endpoints.
     */
    private _rest: Rest;

    /**
     * The bot's token.
     */
    // @ts-expect-error Property '_token' has no initializer and is not definitely assigned in the constructor.
    private readonly _token: string;

    /**
     * Create a gateway manager.
     * @param token The bot's token.
     * @param cache The cache manager to update from incoming events. If `false` is specified, gateway events will not be passed to a cache handler.
     * @param rest The rest manager to use for fetching gateway endpoints.
     * @param options Gateway options.
     */
    constructor(token: string, cache: Cache | false, rest: Rest, options: GatewayOptions) {
        super();

        if (typeof token !== `string`) throw new TypeError(`A bot token must be specified`);
        if (!(cache instanceof Cache)) throw new TypeError(`A cache manager must be specified`);
        if (!(rest instanceof Rest)) throw new TypeError(`A rest manager must be specified`);

        Object.defineProperty(this, `_token`, {
            configurable: false,
            enumerable: false,
            value: token as Gateway[`_token`],
            writable: false
        });
        Object.defineProperty(this, `options`, {
            configurable: false,
            enumerable: true,
            value: Object.freeze(options) as Gateway[`options`],
            writable: false
        });

        if (cache) this._cache = cache;
        this._rest = rest;

        this.on(`*`, (data) => {
            if (this._cache) this._cache.options.cacheEventHandler(this._cache, data);
            this.emit(data.t, data as any);
        });
    }

    /**
     * Connect to the gateway.
     * @returns The results from shard spawns.
     */
    public async connect(): Promise<Array<PromiseSettledResult<DiscordTypes.GatewayReadyDispatch>>> {
        this.emit(`DEBUG`, `Starting connection process`);

        const gatewayBot = await this._rest.getGatewayBot();
        this.emit(`DEBUG`, `Got bot gateway information`);

        this.options.sharding.totalBotShards = this.options.sharding.totalBotShards === `auto` ? gatewayBot.shards : (this.options.sharding.totalBotShards ?? gatewayBot.shards);
        this.options.sharding.shards = this.options.sharding.shards ?? this.options.sharding.totalBotShards;
        this.options.sharding.offset = this.options.sharding.offset ?? 0;

        if (this.options.sharding.shards > gatewayBot.session_start_limit.remaining) {
            const error = new Error(`Session start limit reached; tried to spawn ${this.options.sharding.shards} shards when only ${gatewayBot.session_start_limit.remaining} more shards are allowed. Limit will reset in ${gatewayBot.session_start_limit.reset_after / 1000} seconds`);
            this.emit(`DEBUG`, `Unable to connect shards: ${error.name} | ${error.message}`);
            throw error;
        }

        const buckets: Collection<number, Collection<number, GatewayShard>> = new Collection();
        for (let i = 0; i < this.options.sharding.shards; i++) {
            this.emit(`DEBUG`, `Creating shard ${i}`);
            const shard = new GatewayShard(this._token, i, this.options.sharding.totalBotShards, new URL(`?${new URLSearchParams({
                v: `${this.options.version}`, encoding: `json`
            } as DiscordTypes.GatewayURLQuery as any).toString()}`, gatewayBot.url).toString(), this.options);
            this.shards.set(i, shard);
            this.emit(`DEBUG`, `Shard ${shard.id} created and pushed to Gateway#shards`);

            shard.on(`*`, (data) => this.emit(`*`, data as any));
            shard.on(`DEBUG`, (msg) => this.emit(`DEBUG`, `GatewayShard ${shard.id} | ${msg}`));
            shard.on(`SENT`, (payload) => this.emit(`SENT`, payload));
            shard.on(`STATE_DISCONNECTED`, () => this.emit(`SHARD_STATE_DISCONNECTED`, shard));
            shard.on(`STATE_CONNECTING`, () => this.emit(`SHARD_STATE_CONNECTING`, shard));
            shard.on(`STATE_RESUMING`, () => this.emit(`SHARD_STATE_RESUMING`, shard));
            shard.on(`STATE_CONNECTED`, () => this.emit(`SHARD_STATE_CONNECTED`, shard));
            this.emit(`DEBUG`, `Bound shard ${shard.id} events`);

            const bucketId = shard.id % gatewayBot.session_start_limit.max_concurrency;
            if (buckets.has(bucketId)) buckets.get(bucketId)?.set(shard.id, shard);
            else buckets.set(bucketId, new Collection()).get(bucketId)!.set(shard.id, shard);
            this.emit(`DEBUG`, `Pushed shard ${shard.id} to bucket ${bucketId}`);
        }

        const results: Array<PromiseSettledResult<DiscordTypes.GatewayReadyDispatch>> = [];
        for (let i = 0; i < buckets.size; i++) {
            this.emit(`DEBUG`, `Starting spawn process for shard ratelimit key ${i}`);
            const bucketResult = await Promise.allSettled(buckets.filter((bucket) => bucket.get(i) instanceof GatewayShard).map((bucket) => bucket.get(i)!.spawn()));
            results.push(...bucketResult);
            this.emit(`DEBUG`, `Finished spawn process for shard ratelimit key ${i}`);
            if (i !== buckets.size - 1) await new Promise((resolve) => setTimeout(() => resolve(void 0), DiscordConstants.SHARD_SPAWN_COOLDOWN));
        }

        this.emit(`SHARDS_READY`, null);
        this.emit(`DEBUG`, `Finished connection process`);
        return results;
    }
}
