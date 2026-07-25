import { mkdir, readFile, writeFile } from "node:fs/promises";

export type BlacklistEntry = {
  id: string;
  reason?: string;
  addedAt: number;
};

export class Blacklist {
  entries: BlacklistEntry[];

  constructor() {
    this.entries = [];
  }

  contains(id: string): boolean {
    return this.entries.some((entry) => entry.id === id);
  }

  /**
   * @returns whether the user was successfully added to the blacklist
   */
  add(id: string, reason?: string) {
    if (this.contains(id)) return false;

    this.entries.push({
      id,
      addedAt: Date.now(),
      ...(reason ? { reason } : {}),
    });

    return true;
  }

  /**
   * @returns whether the user was successfully removed from the blacklist
   */
  remove(id: string) {
    const lengthBefore = this.entries.length;
    this.entries = this.entries.filter((entry) => entry.id !== id);
    return this.entries.length !== lengthBefore;
  }

  async read() {
    try {
      const contents = await readFile("./data/blacklist.json", {
        encoding: "utf8",
      });
      const data = JSON.parse(contents || "{}");
      this.entries = data.entries ?? [];
    } catch (error) {
      console.error("Failed to read blacklist. Creating new blacklist", error);
      await this.write();
    }
  }

  async write() {
    await mkdir("./data", { recursive: true });
    await writeFile("./data/blacklist.json", JSON.stringify({ entries: this.entries }));
  }
}

export const blacklist = new Blacklist();
await blacklist.read();
