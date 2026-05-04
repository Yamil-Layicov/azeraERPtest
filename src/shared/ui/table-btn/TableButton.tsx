import React from 'react';
import styles from './TableButton.module.css';
import { 
  EyeIcon, 
  TrashIcon, 
  PrinterIcon, 
  CheckIcon,
  PencilSquareIcon
} from '@heroicons/react/24/outline';

export type TableButtonVariant = 'detail' | 'delete' | 'print' | 'approve' | 'edit';

export interface TableButtonProps {
  variant: TableButtonVariant;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  title?: string; 
}

const TableButton: React.FC<TableButtonProps> = ({
  variant,
  onClick,
  className = '',
  type = 'button',
  disabled = false,
  title
}) => {
  
  const getIcon = () => {
    switch (variant) {
      case 'detail':
        return <EyeIcon className={styles.icon} />;
      case 'delete':
        return <TrashIcon className={styles.icon} />;
      case 'print':
        return <PrinterIcon className={styles.icon} />;
      case 'approve':
        return <CheckIcon className={styles.icon} />;
      case 'edit':
        return <PencilSquareIcon className={styles.icon} />;
      default:
        return null;
    }
  };

  // Default title-lar təyin edirik (əgər prop kimi gəlməyibsə)
  const defaultTitles: Record<TableButtonVariant, string> = {
    detail: "Ətraflı bax",
    delete: "Sil",
    print: "Çap et",
    approve: "Təsdiqlə",
    edit: "Düzəliş et",
  };

  return (
    <button
      type={type}
      className={`${styles.tableButton} ${styles[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      title={title || defaultTitles[variant]}
    >
      {getIcon()}
    </button>
  );
};

export default TableButton;