import { PrismaClient } from "@prisma/client";
import { ENV } from "../env.server";

// Master database client for global operations
let masterPrisma: PrismaClient;

declare global {
  var __master_db__: PrismaClient;
}

if (ENV.NODE_ENV === "production") {
  masterPrisma = new PrismaClient({
    datasources: {
      db: {
        url: ENV.MASTER_DATABASE_URL,
      },
    },
  });
} else {
  if (!global.__master_db__) {
    global.__master_db__ = new PrismaClient({
      datasources: {
        db: {
          url: ENV.MASTER_DATABASE_URL,
        },
      },
    });
  }
  masterPrisma = global.__master_db__;
}

export { masterPrisma };
