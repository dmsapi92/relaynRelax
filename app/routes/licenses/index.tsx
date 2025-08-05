import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";
import { Chip } from "@nextui-org/chip";
import { Input } from "@nextui-org/input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/modal";
import { Select, SelectItem } from "@nextui-org/select";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow
} from "@nextui-org/table";
import type {
  DrivingLicense,
  Reminder,
  ReminderType,
  User,
} from "@prisma/client";
import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type SerializeFrom,
} from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
  useSearchParams,
} from "@remix-run/react";
import {
  AlertTriangle,
  BellRing,
  Edit,
  Plus,
  Search,
  Trash2,
  UserIcon
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { FormFieldComponent } from "~/components/ui/form-field";
import { getUserPrismaClient } from "~/lib/get-user-db.server";

export type ModalType =
  | "addLicense"
  | "editLicense"
  | "deleteLicense"
  | "addLicenseReminder"
  | "viewLicenseReminders"
  | "editReminder"
  | "deleteReminder"
  | null;

type DateFilter = "all" | "next7days" | "next30days" | "next90days" | "overdue" | "expired";

type SortOrder = 
  | "dateAsc" 
  | "dateDesc" 
  | "typeAsc" 
  | "typeDesc" 
  | "daysRemainingAsc" 
  | "daysRemainingDesc";

type OwnerFilter = "all" | string;

type LoaderData = {
  drivingLicenses: (DrivingLicense & {
    reminders: Reminder[];
    user: Pick<User, "id" | "firstName" | "lastName">;
  })[];
  reminders: (Reminder & {
    license: DrivingLicense | null;
    user: Pick<User, "id" | "firstName" | "lastName">;
  })[];
  users: Pick<User, "id" | "firstName" | "lastName" | "email">[];
};

type ReminderStatus = "overdue" | "upcoming" | "dueToday" | "inactive";

type ReminderWithRelations = {
  id: string;
  userId: string;
  type: ReminderType;
  reminderDate: string;
  notifyDaysBefore: number;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  vehicleId: string | null;
  licenseId: string | null;
  license: {
    id: string;
    userId: string;
    licenseNumber: string;
    issuingAuthority: string | null;
    issuedDate: string | null;
    expiryDate: string | null;
    createdAt: string;
    updatedAt: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
    };
  } | null;
  user: {
    id: string;
    firstName: string;
    lastName: string;
  };
};

type JsonReminder = SerializeFrom<Reminder>;

// Keep these pure functions outside the component
function getReminderStatus(reminder: JsonReminder | Reminder): ReminderStatus {
  if (!reminder.isEnabled) return "inactive";
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const reminderDate = new Date(reminder.reminderDate);
  reminderDate.setHours(0, 0, 0, 0);
  
  if (reminderDate < today) return "overdue";
  if (reminderDate.getTime() === today.getTime()) return "dueToday";
  return "upcoming";
}

