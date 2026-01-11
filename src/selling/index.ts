import { mkdir, readFile, writeFile } from "node:fs/promises";

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

  constructor() {
    this.sales = [];
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
  }

  async read() {
    try {
      const contents = await readFile("./data/selling.json", {
        encoding: "utf8",
      });
      const data = JSON.parse(contents || "{}");
      this.sales = data.sales ?? [];
    } catch (error) {
      console.error("Failed to read selling. Creating new selling", error);
      await this.write();
    }
  }

  async write() {
    await mkdir("./data", { recursive: true });
    await writeFile("./data/selling.json", JSON.stringify({ sales: this.sales }));
  }
}

export const selling = new Selling();
await selling.read();
