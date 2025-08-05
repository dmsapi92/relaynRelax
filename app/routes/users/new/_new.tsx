import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { json, redirect, type ActionFunctionArgs } from "@remix-run/node";
import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import bcrypt from "bcryptjs";
import { FormFieldComponent } from "~/components/ui/form-field";
import { getUserPrismaClient } from "~/lib/get-user-db.server";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const { prisma } = await getUserPrismaClient(request);

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const phoneNumber = formData.get("phoneNumber") as string;
  const role = formData.get("role") as "ADMIN" | "CUSTOMER" | "STAFF";

  // Address fields
  const street = formData.get("street") as string;
  const city = formData.get("city") as string;
  const state = formData.get("state") as string;
  const country = formData.get("country") as string;
  const zipCode = formData.get("zipCode") as string;

  // Basic validation
  const errors: Record<string, string> = {};
  if (!email) errors.email = "Email is required";
  if (!firstName) errors.firstName = "First name is required";
  if (!lastName) errors.lastName = "Last name is required";

  if (Object.keys(errors).length > 0) {
    return json({ errors });
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return json({ errors: { email: "User with this email already exists" } });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("default", 10);

    // Create user with address
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phoneNumber,
        role: "CUSTOMER",
        address: {
          street,
          city,
          state,
          country,
          zipCode,
        },
      },
    });

    return redirect("/users");
  } catch (error) {
    console.error("Error creating user:", error);
    return json({
      errors: { _form: "Error creating user. Please try again." },
    });
  }
}

export default function NewUser() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">Add New User</h1>
        </CardHeader>
        <CardBody>
          <Form method="post" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormFieldComponent
                field={{
                  id: "firstName",
                  name: "firstName",
                  label: "First Name",
                  type: "text",
                  required: true,
                }}
              />
              <FormFieldComponent
                field={{
                  id: "lastName",
                  name: "lastName",
                  label: "Last Name",
                  type: "text",
                  required: true,
                }}
              />
            </div>

            <FormFieldComponent
              field={{
                id: "email",
                name: "email",
                label: "Email",
                type: "email",
                required: true,
              }}
            />

            <FormFieldComponent
              field={{
                id: "phoneNumber",
                name: "phoneNumber",
                label: "Phone Number",
                type: "tel",
              }}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormFieldComponent
                field={{
                  id: "street",
                  name: "street",
                  label: "Street Address",
                  type: "text",
                }}
              />
              <FormFieldComponent
                field={{
                  id: "city",
                  name: "city",
                  label: "City",
                  type: "text",
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormFieldComponent
                field={{
                  id: "state",
                  name: "state",
                  label: "State",
                  type: "text",
                }}
              />
              <FormFieldComponent
                field={{
                  id: "country",
                  name: "country",
                  label: "Country",
                  type: "text",
                }}
              />
            </div>

            <FormFieldComponent
              field={{
                id: "zipCode",
                name: "zipCode",
                label: "ZIP Code",
                type: "text",
              }}
            />

            <div className="flex gap-4 justify-end">
              <Button
                as={Link}
                to="/users"
                variant="light"
                color="danger"
                type="button"
              >
                Cancel
              </Button>

              {actionData?.errors && (
                <div className="text-danger">
                  {Object.values(actionData.errors).map((error, index) => (
                    <div key={index}>{error}</div>
                  ))}
                </div>
              )}

              <Button color="primary" type="submit" isLoading={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create User"}
              </Button>
            </div>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
}
