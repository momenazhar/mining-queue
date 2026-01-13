import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ContainerBuilder,
  MessageFlags,
  SeparatorBuilder,
  SeparatorSpacingSize,
  TextDisplayBuilder,
  type MessageActionRowComponentBuilder,
  type RESTPostAPIChannelMessageJSONBody,
} from "discord.js";
import type { Queue } from "./index.ts";
import { config } from "../config.ts";
import { editMessage, sendMessage } from "../rest.ts";

export async function updateQueueMessage(queue: Queue) {
  const messagePayload = {
    allowed_mentions: { parse: [] },
    flags: MessageFlags.IsComponentsV2,
    components: [
      new ContainerBuilder()
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(`## ${config.emojis.gdrag} Golden Dragon Egg Queue`),
        )
        .addSeparatorComponents(
          new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(false),
        )
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            queue.members.length > 0
              ? queue.members
                  .slice(0, 50)
                  .map(
                    (member, index) =>
                      `\`#${index + 1}\` <@${member.id}>: <t:${Math.round(member.joinedAt / 1000)}:t>`,
                  )
                  .join("\n") +
                  (queue.members.length > 50 ? `and \`${queue.members.length - 50}\` more` : "")
              : "The queue is empty",
          ),
        )
        .addSeparatorComponents(
          new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(false),
        )
        .addActionRowComponents(
          new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
            new ButtonBuilder()
              .setCustomId(config.buttons.queueJoinId)
              .setEmoji(config.emojis.join)
              .setLabel("Join")
              .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
              .setCustomId(config.buttons.queueLeaveId)
              .setEmoji(config.emojis.leave)
              .setLabel("Leave")
              .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
              .setCustomId(config.buttons.createSaleId)
              .setEmoji(config.emojis.sell)
              .setLabel("Sell")
              .setStyle(ButtonStyle.Primary)
              .setDisabled(queue.members.length === 0),
            new ButtonBuilder()
              .setCustomId(config.buttons.queuePositionId)
              .setEmoji(config.emojis.position)
              .setLabel("Position")
              .setStyle(ButtonStyle.Secondary),
          ),
        )
        .addSeparatorComponents(
          new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true),
        )
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            `-# Mining Cult • <@${process.env.DISCORD_CLIENT_CREATOR_ID}>`,
          ),
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
