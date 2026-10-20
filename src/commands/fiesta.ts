import { type CacheType, type ChatInputCommandInteraction } from "discord.js";
import { config } from "../config.ts";
import { embedReply } from "../embeds.ts";

const PATCH_NOTES =
  "https://hypixel.net/threads/hypixel-skyblock-0-27-2-the-minister-update-greenhouse-qol-and-more.6159904/#-%E2%9E%A5-mining-fiesta-rework-zj2";

export async function fiesta(interaction: ChatInputCommandInteraction<CacheType>) {
  await interaction.reply(
    embedReply(
      "info",
      [
        `# ${config.emojis.fiesta} No need to calculate Mining Fiestas anymore`,
        `Hypixel has reworked Mining Fiestas, as of the 0.27.2 update, and now they are on a fixed schedule. [Patch Notes](${PATCH_NOTES})`,
      ].join("\n"),
    ),
  );
}
