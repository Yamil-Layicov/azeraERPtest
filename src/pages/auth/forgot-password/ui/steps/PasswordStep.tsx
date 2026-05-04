import React from "react";
import { FormInput } from "@/shared/ui";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { MdOutlineLockReset } from "react-icons/md";
import styles from "@/pages/login-page/ui/Login.module.css";
import forgotStyles from "../ForgotPasswordPage.module.css";

interface PasswordStepProps {
  newPassword: string;
  confirmPassword: string;
  setNewPassword: (val: string) => void;
  setConfirmPassword: (val: string) => void;
  isNextDisabled: boolean;
  onBack: () => void;
}

export const PasswordStep: React.FC<PasswordStepProps> = ({
  newPassword,
  confirmPassword,
  setNewPassword,
  setConfirmPassword,
  isNextDisabled,
  onBack,
}) => {
  return (
    <>
      <div className={styles.iconWrapper}>
        <div className={styles.lockIconCircle}>
          <MdOutlineLockReset className={styles.lockIcon} />
        </div>
      </div>
      <h2 className={styles.pageTitle + " " + styles.newPasswordTitle}>
        Yeni şifrə təyin edin
      </h2>

      <div className={`${styles.formGroup} ${forgotStyles.passwordFormGroup}`}>
        <FormInput
          id="forgot-new-password"
          type="password"
          label="Yeni şifrə"
          placeholder="********"
          className={styles.input}
          value={newPassword}
          onChange={setNewPassword}
        />
        <FormInput
          id="forgot-confirm-password"
          type="password"
          label="Şifrəni təkrarlayın"
          placeholder="********"
          className={styles.input}
          value={confirmPassword}
          onChange={setConfirmPassword}
        />
      </div>

      <div className={styles.buttonGroup}>
        <button
          type="button"
          className={`${styles.submitButton} ${styles.secondaryBtn}`}
          onClick={onBack}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <ArrowLeftIcon width={20} height={20} strokeWidth={3.5} />
          Geri
        </button>

        <button type="button" className={styles.submitButton} disabled={isNextDisabled}>
          Növbəti
        </button>
      </div>
    </>
  );
};
