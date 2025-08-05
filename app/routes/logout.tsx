import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { logout } from "~/utils/session.server";

export const action: ActionFunction = async ({ request }) => {
  // Check if the request is expecting JSON
  const isJson = request.headers.get("Accept")?.includes("application/json");

  const logoutResponse = await logout(request);

  if (isJson) {
    return json({ success: true });
  }

  return logoutResponse;
};

export const loader: LoaderFunction = async ({ request }) => {
  // Check if the request is expecting JSON
  const isJson = request.headers.get("Accept")?.includes("application/json");

  const logoutResponse = await logout(request);

  if (isJson) {
    return json({ success: true });
  }

  return logoutResponse;
};
