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
import { selling, type Sale } from "./index.ts";
import { config } from "../config.ts";
import { editMessage, sendMessage } from "../rest.ts";

export async function updateSaleMessage(sale: Sale) {
  const messagePayload = {
    allowed_mentions: {
      parse: ["roles"],
      roles: ["1458558083402825869"],
    },
    flags: MessageFlags.IsComponentsV2,
    components: [
      new ContainerBuilder()
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            [
              `# ${sale.seller.displayName}'s New Sale`,
              `- Seller: <@${sale.seller.id}>`,
              `- Members: ${sale.memberIds.map((id) => `<@${id}>`).join(", ")}`,
            ].join("\n"),
          ),
        )
        .addTextDisplayComponents(new TextDisplayBuilder().setContent("<@&1458558083402825869>"))
        .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
        .addActionRowComponents(
          new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
            new ButtonBuilder()
              .setLabel("Pull")
              .setStyle(ButtonStyle.Primary)
              .setEmoji(config.emojis.pull)
              .setCustomId(config.buttons.pullQueueId),
            new ButtonBuilder()
              .setLabel("Leave")
              .setStyle(ButtonStyle.Danger)
              .setEmoji(config.emojis.leave)
              .setCustomId(config.buttons.leaveSaleId),
            new ButtonBuilder()
              .setLabel("Close")
              .setStyle(ButtonStyle.Danger)
              .setEmoji(config.emojis.close)
              .setCustomId(config.buttons.closeSaleId),
          ),
        )
        .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(`-# Mining Cult • <@${process.env.DISCORD_CLIENT_CREATOR_ID}>`),
        )
        .toJSON(),
    ],
  } as RESTPostAPIChannelMessageJSONBody;

  if (sale.messageId) {
    try {
      await editMessage(sale.threadId, sale.messageId, messagePayload);
    } catch {
      const message = await sendMessage(sale.threadId, messagePayload);
      sale.messageId = message.id;
      await selling.write();
    }
  } else {
    const message = await sendMessage(sale.threadId, messagePayload);
    sale.messageId = message.id;
    await selling.write();
  }
}
