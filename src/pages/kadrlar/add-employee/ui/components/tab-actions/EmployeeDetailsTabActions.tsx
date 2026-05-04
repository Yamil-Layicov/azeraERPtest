import React from "react";
import { Button } from "@/shared/ui";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import styles from "./EmployeeDetailsTabActions.module.css";
// import { useAddEmployeeStore } from "@/features/kadrlar/create-worker/model/useAddEmployeeStore";

interface EmployeeDetailsTabActionsProps {
  currentStep: number;
  totalSteps: number;
  onPrev: () => void;
  onSaveAndNext: () => void;
  isDirty?: boolean;
  nextLabel?: string;
  disablePrimary?: boolean;
  hidePrimary?: boolean;
}

export const EmployeeDetailsTabActions: React.FC<EmployeeDetailsTabActionsProps> = ({
  currentStep,
  totalSteps,
  onPrev,
  onSaveAndNext,
  isDirty = false,
  nextLabel,
  disablePrimary = false,
  hidePrimary = false,
}) => {
  
  const showPrev = currentStep > 1;
  const isLast = currentStep >= totalSteps;

  let primaryLabel = "Növbəti";

  if (isLast) {
    primaryLabel = "Təsdiqlə";
  } else if (currentStep === 1) {
    primaryLabel = isDirty ? "Yadda saxla & Növbəti" : "Növbəti";
  } else if (currentStep === 2 || currentStep === 3 || currentStep === 4 || currentStep === 5 || currentStep === 6) {
    primaryLabel = "Növbəti";
  } else {
    primaryLabel = "Növbəti";
  }

  if (nextLabel) {
    primaryLabel = nextLabel;
  }

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
        {!hidePrimary && (
          <Button
            variant="primary"
            onClick={onSaveAndNext}
            className={styles.actionButton}
            disabled={disablePrimary}
          >
            <span className={styles.buttonContent}>
              {primaryLabel}
              {!isLast && <ArrowRightIcon className={styles.icon} />}
            </span>
          </Button>
        )}
      </div>
    </div>
  );
};
