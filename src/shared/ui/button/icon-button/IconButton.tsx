import React from 'react';
import styles from './IconButton.module.css';

interface IconButtonProps {
  icon: React.ElementType;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  title?: string;
  type?: "button" | "submit" | "reset";
  variant?: 'default' | 'primary';
}

const IconButton: React.FC<IconButtonProps> = ({
  icon: Icon,
  onClick,
  className = '',
  disabled = false,
  title,
  type = "button",
  variant = 'default'
}) => {
  return (
    <button
      type={type}
      className={`${styles.button} ${styles[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      title={title}
    >
      <Icon className={styles.icon} />
    </button>
  );
};

export default IconButton;