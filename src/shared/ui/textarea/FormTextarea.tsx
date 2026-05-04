import React from "react";
import styles from "./FormTextarea.module.css";
import type { FormTextareaProps } from "@/shared/types";

const FormTextarea: React.FC<FormTextareaProps> = ({
  label,
  id,
  placeholder,
  value,
  onChange,
  required = false,
  className = "",
  disabled = false,
  rows = 4,
  labelClassName = "",
  error,
}) => {
  return (
    <div className={styles.formGroup}>
      {label && (
        <label htmlFor={id} className={labelClassName}>
          {label}
          {required && <span className="required-star">*</span>}
        </label>
      )}
      <textarea
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${styles.textarea} ${className} ${error ? "error" : ""}`}
        disabled={disabled}
        rows={rows}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <span id={`${id}-error`} className={styles.errorMessage} role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

export default FormTextarea;
