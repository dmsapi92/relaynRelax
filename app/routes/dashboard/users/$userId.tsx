import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import { Tab, Tabs } from "@nextui-org/tabs";
import { json, redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getUserPrismaClient } from "~/lib/get-user-db.server";
import { getUserId } from "~/utils/session.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const adminId = await getUserId(request);
  if (!adminId) {
    return redirect("/auth/login");
  }

  const { prisma } = await getUserPrismaClient(request);

  // Verify admin role
  const currentUser = await prisma.user.findUnique({
    where: { id: adminId },
    select: { role: true },
  });

  if (currentUser?.role !== "ADMIN") {
    return redirect("/403");
  }

  const userId = params.userId;
  if (!userId) {
    return redirect("/dashboard/users");
  }

  // Fetch user with their vehicles and licenses
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      vehicles: {
        include: {
          reminders: true,
        },
      },
      drivingLicenses: {
        include: {
          reminders: true,
        },
      },
      reminders: true,
    },
  });

  if (!user) {
    return redirect("/dashboard/users");
  }

  return json({ user });
}

export default function UserDetailsRoute() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-gray-500">{user.email}</p>
        </div>
        <div>
          <Link to="/dashboard/users">
            <Button color="default" variant="flat">
              Back to Users
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
                <p className="text-gray-500">Phone Number</p>
                <p>{user.phoneNumber || "Not provided"}</p>
              </div>
              {user.address && (
                <div>
                  <p className="text-gray-500">Address</p>
                  <p>
                    {user.address.street}, {user.address.city},{" "}
                    {user.address.state}, {user.address.country},{" "}
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
                >
                  Message on WhatsApp
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

        <div className="md:col-span-2">
          <Tabs aria-label="User Data Tabs" fullWidth>
            <Tab key="vehicles" title="Vehicles">
              <Card>
                <CardBody>
                  {user.vehicles.length > 0 ? (
                    <Table aria-label="User's Vehicles">
                      <TableHeader>
                        <TableColumn>REGISTRATION</TableColumn>
                        <TableColumn>MAKE/MODEL</TableColumn>
                        <TableColumn>YEAR</TableColumn>
                        <TableColumn>REMINDERS</TableColumn>
                      </TableHeader>
                      <TableBody>
                        {user.vehicles.map((vehicle) => (
                          <TableRow key={vehicle.id}>
                            <TableCell>{vehicle.registrationNumber}</TableCell>
                            <TableCell>
                              {vehicle.make} {vehicle.model}
                            </TableCell>
                            <TableCell>{vehicle.year || "N/A"}</TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                {vehicle.reminders.length > 0 ? (
                                  vehicle.reminders.map((reminder) => (
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
                                  ))
                                ) : (
                                  <span className="text-gray-500">
                                    No reminders
                                  </span>
                                )}
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
            <Tab key="licenses" title="Driving Licenses">
              <Card>
                <CardBody>
                  {user.drivingLicenses.length > 0 ? (
                    <Table aria-label="User's Driving Licenses">
                      <TableHeader>
                        <TableColumn>LICENSE NUMBER</TableColumn>
                        <TableColumn>ISSUED DATE</TableColumn>
                        <TableColumn>EXPIRY DATE</TableColumn>
                        <TableColumn>REMINDERS</TableColumn>
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
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                {license.reminders.length > 0 ? (
                                  license.reminders.map((reminder) => (
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
                                  ))
                                ) : (
                                  <span className="text-gray-500">
                                    No reminders
                                  </span>
                                )}
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
            <Tab key="reminders" title="All Reminders">
              <Card>
                <CardBody>
                  {user.reminders.length > 0 ? (
                    <Table aria-label="User's Reminders">
                      <TableHeader>
                        <TableColumn>TYPE</TableColumn>
                        <TableColumn>FOR</TableColumn>
                        <TableColumn>DATE</TableColumn>
                        <TableColumn>NOTIFY BEFORE</TableColumn>
                      </TableHeader>
                      <TableBody>
                        {user.reminders.map((reminder) => (
                          <TableRow key={reminder.id}>
                            <TableCell>{reminder.type}</TableCell>
                            <TableCell>
                              {reminder.vehicleId ? (
                                <span className="text-primary">Vehicle</span>
                              ) : reminder.licenseId ? (
                                <span className="text-secondary">License</span>
                              ) : (
                                <span className="text-default">General</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {new Date(
                                reminder.reminderDate
                              ).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              {reminder.notifyDaysBefore} days
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500">
                        This user has no reminders set.
                      </p>
                    </div>
                  )}
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
