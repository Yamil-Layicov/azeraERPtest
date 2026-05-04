import React from 'react';
import styles from './RadioSwitch.module.css';
import type { RadioSwitchProps } from '@/shared/types';

const RadioSwitch: React.FC<RadioSwitchProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  id,
  disabled = false,
}) => {

  return (
    <div 
      className={styles.formGroup} 
      role="radiogroup" 
      aria-labelledby={`${name}-group-label`}
      aria-disabled={disabled}
    >
      {label && (
        // DƏYİŞİKLİK: label -> span və id əlavə edildi
        <span id={`${name}-group-label`} className={styles.groupLabel}>
          {label}
        </span>
      )}
      
      <div className={`${styles.radioSwitch} ${disabled ? styles.disabled : ""}`}>
        
        {options.map((option) => (
          <React.Fragment key={option.value}>
            <input
              className={styles.radioSwitchInput}
              type="radio"
              name={name}
              id={id ? `${id}-${option.value}` : `${name}-${option.value}`}
              value={option.value}
              checked={value === option.value}
              disabled={disabled}
              onChange={(e) => onChange(e.target.value)}
            />
            <label 
              className={styles.radioSwitchLabel} 
              htmlFor={id ? `${id}-${option.value}` : `${name}-${option.value}`}
            >
              {option.label}
            </label>
          </React.Fragment>
        ))}
        
        <div className={styles.radioSwitchMarker}></div>

      </div>
    </div>
  );
};

export default RadioSwitch;