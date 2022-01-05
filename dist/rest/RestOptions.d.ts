import { request } from 'undici';
/**
 * Rest options.
 */
export interface RestOptions extends RestRequestOptions {
    code500retries: number;
    /**
     * Ratelimit options.
     */
    ratelimits: {
        /**
         * The amount of requests to allow to be sent per second.
         * Note that this only applies to a single `ClientWorker` instance (If `ClientWorker` and `ClientMaster` are being used), meaning that you still may encounter 429 errors from global ratelimits.
         */
        globalPerSecond: number;
        /**
         * The amount of time in milliseconds to wait between ratelimited requests in the same bucket.
         */
        pause: number;
    };
    version: number;
}
/**
 * Options for rest requests.
 * Extends undici request options.
 * @see [Undici Documentation](https://undici.nodejs.org/#/?id=undicirequesturl-options-promise)
 */
export interface RestRequestOptions extends Omit<NonNullable<Parameters<typeof request>[1]>, `body` | `method` | `bodyTimeout`> {
    /**
     * The amount of times to retry a request if it returns code `500`.
     */
    code500retries?: number;
    /**
     * The amount of time in milliseconds to wait before considering a request timed out.
     * Defaults to [undici's](https://undici.nodejs.org) `bodyTimeout` from [DispatchOptions](https://undici.nodejs.org/#/docs/api/Dispatcher?id=parameter-dispatchoptions).
     */
    timeout?: number;
    /**
     * The Discord API version to use.
     * @see [Discord API Reference](https://discord.com/developers/docs/reference#api-versioning-api-versions)
     */
    version?: number;
}