import React from "react";
import styles from "./FormLabel.module.css";

interface FormLabelProps {
  label: string;
  required?: boolean;
  htmlFor?: string;
  className?: string;
}

export const FormLabel: React.FC<FormLabelProps> = ({
  label,
  required = false,
  htmlFor,
  className = "",
}) => {
  return (
    <label htmlFor={htmlFor} className={`${styles.label} ${className}`}>
      {label}
      {required && <span className="required-star">*</span>}
    </label>
  );
};
