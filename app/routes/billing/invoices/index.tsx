import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Chip } from "@nextui-org/chip";
import { Select, SelectItem } from "@nextui-org/select";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData, useSearchParams } from "@remix-run/react";
import { FaArrowLeft } from "react-icons/fa6";
import { ENV } from "~/env.server";
import { getUserPrismaClient } from "~/lib/get-user-db.server";

interface LoaderData {
  payments: any[];
  stats: {
    total: number;
    successful: number;
    pending: number;
    failed: number;
  };
  message?: string;
  error?: string;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const { prisma } = await getUserPrismaClient(request);
  const url = new URL(request.url);
  const status = url.searchParams.get("status") || "all";
  const type = url.searchParams.get("type") || "all";

  // Get current institution
  const institution = await prisma.institution.findFirst({
    select: {
      razorpaySubscriptionIds: true,
      name: true,
      email: true,
    },
  });

  if (!institution) {
    throw new Error("Institution not found");
  }

  // Handle case where there are no subscriptions
  if (
    !institution.razorpaySubscriptionIds ||
    institution.razorpaySubscriptionIds.length === 0
  ) {
    return json<LoaderData>({
      payments: [],
      stats: {
        total: 0,
        successful: 0,
        pending: 0,
        failed: 0,
      },
      message: "No subscription history found",
    });
  }

  try {
    // Fetch all subscriptions and their payments from Razorpay
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

    // Filter out any invalid subscriptions
    const validSubscriptions = subscriptions.filter((sub) => !sub.error);

    if (validSubscriptions.length === 0) {
      return json<LoaderData>({
        payments: [],
        stats: {
          total: 0,
          successful: 0,
          pending: 0,
          failed: 0,
        },
        message: "No active subscriptions found",
      });
    }

    // Fetch payments for each valid subscription using invoices endpoint
    const paymentsPromises = validSubscriptions.map((sub) =>
      fetch(`https://api.razorpay.com/v1/invoices?subscription_id=${sub.id}`, {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${ENV.RAZORPAY_KEY_ID}:${ENV.RAZORPAY_KEY_SECRET}`
          ).toString("base64")}`,
        },
      }).then(async (res) => {
        const data = await res.json();
        // Also fetch payment details for each invoice
        if (data.items) {
          const paymentDetailsPromises = data.items.map((invoice: any) =>
            invoice.payment_id
              ? fetch(
                  `https://api.razorpay.com/v1/payments/${invoice.payment_id}`,
                  {
                    headers: {
                      Authorization: `Basic ${Buffer.from(
                        `${ENV.RAZORPAY_KEY_ID}:${ENV.RAZORPAY_KEY_SECRET}`
                      ).toString("base64")}`,
                    },
                  }
                ).then((res) => res.json())
              : null
          );
          const paymentDetails = await Promise.all(paymentDetailsPromises);
          return {
            invoices: data.items,
            payments: paymentDetails.filter(Boolean),
          };
        }
        return { invoices: [], payments: [] };
      })
    );

    const invoicesAndPaymentsData = await Promise.all(paymentsPromises);

    // Combine all payments into a single array with subscription info
    const allPayments = invoicesAndPaymentsData.flatMap((data, index) => {
      const subscription = validSubscriptions[index];
      return data.payments.map((payment: any) => ({
        ...payment,
        subscription_plan: subscription.plan_id,
        subscription_status: subscription.status,
        invoice: data.invoices.find(
          (inv: any) => inv.payment_id === payment.id
        ),
      }));
    });

    // Filter payments based on URL parameters
    const filteredPayments = allPayments.filter((payment: any) => {
      if (status !== "all" && payment.status !== status) return false;
      if (type !== "all" && payment.method !== type) return false;
      return true;
    });

    // Sort payments by date
    const sortedPayments = filteredPayments.sort(
      (a: any, b: any) => b.created_at - a.created_at
    );

    return json<LoaderData>({
      payments: sortedPayments,
      stats: {
        total: allPayments.length,
        successful: allPayments.filter((p: any) => p.status === "captured")
          .length,
        pending: allPayments.filter((p: any) => p.status === "created").length,
        failed: allPayments.filter((p: any) => p.status === "failed").length,
      },
    });
  } catch (error) {
    console.error("Error fetching payment history:", error);
    return json<LoaderData>({
      payments: [],
      stats: {
        total: 0,
        successful: 0,
        pending: 0,
        failed: 0,
      },
      error: "Failed to fetch payment history. Please try again later.",
    });
  }
}

