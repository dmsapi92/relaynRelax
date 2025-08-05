import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getUserId } from "~/utils/session.server";
import { actionLoginApi } from "./loginapi";

type ActionData = {
  error?: string;
  status?: string;
  showPhoneModal?: boolean;
  customerId?: string;
};
export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await getUserId(request);
  if (userId) {
    return redirect("/dashboard");
  }
  return json({});
}
export const action = actionLoginApi;
