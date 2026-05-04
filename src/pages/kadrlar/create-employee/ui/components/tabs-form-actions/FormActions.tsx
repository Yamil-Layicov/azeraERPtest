import React, { type ReactNode } from "react";
import { Button } from "@/shared/ui";
import styles from "./FormActions.module.css";

export interface FormActionButton {
  label: string;
  variant: "primary" | "secondary" | "outline";
  onClick: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
}

export interface FormActionsProps {
  buttons: FormActionButton[];
  className?: string;
  children?: ReactNode;
}

const FormActions: React.FC<FormActionsProps> = ({ buttons, className, children }) => {
  return (
    <div className={`${styles.formFooter} ${className || ""}`}>
      {children && <div className={styles.footerCheckboxes}>{children}</div>}
      <div className={styles.footerButtons}>
        {buttons.map((button, index) => (
          <Button
            key={index}
            type={button.type || "button"}
            variant={button.variant}
            onClick={button.onClick}
            disabled={button.disabled}
            className={styles.actionBtn}
          >
            {button.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default FormActions;

