import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Chip } from "@nextui-org/chip";
import { Divider } from "@nextui-org/divider";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useLoaderData, useLocation, useNavigate } from "@remix-run/react";
import { IconLicense, IconPlus } from "@tabler/icons-react";
import { format, isBefore } from "date-fns";
import { motion } from "framer-motion";
import { getUserPrismaClient } from "~/lib/get-user-db.server";
import { getUserIdMobile } from "~/utils/session.server";
import Layout from "../../components/Layout";

export async function loader({ request }: LoaderFunctionArgs) {
  const { prisma } = await getUserPrismaClient(request);
  const userId = await getUserIdMobile(request);

  if (!userId) {
    throw new Error("Customer not found");
  }

  const licenses = await prisma.drivingLicense.findMany({
    where: { userId },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return json({ licenses });
}

export default function LicensesIndex() {
  const location = useLocation();
  if (location.pathname.includes("/mobileApp/customer/licenses/")) {
    return <Outlet />;
  }
  const { licenses } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const today = new Date();

  // Helper function to check if a license is expired
  const isExpired = (expiryDate: string | null) => {
    if (!expiryDate) return false;
    return isBefore(new Date(expiryDate), today);
  };

  return (
    <Layout>
      <div className="p-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-none">
            <CardHeader className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <IconLicense size={24} className="text-primary" />
                <h1 className="text-xl font-semibold">Your Licenses</h1>
              </div>
              <Button
                color="primary"
                endContent={<IconPlus size={16} />}
                onPress={() => navigate("new")}
              >
                Add License
              </Button>
            </CardHeader>
            <Divider />
            <CardBody className="gap-4">
              {licenses.length > 0 ? (
                licenses.map((license) => (
                  <motion.div
                    key={license.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 rounded-lg bg-content2"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{license.licenseNumber}</h3>
                        {license.issuingAuthority && (
                          <p className="text-small text-default-500">
                            Issued by: {license.issuingAuthority}
                          </p>
                        )}
                        {license.issuedDate && (
                          <p className="text-tiny text-default-400">
                            Issued: {format(new Date(license.issuedDate), 'dd MMM yyyy')}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        <Chip
                          size="sm"
                          variant="flat"
                          color={isExpired(license.expiryDate) ? "danger" : "success"}
                        >
                          {license.expiryDate
                            ? `Expires: ${format(new Date(license.expiryDate), 'dd MMM yyyy')}`
                            : "No Expiry Date"}
                        </Chip>
                        <Button
                          size="sm"
                          variant="light"
                          onPress={() => navigate(license.id)}
                        >
                          Manage
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 text-default-500">
                  <IconLicense size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No licenses registered yet</p>
                  <Button
                    color="primary"
                    variant="flat"
                    size="sm"
                    className="mt-4"
                    endContent={<IconPlus size={16} />}
                    onPress={() => navigate("new")}
                  >
                    Add Your First License
                  </Button>
                </div>
              )}
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
} 