import React, { useState, useRef } from 'react';
import styles from './ActionButtons.module.css';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import type { Option } from '@/shared/types';
import { IconButton } from '@/shared/ui';
import { useClickOutside } from '@/shared/lib/hooks';

interface OperationsButtonProps {
  options: Option[];
  value?: Option | null;
  onChange: (value: Option) => void;
  className?: string;
}

const OperationsButton: React.FC<OperationsButtonProps> = ({ options, onChange, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setIsOpen(false), isOpen);

  const handleOptionClick = (option: Option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className={styles.operationsWrapper} ref={dropdownRef}>
      <IconButton 
        icon={EllipsisVerticalIcon}
        onClick={() => setIsOpen(!isOpen)}
        title="Əməliyyatlar"
        variant="default"
        className={className}
      />
      
      {isOpen && (
        <div className={styles.dropdown}>
          {options.map((option) => (
            <button
              key={option.id}
              className={styles.dropdownItem}
              onClick={() => handleOptionClick(option)}
            >
              {option.fullName}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default OperationsButton;