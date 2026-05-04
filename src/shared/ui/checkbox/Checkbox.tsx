import React from 'react';
import styles from './Checkbox.module.css';

interface CheckboxProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({
  id,
  checked,
  onChange,
  label,
  className = '',
  disabled = false,
}) => {
  return (
    <div className={`${styles.checkboxItemWrapper} ${className}`}>
      <div className={styles.checkboxWrapper}>
        <input
          type="checkbox"
          id={id}
          className={styles.hiddenInput}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
        <label htmlFor={id} className={styles.checkBox}></label>
      </div>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
    </div>
  );
};

export default Checkbox;