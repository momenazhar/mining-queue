import { MessageFlags, type ButtonInteraction, type CacheType } from "discord.js";
import { queue } from "../queue/index.ts";
import { updateQueueMessage } from "../queue/message.ts";
import { selling } from "../selling/index.ts";
import { messages } from "../messages.ts";
import { embedReply } from "../embeds.ts";

export async function onJoinQueueClick(interaction: ButtonInteraction<CacheType>) {
  await interaction.deferReply({ flags: MessageFlags.Ephemeral });

  const joined = queue.join(interaction.user.id);

  if (!joined) {
    await interaction.editReply(embedReply("error", messages.joinQueue.alreadyInQueue));
    return;
  }

  if (selling.containsMember(interaction.user.id) || selling.containsSeller(interaction.user.id)) {
    await interaction.editReply(embedReply("error", messages.joinQueue.alreadyInSale));
    return;
  }

  await queue.write();

  await updateQueueMessage(queue);
  await interaction.editReply(embedReply("info", messages.joinQueue.joined));
}
