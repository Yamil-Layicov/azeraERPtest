import React from 'react';
import styles from './ViewToggle.module.css';

interface ViewToggleProps {
  value: 'chart' | 'table';
  onChange: (value: 'chart' | 'table') => void;
  className?: string;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ value, onChange, className = '' }) => {
  const isChecked = value === 'table';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked ? 'table' : 'chart');
  };

  return (
    <label className={`${styles.switch} ${className}`}>
      <input 
        type="checkbox" 
        className={styles.checkbox}
        checked={isChecked}
        onChange={handleChange}
      />
      <span className={styles.label}>Qrafik</span>
      <span className={styles.label}>Cədvəl</span>
    </label>
  );
};

export default ViewToggle;