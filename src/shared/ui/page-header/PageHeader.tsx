import React from "react";
import styles from "./PageHeader.module.css";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  children,
  className = "",
}) => {
  return (
    <div className={`${styles.header} ${className}`}>
      <div className={styles.titleWrapper}>
        <h1 className={styles.title}>{title}</h1>
        {description && <p className={styles.description}>{description}</p>}
      </div>
      {children && <div className={styles.actions}>{children}</div>}
    </div>
  );
};

export default PageHeader;
