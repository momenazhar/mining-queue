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
      description:
        "Refresh the bot's interactions, and re-send the queue message if it was deleted",
    },
    reset: {
      name: "reset",
      description: "Remove everyone from the queue",
    },
  },
  emojis: {
    leave: "<leave:1459965259262726349>",
    close: "<close:1459965258054631746>",
  },
};
