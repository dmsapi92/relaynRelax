import {
  type CalendarDate,
  parseDate as parseCalendarDate,
} from "@internationalized/date";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Checkbox,
  DatePicker,
  Input as NextInput,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
  Slider,
  Switch,
  Textarea,
} from "@nextui-org/react";
import { motion } from "framer-motion";
import { Star, Upload } from "lucide-react";
import type { ReactNode } from "react";
import React, { useEffect, useRef, useState } from "react";

export interface FormField {
  id: string;
  name: string;
  label: string;
  type:
    | "text"
    | "tel"
    | "url"
    | "email"
    | "number"
    | "dropdown"
    | "password"
    | "file"
    | "date"
    | "time"
    | "radio"
    | "checkbox"
    | "select"
    | "month"
    | "multi_select"
    | "datetime-local"
    | "switch"
    | "image"
    | "video"
    | "audio"
    | "link"
    | "rating"
    | "range"
    | "color"
    | "boolean"
    | "date_time"
    | "date_range"
    | "time_range"
    | "button"
    | "textarea"
    | "autocomplete";
  placeholder?: string;
  required?: boolean;
  readOnly?: boolean;
  defaultValue?: string;
  step?: string;
  section?: string;
  gridSpan?: "full";
  options?: { label: string; value: string }[];
  icon?: any;
  accept?: string;
  maxSize?: number;
  min?: number;
  max?: number;
  // Button specific props
  buttonProps?: {
    variant?:
      | "flat"
      | "solid"
      | "bordered"
      | "light"
      | "faded"
      | "shadow"
      | "ghost";
    color?:
      | "default"
      | "primary"
      | "secondary"
      | "success"
      | "warning"
      | "danger";
    size?: "sm" | "md" | "lg";
    isIconOnly?: boolean;
    radius?: "none" | "sm" | "md" | "lg" | "full";
    onClick?: () => void;
  };
  // Switch specific props
  switchContent?: {
    icon?: React.ReactNode;
    trueState: {
      stateIcon?: React.ReactNode;
      text: string;
      label: string;
    };
    falseState: {
      stateIcon?: React.ReactNode;
      text: string;
      label: string;
    };
  };
  // Textarea specific props
  textareaProps?: {
    minRows?: number;
    maxRows?: number;
    disableAutosize?: boolean;
    maxLength?: number;
  };

  // Autocomplete specific props
  autocompleteProps?: {
    items?: { label: string; value: string }[];
    defaultItems?: { label: string; value: string }[];
    allowsCustomValue?: boolean;
    onSelectionChange?: (key: string) => void;
    onInputChange?: (value: string) => void;
  };
}

interface FormFieldComponentProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "onChange"> {
  field: FormField;
  defaultValue?: string;
  value?: string;
  selectedOptions?: string[];
  onChange?: (value: string | string[]) => void;
  onFileChange?: (file: File) => void;
  // Additional form field props
  label?: string;
  name?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  description?: string;
  size?: "sm" | "md" | "lg";
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
  variant?: "flat" | "bordered" | "faded" | "underlined";
  radius?: "none" | "sm" | "md" | "lg" | "full";
  labelPlacement?: "inside" | "outside" | "outside-left";
}

