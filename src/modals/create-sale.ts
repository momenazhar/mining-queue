import { MessageFlags, ChannelType, type CacheType, type ModalSubmitInteraction } from "discord.js";
import { queue } from "../queue/index.ts";
import { updateQueueMessage } from "../queue/message.ts";
import { addThreadMember, createThread } from "../rest.ts";
import { selling } from "../selling/index.ts";
import { updateSaleMessage } from "../selling/message.ts";

export async function onCreateSaleSubmit(interaction: ModalSubmitInteraction<CacheType>) {
  if (queue.contains(interaction.user.id)) {
    return interaction.reply({
      content: "You can't sell if you are in the queue",
      flags: MessageFlags.Ephemeral,
    });
  }

  if (queue.members.length === 0) {
    return interaction.reply({
      content: "You can't sell since the queue is empty",
      flags: MessageFlags.Ephemeral,
    });
  }

  if (selling.containsSeller(interaction.user.id)) {
    return interaction.reply({
      content: "You can't sell since you are already selling",
      flags: MessageFlags.Ephemeral,
    });
  }

  const [value] = interaction.fields.getStringSelectValues("members");
  const amountOfMembers = parseInt(value!);

  const members = queue.sell(amountOfMembers);
  await queue.write();
  await updateQueueMessage(queue);

  const thread = await createThread(process.env.DISCORD_QUEUE_CHANNEL_ID, {
    type: ChannelType.PrivateThread,
    name: `${interaction.user.displayName}`,
    invitable: false,
  });

  const sale = selling.createSale(
    { id: interaction.user.id, displayName: interaction.user.displayName },
    members.map((member) => member.id),
    thread.id,
  );

  await selling.write();

  await Promise.all([
    addThreadMember(thread.id, interaction.user.id),
    ...members.map((member) => addThreadMember(thread.id, member.id)),
  ]);

  await updateSaleMessage(sale);

  return interaction.reply({
    content: `Created a thread <#${thread.id}>`,
    flags: MessageFlags.Ephemeral,
  });
}
