import React from 'react';
import styles from './ConfirmModal.module.css';
import { CloseButton } from '@/shared/ui/close-button';
import { Button } from '@/shared/ui/button';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  variant?: 'primary' | 'danger' | 'warning' | string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Təsdiq",
  message,
  description,
  confirmText = "Bəli",
  cancelText = "Xeyr",
  isLoading = false,
  variant = 'primary',
}) => {
  const displayMessage = description || message || "Bu əməliyyatı yerinə yetirmək istədiyinizə əminsiniz?";
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} role="alertdialog" aria-modal="true">
        <CloseButton className={styles.closeButton} onClick={onClose} />
        
        <div className={styles.iconWrapper}>
          <svg className={styles.modalIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M12 9v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
        
        <h2 className={styles.modalTitle}>{title}</h2>
        {displayMessage && <p className={styles.modalText}>{displayMessage}</p>}
        
        <div className={styles.buttonGroup}>
          <Button 
            type="button" 
            variant="clear"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button 
            type="button" 
            variant={variant === 'danger' ? 'danger' : 'primary'}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Gözləyin..." : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
