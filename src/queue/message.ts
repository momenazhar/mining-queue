import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  type RESTPostAPIChannelMessageJSONBody,
} from "discord.js";
import type { Queue } from "./index.ts";
import { config } from "../config.ts";
import { editMessage, sendMessage } from "../rest.ts";

export async function updateQueueMessage(queue: Queue) {
  const messagePayload = {
    embeds: [
      new EmbedBuilder()
        .setTitle("Queue")
        .setDescription(
          "**Members**\n" +
            queue.members
              .slice(0, 50)
              .map(
                (member, index) =>
                  `\`#${index + 1}\` <@${member.id}>: <t:${Math.round(member.joinedAt / 1000)}>`,
              )
              .join("\n") +
            (queue.members.length > 50 ? `and \`${queue.members.length - 50}\` more` : ""),
        )
        .toJSON(),
    ],
    components: [
      new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId(config.buttons.queueJoinId)
            .setLabel("Join")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId(config.buttons.queueLeaveId)
            .setLabel("Leave")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId(config.buttons.createSaleId)
            .setLabel("Sell")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(queue.members.length === 0),
          new ButtonBuilder()
            .setCustomId(config.buttons.queuePositionId)
            .setLabel("Position")
            .setStyle(ButtonStyle.Primary),
        )
        .toJSON(),
    ],
  } as RESTPostAPIChannelMessageJSONBody;

  if (queue.messageId) {
    try {
      await editMessage(process.env.DISCORD_QUEUE_CHANNEL_ID, queue.messageId, messagePayload);
    } catch {
      const message = await sendMessage(process.env.DISCORD_QUEUE_CHANNEL_ID, messagePayload);
      queue.messageId = message.id;
      await queue.write();
    }
  } else {
    const message = await sendMessage(process.env.DISCORD_QUEUE_CHANNEL_ID, messagePayload);
    queue.messageId = message.id;
    await queue.write();
  }
}
