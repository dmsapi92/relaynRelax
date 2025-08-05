import type { LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { masterPrisma } from "~/lib/db.server";

export const loader: LoaderFunction = async ({ params, request }) => {
  const { token } = params;

  if (!token) {
    return json({ error: "Invalid verification link" }, { status: 400 });
  }

  try {
    const user = await masterPrisma.systemAdmin.findFirst({
      where: {
        verificationToken: token,
        verificationTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return json(
        { error: "Invalid or expired verification link" },
        { status: 400 }
      );
    }
    await masterPrisma.systemAdmin.update({
      where: { id: user.id },
      data: {
        verified: true,
      },
    });

    return redirect("/auth/login?verified=true");
  } catch (error) {
    console.error("Verification error:", error);
    return json({ error: "Error verifying email" }, { status: 500 });
  }
};
