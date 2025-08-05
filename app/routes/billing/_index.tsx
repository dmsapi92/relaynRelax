import { Card, CardBody } from "@nextui-org/card";
import { Link, Outlet, useLocation } from "@remix-run/react";
import { motion } from "framer-motion";
import { FaFileInvoiceDollar, FaListUl } from "react-icons/fa6";

export default function BillingIndexPage() {
  const location = useLocation();
  const isChildRoute = location.pathname !== "/billing";
  if (isChildRoute) {
    return <Outlet />;
  }
  const navigationCards = [
    {
      title: "Subscription Plans",
      description: "View and manage your subscription plans",
      icon: <FaListUl className="w-6 h-6" />,
      href: "/billing/plans",
      color: "primary",
    },
    {
      title: "Billing History",
      description: "View your invoices and payment history",
      icon: <FaFileInvoiceDollar className="w-6 h-6" />,
      href: "/billing/invoices",
      color: "secondary",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col items-start gap-6">
        <div>
          <h1 className="text-3xl font-bold">Billing & Subscriptions</h1>
          <p className="text-default-500 mt-2">
            Manage your subscription plans and view billing history
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {navigationCards.map((card) => (
            <Link key={card.href} to={card.href} className="block no-underline">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card
                  className="h-full hover:shadow-lg transition-shadow"
                  isPressable
                >
                  <CardBody className="flex flex-row items-center gap-4 p-6">
                    <div className={`text-${card.color}`}>{card.icon}</div>
                    <div>
                      <h2 className="text-xl font-semibold">{card.title}</h2>
                      <p className="text-default-500 mt-1">
                        {card.description}
                      </p>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Quick Stats Summary */}
        <div className="w-full mt-8">
          <Card className="bg-default-50 dark:bg-default-100">
            <CardBody>
              <h3 className="text-lg font-semibold mb-4">Need Help?</h3>
              <p className="text-default-500">
                If you have any questions about billing or your subscription,
                please contact our support team. We're here to help!
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
