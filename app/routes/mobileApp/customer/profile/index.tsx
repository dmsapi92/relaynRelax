import { Avatar } from "@nextui-org/avatar";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { Modal, ModalContent } from "@nextui-org/modal";
import type { ActionFunction } from "@remix-run/node";
import {
  json,
  type LoaderFunctionArgs
} from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "@remix-run/react";
import {
  IconEdit,
  IconMail,
  IconMapPin,
  IconPhone,
  IconShield,
  IconUserCheck,
  IconUserX
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { FormFieldComponent } from "~/components/ui/form-field";
import { getUserPrismaClient } from "~/lib/get-user-db.server";
import { getUserIdMobile } from "~/utils/session.server";
import Layout from "../../components/Layout";

interface ActionData {
  errors?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    _form?: string;
  };
  success?: boolean;
}

interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  isActive: boolean;
  isVerified: boolean;
  address: Address | null;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const { prisma } = await getUserPrismaClient(request);
  const userId = await getUserIdMobile(request);

  if (!userId) {
    throw new Error("Customer not found");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("Customer not found");
  }

  return json({ user });
}

export const action: ActionFunction = async ({ request }) => {
  const { prisma } = await getUserPrismaClient(request);
  const userId = await getUserIdMobile(request);

  if (!userId) {
    return json<ActionData>({ errors: { _form: "Unauthorized" } }, { status: 401 });
  }

  const formData = await request.formData();
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const phoneNumber = formData.get("phoneNumber") as string;

  // Address fields
  const street = formData.get("street") as string;
  const city = formData.get("city") as string;
  const state = formData.get("state") as string;
  const country = formData.get("country") as string;
  const zipCode = formData.get("zipCode") as string;

  // Basic validation
  const errors: ActionData["errors"] = {};
  if (!firstName) errors.firstName = "First name is required";
  if (!lastName) errors.lastName = "Last name is required";

  if (Object.keys(errors).length > 0) {
    return json<ActionData>({ errors });
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        phoneNumber,
        address: street
          ? {
              street,
              city,
              state,
              country,
              zipCode,
            }
          : undefined,
      },
    });

    return json<ActionData>({ success: true });
  } catch (error) {
    console.error("Error updating profile:", error);
    return json<ActionData>({
      errors: { _form: "Error updating profile. Please try again." },
    });
  }
};

export default function CustomerProfile() {
  const { user } = useLoaderData<typeof loader>();
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [showEditModal, setShowEditModal] = useState(false);
  const name = `${user.firstName} ${user.lastName}`;
  const navigate = useNavigate();

  const formFields = [
    {
      id: "firstName",
      name: "firstName",
      label: "First Name",
      type: "text" as const,
      placeholder: "Enter your first name",
      required: true,
    },
    {
      id: "lastName",
      name: "lastName",
      label: "Last Name",
      type: "text" as const,
      placeholder: "Enter your last name",
      required: true,
    },
    {
      id: "phone",
      name: "phone",
      label: "Phone Number",
      type: "tel" as const,
      placeholder: "Enter your phone number",
      required: true,
    },
    {
      id: "address",
      name: "address",
      label: "Address",
      type: "textarea" as const,
      placeholder: "Enter your address",
      required: true,
      textareaProps: {
        minRows: 2,
        maxRows: 4,
      },
    },
  ] as const;

  return (
    <Layout title="Profile" showBackButton>
      <div className="flex flex-col gap-4 p-4 max-w-4xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-4 bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-lg text-center"
        >
          <Avatar
            name={name}
            className="w-24 h-24 text-2xl"
            showFallback
            isBordered
            color="primary"
          />
          <div>
            <h1 className="text-2xl font-semibold">{name}</h1>
            <p className="text-default-500">{user.email}</p>
            <div className="flex items-center justify-center gap-2 mt-2">
              {user.isVerified ? (
                <div className="flex items-center gap-1 text-success text-sm">
                  <IconShield size={16} />
                  <span>Verified Account</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-warning text-sm">
                  <IconShield size={16} />
                  <span>Unverified Account</span>
                </div>
              )}
              {user.isActive ? (
                <div className="flex items-center gap-1 text-success text-sm">
                  <IconUserCheck size={16} />
                  <span>Active</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-danger text-sm">
                  <IconUserX size={16} />
                  <span>Inactive</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Personal Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="border-none">
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Personal Information</h2>
              <Button
                size="sm"
                color="primary"
                variant="flat"
                startContent={<IconEdit size={16} />}
                onPress={() => setShowEditModal(true)}
              >
                Edit
              </Button>
            </CardHeader>
            <Divider />
            <CardBody className="gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <IconMail size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-small text-default-500">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <IconPhone size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-small text-default-500">Phone</p>
                  <p className="font-medium">
                    {user.phoneNumber || "Not provided"}
                  </p>
                </div>
              </div>

              {user.address && (
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <IconMapPin size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-small text-default-500">Address</p>
                    <p className="font-medium">
                      {user.address.street}
                      <br />
                      {user.address.city}, {user.address.state}{" "}
                      {user.address.zipCode}
                      <br />
                      {user.address.country}
                    </p>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </motion.div>

        {/* Edit Modal */}
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          scrollBehavior="inside"
          size="2xl"
        >
          <ModalContent>
            <Form method="post" className="space-y-6">
              {formFields.map((field) => (
                <FormFieldComponent
                  key={field.id}
                  field={field}
                  variant="bordered"
                  radius="sm"
                  size="md"
                  labelPlacement="outside"
                />
              ))}
              
              <div className="flex justify-end gap-4">
                <Button
                  variant="flat"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  color="primary"
                >
                  Save Changes
                </Button>
              </div>
            </Form>
          </ModalContent>
        </Modal>
      </div>
    </Layout>
  );
}
