import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useActionData, useNavigate } from "@remix-run/react";
import { IconArrowLeft, IconCar } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { FormFieldComponent } from "~/components/ui/form-field";
import { getUserPrismaClient } from "~/lib/get-user-db.server";
import { getUserIdMobile } from "~/utils/session.server";
import Layout from "../../../components/Layout";

// List of common vehicle makes
const vehicleMakes = [
  "Acura",
  "Alfa Romeo",
  "Aston Martin",
  "Audi",
  "Bentley",
  "BMW",
  "Bugatti",
  "Buick",
  "Cadillac",
  "Chevrolet",
  "Chrysler",
  "Citroen",
  "Dodge",
  "Ferrari",
  "Fiat",
  "Ford",
  "Genesis",
  "GMC",
  "Honda",
  "Hyundai",
  "Infiniti",
  "Jaguar",
  "Jeep",
  "Kia",
  "Lamborghini",
  "Land Rover",
  "Lexus",
  "Lincoln",
  "Lotus",
  "Maserati",
  "Mazda",
  "McLaren",
  "Mercedes-Benz",
  "Mini",
  "Mitsubishi",
  "Nissan",
  "Porsche",
  "Ram",
  "Rolls-Royce",
  "Subaru",
  "Tesla",
  "Toyota",
  "Volkswagen",
  "Volvo",
  "Maruti Suzuki",
  "Tata Motors",
  "Mahindra",
  "Force Motors",
  "Ashok Leyland",
  "Bajaj",
  "Hero",
  "TVS",
  "Royal Enfield",
  "Eicher Motors",
  "Hindustan Motors",
  "Premier",
  "Ola Electric",
  "Ather Energy",
  "Okinawa",
  "Ampere",
  "Pure EV",
  "Revolt Motors",
  "MG Motor",
  "Renault India",
  "Skoda India",
  "Kia India",
  "BYD",
  "Pravaig",
  "Tork Motors",
  "Ultraviolette",
  "Jawa",
  "Yezdi",
  "Benling",
  "Peugeot",
  "Opel",
  "Vauxhall",
  "Dacia",
  "Seat",
  "Škoda",
  "Lada",
  "Proton",
  "Perodua",
  "Great Wall Motors",
  "Chery",
  "Geely",
  "Haval",
  "Lynk & Co",
  "Hongqi",
  "GAC",
  "BAIC",
  "Foton",
  "SsangYong",
  "Daihatsu",
  "Isuzu",
  "Suzuki",
  "Hino",
  "Holden",
  "Iveco",
  "Borgward",
  "Saic",
  "Lucid",
  "Rimac",
  "Koenigsegg",
  "Pagani",
  "Morgan",
  "Caterham",
  "Ariel",
  "Noble",
  "Spyker",
  "Ginetta",
  "Apollo",
  "Hennessey",
  "Zenvo",
  "W Motors",
  "Pininfarina",
  "Alpine",
  "DS Automobiles",
  "Rivian",
  "Nio",
  "Xpeng",
  "Li Auto",
  "Faraday Future",
  "Fisker",
  "Karma",
  "Polestar",
  "Canoo",
].map((make) => ({ label: make, value: make }));

export async function action({ request }: ActionFunctionArgs) {
  const { prisma } = await getUserPrismaClient(request);
  const userId = await getUserIdMobile(request);

  if (!userId) {
    throw new Error("Customer not found");
  }

  const formData = await request.formData();
  const make = formData.get("make") as string;
  const model = formData.get("model") as string;
  const year = formData.get("year")
    ? parseInt(formData.get("year") as string)
    : null;
  const registrationNumber = formData.get("registrationNumber") as string;

  // Validation
  const errors: Record<string, string> = {};

  if (!registrationNumber)
    errors.registrationNumber = "Registration number is required";
  if (
    year &&
    (isNaN(year) || year < 1900 || year > new Date().getFullYear() + 1)
  ) {
    errors.year = "Invalid year";
  }

  if (Object.keys(errors).length > 0) {
    return json({ errors });
  }

  await prisma.vehicle.create({
    data: {
      make,
      model,
      year,
      registrationNumber,
      userId,
    },
  });

  return redirect("..");
}

export default function NewVehicle() {
  const actionData = useActionData<typeof action>();
  const navigate = useNavigate();
  const [selectedMake, setSelectedMake] = useState<string>("");

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
                <Button
                  isIconOnly
                  variant="light"
                  onPress={() => navigate("..")}
                >
                  <IconArrowLeft size={20} />
                </Button>
                <div className="flex items-center gap-2">
                  <IconCar size={24} className="text-primary" />
                  <h1 className="text-xl font-semibold">Add New Vehicle</h1>
                </div>
              </div>
            </CardHeader>
            <Divider />
            <CardBody>
              <Form method="post" className="flex flex-col gap-4">
                <FormFieldComponent
                  field={{
                    id: "registrationNumber",
                    type: "text",
                    label: "Registration Number",
                    name: "registrationNumber",
                    placeholder: "Enter registration number",
                    required: true,
                  }}
                  error={actionData?.errors?.registrationNumber}
                />
                <FormFieldComponent
                  field={{
                    id: "year",
                    type: "number",
                    label: "Year",
                    name: "year",
                    placeholder: "Year of manufacture",
                    min: 1900,
                    max: new Date().getFullYear() + 1,
                  }}
                  error={actionData?.errors?.year}
                />

                <FormFieldComponent
                  field={{
                    id: "make",
                    type: "select",
                    label: "Make",
                    name: "make",
                    placeholder: "Select vehicle make",
                    options: vehicleMakes,
                  }}
                  onChange={(value) => {
                    setSelectedMake(value as string);
                  }}
                  error={actionData?.errors?.make}
                />

                <FormFieldComponent
                  field={{
                    id: "model",
                    type: "text",
                    label: "Model",
                    name: "model",
                    placeholder: "Select vehicle model",
                  }}
                  error={actionData?.errors?.model}
                />

                <div className="flex gap-2 justify-end mt-4">
                  <Button variant="flat" onPress={() => navigate("..")}>
                    Cancel
                  </Button>
                  <Button color="primary" type="submit">
                    Add Vehicle
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
}
