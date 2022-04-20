import { RestMethod, RestRequestData, RestRequestDataBodyStream } from './Rest';
import { RestRequestOptions } from './RestOptions';

import * as DiscordTypes from 'discord-api-types/v10';
import { RESTPatchAPIGuildEmojiJSONBody, RESTPostAPIGuildEmojiJSONBody, Snowflake } from 'discord-api-types/v10';

/**
 * A class containing methods for all routes for the Discord API.
 * @internal
 */
export abstract class RestRequests {
    public abstract request(method: RestMethod, route: string, options?: RestRequestData): Promise<any>;

    /**
     * @param applicationId The application ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#get-global-application-commands)
     */
    public async getGlobalApplicationCommands (applicationId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIApplicationCommandsResult> {
        return await this.request(`GET`, `/applications/${applicationId}/commands`, options);
    }

    /**
     * @param applicationId The application ID.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#create-global-application-command)
     */
    public async createGlobalApplicationCommand (applicationId: Snowflake, body: DiscordTypes.RESTPostAPIApplicationCommandsJSONBody, options?: RestRequestOptions): Promise<DiscordTypes.RESTPostAPIApplicationCommandsResult> {
        return await this.request(`POST`, `/applications/${applicationId}/commands`, {
            body, ...options
        });
    }

    /**
     * @param applicationId The application ID.
     * @param commandId The command ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#get-global-application-command)
     */
    public async getGlobalApplicationCommand (applicationId: Snowflake, commandId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIApplicationCommandResult> {
        return await this.request(`GET`, `/applications/${applicationId}/commands/${commandId}`, options);
    }

    /**
     * @param applicationId The application ID.
     * @param commandId The command ID.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#edit-global-application-command)
     */
    public async editGlobalApplicationCommand (applicationId: Snowflake, commandId: Snowflake, body: DiscordTypes.RESTPatchAPIApplicationCommandJSONBody, options?: RestRequestOptions): Promise<DiscordTypes.RESTPatchAPIApplicationCommandResult> {
        return await this.request(`PATCH`, `/applications/${applicationId}/commands/${commandId}`, {
            body, ...options
        });
    }

    /**
     * @param applicationId The application ID.
     * @param commandId The command ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#delete-global-application-command)
     */
    public async deleteGlobalApplicationCommand (applicationId: Snowflake, commandId: Snowflake, options?: RestRequestOptions): Promise<never> {
        return await this.request(`DELETE`, `/applications/${applicationId}/commands/${commandId}`, options) as never;
    }

    /**
     * @param applicationId The application ID.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-global-application-commands)
     */
    public async bulkOverwriteGlobalApplicationCommands (applicationId: Snowflake, body: DiscordTypes.RESTPutAPIApplicationCommandsJSONBody, options?: RestRequestOptions): Promise<DiscordTypes.RESTPutAPIApplicationCommandsResult> {
        return await this.request(`PUT`, `/applications/${applicationId}/commands`, {
            body, ...options
        });
    }

    /**
     * @param applicationId The application ID.
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#get-guild-application-commands)
     */
    public async getGuildApplicationCommands (applicationId: Snowflake, guildId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIApplicationGuildCommandsResult> {
        return await this.request(`GET`, `/applications/${applicationId}/guilds/${guildId}/commands`, options);
    }

    /**
     * @param applicationId The application ID.
     * @param guildId The guild ID.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#create-guild-application-command)
     */
    public async createGuildApplicationCommand (applicationId: Snowflake, guildId: Snowflake, body: DiscordTypes.RESTPostAPIApplicationGuildCommandsJSONBody, options?: RestRequestOptions): Promise<DiscordTypes.RESTPostAPIApplicationGuildCommandsResult> {
        return await this.request(`POST`, `/applications/${applicationId}/guilds/${guildId}/commands`, {
            body, ...options
        });
    }

    /**
     * @param applicationId The application ID.
     * @param guildId The guild ID.
     * @param commandId The command ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#get-guild-application-command)
     */
    public async getGuildApplicationCommand (applicationId: Snowflake, guildId: Snowflake, commandId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIApplicationGuildCommandResult> {
        return await this.request(`GET`, `/applications/${applicationId}/guilds/${guildId}/commands/${commandId}`, options);
    }

    /**
     * @param applicationId The application ID.
     * @param guildId The guild ID.
     * @param commandId The command ID.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#edit-guild-application-command)
     */
    public async editGuildApplicationCommand (applicationId: Snowflake, guildId: Snowflake, commandId: Snowflake, body: DiscordTypes.RESTPatchAPIApplicationGuildCommandJSONBody, options?: RestRequestOptions): Promise<DiscordTypes.RESTPatchAPIApplicationGuildCommandResult> {
        return await this.request(`POST`, `/applications/${applicationId}/guilds/${guildId}/commands/${commandId}`, {
            body, ...options
        });
    }

    /**
     * @param applicationId The application ID.
     * @param guildId The guild ID.
     * @param commandId The command ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#delete-guild-application-command)
     */
    public async deleteGuildApplicationCommand (applicationId: Snowflake, guildId: Snowflake, commandId: Snowflake, options?: RestRequestOptions): Promise<never> {
        return await this.request(`DELETE`, `/applications/${applicationId}/guilds/${guildId}/commands/${commandId}`, options) as never;
    }

    /**
     * @param applicationId The application ID.
     * @param guildId The guild ID.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-guild-application-commands)
     */
    public async bulkOverwriteGuildApplicationCommands (applicationId: Snowflake, guildId: Snowflake, body: DiscordTypes.RESTPutAPIApplicationGuildCommandsJSONBody, options?: RestRequestOptions): Promise<DiscordTypes.RESTPutAPIApplicationGuildCommandsResult> {
        return await this.request(`PUT`, `/applications/${applicationId}/guilds/${guildId}/commands`, {
            body, ...options
        });
    }

    /**
     * @param applicationId The application ID.
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#get-guild-application-command-permissions)
     */
    public async getGuildApplicationCommandPermissions (applicationId: Snowflake, guildId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildApplicationCommandsPermissionsResult> {
        return await this.request(`GET`, `/applications/${applicationId}/guilds/${guildId}/commands/permissions`, options);
    }

    /**
     * @param applicationId The application ID.
     * @param guildId The guild ID.
     * @param commandId The command ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#get-application-command-permissions)
     */
    public async getApplicationCommandPermissions (applicationId: Snowflake, guildId: Snowflake, commandId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIApplicationCommandPermissionsResult> {
        return await this.request(`GET`, `/applications/${applicationId}/guilds/${guildId}/commands/${commandId}/permissions`, options);
    }

    /**
     * @param applicationId The application ID.
     * @param guildId The guild ID.
     * @param commandId The command ID.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#edit-application-command-permissions)
     */
    public async editApplicationCommandPermissions (applicationId: Snowflake, guildId: Snowflake, commandId: Snowflake, body: DiscordTypes.RESTPutAPIApplicationCommandPermissionsJSONBody, options?: RestRequestOptions): Promise<DiscordTypes.RESTPutAPIApplicationCommandPermissionsResult> {
        return await this.request(`PUT`, `/applications/${applicationId}/guilds/${guildId}/commands/${commandId}/permissions`, {
            body, ...options
        });
    }

    /**
     * @param applicationId The application ID.
     * @param guildId The guild ID.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#batch-edit-application-command-permissions)
     */
    public async batchEditApplicationCommandPermissions (applicationId: Snowflake, guildId: Snowflake, body: DiscordTypes.RESTPutAPIGuildApplicationCommandsPermissionsJSONBody, options?: RestRequestOptions): Promise<DiscordTypes.RESTPutAPIGuildApplicationCommandsPermissionsResult> {
        return await this.request(`PUT`, `/applications/${applicationId}/guilds/${guildId}/commands/permissions`, {
            body, ...options
        });
    }

    /**
     * @param interactionId The interaction ID.
     * @param interactionToken The interaction token.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/receiving-and-responding#create-interaction-response)
     */
    public async createInteractionResponse (interactionId: Snowflake, interactionToken: string, body: DiscordTypes.RESTPostAPIInteractionCallbackJSONBody | RestRequestDataBodyStream, options?: RestRequestOptions): Promise<never> {
        return await this.request(`POST`, `/interactions/${interactionId}/${interactionToken}/callback`, {
            body, ...options
        }) as never;
    }

    /**
     * @param applicationId The application ID.
     * @param interactionToken The interaction token.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/receiving-and-responding#get-original-interaction-response)
     */
    public async getOriginalInteractionResponse (applicationId: Snowflake, interactionToken: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIInteractionOriginalResponseResult> {
        return await this.request(`GET`, `/webhooks/${applicationId}/${interactionToken}/messages/@original`, options);
    }

    /**
     * @param applicationId The application ID.
     * @param interactionToken The interaction token.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/receiving-and-responding#edit-original-interaction-response)
     */
    public async editOriginalInteractionResponse (applicationId: Snowflake, interactionToken: string, body: DiscordTypes.RESTPatchAPIInteractionOriginalResponseJSONBody | RestRequestDataBodyStream, options?: RestRequestOptions): Promise<DiscordTypes.RESTPatchAPIInteractionOriginalResponseResult> {
        return await this.request(`PATCH`, `/webhooks/${applicationId}/${interactionToken}/messages/@original`, {
            body, ...options
        });
    }

    /**
     * @param applicationId The application ID.
     * @param interactionToken The interaction token.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/receiving-and-responding#delete-original-interaction-response)
     */
    public async deleteOriginalInteractionResponse (applicationId: Snowflake, interactionToken: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPIInteractionOriginalResponseResult> {
        return await this.request(`DELETE`, `/webhooks/${applicationId}/${interactionToken}/messages/@original`, options) as never;
    }

    /**
     * @param applicationId The application ID.
     * @param interactionToken The interaction token.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/receiving-and-responding#create-followup-message)
     */
    public async createFollowupMessage (applicationId: Snowflake, interactionToken: string, body: DiscordTypes.RESTPostAPIInteractionFollowupJSONBody | RestRequestDataBodyStream, options?: RestRequestOptions): Promise<DiscordTypes.RESTPostAPIInteractionFollowupResult> {
        return await this.request(`POST`, `/webhooks/${applicationId}/${interactionToken}`, {
            body, ...options
        });
    }

    /**
     * @param applicationId The application ID.
     * @param interactionToken The interaction token.
     * @param messageId The message ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/receiving-and-responding#get-followup-message)
     */
    public async getFollowupMessage (applicationId: Snowflake, interactionToken: string, messageId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIInteractionFollowupResult> {
        return await this.request(`GET`, `/webhooks/${applicationId}/${interactionToken}/messages/${messageId}`, options);
    }

    /**
     * @param applicationId The application ID.
     * @param interactionToken The interaction token.
     * @param messageId The message ID.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/receiving-and-responding#edit-followup-message)
     */
    public async editFollowupMessage (applicationId: Snowflake, interactionToken: string, messageId: Snowflake, body: DiscordTypes.RESTPatchAPIInteractionFollowupJSONBody | RestRequestDataBodyStream, options?: RestRequestOptions): Promise<DiscordTypes.RESTPatchAPIInteractionFollowupResult> {
        return await this.request(`PATCH`, `/webhooks/${applicationId}/${interactionToken}/messages/${messageId}`, {
            body, ...options
        });
    }

    /**
     * @param applicationId The application ID.
     * @param interactionToken The interaction token.
     * @param messageId The message ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/receiving-and-responding#delete-followup-message)
     */
    public async deleteFollowupMessage (applicationId: Snowflake, interactionToken: string, messageId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPIInteractionFollowupResult> {
        return await this.request(`DELETE`, `/webhooks/${applicationId}/${interactionToken}/messages/${messageId}`, options) as never;
    }

    /**
     * @param guildId The guild ID.
     * @param query Request query.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/audit-log#get-guild-audit-log)
     */
    public async getGuildAuditLog (guildId: Snowflake, query: DiscordTypes.RESTGetAPIAuditLogQuery, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIAuditLogResult> {
        return await this.request(`GET`, `/guilds/${guildId}/audit-logs`, {
            query, ...options
        });
    }

    /**
     * @param channelId The channel ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#get-channel)
     */
    public async getChannel (channelId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIChannelResult> {
        return await this.request(`GET`, `/channels/${channelId}`, options);
    }

    /**
     * @param channelId The channel ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#modify-channel)
     */
    public async modifyChannel (channelId: Snowflake, body: DiscordTypes.RESTPatchAPIChannelJSONBody, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPatchAPIChannelResult> {
        return await this.request(`PATCH`, `/channels/${channelId}`, {
            body, reason, ...options
        });
    }

    /**
     * @param channelId The channel ID.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#deleteclose-channel)
     */
    public async deleteChannel (channelId: Snowflake, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPIChannelResult> {
        return await this.request(`DELETE`, `/channels/${channelId}`, {
            reason, ...options
        });
    }

    /**
     * @param channelId The channel ID.
     * @param query Request query.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#get-channel-messages)
     */
    public async getChannelMessages (channelId: Snowflake, query: DiscordTypes.RESTGetAPIChannelMessagesQuery, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIChannelMessagesResult> {
        return await this.request(`GET`, `/channels/${channelId}/messages`, {
            query, ...options
        });
    }

    /**
     * @param channelId The channel ID.
     * @param messageId The message ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#get-channel-message)
     */
    public async getChannelMessage (channelId: Snowflake, messageId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIChannelMessageResult> {
        return await this.request(`GET`, `/channels/${channelId}/messages/${messageId}`, options);
    }

    /**
     * @param channelId The channel ID.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#create-message)
     */
    public async createMessage (channelId: Snowflake, body: DiscordTypes.RESTPostAPIChannelMessageJSONBody | RestRequestDataBodyStream, options?: RestRequestOptions): Promise<DiscordTypes.RESTPostAPIChannelMessageResult> {
        return await this.request(`POST`, `/channels/${channelId}/messages`, {
            body, ...options
        });
    }

    /**
     * @param channelId The channel ID.
     * @param messageId The message ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#crosspost-message)
     */
    public async crosspostMessage (channelId: Snowflake, messageId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTPostAPIChannelMessageCrosspostResult> {
        return await this.request(`POST`, `/channels/${channelId}/messages/${messageId}/crosspost`, options);
    }

    /**
     * @param channelId The channel ID.
     * @param messageId The message ID.
     * @param emoji The emoji's identifier.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#create-reaction)
     */
    public async createReaction (channelId: Snowflake, messageId: Snowflake, emoji: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPutAPIChannelMessageReactionResult> {
        return await this.request(`PUT`, `/channels/${channelId}/messages/${messageId}/reactions/${emoji}/@me`, options) as never;
    }

    /**
     * @param channelId The channel ID.
     * @param messageId The message ID.
     * @param emoji The emoji's identifier.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#delete-own-reaction)
     */
    public async deleteOwnReaction (channelId: Snowflake, messageId: Snowflake, emoji: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPIChannelMessageOwnReaction> {
        return await this.request(`DELETE`, `/channels/${channelId}/messages/${messageId}/reactions/${emoji}/@me`, options) as never;
    }

    /**
     * @param channelId The channel ID.
     * @param messageId The message ID.
     * @param emoji The emoji's identifier.
     * @param userId The user ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#delete-user-reaction)
     */
    public async deleteUserReaction (channelId: Snowflake, messageId: Snowflake, emoji: string, userId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPIChannelMessageUserReactionResult> {
        return await this.request(`DELETE`, `/channels/${channelId}/messages/${messageId}/reactions/${emoji}/${userId}`, options) as never;
    }

    /**
     * @param channelId The channel ID.
     * @param messageId The message ID.
     * @param emoji The emoji's identifier.
     * @param query Request query.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#get-reactions)
     */
    public async getReactions (channelId: Snowflake, messageId: Snowflake, emoji: string, query: DiscordTypes.RESTGetAPIChannelMessageReactionUsersQuery, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIChannelMessageReactionUsersResult> {
        return await this.request(`GET`, `/channels/${channelId}/messages/${messageId}/reactions/${emoji}`, {
            query, ...options
        });
    }

    /**
     * @param channelId The channel ID.
     * @param messageId The message ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#delete-all-reactions)
     */
    public async deleteAllReactions (channelId: Snowflake, messageId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPIChannelAllMessageReactionsResult> {
        return await this.request(`DELETE`, `/channels/${channelId}/messages/${messageId}/reactions`, options) as never;
    }

    /**
     * @param channelId The channel ID.
     * @param messageId The message ID.
     * @param emoji The emoji's identifier.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#delete-all-reactions-for-emoji)
     */
    public async deleteAllReactionsForEmoji (channelId: Snowflake, messageId: Snowflake, emoji: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPIChannelMessageReactionResult> {
        return await this.request(`DELETE`, `/channels/${channelId}/messages/${messageId}/reactions/${emoji}`, options) as never;
    }

    /**
     * @param channelId The channel ID.
     * @param messageId The message ID.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#edit-message)
     */
    public async editMessage (channelId: Snowflake, messageId: Snowflake, body: DiscordTypes.RESTPatchAPIChannelMessageJSONBody | RestRequestDataBodyStream, options?: RestRequestOptions): Promise<DiscordTypes.RESTPatchAPIChannelMessageResult> {
        return await this.request(`PATCH`, `/channels/${channelId}/messages/${messageId}`, {
            body, ...options
        });
    }

    /**
     * @param channelId The channel ID.
     * @param messageId The message ID.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#delete-message)
     */
    public async deleteMessage (channelId: Snowflake, messageId: Snowflake, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPIChannelMessageResult> {
        return await this.request(`DELETE`, `/channels/${channelId}/messages/${messageId}`, {
            reason, ...options
        }) as never;
    }

    /**
     * @param channelId The channel ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#bulk-delete-messages)
     */
    public async bulkDeleteMessages (channelId: Snowflake, body: DiscordTypes.RESTPostAPIChannelMessagesBulkDeleteJSONBody, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPostAPIChannelMessagesBulkDeleteResult> {
        return await this.request(`POST`, `/channels/${channelId}/messages/bulk-delete`, {
            body, reason, ...options
        }) as never;
    }

    /**
     * @param channelId The channel ID.
     * @param overwriteId The overwrite ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#edit-channel-permissions)
     */
    public async editChannelPermissions (channelId: Snowflake, overwriteId: Snowflake, body: DiscordTypes.RESTPutAPIChannelPermissionJSONBody, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPutAPIChannelPermissionResult> {
        return await this.request(`PUT`, `/channels/${channelId}/permissions/${overwriteId}`, {
            body, reason, ...options
        }) as never;
    }

    /**
     * @param channelId The channel ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#get-channel-invites)
     */
    public async getChannelInvites (channelId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIChannelInvitesResult> {
        return await this.request(`GET`, `/channels/${channelId}/invites`, options);
    }

    /**
     * @param channelId The channel ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#create-channel-invite)
     */
    public async createChannelInvite (channelId: Snowflake, body: DiscordTypes.RESTPostAPIChannelInviteJSONBody, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPostAPIChannelInviteResult> {
        return await this.request(`POST`, `/channels/${channelId}/invites`, {
            body, reason, ...options
        });
    }

    /**
     * @param channelId The channel ID.
     * @param overwriteId The overwrite's ID.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#delete-channel-permission)
     */
    public async deleteChannelPermission (channelId: Snowflake, overwriteId: Snowflake, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPIChannelPermissionResult> {
        return await this.request(`DELETE`, `/channels/${channelId}/permissions/${overwriteId}`, {
            reason, ...options
        }) as DiscordTypes.RESTDeleteAPIChannelPermissionResult;
    }

    /**
     * @param channelId The channel ID.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#follow-news-channel)
     */
    public async followNewsChannel (channelId: Snowflake, body: DiscordTypes.RESTPostAPIChannelFollowersJSONBody, options?: RestRequestOptions): Promise<DiscordTypes.RESTPostAPIChannelFollowersResult> {
        return await this.request(`POST`, `/channels/${channelId}/followers`, {
            body, ...options
        });
    }

    /**
     * @param channelId The channel ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#trigger-typing-indicator)
     */
    public async triggerTypingIndicator (channelId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTPostAPIChannelTypingResult> {
        return await this.request(`POST`, `/channels/${channelId}/typing`, options) as DiscordTypes.RESTPostAPIChannelTypingResult;
    }

    /**
     * @param channelId The channel ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#get-pinned-messages)
     */
    public async getPinnedMessages (channelId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIChannelPinsResult> {
        return await this.request(`GET`, `/channels/${channelId}/pins`, options);
    }

    /**
     * @param channelId The channel ID.
     * @param messageId The message ID.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#pin-message)
     */
    public async pinMessage (channelId: Snowflake, messageId: Snowflake, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPutAPIChannelPinResult> {
        return await this.request(`PUT`, `/channels/${channelId}/pins/${messageId}`, {
            reason, ...options
        }) as DiscordTypes.RESTPutAPIChannelPinResult;
    }

    /**
     * @param channelId The channel ID.
     * @param messageId The message ID.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#unpin-message)
     */
    public async unpinMessage (channelId: Snowflake, messageId: Snowflake, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPIChannelPinResult> {
        return await this.request(`DELETE`, `/channels/${channelId}/pins/${messageId}`, {
            reason, ...options
        }) as DiscordTypes.RESTDeleteAPIChannelPinResult;
    }

    /**
     * @param channelId The channel ID.
     * @param userId The user ID.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#group-dm-add-recipient)
     */
    public async groupDMAddRecipient (channelId: Snowflake, userId: Snowflake, body: DiscordTypes.RESTPutAPIChannelRecipientJSONBody, options?: RestRequestOptions): Promise<DiscordTypes.RESTPutAPIChannelRecipientResult> {
        return await this.request(`PUT`, `/channels/${channelId}/recipients/${userId}`, {
            body, ...options
        });
    }

    /**
     * @param channelId The channel ID.
     * @param userId The user ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#group-dm-remove-recipient)
     */
    public async groupDMRemoveRecipient (channelId: Snowflake, userId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPIChannelRecipientResult> {
        return await this.request(`DELETE`, `/channels/${channelId}/recipients/${userId}`, options);
    }

    /**
     * @param channelId The channel ID.
     * @param messageId The message ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#start-thread-from-message)
     */
    public async startThreadFromMessage (channelId: Snowflake, messageId: Snowflake, body: DiscordTypes.RESTPostAPIChannelMessagesThreadsJSONBody, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPostAPIChannelMessagesThreadsResult> {
        return await this.request(`POST`, `/channels/${channelId}/messages/${messageId}/threads`, {
            body, reason, ...options
        });
    }

    /**
     * @param channelId The channel ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#start-thread-without-message)
     */
    public async startThreadWithoutMessage (channelId: Snowflake, body: DiscordTypes.RESTPostAPIChannelThreadsJSONBody, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPostAPIChannelThreadsResult> {
        return await this.request(`POST`, `/channels/${channelId}/threads`, {
            body, reason, ...options
        });
    }

    /**
     * @param channelId The channel ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#start-thread-in-forum-channel)
     * @todo PR in `discord-api-types` for proper return type.
     */
    public async startThreadInForumChannel (channelId: Snowflake, body: DiscordTypes.RESTPostAPIGuildForumThreadsJSONBody | RestRequestDataBodyStream, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPostAPIChannelThreadsResult> {
        return await this.request(`POST`, `/channels/${channelId}/threads`, {
            body, reason, ...options
        });
    }

    /**
     * @param threadId The thread ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#join-thread)
     */
    public async joinThread (threadId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTPutAPIChannelThreadMembersResult> {
        return await this.request(`PUT`, `/channels/${threadId}/thread-members/@me`, options) as DiscordTypes.RESTPutAPIChannelThreadMembersResult;
    }

    /**
     * @param threadId The thread ID.
     * @param userId The user ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#add-thread-member)
     */
    public async addThreadMember (threadId: Snowflake, userId: Snowflake, options?: RestRequestOptions): Promise<never> {
        return await this.request(`PUT`, `/channels/${threadId}/thread-members/${userId}`, options) as never;
    }

    /**
     * @param threadId The thread ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#leave-thread)
     */
    public async leaveThread (threadId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPIChannelThreadMembersResult> {
        return await this.request(`DELETE`, `/channels/${threadId}/thread-members/@me`, options) as DiscordTypes.RESTDeleteAPIChannelThreadMembersResult;
    }

    /**
     * @param threadId The thread ID.
     * @param userId The user ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#remove-thread-member)
     */
    public async removeThreadMember (threadId: Snowflake, userId: Snowflake, options?: RestRequestOptions): Promise<never> {
        return await this.request(`DELETE`, `/channels/${threadId}/thread-members/${userId}`, options) as never;
    }

    /**
     * @param threadId The thread ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#list-thread-members)
     */
    public async listThreadMembers (threadId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIChannelThreadMembersResult> {
        return await this.request(`GET`, `/channels/${threadId}/thread-members`, options);
    }

    /**
     * @param channelId The channel ID.
     * @param query Request query.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#list-public-archived-threads)
     */
    public async listPublicArchivedThreads (channelId: Snowflake, query: DiscordTypes.RESTGetAPIChannelThreadsArchivedQuery, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIChannelUsersThreadsArchivedResult> {
        return await this.request(`GET`, `/channels/${channelId}/threads/archived/public`, {
            query, ...options
        });
    }

    /**
     * @param channelId The channel ID.
     * @param query Request query.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#list-private-archived-threads)
     */
    public async listPrivateArchivedThreads (channelId: Snowflake, query: DiscordTypes.RESTGetAPIChannelThreadsArchivedQuery, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIChannelUsersThreadsArchivedResult> {
        return await this.request(`GET`, `/channels/${channelId}/threads/archived/private`, {
            query, ...options
        });
    }

    /**
     * @param channelId The channel ID.
     * @param query Request query.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#list-private-archived-threads)
     */
    public async listJoinedPrivateArchivedThreads (channelId: Snowflake, query: DiscordTypes.RESTGetAPIChannelThreadsArchivedQuery, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIChannelUsersThreadsArchivedResult> {
        return await this.request(`GET`, `/channels/${channelId}/users/@me/threads/archived/private`, {
            query, ...options
        });
    }

    /**
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/emoji#list-guild-emojis)
     */
    public async listGuildEmojis (guildId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildEmojisResult> {
        return await this.request(`GET`, `/guilds/${guildId}/emojis`, options);
    }

    /**
     * @param guildId The guild ID.
     * @param emoji The emoji's identifier.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/emoji#get-guild-emoji)
     */
    public async getGuildEmoji (guildId: Snowflake, emoji: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildEmojiResult> {
        return await this.request(`GET`, `/guilds/${guildId}/emojis/${emoji}`, options);
    }

    /**
     * @param guildId The guild ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/emoji#create-guild-emoji)
     */
    public async createGuildEmoji (guildId: Snowflake, body: RESTPostAPIGuildEmojiJSONBody, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPostAPIGuildEmojiResult> {
        return await this.request(`POST`, `/guilds/${guildId}/emojis`, {
            body, reason, ...options
        });
    }

    /**
     * @param guildId The guild ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/emoji#modify-guild-emoji)
     */
    public async modifyGuildEmoji (guildId: Snowflake, body: RESTPatchAPIGuildEmojiJSONBody, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPatchAPIGuildEmojiResult> {
        return await this.request(`PATCH`, `/guilds/${guildId}/emojis`, {
            body, reason, ...options
        });
    }

    /**
     * @param guildId The guild ID.
     * @param emoji The emoji's identifier.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/delete#delete-guild-emoji)
     */
    public async deleteGuildEmoji (guildId: Snowflake, emoji: string, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPIGuildEmojiResult> {
        return await this.request(`DELETE`, `/guilds/${guildId}/emojis/${emoji}`, {
            reason, ...options
        }) as DiscordTypes.RESTDeleteAPIGuildEmojiResult;
    }

    /**
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#create-guild)
     */
    public async createGuild (body: DiscordTypes.RESTPostAPIGuildsJSONBody, options?: RestRequestOptions): Promise<DiscordTypes.RESTPostAPIGuildsResult> {
        return await this.request(`POST`, `/guilds`, {
            body, ...options
        });
    }

    /**
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#get-guild)
     */
    public async getGuild (guildId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildResult> {
        return await this.request(`GET`, `/guilds/${guildId}`, options);
    }

    /**
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#get-guild-preview)
     */
    public async getGuildPreview (guildId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildPreviewResult> {
        return await this.request(`GET`, `/guilds/${guildId}/preview`, options);
    }

    /**
     * @param guildId The guild ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#modify-guild)
     */
    public async modifyGuild (guildId: Snowflake, body: DiscordTypes.RESTPatchAPIGuildJSONBody, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPatchAPIGuildResult> {
        return await this.request(`PATCH`, `/guilds/${guildId}`, {
            body, reason, ...options
        });
    }

    /**
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#delete-guild)
     */
    public async deleteGuild (guildId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPIGuildResult> {
        return await this.request(`DELETE`, `/guilds/${guildId}`, options) as DiscordTypes.RESTDeleteAPIGuildResult;
    }

    /**
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#get-guild-channels)
     */
    public async getGuildChannels (guildId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildChannelsResult> {
        return await this.request(`GET`, `/guilds/${guildId}/channels`, options);
    }

    /**
     * @param guildId The guild ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#create-guild-channel)
     */
    public async createGuildChannel (guildId: Snowflake, body: DiscordTypes.RESTPostAPIGuildChannelJSONBody, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPostAPIGuildChannelResult> {
        return await this.request(`POST`, `/guilds/${guildId}/channels`, {
            body, reason, ...options
        });
    }

    /**
     * @param guildId The guild ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#create-guild-channel)
     */
    public async modifyGuildChannelPositions (guildId: Snowflake, body: DiscordTypes.RESTPatchAPIGuildChannelPositionsJSONBody, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPatchAPIGuildChannelPositionsResult> {
        return await this.request(`PATCH`, `/guilds/${guildId}/channels`, {
            body, reason, ...options
        }) as DiscordTypes.RESTPatchAPIGuildChannelPositionsResult;
    }

    /**
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#list-active-threads)
     */
    public async listActiveThreads (guildId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildThreadsResult> {
        return await this.request(`GET`, `/guilds/${guildId}/threads/active`, options);
    }

    /**
     * @param guildId The guild ID.
     * @param userId The user ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#get-guild-member)
     */
    public async getGuildMember (guildId: Snowflake, userId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildMemberResult> {
        return await this.request(`GET`, `/guilds/${guildId}/members/${userId}`, options);
    }

    /**
     * @param guildId The guild ID.
     * @param query Request query.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#list-guild-members)
     */
    public async listGuildMembers (guildId: Snowflake, query: DiscordTypes.RESTGetAPIGuildMembersQuery, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildMembersResult> {
        return await this.request(`GET`, `/guilds/${guildId}/members`, {
            query, ...options
        });
    }

    /**
     * @param guildId The guild ID.
     * @param query Request query.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#search-guild-members)
     */
    public async searchGuildMembers (guildId: Snowflake, query: DiscordTypes.RESTGetAPIGuildMembersSearchQuery, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildMembersSearchResult> {
        return await this.request(`GET`, `/guilds/${guildId}/members/search`, {
            query, ...options
        });
    }

    /**
     * @param guildId The guild ID.
     * @param userId The user ID.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#add-guild-member)
     */
    public async addGuildMember (guildId: Snowflake, userId: Snowflake, body: DiscordTypes.RESTPutAPIGuildMemberJSONBody, options?: RestRequestOptions): Promise<DiscordTypes.RESTPutAPIGuildMemberResult> {
        return await this.request(`PUT`, `/guilds/${guildId}/members/${userId}`, {
            body, ...options
        });
    }

    /**
     * @param guildId The guild ID.
     * @param userId The user ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#modify-guild-member)
     */
    public async modifyGuildMember (guildId: Snowflake, userId: Snowflake, body: DiscordTypes.RESTPatchAPIGuildMemberJSONBody, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPatchAPIGuildMemberResult> {
        return await this.request(`PATCH`, `/guilds/${guildId}/members/${userId}`, {
            body, reason, ...options
        });
    }

    /**
     * @param guildId The guild ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#modify-guild-member)
     */
    public async modifyCurrentMember (guildId: Snowflake, body: DiscordTypes.RESTPatchAPICurrentGuildMemberJSONBody, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPatchAPIGuildMemberResult> {
        return await this.request(`PATCH`, `/guilds/${guildId}/members/@me`, {
            body, reason, ...options
        });
    }

    /**
     * @param guildId The guild ID.
     * @param userId The user ID.
     * @param roleId The role ID.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#add-guild-member-role)
     */
    public async addGuildMemberRole (guildId: Snowflake, userId: Snowflake, roleId: Snowflake, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPutAPIGuildMemberRoleResult> {
        return await this.request(`PUT`, `/guilds/${guildId}/members/${userId}/roles/${roleId}`, {
            reason, ...options
        }) as DiscordTypes.RESTPutAPIGuildMemberRoleResult;
    }

    /**
     * @param guildId The guild ID.
     * @param userId The user ID.
     * @param roleId The role ID.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#add-guild-member-role)
     */
    public async removeGuildMemberRole (guildId: Snowflake, userId: Snowflake, roleId: Snowflake, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPIGuildMemberRoleResult> {
        return await this.request(`PUT`, `/guilds/${guildId}/members/${userId}/roles/${roleId}`, {
            reason, ...options
        }) as DiscordTypes.RESTDeleteAPIGuildMemberRoleResult;
    }

    /**
     * @param guildId The guild ID.
     * @param userId The user ID.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#remove-guild-member)
     */
    public async removeGuildMember (guildId: Snowflake, userId: Snowflake, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPIGuildMemberResult> {
        return await this.request(`DELETE`, `/guilds/${guildId}/members/${userId}`, {
            reason, ...options
        }) as DiscordTypes.RESTDeleteAPIGuildMemberResult;
    }

    /**
     * @param guildId The guild ID.
     * @param query Request query.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#get-guild-bans)
     */
    public async getGuildBans (guildId: Snowflake, query: DiscordTypes.RESTGetAPIGuildBansQuery, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildBansResult> {
        return await this.request(`GET`, `/guilds/${guildId}/bans`, {
            query, ...options
        });
    }

    /**
     * @param guildId The guild ID.
     * @param userId The user ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#get-guild-ban)
     */
    public async getGuildBan (guildId: Snowflake, userId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildBanResult> {
        return await this.request(`GET`, `/guilds/${guildId}/bans/${userId}`, options);
    }

    /**
     * @param guildId The guild ID.
     * @param userId The user ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#create-guild-ban)
     */
    public async createGuildBan (guildId: Snowflake, userId: Snowflake, body: DiscordTypes.RESTPutAPIGuildBanJSONBody, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPutAPIGuildBanResult> {
        return await this.request(`PUT`, `/guilds/${guildId}/bans/${userId}`, {
            body, reason, ...options
        }) as DiscordTypes.RESTPutAPIGuildBanResult;
    }

    /**
     * @param guildId The guild ID.
     * @param userId The user ID.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#remove-guild-ban)
     */
    public async removeGuildBan (guildId: Snowflake, userId: Snowflake, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPIGuildBanResult> {
        return await this.request(`DELETE`, `/guilds/${guildId}/bans/${userId}`, {
            reason, ...options
        }) as DiscordTypes.RESTDeleteAPIGuildBanResult;
    }

    /**
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#get-guild-roles)
     */
    public async getGuildRoles (guildId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildRolesResult> {
        return await this.request(`GET`, `/guilds/${guildId}/roles`, options);
    }

    /**
     * @param guildId The guild ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#create-guild-role)
     */
    public async createGuildRole (guildId: Snowflake, body: DiscordTypes.RESTPostAPIGuildRoleJSONBody, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPostAPIGuildRoleResult> {
        return await this.request(`POST`, `/guilds/${guildId}/roles`, {
            body, reason, ...options
        });
    }

    /**
     * @param guildId The guild ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#modify-guild-role-positions)
     */
    public async modifyGuildRolePositions (guildId: Snowflake, body: DiscordTypes.RESTPatchAPIGuildRolePositionsJSONBody, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPatchAPIGuildRolePositionsResult> {
        return await this.request(`PATCH`, `/guilds/${guildId}/roles`, {
            body, reason, ...options
        });
    }

    /**
     * @param guildId The guild ID.
     * @param roleId The role ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#modify-guild-role)
     */
    public async modifyGuildRole (guildId: Snowflake, roleId: Snowflake, body: DiscordTypes.RESTPatchAPIGuildRoleJSONBody, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPatchAPIGuildRoleResult> {
        return await this.request(`PATCH`, `/guilds/${guildId}/roles/${roleId}`, {
            body, reason, ...options
        });
    }

    /**
     * @param guildId The guild ID.
     * @param roleId The role ID.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#delete-guild-role)
     */
    public async deleteGuildRole (guildId: Snowflake, roleId: Snowflake, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPIGuildRoleResult> {
        return await this.request(`DELETE`, `/guilds/${guildId}/roles/${roleId}`, {
            reason, ...options
        }) as DiscordTypes.RESTDeleteAPIGuildRoleResult;
    }

    /**
     * @param guildId The guild ID.
     * @param query Request query.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#get-guild-prune-count)
     */
    public async getGuildPruneCount (guildId: Snowflake, query: DiscordTypes.RESTGetAPIGuildPruneCountQuery, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildPruneCountResult> {
        return await this.request(`GET`, `/guilds/${guildId}/prune`, {
            query, ...options
        });
    }

    /**
     * @param guildId The guild ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#begin-guild-prune)
     */
    public async beginGuildPrune (guildId: Snowflake, body: DiscordTypes.RESTPostAPIGuildPruneJSONBody, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPostAPIGuildPruneResult> {
        return await this.request(`POST`, `/guilds/${guildId}/prune`, {
            body, reason, ...options
        });
    }

    /**
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#get-guild-voice-regions)
     */
    public async getGuildVoiceRegions (guildId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildVoiceRegionsResult> {
        return await this.request(`GET`, `/guilds/${guildId}/regions`, options);
    }

    /**
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#get-guild-invites)
     */
    public async getGuildInvites (guildId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildInvitesResult> {
        return await this.request(`GET`, `/guilds/${guildId}/invites`, options);
    }

    /**
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#get-guild-integrations)
     */
    public async getGuildIntegrations (guildId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildIntegrationsResult> {
        return await this.request(`GET`, `/guilds/${guildId}/integrations`, options);
    }

    /**
     * @param guildId The guild ID.
     * @param integrationId The integration ID.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#delete-guild-integration)
     */
    public async deleteGuildIntegration (guildId: Snowflake, integrationId: Snowflake, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPIGuildIntegrationResult> {
        return await this.request(`DELETE`, `/guilds/${guildId}/integrations/${integrationId}`, {
            reason, ...options
        }) as DiscordTypes.RESTDeleteAPIGuildIntegrationResult;
    }

    /**
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#get-guild-widget-settings)
     */
    public async getGuildWidgetSettings (guildId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildWidgetSettingsResult> {
        return await this.request(`GET`, `/guilds/${guildId}/widget`, options);
    }

    /**
     * @param guildId The guild ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#modify-guild-widget)
     */
    public async modifyGuildWidget (guildId: Snowflake, body: DiscordTypes.RESTPatchAPIGuildWidgetSettingsJSONBody, reason?:string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPatchAPIGuildWidgetSettingsResult> {
        return await this.request(`PATCH`, `/guilds/${guildId}/widget`, {
            body, reason, ...options
        });
    }

    /**
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#get-guild-widget)
     */
    public async getGuildWidget (guildId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildWidgetJSONResult> {
        return await this.request(`GET`, `/guilds/${guildId}/widget.json`, options);
    }

    /**
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#get-guild-vanity-url)
     */
    public async getGuildVanityURL (guildId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildVanityUrlResult> {
        return await this.request(`GET`, `/guilds/${guildId}/vanity-url`, options);
    }

    /**
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#get-guild-welcome-screen)
     */
    public async getGuildWelcomeScreen (guildId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildWelcomeScreenResult> {
        return await this.request(`GET`, `/guilds/${guildId}/welcome-screen`, options);
    }

    /**
     * @param guildId The guild ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#modify-guild-welcome-screen)
     */
    public async modifyGuildWelcomeScreen (guildId: Snowflake, body: DiscordTypes.RESTPatchAPIGuildWelcomeScreenJSONBody, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildWelcomeScreenResult> {
        return await this.request(`PATCH`, `/guilds/${guildId}/welcome-screen`, {
            body, reason, ...options
        });
    }

    /**
     * @param guildId The guild ID.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#modify-current-user-voice-state)
     */
    public async modifyCurrentUserVoiceState (guildId: Snowflake, body: DiscordTypes.RESTPatchAPIGuildVoiceStateCurrentMemberJSONBody, options?: RestRequestOptions): Promise<never> {
        return await this.request(`PATCH`, `/guilds/${guildId}/voice-states/@me`, {
            body, ...options
        }) as never;
    }

    /**
     * @param guildId The guild ID.
     * @param userId The user ID.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#modify-current-user-voice-state)
     */
    public async modifyUserVoiceState (guildId: Snowflake, userId: Snowflake, body: DiscordTypes.RESTPatchAPIGuildVoiceStateUserJSONBody, options?: RestRequestOptions): Promise<never> {
        return await this.request(`PATCH`, `/guilds/${guildId}/voice-states/${userId}`, {
            body, ...options
        }) as never;
    }

    // ------------------------------------

    /**
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/user#create-dm)
     */
    public async createDM (body: DiscordTypes.RESTPostAPICurrentUserCreateDMChannelJSONBody, options?: RestRequestOptions): Promise<DiscordTypes.RESTPostAPICurrentUserCreateDMChannelResult> {
        return await this.request(`POST`, `/users/@me/channels`, {
            body, ...options
        });
    }

    /**
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#get-gateway)
     */
    public async getGateway (options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGatewayResult> {
        return await this.request(`GET`, `/gateway`, options);
    }

    /**
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#get-gateway-bot)
     */
    public async getGatewayBot (options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGatewayBotResult> {
        return await this.request(`GET`, `/gateway/bot`, options);
    }
}
