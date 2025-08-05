import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Chip } from "@nextui-org/chip";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/dropdown";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/modal";
import { Reminder, ReminderType } from "@prisma/client";
import type { ActionFunctionArgs, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useNavigate, useNavigation } from "@remix-run/react";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, ChevronDown, Edit, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { FormFieldComponent } from "~/components/ui/form-field";
import { getUserPrismaClient } from "~/lib/get-user-db.server";

type ModalType = "add" | "edit" | "delete" | null;

type ReminderWithDates = Omit<Reminder, 'reminderDate' | 'createdAt' | 'updatedAt'> & {
  reminderDate: Date;
  createdAt: Date;
  updatedAt: Date;
};

type SerializedReminder = Omit<Reminder, 'reminderDate' | 'createdAt' | 'updatedAt'> & {
  reminderDate: string;
  createdAt: string;
  updatedAt: string;
};

type ActionData = {
  success: boolean;
  reminder?: SerializedReminder;
  error?: string;
};

type LoaderData = {
  reminders: (SerializedReminder & {
    vehicle?: { registrationNumber: string; id: string; user: { firstName: string; lastName: string; id: string } } | null;
    license?: { licenseNumber: string; id: string; user: { firstName: string; lastName: string; id: string } } | null;
  })[];
  vehicles: { id: string; registrationNumber: string }[];
  licenses: { id: string; licenseNumber: string }[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const { prisma } = await getUserPrismaClient(request);
  
  const [remindersRaw, vehicles, licenses] = await Promise.all([
    prisma.reminder.findMany({
      include: {
        vehicle: {
          select: {
            registrationNumber: true,
            id: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
                id: true,
              }
            }
          },
        },
        license: {
          select: {
            licenseNumber: true,
            id: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
                id: true,
              }
            }
          },
        },
      },
      orderBy: {
        reminderDate: 'asc',
      },
    }),
    prisma.vehicle.findMany({
      select: {
        id: true,
        registrationNumber: true,
      },
    }),
    prisma.drivingLicense.findMany({
      select: {
        id: true,
        licenseNumber: true,
      },
    }),
  ]);

  const reminders = remindersRaw.map(reminder => ({
    ...reminder,
    reminderDate: reminder.reminderDate.toISOString(),
    createdAt: reminder.createdAt.toISOString(),
    updatedAt: reminder.updatedAt.toISOString(),
  }));

  return json<LoaderData>({ reminders, vehicles, licenses });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const { prisma } = await getUserPrismaClient(request);
  const intent = formData.get("intent");

  try {
    switch (intent) {
      case "add":
      case "edit": {
        const id = formData.get("id") as string | null;
        const type = formData.get("type") as ReminderType;
        const reminderDate = new Date(formData.get("reminderDate") as string);
        const vehicleId = formData.get("vehicleId") as string | null;
        const licenseId = formData.get("licenseId") as string | null;

        // Get the user ID from the associated vehicle or license
        let userId: string | null = null;
        if (vehicleId) {
          const vehicle = await prisma.vehicle.findUnique({
            where: { id: vehicleId },
            select: { userId: true }
          });
          userId = vehicle?.userId || null;
        } else if (licenseId) {
          const license = await prisma.drivingLicense.findUnique({
            where: { id: licenseId },
            select: { userId: true }
          });
          userId = license?.userId || null;
        }

        if (!userId) {
          return json<ActionData>({ success: false, error: "No associated user found" }, { status: 400 });
        }

        const data = {
          type,
          reminderDate,
          vehicleId: vehicleId || null,
          licenseId: licenseId || null,
          userId,
          notifyDaysBefore: 7, // Default value
          isEnabled: true, // Default value
        };

        if (intent === "add") {
          const reminder = await prisma.reminder.create({ data });
          const serializedReminder: SerializedReminder = {
            ...reminder,
            reminderDate: reminder.reminderDate.toISOString(),
            createdAt: reminder.createdAt.toISOString(),
            updatedAt: reminder.updatedAt.toISOString(),
          };
          return json<ActionData>({ success: true, reminder: serializedReminder });
        } else {
          const reminder = await prisma.reminder.update({
            where: { id: id! },
            data: {
              type,
              reminderDate,
              vehicleId: vehicleId || null,
              licenseId: licenseId || null,
            },
          });
          const serializedReminder: SerializedReminder = {
            ...reminder,
            reminderDate: reminder.reminderDate.toISOString(),
            createdAt: reminder.createdAt.toISOString(),
            updatedAt: reminder.updatedAt.toISOString(),
          };
          return json<ActionData>({ success: true, reminder: serializedReminder });
        }
      }
      case "delete": {
        const id = formData.get("id") as string;
        await prisma.reminder.delete({ where: { id } });
        return json<ActionData>({ success: true });
      }
      default:
        return json<ActionData>({ success: false, error: "Invalid intent" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error in reminder action:", error);
    return json<ActionData>({ success: false, error: "Failed to process reminder" }, { status: 500 });
  }
};

type StatusColor = "danger" | "warning" | "primary" | "success" | "secondary" | "default";

const getReminderStatus = (reminderDate: Date) => {
  const today = new Date();
  const daysUntilReminder = Math.ceil((reminderDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysUntilReminder < 0) return { color: "danger" as StatusColor, text: "Overdue" };
  if (daysUntilReminder <= 7) return { color: "warning" as StatusColor, text: "Due Soon" };
  if (daysUntilReminder <= 30) return { color: "primary" as StatusColor, text: "Upcoming" };
  return { color: "success" as StatusColor, text: "Scheduled" };
};

const getReminderTypeColor = (type: ReminderType): StatusColor => {
  const colors: Record<ReminderType, StatusColor> = {
    PUCC: "success",
    FITNESS: "primary",
    TAX: "warning",
    INSURANCE: "danger",
    PERMIT: "secondary",
    NATIONAL_PERMIT: "secondary",
    LICENSE_EXPIRY: "danger",
    OTHER: "default",
  };
  return colors[type];
};

const sortOptions = [
  { key: "date-asc", label: "Date (Earliest First)" },
  { key: "date-desc", label: "Date (Latest First)" },
  { key: "type", label: "Reminder Type" },
  { key: "status", label: "Status" },
];

export default function RemindersPage() {
  const { reminders, vehicles, licenses } = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const isProcessing = navigation.state === "submitting";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<ReminderType | "ALL">("ALL");
  const [selectedVehicle, setSelectedVehicle] = useState<string>("ALL");
  const [selectedLicense, setSelectedLicense] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState("date-asc");
  
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedReminder, setSelectedReminder] = useState<ReminderWithDates | null>(null);

  const handleOpenModal = (type: ModalType, reminder?: SerializedReminder) => {
    setModalType(type);
    if (reminder) {
      const reminderWithDates: ReminderWithDates = {
        ...reminder,
        reminderDate: new Date(reminder.reminderDate),
        createdAt: new Date(reminder.createdAt),
        updatedAt: new Date(reminder.updatedAt)
      };
      setSelectedReminder(reminderWithDates);
    } else {
      setSelectedReminder(null);
    }
  };

  // Effect to handle successful form submission
  useEffect(() => {
    if (actionData?.success) {
      handleCloseModal();
    }
  }, [actionData]);

  const handleCloseModal = () => {
    setModalType(null);
    setSelectedReminder(null);
  };

  const filteredAndSortedReminders = useMemo(() => {
    let filtered = reminders;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(reminder => 
        reminder.vehicle?.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reminder.license?.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reminder.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reminder.vehicle?.user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reminder.vehicle?.user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reminder.license?.user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reminder.license?.user.lastName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply type filter
    if (selectedType !== "ALL") {
      filtered = filtered.filter(reminder => reminder.type === selectedType);
    }

    // Apply vehicle filter
    if (selectedVehicle !== "ALL") {
      filtered = filtered.filter(reminder => reminder.vehicle?.id === selectedVehicle);
    }

    // Apply license filter
    if (selectedLicense !== "ALL") {
      filtered = filtered.filter(reminder => reminder.license?.id === selectedLicense);
    }

    // Apply status filter
    if (selectedStatus !== "ALL") {
      filtered = filtered.filter(reminder => {
        const status = getReminderStatus(new Date(reminder.reminderDate)).text;
        return status === selectedStatus;
      });
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-asc":
          return new Date(a.reminderDate).getTime() - new Date(b.reminderDate).getTime();
        case "date-desc":
          return new Date(b.reminderDate).getTime() - new Date(a.reminderDate).getTime();
        case "type":
          return a.type.localeCompare(b.type);
        case "status":
          const statusA = getReminderStatus(new Date(a.reminderDate)).text;
          const statusB = getReminderStatus(new Date(b.reminderDate)).text;
          return statusA.localeCompare(statusB);
        default:
          return 0;
      }
    });
  }, [reminders, searchQuery, selectedType, selectedVehicle, selectedLicense, selectedStatus, sortBy]);

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Reminders</h1>
          <Button 
            color="primary"
            onClick={() => handleOpenModal("add")}
            className="font-semibold"
            startContent={<Plus size={20} />}
          >
            Add New Reminder
          </Button>
        </div>
        {/* Filters Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <FormFieldComponent
            field={{
              id: "search",
              name: "search",
              label: "Search reminders...",
              type: "text",
              placeholder: "Search reminders...",
              defaultValue: searchQuery,
            }}
            startContent={<Search className="text-default-400" size={20} />}
            onChange={(value) => setSearchQuery(value as string)}
            className="w-full"
          />

          <FormFieldComponent
            field={{
              id: "type",
              name: "type",
              label: "Reminder Type",
              type: "select",
              placeholder: "Filter by Type",
              defaultValue: selectedType,
              options: [
                { label: "All Types", value: "ALL" },
                ...Object.values(ReminderType).map((type) => ({
                  label: type,
                  value: type
                }))
              ]
            }}
            onChange={(value) => setSelectedType(value as ReminderType | "ALL")}
            className="w-full"
          />

          <FormFieldComponent
            field={{
              name: "vehicle",
              label: "Vehicle",
              id: "vehicle",
              type: "select", 
              placeholder: "Filter by Vehicle",
              defaultValue: selectedVehicle,
              options: [
                { label: "All Vehicles", value: "ALL" },
                ...vehicles.map((vehicle) => ({
                  label: vehicle.registrationNumber,
                  value: vehicle.id
                }))
              ]
            }}
                
         
            onChange={(value) => setSelectedVehicle(value as string)}
            className="w-full"
          />

          <FormFieldComponent
            field={{
              name: "license",
              label: "License",
              id: "license",
              type: "select",
              placeholder: "Filter by License", 
              defaultValue: selectedLicense,
              options: [
                { label: "All Licenses", value: "ALL" },
                ...licenses.map((license) => ({
                  label: license.licenseNumber,
                  value: license.id
                }))
              ],

        }}
            onChange={(value) => setSelectedLicense(value as string)}
            className="w-full"
          />

          <FormFieldComponent
            field={{
              id: "status",
              name: "status",
              label: "Status",
              type: "select",
              defaultValue: selectedStatus,
              options: [
                { label: "All Statuses", value: "ALL" },
                { label: "Overdue", value: "Overdue" },
                { label: "Due Soon", value: "Due Soon" },
                { label: "Upcoming", value: "Upcoming" },
                { label: "Scheduled", value: "Scheduled" }
              ],
            }}
            onChange={(value) => setSelectedStatus(value as string)}
            className="w-full"
          />

          <Dropdown>
            <DropdownTrigger>
              <Button 
                variant="flat" 
                endContent={<ChevronDown className="text-small" />}
              >
                Sort By: {sortOptions.find(opt => opt.key === sortBy)?.label}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Sort options"
              selectedKeys={[sortBy]}
              onSelectionChange={(keys) => setSortBy(Array.from(keys)[0] as string)}
              selectionMode="single"
            >
              {sortOptions.map((option) => (
                <DropdownItem key={option.key}>
                  {option.label}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>

        {/* Reminders Grid */}
        <AnimatePresence mode="popLayout">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredAndSortedReminders.map((reminder) => (
              <motion.div
                key={reminder.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <Card
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  shadow="sm"
                >
                  <CardHeader className="flex flex-col gap-2">
                    <div className="flex justify-between items-center w-full">
                      <div className="flex gap-2">
                        <Chip
                          color={getReminderTypeColor(reminder.type)}
                          variant="flat"
                          size="sm"
                        >
                          {reminder.type}
                        </Chip>
                        <Chip
                          color={getReminderStatus(new Date(reminder.reminderDate)).color}
                          variant="dot"
                          size="sm"
                        >
                          {getReminderStatus(new Date(reminder.reminderDate)).text}
                        </Chip>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenModal("edit", reminder);
                          }}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          color="danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenModal("delete", reminder);
                          }}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-default-400" />
                        <span>{new Date(reminder.reminderDate).toLocaleDateString()}</span>
                      </div>
                      {reminder.vehicle && (
                        <p className="text-sm flex items-center gap-2">
                          <span className="font-semibold">Vehicle:</span>
                          {reminder.vehicle.registrationNumber}
                          <span className="text-default-400">•</span>
                          <span className="text-default-500">
                            Owner: {reminder.vehicle.user.firstName} {reminder.vehicle.user.lastName}
                          </span>
                        </p>
                      )}
                      {reminder.license && (
                        <p className="text-sm flex items-center gap-2">
                          <span className="font-semibold">License:</span>
                          {reminder.license.licenseNumber}
                          <span className="text-default-400">•</span>
                          <span className="text-default-500">
                            Owner: {reminder.license.user.firstName} {reminder.license.user.lastName}
                          </span>
                        </p>
                      )}
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>

        {/* Add/Edit Reminder Modal */}
        <Modal
          isOpen={modalType === "add" || modalType === "edit"}
          onOpenChange={(open: boolean) => {
            if (!open) handleCloseModal();
          }}
          size="2xl"
          backdrop="blur"
          classNames={{
            base: "max-h-[90vh] overflow-y-auto"
          }}
        >
          <ModalContent>
            {() => (
              <Form method="post" onSubmit={(e) => {
                if (!e.currentTarget.checkValidity()) {
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}>
                <ModalHeader>
                  {modalType === "add" ? "Add New Reminder" : "Edit Reminder"}
                </ModalHeader>
                <ModalBody>
                  <div className="space-y-4">
                    <input
                      type="hidden"
                      name="intent"
                      value={modalType || ""}
                    />
                    {selectedReminder && (
                      <input
                        type="hidden"
                        name="id"
                        value={selectedReminder.id}
                      />
                    )}
                    
                    <FormFieldComponent
                      field={{
                        id: "type",
                        name: "type",
                        label: "Reminder Type",
                        type: "select",
                        defaultValue: selectedReminder?.type || "",
                        options: Object.values(ReminderType).map((type) => ({
                          label: type,
                          value: type
                        })),
                        required: true,
                      }}
                    />

                    <FormFieldComponent
                      field={{
                        id: "reminderDate",
                        name: "reminderDate",
                        label: "Reminder Date",
                        type: "date",
                        defaultValue: selectedReminder
                          ? selectedReminder.reminderDate.toISOString().split("T")[0]
                          : new Date().toISOString().split("T")[0],
                        required: true,
                      }}
                    />

                    <FormFieldComponent
                      field={{
                        id: "vehicleId",
                        name: "vehicleId",
                        label: "Vehicle",
                        type: "select",
                        defaultValue: selectedReminder?.vehicleId || "",
                        options: [
                          { label: "None", value: "" },
                          ...vehicles.map((vehicle) => ({
                            label: vehicle.registrationNumber,
                            value: vehicle.id,
                          })),
                        ],
                      }}
                    />

                    <FormFieldComponent
                      field={{
                        id: "licenseId",
                        name: "licenseId",
                        label: "License",
                        type: "select",
                        defaultValue: selectedReminder?.licenseId || "",
                        options: [
                          { label: "None", value: "" },
                          ...licenses.map((license) => ({
                            label: license.licenseNumber,
                            value: license.id,
                          })),
                        ],
                      }}
                    />

                    {actionData?.error && (
                      <div className="text-danger text-sm mt-2">
                        {actionData.error}
                      </div>
                    )}
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button
                    variant="light"
                    onPress={handleCloseModal}
                  >
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    type="submit"
                    isLoading={isProcessing}
                  >
                    {modalType === "add" ? "Add Reminder" : "Save Changes"}
                  </Button>
                </ModalFooter>
              </Form>
            )}
          </ModalContent>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={modalType === "delete"}
          onOpenChange={(open: boolean) => {
            if (!open) handleCloseModal();
          }}
          size="sm"
          backdrop="blur"
          classNames={{
            base: "max-h-[90vh] overflow-y-auto"
          }}
        >
          <ModalContent>
            {() => (
              <Form method="post">
                <ModalHeader>Delete Reminder</ModalHeader>
                <ModalBody>
                  <input type="hidden" name="intent" value="delete" />
                  {selectedReminder && (
                    <input type="hidden" name="id" value={selectedReminder.id} />
                  )}
                  <p>Are you sure you want to delete this reminder?</p>
                </ModalBody>
                <ModalFooter>
                  <Button
                    variant="light"
                    onPress={handleCloseModal}
                  >
                    Cancel
                  </Button>
                  <Button
                    color="danger"
                    type="submit"
                    isLoading={isProcessing}
                  >
                    Delete
                  </Button>
                </ModalFooter>
              </Form>
            )}
          </ModalContent>
        </Modal>

        {filteredAndSortedReminders.length === 0 && (
          <Card>
            <CardBody>
              <p className="text-center text-gray-500 py-8">
                No reminders found. Try adjusting your filters or create a new reminder.
              </p>
            </CardBody>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
