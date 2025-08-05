import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import {
  json,
  redirect,
  type ActionFunction,
  type MetaFunction,
} from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { motion } from "framer-motion";
import { Bell, Home, UserPlus } from "lucide-react";
import { ObjectId } from "mongodb";
import { z } from "zod";
import type { FormField } from "~/components/ui/form-field";
import { FormFieldComponent } from "~/components/ui/form-field";
import { masterPrisma } from "~/lib/db.server";
import { getUserPrismaClient } from "~/lib/get-user-db.server";
import { sendVerificationEmail } from "~/utils/email.server";
import { generateAuthPageSEO } from "~/utils/seo";
import AuthLayout from "../AuthLayout";

export const meta: MetaFunction = () => {
  return generateAuthPageSEO("signup");
};

// Validation schema
const RegistrationSchema = z.object({
  // Account Details
  adminFirstName: z.string().min(1, "First name is required"),
  adminLastName: z.string().min(1, "Last name is required"),
  adminEmail: z.string().email("Invalid email address"),
  adminPhone: z.string().min(1, "Phone number is required"),
  adminPassword: z.string().min(8, "Password must be at least 8 characters"),

  // Address
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  zipCode: z.string().min(1, "Zip code is required"),
});

export const action: ActionFunction = async ({ request }) => {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const formData = await request.formData();
    const rawData = Object.fromEntries(formData);

    // Validate form data
    const validatedData = RegistrationSchema.parse(rawData);

    // Check if admin email exists
    const existingAdmin = await masterPrisma.systemAdmin.findUnique({
      where: { email: validatedData.adminEmail },
    });

    if (existingAdmin) {
      return json({ error: "Admin email already registered" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.adminPassword, 10);

    // Generate DioscId
    const dioscId = new ObjectId().toString();
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Create admin account
    const admin = await masterPrisma.systemAdmin.create({
      data: {
        email: validatedData.adminEmail,
        password: hashedPassword,
        firstName: validatedData.adminFirstName,
        lastName: validatedData.adminLastName,
        phoneNumber: validatedData.adminPhone,
        verificationToken: verificationToken,
        verificationTokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
        SystemId: dioscId,
        planId: 1,
        planName: "Free",
        monthlyPrice: 0,
        address: {
          street: validatedData.street,
          city: validatedData.city,
          state: validatedData.state,
          country: validatedData.country,
          zipCode: validatedData.zipCode,
        },
      },
    });

    const { prisma } = await getUserPrismaClient(dioscId, true);

    // Create DIOSC account with auto-managed fields
    await prisma.system.create({
      data: {
        id: dioscId,
        name: `${validatedData.adminFirstName} ${validatedData.adminLastName}'s Vehicle Account`,
        email: validatedData.adminEmail,
        phone: validatedData.adminPhone,

        SystemAdminId: admin.id,
        planId: 1,
        address: {
          street: validatedData.street,
          city: validatedData.city,
          state: validatedData.state,
          country: validatedData.country,
          zipCode: validatedData.zipCode,
        },
      },
    });
    await sendVerificationEmail(validatedData.adminEmail, verificationToken);

    return redirect("/auth/login");
    // return json(
    //   { success: true, message: "Registration successful" },
    //   { status: 201 }
    // );
  } catch (error) {
    console.error("Registration error:", error);

    if (error instanceof z.ZodError) {
      return json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    return json(
      { error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
};

export default function InstitutionRegistration() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  const formFields: Record<string, FormField> = {
    // Account Details
    adminFirstName: {
      id: "adminFirstName",
      name: "adminFirstName",
      label: "First Name",
      type: "text",
      required: true,
    },
    adminLastName: {
      id: "adminLastName",
      name: "adminLastName",
      label: "Last Name",
      type: "text",
      required: true,
    },
    adminEmail: {
      id: "adminEmail",
      name: "adminEmail",
      label: "Email",
      type: "email",
      required: true,
    },
    adminPhone: {
      id: "adminPhone",
      name: "adminPhone",
      label: "Phone Number",
      type: "text",
      required: true,
    },
    adminPassword: {
      id: "adminPassword",
      name: "adminPassword",
      label: "Password",
      type: "password",
      required: true,
    },
    // Address Fields
    street: {
      id: "street",
      name: "street",
      label: "Street Address",
      type: "text",
      required: true,
    },
    city: {
      id: "city",
      name: "city",
      label: "City",
      type: "text",
      required: true,
    },
    state: {
      id: "state",
      name: "state",
      label: "State/Province",
      type: "text",
      required: true,
    },
    country: {
      id: "country",
      name: "country",
      label: "Country",
      type: "text",
      required: true,
    },
    zipCode: {
      id: "zipCode",
      name: "zipCode",
      label: "Postal/Zip Code",
      type: "text",
      required: true,
    },
  };

  return (
    <AuthLayout isLogin={false}>
      <Card className="max-w-2xl mx-auto shadow-lg border border-default">
        <CardHeader className="flex flex-col gap-2 p-6">
          <div className="rounded-full bg-primary-100 dark:bg-primary-900/30 p-3 mx-auto mb-2">
            <UserPlus className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-center">
            Create relyNrelax Account
          </h1>
          <p className="text-default-500 text-center">
            Start managing your vehicle documents with timely reminders
          </p>

          {actionData?.error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 p-3 rounded-lg bg-danger-50 border border-danger text-danger text-sm"
            >
              {actionData.error}
            </motion.div>
          )}
        </CardHeader>
        <CardBody className="px-6 pb-6">
          <Form method="post">
            <motion.div
              className="space-y-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Account Details */}
              <motion.div className="space-y-4" variants={itemVariants}>
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">Account Details</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormFieldComponent
                    field={formFields.adminFirstName}
                    error={actionData?.error}
                  />
                  <FormFieldComponent
                    field={formFields.adminLastName}
                    error={actionData?.error}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormFieldComponent
                    field={formFields.adminEmail}
                    error={actionData?.error}
                  />
                  <FormFieldComponent
                    field={formFields.adminPhone}
                    error={actionData?.error}
                  />
                </div>
                <FormFieldComponent
                  field={formFields.adminPassword}
                  error={actionData?.error}
                />
              </motion.div>

              {/* Address */}
              <motion.div className="space-y-4" variants={itemVariants}>
                <div className="flex items-center gap-2">
                  <Home className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">Address</h2>
                </div>
                <FormFieldComponent
                  field={formFields.street}
                  error={actionData?.error}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormFieldComponent
                    field={formFields.city}
                    error={actionData?.error}
                  />
                  <FormFieldComponent
                    field={formFields.state}
                    error={actionData?.error}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormFieldComponent
                    field={formFields.country}
                    error={actionData?.error}
                  />
                  <FormFieldComponent
                    field={formFields.zipCode}
                    error={actionData?.error}
                  />
                </div>
              </motion.div>

              <motion.div className="pt-4" variants={itemVariants}>
                <Button
                  type="submit"
                  color="primary"
                  fullWidth
                  isLoading={isSubmitting}
                  className="font-medium"
                  startContent={
                    !isSubmitting && <UserPlus className="h-4 w-4" />
                  }
                  as={motion.button}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? "Creating Account..." : "Create Account"}
                </Button>

                <p className="text-center text-sm text-default-500 mt-4">
                  By creating an account, you agree to our{" "}
                  <a href="#" className="text-primary font-medium">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-primary font-medium">
                    Privacy Policy
                  </a>
                </p>
              </motion.div>
            </motion.div>
          </Form>
        </CardBody>
      </Card>
    </AuthLayout>
  );
}