function FileUploadField({
  title,
  isCirculer = false,
  field,
  onChange,
  value,
}: {
  field: FormField;
  onChange?: (file: File) => void;
  value?: string | File;
  title?: string;
  isCirculer?: boolean;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value) {
      if (value instanceof File) {
        const objectUrl = URL.createObjectURL(value);
        setPreview(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
      } else if (typeof value === "string") {
        const absolutePath = value.startsWith("/") ? value : `/${value}`;
        setPreview(absolutePath);
      }
    }
  }, [value]);

  const processFile = (file: File) => {
    if (field.maxSize && file.size > field.maxSize) {
      setError(
        `File size must be less than ${field.maxSize / (1024 * 1024)}MB`
      );
      return false;
    }
    if (field.accept) {
      const acceptedTypes = field.accept.split(",").map((type) => {
        // Convert file extensions to MIME types
        if (type.startsWith(".")) {
          switch (type.toLowerCase()) {
            case ".pdf":
              return "application/pdf";
            case ".doc":
              return "application/msword";
            case ".docx":
              return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            case ".txt":
              return "text/plain";
            case ".jpg":
            case ".jpeg":
              return "image/jpeg";
            case ".png":
              return "image/png";
            case ".xls":
              return "application/vnd.ms-excel";
            case ".xlsx":
              return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            case ".ppt":
              return "application/vnd.ms-powerpoint";
            case ".pptx":
              return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
            case ".csv":
              return "text/csv";
            case ".gif":
              return "image/gif";
            case ".zip":
              return "application/zip";
            case ".rar":
              return "application/x-rar-compressed";
            case ".7z":
              return "application/x-7z-compressed";
            default:
              return type;
          }
        }
        return type;
      });

      if (!acceptedTypes.some((type) => file.type.match(type))) {
        setError(`Invalid file type. Accepted types: ${field.accept}`);
        return false;
      }
    }

    // Create a new File object with the correct type
    const newFile = new File([file], file.name, {
      type: file.type,
      lastModified: file.lastModified,
    });

    // Create preview URL
    const objectUrl = URL.createObjectURL(newFile);
    setPreview(objectUrl);
    setError(null);

    // Update the hidden input with the file
    if (fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(newFile);
      fileInputRef.current.files = dataTransfer.files;
    }

    onChange?.(newFile);
    return true;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-foreground mb-1">
        {field.label}
        {field.required && <span className="text-danger">*</span>}
      </label>

      {isCirculer ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative overflow-hidden rounded-full aspect-square max-w-[240px] mx-auto
            transition-all duration-300 ease-in-out transform cursor-pointer
            ${isDragging ? "scale-105 ring-4 ring-primary" : "scale-100"}
            ${
              error
                ? "ring-4 ring-danger"
                : "ring-2 ring-divider hover:ring-primary"
            }
            ${preview ? "" : "bg-default-100"}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            name={field.name}
            accept={field.accept}
            onChange={handleFileChange}
            className="hidden"
          />

          {preview ? (
            <div className="relative w-full h-full group">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover rounded-full"
              />
              <div
                className="absolute inset-0 bg-foreground/50 opacity-0 group-hover:opacity-100 
                transition-all duration-300 rounded-full flex items-center justify-center"
              >
                <p className="text-background text-sm font-medium">
                  Click or drag to replace
                </p>
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
              <Upload
                className={`w-10 h-10 ${
                  isDragging ? "text-primary" : "text-default-400"
                }`}
              />
              <div className="text-sm text-center mt-2">
                <p className="font-medium text-foreground">
                  {title || "Drop your photo here"}
                  <span className="block text-xs text-foreground-500 mt-1">
                    or click to browse
                  </span>
                </p>
                {field.maxSize && (
                  <p className="text-xs text-foreground-400 mt-2">
                    PNG, JPG up to {field.maxSize / (1024 * 1024)}MB
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <NextInput
              ref={fileInputRef}
              type="file"
              name={field.name}
              accept={field.accept}
              onChange={handleFileChange}
              className="flex-1"
              size="sm"
              placeholder={title || "Choose a file"}
              startContent={<Upload className="w-4 h-4 text-default-400" />}
              endContent={
                preview && (
                  <div className="flex items-center gap-2">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-6 h-6 object-cover rounded"
                    />
                  </div>
                )
              }
            />
          </div>
          {field.maxSize && (
            <p className="text-xs text-foreground-400">
              Maximum file size: {field.maxSize / (1024 * 1024)}MB
            </p>
          )}
        </div>
      )}

      {error && <p className="mt-2 text-sm text-danger text-center">{error}</p>}
    </div>
  );
}

interface Option {
  label: string;
  value: string;
}

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  type?: string;
  error?: string;
  className?: string;
  options?: { label: string; value: string }[];
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

// Add this helper function at the top level
const formatDateForInput = (
  date: string | undefined
): CalendarDate | undefined => {
  if (!date) return undefined;
  try {
    if (date.includes("T")) {
      date = date.split("T")[0];
    }
    return parseCalendarDate(date);
  } catch {
    return undefined;
  }
};

// Add this helper function at the top level
const renderLabel = (label: string, required?: boolean) => (
  <label className="block text-sm font-medium text-foreground mb-1">
    {label}
    {required && <span className="text-danger">*</span>}
  </label>
);

const renderIcon = (
  Icon: React.ComponentType<any> | undefined,
  startContent?: React.ReactNode
) => {
  return (
    startContent ||
    (Icon && (
      <Icon className="w-4 h-4 text-default-400 pointer-events-none flex-shrink-0" />
    ))
  );
};

export function FormFieldComponent({
  field,
  value,
  selectedOptions,
  onChange,
  onFileChange,
  // Additional props with defaults
  defaultValue = field.defaultValue,
  label = field.label,
  name = field.name,
  placeholder = field.placeholder,
  required = field.required,
  disabled = field.readOnly,
  readOnly = field.readOnly,
  error,
  helperText,
  className,
  startContent,
  endContent,
  description,
  size = "md",
  color = "default",
  variant = "bordered",
  radius = "sm",
  labelPlacement = "inside",
  ...props
}: FormFieldComponentProps) {
  const [isTouched, setIsTouched] = useState(false);
  const showError = Boolean(error && (isTouched || value));

  // Common props for input-like components
  const commonInputProps = {
    id: field.id,
    name,
    label,
    placeholder,
    value,
    isDisabled: disabled,
    isReadOnly: readOnly,
    isRequired: required,
    errorMessage: showError ? error : undefined,
    description: description || helperText,
    className,
    size,
    color,
    variant,
    radius,
    labelPlacement,
    startContent: renderIcon(field.icon, startContent),
    endContent,
    isInvalid: showError,
    onBlur: () => setIsTouched(true),
  };

  // Common props for date/time inputs
  const commonDateTimeProps = {
    isRequired: required,
    isDisabled: disabled,
    className: "flex-1",
  };

  let formField: React.ReactNode;

  switch (field.type) {
    case "file":
    case "image":
    case "video":
    case "audio":
      formField = (
        <FileUploadField
          field={field}
          onChange={onFileChange}
          value={defaultValue}
          isCirculer={field.type === "image"}
          title={
            field.type === "image"
              ? "Upload your photo"
              : field.type === "video"
              ? "Upload video file"
              : field.type === "audio"
              ? "Upload audio file"
              : "Upload file"
          }
        />
      );
      break;

    case "dropdown":
    case "multi_select":
      const isMultiSelect = field.type === "multi_select";
      formField = (
        <Select
          id={field.id}
          name={name}
          label={label}
          selectedKeys={
            value
              ? isMultiSelect
                ? new Set(
                    Array.isArray(value)
                      ? value
                      : typeof value === "string"
                      ? value.split(",")
                      : [value]
                  )
                : new Set([value])
              : undefined
          }
          defaultSelectedKeys={
            defaultValue
              ? isMultiSelect
                ? new Set(
                    Array.isArray(defaultValue)
                      ? defaultValue
                      : typeof defaultValue === "string"
                      ? defaultValue.split(",")
                      : [defaultValue]
                  )
                : new Set([defaultValue])
              : undefined
          }
          placeholder={placeholder}
          isRequired={required}
          isDisabled={disabled}
          onSelectionChange={(keys) => {
            if (isMultiSelect) {
              const selectedValues = Array.from(keys as Set<string>);
              onChange?.(selectedValues);
            } else {
              const selectedValue = Array.from(keys as Set<string>)[0];
              onChange?.(selectedValue);
            }
            setIsTouched(true);
          }}
          onBlur={() => setIsTouched(true)}
          className={className}
          radius="sm"
          startContent={renderIcon(field.icon, startContent)}
          errorMessage={error}
          selectionMode={isMultiSelect ? "multiple" : "single"}
          variant="bordered"
          classNames={{
            trigger: "min-h-unit-12 py-2",
          }}
        >
          {field.options?.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              textValue={option.label}
            >
              {option.label}
            </SelectItem>
          )) ?? []}
        </Select>
      );
      break;

    case "select":
      if (defaultValue != null) {
        field.defaultValue = defaultValue;
      }
      const [selectedValue, setSelectedValue] = useState<string | null>(null);
      if (field.defaultValue != selectedValue && selectedValue == null) {
        setSelectedValue(field!.defaultValue!);
      }
      const onSelectionChange = (key: React.Key | null) => {
        setSelectedValue(key as string);
        onChange?.(key as string);
      };

      formField = (
        <>
          <input
            type="hidden"
            id={field.id}
            name={field.name}
            defaultValue={defaultValue || "NN"}
            value={selectedValue || "NN"}
          />

          <Autocomplete
            id={field.id}
            // name={name}
            label={label}
            selectedKey={value}
            value={value}
            defaultItems={field.options}
            defaultSelectedKey={defaultValue}
            placeholder={placeholder}
            isRequired={required}
            isDisabled={disabled}
            onSelectionChange={onSelectionChange}
            onBlur={() => setIsTouched(true)}
            className={className}
            radius="sm"
            startContent={renderIcon(field.icon, startContent)}
            errorMessage={error}
            variant="bordered"
          >
            {field.options?.map((option) => (
              <AutocompleteItem
                key={option.value}
                value={option.value}
                textValue={option.label}
              >
                {option.label}
              </AutocompleteItem>
            )) ?? []}
          </Autocomplete>
        </>
      );
      break;

    case "date":
      formField = (
        <DatePicker
          {...commonInputProps}
          value={formatDateForInput(value)}
          defaultValue={formatDateForInput(defaultValue)}
          onChange={(date: CalendarDate | null) => {
            onChange?.(date ? date.toString() : "");
          }}
        />
      );
      break;

    case "date_range":
    case "time_range":
      const [start, end] = value ? value.split(",") : ["", ""];
      const isDate = field.type === "date_range";
      formField = (
        <div className="w-full space-y-2">
          {renderLabel(label, required)}
          <div className="flex gap-4">
            <NextInput
              {...commonDateTimeProps}
              id={`${field.id}-start`}
              type={isDate ? "date" : "time"}
              label={isDate ? "Start Date" : "Start Time"}
              value={start}
              onChange={(e) => {
                onChange?.([e.target.value, end].join(","));
              }}
            />
            <NextInput
              {...commonDateTimeProps}
              id={`${field.id}-end`}
              type={isDate ? "date" : "time"}
              label={isDate ? "End Date" : "End Time"}
              value={end}
              onChange={(e) => {
                onChange?.([start, e.target.value].join(","));
              }}
            />
          </div>
        </div>
      );
      break;

    case "date_time":
      const [dateStr, timeStr] = value ? value.split("T") : ["", ""];
      formField = (
        <div className="w-full space-y-2">
          {renderLabel(label, required)}
          <div className="flex gap-4">
            <DatePicker
              {...commonInputProps}
              value={formatDateForInput(value)}
              defaultValue={formatDateForInput(defaultValue)}
              onChange={(date: CalendarDate | null) => {
                onChange?.(date ? date.toString() : "");
              }}
            />
            <NextInput
              {...commonInputProps}
              type="time"
              onChange={(e) => onChange?.(e.target.value)}
            />
          </div>
        </div>
      );
      break;

    case "time":
      formField = (
        <NextInput
          {...commonInputProps}
          type="time"
          onChange={(e) => onChange?.(e.target.value)}
        />
      );
      break;

    case "radio":
      formField = (
        <RadioGroup
          {...commonInputProps}
          value={value}
          onValueChange={onChange}
        >
          {field.options?.map((option, index) => (
            <Radio key={index} value={option.value}>
              {option.label}
            </Radio>
          ))}
        </RadioGroup>
      );
      break;
    case "checkbox":
      if (field.options?.length) {
        const selectedValues = value ? value.split(",").filter(Boolean) : [];
        formField = (
          <div>
            {renderLabel(label, required)}
            <div className="flex flex-col gap-2">
              {field.options.map((option, index) => (
                <Checkbox
                  key={index}
                  value={option.value}
                  isSelected={selectedValues.includes(option.value)}
                  onValueChange={(checked) => {
                    const newValues = checked
                      ? [...selectedValues, option.value]
                      : selectedValues.filter((v) => v !== option.value);
                    onChange?.(newValues.join(","));
                  }}
                  isDisabled={disabled}
                >
                  {option.label}
                </Checkbox>
              ))}
            </div>
          </div>
        );
      } else {
        // Single checkbox case
        const [isChecked, setIsChecked] = useState<boolean>(
          value === "true" || value === true || defaultValue === true
        );
        formField = (
          <Checkbox
            {...commonInputProps}
            isSelected={isChecked}
            onValueChange={(checked) => {
              setIsChecked(checked);
              onChange?.(checked.toString());
            }}
          >
            {label}
          </Checkbox>
        );
      }
      break;

    case "range":
      const minVal = field.min || 0;
      const maxVal = field.max || 100;
      const step = Number(field.step) || 1;
      const currentValue = Number(value) || minVal;
      const { id, label: ariaLabel, ...restCommonProps } = commonInputProps;
      const sliderProps = {
        id,
        "aria-label": ariaLabel,
        size: "sm" as const,
        step,
        minValue: minVal,
        maxValue: maxVal,
        value: currentValue,
        onChange: (val: number | number[]) => {
          if (typeof val === "number") {
            onChange?.(val.toString());
          }
        },
        color: (color === "default" ? "primary" : color) as
          | "primary"
          | "secondary"
          | "success"
          | "warning"
          | "danger"
          | "foreground",
        className: "max-w-md flex-1",
      };

      formField = (
        <div className="w-full px-2">
          {renderLabel(label, required)}
          <div className="flex items-center gap-4">
            <span className="text-sm">{minVal}</span>
            <Slider {...sliderProps} />
            <span className="text-sm">{maxVal}</span>
            <NextInput
              type="number"
              min={minVal}
              max={maxVal}
              step={step}
              value={currentValue.toString()}
              onChange={(e) => {
                const newVal = Math.min(
                  Math.max(Number(e.target.value), minVal),
                  maxVal
                );
                onChange?.(newVal.toString());
              }}
              className="w-20"
            />
          </div>
        </div>
      );
      break;

    case "rating":
      const maxRating = field.max || 5;
      const currentRating = parseInt(value || "0");
      formField = (
        <div className="w-full space-y-2">
          {renderLabel(label, required)}
          <div className="flex gap-1">
            {Array.from({ length: maxRating }).map((_, index) => (
              <Button
                key={index}
                size="sm"
                variant="light"
                isIconOnly
                onPress={() => !disabled && onChange?.((index + 1).toString())}
                isDisabled={disabled}
                className={
                  currentRating > index ? "text-warning" : "text-default-400"
                }
              >
                <Star
                  className="w-5 h-5"
                  fill={currentRating > index ? "currentColor" : "none"}
                />
              </Button>
            ))}
            {currentRating > 0 && (
              <span className="ml-2 text-sm text-foreground-500">
                {currentRating} of {maxRating}
              </span>
            )}
          </div>
        </div>
      );
      break;

    case "color":
      formField = (
        <div>
          {renderLabel(label, required)}
          <NextInput
            {...commonInputProps}
            type="color"
            onChange={(e) => onChange?.(e.target.value)}
          />
        </div>
      );
      break;

    case "link":
      formField = (
        <div className="flex gap-2 items-center">
          {renderIcon(field.icon, startContent)}
          <NextInput
            {...commonInputProps}
            type="url"
            endContent={
              value && (
                <Button
                  as="a"
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="sm"
                  variant="light"
                  color="primary"
                >
                  Visit
                </Button>
              )
            }
          />
        </div>
      );
      break;

    case "boolean":
      formField = (
        <Checkbox
          {...commonInputProps}
          isSelected={value === "true"}
          onValueChange={(checked) => onChange?.(checked.toString())}
        >
          {label}
        </Checkbox>
      );
      break;

    case "switch":
      formField = (
        <div>
          {/* {renderLabel(label, required)} */}
          <Switch
            {...commonInputProps}
            isSelected={value === "true"}
            onValueChange={(checked) => onChange?.(checked.toString())}
          >
            {label}
          </Switch>
        </div>
      );
      break;

    case "textarea":
      formField = (
        <Textarea
          {...commonInputProps}
          value={value}
          defaultValue={defaultValue}
          onChange={(e) => onChange?.(e.target.value)}
        />
      );
      break;

    case "autocomplete":
      formField = (
        <Autocomplete
          {...commonInputProps}
          items={field.autocompleteProps?.items || field.options || []}
          allowsCustomValue={field.autocompleteProps?.allowsCustomValue}
          selectedKey={value}
          onSelectionChange={(key) => {
            if (key && field.autocompleteProps?.onSelectionChange) {
              field.autocompleteProps.onSelectionChange(key.toString());
            }
            if (key) {
              onChange?.(key.toString());
            }
            setIsTouched(true);
          }}
          onInputChange={(value) => {
            if (field.autocompleteProps?.onInputChange) {
              field.autocompleteProps.onInputChange(value);
            }
          }}
          classNames={{
            base: "max-w-full",
            listbox: "max-h-[300px]",
            selectorButton: "max-w-full",
          }}
        >
          {(field.autocompleteProps?.items || field.options || []).map(
            (item) => (
              <AutocompleteItem key={item.value} value={item.value}>
                {item.label}
              </AutocompleteItem>
            )
          )}
        </Autocomplete>
      );
      break;

    case "text":
      formField = (
        <NextInput
          {...commonInputProps}
          type="text"
          defaultValue={defaultValue}
          onChange={(e) => onChange?.(e.target.value)}
        />
      );
      break;

    case "tel":
      formField = (
        <NextInput
          {...commonInputProps}
          type="text"
          defaultValue={defaultValue}
          // pattern="[+][0-9]{1,4}[0-9]{10}"
          onChange={(e) => {
            // Format phone number as user types
            let value = e.target.value.replace(/\D/g, ""); // Remove non-digits

            // If no country code and number starting, add +91 (India)
            if (!value.startsWith("91") && value.length > 0) {
              value = "91" + value;
            }

            // Format the number with country code and proper spacing
            if (value.length <= 12) {
              // 2 for country code + 10 for phone
              let formattedValue = "";

              // Add + for country code
              if (value.length > 0) {
                formattedValue = "+" + value.substring(0, 2); // Country code
              }

              // Add space after country code
              if (value.length > 2) {
                formattedValue += " ";

                // Format the actual phone number
                const phoneNumber = value.substring(2);

                // Format as per Indian number: +91 98765-43210
                if (phoneNumber.length > 0) {
                  formattedValue += phoneNumber.substring(0, 5);
                }
                if (phoneNumber.length > 5) {
                  formattedValue += "-" + phoneNumber.substring(5);
                }
              }

              onChange?.(formattedValue);
            }
          }}
          onBlur={(e) => {
            setIsTouched(true);
            // Ensure number starts with +91 if empty or invalid
            if (!e.target.value.startsWith("+")) {
              onChange?.("+91 ");
            }
          }}
          onFocus={(e) => {
            // If empty, start with +91
            if (!e.target.value) {
              onChange?.("+91 ");
            }
          }}
          placeholder={placeholder || "+91 98765-43210"}
        />
      );
      break;

    case "month":
      const monthValue = defaultValue
        ? new Date(defaultValue).toISOString().slice(0, 7)
        : undefined;

      formField = (
        <NextInput
          {...commonInputProps}
          type="month"
          defaultValue={monthValue}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
        />
      );
      break;

    default:
      formField = (
        <NextInput
          {...commonInputProps}
          type={field.type}
          defaultValue={defaultValue}
          onChange={(e) => onChange?.(e.target.value)}
          {...props}
        />
      );
      break;
  }

  return (
    <motion.div
      whileHover={{ scale: readOnly ? 1 : 1.01 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="[&_input:-webkit-autofill]:!text-[#000] [&_input:-webkit-autofill]:!bg-white/5"
    >
      {formField}
    </motion.div>
  );
}
