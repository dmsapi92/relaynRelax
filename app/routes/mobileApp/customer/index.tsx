import { Avatar } from "@nextui-org/avatar";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Chip } from "@nextui-org/chip";
import { Divider } from "@nextui-org/divider";
import { Input } from "@nextui-org/input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import {
  Form,
  Outlet,
  useActionData,
  useLoaderData,
  useLocation,
  useNavigate,
  useSubmit,
} from "@remix-run/react";
import {
  IconAlertCircle,
  IconBell,
  IconCar,
  IconLicense,
  IconPhone,
  IconPlus,
} from "@tabler/icons-react";
import { format, formatDistanceToNow, isBefore } from "date-fns";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getUserPrismaClient } from "~/lib/get-user-db.server";
import { getUserIdMobile } from "~/utils/session.server";
import Layout from "../components/Layout";

// Define types for our data
interface Reminder {
  id: string;
  type: string;
  reminderDate: string;
}

interface Vehicle {
  id: string;
  make: string | null;
  model: string | null;
  year: number | null;
  registrationNumber: string;
  reminders: Reminder[];
}

interface License {
  id: string;
  licenseNumber: string;
  issuingAuthority: string | null;
  issuedDate: string | null;
  expiryDate: string | null;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  isActive: boolean;
  vehicles: Vehicle[];
  drivingLicenses: License[];
  reminders: Reminder[];
}

export async function loader({ request }: LoaderFunctionArgs) {
  const { prisma } = await getUserPrismaClient(request);
  const system = await prisma.system.findFirst();
  const userId = await getUserIdMobile(request);

  if (!userId) {
    throw new Error("Customer not found");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      vehicles: {
        include: {
          reminders: true,
        },
      },
      drivingLicenses: true,
      reminders: {
        orderBy: {
          reminderDate: "asc",
        },
        take: 5,
      },
    },
  });

  if (!user) {
    throw new Error("Customer not found");
  }

  return json({
    system,
    user,
    name: `${user.firstName} ${user.lastName}`,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const { prisma } = await getUserPrismaClient(request);
  const userId = await getUserIdMobile(request);

  if (!userId) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const phoneNumber = formData.get("phoneNumber") as string;
  const intent = formData.get("intent") as string;

  if (intent === "updatePhone" && phoneNumber) {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: { phoneNumber },
      });

      return json({
        success: true,
        message: "Phone number updated successfully",
      });
    } catch (error) {
      console.error("Error updating phone number:", error);
      return json({ error: "Failed to update phone number" }, { status: 500 });
    }
  }

  return json({ error: "Invalid request" }, { status: 400 });
}

const quickActions = [
  {
    title: "My Vehicles",
    description: "Manage your vehicles",
    icon: <IconCar size={24} />,
    href: "/mobileApp/customer/vehicles",
    color: "text-emerald-600",
  },
  {
    title: "Licenses",
    description: "View your licenses",
    icon: <IconLicense size={24} />,
    href: "/mobileApp/customer/licenses",
    color: "text-yellow-600",
  },
  {
    title: "Reminders",
    description: "Check upcoming reminders",
    icon: <IconBell size={24} />,
    href: "/mobileApp/customer/reminders",
    color: "text-blue-600",
  },
  {
    title: "Support",
    description: "Get help & support",
    icon: <IconAlertCircle size={24} />,
    href: "/mobileApp/customer/support",
    color: "text-purple-600",
  },
];

const getGradientByColor = (color: string) => {
  const colorMap: Record<string, string> = {
    "text-emerald-600": "from-emerald-500/10 to-emerald-500/5",
    "text-yellow-600": "from-yellow-500/10 to-yellow-500/5",
    "text-blue-600": "from-blue-500/10 to-blue-500/5",
    "text-purple-600": "from-purple-500/10 to-purple-500/5",
  };
  return colorMap[color] || "from-gray-500/10 to-gray-500/5";
};

