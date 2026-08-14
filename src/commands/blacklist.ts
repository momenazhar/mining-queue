import { MessageFlags, type CacheType, type ChatInputCommandInteraction } from "discord.js";
import { blacklist, type BlacklistEntryType } from "../blacklist/index.ts";
import { messages } from "../messages.ts";
import { embedReply } from "../embeds.ts";

export async function blacklistCommand(interaction: ChatInputCommandInteraction<CacheType>) {
  await interaction.deferReply({ flags: MessageFlags.Ephemeral });

  const subcommand = interaction.options.getSubcommand(true);

  switch (subcommand) {
    case "add": {
      const option = interaction.options.get("target", true);
      const id = option.role?.id ?? option.user!.id;
      const type: BlacklistEntryType = option.role ? "role" : "user";
      const reason = interaction.options.getString("reason", false) ?? undefined;

      const added = blacklist.add(id, type, reason);

      if (!added) {
        await interaction.editReply(embedReply("error", messages.blacklist.alreadyBlacklisted));
        return;
      }

      await blacklist.write();
      await interaction.editReply(embedReply("info", messages.blacklist.added(id, type)));
      return;
    }
    case "remove": {
      const option = interaction.options.get("target", true);
      const id = option.role?.id ?? option.user!.id;
      const entry = blacklist.entries.find((e) => e.id === id);

      if (!entry) {
        await interaction.editReply(embedReply("error", messages.blacklist.notBlacklisted));
        return;
      }

      blacklist.remove(id);
      await blacklist.write();
      await interaction.editReply(embedReply("info", messages.blacklist.removed(entry.id, entry.type)));
      return;
    }
    case "list": {
      await interaction.editReply(embedReply("info", messages.blacklist.list(blacklist.entries)));
      return;
    }
  }
}
