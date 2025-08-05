import type { UserType } from "@prisma/client";
import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { ENV } from "~/env.server";

const sessionSecret = ENV.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

const storage = createCookieSessionStorage({
  cookie: {
    name: "edu_session",
    secure: ENV.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: ENV.NODE_ENV === "production" ? "strict" : "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    httpOnly: true,
  },
});
const storageMobile = createCookieSessionStorage({
  cookie: {
    name: "edu_session_mobile",
    secure: ENV.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: ENV.NODE_ENV === "production" ? "strict" : "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    httpOnly: true,
  },
});

export async function createUserSession(
  userId: string,
  systemId: string,
  redirectTo: string,
  userType: UserType
) {
  if (userType == "customer") {
    const session = await storageMobile.getSession();
    session.set("userIdMobile", userId);
    session.set("systemIdMobile", systemId);
    session.set("userTypeMobile", userType);

    return redirect(redirectTo, {
      headers: {
        "Set-Cookie": await storageMobile.commitSession(session),
      },
    });
  } else {
    const session = await storage.getSession();
    session.set("userId", userId);
    session.set("systemId", systemId);
    session.set("userType", userType);

    return redirect(redirectTo, {
      headers: {
        "Set-Cookie": await storage.commitSession(session),
      },
    });
  }
}

export async function getUserSession(request: Request) {
  try {
    const cookie = request.headers.get("Cookie");
    if (!cookie) {
      console.log("[Session Debug] No cookie found in request");
      return storage.getSession();
    }
    const session = await storage.getSession(cookie);
    return session;
  } catch (error) {
    console.error("[Session Debug] Error getting user session:", error);
    return storage.getSession();
  }
}

export async function getUserId(request: Request) {
  const session = await getUserSession(request);
  var userId = session.get("userId");
  if (userId == null) {
    const sessionMobile = await getUserSessionMobile(request);
    userId = sessionMobile.get("userIdMobile");
  }
  if (!userId || typeof userId !== "string") return null;
  return userId;
}

export async function getUserSessionMobile(request: Request) {
  try {
    const cookie = request.headers.get("Cookie");
    if (!cookie) {
      console.log("[Session Debug] No mobile cookie found in request");
      return storageMobile.getSession();
    }
    const session = await storageMobile.getSession(cookie);
    return session;
  } catch (error) {
    console.error("[Session Debug] Error getting mobile user session:", error);
    return storageMobile.getSession();
  }
}

export async function getUserIdMobile(request: Request) {
  const session = await getUserSessionMobile(request);
  const userId = session.get("userIdMobile");
  if (!userId || typeof userId !== "string") return null;
  return userId;
}

export async function getUserTypeMobile(request: Request) {
  const session = await getUserSessionMobile(request);
  const userType = session.get("userTypeMobile");
  if (!userType || typeof userType !== "string") return null;
  return userType as UserType;
}

export async function getUserType(request: Request) {
  const session = await getUserSession(request);
  const userType = session.get("userType");
  if (!userType || typeof userType !== "string") return null;
  return userType as UserType;
}

export async function getIsSuperAdmin(request: Request) {
  const session = await getUserSession(request);
  const isSuperAdmin = session.get("isSuperAdmin");
  if (!isSuperAdmin || typeof isSuperAdmin !== "boolean") return null;
  return isSuperAdmin;
}

export async function getsystemId(request: Request) {
  const session = await getUserSession(request);
  const systemId = session.get("systemId");
  if (systemId) {
    return systemId;
  }
  const sessionMobile = await getUserSessionMobile(request);
  const systemIdMobile = sessionMobile.get("systemIdMobile");
  if (systemIdMobile) {
    return systemIdMobile;
  }
  return null;
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}

export async function logout(request: Request) {
  const session = await getUserSession(request);
  return redirect("/", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}

export async function logoutMobile(request: Request) {
  const session = await getUserSessionMobile(request);
  const systemId = session.get("systemIdMobile");
  if (systemId) {
    return redirect(`/mobileApp/auth?systemId=${systemId}`, {
      headers: {
        "Set-Cookie": await storageMobile.destroySession(session),
      },
    });
  }
  return redirect("/mobileApp/auth", {
    headers: {
      "Set-Cookie": await storageMobile.destroySession(session),
    },
  });
}

// Role-specific session creators
export async function createcustomerSession(
  systemId: string,
  userId: string,
  redirectTo: string
) {
  return createUserSession(userId, systemId, redirectTo, "customer");
}

export async function createAdminSession(
  systemId: string,
  userId: string,
  redirectTo: string,
  isSuperAdmin: boolean
) {
  const session = await storage.getSession();
  session.set("userId", userId);
  session.set("systemId", systemId);
  session.set("userType", "ADMIN");
  session.set("isSuperAdmin", isSuperAdmin);

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

// Helper function to check if user has required role
export async function requireUserType(
  request: Request,
  allowedTypes: UserType[],
  redirectTo: string = "/unauthorized"
) {
  const userType = await getUserType(request);
  if (!userType || !allowedTypes.includes(userType)) {
    throw redirect(redirectTo);
  }
  return userType;
}
