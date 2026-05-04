import React from 'react';
import styles from './SuccessModal.module.css';
import type { SuccessModalProps } from '@/shared/types';
import { CloseButton } from '@/shared/ui/close-button';
import { Button } from '@/shared/ui/button';

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  title = "Əməliyyat uğurlu oldu",
  text,
  buttonText = "Tamam",
  primaryButtonText,
  secondaryButtonText,
  onPrimaryAction,
  onSecondaryAction,
}) => {
  if (!isOpen) return null;

  const hasTwoButtons = primaryButtonText && secondaryButtonText && onPrimaryAction && onSecondaryAction;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <CloseButton className={styles.closeButton} onClick={onClose} />
        
        <div className={`${styles.iconWrapper} ${styles.successIconWrapper}`}>
          <svg className={styles.modalIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        
        <h2 className={styles.modalTitle}>{title}</h2>
        {text && <p className={styles.modalText}>{text}</p>}
        
        {hasTwoButtons ? (
          <div className={styles.buttonGroup}>
            <Button 
              type="button" 
              variant="secondary"
              onClick={onSecondaryAction}
            >
              {secondaryButtonText}
            </Button>
            <Button 
              type="button" 
              variant="primary"
              onClick={onPrimaryAction}
            >
              {primaryButtonText}
            </Button>
          </div>
        ) : (
          <Button 
            type="button" 
            variant="primary"
            onClick={onClose}
          >
            {buttonText}
          </Button>
        )}
      </div>
    </div>
  );
};

export default SuccessModal;