import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { useDisclosure } from "@nextui-org/modal";
import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import {
  Link,
  useFetcher,
  useLoaderData,
  useSearchParams,
} from "@remix-run/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { ENV } from "~/env.server";
import { getUserPrismaClient } from "~/lib/get-user-db.server";

// Razorpay plan interface based on API docs
interface RazorpayPlan {
  id: string;
  entity: string;
  interval: number;
  period: "daily" | "weekly" | "monthly" | "yearly";
  item: {
    id: string;
    active: boolean;
    name: string;
    description: string | null;
    amount: number;
    unit_amount: number;
    currency: string;
    type: string;
    unit: null;
    tax_inclusive: boolean;
    hsn_code: null;
    sac_code: null;
    tax_rate: null;
    tax_id: null;
    tax_group_id: null;
    created_at: number;
    updated_at: number;
  };
  notes: Record<string, string>;
  created_at: number;
}

interface RazorpayPlansResponse {
  entity: string;
  count: number;
  items: RazorpayPlan[];
}

interface RazorpaySubscription {
  id: string;
  entity: string;
  plan_id: string;
  status: string;
  current_start: number;
  current_end: number;
  ended_at: number;
  quantity: number;
  notes: Record<string, string>;
  created_at: number;
  charge_at: number;
  start_at: number;
  end_at: number;
  remaining_count: number;
  short_url?: string;
}

interface SubscriptionActionData {
  subscriptionData: {
    id: string;
    // Add other subscription data fields if needed
  };
}

