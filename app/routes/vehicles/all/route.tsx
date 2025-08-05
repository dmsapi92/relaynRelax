// import { Button } from "@nextui-org/button";
// import { Card, CardBody } from "@nextui-org/card";
// import { Input } from "@nextui-org/input";
// import { Select, SelectItem } from "@nextui-org/select";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableColumn,
//   TableHeader,
//   TableRow,
// } from "@nextui-org/table";
// import type { User, Vehicle } from "@prisma/client";
// import { json, redirect, type LoaderFunctionArgs } from "@remix-run/node";
// import { Link, useLoaderData, useSearchParams } from "@remix-run/react";
// import {
//   AlertTriangle,
//   CarFront,
//   Search,
//   User as UserIcon,
// } from "lucide-react";
// import { getUserPrismaClient } from "~/lib/get-user-db.server";
// import { getUserId } from "~/utils/session.server";

// type LoaderData = {
//   vehicles: (Vehicle & {
//     user: Pick<User, "id" | "firstName" | "lastName" | "email">;
//   })[];
// };

// export async function loader({ request }: LoaderFunctionArgs) {
//   try {
//     // Check authentication
//     const currentUserId = await getUserId(request);
//     if (!currentUserId) {
//       return redirect("/auth/login");
//     }

//     const { prisma } = await getUserPrismaClient(request);
//     const url = new URL(request.url);
//     const search = url.searchParams.get("search")?.toLowerCase() || "";
//     const sortBy = url.searchParams.get("sortBy") || "registrationNumber";
//     const order = url.searchParams.get("order") || "asc";

//     // Get all vehicles with their users
//     const vehicles = await prisma.vehicle.findMany({
//       where: {
//         OR: [
//           { registrationNumber: { contains: search, mode: "insensitive" } },
//           { make: { contains: search, mode: "insensitive" } },
//           { model: { contains: search, mode: "insensitive" } },
//           {
//             user: {
//               OR: [
//                 { firstName: { contains: search, mode: "insensitive" } },
//                 { lastName: { contains: search, mode: "insensitive" } },
//                 { email: { contains: search, mode: "insensitive" } },
//               ],
//             },
//           },
//         ],
//       },
//       include: {
//         user: {
//           select: {
//             id: true,
//             firstName: true,
//             lastName: true,
//             email: true,
//           },
//         },
//       },
//       orderBy: {
//         [sortBy]: order,
//       },
//     });

//     return json({ vehicles });
//   } catch (error) {
//     console.error("[Debug] Error in vehicles loader:", error);
//     throw new Response("Error loading vehicles", { status: 500 });
//   }
// }

// export function ErrorBoundary() {
//   return (
//     <div className="p-4">
//       <Card>
//         <CardBody>
//           <div className="text-center py-6">
//             <div className="text-danger mb-4">
//               <AlertTriangle className="w-12 h-12 mx-auto" />
//             </div>
//             <h2 className="text-xl font-bold mb-2">Error Loading Vehicles</h2>
//             <p className="text-gray-500 mb-4">
//               An error occurred while loading the vehicles list. Please try
//               again later.
//             </p>
//             <Button as={Link} to="/vehicles/all" color="primary" variant="flat">
//               Retry
//             </Button>
//           </div>
//         </CardBody>
//       </Card>
//     </div>
//   );
// }

// export default function AllVehiclesRoute() {
//   const { vehicles } = useLoaderData<typeof loader>();
//   const [searchParams, setSearchParams] = useSearchParams();
//   const search = searchParams.get("search") || "";
//   const sortBy = searchParams.get("sortBy") || "registrationNumber";
//   const order = searchParams.get("order") || "asc";

//   const handleSearch = (value: string) => {
//     const params = new URLSearchParams(searchParams);
//     if (value) {
//       params.set("search", value);
//     } else {
//       params.delete("search");
//     }
//     setSearchParams(params);
//   };

