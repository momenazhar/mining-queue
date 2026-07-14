import { MessageFlags, type CacheType, type ChatInputCommandInteraction } from "discord.js";
import { updateQueueMessage } from "../queue/message.ts";
import { queue } from "../queue/index.ts";
import { embedReply } from "../embeds.ts";
import { messages } from "../messages.ts";

const resetRoleId = process.env.DISCORD_RESET_ROLE_ID;
const queueChannelId = process.env.DISCORD_QUEUE_CHANNEL_ID;

export async function reset(interaction: ChatInputCommandInteraction<CacheType>) {
  await interaction.deferReply({ flags: MessageFlags.Ephemeral });

  queue.members = [];
  await queue.write();

  await updateQueueMessage(queue);
  await interaction.editReply(embedReply("info", messages.commands.reset));

  try {
    if (!queueChannelId) {
      throw new Error("Queue channel is not found");
    }

    const channel = await interaction.client.channels.fetch(queueChannelId);
    if (channel && channel.isTextBased() && "send" in channel) {
      const pingMsg = await channel.send({
        content: `<@&${resetRoleId}>`,
        allowedMentions: { roles: resetRoleId ? [resetRoleId] : [] },
      });
      await pingMsg.delete();
    }
  } catch (error) {
    console.error("Failed to ghost ping:", error);
  }
}
