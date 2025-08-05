import { json, redirect, type ActionFunctionArgs } from "@remix-run/node";
import { getUserPrismaClient } from "~/lib/get-user-db.server";
import { getUserIdMobile } from "~/utils/session.server";

export async function action({ request }: ActionFunctionArgs) {
  const { prisma } = await getUserPrismaClient(request);
  const userId = await getUserIdMobile(request);

  if (!userId) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const phoneNumber = formData.get("phoneNumber") as string;

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { phoneNumber }
    });

    return redirect("/mobileApp/customer");
  } catch (error) {
    console.error("Error updating phone number:", error);
    return json({ error: "Failed to update phone number" }, { status: 500 });
  }
} 