export default function InvoicesPage() {
  const { payments, stats, message, error } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleFilterChange = (key: string, value: string) => {
    setSearchParams((prev) => {
      if (value === "all") {
        prev.delete(key);
      } else {
        prev.set(key, value);
      }
      return prev;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "captured":
        return "success";
      case "created":
        return "warning";
      case "failed":
        return "danger";
      default:
        return "default";
    }
  };

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
            <h1 className="text-3xl font-bold">Billing History</h1>
            <p className="text-default-500">
              View and manage your payment history and invoices
            </p>
          </div>
        </div>

        {/* Show error message if any */}
        {error && (
          <Card className="mb-8 bg-danger-50 dark:bg-danger-900/20">
            <CardBody>
              <p className="text-danger text-center">{error}</p>
            </CardBody>
          </Card>
        )}

        {/* Show message if no subscriptions */}
        {message && (
          <Card className="mb-8 bg-default-50 dark:bg-default-900/20">
            <CardBody>
              <p className="text-center">{message}</p>
            </CardBody>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardBody>
              <div className="text-center">
                <p className="text-sm text-default-500">Total Transactions</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <div className="text-center">
                <p className="text-sm text-success-500">Successful</p>
                <p className="text-2xl font-bold text-success-600">
                  {stats.successful}
                </p>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <div className="text-center">
                <p className="text-sm text-warning-500">Pending</p>
                <p className="text-2xl font-bold text-warning-600">
                  {stats.pending}
                </p>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <div className="text-center">
                <p className="text-sm text-danger-500">Failed</p>
                <p className="text-2xl font-bold text-danger-600">
                  {stats.failed}
                </p>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Only show filters and table if there are payments */}
        {payments.length > 0 && (
          <>
            {/* Filters */}
            <Card className="mb-8">
              <CardBody>
                <div className="flex flex-wrap gap-4">
                  <Select
                    label="Status"
                    placeholder="Filter by status"
                    selectedKeys={[searchParams.get("status") || "all"]}
                    className="max-w-xs"
                    onChange={(e) =>
                      handleFilterChange("status", e.target.value)
                    }
                  >
                    <SelectItem key="all" value="all">
                      All Status
                    </SelectItem>
                    <SelectItem key="captured" value="captured">
                      Successful
                    </SelectItem>
                    <SelectItem key="created" value="created">
                      Pending
                    </SelectItem>
                    <SelectItem key="failed" value="failed">
                      Failed
                    </SelectItem>
                  </Select>

                  <Select
                    label="Payment Type"
                    placeholder="Filter by type"
                    selectedKeys={[searchParams.get("type") || "all"]}
                    className="max-w-xs"
                    onChange={(e) => handleFilterChange("type", e.target.value)}
                  >
                    <SelectItem key="all" value="all">
                      All Types
                    </SelectItem>
                    <SelectItem key="card" value="card">
                      Card
                    </SelectItem>
                    <SelectItem key="netbanking" value="netbanking">
                      Net Banking
                    </SelectItem>
                    <SelectItem key="upi" value="upi">
                      UPI
                    </SelectItem>
                    <SelectItem key="wallet" value="wallet">
                      Wallet
                    </SelectItem>
                  </Select>
                </div>
              </CardBody>
            </Card>

            {/* Payments Table */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Payment History</h2>
              </CardHeader>
              <CardBody>
                <Table aria-label="Payment history table">
                  <TableHeader>
                    <TableColumn>DATE</TableColumn>
                    <TableColumn>INVOICE NUMBER</TableColumn>
                    <TableColumn>AMOUNT</TableColumn>
                    <TableColumn>STATUS</TableColumn>
                    <TableColumn>METHOD</TableColumn>
                    <TableColumn>SUBSCRIPTION</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment: any) => (
                      <TableRow key={payment.id}>
                        <TableCell>
                          {new Date(
                            payment.created_at * 1000
                          ).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {payment.invoice?.receipt || payment.id}
                        </TableCell>
                        <TableCell>
                          ₹{(payment.amount / 100).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Chip
                            size="sm"
                            color={getStatusColor(payment.status)}
                            variant="flat"
                          >
                            {payment.status}
                          </Chip>
                        </TableCell>
                        <TableCell>
                          <span className="capitalize">
                            {payment.method || "N/A"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Chip
                            size="sm"
                            variant="flat"
                            color={
                              payment.subscription_status === "active"
                                ? "success"
                                : "default"
                            }
                          >
                            {payment.subscription_status}
                          </Chip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardBody>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
