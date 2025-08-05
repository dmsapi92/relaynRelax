import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Chip } from "@nextui-org/chip";
import { Divider } from "@nextui-org/divider";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import {
  useActionData,
  useLoaderData,
  useNavigate,
  useSubmit,
} from "@remix-run/react";
import {
  IconCalendarEvent,
  IconEdit,
  IconLicense,
  IconTrash,
} from "@tabler/icons-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { ReminderType } from "prisma/generated/enums";
import { useState } from "react";
import { FormFieldComponent } from "~/components/ui/form-field";
import { getUserPrismaClient } from "~/lib/get-user-db.server";
import { getUserIdMobile } from "~/utils/session.server";
import Layout from "../../../components/Layout";

type ModalType =
  | "addReminder"
  | "editLicense"
  | "deleteLicense"
  | "editReminder"
  | "deleteReminder"
  | null;

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { prisma } = await getUserPrismaClient(request);
  const userId = await getUserIdMobile(request);
  const licenseId = params.licenseId;

  if (!userId) {
    throw new Error("Customer not found");
  }

  if (!licenseId) {
    throw new Error("License ID is required");
  }

  const license = await prisma.drivingLicense.findFirst({
    where: {
      id: licenseId,
      userId,
    },
    include: {
      reminders: {
        orderBy: {
          reminderDate: "asc",
        },
      },
    },
  });

  if (!license) {
    throw new Error("License not found");
  }

  return json({ license });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { prisma } = await getUserPrismaClient(request);
  const userId = await getUserIdMobile(request);
  const licenseId = params.licenseId;

  if (!userId || !licenseId) {
    throw new Error("Invalid request");
  }

  const formData = await request.formData();
  const intent = formData.get("intent");

  try {
    switch (intent) {
      case "addReminder": {
        const type = formData.get("type") as ReminderType;
        const reminderDate = formData.get("reminderDate") as string;
        const notifyDaysBefore = parseInt(
          formData.get("notifyDaysBefore") as string
        );

        const reminder = await prisma.reminder.create({
          data: {
            type,
            reminderDate: new Date(reminderDate),
            notifyDaysBefore,
            userId,
            licenseId,
            isEnabled: true,
          },
        });

        return json({ success: true, reminder });
      }

      case "updateReminder": {
        const reminderId = formData.get("reminderId") as string;
        const type = formData.get("type") as ReminderType;
        const reminderDate = formData.get("reminderDate") as string;
        const notifyDaysBefore = parseInt(
          formData.get("notifyDaysBefore") as string
        );
        const isEnabled = formData.get("isEnabled") === "true";

        const reminder = await prisma.reminder.update({
          where: { id: reminderId },
          data: {
            type,
            reminderDate: new Date(reminderDate),
            notifyDaysBefore,
            isEnabled,
          },
        });

        return json({ success: true, reminder });
      }

      case "deleteReminder": {
        const reminderId = formData.get("reminderId") as string;

        await prisma.reminder.delete({
          where: { id: reminderId },
        });

        return json({ success: true });
      }

      case "editLicense": {
        const licenseNumber = formData.get("licenseNumber") as string;
        const expiryDate = formData.get("expiryDate") as string;
        const issuedDate = formData.get("issuedDate") as string;
        const issuingAuthority = formData.get("issuingAuthority") as string;

        const license = await prisma.drivingLicense.update({
          where: { id: licenseId },
          data: {
            licenseNumber,
            expiryDate: new Date(expiryDate),
            issuedDate: new Date(issuedDate),
            issuingAuthority,
          },
        });

        return json({ success: true, license });
      }

      case "deleteLicense": {
        await prisma.drivingLicense.delete({
          where: { id: licenseId },
        });

        return redirect("/mobileApp/customer/licenses");
      }

      default:
        return json({ error: "Invalid intent" }, { status: 400 });
    }
  } catch (error) {
    return json({ error: "An error occurred" }, { status: 500 });
  }
}