function getReminderStatusColor(status: ReminderStatus) {
  switch (status) {
    case "overdue":
      return "danger";
    case "upcoming":
      return "primary";
    case "dueToday":
      return "warning";
    case "inactive":
      return "default";
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const { prisma } = await getUserPrismaClient(request);

    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });

    // Get all driving licenses with their reminders
    const drivingLicenses = await prisma.drivingLicense.findMany({
      include: {
        reminders: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Get all reminders with their related entities
    const reminders = await prisma.reminder.findMany({
      where: {
        licenseId: { not: null }
      },
      include: {
        license: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        reminderDate: "asc",
      },
    });

    return json({ drivingLicenses, reminders, users });
  } catch (error) {
    console.error("[Debug] Error in licenses loader:", error);
    throw new Response("Error loading licenses", { status: 500 });
  }
}

type ActionData =
  | { error: string }
  | {
      success: true;
      license?: DrivingLicense;
      reminder?: Reminder;
    };

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const { prisma } = await getUserPrismaClient(request);
  const intent = formData.get("intent");
  const userId = formData.get("userId") as string;

  if (!userId) {
    return json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    // Handle license actions
    if (intent === "addLicense" || intent === "editLicense") {
      const licenseId = formData.get("licenseId") as string;
      const licenseNumber = formData.get("licenseNumber") as string;
      const issuingAuthority = formData.get("issuingAuthority") as string;
      const issuedDate = formData.get("issuedDate")
        ? new Date(formData.get("issuedDate") as string)
        : null;
      const expiryDate = formData.get("expiryDate")
        ? new Date(formData.get("expiryDate") as string)
        : null;

      if (!licenseNumber) {
        return json({ error: "License number is required" }, { status: 400 });
      }

      if (intent === "editLicense" && !licenseId) {
        return json(
          { error: "License ID is required for editing" },
          { status: 400 }
        );
      }

      const data = {
        licenseNumber,
        issuingAuthority: issuingAuthority || null,
        issuedDate,
        expiryDate,
        userId,
      };

      const license =
        intent === "editLicense"
          ? await prisma.drivingLicense.update({
              where: { id: licenseId },
              data,
              include: { reminders: true },
            })
          : await prisma.drivingLicense.create({
              data,
              include: { reminders: true },
            });

      return json({ success: true, license });
    }

    if (intent === "deleteLicense") {
      const licenseId = formData.get("licenseId") as string;
      if (!licenseId) {
        return json({ error: "License ID is required" }, { status: 400 });
      }

      await prisma.drivingLicense.delete({
        where: { id: licenseId },
      });

      return json({ success: true });
    }

    if (intent === "addLicenseReminder") {
      const licenseId = formData.get("licenseId") as string;
      const type = formData.get("type") as ReminderType;
      const reminderDate = formData.get("reminderDate") as string;
      const notifyDaysBefore =
        parseInt(formData.get("notifyDaysBefore") as string) || 7;

      if (!licenseId || !type || !reminderDate) {
        return json({ error: "All fields are required" }, { status: 400 });
      }

      const reminder = await prisma.reminder.create({
        data: {
          type,
          reminderDate: new Date(reminderDate),
          notifyDaysBefore,
          userId,
          licenseId,
        },
      });

      return json({ success: true, reminder });
    }

    if (intent === "editReminder") {
      const reminderId = formData.get("reminderId") as string;
      const type = formData.get("type") as ReminderType;
      const reminderDate = formData.get("reminderDate") as string;
      const notifyDaysBefore =
        parseInt(formData.get("notifyDaysBefore") as string) || 7;
      const isEnabled = formData.get("isEnabled") === "true";

      if (!reminderId || !type || !reminderDate) {
        return json({ error: "All fields are required" }, { status: 400 });
      }

      const reminder = await prisma.reminder.update({
        where: { id: reminderId },
        data: {
          type,
          reminderDate: new Date(reminderDate),
          notifyDaysBefore,
          isEnabled,
        },
      });

      return json({ success: true, reminder });
    }

    if (intent === "deleteReminder") {
      const reminderId = formData.get("reminderId") as string;
      if (!reminderId) {
        return json({ error: "Reminder ID is required" }, { status: 400 });
      }

      await prisma.reminder.delete({
        where: { id: reminderId },
      });

      return json({ success: true });
    }

    return json({ error: "Invalid intent" }, { status: 400 });
  } catch (error: unknown) {
    console.error(
      "Error:",
      error instanceof Error ? error.message : String(error)
    );
    return json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}

export default function LicensesRoute() {
  const { drivingLicenses, reminders, users } = useLoaderData<typeof loader>();
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedLicense, setSelectedLicense] = useState<
    (typeof drivingLicenses)[0] | null
  >(null);
  const [selectedReminder, setSelectedReminder] =
    useState<ReminderWithRelations | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ReminderStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<ReminderType | "all">("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("dateAsc");
  const [ownerFilter, setOwnerFilter] = useState<OwnerFilter>("all");

  // Helper functions for filtering and sorting
  const getDateFilterRange = useCallback((filter: DateFilter): { start: Date; end: Date } | null => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (filter) {
      case "next7days":
        return {
          start: today,
          end: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
        };
      case "next30days":
        return {
          start: today,
          end: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
        };
      case "next90days":
        return {
          start: today,
          end: new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000)
        };
      case "overdue":
        return {
          start: new Date(0),
          end: today
        };
      default:
        return null;
    }
  }, []);

  const sortReminders = useCallback((reminders: (JsonReminder | Reminder)[]) => {
    return [...reminders].sort((a, b) => {
      const dateA = new Date(a.reminderDate);
      const dateB = new Date(b.reminderDate);
      const today = new Date();
      const daysRemainingA = Math.floor((dateA.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      const daysRemainingB = Math.floor((dateB.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      switch (sortOrder) {
        case "dateAsc":
          return dateA.getTime() - dateB.getTime();
        case "dateDesc":
          return dateB.getTime() - dateA.getTime();
        case "typeAsc":
          return a.type.localeCompare(b.type);
        case "typeDesc":
          return b.type.localeCompare(a.type);
        case "daysRemainingAsc":
          return daysRemainingA - daysRemainingB;
        case "daysRemainingDesc":
          return daysRemainingB - daysRemainingA;
        default:
          return 0;
      }
    });
  }, [sortOrder]);

  const filterReminders = useCallback((reminder: JsonReminder | Reminder) => {
    // Status filter
    if (statusFilter !== "all") {
      const status = getReminderStatus(reminder);
      if (status !== statusFilter) return false;
    }

    // Type filter
    if (typeFilter !== "all" && reminder.type !== typeFilter) return false;

    // Date filter
    if (dateFilter !== "all") {
      const range = getDateFilterRange(dateFilter);
      if (range) {
        const reminderDate = new Date(reminder.reminderDate);
        reminderDate.setHours(0, 0, 0, 0);
        if (reminderDate < range.start || reminderDate > range.end) return false;
      }
    }

    return true;
  }, [statusFilter, typeFilter, dateFilter, getDateFilterRange]);

  const handleCloseModal = () => {
    setActiveModal(null);
    setSelectedLicense(null);
    setSelectedReminder(null);
  };

  // Close modal on successful submission
  useEffect(() => {
    if (actionData && "success" in actionData && actionData.success) {
      handleCloseModal();
    }
  }, [actionData]);

  const isLoading = navigation.state === "loading";
  const isSubmitting = navigation.state === "submitting";

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 w-48 bg-default-200 animate-pulse rounded"></div>
          <div className="flex gap-2">
            <div className="h-9 w-24 bg-default-200 animate-pulse rounded"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6">
          <div className="h-96 bg-default-200 animate-pulse rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Card>
        <CardBody>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <UserIcon className="w-6 h-6" />
                Driving Licenses
              </h1>
              <Button
                color="primary"
                size="sm"
                onPress={() => setActiveModal("addLicense")}
                startContent={<Plus size={18} />}
              >
                Add License
              </Button>
            </div>

            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[200px]">
                <FormFieldComponent
                  field={{
                    id: "searchQuery",
                    name: "searchQuery",
                    label: "Search",
                    type: "text",
                    placeholder: "Search by license number, owner name...",
                    defaultValue: searchQuery
                  }}
                  startContent={<Search className="w-4 h-4 text-default-400" />}
                  onChange={(e) => setSearchQuery(e as string)}
                />
              </div>

              <div className="w-48">
                <FormFieldComponent
                  field={{
                    id: "ownerFilter",
                    name: "ownerFilter", 
                    label: "Owner Filter",
                    type: "select",
                    defaultValue: ownerFilter,
                    options: [
                      { value: "all", label: "All Owners" },
                      ...users.map(user => ({
                        value: user.id,
                        label: `${user.firstName} ${user.lastName}`
                      }))
                    ]
                  }}
                  onChange={(e) => setOwnerFilter(e as OwnerFilter)}
                />
              </div>

              <div className="w-48">
                <FormFieldComponent
                  field={{
                    id: "dateFilter",
                    name: "dateFilter",
                    label: "Expiry Filter",
                    type: "select",
                    defaultValue: dateFilter,
                    options: [
                      { value: "all", label: "All Dates" },
                      { value: "next7days", label: "Next 7 Days" },
                      { value: "next30days", label: "Next 30 Days" },
                      { value: "next90days", label: "Next 90 Days" },
                      { value: "overdue", label: "Expired" }
                    ]
                  }}
                  onChange={(e) => setDateFilter(e as DateFilter)}
                />
              </div>

              <div className="w-48">
                <FormFieldComponent
                  field={{
                    id: "sortOrder",
                    name: "sortOrder",
                    label: "Sort By",
                    type: "select",
                    defaultValue: sortOrder,
                    options: [
                      { value: "dateAsc", label: "Expiry Date (Earliest First)" },
                      { value: "dateDesc", label: "Expiry Date (Latest First)" },
                      { value: "daysRemainingAsc", label: "Days Until Expiry (Least First)" },
                      { value: "daysRemainingDesc", label: "Days Until Expiry (Most First)" }
                    ]
                  }}
                  onChange={(e) => setSortOrder(e as SortOrder)}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              {(() => {
                const filteredLicenses = drivingLicenses.filter(license => {
                  // Owner filter
                  if (ownerFilter !== "all" && license.userId !== ownerFilter) {
                    return false;
                  }

                  // Search query
                  if (searchQuery) {
                    const searchLower = searchQuery.toLowerCase();
                    return (
                      license.licenseNumber.toLowerCase().includes(searchLower) ||
                      (license.issuingAuthority?.toLowerCase().includes(searchLower) || false) ||
                      license.user.firstName.toLowerCase().includes(searchLower) ||
                      license.user.lastName.toLowerCase().includes(searchLower)
                    );
                  }
                  return true;
                });

                if (filteredLicenses.length === 0) {
                  return (
                    <div className="text-center py-12">
                      <div className="flex flex-col items-center gap-4">
                        <UserIcon className="w-12 h-12 text-default-300" />
                        <div className="space-y-2">
                          <h3 className="text-xl font-semibold text-default-900">No Licenses Found</h3>
                          <p className="text-default-500">
                            {searchQuery 
                              ? "No licenses match your search criteria. Try adjusting your filters or search terms."
                              : ownerFilter !== "all"
                              ? "No licenses found for the selected owner."
                              : "No licenses available in the system."}
                          </p>
                          <Button
                            color="primary"
                            variant="flat"
                            onPress={() => {
                              setSearchQuery("");
                              setOwnerFilter("all");
                              setDateFilter("all");
                              setSortOrder("dateAsc");
                            }}
                          >
                            Reset Filters
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <Table aria-label="Licenses list">
                    <TableHeader>
                      <TableColumn>LICENSE NUMBER</TableColumn>
                      <TableColumn>OWNER</TableColumn>
                      <TableColumn>ISSUING AUTHORITY</TableColumn>
                      <TableColumn>ISSUED DATE</TableColumn>
                      <TableColumn>EXPIRY DATE</TableColumn>
                      <TableColumn>REMINDERS</TableColumn>
                      <TableColumn>ACTIONS</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {filteredLicenses.map((license) => {
                        const isExpired = license.expiryDate ? new Date(license.expiryDate) < new Date() : false;
                        const daysUntilExpiry = license.expiryDate
                          ? Math.floor((new Date(license.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                          : null;

                        return (
                          <TableRow key={license.id}>
                            <TableCell>{license.licenseNumber}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <UserIcon className="w-4 h-4 text-default-400" />
                                {license.user.firstName} {license.user.lastName}
                              </div>
                            </TableCell>
                            <TableCell>{license.issuingAuthority || "N/A"}</TableCell>
                            <TableCell>
                              {license.issuedDate
                                ? new Date(license.issuedDate).toLocaleDateString()
                                : "N/A"}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Chip
                                  size="sm"
                                  variant="flat"
                                  color={isExpired ? "danger" : daysUntilExpiry && daysUntilExpiry <= 30 ? "warning" : "success"}
                                >
                                  {license.expiryDate
                                    ? new Date(license.expiryDate).toLocaleDateString()
                                    : "N/A"}
                                </Chip>
                                {license.expiryDate && (
                                  <span className={`text-xs ${
                                    isExpired ? "text-danger" :
                                    daysUntilExpiry && daysUntilExpiry <= 30 ? "text-warning" :
                                    "text-success"
                                  }`}>
                                    {isExpired
                                      ? `(Expired ${Math.abs(daysUntilExpiry!)} days ago)`
                                      : daysUntilExpiry === 0
                                      ? "(Expires today!)"
                                      : `(${daysUntilExpiry} days left)`}
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell
                              className="cursor-pointer hover:bg-default-100 transition-colors"
                              onClick={() => {
                                setSelectedLicense(license);
                                setActiveModal("viewLicenseReminders");
                              }}
                            >
                              {license.reminders.length > 0 ? (
                                <div className="flex flex-col gap-2">
                                  {sortReminders(license.reminders.filter(filterReminders))
                                    .slice(0, 2)
                                    .map((reminder) => {
                                      const status = getReminderStatus(reminder);
                                      const reminderDate = new Date(reminder.reminderDate);
                                      const today = new Date();
                                      const diffDays = Math.floor(
                                        (reminderDate.getTime() - today.getTime()) /
                                          (1000 * 60 * 60 * 24)
                                      );

                                      return (
                                        <Card
                                          key={reminder.id}
                                          className="p-2 bg-default-50"
                                          shadow="none"
                                        >
                                          <div className="flex flex-col gap-1">
                                            <div className="flex items-center justify-between">
                                              <Chip
                                                size="sm"
                                                variant="flat"
                                                color={getReminderStatusColor(status)}
                                                className="max-w-fit"
                                              >
                                                {status === "overdue" && "⚠️ "}
                                                {status === "dueToday" && "📅 "}
                                                {reminder.type}
                                              </Chip>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                              <BellRing className="w-3 h-3 text-default-400" />
                                              <span className="text-default-600">
                                                {reminderDate.toLocaleDateString()} 
                                                {reminder.notifyDaysBefore > 0 && 
                                                  ` (${reminder.notifyDaysBefore}d notice)`}
                                              </span>
                                            </div>
                                            <div className={`text-xs font-medium ${
                                              status === "overdue" ? "text-danger" :
                                              status === "dueToday" ? "text-warning" :
                                              "text-success"
                                            }`}>
                                              {status === "overdue"
                                                ? `⚠️ ${Math.abs(diffDays)} days overdue`
                                                : status === "dueToday"
                                                ? "📅 Due today"
                                                : `✓ ${diffDays} days remaining`}
                                            </div>
                                          </div>
                                        </Card>
                                      );
                                    })}
                                  {license.reminders.length > 2 && (
                                    <div className="flex items-center gap-2 text-primary">
                                      <Plus size={14} />
                                      <span className="text-sm">
                                        {license.reminders.length - 2} more reminder{license.reminders.length - 2 > 1 ? 's' : ''}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <span className="text-default-400 flex items-center gap-2">
                                  <BellRing className="w-4 h-4" />
                                  No reminders
                                </span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  color="primary"
                                  variant="flat"
                                  onPress={() => {
                                    setSelectedLicense(license);
                                    setActiveModal("editLicense");
                                  }}
                                  startContent={<Edit size={16} />}
                                >
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  color="secondary"
                                  variant="flat"
                                  onPress={() => {
                                    setSelectedLicense(license);
                                    setActiveModal("addLicenseReminder");
                                  }}
                                  startContent={<BellRing size={16} />}
                                >
                                  Add Reminder
                                </Button>
                                <Button
                                  size="sm"
                                  color="danger"
                                  variant="flat"
                                  onPress={() => {
                                    setSelectedLicense(license);
                                    setActiveModal("deleteLicense");
                                  }}
                                  startContent={<Trash2 size={16} />}
                                >
                                  Delete
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                );
              })()}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Add License Modal */}
      <Modal
        isOpen={activeModal === "addLicense"}
        onClose={handleCloseModal}
        size="2xl"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <h1 className="text-xl font-bold">Add New License</h1>
            {actionData &&
              "error" in actionData &&
              actionData.error &&
              activeModal === "addLicense" && (
                <div className="text-danger text-sm">{actionData.error}</div>
              )}
          </ModalHeader>
          <Form method="post">
            <input type="hidden" name="intent" value="addLicense" />
            <ModalBody>
              <div className="grid grid-cols-1 gap-4">
                <FormFieldComponent
                  field={{
                    id: "userId",
                    name: "userId",
                    label: "License Owner",
                    type: "select",
                    required: true,
                    options: users.map(user => ({
                      value: user.id,
                      label: `${user.firstName} ${user.lastName} (${user.email})`
                    })),
                  }}
                />

                <FormFieldComponent
                  field={{
                    id: "licenseNumber",
                    name: "licenseNumber",
                    label: "License Number",
                    type: "text",
                    required: true,
                    placeholder: "Enter driving license number",
                  }}
                />

                <FormFieldComponent
                  field={{
                    id: "issuingAuthority",
                    name: "issuingAuthority",
                    label: "Issuing Authority",
                    type: "text",
                    placeholder: "e.g. RTO Mumbai",
                  }}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormFieldComponent
                    field={{
                      id: "issuedDate",
                      name: "issuedDate",
                      label: "Issued Date",
                      type: "date",
                      placeholder: "Select issued date",
                    }}
                  />

                  <FormFieldComponent
                    field={{
                      id: "expiryDate",
                      name: "expiryDate",
                      label: "Expiry Date",
                      type: "date",
                      placeholder: "Select expiry date",
                    }}
                  />
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={handleCloseModal}>
                Cancel
              </Button>
              <Button color="primary" type="submit" isLoading={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add License"}
              </Button>
            </ModalFooter>
          </Form>
        </ModalContent>
      </Modal>

      {/* Edit License Modal */}
      <Modal
        isOpen={activeModal === "editLicense"}
        onClose={handleCloseModal}
        size="2xl"
      >
        <ModalContent>
          <Form method="post">
            <ModalHeader className="flex flex-col gap-1">
              <h1 className="text-xl font-bold">Edit License</h1>
              {actionData &&
                "error" in actionData &&
                actionData.error &&
                activeModal === "editLicense" && (
                  <div className="text-danger text-sm">{actionData.error}</div>
                )}
            </ModalHeader>
            <input type="hidden" name="intent" value="editLicense" />
            <input type="hidden" name="licenseId" value={selectedLicense?.id} />
            <ModalBody>
              <div className="grid grid-cols-1 gap-4">
                <FormFieldComponent
                  field={{
                    id: "userId",
                    name: "userId",
                    label: "License Owner",
                    type: "select",
                    required: true,
                    defaultValue: selectedLicense?.userId,
                    options: users.map(user => ({
                      value: user.id,
                      label: `${user.firstName} ${user.lastName} (${user.email})`
                    })),
                  }}
                />

                <FormFieldComponent
                  field={{
                    id: "licenseNumber",
                    name: "licenseNumber",
                    label: "License Number",
                    type: "text",
                    required: true,
                    placeholder: "Enter driving license number",
                    defaultValue: selectedLicense?.licenseNumber,
                  }}
                />

                <FormFieldComponent
                  field={{
                    id: "issuingAuthority",
                    name: "issuingAuthority",
                    label: "Issuing Authority",
                    type: "text",
                    placeholder: "e.g. RTO Mumbai",
                    defaultValue: selectedLicense?.issuingAuthority || "",
                  }}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormFieldComponent
                    field={{
                      id: "issuedDate",
                      name: "issuedDate",
                      label: "Issued Date",
                      type: "date",
                      placeholder: "Select issued date",
                      defaultValue: selectedLicense?.issuedDate
                        ? new Date(selectedLicense.issuedDate)
                            .toISOString()
                            .split("T")[0]
                        : "",
                    }}
                  />

                  <FormFieldComponent
                    field={{
                      id: "expiryDate",
                      name: "expiryDate",
                      label: "Expiry Date",
                      type: "date",
                      placeholder: "Select expiry date",
                      defaultValue: selectedLicense?.expiryDate
                        ? new Date(selectedLicense.expiryDate)
                            .toISOString()
                            .split("T")[0]
                        : "",
                    }}
                  />
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={handleCloseModal}>
                Cancel
              </Button>
              <Button color="primary" type="submit" isLoading={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </ModalFooter>
          </Form>
        </ModalContent>
      </Modal>

      {/* Delete License Modal */}
      <Modal
        isOpen={activeModal === "deleteLicense"}
        onClose={handleCloseModal}
        size="md"
      >
        <ModalContent>
          <Form method="post">
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-danger">
                <AlertTriangle className="w-6 h-6" />
                <h1 className="text-xl font-bold">Delete License</h1>
              </div>
              {actionData &&
                "error" in actionData &&
                actionData.error &&
                activeModal === "deleteLicense" && (
                  <div className="text-danger text-sm">{actionData.error}</div>
                )}
            </ModalHeader>
            <input type="hidden" name="intent" value="deleteLicense" />
            <input type="hidden" name="licenseId" value={selectedLicense?.id} />
            <input type="hidden" name="userId" value={selectedLicense?.userId} />
            <ModalBody>
              {selectedLicense && (
                <div className="space-y-4">
                  <div className="bg-default-100 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="font-semibold">License Number:</div>
                      <div>{selectedLicense.licenseNumber}</div>

                      <div className="font-semibold">Owner:</div>
                      <div>
                        {selectedLicense.user.firstName} {selectedLicense.user.lastName}
                      </div>

                      <div className="font-semibold">Issuing Authority:</div>
                      <div>{selectedLicense.issuingAuthority || "N/A"}</div>

                      <div className="font-semibold">Issued Date:</div>
                      <div>
                        {selectedLicense.issuedDate
                          ? new Date(selectedLicense.issuedDate).toLocaleDateString()
                          : "N/A"}
                      </div>

                      <div className="font-semibold">Expiry Date:</div>
                      <div>
                        {selectedLicense.expiryDate
                          ? new Date(selectedLicense.expiryDate).toLocaleDateString()
                          : "N/A"}
                      </div>

                      <div className="font-semibold">Active Reminders:</div>
                      <div>
                        {selectedLicense.reminders?.length || 0} reminder(s)
                        {selectedLicense.reminders && selectedLicense.reminders.length > 0 && (
                          <div className="text-xs text-danger mt-1">
                            Warning: All associated reminders will also be deleted
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="border border-danger-200 rounded-lg p-4">
                    <p className="text-danger font-medium mb-2">
                      Are you sure you want to delete this license?
                    </p>
                    <p className="text-sm text-danger-500">
                      This action will permanently delete:
                    </p>
                    <ul className="list-disc list-inside text-sm text-danger-500 mt-1">
                      <li>The license record</li>
                      {selectedLicense.reminders && selectedLicense.reminders.length > 0 && (
                        <li>All associated reminders</li>
                      )}
                    </ul>
                    <p className="text-sm text-danger-500 mt-2">
                      This action cannot be undone.
                    </p>
                  </div>
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="default" variant="flat" onPress={handleCloseModal}>
                Cancel
              </Button>
              <Button color="danger" type="submit" isLoading={isSubmitting}>
                {isSubmitting ? "Deleting..." : "Delete License"}
              </Button>
            </ModalFooter>
          </Form>
        </ModalContent>
      </Modal>

      {/* Add License Reminder Modal */}
      <Modal
        isOpen={activeModal === "addLicenseReminder"}
        onClose={handleCloseModal}
        size="md"
      >
        <ModalContent>
          <Form method="post">
            <ModalHeader className="flex flex-col gap-1">
              <h1 className="text-xl font-bold">Add License Reminder</h1>
              {actionData &&
                "error" in actionData &&
                actionData.error &&
                activeModal === "addLicenseReminder" && (
                  <div className="text-danger text-sm">{actionData.error}</div>
                )}
            </ModalHeader>
            <input type="hidden" name="intent" value="addLicenseReminder" />
            <input type="hidden" name="licenseId" value={selectedLicense?.id} />
            <input type="hidden" name="userId" value={selectedLicense?.userId} />
            <ModalBody>
              <div className="space-y-4">
                <FormFieldComponent
                  field={{
                    id: "licenseOwner",
                    name: "licenseOwner",
                    label: "License Owner",
                    type: "text",
                    readOnly: true,
                    defaultValue: selectedLicense ? 
                      `${selectedLicense.user.firstName} ${selectedLicense.user.lastName}` : 
                      "",
                  }}
                />

                <FormFieldComponent
                  field={{
                    id: "type",
                    name: "type",
                    label: "Reminder Type",
                    type: "select",
                    required: true,
                    options: [
                      { value: "LICENSE_EXPIRY", label: "License Expiry" },
                      { value: "OTHER", label: "Other" },
                    ],
                  }}
                />

                <FormFieldComponent
                  field={{
                    id: "reminderDate",
                    name: "reminderDate",
                    label: "Reminder Date",
                    type: "date",
                    required: true,
                  }}
                />

                <FormFieldComponent
                  field={{
                    id: "notifyDaysBefore",
                    name: "notifyDaysBefore",
                    label: "Notify Days Before",
                    type: "number",
                    defaultValue: "7",
                    min: 1,
                    max: 90,
                  }}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="default" variant="flat" onPress={handleCloseModal}>
                Cancel
              </Button>
              <Button color="primary" type="submit" isLoading={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Reminder"}
              </Button>
            </ModalFooter>
          </Form>
        </ModalContent>
      </Modal>

      {/* View License Reminders Modal */}
      <Modal
        isOpen={activeModal === "viewLicenseReminders"}
        onClose={handleCloseModal}
        size="3xl"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <h1 className="text-xl font-bold">
              Reminders for License: {selectedLicense?.licenseNumber}
            </h1>
            <p className="text-sm text-default-500">
              Owner: {selectedLicense?.user.firstName} {selectedLicense?.user.lastName}
            </p>
          </ModalHeader>
          <ModalBody>
            {selectedLicense?.reminders &&
            selectedLicense.reminders.length > 0 ? (
              <>
                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex-1 min-w-[200px]">
                    <Input
                      label="Search Reminders"
                      placeholder="Search by type or date..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      startContent={<Search className="w-4 h-4 text-default-400" />}
                    />
                  </div>
                  <div className="w-48">
                    <Select
                      label="Status"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as ReminderStatus | "all")}
                    >
                      <SelectItem key="all" value="all">All Status</SelectItem>
                      <SelectItem key="overdue" value="overdue">Overdue</SelectItem>
                      <SelectItem key="dueToday" value="dueToday">Due Today</SelectItem>
                      <SelectItem key="upcoming" value="upcoming">Upcoming</SelectItem>
                      <SelectItem key="inactive" value="inactive">Inactive</SelectItem>
                    </Select>
                  </div>
                  <div className="w-48">
                    <Select
                      label="Due Date"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value as DateFilter)}
                    >
                      <SelectItem key="all" value="all">All Dates</SelectItem>
                      <SelectItem key="next7days" value="next7days">Next 7 Days</SelectItem>
                      <SelectItem key="next30days" value="next30days">Next 30 Days</SelectItem>
                      <SelectItem key="next90days" value="next90days">Next 90 Days</SelectItem>
                      <SelectItem key="overdue" value="overdue">Overdue</SelectItem>
                    </Select>
                  </div>
                </div>

                <Table aria-label="License Reminders">
                  <TableHeader>
                    <TableColumn>TYPE</TableColumn>
                    <TableColumn>DATE</TableColumn>
                    <TableColumn>STATUS</TableColumn>
                    <TableColumn>NOTIFY BEFORE</TableColumn>
                    <TableColumn>ACTIONS</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {sortReminders(selectedLicense.reminders.filter(filterReminders))
                      .map((reminder) => {
                        const status = getReminderStatus(reminder);
                        const reminderDate = new Date(reminder.reminderDate);
                        const today = new Date();
                        const diffDays = Math.floor(
                          (reminderDate.getTime() - today.getTime()) /
                            (1000 * 60 * 60 * 24)
                        );

                        const reminderWithRelations: ReminderWithRelations = {
                          id: reminder.id,
                          userId: reminder.userId,
                          type: reminder.type,
                          reminderDate: new Date(reminder.reminderDate).toISOString(),
                          notifyDaysBefore: reminder.notifyDaysBefore,
                          isEnabled: reminder.isEnabled,
                          createdAt: new Date(reminder.createdAt).toISOString(),
                          updatedAt: new Date(reminder.updatedAt).toISOString(),
                          vehicleId: null,
                          licenseId: selectedLicense.id,
                          license: {
                            id: selectedLicense.id,
                            userId: selectedLicense.userId,
                            licenseNumber: selectedLicense.licenseNumber,
                            issuingAuthority: selectedLicense.issuingAuthority,
                            issuedDate: selectedLicense.issuedDate || null,
                            expiryDate: selectedLicense.expiryDate || null,
                            createdAt: new Date(selectedLicense.createdAt).toISOString(),
                            updatedAt: new Date(selectedLicense.updatedAt).toISOString(),
                            user: {
                              id: selectedLicense.user.id,
                              firstName: selectedLicense.user.firstName,
                              lastName: selectedLicense.user.lastName,
                            }
                          },
                          user: {
                            id: reminder.userId,
                            firstName: selectedLicense.user.firstName,
                            lastName: selectedLicense.user.lastName,
                          }
                        };

                        return (
                          <TableRow key={reminder.id}>
                            <TableCell>
                              <Chip
                                size="sm"
                                variant="flat"
                                color={getReminderStatusColor(status)}
                              >
                                {status === "overdue" && "⚠️ "}
                                {status === "dueToday" && "📅 "}
                                {reminder.type}
                              </Chip>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span>{reminderDate.toLocaleDateString()}</span>
                                <span className="text-xs text-default-400">
                                  {status === "overdue"
                                    ? `Overdue by ${Math.abs(diffDays)} days`
                                    : status === "dueToday"
                                    ? "Due today"
                                    : `Due in ${diffDays} days`}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Chip
                                size="sm"
                                variant="dot"
                                color={getReminderStatusColor(status)}
                              >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </Chip>
                            </TableCell>
                            <TableCell>{reminder.notifyDaysBefore} days</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  color="primary"
                                  variant="flat"
                                  onPress={() => {
                                    setSelectedReminder(reminderWithRelations);
                                    setActiveModal("editReminder");
                                  }}
                                >
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  color="danger"
                                  variant="flat"
                                  onPress={() => {
                                    setSelectedReminder(reminderWithRelations);
                                    setActiveModal("deleteReminder");
                                  }}
                                >
                                  Delete
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </>
            ) : (
              <div className="text-center py-6">
                <p className="text-default-500">
                  This license has no reminders set.
                </p>
              </div>
            )}
            <div className="mt-4 flex justify-end">
              <Button
                color="primary"
                onPress={() => {
                  setActiveModal("addLicenseReminder");
                }}
              >
                Add New Reminder
              </Button>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="default" variant="flat" onPress={handleCloseModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Reminder Modal */}
      <Modal
        isOpen={activeModal === "editReminder"}
        onClose={handleCloseModal}
        size="md"
      >
        <ModalContent>
          <Form method="post">
            <ModalHeader className="flex flex-col gap-1">
              <h1 className="text-xl font-bold">Edit Reminder</h1>
              {actionData &&
                "error" in actionData &&
                actionData.error &&
                activeModal === "editReminder" && (
                  <div className="text-danger text-sm">{actionData.error}</div>
                )}
            </ModalHeader>
            <input type="hidden" name="intent" value="editReminder" />
            <input type="hidden" name="reminderId" value={selectedReminder?.id} />
            <input type="hidden" name="userId" value={selectedReminder?.userId} />
            <ModalBody>
              <div className="space-y-4">
                <FormFieldComponent
                  field={{
                    id: "reminderOwner",
                    name: "reminderOwner",
                    label: "Reminder Owner",
                    type: "text",
                    readOnly: true,
                    defaultValue: selectedReminder ? 
                      `${selectedReminder.user.firstName} ${selectedReminder.user.lastName}` : 
                      "",
                  }}
                />

                <FormFieldComponent
                  field={{
                    id: "type",
                    name: "type",
                    label: "Reminder Type",
                    type: "select",
                    required: true,
                    defaultValue: selectedReminder?.type,
                    options: [
                      { value: "LICENSE_EXPIRY", label: "License Expiry" },
                      { value: "OTHER", label: "Other" },
                    ],
                  }}
                />

                <FormFieldComponent
                  field={{
                    id: "reminderDate",
                    name: "reminderDate",
                    label: "Reminder Date",
                    type: "date",
                    required: true,
                    defaultValue: selectedReminder
                      ? new Date(selectedReminder.reminderDate)
                          .toISOString()
                          .split("T")[0]
                      : undefined,
                  }}
                />

                <FormFieldComponent
                  field={{
                    id: "notifyDaysBefore",
                    name: "notifyDaysBefore",
                    label: "Notify Days Before",
                    type: "number",
                    defaultValue: selectedReminder?.notifyDaysBefore.toString() || "7",
                    min: 1,
                    max: 90,
                  }}
                />

                <FormFieldComponent
                  field={{
                    id: "isEnabled",
                    name: "isEnabled",
                    label: "Status",
                    type: "select",
                    defaultValue: selectedReminder?.isEnabled
                      ? "true"
                      : "false",
                    options: [
                      { value: "true", label: "Active" },
                      { value: "false", label: "Inactive" },
                    ],
                  }}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="default" variant="flat" onPress={handleCloseModal}>
                Cancel
              </Button>
              <Button color="primary" type="submit" isLoading={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </ModalFooter>
          </Form>
        </ModalContent>
      </Modal>

      {/* Delete Reminder Modal */}
      <Modal
        isOpen={activeModal === "deleteReminder"}
        onClose={handleCloseModal}
        size="sm"
      >
        <ModalContent>
          <Form method="post">
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-danger">
                <AlertTriangle className="w-6 h-6" />
                <h1 className="text-xl font-bold">Delete Reminder</h1>
              </div>
              {actionData &&
                "error" in actionData &&
                actionData.error &&
                activeModal === "deleteReminder" && (
                  <div className="text-danger text-sm">{actionData.error}</div>
                )}
            </ModalHeader>
            <input type="hidden" name="intent" value="deleteReminder" />
            <input type="hidden" name="reminderId" value={selectedReminder?.id} />
            <input type="hidden" name="userId" value={selectedReminder?.userId} />
            <ModalBody>
              <div className="space-y-4">
                <div className="bg-default-100 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="font-semibold">Type:</div>
                    <div>{selectedReminder?.type}</div>
                    
                    <div className="font-semibold">Due Date:</div>
                    <div>
                      {selectedReminder?.reminderDate
                        ? new Date(selectedReminder.reminderDate).toLocaleDateString()
                        : "N/A"}
                    </div>

                    <div className="font-semibold">Owner:</div>
                    <div>
                      {selectedReminder?.user.firstName} {selectedReminder?.user.lastName}
                    </div>

                    <div className="font-semibold">Associated With:</div>
                    <div>
                      {selectedReminder?.license
                        ? `License: ${selectedReminder.license.licenseNumber}`
                        : "N/A"}
                    </div>
                  </div>
                </div>

                <p className="text-danger text-sm font-medium">
                  Are you sure you want to delete this reminder? This action cannot be undone.
                </p>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="default" variant="flat" onPress={handleCloseModal}>
                Cancel
              </Button>
              <Button color="danger" type="submit" isLoading={isSubmitting}>
                {isSubmitting ? "Deleting..." : "Delete Reminder"}
              </Button>
            </ModalFooter>
          </Form>
        </ModalContent>
      </Modal>
    </div>
  );
}
