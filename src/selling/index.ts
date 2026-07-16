import { mkdir, readFile, writeFile } from "node:fs/promises";
import { config } from "../config.ts";

export interface Seller {
  id: string;
  displayName: string;
}

export interface Sale {
  threadId: string;
  messageId?: string;
  seller: Seller;
  memberIds: string[];
}

export class Selling {
  sales: Sale[];
  cooldowns: Record<string, number>;

  constructor() {
    this.sales = [];
    this.cooldowns = {};
  }

  containsSeller(sellerId: string) {
    return this.sales.some((sale) => sale.seller.id === sellerId);
  }

  containsMember(memberId: string) {
    return this.sales.some((sale) => sale.memberIds.includes(memberId));
  }

  getSaleByThreadId(threadId: string) {
    return this.sales.find((sale) => sale.threadId === threadId);
  }

  createSale(seller: Seller, memberIds: string[], threadId: string): Sale {
    const sale = {
      seller,
      memberIds,
      threadId,
    };
    this.sales.push(sale);
    return sale;
  }

  deleteSale(sellerId: string) {
    this.sales = this.sales.filter((s) => s.seller.id !== sellerId);
    this.cooldowns[sellerId] = Date.now() + config.saleCooldownMs;

    const now = Date.now();
    for (const id of Object.keys(this.cooldowns)) {
      if (this.cooldowns[id]! <= now) delete this.cooldowns[id];
    }
  }

  getCooldownRemaining(sellerId: string): number {
    const until = this.cooldowns[sellerId];
    if (!until) return 0;
    return Math.max(0, until - Date.now());
  }

  async read() {
    try {
      const contents = await readFile("./data/selling.json", {
        encoding: "utf8",
      });
      const data = JSON.parse(contents || "{}");
      this.sales = data.sales ?? [];
      this.cooldowns = data.cooldowns ?? {};
    } catch (error) {
      console.error("Failed to read selling. Creating new selling", error);
      await this.write();
    }
  }

  async write() {
    await mkdir("./data", { recursive: true });
    await writeFile("./data/selling.json", JSON.stringify({ sales: this.sales, cooldowns: this.cooldowns }));
  }
}

export const selling = new Selling();
await selling.read();
