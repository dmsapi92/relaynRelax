import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Chip } from "@nextui-org/chip";
import { Divider } from "@nextui-org/divider";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { Tab, Tabs } from "@nextui-org/tabs";
import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import {
  Outlet,
  useActionData,
  useLoaderData,
  useLocation,
  useNavigate,
  useSubmit,
} from "@remix-run/react";
import {
  IconAlertTriangle,
  IconBell,
  IconCalendarEvent,
  IconCar,
  IconCheck,
  IconLicense,
  IconTrash,
} from "@tabler/icons-react";
import { differenceInDays, format } from "date-fns";
import { motion } from "framer-motion";
import { ReminderType } from "prisma/generated/enums";
import { useState } from "react";
import { getUserPrismaClient } from "~/lib/get-user-db.server";
import { getUserIdMobile } from "~/utils/session.server";
import Layout from "../../components/Layout";

type ModalType = "addReminder" | "editReminder" | "deleteReminder" | null;

export async function loader({ request }: LoaderFunctionArgs) {
  const { prisma } = await getUserPrismaClient(request);
  const userId = await getUserIdMobile(request);

  if (!userId) {
    throw new Error("Customer not found");
  }

  const reminders = await prisma.reminder.findMany({
    where: { userId },
    include: {
      vehicle: {
        select: {
          id: true,
          registrationNumber: true,
          make: true,
          model: true,
        },
      },
      license: {
        select: {
          id: true,
          licenseNumber: true,
        },
      },
    },
    orderBy: [
      {
        reminderDate: "asc",
      },
    ],
  });

  return json({ reminders });
}

export async function action({ request }: ActionFunctionArgs) {
  const { prisma } = await getUserPrismaClient(request);
  const userId = await getUserIdMobile(request);

  if (!userId) {
    throw new Error("Invalid request");
  }

  const formData = await request.formData();
  const intent = formData.get("intent");

  try {
    switch (intent) {
      case "addReminder": {
        const type = formData.get("type") as ReminderType;
        const reminderDate = formData.get("reminderDate") as string;
        const notifyDaysBefore = parseInt(
          formData.get("notifyDaysBefore") as string
        );
        const vehicleId = formData.get("vehicleId") as string;
        const licenseId = formData.get("licenseId") as string;

        const reminder = await prisma.reminder.create({
          data: {
            type,
            reminderDate: new Date(reminderDate),
            notifyDaysBefore,
            userId,
            vehicleId: vehicleId || null,
            licenseId: licenseId || null,
            isEnabled: true,
          },
        });

        return json({ success: true, reminder });
      }

      case "updateReminder": {
        const reminderId = formData.get("reminderId") as string;
        const type = formData.get("type") as ReminderType;
        const reminderDate = formData.get("reminderDate") as string;
        const notifyDaysBefore = parseInt(
          formData.get("notifyDaysBefore") as string
        );
        const isEnabled = formData.get("isEnabled") === "true";
        const vehicleId = formData.get("vehicleId") as string;
        const licenseId = formData.get("licenseId") as string;

        const reminder = await prisma.reminder.update({
          where: { id: reminderId },
          data: {
            type,
            reminderDate: new Date(reminderDate),
            notifyDaysBefore,
            isEnabled,
            vehicleId: vehicleId || null,
            licenseId: licenseId || null,
          },
        });

        return json({ success: true, reminder });
      }

      case "deleteReminder": {
        const reminderId = formData.get("reminderId") as string;

        await prisma.reminder.delete({
          where: { id: reminderId },
        });

        return json({ success: true });
      }

      default:
        return json({ error: "Invalid intent" }, { status: 400 });
    }
  } catch (error) {
    return json({ error: "An error occurred" }, { status: 500 });
  }
}

