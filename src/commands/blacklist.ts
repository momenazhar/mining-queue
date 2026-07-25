import { MessageFlags, type CacheType, type ChatInputCommandInteraction } from "discord.js";
import { blacklist } from "../blacklist/index.ts";
import { messages } from "../messages.ts";
import { embedReply } from "../embeds.ts";

export async function blacklistCommand(interaction: ChatInputCommandInteraction<CacheType>) {
  await interaction.deferReply({ flags: MessageFlags.Ephemeral });

  const subcommand = interaction.options.getSubcommand(true);

  switch (subcommand) {
    case "add": {
      const user = interaction.options.getUser("user", true);
      const reason = interaction.options.getString("reason", false) ?? undefined;

      const added = blacklist.add(user.id, reason);

      if (!added) {
        await interaction.editReply(embedReply("error", messages.blacklist.alreadyBlacklisted));
        return;
      }

      await blacklist.write();
      await interaction.editReply(embedReply("info", messages.blacklist.added(user.id)));
      return;
    }
    case "remove": {
      const user = interaction.options.getUser("user", true);

      const removed = blacklist.remove(user.id);
      if (!removed) {
        await interaction.editReply(embedReply("error", messages.blacklist.notBlacklisted));
        return;
      }

      await blacklist.write();
      await interaction.editReply(embedReply("info", messages.blacklist.removed(user.id)));
      return;
    }
    case "list": {
      await interaction.editReply(embedReply("info", messages.blacklist.list(blacklist.entries)));
      return;
    }
  }
}