export default function CustomerDashboard() {
  const { system, user, name } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const location = useLocation();
  const navigate = useNavigate();
  const submit = useSubmit();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || "");
  const [phoneError, setPhoneError] = useState("");
  const [isPhoneValid, setIsPhoneValid] = useState(false);

  const today = new Date();

  // Validate phone number
  const validatePhoneNumber = (value: string) => {
    // Basic phone validation - can be adjusted based on your requirements
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    const isValid = phoneRegex.test(value);
    setIsPhoneValid(isValid);
    setPhoneError(isValid ? "" : "Please enter a valid phone number (10-15 digits)");
    return isValid;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhoneNumber(value);
    validatePhoneNumber(value);
  };

  // Check if phone number is missing and show modal
  useEffect(() => {
    if (!user.phoneNumber) {
      onOpen();
    }
  }, [user.phoneNumber, onOpen]);

  // Update phone number handler
  const handleUpdatePhone = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validatePhoneNumber(phoneNumber)) {
      return;
    }
    const formData = new FormData(e.currentTarget);
    formData.append("intent", "updatePhone");
    submit(formData, { method: "post" });
  };

  // Custom handler for modal close attempts
  const handleOpenChange = (open: boolean) => {
    // Only allow closing if user has a phone number or has entered a valid one
    if (open === false && !user.phoneNumber && !isPhoneValid) {
      return; // Prevent closing
    }
    onOpenChange(open);
  };

  // Check for successful phone update
  useEffect(() => {
    if (actionData?.success) {
      // Refresh to get updated data
      window.location.reload();
    }
  }, [actionData]);

  // Helper function to check if a date is expired
  const isExpired = (dateStr: string | null | undefined) => {
    if (!dateStr) return false;
    return isBefore(new Date(dateStr), today);
  };

  // Helper function to get reminder status color
  const getReminderStatusColor = (dateStr: string) => {
    const daysUntil = Math.ceil(
      (new Date(dateStr).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysUntil < 0) return "danger";
    if (daysUntil <= 7) return "warning";
    if (daysUntil <= 30) return "primary";
    return "success";
  };

  if (location.pathname === "/mobileApp/customer") {
    return (
      <Layout>
        {/* Phone Number Update Modal */}
        <Modal
          isOpen={isOpen}
          onOpenChange={handleOpenChange}
          placement="center"
          backdrop="blur"
          isDismissable={!!user.phoneNumber}
          hideCloseButton={!user.phoneNumber}
          classNames={{
            backdrop:
              "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
          }}
        >
          <ModalContent>
            <Form method="post" onSubmit={handleUpdatePhone}>
              <ModalHeader className="flex flex-col gap-1">
                Update Your Phone Number
              </ModalHeader>
              <ModalBody>
                <p className="text-sm text-default-500 mb-2">
                  Please add your phone number for better communication and
                  account security.
                </p>
                <Input
                  autoFocus
                  label="Phone Number"
                  placeholder="Enter your phone number"
                  variant="bordered"
                  name="phoneNumber"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  startContent={
                    <IconPhone size={16} className="text-default-400" />
                  }
                  isInvalid={!!phoneError}
                  errorMessage={phoneError}
                  description="Format: +1234567890 or 1234567890"
                />
                {!user.phoneNumber && (
                  <p className="text-xs text-warning">
                    You must provide a valid phone number to continue.
                  </p>
                )}
              </ModalBody>
              <ModalFooter>
                {user.phoneNumber && (
                  <Button color="default" variant="light" onPress={() => onOpenChange(false)}>
                    Cancel
                  </Button>
                )}
                <Button 
                  type="submit" 
                  color="primary"
                  isDisabled={!isPhoneValid}
                >
                  Update
                </Button>
              </ModalFooter>
            </Form>
          </ModalContent>
        </Modal>

        <div className="flex flex-col gap-4 p-4 max-w-4xl mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-4 bg-gradient-to-r from-primary/10 to-secondary/10 p-4 rounded-lg"
          >
            <Avatar name={name} className="w-16 h-16 text-large" />
            <div className="flex-grow">
              <h1 className="text-xl font-semibold">{name}</h1>
              <p className="text-default-500">{user.email}</p>
              {user.phoneNumber && (
                <p className="text-xs text-default-400">{user.phoneNumber}</p>
              )}
            </div>
            {!user.phoneNumber && (
              <Button
                size="sm"
                color="warning"
                variant="flat"
                startContent={<IconPhone size={16} />}
                onPress={onOpen}
              >
                Add Phone
              </Button>
            )}
          </motion.div>

          {/* Vehicles Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="border-none">
              <CardHeader className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <IconCar size={24} className="text-primary" />
                  <h2 className="text-lg font-semibold">Your Vehicles</h2>
                </div>
                <div className="flex items-center gap-2">
                  <Chip size="sm" variant="flat" color="primary">
                    {user.vehicles.length} Vehicles
                  </Chip>
                  <Button
                    size="sm"
                    color="primary"
                    variant="flat"
                    startContent={<IconPlus size={16} />}
                    onPress={() => navigate("/mobileApp/customer/vehicles/new")}
                  >
                    Add Vehicle
                  </Button>
                </div>
              </CardHeader>
              <Divider />
              <CardBody className="gap-4">
                {user.vehicles.length > 0 ? (
                  user.vehicles.map((vehicle) => (
                    <motion.div
                      key={vehicle.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-4 rounded-lg bg-content2"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">
                            {vehicle.make} {vehicle.model}
                          </h3>
                          <p className="text-small text-default-500">
                            {vehicle.registrationNumber}
                          </p>
                          {vehicle.year && (
                            <p className="text-tiny text-default-400">
                              Year: {vehicle.year}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col gap-2 items-end">
                          <Chip
                            size="sm"
                            variant="flat"
                            color={
                              vehicle.reminders.some((r) =>
                                isExpired(r.reminderDate)
                              )
                                ? "danger"
                                : "success"
                            }
                          >
                            {vehicle.reminders.some((r) =>
                              isExpired(r.reminderDate)
                            )
                              ? "Action Required"
                              : "Up to Date"}
                          </Chip>
                          <Button
                            size="sm"
                            variant="light"
                            onPress={() =>
                              navigate(
                                `/mobileApp/customer/vehicles/${vehicle.id}`
                              )
                            }
                          >
                            Manage
                          </Button>
                        </div>
                      </div>
                      {vehicle.reminders.length > 0 && (
                        <div className="mt-3">
                          <p className="text-small font-medium mb-2">
                            Upcoming Reminders:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {vehicle.reminders.map((reminder) => (
                              <Chip
                                key={reminder.id}
                                size="sm"
                                variant="flat"
                                color={getReminderStatusColor(
                                  reminder.reminderDate
                                )}
                              >
                                {reminder.type}:{" "}
                                {format(
                                  new Date(reminder.reminderDate),
                                  "dd MMM yyyy"
                                )}
                              </Chip>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <p className="text-center text-default-500">
                    No vehicles registered
                  </p>
                )}
              </CardBody>
            </Card>
          </motion.div>

          {/* Licenses Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border-none">
              <CardHeader className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <IconLicense size={24} className="text-primary" />
                  <h2 className="text-lg font-semibold">Driving Licenses</h2>
                </div>
                <div className="flex items-center gap-2">
                  <Chip size="sm" variant="flat" color="primary">
                    {user.drivingLicenses.length} Licenses
                  </Chip>
                  <Button
                    size="sm"
                    color="primary"
                    variant="flat"
                    startContent={<IconPlus size={16} />}
                    onPress={() => navigate("/mobileApp/customer/licenses/new")}
                  >
                    Add License
                  </Button>
                </div>
              </CardHeader>
              <Divider />
              <CardBody className="gap-4">
                {user.drivingLicenses.length > 0 ? (
                  user.drivingLicenses.map((license) => (
                    <motion.div
                      key={license.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-4 rounded-lg bg-content2"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">
                            {license.licenseNumber}
                          </h3>
                          <p className="text-small text-default-500">
                            {license.issuingAuthority}
                          </p>
                          {license.issuedDate && (
                            <p className="text-tiny text-default-400">
                              Issued:{" "}
                              {format(
                                new Date(license.issuedDate),
                                "dd MMM yyyy"
                              )}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col gap-2 items-end">
                          <Chip
                            size="sm"
                            variant="flat"
                            color={
                              isExpired(license.expiryDate)
                                ? "danger"
                                : "success"
                            }
                          >
                            {license.expiryDate
                              ? `Expires: ${format(
                                  new Date(license.expiryDate),
                                  "dd MMM yyyy"
                                )}`
                              : "No Expiry Date"}
                          </Chip>
                          <Button
                            size="sm"
                            variant="light"
                            onPress={() =>
                              navigate(
                                `/mobileApp/customer/licenses/${license.id}`
                              )
                            }
                          >
                            Manage
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-center text-default-500">
                    No licenses registered
                  </p>
                )}
              </CardBody>
            </Card>
          </motion.div>

          {/* Recent Reminders Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="border-none">
              <CardHeader className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <IconBell size={24} className="text-primary" />
                  <h2 className="text-lg font-semibold">Upcoming Reminders</h2>
                </div>
                <div className="flex items-center gap-2">
                  <Chip size="sm" variant="flat" color="primary">
                    {user.reminders.length} Reminders
                  </Chip>
                  <Button
                    size="sm"
                    color="primary"
                    variant="flat"
                    startContent={<IconPlus size={16} />}
                    onPress={() =>
                      navigate("/mobileApp/customer/reminders/new")
                    }
                  >
                    Add Reminder
                  </Button>
                </div>
              </CardHeader>
              <Divider />
              <CardBody className="gap-4">
                {user.reminders.length > 0 ? (
                  user.reminders.map((reminder) => (
                    <motion.div
                      key={reminder.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-between items-center p-4 rounded-lg bg-content2"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg bg-${getReminderStatusColor(
                            reminder.reminderDate
                          )}/10`}
                        >
                          <IconAlertCircle
                            size={20}
                            className={`text-${getReminderStatusColor(
                              reminder.reminderDate
                            )}`}
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold">{reminder.type}</h3>
                          <p className="text-small text-default-500">
                            Due:{" "}
                            {format(
                              new Date(reminder.reminderDate),
                              "dd MMM yyyy"
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Chip
                          size="sm"
                          variant="flat"
                          color={getReminderStatusColor(reminder.reminderDate)}
                        >
                          {formatDistanceToNow(
                            new Date(reminder.reminderDate),
                            { addSuffix: true }
                          )}
                        </Chip>
                        <Button
                          size="sm"
                          variant="light"
                          onPress={() =>
                            navigate(`/mobileApp/customer/reminders`)
                          }
                        >
                          Manage
                        </Button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-center text-default-500">
                    No upcoming reminders
                  </p>
                )}
              </CardBody>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {quickActions.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              >
                <Card
                  isPressable
                  onPress={() => navigate(item.href)}
                  className="border-none"
                >
                  <CardBody className="gap-2">
                    <div
                      className={`p-3 rounded-lg bg-gradient-to-br ${getGradientByColor(
                        item.color
                      )}`}
                    >
                      <div className={`${item.color}`}>{item.icon}</div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{item.title}</h3>
                      <p className="text-tiny text-default-500">
                        {item.description}
                      </p>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return <Outlet />;
}
