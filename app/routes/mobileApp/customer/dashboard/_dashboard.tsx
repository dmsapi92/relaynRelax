import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { Progress } from "@nextui-org/progress";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { IconAlertTriangle, IconBell, IconCalendarEvent, IconCar, IconCheck, IconLicense } from "@tabler/icons-react";
import { differenceInDays, format } from "date-fns";
import { motion } from "framer-motion";
import { getUserPrismaClient } from "~/lib/get-user-db.server";
import { getUserIdMobile } from "~/utils/session.server";
import Layout from "../../components/Layout";

export async function loader({ request }: LoaderFunctionArgs) {
  const { prisma } = await getUserPrismaClient(request);
  const userId = await getUserIdMobile(request);

  if (!userId) {
    throw new Error("User not found");
  }

  const [vehicles, licenses, reminders] = await Promise.all([
    prisma.vehicle.findMany({
      where: { userId },
      include: {
        _count: {
          select: { reminders: true }
        }
      }
    }),
    prisma.drivingLicense.findMany({
      where: { userId },
      include: {
        _count: {
          select: { reminders: true }
        }
      }
    }),
    prisma.reminder.findMany({
      where: { userId },
      include: {
        vehicle: {
          select: {
            registrationNumber: true,
            make: true,
            model: true,
          }
        },
        license: {
          select: {
            licenseNumber: true,
          }
        }
      },
      orderBy: {
        reminderDate: 'asc'
      }
    })
  ]);

  return json({ vehicles, licenses, reminders });
}