export default function RemindersIndex() {
  const location = useLocation();
  if (location.pathname.includes("/mobileApp/customer/reminders/")) {
    return <Outlet />;
  }
  const { reminders } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const submit = useSubmit();
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedReminder, setSelectedReminder] = useState<any>(null);
  const [selectedType, setSelectedType] = useState<
    "vehicle" | "license" | null
  >(null);
  const [editType, setEditType] = useState<"vehicle" | "license" | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [reminderToDelete, setReminderToDelete] = useState<any>(null);

  const handleModalOpen = (modalType: ModalType, reminder?: any) => {
    setActiveModal(modalType);
    if (reminder) {
      setSelectedReminder(reminder);
      setSelectedType(reminder.vehicleId ? "vehicle" : "license");
    }
    onOpen();
  };

  const handleModalClose = () => {
    setActiveModal(null);
    setSelectedReminder(null);
    setSelectedType(null);
    onClose();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    submit(form, { method: "post" });
    handleModalClose();
  };

  const handleTypeChange = (value: string | string[]) => {
    if (typeof value === "string") {
      setSelectedType(value as "vehicle" | "license");
    }
  };

  const handleEditTypeChange = (value: string | string[]) => {
    if (typeof value === "string") {
      setEditType(value as "vehicle" | "license");
    }
  };

  const handleDeleteClick = (reminder: any) => {
    setReminderToDelete(reminder);
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (reminderToDelete) {
      const formData = new FormData();
      formData.append("intent", "deleteReminder");
      formData.append("reminderId", reminderToDelete.id);
      submit(formData, { method: "post" });
    }
    setDeleteConfirmationOpen(false);
    setReminderToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmationOpen(false);
    setReminderToDelete(null);
  };

  const reminderTypes = Object.values(ReminderType);

  const getReminderIcon = (reminder: any) => {
    if (reminder.vehicleId)
      return <IconCar className="text-primary" size={20} />;
    if (reminder.licenseId)
      return <IconLicense className="text-primary" size={20} />;
    return <IconCalendarEvent className="text-primary" size={20} />;
  };

  const getReminderTitle = (reminder: any) => {
    if (reminder.vehicle) {
      const title =
        reminder.vehicle.make && reminder.vehicle.model
          ? `${reminder.vehicle.make} ${reminder.vehicle.model}`
          : reminder.vehicle.registrationNumber;
      return {
        main: title,
        sub: reminder.vehicle.registrationNumber,
      };
    }
    if (reminder.license) {
      return {
        main: "License",
        sub: reminder.license.licenseNumber,
      };
    }
    return {
      main: "General Reminder",
      sub: "",
    };
  };

  const getDateStatus = (reminderDate: string, notifyDaysBefore: number) => {
    const today = new Date();
    const dueDate = new Date(reminderDate);
    const daysUntilDue = differenceInDays(dueDate, today);

    if (daysUntilDue < 0) {
      return {
        color: "danger" as const,
        icon: <IconAlertTriangle className="text-danger" size={16} />,
        text: "Overdue",
        daysText: `${Math.abs(daysUntilDue)} days overdue`,
      };
    } else if (daysUntilDue <= notifyDaysBefore) {
      return {
        color: "warning" as const,
        icon: <IconBell className="text-warning" size={16} />,
        text: "Coming Soon",
        daysText: `${daysUntilDue} days remaining`,
      };
    } else {
      return {
        color: "success" as const,
        icon: <IconCheck className="text-success" size={16} />,
        text: "Upcoming",
        daysText: `${daysUntilDue} days remaining`,
      };
    }
  };

  const handleReminderClick = (reminder: any) => {
    if (reminder.vehicle) {
      navigate(`/mobileApp/customer/vehicles/${reminder.vehicle.id}`);
    } else if (reminder.license) {
      navigate(`/mobileApp/customer/licenses/${reminder.license.id}`);
    }
  };

  const groupedReminders = {
    overdue: reminders.filter(
      (r) => differenceInDays(new Date(r.reminderDate), new Date()) < 0
    ),
    upcoming: reminders.filter((r) => {
      const days = differenceInDays(new Date(r.reminderDate), new Date());
      return days >= 0 && days <= r.notifyDaysBefore;
    }),
    future: reminders.filter((r) => {
      const days = differenceInDays(new Date(r.reminderDate), new Date());
      return days > r.notifyDaysBefore;
    }),
  };

  return (
    <Layout>
      <div className="p-2 sm:p-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-none">
            <CardHeader className="flex justify-between items-center px-3 py-2 sm:px-6 sm:py-4">
              <div className="flex items-center gap-2">
                <IconCalendarEvent size={24} className="text-primary" />
                <h1 className="text-lg sm:text-xl font-semibold">Reminders</h1>
              </div>
              <Button
                color="primary"
                onPress={() => handleModalOpen("addReminder")}
              >
                Add Reminder
              </Button>
            </CardHeader>
            <Divider />
            <CardBody className="p-0 sm:p-4">
              <Tabs
                aria-label="Reminder categories"
                classNames={{
                  tabList: "gap-2 sm:gap-4 p-2 sm:p-0",
                  cursor: "w-full bg-primary",
                  tab: "h-9 sm:h-11 px-2 sm:px-4",
                  tabContent:
                    "text-xs sm:text-sm group-data-[selected=true]:text-primary",
                }}
                variant="underlined"
                color="primary"
                fullWidth
              >
                <Tab
                  key="overdue"
                  title={
                    <div className="flex items-center gap-1 sm:gap-2">
                      <IconAlertTriangle size={16} />
                      <span>Overdue ({groupedReminders.overdue.length})</span>
                    </div>
                  }
                >
                  <ReminderList
                    reminders={groupedReminders.overdue}
                    getDateStatus={getDateStatus}
                    getReminderIcon={getReminderIcon}
                    getReminderTitle={getReminderTitle}
                    handleReminderClick={handleReminderClick}
                    handleDeleteClick={handleDeleteClick}
                  />
                </Tab>
                <Tab
                  key="upcoming"
                  title={
                    <div className="flex items-center gap-1 sm:gap-2">
                      <IconBell size={16} />
                      <span>Soon ({groupedReminders.upcoming.length})</span>
                    </div>
                  }
                >
                  <ReminderList
                    reminders={groupedReminders.upcoming}
                    getDateStatus={getDateStatus}
                    getReminderIcon={getReminderIcon}
                    getReminderTitle={getReminderTitle}
                    handleReminderClick={handleReminderClick}
                    handleDeleteClick={handleDeleteClick}
                  />
                </Tab>
                <Tab
                  key="future"
                  title={
                    <div className="flex items-center gap-1 sm:gap-2">
                      <IconCalendarEvent size={16} />
                      <span>Future ({groupedReminders.future.length})</span>
                    </div>
                  }
                >
                  <ReminderList
                    reminders={groupedReminders.future}
                    getDateStatus={getDateStatus}
                    getReminderIcon={getReminderIcon}
                    getReminderTitle={getReminderTitle}
                    handleReminderClick={handleReminderClick}
                    handleDeleteClick={handleDeleteClick}
                  />
                </Tab>
              </Tabs>
            </CardBody>
          </Card>
        </motion.div>
      </div>

      <Modal isOpen={deleteConfirmationOpen} onClose={handleDeleteCancel}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Confirm Delete
          </ModalHeader>
          <ModalBody>
            <p>Are you sure you want to delete this reminder?</p>
            {reminderToDelete && (
              <div className="mt-2">
                <p className="font-medium">
                  {getReminderTitle(reminderToDelete).main}
                </p>
                <p className="text-sm text-default-500">
                  {getReminderTitle(reminderToDelete).sub}
                </p>
                <p className="text-sm text-default-500">
                  {format(new Date(reminderToDelete.reminderDate), "PPP")}
                </p>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={handleDeleteCancel}>
              Cancel
            </Button>
            <Button color="danger" onPress={handleDeleteConfirm}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Layout>
  );
}

function ReminderList({
  reminders,
  getDateStatus,
  getReminderIcon,
  getReminderTitle,
  handleReminderClick,
  handleDeleteClick,
}: any) {
  if (reminders.length === 0) {
    return (
      <div className="text-center py-6 sm:py-8 text-default-500">
        <IconCalendarEvent size={32} className="mx-auto mb-3 opacity-50" />
        <p className="text-sm">No reminders in this category</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {reminders.map((reminder: any) => {
        const status = getDateStatus(
          reminder.reminderDate,
          reminder.notifyDaysBefore
        );
        const title = getReminderTitle(reminder);

        return (
          <motion.div
            key={reminder.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card
              className="border-none hover:bg-default-50 transition-colors cursor-pointer"
              onPress={() => handleReminderClick(reminder)}
            >
              <CardBody>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getReminderIcon(reminder)}
                    <div>
                      <h3 className="font-medium">{title.main}</h3>
                      {title.sub && (
                        <p className="text-sm text-default-500">{title.sub}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Chip
                      color={status.color}
                      variant="flat"
                      startContent={status.icon}
                    >
                      {status.text}
                    </Chip>
                    <Button
                      isIconOnly
                      variant="light"
                      color="danger"
                      onPress={() => handleDeleteClick(reminder)}
                    >
                      <IconTrash size={20} />
                    </Button>
                  </div>
                </div>
                <div className="mt-2 text-sm text-default-500">
                  {format(new Date(reminder.reminderDate), "PPP")}
                </div>
              </CardBody>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
