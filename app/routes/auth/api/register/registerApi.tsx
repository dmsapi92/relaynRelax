import type { ActionFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { ObjectId } from "mongodb";
import { z } from "zod";
import { masterPrisma } from "~/lib/db.server";
import { getUserPrismaClient } from "~/lib/get-user-db.server";
import { getUserId } from "~/utils/session.server";

// Validation schemas using Zod
const AddressSchema = z.object({
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  zipCode: z.string().min(1, "Zip code is required"),
  location: z
    .object({
      type: z.literal("Point"),
      coordinates: z.array(z.number()).length(2),
    })
    .optional(),
});

const RegisterSchema = z.object({
  // Admin details
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
    ),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phoneNumber: z.string().optional(),
  address: AddressSchema.optional(),

  // Business account details
  businessName: z.string().min(1, "Business name is required"),
  businessShortName: z.string().optional(),
  businessEmail: z.string().email("Invalid business email address"),
  businessPhone: z.string().min(1, "Business phone is required"),
  businessAddress: AddressSchema,
  establishmentYear: z.number().optional(),
  website: z.string().url().optional(),
  registrationNumber: z.string().optional(),
  slogan: z.string().optional(),
  description: z.string().optional(),
  vision: z.string().optional(),
  mission: z.string().optional(),
});

export async function loaderRegisterApi({ request }: LoaderFunctionArgs) {
  const userId = await getUserId(request);
  if (userId) {
    return redirect("/dashboard");
  }

  const url = new URL(request.url);
  const step = url.searchParams.get("step") || "1";
  const error = url.searchParams.get("error");

  return json({ step, error });
}

export const actionRegisterApi: ActionFunction = async ({ request }) => {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    // Get prisma client
    const { prisma } = await getUserPrismaClient(request);

    // Parse request body
    const formData = await request.formData();
    const rawData = Object.fromEntries(formData);

    // Parse and validate the data
    const validatedData = RegisterSchema.parse({
      ...rawData,
      establishmentYear: rawData.establishmentYear
        ? parseInt(rawData.establishmentYear as string)
        : undefined,
      address: rawData.address
        ? JSON.parse(rawData.address as string)
        : undefined,
      businessAddress: JSON.parse(rawData.businessAddress as string),
    });

    // Check if admin email already exists
    const existingAdmin = await masterPrisma.dioscAdmin.findUnique({
      where: { email: validatedData.email },
    });

    if (existingAdmin) {
      return json({ error: "Email already registered" }, { status: 400 });
    }

    // Check if business email already exists
    const existingBusiness = await prisma.dioscAcount.findUnique({
      where: { email: validatedData.businessEmail },
    });

    if (existingBusiness) {
      return json(
        { error: "Business email already registered" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Generate IDs
    const dioscId = new ObjectId().toString();

    // Start transaction to create both admin and business account
    // Create admin account
    const admin = await masterPrisma.dioscAdmin.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        phoneNumber: validatedData.phoneNumber,
        address: validatedData.address,
        DioscId: dioscId,
        planId: 1, // Default plan
        planName: "Basic", // Default plan name
        monthlyPrice: 0, // Default price
        verificationToken: crypto.randomUUID(),
        verificationTokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    // Create business account
    const business = await prisma.dioscAcount.create({
      data: {
        id: dioscId,
        name: validatedData.businessName,
        shortName: validatedData.businessShortName,
        email: validatedData.businessEmail,
        phone: validatedData.businessPhone,
        address: validatedData.businessAddress,
        establishmentYear: validatedData.establishmentYear,
        website: validatedData.website,
        registrationNumber: validatedData.registrationNumber,
        slogan: validatedData.slogan,
        description: validatedData.description,
        vision: validatedData.vision,
        mission: validatedData.mission,
        planId: 1, // Default plan
        dioscAdminId: admin.id,
      },
    });

    // TODO: Send verification email
    // await sendVerificationEmail(result.admin.email, result.admin.verificationToken);

    return json(
      {
        success: true,
        message:
          "Registration successful. Please check your email to verify your account.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);

    if (error instanceof z.ZodError) {
      return json(
        {
          error: "Validation failed",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return json(
      { error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
};
