import { GatewayOptions } from './GatewayOptions';
import { GatewayShard } from './GatewayShard';
import { Cache } from '../cache/Cache';
import { Rest } from '../rest/Rest';
import { LogCallback } from '../types/Log';
import { ExtendedMap, TypedEmitter } from '@br88c/node-utils';
import * as DiscordTypes from 'discord-api-types/v10';
import { Snowflake } from 'discord-api-types/v10';
/**
 * {@link Gateway} events.
 * Note that with the exception of `SHARDS_READY`, all events are a relay of a {@link GatewayShard gateway shard}'s event emit (For example, `READY` signifies a single shard receiving a `READY` dispatch).
 * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#commands-and-events-gateway-events)
 */
export interface GatewayEvents extends Record<string, (...args: any[]) => void> {
    /**
     * When all {@link GatewayShard shards} are spawned and ready.
     */
    SHARDS_READY: (success: number, failed: number) => void;
    /**
     * When a payload is sent.
     */
    SENT_PAYLOAD: (payload: string) => void;
    /**
     * When a {@link GatewayShard shard} enters an {@link GatewayShardState idle state}.
     */
    SHARD_IDLE: (shard: GatewayShard) => void;
    /**
     * When a {@link GatewayShard shard} enters a {@link GatewayShardState connecting state}.
     */
    SHARD_CONNECTING: (shard: GatewayShard) => void;
    /**
     * When a {@link GatewayShard shard} enters an {@link GatewayShardState identifying state}.
     */
    SHARD_IDENTIFYING: (shard: GatewayShard) => void;
    /**
     * When a {@link GatewayShard shard} enters a {@link GatewayShardState resuming state}.
     */
    SHARD_RESUMING: (shard: GatewayShard) => void;
    /**
     * When a {@link GatewayShard shard} enters a {@link GatewayShardState running state}.
     */
    SHARD_RUNNING: (shard: GatewayShard) => void;
    /**
     * When a {@link GatewayShard shard} enters a {@link GatewayShardState disconnected state}.
     */
    SHARD_DISCONNECTED: (shard: GatewayShard) => void;
    '*': (shard: DiscordTypes.GatewayDispatchPayload) => void;
    READY: (shard: DiscordTypes.GatewayReadyDispatch) => void;
    RESUMED: (shard: DiscordTypes.GatewayResumedDispatch) => void;
    CHANNEL_CREATE: (shard: DiscordTypes.GatewayChannelCreateDispatch) => void;
    CHANNEL_UPDATE: (shard: DiscordTypes.GatewayChannelUpdateDispatch) => void;
    CHANNEL_DELETE: (shard: DiscordTypes.GatewayChannelDeleteDispatch) => void;
    CHANNEL_PINS_UPDATE: (shard: DiscordTypes.GatewayChannelPinsUpdateDispatch) => void;
    THREAD_CREATE: (shard: DiscordTypes.GatewayThreadCreateDispatch) => void;
    THREAD_UPDATE: (shard: DiscordTypes.GatewayThreadUpdateDispatch) => void;
    THREAD_DELETE: (shard: DiscordTypes.GatewayThreadDeleteDispatch) => void;
    THREAD_LIST_SYNC: (shard: DiscordTypes.GatewayThreadListSyncDispatch) => void;
    THREAD_MEMBER_UPDATE: (shard: DiscordTypes.GatewayThreadMemberUpdateDispatch) => void;
    THREAD_MEMBERS_UPDATE: (shard: DiscordTypes.GatewayThreadMembersUpdateDispatch) => void;
    GUILD_CREATE: (shard: DiscordTypes.GatewayGuildCreateDispatch) => void;
    GUILD_UPDATE: (shard: DiscordTypes.GatewayGuildUpdateDispatch) => void;
    GUILD_DELETE: (shard: DiscordTypes.GatewayGuildDeleteDispatch) => void;
    GUILD_BAN_ADD: (shard: DiscordTypes.GatewayGuildBanAddDispatch) => void;
    GUILD_BAN_REMOVE: (shard: DiscordTypes.GatewayGuildBanRemoveDispatch) => void;
    GUILD_EMOJIS_UPDATE: (shard: DiscordTypes.GatewayGuildEmojisUpdateDispatch) => void;
    GUILD_STICKERS_UPDATE: (shard: DiscordTypes.GatewayGuildStickersUpdateDispatch) => void;
    GUILD_INTEGRATIONS_UPDATE: (shard: DiscordTypes.GatewayGuildIntegrationsUpdateDispatch) => void;
    GUILD_MEMBER_ADD: (shard: DiscordTypes.GatewayGuildMemberAddDispatch) => void;
    GUILD_MEMBER_REMOVE: (shard: DiscordTypes.GatewayGuildMemberRemoveDispatch) => void;
    GUILD_MEMBER_UPDATE: (shard: DiscordTypes.GatewayGuildMemberUpdateDispatch) => void;
    GUILD_MEMBERS_CHUNK: (shard: DiscordTypes.GatewayGuildMembersChunkDispatch) => void;
    GUILD_ROLE_CREATE: (shard: DiscordTypes.GatewayGuildRoleCreateDispatch) => void;
    GUILD_ROLE_UPDATE: (shard: DiscordTypes.GatewayGuildRoleUpdateDispatch) => void;
    GUILD_ROLE_DELETE: (shard: DiscordTypes.GatewayGuildRoleDeleteDispatch) => void;
    GUILD_SCHEDULED_EVENT_CREATE: (shard: DiscordTypes.GatewayGuildScheduledEventCreateDispatch) => void;
    GUILD_SCHEDULED_EVENT_UPDATE: (shard: DiscordTypes.GatewayGuildScheduledEventUpdateDispatch) => void;
    GUILD_SCHEDULED_EVENT_DELETE: (shard: DiscordTypes.GatewayGuildScheduledEventDeleteDispatch) => void;
    GUILD_SCHEDULED_EVENT_USER_ADD: (shard: DiscordTypes.GatewayGuildScheduledEventUserAddDispatch) => void;
    GUILD_SCHEDULED_EVENT_USER_REMOVE: (shard: DiscordTypes.GatewayGuildScheduledEventUserRemoveDispatch) => void;
    INTEGRATION_CREATE: (shard: DiscordTypes.GatewayIntegrationCreateDispatch) => void;
    INTEGRATION_UPDATE: (shard: DiscordTypes.GatewayIntegrationUpdateDispatch) => void;
    INTEGRATION_DELETE: (shard: DiscordTypes.GatewayIntegrationDeleteDispatch) => void;
    INTERACTION_CREATE: (shard: DiscordTypes.GatewayInteractionCreateDispatch) => void;
    INVITE_CREATE: (shard: DiscordTypes.GatewayInviteCreateDispatch) => void;
    INVITE_DELETE: (shard: DiscordTypes.GatewayInviteDeleteDispatch) => void;
    MESSAGE_CREATE: (shard: DiscordTypes.GatewayMessageCreateDispatch) => void;
    MESSAGE_UPDATE: (shard: DiscordTypes.GatewayMessageUpdateDispatch) => void;
    MESSAGE_DELETE: (shard: DiscordTypes.GatewayMessageDeleteDispatch) => void;
    MESSAGE_DELETE_BULK: (shard: DiscordTypes.GatewayMessageDeleteBulkDispatch) => void;
    MESSAGE_REACTION_ADD: (shard: DiscordTypes.GatewayMessageReactionAddDispatch) => void;
    MESSAGE_REACTION_REMOVE: (shard: DiscordTypes.GatewayMessageReactionRemoveDispatch) => void;
    MESSAGE_REACTION_REMOVE_ALL: (shard: DiscordTypes.GatewayMessageReactionRemoveAllDispatch) => void;
    MESSAGE_REACTION_REMOVE_EMOJI: (shard: DiscordTypes.GatewayMessageReactionRemoveEmojiDispatch) => void;
    PRESENCE_UPDATE: (shard: DiscordTypes.GatewayPresenceUpdateDispatch) => void;
    STAGE_INSTANCE_CREATE: (shard: DiscordTypes.GatewayStageInstanceCreateDispatch) => void;
    STAGE_INSTANCE_DELETE: (shard: DiscordTypes.GatewayStageInstanceDeleteDispatch) => void;
    STAGE_INSTANCE_UPDATE: (shard: DiscordTypes.GatewayStageInstanceUpdateDispatch) => void;
    TYPING_START: (shard: DiscordTypes.GatewayTypingStartDispatch) => void;
    USER_UPDATE: (shard: DiscordTypes.GatewayUserUpdateDispatch) => void;
    VOICE_STATE_UPDATE: (shard: DiscordTypes.GatewayVoiceStateUpdateDispatch) => void;
    VOICE_SERVER_UPDATE: (shard: DiscordTypes.GatewayVoiceServerUpdateDispatch) => void;
    WEBHOOKS_UPDATE: (shard: DiscordTypes.GatewayWebhooksUpdateDispatch) => void;
}
/**
 * The gateway manager.
 * Manages {@link GatewayShard shards}, handles incoming payloads, and sends commands to the Discord gateway.
 *
 * All events are emitted with their entire payload; [Discord API Reference](https://discord.com/developers/docs/topics/gateway#payloads-gateway-payload-structure).
 * Dispatched events are emitted under the {@link GatewayEvents `*`} event prior to being passed through the cache event handler.
 * After being handled by the {@link Cache cache manager}, they are emitted again under their individual event name (example: `GUILD_CREATE`).
 */
