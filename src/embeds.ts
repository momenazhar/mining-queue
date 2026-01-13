import {
  ContainerBuilder,
  MessageFlags,
  TextDisplayBuilder,
  type InteractionEditReplyOptions,
  type InteractionReplyOptions,
} from "discord.js";

type EmbedKind = "info" | "error";

export function embedReply(
  kind: EmbedKind,
  content: string,
  flags = MessageFlags.Ephemeral,
): InteractionEditReplyOptions & InteractionReplyOptions {
  return {
    flags: flags === undefined ? MessageFlags.IsComponentsV2 : MessageFlags.IsComponentsV2 | flags,
    components: [
      new ContainerBuilder()
        .setAccentColor(kind === "error" ? 14757936 : undefined)
        .addTextDisplayComponents(new TextDisplayBuilder().setContent(content))
        .toJSON(),
    ],
  };
}
