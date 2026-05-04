import React from 'react';
import styles from './TableRowActions.module.css';

interface TableRowActionsProps {
  children: React.ReactNode;
  className?: string;
}

const TableRowActions: React.FC<TableRowActionsProps> = ({ children, className = '' }) => {
  return (
    <div className={`${styles.rowActions} ${className}`}>
      {children}
    </div>
  );
};

export default TableRowActions;