export default function Dashboard() {
  const { vehicles, licenses, reminders } = useLoaderData<typeof loader>();
  
  const today = new Date();
  const reminderStats = {
    overdue: reminders.filter(r => differenceInDays(new Date(r.reminderDate), today) < 0),
    upcoming: reminders.filter(r => {
      const days = differenceInDays(new Date(r.reminderDate), today);
      return days >= 0 && days <= r.notifyDaysBefore;
    }),
    future: reminders.filter(r => {
      const days = differenceInDays(new Date(r.reminderDate), today);
      return days > r.notifyDaysBefore;
    })
  };

  const getNextDueReminder = () => {
    const futureReminders = reminders.filter(r => 
      differenceInDays(new Date(r.reminderDate), today) >= 0
    );
    return futureReminders[0] || null;
  };

  const nextDueReminder = getNextDueReminder();

  return (
    <Layout title="Dashboard">
      <div className="p-2 sm:p-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-none">
              <CardBody className="gap-2">
                <div className="flex justify-between items-center">
                  <p className="text-default-500">Total Vehicles</p>
                  <IconCar className="text-primary" size={24} />
                </div>
                <div className="flex items-baseline">
                  <span className="text-3xl font-semibold">{vehicles.length}</span>
                  <span className="text-small text-default-500 ml-2">registered</span>
                </div>
                <Progress 
                  size="sm" 
                  value={100} 
                  color="primary"
                  className="mt-2"
                />
              </CardBody>
            </Card>

            <Card className="border-none">
              <CardBody className="gap-2">
                <div className="flex justify-between items-center">
                  <p className="text-default-500">Total Licenses</p>
                  <IconLicense className="text-primary" size={24} />
                </div>
                <div className="flex items-baseline">
                  <span className="text-3xl font-semibold">{licenses.length}</span>
                  <span className="text-small text-default-500 ml-2">active</span>
                </div>
                <Progress 
                  size="sm" 
                  value={100} 
                  color="primary"
                  className="mt-2"
                />
              </CardBody>
            </Card>

            <Card className="border-none">
              <CardBody className="gap-2">
                <div className="flex justify-between items-center">
                  <p className="text-default-500">Active Reminders</p>
                  <IconCalendarEvent className="text-primary" size={24} />
                </div>
                <div className="flex items-baseline">
                  <span className="text-3xl font-semibold">
                    {reminders.filter(r => r.isEnabled).length}
                  </span>
                  <span className="text-small text-default-500 ml-2">
                    of {reminders.length}
                  </span>
                </div>
                <Progress 
                  size="sm" 
                  value={(reminders.filter(r => r.isEnabled).length / reminders.length) * 100} 
                  color="primary"
                  className="mt-2"
                />
              </CardBody>
            </Card>

            <Card className="border-none">
              <CardBody className="gap-2">
                <div className="flex justify-between items-center">
                  <p className="text-default-500">Overdue</p>
                  <IconAlertTriangle className="text-danger" size={24} />
                </div>
                <div className="flex items-baseline">
                  <span className="text-3xl font-semibold text-danger">
                    {reminderStats.overdue.length}
                  </span>
                  <span className="text-small text-default-500 ml-2">reminders</span>
                </div>
                <Progress 
                  size="sm" 
                  value={(reminderStats.overdue.length / reminders.length) * 100} 
                  color="danger"
                  className="mt-2"
                />
              </CardBody>
            </Card>
          </div>

          {/* Next Due Reminder */}
          {nextDueReminder && (
            <Card className="border-none">
              <CardHeader className="flex gap-2">
                <IconBell className="text-primary" size={24} />
                <div>
                  <p className="text-lg font-semibold">Next Due Reminder</p>
                  <p className="text-small text-default-500">Your upcoming reminder</p>
                </div>
              </CardHeader>
              <Divider />
              <CardBody>
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div>
                    <p className="font-medium">
                      {nextDueReminder.vehicle 
                        ? `${nextDueReminder.vehicle.make} ${nextDueReminder.vehicle.model} (${nextDueReminder.vehicle.registrationNumber})`
                        : nextDueReminder.license
                        ? `License: ${nextDueReminder.license.licenseNumber}`
                        : 'General Reminder'
                      }
                    </p>
                    <p className="text-default-500">{nextDueReminder.type.replace(/_/g, ' ')}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium">
                        {format(new Date(nextDueReminder.reminderDate), 'dd MMM yyyy')}
                      </p>
                      <p className="text-small text-default-500">
                        {differenceInDays(new Date(nextDueReminder.reminderDate), today)} days remaining
                      </p>
                    </div>
                    {nextDueReminder.isEnabled ? (
                      <IconCheck className="text-success" size={24} />
                    ) : (
                      <IconAlertTriangle className="text-warning" size={24} />
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          )}

          {/* Reminder Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="border-none">
              <CardHeader className="flex gap-2">
                <IconCalendarEvent className="text-primary" size={24} />
                <div>
                  <p className="text-lg font-semibold">Reminder Status</p>
                  <p className="text-small text-default-500">Overview of your reminders</p>
                </div>
              </CardHeader>
              <Divider />
              <CardBody>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <p className="text-default-500">Overdue</p>
                      <p className="font-medium text-danger">{reminderStats.overdue.length}</p>
                    </div>
                    <Progress 
                      size="md" 
                      value={(reminderStats.overdue.length / reminders.length) * 100} 
                      color="danger"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <p className="text-default-500">Upcoming</p>
                      <p className="font-medium text-warning">{reminderStats.upcoming.length}</p>
                    </div>
                    <Progress 
                      size="md" 
                      value={(reminderStats.upcoming.length / reminders.length) * 100} 
                      color="warning"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <p className="text-default-500">Future</p>
                      <p className="font-medium text-success">{reminderStats.future.length}</p>
                    </div>
                    <Progress 
                      size="md" 
                      value={(reminderStats.future.length / reminders.length) * 100} 
                      color="success"
                    />
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="border-none">
              <CardHeader className="flex gap-2">
                <IconCar className="text-primary" size={24} />
                <div>
                  <p className="text-lg font-semibold">Vehicle Overview</p>
                  <p className="text-small text-default-500">Status of your vehicles</p>
                </div>
              </CardHeader>
              <Divider />
              <CardBody>
                <div className="space-y-4">
                  {vehicles.map(vehicle => (
                    <div key={vehicle.id}>
                      <div className="flex justify-between mb-2">
                        <div>
                          <p className="font-medium">{vehicle.registrationNumber}</p>
                          <p className="text-small text-default-500">
                            {vehicle.make} {vehicle.model}
                          </p>
                        </div>
                        <p className="font-medium">
                          {vehicle._count.reminders} reminders
                        </p>
                      </div>
                      <Progress 
                        size="md" 
                        value={100} 
                        color="primary"
                      />
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Recent Reminders */}
          <Card className="border-none">
            <CardHeader className="flex gap-2">
              <IconCalendarEvent className="text-primary" size={24} />
              <div>
                <p className="text-lg font-semibold">Recent Reminders</p>
                <p className="text-small text-default-500">Your latest reminder activities</p>
              </div>
            </CardHeader>
            <Divider />
            <CardBody>
              <div className="space-y-4">
                {reminders.slice(0, 5).map(reminder => {
                  const daysUntilDue = differenceInDays(new Date(reminder.reminderDate), today);
                  const isOverdue = daysUntilDue < 0;
                  const isUpcoming = daysUntilDue >= 0 && daysUntilDue <= reminder.notifyDaysBefore;
                  
                  return (
                    <div 
                      key={reminder.id}
                      className="flex justify-between items-center p-3 bg-content2 rounded-lg"
                    >
                      <div className="flex gap-3 items-center">
                        {isOverdue ? (
                          <IconAlertTriangle className="text-danger" size={20} />
                        ) : isUpcoming ? (
                          <IconBell className="text-warning" size={20} />
                        ) : (
                          <IconCheck className="text-success" size={20} />
                        )}
                        <div>
                          <p className="font-medium">
                            {reminder.vehicle 
                              ? reminder.vehicle.registrationNumber
                              : reminder.license
                              ? reminder.license.licenseNumber
                              : 'General'
                            }
                          </p>
                          <p className="text-small text-default-500">
                            {reminder.type.replace(/_/g, ' ')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {format(new Date(reminder.reminderDate), 'dd MMM yyyy')}
                        </p>
                        <p className={`text-small ${
                          isOverdue ? 'text-danger' : 
                          isUpcoming ? 'text-warning' : 
                          'text-success'
                        }`}>
                          {isOverdue 
                            ? `${Math.abs(daysUntilDue)} days overdue`
                            : `${daysUntilDue} days remaining`
                          }
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
}
