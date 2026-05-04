import React from "react";
import styles from "./StatusBadge.module.css";

export type StatusVariant = 
  | "success"   
  | "warning"   
  | "danger"    
  | "neutral"   
  | "primary"
  | "info"
  | "orange"
  | "purple";

interface StatusBadgeProps {
  label: string;
  variant?: StatusVariant;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  label, 
  variant = "neutral", 
  className = "" 
}) => {
  return (
    <span className={`${styles.badge} ${styles[variant]} ${className}`}>
      {label}
    </span>
  );
};

export default StatusBadge;