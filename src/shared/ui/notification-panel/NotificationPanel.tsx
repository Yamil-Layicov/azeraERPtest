import { useEffect, useRef } from 'react';
import type { MouseEvent } from 'react';
import styles from './NotificationPanel.module.css';
import type { NotificationPanelProps } from '@/shared/types';
import { CloseButton } from '@/shared/ui/close-button';

const NotificationPanel = ({ isOpen, onClose, notifications }: NotificationPanelProps) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | globalThis.MouseEvent) {
      if (panelRef.current && event.target instanceof Node && !panelRef.current.contains(event.target)) {
        onClose();
      }
    }

    if (isOpen) {
      // Body lock scroll'u 
      document.body.style.overflow = 'hidden';
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      // Body open scroll
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      // Component unmount - open scroll
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);


  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.panel} ref={panelRef}>
        <div className={styles.header}>
          <h3 className={styles.title}>Bildirişlər</h3>
          <CloseButton onClick={onClose} />
        </div>
        
        <div className={styles.content}>
          {notifications.length === 0 ? (
            <div className={styles.emptyState}>
              <p className={styles.emptyText}>Bildirişiniz yoxdur</p>
            </div>
          ) : (
            <div className={styles.notificationList}>
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`${styles.notificationItem} ${!notification.isRead ? styles.unread : ''}`}
                >
                  <div className={styles.notificationHeader}>
                    <div className={styles.notificationInfo}>
                      {!notification.isRead && <div className={styles.unreadDot}></div>}
                      <div className={styles.notificationContent}>
                        <h4 className={styles.notificationTitle}>{notification.title}</h4>
                        <p className={styles.notificationMessage}>{notification.message}</p>
                      </div>
                    </div>
                    <span className={styles.timestamp}>{notification.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel;
