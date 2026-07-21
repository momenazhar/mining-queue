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
  cooldowns: Record<string, number>; // sellerId -> cooldown after closing a sale
  pullCooldowns: Record<string, number>; // sellerId -> cooldown between pulls

  constructor() {
    this.sales = [];
    this.cooldowns = {};
    this.pullCooldowns = {};
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
    this.pruneExpired(this.cooldowns);
  }

  getCooldownRemaining(sellerId: string): number {
    const until = this.cooldowns[sellerId];
    if (!until) return 0;
    return Math.max(0, until - Date.now());
  }

  stampPullCooldown(sellerId: string) {
    this.pullCooldowns[sellerId] = Date.now() + config.pullCooldownMs;
    this.pruneExpired(this.pullCooldowns);
  }

  getPullCooldownRemaining(sellerId: string): number {
    const until = this.pullCooldowns[sellerId];
    if (!until) return 0;
    return Math.max(0, until - Date.now());
  }

  private pruneExpired(cooldowns: Record<string, number>) {
    const now = Date.now();
    for (const id of Object.keys(cooldowns)) {
      if (cooldowns[id]! <= now) delete cooldowns[id];
    }
  }

  async read() {
    try {
      const contents = await readFile("./data/selling.json", {
        encoding: "utf8",
      });
      const data = JSON.parse(contents || "{}");
      this.sales = data.sales ?? [];
      this.cooldowns = data.cooldowns ?? {};
      this.pullCooldowns = data.pullCooldowns ?? {};
    } catch (error) {
      console.error("Failed to read selling. Creating new selling", error);
      await this.write();
    }
  }

  async write() {
    await mkdir("./data", { recursive: true });
    await writeFile(
      "./data/selling.json",
      JSON.stringify({ sales: this.sales, cooldowns: this.cooldowns, pullCooldowns: this.pullCooldowns }),
    );
  }
}

export const selling = new Selling();
await selling.read();
