import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import {
  ActionFunctionArgs,
  json,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import { motion } from "framer-motion";
import { FormFieldComponent } from "~/components/ui/form-field";
import { getUserPrismaClient } from "~/lib/get-user-db.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const { prisma } = await getUserPrismaClient(request);

  const systemAdmin = await prisma.system.findFirst({});

  if (!systemAdmin) {
    throw new Error("User not found");
  }

  return json({ systemAdmin });
}

export async function action({ request }: ActionFunctionArgs) {
  const { prisma } = await getUserPrismaClient(request);
  const formData = await request.formData();
  console.log(formData);

  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const phone = formData.get("phoneNumber") as string;
  const street = formData.get("street") as string;
  const city = formData.get("city") as string;
  const state = formData.get("state") as string;
  const country = formData.get("country") as string;
  const zipCode = formData.get("zipCode") as string;
  const isTwoFactorAuth = formData.get("isTwoFactorAuth") == "";
  console.log(isTwoFactorAuth);

  const systemAdmin = await prisma.system.findFirst({});
  // Update profile info
  await prisma.system.update({
    where: { id: systemAdmin?.id }, // Assuming first record
    data: {
      firstName,
      lastName,
      phone: phone as string,
      isTwoFactorAuth,
      address: {
        street,
        city,
        state,
        country,
        zipCode,
      },
    },
  });

  return json({ success: true });
}

export default function Profile() {
  const { systemAdmin } = useLoaderData<typeof loader>();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold">Profile Settings</h1>
      </motion.div>

      <Form method="post">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Personal Information</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormFieldComponent
                field={{
                  id: "firstName",
                  name: "firstName",
                  label: "First Name",
                  defaultValue: systemAdmin.firstName || "",
                  type: "text",
                }}
              />
              <FormFieldComponent
                field={{
                  id: "lastName",
                  name: "lastName",
                  label: "Last Name",
                  defaultValue: systemAdmin.lastName || "",
                  type: "text",
                }}
              />
            </div>

            <FormFieldComponent
              field={{
                id: "email",
                name: "email",
                label: "Email",
                defaultValue: systemAdmin.email,
                type: "email",
                readOnly: true,
              }}
            />

            <FormFieldComponent
              field={{
                id: "phoneNumber",
                name: "phoneNumber",
                label: "Phone Number",
                defaultValue: systemAdmin.phone || "",
                type: "text",
              }}
            />

            <FormFieldComponent
              field={{
                id: "isTwoFactorAuth",
                name: "isTwoFactorAuth",
                label: "Enable Two-Factor Authentication",
                value: systemAdmin.isTwoFactorAuth || false,
                defaultValue: systemAdmin.isTwoFactorAuth || false,
                type: "checkbox",
              }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormFieldComponent
                field={{
                  id: "street",
                  name: "street",
                  label: "Street Address",
                  defaultValue: systemAdmin.address?.street || "",
                  type: "text",
                }}
              />
              <FormFieldComponent
                field={{
                  id: "city",
                  name: "city",
                  label: "City",
                  defaultValue: systemAdmin.address?.city || "",
                  type: "text",
                }}
              />
              <FormFieldComponent
                field={{
                  id: "state",
                  name: "state",
                  label: "State",
                  defaultValue: systemAdmin.address?.state || "",
                  type: "text",
                }}
              />
              <FormFieldComponent
                field={{
                  id: "country",
                  name: "country",
                  label: "Country",
                  defaultValue: systemAdmin.address?.country || "",
                  type: "text",
                }}
              />
              <FormFieldComponent
                field={{
                  id: "zipCode",
                  name: "zipCode",
                  label: "ZIP Code",
                  defaultValue: systemAdmin.address?.zipCode || "",
                  type: "text",
                }}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="submit"
                color="primary"
                isLoading={useNavigation().state === "submitting"}
              >
                Save Changes
              </Button>
            </div>
          </CardBody>
        </Card>
      </Form>
    </div>
  );
}
