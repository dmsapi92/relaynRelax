import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";
import { useEffect } from "react";
import { logoutMobile } from "~/utils/session.server";

export const action: ActionFunction = async ({ request }) => {
  const logoutResponse = await logoutMobile(request);
  return logoutResponse;
};

export const loader: LoaderFunction = async ({ request }) => {
  const logoutResponse = await logoutMobile(request);
  return logoutResponse;
};

export default function LogoutPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Submit logout form
    const formData = new FormData();
    fetch("/mobileApp/logout", {
      method: "POST",
      body: formData,
    }).then(() => {
      // Redirect to login page after successful logout
      navigate("/mobileApp");
    });
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Logging out...</h1>
        <p className="text-foreground-500">Please wait while we log you out.</p>
      </div>
    </div>
  );
}
