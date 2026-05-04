import { useEffect, useRef } from 'react';
import type { MouseEvent } from 'react';
import styles from './MessageModal.module.css';
import type { MessageModalProps } from '@/shared/types';
import { CloseButton } from '@/shared/ui/close-button';

const MessageModal = ({ isOpen, onClose, messages }: MessageModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | globalThis.MouseEvent) {
      if (modalRef.current && event.target instanceof Node && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }

    if (isOpen) {
      // Body scroll'u engelle
      document.body.style.overflow = 'hidden';
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      // Body scroll'u geri aç
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      // Component unmount olduğunda scroll'u geri aç
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal} ref={modalRef}>
        <div className={styles.header}>
          <h3 className={styles.title}>Mesajlar</h3>
          <CloseButton className={styles.closeButton} onClick={onClose} />
        </div>
        
        <div className={styles.content}>
          {messages.length === 0 ? (
            <div className={styles.emptyState}>
              <p className={styles.emptyText}>Mesajınız yoxdur</p>
            </div>
          ) : (
            <div className={styles.messageList}>
              {messages.map((message) => (
                <div key={message.id} className={styles.messageItem}>
                  <div className={styles.messageHeader}>
                    <div className={styles.messageInfo}>
                      {!message.isRead && <div className={styles.unreadIndicator}></div>}
                      <h4 className={styles.messageTitle}>{message.title}</h4>
                    </div>
                    <span className={styles.timestamp}>{message.timestamp}</span>
                  </div>
                  <p className={styles.messageContent}>{message.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageModal;
