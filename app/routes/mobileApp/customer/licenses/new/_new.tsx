import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useActionData, useNavigate } from "@remix-run/react";
import { IconArrowLeft, IconLicense } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { FormFieldComponent } from "~/components/ui/form-field";
import { getUserPrismaClient } from "~/lib/get-user-db.server";
import { getUserIdMobile } from "~/utils/session.server";
import Layout from "../../../components/Layout";

export async function action({ request }: ActionFunctionArgs) {
  const { prisma } = await getUserPrismaClient(request);
  const userId = await getUserIdMobile(request);

  if (!userId) {
    throw new Error("Customer not found");
  }

  const formData = await request.formData();
  const licenseNumber = formData.get("licenseNumber") as string;
  const issuingAuthority = formData.get("issuingAuthority") as string;
  const issuedDate = formData.get("issuedDate") as string;
  const expiryDate = formData.get("expiryDate") as string;

  // Validation
  const errors: Record<string, string> = {};
  if (!licenseNumber) errors.licenseNumber = "License number is required";
  if (!issuingAuthority) errors.issuingAuthority = "Issuing authority is required";
  if (!issuedDate) errors.issuedDate = "Issue date is required";
  if (!expiryDate) errors.expiryDate = "Expiry date is required";

  if (issuedDate && expiryDate && new Date(issuedDate) > new Date(expiryDate)) {
    errors.expiryDate = "Expiry date must be after issue date";
  }

  if (Object.keys(errors).length > 0) {
    return json({ errors });
  }

  // Convert dates to ISO format with time component
  const formattedIssuedDate = new Date(issuedDate).toISOString();
  const formattedExpiryDate = new Date(expiryDate).toISOString();

  await prisma.drivingLicense.create({
    data: {
      licenseNumber,
      issuingAuthority,
      issuedDate: formattedIssuedDate,
      expiryDate: formattedExpiryDate,
      userId,
    },
  });

  return redirect("..");
}

export default function NewLicense() {

  const actionData = useActionData<typeof action>();
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
                  <IconLicense size={24} className="text-primary" />
                  <h1 className="text-xl font-semibold">Add New License</h1>
                </div>
              </div>
            </CardHeader>
            <Divider />
            <CardBody>
              <Form method="post" className="flex flex-col gap-4">
                <FormFieldComponent
                  field={{
                    id: "licenseNumber",
                    type: "text",
                    label: "License Number",
                    name: "licenseNumber",
                    placeholder: "Enter license number",
                    required: true,
                  }}
                  error={actionData?.errors?.licenseNumber}
                />

                <FormFieldComponent
                  field={{
                    id: "issuingAuthority",
                    type: "text",
                    label: "Issuing Authority",
                    name: "issuingAuthority",
                    placeholder: "Enter issuing authority",
                    required: true,
                  }}
                  error={actionData?.errors?.issuingAuthority}
                />

                <FormFieldComponent
                  field={{
                    id: "issuedDate",
                    type: "date",
                    label: "Issue Date",
                    name: "issuedDate",
                    required: true,
                  }}
                  error={actionData?.errors?.issuedDate}
                />

                <FormFieldComponent
                  field={{
                    id: "expiryDate",
                    type: "date",
                    label: "Expiry Date",
                    name: "expiryDate",
                    required: true,
                  }}
                  error={actionData?.errors?.expiryDate}
                />

                <div className="flex gap-2 justify-end mt-4">
                  <Button
                    variant="flat"
                    onPress={() => navigate("..")}
                  >
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    type="submit"
                  >
                    Add License
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