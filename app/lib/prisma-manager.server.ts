import { PrismaClient } from "@prisma/client";
import { SystemAdmin } from "prisma/schema/generated/zod";
import { setupNotificationMiddleware } from "./notifications.server";

interface PrismaClientWithTimer {
  client: PrismaClient;
  timer: NodeJS.Timeout | null;
  lastAccess: number;
}

export class PrismaManager {
  private clients: Map<string, PrismaClientWithTimer>;
  private readonly timeout: number;

  constructor(timeoutMs: number = 60000) {
    // Default 1 minute timeout
    this.clients = new Map();
    this.timeout = timeoutMs;
  }

  async getPrismaClient(
    dbUrl: string,
    systemAdminRecord: SystemAdmin | null
  ): Promise<PrismaClient> {
    const existing = this.clients.get(dbUrl);

    if (existing) {
      this.resetTimer(dbUrl);
      return existing.client;
    }

    const client = new PrismaClient({
      datasources: { db: { url: dbUrl } },
    });

    setupNotificationMiddleware(client, systemAdminRecord);

    this.clients.set(dbUrl, {
      client,
      timer: this.startTimer(dbUrl),
      lastAccess: Date.now(),
    });

    return client;
  }

  private startTimer(dbUrl: string): NodeJS.Timeout {
    return setTimeout(() => this.closeClient(dbUrl), this.timeout);
  }

  private resetTimer(dbUrl: string): void {
    const client = this.clients.get(dbUrl);
    if (!client) return;

    if (client.timer) {
      clearTimeout(client.timer);
    }

    client.timer = this.startTimer(dbUrl);
    client.lastAccess = Date.now();
  }

  private async closeClient(dbUrl: string): Promise<void> {
    const client = this.clients.get(dbUrl);
    if (!client) return;

    await client.client.$disconnect();
    this.clients.delete(dbUrl);
  }
}

// Singleton instance
export const prismaManager = new PrismaManager();
