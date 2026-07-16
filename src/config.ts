import { ApplicationCommandOptionType } from "discord.js";

export const config = {
  modals: {
    createSaleId: "create-sale",
  },
  buttons: {
    queueJoinId: "queue-join",
    queueLeaveId: "queue-leave",
    queuePositionId: "queue-position",
    createSaleId: "create-sale",
    closeSaleId: "close-sale",
    leaveSaleId: "leave-sale",
    pullQueueId: "pull-queue",
  },
  commands: {
    sync: {
      name: "sync",
      description: "Refresh the bot's interactions, and re-send the queue message if it was deleted",
    },
    reset: {
      name: "reset",
      description: "Remove everyone from the queue",
    },
    move: {
      name: "move",
      description: "Move a person to a different position in the queue",
      options: [
        {
          name: "user",
          type: ApplicationCommandOptionType.User,
          required: true,
          description: "User to move",
        },
        {
          name: "position",
          type: ApplicationCommandOptionType.Integer,
          required: true,
          description: "New position to move to",
          minValue: 1,
        },
      ],
    },
  },
  emojis: {
    leave: "<:leave:1459965259262726349>",
    close: "<:close:1459965258054631746>",
    gdrag: "<:gdrag:1460709351424524409>",
    join: "<:join:1460714492412559475>",
    sell: "<:sell:1460714493893017795>",
    position: "<:position:1460715206522175610>",
    pull: "<:pull:1460717649922097274>",
  },
  saleCooldownMs: 3 * 60 * 1000, // 3 minutes
};
