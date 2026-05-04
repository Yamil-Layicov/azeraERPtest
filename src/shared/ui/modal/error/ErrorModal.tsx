import React from 'react';
import styles from './ErrorModal.module.css';
import type { ErrorModalProps } from '@/shared/types';
import { CloseButton } from '@/shared/ui/close-button';
import { Button } from '@/shared/ui/button';

const ErrorModal: React.FC<ErrorModalProps> = ({
  isOpen,
  onClose,
  title = "Xəta baş verdi",
  text,
  buttonText = "Tamam"
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent} role="alertdialog" aria-modal="true">
        <CloseButton className={styles.closeButton} onClick={onClose} />
        
        <div className={`${styles.iconWrapper} ${styles.errorIconWrapper}`}>
          <svg className={styles.modalIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 9v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
        
        <h2 className={styles.modalTitle}>{title}</h2>
        {text && <p className={styles.modalText}>{text}</p>}
        
        <Button 
          type="button" 
          variant="clear"
          onClick={onClose}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
};

export default ErrorModal;