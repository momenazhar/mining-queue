import { mkdir, readFile, writeFile } from "node:fs/promises";

type QueueMember = {
  id: string;
  joinedAt: number;
};

export class Queue {
  messageId: string | undefined;
  members: QueueMember[];
  selling: string[];

  constructor() {
    this.messageId = undefined;
    this.members = [];
    this.selling = [];
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

  sell(id: string, amount: number): QueueMember[] {
    this.selling.push(id);
    return this.members.splice(0, amount);
  }

  async read() {
    try {
      const contents = await readFile("./data/queue.json", {
        encoding: "utf8",
      });
      const data = JSON.parse(contents || "{}");
      this.messageId = data.messageId;
      this.members = data.members ?? [];
      this.selling = data.selling ?? [];
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
        selling: this.selling,
      }),
    );
  }
}

export const queue = new Queue();
await queue.read();
