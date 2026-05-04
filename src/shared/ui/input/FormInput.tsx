import { useState, forwardRef } from "react";
import styles from "./FormInput.module.css";
import type { FormInputProps } from "@/shared/types";
import { EyeIcon, EyeSlashIcon, XMarkIcon } from "@heroicons/react/24/outline";

const FormInput = forwardRef<HTMLInputElement, FormInputProps & { onBlur?: () => void }>(
  (
    {
      label,
      type,
      id,
      placeholder,
      value,
      onChange,
      onBlur,
      onFocus,
      onClick,
      onKeyDown,
      onClear,
      register,
      required = false,
      className = "",
      disabled = false,
      readOnly,
      icon,
      error,
      labelClassName = "",
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const inputType = type === "password" && showPassword ? "text" : type || "text";

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const showClearButton = onClear && value && !disabled && !readOnly;

    return (
      <div className={styles.formGroup}>
        {label ? (
          <label htmlFor={id} className={`${styles.label} ${labelClassName}`}>
            {label}
            {required && <span className="required-star">*</span>}
          </label>
        ) : null}

        <div
          className={styles.inputContainer}
          style={{ position: "relative", display: "flex", alignItems: "center" }}
        >
          {icon && (
            <div
              className={styles.iconWrapper}
              style={{
                position: "absolute",
                left: "10px",
                display: "flex",
                alignItems: "center",
                pointerEvents: "none",
                zIndex: 1,
              }}
            >
              {icon}
            </div>
          )}

          <input
            type={inputType}
            id={id}
            placeholder={placeholder}
            {...(register
              ? register
              : {
                  ref: ref,
                  value: value || "",
                  onChange: (e) => {
                    if (!readOnly && onChange) {
                      onChange(e.target.value);
                    }
                  },
                  onBlur: onBlur,
                  onFocus: onFocus,
                  onClick: onClick,
                  onKeyDown: onKeyDown,
                })}
            className={`${styles.input} ${className} ${error ? "error" : ""}`}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            {...(readOnly ? { readOnly: true } : {})}
            style={{
              paddingLeft: icon ? "38px" : "10px",
              paddingRight: type === "password" || showClearButton ? "40px" : "10px",
            }}
          />

          {type === "password" && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className={styles.eyeButton}
              style={{
                position: "absolute",
                right: "10px",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#6b7280",
              }}
            >
              {showPassword ? <EyeIcon width={20} /> : <EyeSlashIcon width={20} />}
            </button>
          )}

          {showClearButton && type !== "password" && (
            <button
              type="button"
              onClick={onClear}
              className={styles.clearButton}
              style={{
                position: "absolute",
                right: "10px",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#9ca3af",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "2px",
                borderRadius: "50%",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#4b5563")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#9ca3af")}
            >
              <XMarkIcon width={18} />
            </button>
          )}
        </div>
        {error && (
          <span id={`${id}-error`} className={styles.errorMessage} role="alert">
            {error}
          </span>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;
