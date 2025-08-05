import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/modal";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import { Tab, Tabs } from "@nextui-org/tabs";
import type {
  DrivingLicense,
  Reminder,
  ReminderType,
  User,
  Vehicle,
} from "@prisma/client";
import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type SerializeFrom,
} from "@remix-run/node";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
  useSearchParams,
} from "@remix-run/react";
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  BadgeCheck,
  BellRing,
  Calendar,
  CarFront,
  CheckCircle2,
  Clock,
  CreditCard,
  Edit,
  MessageSquareWarning,
  Plus,
  Trash2,
  UserCog,
} from "lucide-react";
import { useEffect, useState } from "react";
import { FormFieldComponent } from "~/components/ui/form-field";
import { getUserPrismaClient } from "~/lib/get-user-db.server";
import { getUserId } from "~/utils/session.server";

export type ModalType =
  | "addVehicle"
  | "editVehicle"
  | "deleteVehicle"
  | "addVehicleReminder"
  | "viewVehicleReminders"
  | "addLicense"
  | "editLicense"
  | "deleteLicense"
  | "addLicenseReminder"
  | "viewLicenseReminders"
  | "editReminder"
  | "deleteReminder"
  | null;

type LoaderData = {
  user: SerializeFrom<
    User & {
      vehicles: (Vehicle & { reminders: Reminder[] })[];
      drivingLicenses: (DrivingLicense & { reminders: Reminder[] })[];
      reminders: (Reminder & {
        vehicle: Vehicle | null;
        license: DrivingLicense | null;
      })[];
    }
  >;
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  try {
    // Check authentication
    const currentUserId = await getUserId(request);

    if (!currentUserId) {
      return redirect("/auth/login");
    }

    const { prisma } = await getUserPrismaClient(request);

    const userId = params.userId;
    if (!userId) {
      return redirect("/users");
    }

    // First get the basic user info
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return redirect("/users");
    }

    // Then get vehicles with their reminders
    const vehicles = await prisma.vehicle.findMany({
      where: { userId: userId },
      include: {
        reminders: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Get driving licenses with their reminders
    const drivingLicenses = await prisma.drivingLicense.findMany({
      where: { userId: userId },
      include: {
        reminders: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Get all reminders with their related entities
    const reminders = await prisma.reminder.findMany({
      where: { userId: userId },
      include: {
        vehicle: true,
        license: true,
      },
      orderBy: {
        reminderDate: "asc",
      },
    });

    // Combine all data
    const userData = {
      ...user,
      vehicles,
      drivingLicenses,
      reminders,
    };

    // console.log("[Debug] Final user data:", {
    //   userId: userData.id,
    //   vehicleCount: vehicles.length,
    //   licenseCount: drivingLicenses.length,
    //   reminderCount: reminders.length,
    // });

    return json({ user: userData });
  } catch (error) {
    console.error("[Debug] Error in user details loader:", error);
    throw new Response("Error loading user details", { status: 500 });
  }
}

type ActionData =
  | { error: string }
  | {
      success: true;
      vehicle?: Vehicle;
      license?: DrivingLicense;
      reminder?: Reminder;
    };

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const { prisma } = await getUserPrismaClient(request);
  const intent = formData.get("intent");
  const userId = params.userId;

  if (!userId) {
    return json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    // Handle vehicle actions
    if (intent === "addVehicle" || intent === "editVehicle") {
      const vehicleId = formData.get("vehicleId") as string;
      const registrationNumber = formData.get("registrationNumber") as string;
      const make = formData.get("make") as string;
      const model = formData.get("model") as string;
      const yearStr = formData.get("year") as string;
      const yearValue = yearStr ? parseInt(yearStr) : null;
      const color = formData.get("color") as string;

      if (!registrationNumber) {
        return json(
          { error: "Registration number is required" },
          { status: 400 }
        );
      }

      if (intent === "editVehicle" && !vehicleId) {
        return json(
          { error: "Vehicle ID is required for editing" },
          { status: 400 }
        );
      }

      const data = {
        registrationNumber,
        make: make || null,
        model: model || null,
        year: yearValue,
        color: color || null,
        userId,
      };

      const vehicle =
        intent === "editVehicle"
          ? await prisma.vehicle.update({
              where: { id: vehicleId },
              data,
              include: { reminders: true },
            })
          : await prisma.vehicle.create({
              data,
              include: { reminders: true },
            });

      return json({ success: true, vehicle });
    }

    if (intent === "deleteVehicle") {
      const vehicleId = formData.get("vehicleId") as string;
      if (!vehicleId) {
        return json({ error: "Vehicle ID is required" }, { status: 400 });
      }

      await prisma.vehicle.delete({
        where: { id: vehicleId },
      });

      return json({ success: true });
    }

    if (intent === "addVehicleReminder") {
      const vehicleId = formData.get("vehicleId") as string;
      const type = formData.get("type") as ReminderType;
      const reminderDate = formData.get("reminderDate") as string;
      const notifyDaysBefore =
        parseInt(formData.get("notifyDaysBefore") as string) || 7;

      if (!vehicleId || !type || !reminderDate) {
        return json({ error: "All fields are required" }, { status: 400 });
      }

      const reminder = await prisma.reminder.create({
        data: {
          type,
          reminderDate: new Date(reminderDate),
          notifyDaysBefore,
          userId,
          vehicleId,
        },
      });

      return json({ success: true, reminder });
    }

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

// export function ErrorBoundary() {
//   const error = useRouteError();

//   if (isRouteErrorResponse(error)) {
//     return (
//       <div className="p-4">
//         <div className="bg-danger-100 text-danger-500 p-4 rounded-lg">
//           <h1 className="text-lg font-bold mb-2">Error {error.status}</h1>
//           <p>{error.data}</p>
//         </div>
//         <div className="mt-4">
//           <Link to="/users">
//             <Button color="primary">Back to Users</Button>
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4">
//       <div className="bg-danger-100 text-danger-500 p-4 rounded-lg">
//         <h1 className="text-lg font-bold mb-2">Error</h1>
//         <p>An unexpected error occurred while loading the user details.</p>
//       </div>
//       <div className="mt-4">
//         <Link to="/users">
//           <Button color="primary">Back to Users</Button>
//         </Link>
//       </div>
//     </div>
//   );
// }

export default function UserDetailsRoute() {
  const { user } = useLoaderData<typeof loader>();
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedVehicle, setSelectedVehicle] =
    useState<SerializeFrom<Vehicle> | null>(null);
  const [selectedLicense, setSelectedLicense] =
    useState<SerializeFrom<DrivingLicense> | null>(null);
  const [selectedReminder, setSelectedReminder] =
    useState<SerializeFrom<Reminder> | null>(null);

  // Get active tab from URL params or default to "vehicles"
  const activeTab = searchParams.get("tab") || "vehicles";

  const handleTabChange = (key: string) => {
    setSearchParams({ tab: key });
  };

  const isLoading = navigation.state === "loading";
  const isSubmitting = navigation.state === "submitting";

  const handleCloseModal = () => {
    setActiveModal(null);
    setSelectedVehicle(null);
    setSelectedLicense(null);
    setSelectedReminder(null);
  };

  // Close modal on successful submission
  useEffect(() => {
    if (actionData?.success) {
      handleCloseModal();
    }
  }, [actionData]);

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 w-48 bg-default-200 animate-pulse rounded"></div>
          <div className="flex gap-2">
            <div className="h-9 w-24 bg-default-200 animate-pulse rounded"></div>
            <div className="h-9 w-24 bg-default-200 animate-pulse rounded"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-96 bg-default-200 animate-pulse rounded"></div>
          <div className="md:col-span-2 h-96 bg-default-200 animate-pulse rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-50 rounded-lg">
            <UserCog className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-gray-500 flex items-center gap-2">
              <span>{user.email}</span>
              {user.isActive ? (
                <span className="inline-flex items-center gap-1 text-success-500 text-sm">
                  <BadgeCheck className="w-4 h-4" />
                  Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-danger-500 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  Inactive
                </span>
              )}
            </p>
          </div>
        </div>
        <div>
          <Link to="/users">
            <Button
              color="default"
              variant="flat"
              className="mr-2"
              startContent={<ArrowLeft size={18} />}
            >
              Back to Users
            </Button>
          </Link>
          <Link to={`/users/${user.id}/edit`}>
            <Button color="primary" startContent={<Edit size={18} />}>
              Edit User
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">User Information</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div>
                <p className="text-gray-500">Role</p>
                <p>{user.role}</p>
              </div>
              <div>
                <p className="text-gray-500">Status</p>
                <p>{user.isActive ? "Active" : "Inactive"}</p>
              </div>
              <div>
                <p className="text-gray-500">Phone Number</p>
                <p>{user.phoneNumber || "Not provided"}</p>
              </div>
              {user.address && (
                <div>
                  <p className="text-gray-500">Address</p>
                  <p>
                    {user.address.street}, {user.address.city},{" "}
                    {user.address.state},{user.address.country},{" "}
                    {user.address.zipCode}
                  </p>
                </div>
              )}
              <div>
                <p className="text-gray-500">Registered On</p>
                <p>{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="pt-4">
                <Button
                  color="success"
                  variant="flat"
                  className="w-full"
                  as="a"
                  href={`https://wa.me/${user.phoneNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  isDisabled={!user.phoneNumber}
                  startContent={<MessageSquareWarning className="w-5 h-5" />}
                >
                  Contact via WhatsApp
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

        <div className="md:col-span-2">
          <Tabs
            aria-label="User Data Tabs"
            fullWidth
            selectedKey={activeTab}
            onSelectionChange={handleTabChange}
            classNames={{
              tabList: "gap-4",
              tab: "max-w-fit px-4 h-10",
              tabContent: "group-data-[selected=true]:text-primary",
            }}
          >
            <Tab
              key="vehicles"
              title={
                <div className="flex items-center gap-2">
                  <CarFront size={20} />
                  <span>Vehicles</span>
                  {user.vehicles.length > 0 && (
                    <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                      {user.vehicles.length}
                    </span>
                  )}
                </div>
              }
            >
              <Card>
                <CardBody>
                  <div className="flex justify-end mb-4">
                    <Button
                      color="primary"
                      size="sm"
                      onPress={() => setActiveModal("addVehicle")}
                      startContent={<Plus size={18} />}
                    >
                      Add Vehicle
                    </Button>
                  </div>

                  {user.vehicles && user.vehicles.length > 0 ? (
                    <Table aria-label="User's Vehicles">
                      <TableHeader>
                        <TableColumn>REGISTRATION</TableColumn>
                        <TableColumn>MAKE/MODEL</TableColumn>
                        <TableColumn>YEAR</TableColumn>
                        <TableColumn>REMINDERS</TableColumn>
                        <TableColumn>ACTIONS</TableColumn>
                      </TableHeader>
                      <TableBody>
                        {user.vehicles.map((vehicle) => (
                          <TableRow key={vehicle.id}>
                            <TableCell>{vehicle.registrationNumber}</TableCell>
                            <TableCell>
                              {vehicle.make} {vehicle.model}
                            </TableCell>
                            <TableCell>{vehicle.year || "N/A"}</TableCell>
                            <TableCell
                              className="cursor-pointer hover:bg-default-100 transition-colors"
                              onClick={() => {
                                setSelectedVehicle(vehicle);
                                setActiveModal("viewVehicleReminders");
                              }}
                            >
                              {vehicle.reminders.length > 0 ? (
                                <div className="flex flex-col gap-1">
                                  {vehicle.reminders
                                    .slice(0, 2)
                                    .map((reminder) => (
                                      <div
                                        key={reminder.id}
                                        className="text-xs bg-default-100 p-1 rounded"
                                      >
                                        <span className="font-medium">
                                          {reminder.type}:
                                        </span>{" "}
                                        {new Date(
                                          reminder.reminderDate
                                        ).toLocaleDateString()}
                                      </div>
                                    ))}
                                  {vehicle.reminders.length > 2 && (
                                    <div className="text-xs text-primary">
                                      +{vehicle.reminders.length - 2} more
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <span className="text-gray-500">
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
                                    setSelectedVehicle(vehicle);
                                    setActiveModal("editVehicle");
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
                                    setSelectedVehicle(vehicle);
                                    setActiveModal("addVehicleReminder");
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
                                    setSelectedVehicle(vehicle);
                                    setActiveModal("deleteVehicle");
                                  }}
                                  startContent={<Trash2 size={16} />}
                                >
                                  Delete
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500">
                        This user has no registered vehicles.
                      </p>
                    </div>
                  )}
                </CardBody>
              </Card>
            </Tab>
            <Tab
              key="licenses"
              title={
                <div className="flex items-center gap-2">
                  <CreditCard size={20} />
                  <span>Licenses</span>
                  {user.drivingLicenses.length > 0 && (
                    <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                      {user.drivingLicenses.length}
                    </span>
                  )}
                </div>
              }
            >
              <Card>
                <CardBody>
                  <div className="flex justify-end mb-4">
                    <Button
                      color="primary"
                      size="sm"
                      onPress={() => setActiveModal("addLicense")}
                    >
                      Add License
                    </Button>
                  </div>

                  {user.drivingLicenses && user.drivingLicenses.length > 0 ? (
                    <Table aria-label="User's Driving Licenses">
                      <TableHeader>
                        <TableColumn>LICENSE NUMBER</TableColumn>
                        <TableColumn>ISSUED DATE</TableColumn>
                        <TableColumn>EXPIRY DATE</TableColumn>
                        <TableColumn>REMINDERS</TableColumn>
                        <TableColumn>ACTIONS</TableColumn>
                      </TableHeader>
                      <TableBody>
                        {user.drivingLicenses.map((license) => (
                          <TableRow key={license.id}>
                            <TableCell>{license.licenseNumber}</TableCell>
                            <TableCell>
                              {license.issuedDate
                                ? new Date(
                                    license.issuedDate
                                  ).toLocaleDateString()
                                : "N/A"}
                            </TableCell>
                            <TableCell>
                              {license.expiryDate
                                ? new Date(
                                    license.expiryDate
                                  ).toLocaleDateString()
                                : "N/A"}
                            </TableCell>
                            <TableCell
                              className="cursor-pointer hover:bg-default-100 transition-colors"
                              onClick={() => {
                                setSelectedLicense(license);
                                setActiveModal("viewLicenseReminders");
                              }}
                            >
                              {license.reminders.length > 0 ? (
                                <div className="flex flex-col gap-1">
                                  {license.reminders
                                    .slice(0, 2)
                                    .map((reminder) => (
                                      <div
                                        key={reminder.id}
                                        className="text-xs bg-default-100 p-1 rounded"
                                      >
                                        <span className="font-medium">
                                          {reminder.type}:
                                        </span>{" "}
                                        {new Date(
                                          reminder.reminderDate
                                        ).toLocaleDateString()}
                                      </div>
                                    ))}
                                  {license.reminders.length > 2 && (
                                    <div className="text-xs text-primary">
                                      +{license.reminders.length - 2} more
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <span className="text-gray-500">
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
                                >
                                  Delete
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500">
                        This user has no registered driving licenses.
                      </p>
                    </div>
                  )}
                </CardBody>
              </Card>
            </Tab>
            <Tab
              key="reminders"
              title={
                <div className="flex items-center gap-2">
                  <BellRing size={20} />
                  <span>Reminders</span>
                  {user.reminders.length > 0 && (
                    <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                      {user.reminders.length}
                    </span>
                  )}
                </div>
              }
            >
              <Card>
                <CardBody>
                  <div className="overflow-x-auto">
                    <Table aria-label="User's Reminders">
                      <TableHeader>
                        <TableColumn>TYPE</TableColumn>
                        <TableColumn>DATE</TableColumn>
                        <TableColumn>RELATED TO</TableColumn>
                        <TableColumn>NOTIFY BEFORE</TableColumn>
                        <TableColumn>STATUS</TableColumn>
                        <TableColumn>ACTIONS</TableColumn>
                      </TableHeader>
                      <TableBody>
                        {user.reminders.map((reminder) => {
                          // Determine what this reminder is for
                          let relatedTo = "User";
                          let relatedItem = null;

                          if (reminder.vehicleId) {
                            const vehicle = user.vehicles.find(
                              (v) => v.id === reminder.vehicleId
                            );
                            relatedTo = vehicle
                              ? `Vehicle: ${vehicle.registrationNumber}`
                              : "Vehicle";
                            relatedItem = vehicle;
                          } else if (reminder.licenseId) {
                            const license = user.drivingLicenses.find(
                              (l) => l.id === reminder.licenseId
                            );
                            relatedTo = license
                              ? `License: ${license.licenseNumber}`
                              : "License";
                            relatedItem = license;
                          }

                          const reminderDate = new Date(reminder.reminderDate);
                          const isOverdue = reminderDate < new Date();

                          return (
                            <TableRow key={reminder.id}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`px-2 py-1 rounded text-sm flex items-center gap-1 ${
                                      isOverdue
                                        ? "bg-danger-100 text-danger-500"
                                        : "bg-default-100"
                                    }`}
                                  >
                                    {isOverdue ? (
                                      <Clock className="w-4 h-4" />
                                    ) : (
                                      <Calendar className="w-4 h-4" />
                                    )}
                                    {reminder.type}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span>
                                    {reminderDate.toLocaleDateString()}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {isOverdue ? "Overdue" : "Upcoming"}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>{relatedTo}</TableCell>
                              <TableCell>
                                {reminder.notifyDaysBefore} days
                              </TableCell>
                              <TableCell>
                                <div
                                  className={`px-2 py-1 rounded-full text-sm inline-flex items-center gap-1 ${
                                    reminder.isEnabled
                                      ? "bg-success-100 text-success-500"
                                      : "bg-default-100 text-default-500"
                                  }`}
                                >
                                  {reminder.isEnabled ? (
                                    <>
                                      <CheckCircle2 className="w-4 h-4" />
                                      Active
                                    </>
                                  ) : (
                                    <>
                                      <AlertCircle className="w-4 h-4" />
                                      Inactive
                                    </>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    color="primary"
                                    variant="flat"
                                    onPress={() => {
                                      setSelectedReminder(reminder);
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
                                      setSelectedReminder(reminder);
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
                  </div>
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        </div>
      </div>

      {/* Add Vehicle Modal */}
      <Modal
        isOpen={activeModal === "addVehicle"}
        onClose={handleCloseModal}
        size="2xl"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <h1 className="text-xl font-bold">Add New Vehicle</h1>
            {actionData?.error && activeModal === "addVehicle" && (
              <div className="text-danger text-sm">{actionData.error}</div>
            )}
          </ModalHeader>
          <Form method="post">
            <input type="hidden" name="intent" value="addVehicle" />
            <ModalBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <FormFieldComponent
                    field={{
                      id: "registrationNumber",
                      name: "registrationNumber",
                      label: "Registration Number",
                      type: "text",
                      required: true,
                      placeholder: "Enter vehicle registration number",
                    }}
                  />
                </div>

                <FormFieldComponent
                  field={{
                    id: "make",
                    name: "make",
                    label: "Make",
                    type: "text",
                    placeholder: "e.g. Toyota, Honda, etc.",
                  }}
                />

                <FormFieldComponent
                  field={{
                    id: "model",
                    name: "model",
                    label: "Model",
                    type: "text",
                    placeholder: "e.g. Corolla, Civic, etc.",
                  }}
                />

                <FormFieldComponent
                  field={{
                    id: "year",
                    name: "year",
                    label: "Year",
                    type: "number",
                    placeholder: "e.g. 2022",
                  }}
                />

                <FormFieldComponent
                  field={{
                    id: "color",
                    name: "color",
                    label: "Color",
                    type: "text",
                    placeholder: "e.g. Red, Blue, Black",
                  }}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={handleCloseModal}>
                Cancel
              </Button>
              <Button color="primary" type="submit" isLoading={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Vehicle"}
              </Button>
            </ModalFooter>
          </Form>
        </ModalContent>
      </Modal>

      {/* Add License Modal */}
      <Modal
        isOpen={activeModal === "addLicense"}
        onClose={handleCloseModal}
        size="2xl"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <h1 className="text-xl font-bold">Add Driving License</h1>
            {actionData?.error && activeModal === "addLicense" && (
              <div className="text-danger text-sm">{actionData.error}</div>
            )}
          </ModalHeader>
          <Form method="post">
            <input type="hidden" name="intent" value="addLicense" />
            <ModalBody>
              <div className="grid grid-cols-1 gap-4">
                <FormFieldComponent
                  field={{
                    id: "licenseNumber",
                    name: "licenseNumber",
                    label: "License Number",
                    type: "text",
                    required: true,
                    placeholder: "Enter your driving license number",
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
                {isSubmitting ? "Saving..." : "Save License"}
              </Button>
            </ModalFooter>
          </Form>
        </ModalContent>
      </Modal>

      {/* Edit Vehicle Modal */}
      <Modal
        isOpen={activeModal === "editVehicle"}
        onClose={handleCloseModal}
        size="2xl"
      >
        <ModalContent>
          <Form method="post">
            <ModalHeader className="flex flex-col gap-1">
              <h1 className="text-xl font-bold">Edit Vehicle</h1>
              {actionData?.error && activeModal === "editVehicle" && (
                <div className="text-danger text-sm">{actionData.error}</div>
              )}
            </ModalHeader>
            <input type="hidden" name="intent" value="editVehicle" />
            <input type="hidden" name="vehicleId" value={selectedVehicle?.id} />
            <ModalBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <FormFieldComponent
                    field={{
                      id: "registrationNumber",
                      name: "registrationNumber",
                      label: "Registration Number",
                      type: "text",
                      required: true,
                      placeholder: "Enter vehicle registration number",
                      defaultValue: selectedVehicle?.registrationNumber,
                    }}
                  />
                </div>

                <FormFieldComponent
                  field={{
                    id: "make",
                    name: "make",
                    label: "Make",
                    type: "text",
                    placeholder: "e.g. Toyota, Honda, etc.",
                    defaultValue: selectedVehicle?.make || "",
                  }}
                />

                <FormFieldComponent
                  field={{
                    id: "model",
                    name: "model",
                    label: "Model",
                    type: "text",
                    placeholder: "e.g. Corolla, Civic, etc.",
                    defaultValue: selectedVehicle?.model || "",
                  }}
                />

                <FormFieldComponent
                  field={{
                    id: "year",
                    name: "year",
                    label: "Year",
                    type: "number",
                    placeholder: "e.g. 2022",
                    defaultValue: selectedVehicle?.year?.toString() || "",
                  }}
                />

                <FormFieldComponent
                  field={{
                    id: "color",
                    name: "color",
                    label: "Color",
                    type: "text",
                    placeholder: "e.g. Red, Blue, Black",
                    defaultValue: selectedVehicle?.color || "",
                  }}
                />
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

      {/* Delete Vehicle Modal */}
      <Modal
        isOpen={activeModal === "deleteVehicle"}
        onClose={handleCloseModal}
        size="sm"
      >
        <ModalContent>
          <Form method="post">
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-danger">
                <AlertTriangle className="w-6 h-6" />
                <h1 className="text-xl font-bold">Delete Vehicle</h1>
              </div>
              {actionData?.error && activeModal === "deleteVehicle" && (
                <div className="text-danger text-sm">{actionData.error}</div>
              )}
            </ModalHeader>
            <input type="hidden" name="intent" value="deleteVehicle" />
            <input type="hidden" name="vehicleId" value={selectedVehicle?.id} />
            <ModalBody>
              <p>Are you sure you want to delete this vehicle?</p>
              <p className="text-sm text-danger">
                This action cannot be undone.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button color="default" variant="flat" onPress={handleCloseModal}>
                Cancel
              </Button>
              <Button color="danger" type="submit" isLoading={isSubmitting}>
                {isSubmitting ? "Deleting..." : "Delete Vehicle"}
              </Button>
            </ModalFooter>
          </Form>
        </ModalContent>
      </Modal>

      {/* Add Vehicle Reminder Modal */}
      <Modal
        isOpen={activeModal === "addVehicleReminder"}
        onClose={handleCloseModal}
        size="md"
      >
        <ModalContent>
          <Form method="post">
            <ModalHeader className="flex flex-col gap-1">
              <h1 className="text-xl font-bold">Add Vehicle Reminder</h1>
              {actionData?.error && activeModal === "addVehicleReminder" && (
                <div className="text-danger text-sm">{actionData.error}</div>
              )}
            </ModalHeader>
            <input type="hidden" name="intent" value="addVehicleReminder" />
            <input type="hidden" name="vehicleId" value={selectedVehicle?.id} />
            <ModalBody>
              <div className="space-y-4">
                <FormFieldComponent
                  field={{
                    id: "type",
                    name: "type",
                    label: "Reminder Type",
                    type: "select",
                    required: true,
                    options: [
                      { value: "PUCC", label: "PUCC" },
                      { value: "FITNESS", label: "Fitness" },
                      { value: "TAX", label: "Tax" },
                      { value: "INSURANCE", label: "Insurance" },
                      { value: "PERMIT", label: "Permit" },
                      { value: "NATIONAL_PERMIT", label: "National Permit" },
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
                    min: "1",
                    max: "90",
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

      {/* Edit License Modal */}
      <Modal
        isOpen={activeModal === "editLicense"}
        onClose={handleCloseModal}
        size="2xl"
      >
        <ModalContent>
          <Form method="post">
            <ModalHeader className="flex flex-col gap-1">
              <h1 className="text-xl font-bold">Edit Driving License</h1>
              {actionData?.error && activeModal === "editLicense" && (
                <div className="text-danger text-sm">{actionData.error}</div>
              )}
            </ModalHeader>
            <input type="hidden" name="intent" value="editLicense" />
            <input type="hidden" name="licenseId" value={selectedLicense?.id} />
            <ModalBody>
              <div className="grid grid-cols-1 gap-4">
                <FormFieldComponent
                  field={{
                    id: "licenseNumber",
                    name: "licenseNumber",
                    label: "License Number",
                    type: "text",
                    required: true,
                    placeholder: "Enter your driving license number",
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
        size="sm"
      >
        <ModalContent>
          <Form method="post">
            <ModalHeader className="flex flex-col gap-1">
              <h1 className="text-xl font-bold">Delete License</h1>
              {actionData?.error && activeModal === "deleteLicense" && (
                <div className="text-danger text-sm">{actionData.error}</div>
              )}
            </ModalHeader>
            <input type="hidden" name="intent" value="deleteLicense" />
            <input type="hidden" name="licenseId" value={selectedLicense?.id} />
            <ModalBody>
              <p>Are you sure you want to delete this license?</p>
              <p className="text-sm text-danger">
                This action cannot be undone.
              </p>
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
              {actionData?.error && activeModal === "addLicenseReminder" && (
                <div className="text-danger text-sm">{actionData.error}</div>
              )}
            </ModalHeader>
            <input type="hidden" name="intent" value="addLicenseReminder" />
            <input type="hidden" name="licenseId" value={selectedLicense?.id} />
            <ModalBody>
              <div className="space-y-4">
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
                    min: "1",
                    max: "90",
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
              {actionData?.error && activeModal === "editReminder" && (
                <div className="text-danger text-sm">{actionData.error}</div>
              )}
            </ModalHeader>
            <input type="hidden" name="intent" value="editReminder" />
            <input
              type="hidden"
              name="reminderId"
              value={selectedReminder?.id}
            />
            <ModalBody>
              <div className="space-y-4">
                <FormFieldComponent
                  field={{
                    id: "type",
                    name: "type",
                    label: "Reminder Type",
                    type: "select",
                    required: true,
                    defaultValue: selectedReminder?.type,
                    options: [
                      { value: "PUCC", label: "PUCC" },
                      { value: "FITNESS", label: "Fitness" },
                      { value: "TAX", label: "Tax" },
                      { value: "INSURANCE", label: "Insurance" },
                      { value: "PERMIT", label: "Permit" },
                      { value: "NATIONAL_PERMIT", label: "National Permit" },
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
                    defaultValue:
                      selectedReminder?.notifyDaysBefore.toString() || "7",
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
              <h1 className="text-xl font-bold">Delete Reminder</h1>
              {actionData?.error && activeModal === "deleteReminder" && (
                <div className="text-danger text-sm">{actionData.error}</div>
              )}
            </ModalHeader>
            <input type="hidden" name="intent" value="deleteReminder" />
            <input
              type="hidden"
              name="reminderId"
              value={selectedReminder?.id}
            />
            <ModalBody>
              <p>Are you sure you want to delete this reminder?</p>
              <p className="text-sm text-danger">
                This action cannot be undone.
              </p>
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

      {/* View Vehicle Reminders Modal */}
      <Modal
        isOpen={activeModal === "viewVehicleReminders"}
        onClose={handleCloseModal}
        size="3xl"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <h1 className="text-xl font-bold">
              Reminders for Vehicle: {selectedVehicle?.registrationNumber}
            </h1>
          </ModalHeader>
          <ModalBody>
            {selectedVehicle?.reminders &&
            selectedVehicle.reminders.length > 0 ? (
              <Table aria-label="Vehicle Reminders">
                <TableHeader>
                  <TableColumn>TYPE</TableColumn>
                  <TableColumn>DATE</TableColumn>
                  <TableColumn>NOTIFY BEFORE</TableColumn>
                  <TableColumn>STATUS</TableColumn>
                  <TableColumn>ACTIONS</TableColumn>
                </TableHeader>
                <TableBody>
                  {selectedVehicle.reminders.map((reminder) => {
                    const reminderDate = new Date(reminder.reminderDate);
                    const isOverdue = reminderDate < new Date();

                    return (
                      <TableRow key={reminder.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-1 rounded text-sm ${
                                isOverdue
                                  ? "bg-danger-100 text-danger-500"
                                  : "bg-default-100"
                              }`}
                            >
                              {reminder.type}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{reminderDate.toLocaleDateString()}</span>
                            <span className="text-xs text-gray-500">
                              {isOverdue ? "Overdue" : "Upcoming"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{reminder.notifyDaysBefore} days</TableCell>
                        <TableCell>
                          <div
                            className={`px-2 py-1 rounded-full text-sm inline-block ${
                              reminder.isEnabled
                                ? "bg-success-100 text-success-500"
                                : "bg-default-100 text-default-500"
                            }`}
                          >
                            {reminder.isEnabled ? "Active" : "Inactive"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              color="primary"
                              variant="flat"
                              onPress={() => {
                                setSelectedReminder(reminder);
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
                                setSelectedReminder(reminder);
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
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500">
                  This vehicle has no reminders set.
                </p>
              </div>
            )}
            <div className="mt-4 flex justify-end">
              <Button
                color="primary"
                onPress={() => {
                  setActiveModal("addVehicleReminder");
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
          </ModalHeader>
          <ModalBody>
            {selectedLicense?.reminders &&
            selectedLicense.reminders.length > 0 ? (
              <Table aria-label="License Reminders">
                <TableHeader>
                  <TableColumn>TYPE</TableColumn>
                  <TableColumn>DATE</TableColumn>
                  <TableColumn>NOTIFY BEFORE</TableColumn>
                  <TableColumn>STATUS</TableColumn>
                  <TableColumn>ACTIONS</TableColumn>
                </TableHeader>
                <TableBody>
                  {selectedLicense.reminders.map((reminder) => {
                    const reminderDate = new Date(reminder.reminderDate);
                    const isOverdue = reminderDate < new Date();

                    return (
                      <TableRow key={reminder.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-1 rounded text-sm ${
                                isOverdue
                                  ? "bg-danger-100 text-danger-500"
                                  : "bg-default-100"
                              }`}
                            >
                              {reminder.type}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{reminderDate.toLocaleDateString()}</span>
                            <span className="text-xs text-gray-500">
                              {isOverdue ? "Overdue" : "Upcoming"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{reminder.notifyDaysBefore} days</TableCell>
                        <TableCell>
                          <div
                            className={`px-2 py-1 rounded-full text-sm inline-block ${
                              reminder.isEnabled
                                ? "bg-success-100 text-success-500"
                                : "bg-default-100 text-default-500"
                            }`}
                          >
                            {reminder.isEnabled ? "Active" : "Inactive"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              color="primary"
                              variant="flat"
                              onPress={() => {
                                setSelectedReminder(reminder);
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
                                setSelectedReminder(reminder);
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
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500">
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
    </div>
  );
}
