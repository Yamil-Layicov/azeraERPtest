import React from "react";
import { CheckIcon } from "@heroicons/react/24/solid";
import styles from "./StatusStepper.module.css";
import { STEPS } from "./consts"; 

interface StatusStepperProps {
  currentStep: number;
  maxReachedStep?: number;
  onStepChange?: (stepId: number) => void;
  maxClickableStep?: number;
}

export const StatusStepper: React.FC<StatusStepperProps> = ({
  currentStep,
  maxReachedStep,
  onStepChange,
  maxClickableStep,
}) => {
  const isStepClickable = (stepId: number) => {
    if (!onStepChange) return false;
    if (maxClickableStep != null) return stepId <= maxClickableStep;
    return true;
  };

  return (
    <div className={styles.container}>
      {STEPS.map((step, index) => {
        const effectiveMax = maxReachedStep ?? currentStep;
        const isActive = step.id === currentStep;
        const isCompleted = step.id < effectiveMax && step.id !== currentStep;
        const isFuture = step.id >= effectiveMax && step.id !== currentStep;
        const clickable = isStepClickable(step.id);
        const isConnectorCompleted = step.id < effectiveMax;
        
        let wrapperClass = styles.stepWrapper;
        if (isActive) wrapperClass += ` ${styles.active}`;
        if (isCompleted) wrapperClass += ` ${styles.past}`;
        if (isFuture) wrapperClass += ` ${styles.future}`;
        const connectorClass = `${styles.connector} ${isConnectorCompleted ? styles.connectorCompleted : ""}`;

        return (
          <React.Fragment key={step.id}>
            <div
              className={wrapperClass}
              onClick={() => clickable && onStepChange?.(step.id)}
              style={{ cursor: clickable ? "pointer" : "default" }}
              role="button"
              aria-pressed={isActive}
              aria-disabled={!clickable}
              aria-label={step.label}
            >
              {index < STEPS.length - 1 && (
                 <div className={connectorClass} />
              )}
              
              <div className={styles.stepContent}>
                <div className={styles.circle}>
                   {isActive ? (
                     <div className={styles.innerCircle} />
                   ) : isCompleted ? (
                     <CheckIcon className={styles.checkIcon} />
                   ) : null}
                </div>
                <span className={styles.stepLabel}>{step.label}</span>
              </div>
            </div>
            
          </React.Fragment>
        );
      })}
    </div>
  );
};