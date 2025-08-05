import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Chip } from "@nextui-org/chip";
import { Divider } from "@nextui-org/divider";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useLoaderData, useLocation, useNavigate } from "@remix-run/react";
import { IconCar, IconPlus } from "@tabler/icons-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { getUserPrismaClient } from "~/lib/get-user-db.server";
import { getUserIdMobile } from "~/utils/session.server";
import Layout from "../../components/Layout";

export async function loader({ request }: LoaderFunctionArgs) {
  const { prisma } = await getUserPrismaClient(request);
  const userId = await getUserIdMobile(request);

  if (!userId) {
    throw new Error("Customer not found");
  }

  const vehicles = await prisma.vehicle.findMany({
    where: { userId },
    include: {
      reminders: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return json({ vehicles });
}

export default function VehiclesIndex() {
  const location = useLocation();
  if (location.pathname.includes("/mobileApp/customer/vehicles/")) {
    return <Outlet />;
  }
  const { vehicles } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const today = new Date();

  // Helper function to check if any reminders are expired
  const hasExpiredReminders = (reminders: any[]) => {
    return reminders.some(reminder => 
      new Date(reminder.reminderDate) < today
    );
  };

  return (
    <Layout>
      <div className="p-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-none">
            <CardHeader className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <IconCar size={24} className="text-primary" />
                <h1 className="text-xl font-semibold">Your Vehicles</h1>
              </div>
              <Button
                color="primary"
                endContent={<IconPlus size={16} />}
                onPress={() => navigate("new")}
              >
                Add Vehicle
              </Button>
            </CardHeader>
            <Divider />
            <CardBody className="gap-4">
              {vehicles.length > 0 ? (
                vehicles.map((vehicle) => (
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
                          color={hasExpiredReminders(vehicle.reminders) ? "danger" : "success"}
                        >
                          {hasExpiredReminders(vehicle.reminders) ? "Action Required" : "Up to Date"}
                        </Chip>
                        <Button
                          size="sm"
                          variant="light"
                          onPress={() => navigate(vehicle.id)}
                        >
                          Manage
                        </Button>
                      </div>
                    </div>
                    {vehicle.reminders.length > 0 && (
                      <div className="mt-3">
                        <p className="text-small font-medium mb-2">Reminders:</p>
                        <div className="flex flex-wrap gap-2">
                          {vehicle.reminders.map((reminder) => (
                            <Chip
                              key={reminder.id}
                              size="sm"
                              variant="flat"
                              color={new Date(reminder.reminderDate) < today ? "danger" : "primary"}
                            >
                              {reminder.type}: {format(new Date(reminder.reminderDate), 'dd MMM yyyy')}
                            </Chip>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 text-default-500">
                  <IconCar size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No vehicles registered yet</p>
                  <Button
                    color="primary"
                    variant="flat"
                    size="sm"
                    className="mt-4"
                    endContent={<IconPlus size={16} />}
                    onPress={() => navigate("new")}
                  >
                    Add Your First Vehicle
                  </Button>
                </div>
              )}
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
} 