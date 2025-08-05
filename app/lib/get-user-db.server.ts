import { ENV } from "~/env.server";
import { masterPrisma } from "~/lib/db.server";
import { getsystemId } from "~/utils/session.server";
import { prismaManager } from "./prisma-manager.server";

export async function getUserPrismaClient(
  input: Request | string,
  createDb: boolean = false
) {
  // Get userId either from session or direct input
  const SystemId = typeof input === "string" ? input : await getsystemId(input);

  if (!SystemId) {
    throw new Error("User not authenticated");
  }

  // Fetch user's database info from master database

  if (createDb && typeof input === "string") {
    const userDbUrl = ENV.USER_DATABASE_URL_TEMPLATE!.replace(
      "{dbname}",
      input
    );

    // Get or create Prisma client for this database
    const prismaClient = await prismaManager.getPrismaClient(userDbUrl, null);

    // Return both the Prisma client and the restaurant record
    return {
      prisma: prismaClient,
      systemAdminRecord: null,
    };
  } else {
    const systemAdminRecord = await masterPrisma.systemAdmin.findFirst({
      where: { SystemId: SystemId },
    });
    if (!systemAdminRecord) {
      throw new Error(`User ${SystemId} not found in master database`);
    }

    // Generate database URL from template
    const userDbUrl = ENV.USER_DATABASE_URL_TEMPLATE!.replace(
      "{dbname}",
      systemAdminRecord.SystemId ?? ""
    );

    // Get or create Prisma client for this database
    const prismaClient = await prismaManager.getPrismaClient(
      userDbUrl,
      systemAdminRecord
    );

    // Return both the Prisma client and the restaurant record
    return {
      prisma: prismaClient,
      systemAdminRecord: systemAdminRecord,
    };
  }
}
