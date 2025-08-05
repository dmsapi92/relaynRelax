import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Chip } from "@nextui-org/chip";
import { Divider } from "@nextui-org/divider";
import { Progress } from "@nextui-org/progress";
import { Tooltip } from "@nextui-org/tooltip";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import {
  IconActivity,
  IconBell,
  IconCar,
  IconChartBar,
  IconCheck,
  IconLicense,
  IconPlus,
  IconUsers
} from "@tabler/icons-react";
import { format, isAfter } from "date-fns";
import { motion } from "framer-motion";
import { Area, AreaChart, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { getUserPrismaClient } from "~/lib/get-user-db.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const { prisma } = await getUserPrismaClient(request);

  const today = new Date();
  const thirtyDaysAgo = new Date(today.setDate(today.getDate() - 30));

  const [
    totalUsers,
    totalVehicles,
    totalLicenses,
    totalReminders,
    recentUsers,
    recentVehicles,
    upcomingReminders,
    recentActivity,
    monthlyStats,
    remindersByType
  ] = await Promise.all([
    prisma.user.count(),
    prisma.vehicle.count(),
    prisma.drivingLicense.count(), 
    prisma.reminder.count(),
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true
      }
    }),
    prisma.vehicle.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        reminders: true
      }
    }),
    prisma.reminder.findMany({
      where: {
        reminderDate: {
          gte: new Date()
        }
      },
      take: 10,
      orderBy: { reminderDate: 'asc' },
      include: {
        vehicle: true,
        license: true,
        user: true
      }
    }),
    prisma.activityLog.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: true
      }
    }),
    prisma.vehicle.groupBy({
      by: ['createdAt'],
      _count: {
        id: true
      },
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    }),
    prisma.reminder.groupBy({
      by: ['type'],
      _count: {
        id: true
      }
    })
  ]);

  return json({
    stats: {
      totalUsers,
      totalVehicles, 
      totalLicenses,
      totalReminders
    },
    recentUsers,
    recentVehicles,
    upcomingReminders,
    recentActivity,
    monthlyStats,
    remindersByType
  });
}

