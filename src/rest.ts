import {
  type APIMessage,
  type APIThreadChannel,
  REST,
  type RESTPatchAPIChannelMessageJSONBody,
  type RESTPostAPIChannelMessageJSONBody,
  type RESTPostAPIChannelThreadsJSONBody,
  Routes,
} from "discord.js";

export const rest = new REST({ version: "10" }).setToken(
  process.env.DISCORD_CLIENT_TOKEN,
);

export function sendMessage(
  channelId: string,
  message: RESTPostAPIChannelMessageJSONBody,
): Promise<APIMessage> {
  return rest.post(Routes.channelMessages(channelId), {
    body: message,
  }) as Promise<APIMessage>;
}

export function editMessage(
  channelId: string,
  messageId: string,
  message: RESTPatchAPIChannelMessageJSONBody,
) {
  return rest.patch(Routes.channelMessage(channelId, messageId), {
    body: message,
  }) as Promise<APIMessage>;
}

export function createThread(
  channelId: string,
  thread: RESTPostAPIChannelThreadsJSONBody,
) {
  return rest.post(Routes.threads(channelId), {
    body: thread,
  }) as Promise<APIThreadChannel>;
}

export function addThreadMembers(threadId: string, userId: string) {
  return rest.put(Routes.threadMembers(threadId, userId));
}
