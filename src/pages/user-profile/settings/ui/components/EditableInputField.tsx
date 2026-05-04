import React from "react";
import { PencilIcon, CheckCircleIcon } from "@heroicons/react/24/solid";
import styles from "./EditableInputField.module.css";
import { ButtonSpinner } from "@/shared/ui";

interface EditableInputFieldProps {
  label: string;
  value: string;
  onEdit: () => void;
  onVerify?: () => void;
  isVerified?: boolean;
  placeholder?: string;
  isLoading?: boolean;
}

export const EditableInputField: React.FC<EditableInputFieldProps> = ({
  label,
  value,
  onEdit,
  onVerify,
  isVerified,
  placeholder = "-",
  isLoading = false,
}) => {
  return (
    <div className={styles.container}>
      <label className={styles.label}>{label}</label>
      <div className={styles.inputWrapper}>
        <div className={styles.valueArea}>
          <span className={styles.valueText}>
            {value || placeholder}
          </span>
          {isVerified && value && (
            <CheckCircleIcon className={styles.verifiedIcon} />
          )}
        </div>
        <button
          type="button"
          className={styles.editButton}
          onClick={onEdit}
          title={`${label} redaktə et`}
          disabled={isLoading}
        >
          <PencilIcon className={styles.editIcon} />
        </button>
        {!isVerified && onVerify && value && (
          <button
            type="button"
            className={styles.verifyButton}
            onClick={onVerify}
            title={`${label} təsdiqlə`}
            disabled={isLoading}
          >
            {isLoading ? (
              <ButtonSpinner color="var(--primary-color)" />
            ) : (
              "Təsdiqlə"
            )}
          </button>
        )}
      </div>
    </div>
  );
};
