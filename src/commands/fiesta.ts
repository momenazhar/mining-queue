import {
  ContainerBuilder,
  MessageFlags,
  SeparatorSpacingSize,
  type CacheType,
  type ChatInputCommandInteraction,
  type InteractionEditReplyOptions,
} from "discord.js";
import { config } from "../config.ts";
import { getCurrentFiestaYear, getFiestas } from "../fiesta.ts";

const PATCH_NOTES_URL =
  "https://hypixel.net/threads/hypixel-skyblock-0-24-2-hub-revamp-latest-minecraft-year-of-the-witch-and-more.6063723/";

export async function fiesta(interaction: ChatInputCommandInteraction<CacheType>) {
  await interaction.deferReply();

  const year = interaction.options.getInteger("year", false) ?? getCurrentFiestaYear();

  const lines = getFiestas(year).map((entry, index) => {
    const number = index + 1;
    const startSeconds = Math.round(entry.start / 1000);
    const endSeconds = Math.round(entry.end / 1000);

    const line = `\`${number}.\` ${entry.emoji} <t:${startSeconds}:f> <t:${startSeconds}:R> → <t:${endSeconds}:f>`;

    if (entry.skipped) {
      return `~~${line}~~\n-# ${config.emojis.br} Skipped due to Fiesta time changes in [Patch 0.24.2](<${PATCH_NOTES_URL}>)`;
    }

    return `${line}  `;
  });

  const component = new ContainerBuilder()
    .addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent(`# ${config.emojis.fiesta} Mining Fiesta Times`).setId(2),
    )
    .addSeparatorComponents((separator) => separator.setDivider(true).setSpacing(SeparatorSpacingSize.Small).setId(3))
    .addTextDisplayComponents((textDisplay) => textDisplay.setContent(lines.join("\n")).setId(4))
    .addSeparatorComponents((separator) => separator.setDivider(true).setSpacing(SeparatorSpacingSize.Small).setId(5))
    .addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent("-# **These times are relative to your own timezone**").setId(6),
    )
    .setId(1);

  await interaction.editReply({
    flags: MessageFlags.IsComponentsV2,
    components: [component.toJSON()],
  } as InteractionEditReplyOptions);
}
