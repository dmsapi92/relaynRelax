import {
  Button,
  Card,
  CardBody,
  Chip,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tabs,
} from "@nextui-org/react";
import type { NotificationType } from "@prisma/client";
import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { useFetcher, useLoaderData, useNavigate } from "@remix-run/react";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { BellIcon, CheckIcon } from "lucide-react";
import { getUserPrismaClient } from "~/lib/get-user-db.server";
import { requireUserId } from "~/utils/session.server";

type NotificationItem = {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  readAt: Date | null;
  createdAt: Date;
  entityId?: string;
};

export async function action({ request }: ActionFunctionArgs) {
  // const userId = await requireUserId(request);
  const { prisma } = await getUserPrismaClient(request);
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "markAllRead") {
    await prisma.notification.updateMany({
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
    return json({ success: true });
  }

  if (intent === "markAsRead") {
    const notificationId = formData.get("notificationId");
    if (typeof notificationId !== "string") {
      return json({ error: "Invalid notification ID" }, { status: 400 });
    }

    await prisma.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
    return json({ success: true });
  }

  return json({ error: "Invalid intent" }, { status: 400 });
}

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  const { prisma } = await getUserPrismaClient(request);

  const url = new URL(request.url);
  const filter = url.searchParams.get("filter") || "all";

  const where = {
    ...(filter === "read" ? { isRead: true } : {}),
    ...(filter === "unread" ? { isRead: false } : {}),
  };

  const notifications = await prisma.notification.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
  });

  return json({ notifications, activeFilter: filter });
}

const getNotificationColor = (type: NotificationType) => {
  switch (type) {
    case "TRANSACTION":
      return "success";
    case "SYSTEM":
      return "primary";
    case "PROMOTIONAL":
      return "secondary";
    case "INVESTMENT":
      return "warning";
    case "KYC":
      return "danger";
    default:
      return "default";
  }
};

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case "TRANSACTION":
      return "💰";
    case "SYSTEM":
      return "🔧";
    case "PROMOTIONAL":
      return "📢";
    case "INVESTMENT":
      return "📈";
    case "KYC":
      return "📋";
    default:
      return "🔔";
  }
};

export default function NotificationsPage() {
  const { notifications, activeFilter } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const fetcher = useFetcher();

  const handleMarkAllRead = () => {
    fetcher.submit({ intent: "markAllRead" }, { method: "POST" });
  };

  const handleFilterChange = (filter: string) => {
    navigate(`/notifications?filter=${filter}`);
  };

  const handleNotificationClick = (notification: any) => {
    // Mark as read
    fetcher.submit(
      {
        intent: "markAsRead",
        notificationId: notification.id,
      },
      { method: "POST" }
    );

    // Navigate based on notification type
    switch (notification.type) {
      case "TRANSACTION":
        navigate(`/transactions/${notification.entityId}`);
        break;
      case "INVESTMENT":
        navigate(`/investments/${notification.entityId}`);
        break;
      case "KYC":
        navigate("/kyc");
        break;
      default:
        // Handle other notification types
        break;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BellIcon className="w-6 h-6" />
          Notifications
        </h1>
        <Button
          color="primary"
          variant="flat"
          startContent={<CheckIcon className="w-4 h-4" />}
          onClick={handleMarkAllRead}
          isLoading={fetcher.state === "submitting"}
        >
          Mark all as read
        </Button>
      </div>

      <div className="mb-6">
        <Tabs
          selectedKey={activeFilter}
          onSelectionChange={(key) => handleFilterChange(key.toString())}
          variant="underlined"
          aria-label="Notification filters"
        >
          <Tab key="all" title="All" />
          <Tab key="unread" title="Unread" />
          <Tab key="read" title="Read" />
        </Tabs>
      </div>

      {notifications.length === 0 ? (
        <Card className="text-center p-8">
          <CardBody>
            <p className="text-gray-500">No notifications yet</p>
          </CardBody>
        </Card>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Table
            aria-label="Notifications table"
            selectionMode="none"
            className="mt-4"
          >
            <TableHeader>
              <TableColumn>NOTIFICATION</TableColumn>
              <TableColumn>TYPE</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>TIME</TableColumn>
            </TableHeader>
            <TableBody>
              {notifications.map((notification) => (
                <TableRow key={notification.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div>
                        <p className="font-medium">{notification.title}</p>
                        <p className="text-sm text-gray-500">
                          {notification.message}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="sm"
                      color={getNotificationColor(notification.type)}
                      variant="flat"
                    >
                      {notification.type}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    {!notification.isRead ? (
                      <Chip color="primary" size="sm">
                        New
                      </Chip>
                    ) : (
                      <Chip variant="flat" size="sm">
                        Read
                      </Chip>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </motion.div>
      )}
    </div>
  );
}
