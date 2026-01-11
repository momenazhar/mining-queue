import {
  ContainerBuilder,
  MessageFlags,
  SeparatorBuilder,
  SeparatorSpacingSize,
  TextDisplayBuilder,
  type InteractionReplyOptions,
} from "discord.js";

const errors = {
  threadIsNotSale: "This thread is not assiocated with a sale",
  cantSellBecauseQueueEmpty: "You can't sell since the queue is empty",
  cantPullBecauseQueueEmpty: "You can't pull since the queue is empty",
};

export function errorEmbed(
  error: keyof typeof errors,
  flags = MessageFlags.Ephemeral,
): InteractionReplyOptions {
  return {
    flags: flags === undefined ? MessageFlags.IsComponentsV2 : MessageFlags.IsComponentsV2 | flags,
    components: [
      new ContainerBuilder()
        .setAccentColor(14757936)
        .addTextDisplayComponents(new TextDisplayBuilder().setContent(errors[error]))
        .addSeparatorComponents(
          new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true),
        )
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            `-# Mining Cult - <@${process.env.DISCORD_CLIENT_CREATOR_ID}>`,
          ),
        )
        .toJSON(),
    ],
  };
}
