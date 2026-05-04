import React from "react";
import { Button } from "@/shared/ui";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import styles from "./EmployeeDetailsTabActions.module.css";

interface EmployeeDetailsTabActionsProps {
  currentStep: number;
  totalSteps: number;
  onPrev: () => void;
  onSaveAndNext: () => void;
}

export const EmployeeDetailsTabActions: React.FC<EmployeeDetailsTabActionsProps> = ({
  currentStep,
  totalSteps,
  onPrev,
  onSaveAndNext,
}) => {
  const showPrev = currentStep > 1;
  const isLast = currentStep >= totalSteps;
  const primaryLabel = isLast ? "Yadda saxla" : "Növbəti";

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        {showPrev ? (
          <Button variant="outline" onClick={onPrev} className={`${styles.actionButton} ${styles.prevButton}`}>
            <span className={styles.buttonContent}>
              <ArrowLeftIcon className={styles.icon} />
              Əvvəlki
            </span>
          </Button>
        ) : null}
      </div>
      <div className={styles.right}>
        <Button
          variant="primary"
          onClick={onSaveAndNext}
          className={styles.actionButton}
        >
          <span className={styles.buttonContent}>
            {primaryLabel}
            {!isLast && <ArrowRightIcon className={styles.icon} />}
          </span>
        </Button>
      </div>
    </div>
  );
};
