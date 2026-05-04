import React from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { MdOutlineLockReset } from "react-icons/md";
import styles from "@/pages/login-page/ui/Login.module.css";
import forgotStyles from "../ForgotPasswordPage.module.css";

interface OtpStepProps {
  otpDigits: string[];
  otpRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
  handleOtpChange: (index: number, value: string) => void;
  handleOtpKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
  isOtpComplete: boolean;
  onBack: () => void;
  onNext: () => void;
}

export const OtpStep: React.FC<OtpStepProps> = ({
  otpDigits,
  otpRefs,
  handleOtpChange,
  handleOtpKeyDown,
  isOtpComplete,
  onBack,
  onNext,
}) => {
  return (
    <>
      <div className={styles.iconWrapper}>
        <div className={styles.lockIconCircle}>
          <MdOutlineLockReset className={styles.lockIcon} />
        </div>
      </div>
      <h2 className={styles.pageTitle + " " + styles.newPasswordTitle}>
        Təsdiq kodunu daxil edin
      </h2>

      <div className={forgotStyles.otpGroup}>
        {otpDigits.map((digit, index) => (
          <input
            key={`otp-input-${index}`}
            ref={(el) => {
              otpRefs.current[index] = el;
            }}
            className={forgotStyles.otpInput}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(event) => handleOtpChange(index, event.target.value)}
            onKeyDown={(event) => handleOtpKeyDown(index, event)}
            aria-label={`Təsdiq kodu rəqəmi ${index + 1}`}
          />
        ))}
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

        <button
          type="button"
          className={styles.submitButton}
          disabled={!isOtpComplete}
          onClick={onNext}
        >
          Növbəti
        </button>
      </div>
    </>
  );
};
