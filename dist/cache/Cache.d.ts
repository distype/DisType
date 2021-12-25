import { CachedChannel, CachedGuild, CachedMember, CachedPresence, CachedRole, CachedUser, CachedVoiceState } from './CacheTypes';
import { cacheEventHandler } from './cacheEventHandler';
import Collection from '@discordjs/collection';
import { Snowflake } from 'discord-api-types/v9';
/**
 * A function that handles gateway events to update the cache.
 */
export declare type CacheEventHandler = typeof cacheEventHandler;
/**
 * Cache options.
 */
export interface CacheOptions {
    /**
     * Cache control.
     * By default, nothing is cached. Cache is enabled on a per-key basis, meaning you specify what keys of data you wish to keep cached.
     * Keep in mind that even if you select to cache data, that data may not be available until specific gateway dispatches are received.
     * Defining an empty array (`[]`) will only cache the required data.
     * @default {}
     */
    cacheControl?: {
        channels?: Array<keyof Omit<CachedChannel, `id` | `guild_id`>>;
        guilds?: Array<keyof Omit<CachedGuild, `id`>>;
        members?: Array<keyof Omit<CachedMember, `user_id` | `guild_id`>>;
        presences?: Array<keyof Omit<CachedPresence, `user_id` | `guild_id`>>;
        roles?: Array<keyof Omit<CachedRole, `id` | `guild_id`>>;
        users?: Array<keyof Omit<CachedUser, `id`>>;
        voiceStates?: Array<keyof Omit<CachedVoiceState, `user_id` | `guild_id`>>;
    };
    /**
     * A custom handler to use for updating the cache with incoming gateway events.
     * It is recommended that you leave this undefined, so that the built-in handler is used.
     */
    cacheEventHandler?: CacheEventHandler;
}
/**
 * The cache manager.
 * Contains cached data, and handles dispatched gateway events to keep the cache up to date.
 * Keep in mind that there are many caveats to the gateway, and that real-world cache data may not directly reflect your cache control options.
 * It is recommended that you research intents and the caveats to the gateway, to make sure your bot receives sufficient data for your use case.
 * [Discord API Reference](https://discord.com/developers/docs/topics/gateway)
 */
export declare class Cache {
    /**
     * Cached channels.
     * A channel's key in the collection is its ID.
     */
    channels?: Collection<Snowflake, CachedChannel>;
    /**
     * Cached guilds.
     * A guild's key in the collection is its ID.
     */
    guilds?: Collection<Snowflake, CachedGuild>;
    /**
     * Cached members.
     * Each key of the parent cache is a guild ID, with its children being a collection of members in that guild.
     * A member's key in its collection is its user ID.
     */
    members?: Collection<Snowflake, Collection<Snowflake, CachedMember>>;
    /**
     * Cached presences.
     * Each key of the parent cache is a guild ID, with its children being a collection of presences in that guild.
     * A presence's key in its collection is its user's ID.
     */
    presences?: Collection<Snowflake, Collection<Snowflake, CachedPresence>>;
    /**
     * Cached roles.
     * A role's key in the collection is its ID.
     */
    roles?: Collection<Snowflake, CachedRole>;
    /**
     * Cached users.
     * A user's key in the collection is its ID.
     */
    users?: Collection<Snowflake, CachedUser>;
    /**
     * Cached voice states.
     * Each key of the parent cache is a guild ID, with its children being a collection of voice states in that guild.
     * A voice state's key in its collection is its user's ID.
     */
    voiceStates?: Collection<Snowflake, Collection<Snowflake, CachedVoiceState>>;
    /**
     * Options for the cache manager.
     */
    readonly options: Required<CacheOptions>;
    /**
     * Create a cache manager.
     * @param options Cache options.
     */
    constructor(options?: CacheOptions);
}