//   const handleSort = (value: string) => {
//     const params = new URLSearchParams(searchParams);
//     const [newSortBy, newOrder] = value.split("-");
//     params.set("sortBy", newSortBy);
//     params.set("order", newOrder);
//     setSearchParams(params);
//   };

//   return (
//     <div className="p-4">
//       <Card>
//         <CardBody>
//           <div className="flex flex-col gap-4">
//             <div className="flex justify-between items-center">
//               <h1 className="text-2xl font-bold flex items-center gap-2">
//                 <CarFront className="w-6 h-6" />
//                 All Vehicles
//               </h1>
//               <Button
//                 as={Link}
//                 to="/vehicles/new"
//                 color="primary"
//                 variant="flat"
//               >
//                 Add New Vehicle
//               </Button>
//             </div>

//             <div className="flex flex-col sm:flex-row gap-4">
//               <Input
//                 placeholder="Search vehicles..."
//                 value={search}
//                 onValueChange={handleSearch}
//                 startContent={<Search className="w-4 h-4 text-default-400" />}
//                 className="w-full sm:w-72"
//               />

//               <Select
//                 placeholder="Sort by"
//                 selectedKeys={[`${sortBy}-${order}`]}
//                 onChange={(e) => handleSort(e.target.value)}
//                 className="w-full sm:w-48"
//               >
//                 <SelectItem
//                   key="registrationNumber-asc"
//                   value="registrationNumber-asc"
//                 >
//                   Registration (A-Z)
//                 </SelectItem>
//                 <SelectItem
//                   key="registrationNumber-desc"
//                   value="registrationNumber-desc"
//                 >
//                   Registration (Z-A)
//                 </SelectItem>
//                 <SelectItem key="make-asc" value="make-asc">
//                   Make (A-Z)
//                 </SelectItem>
//                 <SelectItem key="make-desc" value="make-desc">
//                   Make (Z-A)
//                 </SelectItem>
//                 <SelectItem key="createdAt-desc" value="createdAt-desc">
//                   Newest First
//                 </SelectItem>
//                 <SelectItem key="createdAt-asc" value="createdAt-asc">
//                   Oldest First
//                 </SelectItem>
//               </Select>
//             </div>

//             <div className="overflow-x-auto">
//               <Table aria-label="Vehicles list">
//                 <TableHeader>
//                   <TableColumn>REGISTRATION</TableColumn>
//                   <TableColumn>MAKE/MODEL</TableColumn>
//                   <TableColumn>YEAR</TableColumn>
//                   <TableColumn>COLOR</TableColumn>
//                   <TableColumn>OWNER</TableColumn>
//                   <TableColumn>ACTIONS</TableColumn>
//                 </TableHeader>
//                 <TableBody>
//                   {vehicles.map((vehicle) => (
//                     <TableRow key={vehicle.id}>
//                       <TableCell>{vehicle.registrationNumber}</TableCell>
//                       <TableCell>
//                         {vehicle.make} {vehicle.model}
//                       </TableCell>
//                       <TableCell>{vehicle.year || "N/A"}</TableCell>
//                       <TableCell>{vehicle.color || "N/A"}</TableCell>
//                       <TableCell>
//                         <Link
//                           to={`/users/${vehicle.user.id}`}
//                           className="flex items-center gap-2 text-primary hover:underline"
//                         >
//                           <UserIcon className="w-4 h-4" />
//                           {vehicle.user.firstName} {vehicle.user.lastName}
//                         </Link>
//                       </TableCell>
//                       <TableCell>
//                         <div className="flex gap-2">
//                           <Button
//                             as={Link}
//                             to={`/vehicles/${vehicle.id}`}
//                             size="sm"
//                             color="primary"
//                             variant="flat"
//                           >
//                             View Details
//                           </Button>
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>
//           </div>
//         </CardBody>
//       </Card>
//     </div>
//   );
// }
