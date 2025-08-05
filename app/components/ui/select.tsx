import { Select as NextSelect, SelectItem } from "@nextui-org/react";
import { ReactNode } from "react";

interface SelectProps {
    id: string;
    name: string;
    label: string;
    placeholder?: string;
    required?: boolean;
    defaultValue?: string;
    options: Array<{ label: string; value: string }>;
    className?: string;
    startContent?: ReactNode;
}

export function Select({
    id,
    name,
    label,
    placeholder,
    required,
    defaultValue,
    options,
    className = '',
    startContent,
}: SelectProps) {
    return (
        <NextSelect
            id={id}
            name={name}
            label={label}
            placeholder={placeholder}
            isRequired={required}
            defaultSelectedKeys={defaultValue ? [defaultValue] : undefined}
            variant="bordered"
            radius="sm"
            startContent={startContent}
            classNames={{
                base: `${className}`,
                label: "text-foreground-500",
                trigger: [
                    "shadow-none",
                    "bg-transparent",
                    "hover:bg-content2",
                    "data-[open=true]:bg-content2",
                    startContent ? "pl-12" : "",
                ].join(" "),
                value: "text-foreground-600",
                innerWrapper: "bg-transparent",
                listboxWrapper: "bg-content1",
                popoverContent: [
                    "bg-content1",
                    "shadow-medium"
                ].join(" ")
            }}
        >
            {options.map((option) => (
                <SelectItem
                    key={option.value}
                    value={option.value}
                    className="text-foreground-600 data-[hover=true]:bg-content2"
                >
                    {option.label}
                </SelectItem>
            ))}
        </NextSelect>
    );
} 