export declare class Gateway extends TypedEmitter<GatewayEvents> {
    /**
     * {@link GatewayShard Gateway shards}.
     * Modifying this map externally may result in unexpected behavior.
     */
    shards: ExtendedMap<number, GatewayShard>;
    /**
     * The latest self user received from the gateway.
     */
    user: DiscordTypes.APIUser | null;
    /**
     * {@link GatewayOptions Options} for the gateway manager.
     * Note that any options not specified are set to a default value.x
     */
    readonly options: Required<GatewayOptions> & {
        intents: number;
    };
    /**
     * The system string used for emitting {@link DistypeError errors} and for the {@link LogCallback log callback}.
     */
    readonly system = "Gateway";
    /**
     * The {@link Cache cache manager} to update from incoming events.
     */
    private _cache?;
    /**
     * The {@link LogCallback log callback} used by the gateway manager.
     */
    private _log;
    /**
     * A value to use as `this` in the `this#_log`.
     */
    private _logThisArg?;
    /**
     * An increment used for creating unique nonce values for [request guild member](https://discord.com/developers/docs/topics/gateway#request-guild-members) payloads.
     */
    private _requestGuildMembersNonceIncrement;
    /**
     * The {@link Rest rest manager} to use for fetching gateway endpoints.
     */
    private _rest;
    /**
     * Stored calculated sharding options.
     */
    private _storedCalculatedShards;
    /**
     * Stored response from `Rest#getGatewayBot()`.
     */
    private _storedGetGatewayBot;
    /**
     * The bot's token.
     */
    private readonly _token;
    /**
     * Create a gateway manager.
     * @param token The bot's token.
     * @param rest The {@link Rest rest manager} to use for fetching gateway endpoints.
     * @param cache The {@link Cache cache} to update from incoming events. If `false` is specified, {@link GatewayEvents gateway events} will not be passed to a cache event handler.
     * @param options {@link GatewayOptions Gateway options}.
     * @param logCallback A {@link LogCallback callback} to be used for logging events internally in the gateway manager.
     * @param logThisArg A value to use as `this` in the `logCallback`.
     */
    constructor(token: string, rest: Rest, cache: Cache | false, options?: GatewayOptions, logCallback?: LogCallback, logThisArg?: any);
    /**
     * If all shards are in a {@link GatewayShardState READY} state.
     */
    get shardsRunning(): boolean;
    /**
     * Connect to the gateway.
     * @param gatewayBot A pre-fetched `GET` `/gateway/bot`. Not required, as this method will fetch it if not specified.
     * @returns The results from {@link GatewayShard shard} spawns.
     */
    connect(gatewayBot?: DiscordTypes.APIGatewayBotInfo): Promise<Array<PromiseSettledResult<void>>>;
    /**
     * Get a guild's shard.
     * @param guildId The guild's ID.
     * @param ensure If true, an error is thrown if a {@link GatewayShard} is not found.
     * @returns The guild's shard, or a shard ID if the shard is not in this manager.
     * @see [Discord API Reference]
     */
    guildShard<T extends boolean>(guildId: Snowflake, ensure?: T): T extends true ? GatewayShard : GatewayShard | number;
    /**
     * Get members from a guild.
     * @param guildId The ID of the guild to get members from.
     * @param options Guild member request options.
     * @returns Received members, presences, and unfound members.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#request-guild-members)
     */
    getGuildMembers(guildId: Snowflake, options?: Partial<Omit<DiscordTypes.GatewayRequestGuildMembersData, `guild_id` | `presences`>>): Promise<{
        members: ExtendedMap<Snowflake, DiscordTypes.APIGuildMember>;
        presences?: ExtendedMap<Snowflake, DiscordTypes.GatewayPresenceUpdate>;
        notFound?: Snowflake[];
    }>;
    /**
     * Update the bot's voice state.
     * @param guildId The guild to set the voice state in.
     * @param channelId The channel to join. `null`disconnects the bot.
     * @param mute If the bot should self mute.
     * @param deafen If the bot should self deafen.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#update-voice-state)
     */
    updateVoiceState(guildId: Snowflake, channelId: Snowflake | null, mute?: boolean, deafen?: boolean): Promise<void>;
    /**
     * Update the bot's presence.
     * @param presence Presence data.
     * @param shard A shard or shards to set the presence on. A number will set the presence on a single shard with a matching ID, a number array will set the presence on all shards matching am ID in the array, and `all` will set the presence on all shards.
     */
    updatePresence(presence: {
        since: number | null;
        activities: Array<{
            name: string;
            type: number;
            url?: string | null;
        }>;
        status: `online` | `dnd` | `idle` | `invisible` | `offline`;
        afk: boolean;
    } | DiscordTypes.GatewayPresenceUpdateData, shard?: number | number[] | `all`): Promise<void>;
    /**
     * Get a guild's shard ID.
     * @param guildId The guild's ID.
     * @param numShards The `numShards` value sent in the identify payload.
     * @returns A shard ID.
     */
    private _guildShard;
    /**
     * Creates intents flags from intents specified in the constructor.
     * @param specified The specified intents.
     * @returns Intents flags.
     */
    private _intentsFactory;
}
