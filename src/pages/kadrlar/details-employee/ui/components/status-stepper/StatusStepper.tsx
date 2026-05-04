import React from "react";
import { CheckIcon } from "@heroicons/react/24/solid";
import styles from "./StatusStepper.module.css";
import { STEPS } from "./consts"; 

interface StatusStepperProps {
  currentStep: number;
  onStepChange: (stepId: number) => void;
}


export const StatusStepper: React.FC<StatusStepperProps> = ({ 
  currentStep, 
  onStepChange 
}) => {
  return (
    <div className={styles.container}>
      {STEPS.map((step, index) => {
        const isActive = step.id === currentStep;
        const isCompleted = step.id < currentStep; 
        let wrapperClass = styles.stepWrapper;
        if (isActive) wrapperClass += ` ${styles.active}`;
        if (isCompleted) wrapperClass += ` ${styles.past}`;
        const connectorClass = `${styles.connector} ${isCompleted ? styles.connectorCompleted : ''}`;

        return (
          <React.Fragment key={step.id}>
            <div 
              className={wrapperClass} 
              onClick={() => onStepChange(step.id)}
              style={{ cursor: "pointer" }}
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