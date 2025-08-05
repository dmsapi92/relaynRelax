import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import {
  Form,
  Link,
  Outlet,
  useActionData,
  useLoaderData,
  useLocation,
  useNavigation,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import { getUserPrismaClient } from "~/lib/get-user-db.server";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  vehicles: number;
  licenses: number;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const { prisma } = await getUserPrismaClient(request);

  const users = await prisma.user.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      _count: {
        select: {
          vehicles: true,
          drivingLicenses: true,
        },
      },
    },
  });

  return json({
    users: users.map((user) => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: user.role,
      status: user.isActive ? "active" : "inactive",
      createdAt: user.createdAt,
      vehicles: user._count?.vehicles || 0,
      licenses: user._count?.drivingLicenses || 0,
    })),
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const { prisma } = await getUserPrismaClient(request);
  const userId = formData.get("userId") as string;

  if (!userId) {
    return json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    // First delete all user's vehicles, licenses, and reminders
    await prisma.reminder.deleteMany({
      where: { userId },
    });

    await prisma.vehicle.deleteMany({
      where: { userId },
    });

    await prisma.drivingLicense.deleteMany({
      where: { userId },
    });

    // Then delete the user
    await prisma.user.delete({
      where: { id: userId },
    });
    return json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return json({ error: "Failed to delete user" }, { status: 500 });
  }
}

export default function Users() {
  const location = useLocation();
  if (location.pathname.includes("/users/")) {
    return <Outlet />;
  }
  const { users } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const isDeleting = navigation.state === "submitting";
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const actionData = useActionData<typeof action>();

  useEffect(() => {
    if (actionData?.success) {
      onClose();
    }
  }, [actionData, onClose]);

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    onOpen();
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Users</h1>
        <Button color="primary" as={Link} to={"/users/new"}>
          Add New User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">All Users</h2>
        </CardHeader>
        <CardBody>
          <Table aria-label="Users list">
            <TableHeader>
              <TableColumn>Name</TableColumn>
              <TableColumn>Email</TableColumn>
              <TableColumn>Role</TableColumn>
              <TableColumn>Status</TableColumn>
              <TableColumn>Vehicles</TableColumn>
              <TableColumn>Licenses</TableColumn>
              <TableColumn>Joined Date</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody emptyContent={"No users found"}>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        user.status === "active"
                          ? "bg-success-100 text-success-600"
                          : "bg-danger-100 text-danger-600"
                      }`}
                    >
                      {user.status}
                    </span>
                  </TableCell>
                  <TableCell>{user.vehicles}</TableCell>
                  <TableCell>{user.licenses}</TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="light"
                        color="primary"
                        as={Link}
                        to={`/users/${user.id}`}
                      >
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="light"
                        color="danger"
                        className="backdrop-blur-sm bg-danger-100/30"
                        onClick={() => handleDeleteClick(user)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        backdrop="blur"
        className="dark:bg-background/95"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Confirm User Deletion
              </ModalHeader>
              <ModalBody>
                <p className="text-danger-500 font-medium">
                  Warning: This action cannot be undone!
                </p>
                <p>
                  Are you sure you want to delete user{" "}
                  <span className="font-semibold">{selectedUser?.name}</span>?
                </p>
                <p className="text-sm text-foreground-500">
                  This will also permanently delete all associated data
                  including:
                </p>
                <ul className="list-disc list-inside text-sm text-foreground-500">
                  <li>All vehicles ({selectedUser?.vehicles})</li>
                  <li>All driving licenses ({selectedUser?.licenses})</li>
                  <li>All document reminders</li>
                  <li>Profile information</li>
                </ul>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Form method="post">
                  <input type="hidden" name="userId" value={selectedUser?.id} />
                  <Button
                    color="danger"
                    type="submit"
                    isLoading={isDeleting}
                    className="backdrop-blur-sm bg-danger-100/30"
                  >
                    Delete User
                  </Button>
                </Form>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
