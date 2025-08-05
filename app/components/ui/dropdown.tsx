import type { Selection } from "@nextui-org/react";
import { Select as NextSelect, SelectItem } from "@nextui-org/react";
import { useEffect, useState } from "react";

interface Option {
  value: string;
  label: string;
}

interface DropdownProps {
  id: string;
  name: string;
  label: string;
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  defaultValue?: string;
  className?: string;
  wrapperClassName?: string;
  startContent?: React.ReactNode;
  isMultiSelect?: boolean;
}

export function Dropdown({
  id,
  name,
  label,
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  required,
  disabled,
  defaultValue,
  className = '',
  wrapperClassName = '',
  startContent,
  isMultiSelect = false,
}: DropdownProps) {
  const [hasValue, setHasValue] = useState(!!value || !!defaultValue);
  const [isTouched, setIsTouched] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string>(value || defaultValue || '');

  const handleSelectionChange = (keys: Selection) => {
    const selectedValues = Array.from(keys).map(key => key.toString());
    const newValue = isMultiSelect ? selectedValues.join(',') : selectedValues[0] || '';
    setSelectedValue(newValue);
    setHasValue(!!newValue);
    setIsTouched(true);

    if (onChange) {
      onChange(newValue);
    }
  };

  // Update internal state when value prop changes
  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
      setHasValue(!!value);
    }
  }, [value]);

  const isInvalid = required && !hasValue && isTouched;

  return (
    <NextSelect
      id={id}
      name={name}
      label={label}
      selectedKeys={selectedValue ? new Set(selectedValue.split(',').filter(Boolean)) : undefined}
      defaultSelectedKeys={defaultValue ? new Set(defaultValue.split(',').filter(Boolean)) : undefined}
      placeholder={placeholder}
      isRequired={required}
      isDisabled={disabled}
      onSelectionChange={handleSelectionChange}
      onClose={() => setIsTouched(true)}
      className={className}
      radius="sm"
      startContent={startContent}
      errorMessage={isInvalid ? `${label} is required` : ""}
      isInvalid={isInvalid}
      selectionMode={isMultiSelect ? "multiple" : "single"}
      variant="bordered"
      classNames={{
        trigger: "min-h-unit-12 py-2"
      }}
    >
      {options.map((option) => (
        <SelectItem key={option.value} value={option.value}>
          {option.label}
        </SelectItem>
      ))}
    </NextSelect>
  );
}
