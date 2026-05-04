import React from "react";
import { FormInput } from "@/shared/ui";

interface PasswordInputFieldProps {
  label: string;
  id: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  autoComplete?: string;
  disabled?: boolean;
}

export const PasswordInputField: React.FC<PasswordInputFieldProps> = ({
  label,
  id,
  placeholder,
  value,
  onChange,
  error,
  autoComplete = "new-password",
  disabled = false,
}) => {

  return (
    <div style={{ position: "relative" }}>
      <FormInput
        label={label}
        id={id}
        type="password"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        disabled={disabled}
      />
      
     
      {error && (
        <span style={{ color: "#d20606", fontSize: "0.875rem", marginTop: "0.25rem", display: "block" }}>
          {error}
        </span>
      )}
    </div>
  );
};