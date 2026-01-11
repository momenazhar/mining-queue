import { MessageFlags, type ButtonInteraction, type CacheType } from "discord.js";
import { queue } from "../queue/index.ts";
import { updateQueueMessage } from "../queue/message.ts";
import { selling } from "../selling/index.ts";

export async function onJoinQueueClick(interaction: ButtonInteraction<CacheType>) {
  const joined = queue.join(interaction.user.id);

  if (!joined) {
    await interaction.reply({
      content: "You are already in the queue",
      flags: MessageFlags.Ephemeral,
    });

    return;
  }

  if (selling.containsMember(interaction.user.id) || selling.containsSeller(interaction.user.id)) {
    await interaction.reply({
      content: "You can't join the queue because you are already involved in a sale",
      flags: MessageFlags.Ephemeral,
    });

    return;
  }

  await queue.write();

  await Promise.all([
    interaction.reply({
      content: "Joined the queue!",
      flags: MessageFlags.Ephemeral,
    }),
    updateQueueMessage(queue),
  ]);
}
