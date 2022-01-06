import { DiscordConstants } from '../utils/DiscordConstants';
import { RestBucket } from './RestBucket';
import { RestOptions, RestRequestOptions } from './RestOptions';
import { RestRequests } from './RestRequests';
import { SnowflakeUtils } from '../utils/SnowflakeUtils';

import Collection from '@discordjs/collection';
import FormData from 'form-data';
import { Snowflake } from 'discord-api-types';

/**
 * {@link Rest} request methods.
 */
export type RestMethod = `GET` | `POST` | `DELETE` | `PATCH` | `PUT`;

/**
 * A {@link Rest rest} bucket hash.
 */
export type RestBucketHashLike = `${string}` | `global;${RestRouteHashLike}`;

/**
 * A {@link RestBucket rest bucket} ID.
 */
export type RestBucketIdLike = `${RestBucketHashLike}(${RestMajorParameterLike})`;

/**
 * A major {@link Rest rest} ratelimit parameter.
 */
export type RestMajorParameterLike = `global` | Snowflake;

/**
 * Data for a {@link Rest rest} request.
 * Used by the `Rest#request()` method.
 */
export interface RestRequestData {
    /**
     * The request body.
     */
    body?: Record<string, any> | FormData
    /**
     * The request query.
     */
    params?: Record<string, any>
    /**
     * The request query.
     */
    query?: Record<string, any>
    /**
     * The value for the X-Audit-Log-Reason header.
     */
    reason?: string
}

/**
 * A {@link Rest rest} route.
 */
export type RestRouteLike = `/${string}`;

/**
 * A {@link RestRouteLike rest route} hash.
 */
export type RestRouteHashLike = `${RestMethod};${RestMajorParameterLike}`;

/**
 * The rest manager.
 * Used for making rest requests to the Discord API.
 */
export class Rest extends RestRequests {
    /**
     * Rate limit {@link RestBucket buckets}.
     * Each bucket's key is it's {@link RestBucketIdLike ID}.
     */
    public buckets: Collection<RestBucketIdLike, RestBucket> = new Collection();
    /**
     * The amount of requests left in the global ratelimit bucket.
     */
    public globalLeft: number;
    /**
     * A unix millisecond timestamp at which the global ratelimit resets.
     */
    public globalResetAt = -1;
    /**
     * A tally of the number of responses that returned a specific response code.
     * Note that response codes aren't included if they were never received.
     */
    public responseCodeTally: Record<string, number> = {};
    /**
     * Cached route rate limit bucket hashes.
     * Keys are {@link RestRouteHashLike cached route hashes}, with their values being their corresponding {@link RestBucketHashLike bucket hash}.
     */
    public routeHashCache: Collection<RestRouteHashLike, RestBucketHashLike> = new Collection();

    /**
     * {@link RestOptions Options} for the rest manager.
     */
    // @ts-expect-error Property 'options' has no initializer and is not definitely assigned in the constructor.
    public readonly options: RestOptions;

    /**
     * The bot's token.
     */
    // @ts-expect-error Property '_token' has no initializer and is not definitely assigned in the constructor.
    private readonly _token: string;

    /**
     * Create a rest manager.
     * @param token The bot's token.
     * @param options {@link RestOptions Rest options}.
     */
    constructor(token: string, options: RestOptions) {
        super();

        if (typeof token !== `string`) throw new TypeError(`A bot token must be specified`);

        Object.defineProperty(this, `_token`, {
            configurable: false,
            enumerable: false,
            value: token as Rest[`_token`],
            writable: false
        });
        Object.defineProperty(this, `options`, {
            configurable: false,
            enumerable: true,
            value: Object.freeze(options) as Rest[`options`],
            writable: false
        });

        this.globalLeft = options.ratelimits.globalPerSecond;
    }

    /**
     * Get the ratio of response codes.
     * Each code's value is the percentage it was received (`0` to `100`).
     * Note that response codes aren't included if they were never received.
     */
    public get responseCodeRatio (): Record<string, number> {
        const total = Object.values(this.responseCodeTally).reduce((p, c) => p += c);
        const ratio: Record<string, number> = {};
        Object.keys(this.responseCodeTally).forEach((key) => ratio[key] = (this.responseCodeTally[key] / total) * 100);
        return ratio;
    }

    /**
     * Make a rest request.
     * @param method The request's {@link RestMethod method}.
     * @param route The requests's {@link RestRouteLike route}, relative to the base Discord API URL. (Example: `/channels/123456789000000000`)
     * @param options Request options.
     * @returns Response data.
     */
    public async request(method: RestMethod, route: RestRouteLike, options: RestRequestOptions & RestRequestData = {}): Promise<any> {
        const rawHash = route.replace(/\d{16,19}/g, `:id`).replace(/\/reactions\/(.*)/, `/reactions/:reaction`);
        const oldMessage = method === `DELETE` && rawHash === `/channels/:id/messages/:id` && (Date.now() - SnowflakeUtils.time(/\d{16,19}$/.exec(route)![0])) > DiscordConstants.OLD_MESSAGE_THRESHOLD ? `/old-message` : ``;

        const routeHash: RestRouteHashLike = `${method};${rawHash}${oldMessage}`;
        const bucketHash: RestBucketHashLike = this.routeHashCache.get(routeHash) ?? `global;${routeHash}`;
        const majorParameter: RestMajorParameterLike = /^\/(?:channels|guilds|webhooks)\/(\d{16,19})/.exec(route)?.[1] ?? `global`;
        const bucketId: RestBucketIdLike = `${bucketHash}(${majorParameter})`;

        const bucket = this.buckets.get(bucketId) ?? this._createBucket(bucketId, bucketHash, majorParameter);

        return await bucket.request(method, route, routeHash, options);
    }

    /**
     * Create a ratelimit {@link RestBucket bucket}.
     * @param bucketId The bucket's {@link RestBucketIdLike ID}.
     * @param bucketHash The bucket's unique {@link RestBucketHashLike hash}.
     * @param majorParameter The {@link RestMajorParameterLike major parameter} associated with the bucket.
     * @returns The created bucket.
     */
    private _createBucket (bucketId: RestBucketIdLike, bucketHash: RestBucketHashLike, majorParameter: RestMajorParameterLike): RestBucket {
        const bucket = new RestBucket(this, bucketId, bucketHash, majorParameter);
        this.buckets.set(bucketId, bucket);
        return bucket;
    }
}