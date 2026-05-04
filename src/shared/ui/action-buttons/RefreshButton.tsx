import React from 'react';
import styles from './ActionButtons.module.css';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

interface RefreshButtonProps {
  onClick: () => void;
}

const RefreshButton: React.FC<RefreshButtonProps> = ({ onClick }) => {
  return (
    <button className={styles.actionButton} onClick={onClick} title="Yenilə">
      <ArrowPathIcon className={styles.icon} />
    </button>
  );
};

export default RefreshButton;