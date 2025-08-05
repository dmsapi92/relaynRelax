import { Form } from "@remix-run/react";
import { FormField } from "~/components/ui/form-field";
import { Button } from "@nextui-org/react";
interface SchoolCollegeFormProps {
  type: "school" | "college";
  campusId: string;
}

export function SchoolCollegeForm({ type, campusId }: SchoolCollegeFormProps) {
  const title = type === "school" ? "School" : "College";

  return (
    <Form method="post" className="space-y-6">
      <input type="hidden" name="campusId" value={campusId} />
      <input type="hidden" name="intent" value={type.toUpperCase()} />

      <div className="space-y-4">
        <FormField label={`${title} Name`} name="name" type="text" required />

        <FormField label="Code" name="code" type="text" required />

        <FormField label="Email" name="email" type="email" required />

        <FormField label="Phone" name="phone" type="tel" required />

        <FormField label="Description" name="description" type="textarea" />
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="ghost" type="button">
          Cancel
        </Button>
        <Button variant="primary" type="submit">
          Create {title}
        </Button>
      </div>
    </Form>
  );
}
