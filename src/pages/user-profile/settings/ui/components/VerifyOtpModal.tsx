import React, { useState, useRef, useEffect } from "react";
import Modal from "@/shared/ui/modal/base/Modal";
import styles from "./VerifyOtpModal.module.css";

interface VerifyOtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (otp: string) => void;
  title: string;
  target?: string;
}

export const VerifyOtpModal: React.FC<VerifyOtpModalProps> = ({
  isOpen,
  onClose,
  onVerify,
  title,
  target,
}) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      setOtp(["", "", "", ""]);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [isOpen]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const isComplete = otp.every((digit) => digit !== "");

  const handleVerify = () => {
    if (isComplete) {
      onVerify(otp.join(""));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
    >
      <div className={styles.modalBody}>
        {target && (
          <p className={styles.targetMessage}>
            <strong>{target}</strong> ünvanına göndərilən təsdiqləmə kodunu daxil edin
          </p>
        )}
        <div className={styles.otpGroup}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              className={styles.otpInput}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
            />
          ))}
        </div>
      </div>
      <div className={styles.modalFooter}>
        <button className={styles.cancelButton} onClick={onClose}>
          Ləğv et
        </button>
        <button
          className={styles.submitButton}
          disabled={!isComplete}
          onClick={handleVerify}
        >
          Təsdiqlə
        </button>
      </div>
    </Modal>
  );
};
