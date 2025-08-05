import { ActionFunction, json } from "@remix-run/node";
import { getUserPrismaClient } from "~/lib/get-user-db.server";
import { getUserIdMobile } from "~/utils/session.server";

export const action: ActionFunction = async ({ request }) => {
  const userId = await getUserIdMobile(request);

  if (!userId) {
    return json(
      {
        success: false,
        message: "User not found",
      },
      { status: 404 }
    );
  }

  const { prisma } = await getUserPrismaClient(request);
  const fcmToken = await request.json();

  await prisma.user.update({
    where: { id: userId },
    data: { FcmToken: fcmToken.token },
  });

  return json({
    success: true,
    message: "FCM token updated successfully",
  });
};
