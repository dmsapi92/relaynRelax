import z from "node_modules/zod/lib";

type ExtendedZodField = z.ZodTypeAny & {
    getInputType: () => string;
    isRequired: () => boolean;
    getInputName: () => string;
};

type ExtendedZodShape<T extends z.ZodRawShape> = {
    [K in keyof T]: T[K] & ExtendedZodField;
};

export const extendSchemaFields = <T extends z.ZodRawShape>(
    schema: z.ZodObject<T>
): z.ZodObject<T> & { shape: ExtendedZodShape<T> } => {
    Object.entries(schema.shape).forEach(([key, field]) => {
        const extendedField = field as ExtendedZodField;

        // Attach methods dynamically
        extendedField.getInputType = () => {
            if (field instanceof z.ZodString) return "text";
            if (field instanceof z.ZodNumber) return "number";
            if (field instanceof z.ZodBoolean) return "checkbox";
            if (field instanceof z.ZodArray) return "text"; // Customize for arrays if needed
            if (field instanceof z.ZodDate) return "date";
            return "text";
        };

        extendedField.isRequired = () =>
            !(field.isOptional?.() || field.isNullable?.());

        // Automatically derive the input name
        extendedField.getInputName = () => key;
    });

    return schema as z.ZodObject<T> & { shape: ExtendedZodShape<T> };
};
