import React from "react";
import styles from "../TransactionDetailModal.module.css"; 

interface DetailRowProps {
  label: React.ReactNode;
  value?: string | number;
  valueClassName?: string;
}

export const DetailRow: React.FC<DetailRowProps> = ({
  label,
  value,
  valueClassName,
}) => {
  return (
    <div className={styles.detailRow}>
      <span className={styles.label}>{label}:</span>
      <span className={`${styles.value} ${valueClassName || ""}`}>
        {value || "-"}
      </span>
    </div>
  );
};