import React from "react";
import styles from "./EmptyState.module.css";

const DEFAULT_TITLE = "Məlumat yoxdur";
const DEFAULT_DESCRIPTION =
  "Əlavə etmək üçün yuxarıdakı xanaları doldurun və «Əlavə et» düyməsinə klik edin.";

export interface EmptyStateProps {
  title?: string;
  description?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
}) => (
  <div className={styles.emptyState}>
    <span className={styles.emptyTitle}>{title}</span>
    <span>{description}</span>
  </div>
);