export default function LicenseDetails() {
  const { license } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigate = useNavigate();
  const submit = useSubmit();
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedReminder, setSelectedReminder] = useState<any>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleModalOpen = (modalType: ModalType, reminder?: any) => {
    setActiveModal(modalType);
    if (reminder) {
      setSelectedReminder(reminder);
    }
    onOpen();
  };

  const handleModalClose = () => {
    setActiveModal(null);
    setSelectedReminder(null);
    onClose();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    submit(form, { method: "post" });
    handleModalClose();
  };

  const reminderTypes = Object.values(ReminderType).filter(
    (type) =>
      type === ReminderType.LICENSE_EXPIRY || type === ReminderType.OTHER
  );

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
                <h1 className="text-xl font-semibold">License Details</h1>
              </div>
              <div className="flex gap-2">
                <Button
                  color="primary"
                  variant="flat"
                  isIconOnly
                  onPress={() => handleModalOpen("editLicense")}
                >
                  <IconEdit size={20} />
                </Button>
                <Button
                  color="danger"
                  variant="flat"
                  isIconOnly
                  onPress={() => handleModalOpen("deleteLicense")}
                >
                  <IconTrash size={20} />
                </Button>
                <Button
                  color="primary"
                  variant="light"
                  onPress={() => navigate("/mobileApp/customer/licenses")}
                >
                  Back to Licenses
                </Button>
              </div>
            </CardHeader>
            <Divider />
            <CardBody className="gap-4">
              <div className="bg-content2 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-small text-default-500">
                      License Number
                    </p>
                    <p className="font-semibold">{license.licenseNumber}</p>
                  </div>
                  <div>
                    <p className="text-small text-default-500">
                      Issuing Authority
                    </p>
                    <p className="font-semibold">
                      {license.issuingAuthority || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-small text-default-500">Expiry Date</p>
                    <p className="font-semibold">
                      {license.expiryDate
                        ? format(new Date(license.expiryDate), "dd MMM yyyy")
                        : "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-small text-default-500">Issued Date</p>
                    <p className="font-semibold">
                      {license.issuedDate
                        ? format(new Date(license.issuedDate), "dd MMM yyyy")
                        : "Not specified"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Reminders Section */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <IconCalendarEvent size={20} className="text-primary" />
                    <h2 className="text-lg font-semibold">Reminders</h2>
                  </div>
                  <Button
                    size="sm"
                    color="primary"
                    variant="flat"
                    onPress={() => handleModalOpen("addReminder")}
                  >
                    Add Reminder
                  </Button>
                </div>

                {license.reminders.length > 0 ? (
                  <div className="space-y-3">
                    {license.reminders.map((reminder) => (
                      <div
                        key={reminder.id}
                        className="p-3 bg-content2 rounded-lg flex justify-between items-center"
                      >
                        <div>
                          <p className="font-medium">{reminder.type}</p>
                          <p className="text-small text-default-500">
                            Due:{" "}
                            {format(
                              new Date(reminder.reminderDate),
                              "dd MMM yyyy"
                            )}
                          </p>
                          <p className="text-small text-default-500">
                            Notify: {reminder.notifyDaysBefore} days before
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Chip
                            size="sm"
                            color={reminder.isEnabled ? "success" : "default"}
                            variant="flat"
                          >
                            {reminder.isEnabled ? "Active" : "Disabled"}
                          </Chip>
                          <Button
                            size="sm"
                            color="primary"
                            variant="light"
                            isIconOnly
                            onPress={() =>
                              handleModalOpen("editReminder", reminder)
                            }
                          >
                            <IconEdit size={16} />
                          </Button>
                          <Button
                            size="sm"
                            color="danger"
                            variant="light"
                            isIconOnly
                            onPress={() =>
                              handleModalOpen("deleteReminder", reminder)
                            }
                          >
                            <IconTrash size={16} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-default-500 py-4">
                    No reminders set for this license
                  </p>
                )}
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Add Reminder Modal */}
        <Modal
          isOpen={isOpen && activeModal === "addReminder"}
          onClose={handleModalClose}
          placement="center"
          backdrop="blur"
        >
          <ModalContent>
            <form onSubmit={handleSubmit}>
              <input type="hidden" name="intent" value="addReminder" />
              <ModalHeader>Add New Reminder</ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <FormFieldComponent
                    field={{
                      id: "reminder-type",
                      name: "type",
                      label: "Reminder Type",
                      type: "select",
                      required: true,
                      placeholder: "Select a type",
                      options: reminderTypes.map((type) => ({
                        label: type.replace(/_/g, " "),
                        value: type,
                      })),
                    }}
                  />

                  <FormFieldComponent
                    field={{
                      id: "reminder-date",
                      name: "reminderDate",
                      label: "Due Date",
                      type: "date",
                      required: true,
                    }}
                  />

                  <FormFieldComponent
                    field={{
                      id: "notify-days",
                      name: "notifyDaysBefore",
                      label: "Notify Days Before",
                      type: "number",
                      defaultValue: "7",
                      required: true,
                      min: 1,
                      max: 90,
                      placeholder: "Enter number of days",
                    }}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={handleModalClose}
                >
                  Cancel
                </Button>
                <Button color="primary" type="submit">
                  Add Reminder
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>

        {/* Edit Reminder Modal */}
        <Modal
          isOpen={isOpen && activeModal === "editReminder"}
          onClose={handleModalClose}
          placement="center"
          backdrop="blur"
        >
          <ModalContent>
            <form onSubmit={handleSubmit}>
              <input type="hidden" name="intent" value="updateReminder" />
              <input
                type="hidden"
                name="reminderId"
                value={selectedReminder?.id}
              />
              <ModalHeader>Edit Reminder</ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <FormFieldComponent
                    field={{
                      id: "reminder-type-edit",
                      name: "type",
                      label: "Reminder Type",
                      type: "select",
                      required: true,
                      placeholder: "Select a type",
                      defaultValue: selectedReminder?.type,
                      options: reminderTypes.map((type) => ({
                        label: type.replace(/_/g, " "),
                        value: type,
                      })),
                    }}
                  />

                  <FormFieldComponent
                    field={{
                      id: "reminder-date-edit",
                      name: "reminderDate",
                      label: "Due Date",
                      type: "date",
                      required: true,
                      defaultValue: selectedReminder
                        ? format(
                            new Date(selectedReminder.reminderDate),
                            "yyyy-MM-dd"
                          )
                        : undefined,
                    }}
                  />

                  <FormFieldComponent
                    field={{
                      id: "notify-days-edit",
                      name: "notifyDaysBefore",
                      label: "Notify Days Before",
                      type: "number",
                      defaultValue:
                        selectedReminder?.notifyDaysBefore.toString(),
                      required: true,
                      min: 1,
                      max: 90,
                      placeholder: "Enter number of days",
                    }}
                  />

                  <FormFieldComponent
                    field={{
                      id: "is-enabled",
                      name: "isEnabled",
                      label: "Status",
                      type: "select",
                      required: true,
                      defaultValue: selectedReminder?.isEnabled
                        ? "true"
                        : "false",
                      options: [
                        { label: "Active", value: "true" },
                        { label: "Disabled", value: "false" },
                      ],
                    }}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={handleModalClose}
                >
                  Cancel
                </Button>
                <Button color="primary" type="submit">
                  Save Changes
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>

        {/* Delete Reminder Modal */}
        <Modal
          isOpen={isOpen && activeModal === "deleteReminder"}
          onClose={handleModalClose}
          placement="center"
          backdrop="blur"
        >
          <ModalContent>
            <form onSubmit={handleSubmit}>
              <input type="hidden" name="intent" value="deleteReminder" />
              <input
                type="hidden"
                name="reminderId"
                value={selectedReminder?.id}
              />
              <ModalHeader>Delete Reminder</ModalHeader>
              <ModalBody>
                <p className="text-default-500">
                  Are you sure you want to delete this reminder? This action
                  cannot be undone.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="default"
                  variant="light"
                  onPress={handleModalClose}
                >
                  Cancel
                </Button>
                <Button color="danger" type="submit">
                  Delete Reminder
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>

        {/* Edit License Modal */}
        <Modal
          isOpen={isOpen && activeModal === "editLicense"}
          onClose={handleModalClose}
          placement="center"
          backdrop="blur"
        >
          <ModalContent>
            <form onSubmit={handleSubmit}>
              <input type="hidden" name="intent" value="editLicense" />
              <ModalHeader>Edit License</ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <FormFieldComponent
                    field={{
                      id: "license-number",
                      name: "licenseNumber",
                      label: "License Number",
                      type: "text",
                      defaultValue: license.licenseNumber || "",
                      required: true,
                      placeholder: "Enter license number",
                    }}
                  />

                  <FormFieldComponent
                    field={{
                      id: "expiry-date",
                      name: "expiryDate",
                      label: "Expiry Date",
                      type: "date",
                      defaultValue: license.expiryDate
                        ? format(new Date(license.expiryDate), "yyyy-MM-dd")
                        : "",
                      required: true,
                    }}
                  />

                  <FormFieldComponent
                    field={{
                      id: "issued-date",
                      name: "issuedDate",
                      label: "Issued Date",
                      type: "date",
                      defaultValue: license.issuedDate
                        ? format(new Date(license.issuedDate), "yyyy-MM-dd")
                        : "",
                      required: true,
                    }}
                  />

                  <FormFieldComponent
                    field={{
                      id: "issuing-authority",
                      name: "issuingAuthority",
                      label: "Issuing Authority",
                      type: "text",
                      defaultValue: license.issuingAuthority || "",
                      required: true,
                      placeholder: "Enter issuing authority",
                    }}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={handleModalClose}
                >
                  Cancel
                </Button>
                <Button color="primary" type="submit">
                  Save Changes
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>

        {/* Delete License Modal */}
        <Modal
          isOpen={isOpen && activeModal === "deleteLicense"}
          onClose={handleModalClose}
          placement="center"
          backdrop="blur"
        >
          <ModalContent>
            <form onSubmit={handleSubmit}>
              <input type="hidden" name="intent" value="deleteLicense" />
              <ModalHeader>Delete License</ModalHeader>
              <ModalBody>
                <p className="text-default-500">
                  Are you sure you want to delete this license? This action
                  cannot be undone. All associated reminders will also be
                  deleted.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="default"
                  variant="light"
                  onPress={handleModalClose}
                >
                  Cancel
                </Button>
                <Button color="danger" type="submit">
                  Delete License
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>
      </div>
    </Layout>
  );
}
