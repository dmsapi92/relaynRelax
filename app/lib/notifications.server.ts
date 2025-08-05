import type { User } from "@prisma/client";
import {
  ActivityAction,
  EntityType,
  NotificationType,
  SystemAdmin,
  type PrismaClient,
} from "@prisma/client";
import { getMessaging } from "firebase-admin/messaging";
import nodemailer from "nodemailer";
import { ENV } from "~/env.server";
import { getUserPrismaClient } from "~/lib/get-user-db.server";

// Define notification operation type
export type NotificationOperation = "CREATE" | "UPDATE" | "DELETE" | "VIEW";

// Add email transport configuration
const emailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: ENV.EMAIL_USER,
    pass: ENV.EMAIL_PASSWORD,
  },
});

// Function to create notification - make it non-blocking
async function createNotification(
  prismaClient: PrismaClient,
  institutionRecord: SystemAdmin,
  title: string,
  message: string,
  type: NotificationType,
  operation: NotificationOperation,
  userId: string,
  isPriority: boolean = false,
  targetUrl?: string
) {
  const notification = await prismaClient.notification.create({
    data: {
      userId,
      type,
      title,
      message,
      isRead: false,
      readAt: null,
    },
  });

  // // If FCM token exists, send push notification
  // if (institutionRecord.FcmToken) {
  //   await sendFCMNotificationDirect(
  //     institutionRecord.FcmToken,
  //     title,
  //     message,
  //     targetUrl || "/"
  //   );
  // }

  return notification;
}

export function setupNotificationMiddleware(
  prismaClient: PrismaClient,
  systemAdminRecord: SystemAdmin | null
) {
  if (!systemAdminRecord) return;

  prismaClient.$use(async (params, next) => {
    const result = await next(params);
    setImmediate(async () => {
      try {
        switch (params.model) {
          case "Transaction":
            if (params.action === "create") {
              const transaction = result;
              await createNotification(
                prismaClient,
                systemAdminRecord,
                "New Transaction",
                `A new transaction of ₹${
                  transaction.amount
                } has been ${transaction.transactionType.toLowerCase()}`,
                NotificationType.TRANSACTION,
                "CREATE",
                transaction.userId,
                true,
                `/transactions/${transaction.id}`
              );
            }
            if (params.action === "update") {
              const transaction = result;
              await createNotification(
                prismaClient,
                systemAdminRecord,
                "Transaction Updated",
                `Transaction #${transaction.id} has been updated`,
                NotificationType.TRANSACTION,
                "UPDATE",
                transaction.userId,
                true,
                `/transactions/${transaction.id}`
              );
            }
            if (params.action === "delete") {
              const transaction = result;
              await createNotification(
                prismaClient,
                systemAdminRecord,
                "Transaction Deleted",
                `Transaction #${transaction.id} has been deleted`,
                NotificationType.TRANSACTION,
                "DELETE",
                transaction.userId,
                true
              );
            }
            break;
          // ... existing cases ...
        }
      } catch (error) {
        console.error("Error sending notification:", error);
      }
    });
    return result;
  });
}

async function sendFCMNotificationDirect(
  FcmToken: any,
  title: string,
  body: string,
  link: string
) {
  const messaging = getMessaging();
  if (!FcmToken) return;
  const payload = {
    token: FcmToken,
    notification: {
      title: title,
      body: body,
    },
    webpush: {
      fcmOptions: {
        link: link, // Add the link to customer order details
      },
    },
  };

  return messaging.send(payload);
}

interface NotificationData {
  title: string;
  message: string;
  type: NotificationType;
}

/**
 * Creates a notification for transaction activities
 */
export async function createTransactionNotification(
  request: Request,
  userId: string,
  data: NotificationData
) {
  const { prisma } = await getUserPrismaClient(request);

  return prisma.notification.create({
    data: {
      userId,
      title: data.title,
      message: data.message,
      type: data.type,
    },
  });
}

/**
 * Logs transaction activity
 */
export async function logTransactionActivity(
  request: Request,
  {
    userId,
    transactionId,
    action,
    details,
    ipAddress,
    userAgent,
  }: {
    userId: string;
    transactionId: string;
    action: ActivityAction;
    details?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
  }
) {
  const { prisma } = await getUserPrismaClient(request);

  return prisma.activityLog.create({
    data: {
      userId,
      entityId: transactionId,
      entityType: EntityType.TRANSACTION,
      action,
      details: details || {},
      ipAddress,
      userAgent,
    },
  });
}

type TransactionAction = "CREATE" | "UPDATE" | "DELETE";

export async function notifyTransactionActivity(
  request: Request,
  user: User,
  action: Extract<ActivityAction, TransactionAction>,
  transactionDetails: {
    amount: number;
    type: string;
  }
) {
  const actionMessages: Record<TransactionAction, string> = {
    CREATE: "New transaction created",
    UPDATE: "Transaction updated",
    DELETE: "Transaction deleted",
  };

  const notificationData: NotificationData = {
    title: actionMessages[action],
    message: `${actionMessages[action]} - ${transactionDetails.type} of ₹${transactionDetails.amount}`,
    type: NotificationType.TRANSACTION,
  };

  await createTransactionNotification(request, user.id, notificationData);
}
