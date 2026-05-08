import { mkdir, readFile, writeFile } from "node:fs/promises";

type QueueMember = {
  id: string;
  joinedAt: number;
};

export class Queue {
  messageId: string | undefined;
  members: QueueMember[];

  constructor() {
    this.messageId = undefined;
    this.members = [];
  }

  /**
   * @returns whether the user freshly joined the queue
   */
  join(id: string) {
    if (this.contains(id)) return false;

    this.members.push({
      id,
      joinedAt: Date.now(),
    });

    return true;
  }

  leave(id: string) {
    this.members = this.members.filter((member) => member.id !== id);
  }

  contains(id: string) {
    return this.members.some((member) => member.id === id);
  }

  sell(amount: number): QueueMember[] {
    return this.members.splice(0, amount);
  }

  move(id: string, position: number): boolean {
    const currentIndex = this.members.findIndex(({ id: memberId }) => memberId === id);

    if (currentIndex === -1) return false;

    const member = this.members[currentIndex];

    if (!member) return false;

    this.members.splice(currentIndex, 1);

    const clampedPosition = Math.max(0, Math.min(position, this.members.length));

    this.members.splice(clampedPosition, 0, member);

    return true;
  }

  async read() {
    try {
      const contents = await readFile("./data/queue.json", {
        encoding: "utf8",
      });
      const data = JSON.parse(contents || "{}");
      this.messageId = data.messageId;
      this.members = data.members ?? [];
    } catch (error) {
      console.error("Failed to read queue. Creating new queue", error);
      await this.write();
    }
  }

  async write() {
    await mkdir("./data", { recursive: true });
    await writeFile(
      "./data/queue.json",
      JSON.stringify({
        messageId: this.messageId,
        members: this.members,
      }),
    );
  }
}

export const queue = new Queue();
await queue.read();