export async function loader({ request }: LoaderFunctionArgs) {
  const { prisma } = await getUserPrismaClient(request);
  const url = new URL(request.url);
  const count = url.searchParams.get("count") || "10";
  const skip = url.searchParams.get("skip") || "0";
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");

  // Get current institution
  const institution = await prisma.institution.findFirst({
    select: {
      email: true,
      phone: true,
      name: true,
      razorpaySubscriptionIds: true,
    },
  });

  if (!institution) {
    throw new Error("Institution not found");
  }

  let activeSubscription: RazorpaySubscription | null = null;
  let subscriptionDetails = null;

  // If institution has subscription IDs, check their status
  if (institution.razorpaySubscriptionIds.length > 0) {
    // Fetch all subscriptions for the institution
    const subscriptionsPromises = institution.razorpaySubscriptionIds.map(
      (subId) =>
        fetch(`https://api.razorpay.com/v1/subscriptions/${subId}`, {
          headers: {
            Authorization: `Basic ${Buffer.from(
              `${ENV.RAZORPAY_KEY_ID}:${ENV.RAZORPAY_KEY_SECRET}`
            ).toString("base64")}`,
          },
        }).then((res) => res.json())
    );

    const subscriptions = await Promise.all(subscriptionsPromises);
    console.log(subscriptions);

    // Find first active subscription
    const activeSubscriptionData = subscriptions.find(
      (sub) =>
        sub.status === "active" ||
        sub.status === "authenticated" ||
        sub.status === "created"
    );

    if (activeSubscriptionData) {
      activeSubscription = activeSubscriptionData;
      subscriptionDetails = activeSubscriptionData;
    }
  }

  // Build plans URL with query parameters
  const plansUrl = new URL("https://api.razorpay.com/v1/plans");
  plansUrl.searchParams.append("count", count);
  plansUrl.searchParams.append("skip", skip);
  if (from) plansUrl.searchParams.append("from", from);
  if (to) plansUrl.searchParams.append("to", to);

  // Fetch plans from Razorpay
  const plansResponse = await fetch(plansUrl.toString(), {
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${ENV.RAZORPAY_KEY_ID}:${ENV.RAZORPAY_KEY_SECRET}`
      ).toString("base64")}`,
    },
  });

  if (!plansResponse.ok) {
    throw new Error("Failed to fetch Razorpay plans");
  }

  const razorpayPlansResponse =
    (await plansResponse.json()) as RazorpayPlansResponse;

  // Convert Razorpay plans to our format
  const plans = razorpayPlansResponse.items.reduce(
    (acc, plan) => {
      if (!plan.item.active) return acc;

      acc[plan.id] = {
        id: plan.id,
        name: plan.item.name,
        description: plan.item.description || "",
        price: plan.item.amount / 100, // Convert from paise to rupees
        currency: plan.item.currency,
        interval: `${plan.interval} ${plan.period}`,
        features: plan.notes.features ? JSON.parse(plan.notes.features) : [],
      };
      return acc;
    },
    {} as Record<
      string,
      {
        id: string;
        name: string;
        description: string;
        price: number;
        currency: string;
        interval: string;
        features: string[];
      }
    >
  );

  return json({
    subscription: activeSubscription,
    subscriptionDetails,
    plans,
    razorpayKey: ENV.RAZORPAY_KEY_ID,
    pagination: {
      count: parseInt(count),
      skip: parseInt(skip),
      total: razorpayPlansResponse.count,
    },
    currentInstitution: institution,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const { prisma } = await getUserPrismaClient(request);
  const formData = await request.formData();
  const planId = formData.get("planId") as string;
  const intent = formData.get("intent") as string;

  if (intent === "cancel_subscription") {
    const subscriptionId = formData.get("subscriptionId") as string;

    // Cancel subscription with Razorpay
    const response = await fetch(
      `https://api.razorpay.com/v1/subscriptions/${subscriptionId}/cancel`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${ENV.RAZORPAY_KEY_ID}:${ENV.RAZORPAY_KEY_SECRET}`
          ).toString("base64")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cancel_at_cycle_end: true,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Failed to cancel subscription: ${error.error.description}`
      );
    }

    return json({
      success: true,
      message: "Subscription will be cancelled at the end of current cycle",
    });
  }

  // Get the current institution
  const institution = await prisma.institution.findFirst({
    select: {
      email: true,
      phone: true,
      name: true,
      razorpaySubscriptionIds: true,
    },
  });

  if (!institution) {
    throw new Error("Institution not found");
  }

  // Check if there are any active subscriptions
  if (institution.razorpaySubscriptionIds.length > 0) {
    const subscriptionsPromises = institution.razorpaySubscriptionIds.map(
      (subId) =>
        fetch(`https://api.razorpay.com/v1/subscriptions/${subId}`, {
          headers: {
            Authorization: `Basic ${Buffer.from(
              `${ENV.RAZORPAY_KEY_ID}:${ENV.RAZORPAY_KEY_SECRET}`
            ).toString("base64")}`,
          },
        }).then((res) => res.json())
    );

    const subscriptions = await Promise.all(subscriptionsPromises);
    const hasActiveSubscription = subscriptions.some(
      (sub) =>
        sub.status === "active" ||
        sub.status === "authenticated" ||
        sub.status === "created"
    );

    if (hasActiveSubscription) {
      throw new Error(
        "You already have a pending or active subscription. Please complete or cancel it before creating a new one."
      );
    }
  }

  // Create a new subscription with Razorpay
  const response = await fetch("https://api.razorpay.com/v1/subscriptions", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${ENV.RAZORPAY_KEY_ID}:${ENV.RAZORPAY_KEY_SECRET}`
      ).toString("base64")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      plan_id: planId,
      total_count: 12, // 12 months subscription
      quantity: 1,
      customer_notify: 1,
      notify_info: {
        notify_phone: institution.phone,
        notify_email: institution.email,
      },
      notes: {
        institution_email: institution.email,
        institution_name: institution.name,
      },
      source: "web",
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      `Failed to create subscription: ${error.error.description}`
    );
  }

  const subscriptionData = await response.json();

  // Update institution with new subscription ID
  await prisma.institution.update({
    where: { email: institution.email },
    data: {
      razorpaySubscriptionIds: {
        push: subscriptionData.id,
      },
    },
  });

  return json({ subscriptionData });
}

export default function PlansPage() {
  const {
    subscription,
    subscriptionDetails,
    plans,
    razorpayKey,
    pagination,
    currentInstitution,
  } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const fetcher = useFetcher<SubscriptionActionData>();
  const [paymentUrl, setPaymentUrl] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Function to check if a plan is current
  const isCurrentPlan = (planId: string) => {
    return (
      subscription?.plan_id === planId &&
      (subscription.status === "active" ||
        subscription.status === "authenticated" ||
        subscription.status === "created")
    );
  };

  // Handle Razorpay subscription
  const handleSubscription = async (planId: string) => {
    const plan = plans[planId];

    // Create subscription through our action
    const formData = new FormData();
    formData.append("planId", planId);

    const result = await fetcher.submit(formData, { method: "POST" });

    if (fetcher.data?.subscriptionData) {
      const options = {
        key: razorpayKey,
        subscription_id: fetcher.data.subscriptionData.id,
        name: "Institute Management System",
        description: `Subscription for ${plan.name}`,
        handler: function (response: any) {
          console.log("Subscription initiated:", response);
          // Reload the page to show updated subscription status
          window.location.reload();
        },
        prefill: {
          name: currentInstitution.name,
          email: currentInstitution.email,
          contact: currentInstitution.phone,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    }
  };

  // Handle direct Razorpay payment
  const handleDirectPayment = () => {
    if (!subscription || !subscription.short_url) return;

    const options = {
      key: razorpayKey,
      subscription_id: subscription.id,
      name: "Institute Management System",
      description: `Subscription for ${plans[subscription.plan_id]?.name}`,
      theme: {
        color: "#0070F3", // NextUI primary color
      },
      prefill: {
        name: currentInstitution.name,
        email: currentInstitution.email,
        contact: currentInstitution.phone,
      },
      handler: function (response: any) {
        console.log("Payment successful", response);
        window.location.reload();
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  // Handle subscription action
  const handleSubscriptionAction = (planId: string) => {
    if (isCurrentPlan(planId) && subscription?.status === "created") {
      handleDirectPayment();
      return;
    }
    handleSubscription(planId);
  };

  // Handle pagination
  const handlePageChange = (skip: number) => {
    setSearchParams((prev) => {
      prev.set("skip", skip.toString());
      return prev;
    });
  };

  // Add Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Add cancel subscription handler
  const handleCancelSubscription = () => {
    if (!subscription?.id) return;

    if (
      window.confirm(
        "Are you sure you want to cancel your subscription? It will remain active until the end of the current billing cycle."
      )
    ) {
      const formData = new FormData();
      formData.append("intent", "cancel_subscription");
      formData.append("subscriptionId", subscription.id);
      fetcher.submit(formData, { method: "POST" });
    }
  };

  if (!plans || Object.keys(plans).length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">No Plans Available</h1>
        <p>Please contact support to set up subscription plans.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Link to="/billing">
            <Button
              variant="light"
              startContent={<FaArrowLeft />}
              className="mb-2"
            >
              Back to Billing
            </Button>
          </Link>
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold">Subscription Plans</h1>
            <p className="text-default-500">
              Choose the perfect plan for your institute
            </p>
          </div>
        </div>

        {subscription && (
          <Card className="mb-8 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border-none shadow-lg">
            <CardHeader>
              <div className="w-full">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-primary">
                    Your Subscription
                  </h2>
                  <div className="flex items-center gap-2">
                    <span
                      className={`capitalize px-3 py-1 rounded-full text-sm font-medium ${
                        subscription.status === "active" ||
                        subscription.status === "authenticated"
                          ? "bg-success-100 text-success-600 dark:bg-success-900/30"
                          : subscription.status === "created"
                          ? "bg-warning-100 text-warning-600 dark:bg-warning-900/30"
                          : "bg-danger-100 text-danger-600 dark:bg-danger-900/30"
                      }`}
                    >
                      {subscription.status}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-default-600">
                        Plan Details
                      </h3>
                      <p className="text-xl font-semibold mt-1">
                        {plans[subscription.plan_id]?.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-2xl font-bold text-primary">
                          ₹{plans[subscription.plan_id]?.price}
                        </span>
                        <span className="text-sm text-default-500">
                          /monthly
                        </span>
                      </div>
                    </div>
                    {subscription.status === "created" &&
                      subscription.short_url && (
                        <Button
                          size="sm"
                          color="warning"
                          variant="flat"
                          onClick={handleDirectPayment}
                          className="w-full"
                        >
                          Complete Payment Now
                        </Button>
                      )}
                  </div>

                  {subscription.status !== "created" && (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-default-600">
                          Subscription Period
                        </h3>
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-default-500">
                              Started
                            </span>
                            <span className="font-medium">
                              {new Date(
                                subscription.start_at * 1000
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-default-500">
                              Valid until
                            </span>
                            <span className="font-medium">
                              {new Date(
                                subscription.current_end * 1000
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        {subscription.status === "active" && (
                          <Button
                            size="sm"
                            color="danger"
                            variant="flat"
                            onClick={handleCancelSubscription}
                            className="w-full mt-4"
                          >
                            Cancel at End of Cycle
                          </Button>
                        )}
                      </div>
                    </div>
                  )}

                  {subscriptionDetails && subscription.status !== "created" && (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-default-600">
                          Billing Information
                        </h3>
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-default-500">
                              Next Payment
                            </span>
                            <span className="font-medium">
                              {new Date(
                                subscriptionDetails.charge_at * 1000
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-default-500">
                              Amount Due
                            </span>
                            <span className="font-medium">
                              ₹{(subscriptionDetails.total / 100).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-default-500">
                              Remaining Payments
                            </span>
                            <span className="font-medium">
                              {subscriptionDetails.remaining_count}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(plans).map(([planId, plan]) => (
            <motion.div
              key={planId}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className={
                isCurrentPlan(planId) ? "ring-2 ring-primary ring-offset-2" : ""
              }
            >
              <Card className="h-full">
                <CardHeader className="flex flex-col gap-2">
                  {isCurrentPlan(planId) && (
                    <div className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm self-start">
                      Current Plan
                    </div>
                  )}
                  <h2 className="text-xl font-semibold">{plan.name}</h2>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold">
                      {plan.currency === "INR" ? "₹" : "$"}
                      {plan.price}/monthly
                    </p>
                    <p className="text-sm text-default-500">
                      1 Year Subscription
                    </p>
                  </div>
                </CardHeader>

                <CardBody>
                  <p className="text-sm text-gray-600 mb-4">
                    {plan.description}
                  </p>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="text-success">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardBody>

                <CardFooter>
                  <Button
                    isLoading={fetcher.state === "submitting"}
                    color={
                      isCurrentPlan(planId) &&
                      subscription?.status === "created"
                        ? "warning"
                        : isCurrentPlan(planId)
                        ? "secondary"
                        : "primary"
                    }
                    className="w-full"
                    onClick={() => handleSubscriptionAction(planId)}
                    disabled={
                      (isCurrentPlan(planId) &&
                        subscription?.status !== "created") ||
                      (!isCurrentPlan(planId) &&
                        (subscription?.status === "active" ||
                          subscription?.status === "authenticated" ||
                          subscription?.status === "created"))
                    }
                  >
                    {isCurrentPlan(planId) && subscription?.status === "created"
                      ? "Complete Subscription"
                      : isCurrentPlan(planId)
                      ? "Current Plan"
                      : subscription?.status === "created"
                      ? "Complete Current Plan First"
                      : subscription?.status === "active" ||
                        subscription?.status === "authenticated"
                      ? "Complete Current Plan First"
                      : "Subscribe"}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        {pagination.total > pagination.count && (
          <div className="flex justify-center mt-8 gap-4">
            <Button
              onClick={() =>
                handlePageChange(
                  Math.max(0, pagination.skip - pagination.count)
                )
              }
              disabled={pagination.skip === 0}
            >
              Previous
            </Button>
            <Button
              onClick={() =>
                handlePageChange(pagination.skip + pagination.count)
              }
              disabled={pagination.skip + pagination.count >= pagination.total}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
