"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionsFactory = void 0;
const DefaultOptions_1 = require("../constants/DefaultOptions");
const DiscordConstants_1 = require("../constants/DiscordConstants");
/**
 * Converts specified client options into complete client options.
 * @param options Provided options.
 * @returns Complete options.
 * @internal
 */
const optionsFactory = (options) => {
    let intents;
    if (typeof options.gateway?.intents === `number`)
        intents = options.gateway?.intents;
    else if (typeof options.gateway?.intents === `bigint`)
        intents = Number(options.gateway?.intents);
    else if (options.gateway?.intents instanceof Array)
        intents = options.gateway?.intents.reduce((p, c) => p | DiscordConstants_1.DiscordConstants.GATEWAY_INTENTS[c], 0);
    else if (options.gateway?.intents === `all`)
        intents = Object.values(DiscordConstants_1.DiscordConstants.GATEWAY_INTENTS).reduce((p, c) => p | c, 0);
    else
        intents = Object.values(DiscordConstants_1.DiscordConstants.GATEWAY_PRIVILEGED_INTENTS).reduce((p, c) => p & ~c, Object.values(DiscordConstants_1.DiscordConstants.GATEWAY_INTENTS).reduce((p, c) => p | c, 0));
    return {
        cache: {
            cacheControl: options.cache?.cacheControl ?? DefaultOptions_1.DefaultOptions.CACHE.cacheControl,
            cacheEventHandler: options.cache?.cacheEventHandler ?? DefaultOptions_1.DefaultOptions.CACHE.cacheEventHandler
        },
        gateway: {
            customGatewaySocketURL: options.gateway?.customGatewaySocketURL,
            customGetGatewayBotURL: options.gateway?.customGetGatewayBotURL,
            disableBucketRatelimits: options.gateway?.disableBucketRatelimits,
            intents,
            largeGuildThreshold: options.gateway?.largeGuildThreshold ?? DefaultOptions_1.DefaultOptions.GATEWAY.largeGuildThreshold,
            presence: options.gateway?.presence ?? DefaultOptions_1.DefaultOptions.GATEWAY.presence,
            sharding: options.gateway?.sharding ?? DefaultOptions_1.DefaultOptions.GATEWAY.sharding,
            spawnAttemptDelay: options.gateway?.spawnAttemptDelay ?? DefaultOptions_1.DefaultOptions.GATEWAY.spawnAttemptDelay,
            spawnMaxAttempts: options.gateway?.spawnMaxAttempts ?? DefaultOptions_1.DefaultOptions.GATEWAY.spawnMaxAttempts,
            spawnTimeout: options.gateway?.spawnTimeout ?? DefaultOptions_1.DefaultOptions.GATEWAY.spawnTimeout,
            version: options.gateway?.version ?? DefaultOptions_1.DefaultOptions.GATEWAY.version,
            wsOptions: options.gateway?.wsOptions ?? DefaultOptions_1.DefaultOptions.GATEWAY.wsOptions
        },
        logger: options.logger === false
            ? {
                disableInternal: true,
                enabledOutput: DefaultOptions_1.DefaultOptions.LOGGER.enabledOutput,
                format: DefaultOptions_1.DefaultOptions.LOGGER.format,
                showTime: DefaultOptions_1.DefaultOptions.LOGGER.showTime
            }
            : {
                disableInternal: options.logger?.disableInternal ?? DefaultOptions_1.DefaultOptions.LOGGER.disableInternal,
                enabledOutput: options.logger?.enabledOutput ?? DefaultOptions_1.DefaultOptions.LOGGER.enabledOutput,
                format: options.logger?.format ?? DefaultOptions_1.DefaultOptions.LOGGER.format,
                showTime: options.logger?.showTime ?? DefaultOptions_1.DefaultOptions.LOGGER.showTime
            },
        rest: {
            ...options.rest,
            code500retries: options.rest?.code500retries ?? DefaultOptions_1.DefaultOptions.REST.code500retries,
            ratelimits: {
                globalPerSecond: options.rest?.ratelimits?.globalPerSecond ?? DefaultOptions_1.DefaultOptions.REST.ratelimits.globalPerSecond,
                pause: options.rest?.ratelimits?.pause ?? DefaultOptions_1.DefaultOptions.REST.ratelimits.pause,
                sweepInterval: options.rest?.ratelimits?.sweepInterval ?? DefaultOptions_1.DefaultOptions.REST.ratelimits.sweepInterval
            } ?? DefaultOptions_1.DefaultOptions.REST.ratelimits,
            version: options.rest?.version ?? DefaultOptions_1.DefaultOptions.REST.version
        }
    };
};
exports.optionsFactory = optionsFactory;
