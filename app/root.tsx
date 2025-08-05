import { NextUIProvider } from "@nextui-org/react";
import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
} from "@remix-run/react";
import { ThemeProvider } from "next-themes";
import DashboardLayout from "./components/layout/DashboardLayout";
import { getUserPrismaClient } from "./lib/get-user-db.server";
import "./tailwind.css";
import { getUserId, getUserType } from "./utils/session.server";

import { Toaster } from "react-hot-toast";
export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUserId(request);
  if (user) {
    const url = new URL(request.url);
    if (
      !url.pathname.startsWith("/mobileApp") &&
      url.pathname !== "/auth/api/login"
    ) {
      const userType = await getUserType(request);
      if (userType !== "ADMIN") {
        return redirect("/mobileApp/customer");
      }
    }
    const { prisma, systemAdminRecord } = await getUserPrismaClient(request);
    return { user, systemAdminRecord };
  }
  return { user };
};

export const meta: MetaFunction = () => {
  return [
    { charset: "utf-8" },
    { title: "relyNrelax - Vehicle Document Reminder System" },
    { name: "viewport", content: "width=device-width,initial-scale=1" },
    {
      name: "description",
      content:
        "Stay compliant with relyNrelax - India's leading vehicle document reminder service for PUCC, Fitness, RC, and permit expirations.",
    },
    { name: "theme-color", content: "#6366F1" },
    { name: "og:type", content: "website" },
    { name: "og:site_name", content: "relyNrelax" },
    {
      name: "og:title",
      content: "relyNrelax - Vehicle Document Reminder System",
    },
    {
      name: "og:description",
      content:
        "Stay compliant with relyNrelax - India's leading vehicle document reminder service for PUCC, Fitness, RC, and permit expirations.",
    },
    { name: "og:image", content: "/images/og-image.png" },
    { name: "twitter:card", content: "summary_large_image" },
    {
      name: "twitter:title",
      content: "relyNrelax - Vehicle Document Reminder System",
    },
    {
      name: "twitter:description",
      content:
        "Stay compliant with relyNrelax - India's leading vehicle document reminder service for PUCC, Fitness, RC, and permit expirations.",
    },
    { name: "twitter:image", content: "/images/og-image.png" },
    { name: "robots", content: "index, follow" },
    {
      name: "keywords",
      content:
        "vehicle documents, PUCC reminder, fitness certificate, RC renewal, vehicle permits, document management, expiry reminders",
    },
  ];
};

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
  { rel: "canonical", href: "https://relynrelax.com" },
  { rel: "manifest", href: "/site.webmanifest" },
  { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <NextUIProvider>
          <Toaster position="top-right" />
          <ThemeProvider attribute="class" defaultTheme="dark">
            {children}
            <ScrollRestoration />
            <Scripts />
          </ThemeProvider>
        </NextUIProvider>
      </body>
    </html>
  );
}

export default function App() {
  const { user, systemAdminRecord } = useLoaderData<typeof loader>();

  const location = useLocation();

  return location.pathname.includes("mobileApp") || user == null ? (
    <Outlet />
  ) : user ? (
    <DashboardLayout
      currentPath={location.pathname}
      systemAdminRecord={systemAdminRecord}
    >
      <Outlet />
    </DashboardLayout>
  ) : (
    <Outlet />
  );
}
