import React from 'react';
import styles from './Button.module.css';
import type { ButtonProps } from '@/shared/types';
import { ButtonSpinner } from '../loading';

const Button: React.FC<ButtonProps> = ({
  type,
  variant,
  children,
  onClick,
  disabled = false,
  isLoading = false,
  className,
  title,
  style,
}) => {
  const getSpinnerColor = () => {
    switch (variant) {
      case 'outline':
        return '#0b9489';
      case 'danger-ghost':
        return '#ef4444';
      case 'default':
      case 'clear':
        return '#374151';
      default:
        return '#ffffff';
    }
  };

  return (
    <button
      type={type}
      className={`${styles.button} ${styles[variant]} ${className || ''} ${isLoading ? styles.isLoading : ''}`}
      onClick={onClick}
      disabled={disabled || isLoading}
      title={title}
      style={style}
    >
      {isLoading ? <ButtonSpinner color={getSpinnerColor()} /> : children}
    </button>
  );
};

export default Button;
