import React, { useState, useEffect } from "react";
import styles from "./PasswordResetModal.module.css";
import { Modal } from "@/shared/ui/modal/base";
import { FormInput, Button } from "@/shared/ui";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

interface PasswordResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
}

const PasswordResetModal: React.FC<PasswordResetModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPass1, setShowPass1] = useState(false);
  const [showPass2, setShowPass2] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setNewPassword("");
      setConfirmPassword("");
      setError("");
      setShowPass1(false);
      setShowPass2(false);
    }
  }, [isOpen]);

  const handleConfirm = () => {
    if (!newPassword || !confirmPassword) {
      setError("Zəhmət olmasa bütün sahələri doldurun");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Şifrələr eyni deyil");
      return;
    }
    onConfirm(newPassword);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Şifrə təyini" size="sm">
      <div className={styles.container}>
        
        <div className={styles.inputWrapper}>
          <FormInput
            label="Yeni şifrə"
            id="modal-new-password"
            type={showPass1 ? "text" : "password"}
            placeholder="Yeni şifrəni daxil edin"
            value={newPassword}
            onChange={(val) => { setNewPassword(val); setError(""); }}
            autoComplete="new-password"
            className={styles.input}
          />
          <button 
            type="button" 
            className={styles.eyeBtn}
            onClick={() => setShowPass1(!showPass1)}
            tabIndex={-1}
            style={{ top: "38px" }}
          >
            {showPass1 ? <EyeSlashIcon className={styles.eyeIcon} /> : <EyeIcon className={styles.eyeIcon} />}
          </button>
        </div>

        <div className={styles.inputWrapper}>
          <FormInput
            label="Şifrəni təsdiqlə"
            id="modal-confirm-password"
            type={showPass2 ? "text" : "password"}
            placeholder="Təkrar şifrə"
            value={confirmPassword}
            onChange={(val) => { setConfirmPassword(val); setError(""); }}
            autoComplete="new-password"
            className={styles.input}
          />
          <button 
            type="button" 
            className={styles.eyeBtn}
            onClick={() => setShowPass2(!showPass2)}
            tabIndex={-1}
            style={{ top: "38px" }}
          >
            {showPass2 ? <EyeSlashIcon className={styles.eyeIcon} /> : <EyeIcon className={styles.eyeIcon} />}
          </button>
        </div>

        {error && <p className={styles.errorMessage}>{error}</p>}

        <div className={styles.footer}>
          <Button type="button" variant="secondary" onClick={onClose} className={styles.footerButton}>
            Ləğv et
          </Button>
          <Button type="button" variant="primary" onClick={handleConfirm} className={styles.footerButton}>
            Təsdiqlə
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PasswordResetModal;