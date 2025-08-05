import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import { IconArrowLeft, IconBell } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { FormFieldComponent } from "~/components/ui/form-field";
import { getUserPrismaClient } from "~/lib/get-user-db.server";
import { getUserIdMobile } from "~/utils/session.server";
import Layout from "../../../components/Layout";

// Define ReminderType enum to match Prisma schema
enum ReminderType {
  PUCC = "PUCC",
  FITNESS = "FITNESS",
  TAX = "TAX",
  INSURANCE = "INSURANCE",
  PERMIT = "PERMIT",
  NATIONAL_PERMIT = "NATIONAL_PERMIT",
  LICENSE_EXPIRY = "LICENSE_EXPIRY",
  OTHER = "OTHER",
}

export async function loader({ request }: LoaderFunctionArgs) {
  const { prisma } = await getUserPrismaClient(request);
  const userId = await getUserIdMobile(request);

  if (!userId) {
    throw new Error("Customer not found");
  }

  const vehicles = await prisma.vehicle.findMany({
    where: { userId },
    select: {
      id: true,
      registrationNumber: true,
      make: true,
      model: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return json({ vehicles });
}

export async function action({ request }: ActionFunctionArgs) {
  const { prisma } = await getUserPrismaClient(request);
  const userId = await getUserIdMobile(request);

  if (!userId) {
    throw new Error("Customer not found");
  }

  const formData = await request.formData();
  const type = formData.get("type") as ReminderType;
  const reminderDate = formData.get("reminderDate") as string;
  const vehicleId = formData.get("vehicleId") as string;

  // Validation
  const errors: Record<string, string> = {};
  if (!type) errors.type = "Reminder type is required";
  if (!Object.values(ReminderType).includes(type)) {
    errors.type = "Invalid reminder type";
  }
  if (!reminderDate) errors.reminderDate = "Reminder date is required";
  if (new Date(reminderDate) < new Date()) {
    errors.reminderDate = "Reminder date must be in the future";
  }
  if (!vehicleId) errors.vehicleId = "Vehicle is required";

  if (Object.keys(errors).length > 0) {
    return json({ errors });
  }

  await prisma.reminder.create({
    data: {
      type,
      reminderDate: new Date(reminderDate),
      userId,
      vehicleId,
    },
  });

  return redirect("..");
}

export default function NewReminder() {
  const actionData = useActionData<typeof action>();
  const { vehicles } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

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
                <Button
                  isIconOnly
                  variant="light"
                  onPress={() => navigate("..")}
                >
                  <IconArrowLeft size={20} />
                </Button>
                <div className="flex items-center gap-2">
                  <IconBell size={24} className="text-primary" />
                  <h1 className="text-xl font-semibold">Add New Reminder</h1>
                </div>
              </div>
            </CardHeader>
            <Divider />
            <CardBody>
              <Form method="post" className="flex flex-col gap-4">
                <FormFieldComponent
                  field={{
                    id: "vehicleId",
                    type: "select",
                    label: "Vehicle",
                    name: "vehicleId",
                    required: true,
                    options: vehicles.map((vehicle) => ({
                      label: `${vehicle.make || ""} ${vehicle.model || ""} (${
                        vehicle.registrationNumber
                      })`,
                      value: vehicle.id,
                    })),
                  }}
                  error={actionData?.errors?.vehicleId}
                />

                <FormFieldComponent
                  field={{
                    id: "type",
                    type: "select",
                    label: "Reminder Type",
                    name: "type",
                    required: true,
                    options: Object.values(ReminderType)
                      .filter((type) => type !== "LICENSE_EXPIRY")
                      .map((type) => ({
                        label: type
                          .replace(/_/g, " ")
                          .toLowerCase()
                          .replace(/\b\w/g, (l) => l.toUpperCase()),
                        value: type,
                      })),
                  }}
                  error={actionData?.errors?.type}
                />

                <FormFieldComponent
                  field={{
                    id: "reminderDate",
                    type: "datetime-local",
                    label: "Reminder Date",
                    name: "reminderDate",
                    required: true,
                  }}
                  error={actionData?.errors?.reminderDate}
                />

                <div className="flex gap-2 justify-end mt-4">
                  <Button variant="flat" onPress={() => navigate("..")}>
                    Cancel
                  </Button>
                  <Button color="primary" type="submit">
                    Add Reminder
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
}