export default function Dashboard() {
  const { 
    stats, 
    recentUsers, 
    recentVehicles, 
    upcomingReminders,
    recentActivity,
    monthlyStats,
    remindersByType 
  } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const chartData = monthlyStats.map(stat => ({
    date: format(new Date(stat.createdAt), 'MMM dd'),
    vehicles: stat._count.id
  }));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="cursor-pointer"
          onClick={() => navigate("/users")}
        >
          <Card className="border-none hover:shadow-lg transition-shadow">
            <CardBody className="flex flex-row items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <IconUsers className="text-primary" size={24} />
              </div>
              <div>
                <p className="text-small text-default-500">Total Users</p>
                <p className="text-xl font-semibold">{stats.totalUsers}</p>
                <Progress 
                  size="sm" 
                  value={75} 
                  color="primary"
                  className="mt-2"
                />
              </div>
            </CardBody>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="cursor-pointer"
          onClick={() => navigate("/vehicles")}
        >
          <Card className="border-none hover:shadow-lg transition-shadow">
            <CardBody className="flex flex-row items-center gap-4">
              <div className="p-3 rounded-lg bg-success/10">
                <IconCar className="text-success" size={24} />
              </div>
              <div>
                <p className="text-small text-default-500">Total Vehicles</p>
                <p className="text-xl font-semibold">{stats.totalVehicles}</p>
                <Progress 
                  size="sm" 
                  value={85} 
                  color="success"
                  className="mt-2"
                />
              </div>
            </CardBody>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="cursor-pointer"
          onClick={() => navigate("/licenses")}
        >
          <Card className="border-none hover:shadow-lg transition-shadow">
            <CardBody className="flex flex-row items-center gap-4">
              <div className="p-3 rounded-lg bg-warning/10">
                <IconLicense className="text-warning" size={24} />
              </div>
              <div>
                <p className="text-small text-default-500">Total Licenses</p>
                <p className="text-xl font-semibold">{stats.totalLicenses}</p>
                <Progress 
                  size="sm" 
                  value={60} 
                  color="warning"
                  className="mt-2"
                />
              </div>
            </CardBody>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="cursor-pointer"
          onClick={() => navigate("/reminders")}
        >
          <Card className="border-none hover:shadow-lg transition-shadow">
            <CardBody className="flex flex-row items-center gap-4">
              <div className="p-3 rounded-lg bg-secondary/10">
                <IconBell className="text-secondary" size={24} />
              </div>
              <div>
                <p className="text-small text-default-500">Active Reminders</p>
                <p className="text-xl font-semibold">{stats.totalReminders}</p>
                <Progress 
                  size="sm" 
                  value={40} 
                  color="secondary"
                  className="mt-2"
                />
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>

      {/* Analytics Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Card className="border-none">
          <CardHeader className="flex justify-between">
            <div className="flex gap-2 items-center">
              <IconChartBar size={24} className="text-primary"/>
              <h2 className="text-lg font-semibold">Vehicle Registration Trends</h2>
            </div>
          </CardHeader>
          <Divider/>
          <CardBody className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <RechartsTooltip />
                <Area 
                  type="monotone" 
                  dataKey="vehicles" 
                  stroke="#006FEE" 
                  fill="#006FEE" 
                  fillOpacity={0.1} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </motion.div>

      {/* Upcoming Reminders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <Card className="border-none">
          <CardHeader className="flex justify-between">
            <div className="flex gap-2 items-center">
              <IconBell size={24} className="text-primary"/>
              <h2 className="text-lg font-semibold">Upcoming Reminders</h2>
            </div>
            <Button
              color="primary"
              variant="flat"
              startContent={<IconPlus size={16} />}
              onPress={() => navigate("/reminders")}
            >
              Add Reminder
            </Button>
          </CardHeader>
          <Divider/>
          <CardBody>
            <div className="space-y-4">
              {upcomingReminders.map((reminder) => {
                const isOverdue = isAfter(new Date(), new Date(reminder.reminderDate));
                const daysUntil = Math.ceil((new Date(reminder.reminderDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                
                return (
                  <motion.div
                    key={reminder.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-between items-center p-4 rounded-lg bg-content2"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">
                          {reminder.type}
                        </h3>
                        <Chip 
                          size="sm" 
                          color={isOverdue ? "danger" : daysUntil <= 7 ? "warning" : "success"}
                        >
                          {isOverdue ? 'Overdue' : `${daysUntil} days left`}
                        </Chip>
                      </div>
                      <p className="text-small text-default-500">
                        {reminder.vehicle ? `Vehicle: ${reminder.vehicle.make} ${reminder.vehicle.model}` : 
                         reminder.license ? `License: ${reminder.license.licenseNumber}` : 'N/A'}
                      </p>
                      <p className="text-tiny text-default-400">
                        Due: {format(new Date(reminder.reminderDate), 'dd MMM yyyy')}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Tooltip content="Mark as Complete">
                        <Button
                          size="sm"
                          isIconOnly
                          variant="light"
                          color="success"
                        >
                          <IconCheck size={16} />
                        </Button>
                      </Tooltip>
                      <Button
                        size="sm"
                        variant="light"
                      >
                        View
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
      >
        <Card className="border-none">
          <CardHeader>
            <div className="flex gap-2 items-center">
              <IconActivity size={24} className="text-primary"/>
              <h2 className="text-lg font-semibold">Recent Activity</h2>
            </div>
          </CardHeader>
          <Divider/>
          <CardBody>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-4 p-4 rounded-lg bg-content2"
                >
                  <div className="p-2 rounded-full bg-primary/10">
                    <IconActivity size={20} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.action} {activity.entityType}</p>
                    <p className="text-small text-default-500">
                      By {activity.user?.firstName} {activity.user?.lastName}
                    </p>
                  </div>
                  <Chip size="sm" variant="flat">
                    {format(new Date(activity.createdAt), 'dd MMM yyyy HH:mm')}
                  </Chip>
                </motion.div>
              ))}
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* Recent Users and Vehicles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
        >
          <Card className="border-none">
            <CardHeader className="flex justify-between">
              <div className="flex gap-2 items-center">
                <IconUsers size={24} className="text-primary"/>
                <h2 className="text-lg font-semibold">Recent Users</h2>
              </div>
              <Button
                color="primary"
                variant="flat"
                startContent={<IconPlus size={16} />}
                onPress={() => navigate("/users/new")}
              >
                Add User
              </Button>
            </CardHeader>
            <Divider/>
            <CardBody>
              <div className="space-y-4">
                {recentUsers.map((user) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-between items-center p-4 rounded-lg bg-content2"
                  >
                    <div>
                      <h3 className="font-semibold">
                        {user.firstName} {user.lastName}
                      </h3>
                      <p className="text-small text-default-500">{user.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Chip size="sm" variant="flat">
                        {format(new Date(user.createdAt), 'dd MMM yyyy')}
                      </Chip>
                      <Button
                        size="sm"
                        variant="light"
                        onPress={() => navigate(`/users/${user.id}`)}
                      >
                        View
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Recent Vehicles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.8 }}
        >
          <Card className="border-none">
            <CardHeader className="flex justify-between">
              <div className="flex gap-2 items-center">
                <IconCar size={24} className="text-primary"/>
                <h2 className="text-lg font-semibold">Recent Vehicles</h2>
              </div>
              <Button
                color="primary"
                variant="flat"
                startContent={<IconPlus size={16} />}
                onPress={() => navigate("/vehicles")}
              >
                Add Vehicle
              </Button>
            </CardHeader>
            <Divider/>
            <CardBody>
              <div className="space-y-4">
                {recentVehicles.map((vehicle) => (
                  <motion.div
                    key={vehicle.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-between items-center p-4 rounded-lg bg-content2"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">
                          {vehicle.make} {vehicle.model}
                        </h3>
                        {vehicle.reminders && vehicle.reminders.length > 0 && (
                          <Tooltip content="Has active reminders">
                            <IconBell size={16} className="text-warning" />
                          </Tooltip>
                        )}
                      </div>
                      <p className="text-small text-default-500">
                        {vehicle.registrationNumber}
                      </p>
                      <p className="text-tiny text-default-400">
                        Owner: {vehicle.user.firstName} {vehicle.user.lastName}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="light"
                      onPress={() => navigate(`/vehicles/${vehicle.id}`)}
                    >
                      View
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

