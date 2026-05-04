import React, { useState } from "react";
import styles from "../TransactionDetailModal.module.css";

interface InfoSectionProps {
  label: string;
  text?: string;
  defaultText?: string;
}

export const InfoSection: React.FC<InfoSectionProps> = ({
  label,
  text,
  defaultText = "Məlumat yoxdur.",
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const content = text || defaultText;
  const isLong = content.length > 80;

  return (
    <div className={styles.notesContainer}>
      <span className={styles.label}>{label}:</span>
      <div className={styles.notesContent}>
        <p
          className={
            isExpanded ? styles.textExpanded : styles.textCollapsed
          }
        >
          {content}
        </p>
        {isLong && (
          <button
            className={styles.readMoreBtn}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Qısalt" : "..."}
          </button>
        )}
      </div>
    </div>
  );
};