import React from "react";
import Modal from "../base/Modal";
import { Button } from "@/shared/ui/button";
import styles from "./TokenExpiredModal.module.css";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface TokenExpiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export const TokenExpiredModal: React.FC<TokenExpiredModalProps> = ({
  isOpen,
  onClose,
  onLogout,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Sessiya müddəti bitib"
      size="sm"
    >
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <ExclamationTriangleIcon className={styles.icon} />
        </div>
        <p className={styles.message}>
          Sizin sessiya müddəti bitib. Davam etmək üçün yenidən daxil olmalısınız.
        </p>
        <div className={styles.buttons}>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className={styles.cancelButton}
          >
            Bağla
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={onLogout}
            className={styles.logoutButton}
          >
            Daxil ol
          </Button>
        </div>
      </div>
    </Modal>
  );
};
