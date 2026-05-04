import React from 'react';
import styles from './TableToolbar.module.css';

interface TableToolbarProps {
  children: React.ReactNode;
  className?: string;
}

const TableToolbar: React.FC<TableToolbarProps> = ({ children, className = '' }) => {
  return (
    <div className={`${styles.container} ${className}`}>
      {children}
    </div>
  );
};

export default TableToolbar;