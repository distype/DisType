import { Snowflake } from 'discord-api-types/v10';

/**
 * Contains simple utility functions.
 * @internal
 */
export class UtilityFunctions {
    /**
     * Flattens an object.
     * @param obj The object to flatten.
     * @param stopAtKey A key to stop flattening at.
     * @param separator The seperator to use between keys.
     * @returns A flattened object.
     */
    public static flattenObject (obj: Record<string, any>, stopAtKey?: string, separator = `.`): Record<string, any> {
        const flatten = (obj: Record<string, any>, map: Record<string, any> = {}, parent?: string): Record<string, any> => {
            for (const [k, v] of Object.entries(obj)) {
                const property = parent ? `${parent}${separator}${k}` : k;
                if (k !== stopAtKey && v && typeof v === `object`) flatten(v, map, property);
                else map[property] = v;
            }
            return map;
        };
        return flatten(obj);
    }

    /**
     * Get a guild's shard ID.
     * @param guildId The guild's ID.
     * @param numShards The `numShards` value sent in the identify payload.
     * @returns A shard ID.
     */
    public static guildShard (guildId: Snowflake, numShards: number): number {
        return Number((BigInt(guildId) >> 22n) % BigInt(numShards));
    }

    /**
     * Traverses through all elements and nested elements of an object.
     * @param obj The object to traverse.
     * @param callback A callback that fires for every element of the object.
     */
    public static traverseObject (obj: Record<string, any>, callback: (obj: { [key: string]: any }) => void): void {
        callback(obj);
        Object.keys(obj).forEach((key) => {
            if (typeof obj[key] === `object`) this.traverseObject(obj[key], callback);
        });
    }

    /**
     * Wait a specified number of milliseconds.
     * @param time The time to wait in milliseconds.
     */
    public static async wait (time: number): Promise<void> {
        return await new Promise((resolve) => setTimeout(resolve, time));
    }
}