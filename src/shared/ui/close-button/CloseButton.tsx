import React from 'react';
import styles from './CloseButton.module.css';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface CloseButtonProps {
  onClick: () => void;
  className?: string;
  ariaLabel?: string;
}

const CloseButton: React.FC<CloseButtonProps> = ({ 
  onClick, 
  className = '',
  ariaLabel = 'Bağla'
}) => {
  return (
    <button
      type="button"
      className={`${styles.closeButton} ${className}`}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <XMarkIcon className={styles.closeIcon} />
    </button>
  );
};

export default CloseButton;