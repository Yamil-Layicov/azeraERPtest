import React, { useState, useEffect } from "react";
import { Modal } from "@/shared/ui/modal/base";
import { FormInput, Button } from "@/shared/ui";
import styles from "./ResetPasswordModal.module.css";
import { useResetPassword } from "@/features/security/users";

import type { User } from "../../../model/types";

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUser: User | null;
  onSave?: (userId: string, newPass: string) => void; // Made optional for backward compatibility
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  isOpen,
  onClose,
  selectedUser,
  onSave,
}) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  
  const { mutate: resetPassword, isPending: isResettingPassword } = useResetPassword();
  
  useEffect(() => {
    if (isOpen) {
      setNewPassword("");
      setConfirmPassword("");
      setError("");
    }
  }, [isOpen]);

  const handleSave = () => {
    if (!newPassword || !confirmPassword) {
      setError("Zəhmət olmasa bütün sahələri doldurun.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Şifrələr eyni deyil.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Şifrə ən azı 6 simvol olmalıdır.");
      return;
    }

    if (selectedUser?.username) {
      resetPassword(
        {
          username: selectedUser.username,
          newPassword: newPassword,
          confirmNewPassword: confirmPassword,
        },
        {
          onSuccess: () => {
            // Call onSave for backward compatibility if provided
            if (onSave) {
              onSave(selectedUser.id, newPassword);
            }
            onClose();
          },
          onError: () => {
            // Error is handled by global interceptor and toast
          }
        }
      );
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Şifrəni Yenilə"
      size="sm"
    >
      <div className={styles.container}>
        
        <div className={styles.inputWrapper}>
          <FormInput
            label=""
            placeholder=""
            id="username"
            type="text"
            value={selectedUser?.username || ""}
            onChange={() => {}} 
            readOnly={true}
            disabled={true}
          />
        </div>

        <div className={styles.inputWrapper}>
            <FormInput
              label="Yeni şifrə"
              id="newPassword"
              type="password"
              value={newPassword} 
              onChange={(val: string) => {
                  setNewPassword(val);
                  setError(""); 
              }}
              placeholder="Yeni şifrəni daxil edin"
              
            />
        </div>

        <div className={styles.inputWrapper}>
            <FormInput
              label="Yeni şifrənin təkrarı"
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(val: string) => {
                setConfirmPassword(val);
                setError("");
              }}
              placeholder="Şifrəni təkrar daxil edin"
            />
        </div>

        {error && (
          <div className={styles.errorMsg}>
            {error}
          </div>
        )}

      </div>

      <div className={styles.footer}>
      <Button 
        type="button" 
        variant="primary" 
        onClick={handleSave} 
        className={styles.modalBtn}
        disabled={isResettingPassword}
      >
          {isResettingPassword ? "Yenilənir..." : "Yenilə"}
        </Button>
        <Button 
          type="button" 
          variant="secondary" 
          onClick={onClose} 
          className={styles.modalBtn}
          disabled={isResettingPassword}
        >
          Ləğv et
        </Button>
      </div>
    </Modal>
  );
};

export default ResetPasswordModal;