"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface PhoneInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: string;
  onValueChange?: (value: string) => void;
}

const formatPhoneNumber = (value: string): string => {
  const phoneNumber = value.replace(/[^\d]/g, "");
  const phoneNumberLength = phoneNumber.length;

  if (phoneNumberLength < 4) return phoneNumber;
  if (phoneNumberLength < 7) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  }
  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
};

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, value, onValueChange, onChange, ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState(() => 
      value ? formatPhoneNumber(value) : ""
    );

    React.useEffect(() => {
      if (value !== undefined) {
        setDisplayValue(formatPhoneNumber(value));
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value;
      const rawValue = input.replace(/[^\d]/g, "");
      
      // Limit to 10 digits
      if (rawValue.length <= 10) {
        const formatted = formatPhoneNumber(rawValue);
        setDisplayValue(formatted);
        
        if (onValueChange) {
          onValueChange(rawValue);
        }
        
        if (onChange) {
          const syntheticEvent = {
            ...e,
            target: {
              ...e.target,
              value: rawValue,
              name: props.name || "",
            }
          };
          onChange(syntheticEvent);
        }
      }
    };

    return (
      <Input
        type="tel"
        placeholder="(123) 456-7890"
        className={cn(className)}
        ref={ref}
        value={displayValue}
        onChange={handleChange}
        {...props}
      />
    );
  }
);

PhoneInput.displayName = "PhoneInput";

export { PhoneInput };