import { Input as NextInput } from "@nextui-org/react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { ReactNode, useState } from "react";

interface InputProps {
  id: string;
  name: string;
  type: "text" | "tel" | "url" | "email" | "number" | "password";
  label: string;
  placeholder?: string;
  required?: boolean;
  readOnly?: boolean;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  /** Icon or content to show before the input */
  startContent?: ReactNode;
  /** Icon or content to show after the input */
  endContent?: ReactNode;
  /** Additional classes for the input wrapper */
  wrapperClassName?: string;
}

export function Input({
  id,
  name,
  type,
  label,
  placeholder,
  required,
  readOnly,
  defaultValue,
  value,
  onChange,
  className = '',
  wrapperClassName = '',
  startContent,
  endContent,
}: InputProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasValue, setHasValue] = useState(!!value || !!defaultValue);
  const [isTouched, setIsTouched] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleChange = (value: string) => {
    setHasValue(!!value);
    setIsTouched(true);

    if (onChange) {
      onChange(value);
    }
  };

  const handleBlur = () => {
    setIsTouched(true);
  };

  const isInvalid = required && !hasValue && isTouched;
  const errorMessage = isInvalid ? `${label} is required` : "";

  const passwordEndContent = type === "password" ? (
    <button
      className="focus:outline-none"
      type="button"
      onClick={toggleVisibility}
    >
      {isVisible ? (
        <EyeOff className="w-4 h-4 text-default-400 pointer-events-none" />
      ) : (
        <Eye className="w-4 h-4 text-default-400 pointer-events-none" />
      )}
    </button>
  ) : null;

  return (
    <motion.div
      whileHover={{ scale: readOnly ? 1 : 1.01 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={`[&_input:-webkit-autofill]:!text-[#000] [&_input:-webkit-autofill]:!bg-white/5 ${wrapperClassName}`}
    >
      <NextInput
        id={id}
        name={name}
        type={type === "password" && isVisible ? "text" : type}
        label={label}
        placeholder={placeholder}
        isRequired={required}
        isReadOnly={readOnly}
        value={value || ''}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={handleBlur}
        errorMessage={errorMessage}
        isInvalid={isInvalid}
        startContent={startContent}
        endContent={type === "password" ? passwordEndContent : endContent}
        className={className}
        variant="flat"
        radius="sm"
      />
    </motion.div>
  );
} 