import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { ObjectId } from "mongodb";
import { z } from "zod";
import { masterPrisma } from "~/lib/db.server";
import { getUserPrismaClient } from "~/lib/get-user-db.server";
import { createUserSession } from "~/utils/session.server";

// Validation schema for login
const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  remember: z.boolean().optional().default(false),
});

export const actionLoginApi: ActionFunction = async ({ request }) => {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    // Parse request body
    const formData = await request.formData();
    const rawData = Object.fromEntries(formData);

    // Parse and validate the data
    const validatedData = LoginSchema.parse({
      ...rawData,
      remember: rawData.remember === "true",
    });

    // Find the admin user
    const admin = await masterPrisma.systemAdmin.findUnique({
      where: { email: validatedData.email },
      select: {
        id: true,
        email: true,
        password: true,
        verified: true,
        SystemId: true,
        firstName: true,
        lastName: true,
        planId: true,
        planName: true,
      },
    });

    // Check if customer exists if admin not found
    if (!admin) {
      const systemAdmin = await masterPrisma.systemAdmin.findFirst();
      const { prisma } = await getUserPrismaClient(
        systemAdmin?.SystemId!,
        true
      );
      const customer = await prisma.user.findUnique({
        where: { email: validatedData.email },
        select: {
          id: true,
          email: true,
          password: true,
          isVerified: true,
          firstName: true,
          lastName: true,
        },
      });

      if (!customer) {
        const { email, name, photoURL } = rawData;
        const firstName = (name as string).split(" ")[0];
        const lastName =
          (name as string).split(" ").slice(1).join(" ") || firstName;
        const newUserId = new ObjectId();

        await prisma.user.create({
          data: {
            id: newUserId.toString(),
            email: email as string,
            firstName,
            lastName,
            password: "",
            isVerified: true,
          },
        });

        return await createUserSession(
          newUserId.toString(),
          systemAdmin!.SystemId!,
          "/mobileApp/customer",
          "customer"
        );
      }

      // Create customer session
      return createUserSession(
        customer.id,
        systemAdmin!.SystemId!,
        "/mobileApp/customer",
        "customer"
      );
    } else if (admin) {
      // Check if user is verified
      if (!admin.verified) {
        return json(
          {
            error: "Please verify your email before logging in",
            needsVerification: true,
          },
          { status: 401 }
        );
      }

      const { prisma } = await getUserPrismaClient(admin.SystemId, true);
      // Get business account details
      const business = await prisma.system.findFirst({
        select: {
          id: true,
          name: true,
          shortName: true,
          email: true,
          isVerified: true,
        },
      });

      if (!business) {
        return json({ error: "Business account not found" }, { status: 404 });
      }

      // Create user session with required parameters
      return createUserSession(admin.id, admin.SystemId, "/dashboard", "ADMIN");
    }
  } catch (error) {
    console.error("Login error:", error);

    if (error instanceof z.ZodError) {
      return json(
        {
          error: "Validation failed",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return json({ error: "Login failed. Please try again." }, { status: 500 });
  }
};
