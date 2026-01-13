export const messages = {
  closeSale: {
    threadNoSale: "This thread is not assiocated with a sale",
    cannotClose: "Only moderators or the seller can close a sale",
    threadDelete: "Deleting...",
  },
  createSale: {
    cannotSellInQueue: "You can't sell if you are in the queue",
    emptyQueue: "You can't sell since the queue is empty",
    alreadySelling: "You can't sell since you are already selling",
  },
  joinQueue: {
    alreadyInQueue: "You are already in the queue",
    involvedInSale: "You can't join the queue because you are already involved in a sale",
    alreadyInSale: "You can't join the queue because you are already involved in a sale",
    joined: "You joined the queue",
  },
  leaveQueue: {
    left: "You left the queue",
  },
  leaveSale: {
    threadNoSale: "This thread is not assiocated with a sale",
    allMembersLeft: "Deleting sale since all members left",
    onlyMembersCanLeave: "Only members of the sale can leave",
    leaving: "Leaving...",
  },
  positionQueue: {
    notInQueue: "You are not in the queue",
    position: (position: number) => `You are position \`#${position}\` in the queue`,
  },
  pullQueue: {
    threadNoSale: "This thread is not assiocated with a sale",
    noPullEmptyQueue: "You can't pull since the queue is empty",
    pulled: "Successfully pulled",
    cannotPull: "Only moderators or the seller can pull",
  },
  commands: {
    reset: "Reset!",
    sync: "Synced!",
  },
  modals: {
    cannotSellInQueue: "You can't sell if you are in the queue",
    emptyQueue: "You can't sell since the queue is empty",
    alreadySelling: "You can't sell since you are already selling",
    createThread: (threadId: string) => `Created a thread <#${threadId}>`,
  },
};
