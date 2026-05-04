import React, { useState, useEffect } from "react";
import Modal from "@/shared/ui/modal/base/Modal";
import { FormInput, Button } from "@/shared/ui";
import { PHONE_MASK, handlePhoneChange } from "@/pages/auth/forgot-password/lib/phoneMask";
import { isPhoneComplete } from "@/pages/auth/forgot-password/lib/validation";
import styles from "./EditInfoModal.module.css";

interface EditInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newValue: string) => void;
  title: string;
  label: string;
  initialValue: string;
  placeholder?: string;
  type?: "text" | "email" | "password" | "number" | "phone";
  isLoading?: boolean;
}

export const EditInfoModal: React.FC<EditInfoModalProps> = ({
  isOpen,
  onClose,
  onSave,
  title,
  initialValue,
  placeholder,
  type = "text",
  isLoading = false,
}) => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (type === "phone") {
        let val = initialValue;
        if (val && !val.startsWith("+")) {
          val = "+994" + val.replace(/\D/g, "").replace(/^994/, "");
        }
        handlePhoneChange(val || "+994", "", (formatted) => setValue(formatted));
      } else {
        setValue(initialValue);
      }
      setError(null);
    }
  }, [isOpen, initialValue, type]);

  const getCursorPos = (phoneVal: string) => {
    for (let i = phoneVal.length - 1; i >= 0; i--) {
      const char = phoneVal[i];
      if (char && /\d/.test(char)) return Math.max(i + 1, 4);
    }
    return 4;
  };

  React.useLayoutEffect(() => {
    if (isOpen && type === "phone" && inputRef.current) {
      const lastDigitPos = getCursorPos(value);
      if (inputRef.current.selectionStart !== lastDigitPos) {
        inputRef.current.setSelectionRange(lastDigitPos, lastDigitPos);
      }
    }
  }, [value, type, isOpen]);

  const handleSave = () => {
    if (!value.trim()) {
      setError("Bu xana boş ola bilməz");
      return;
    }

    if (type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setError("Düzgün e-poçt ünvanı daxil edin");
        return;
      }
    }

    if (type === "phone") {
      if (!isPhoneComplete(value)) {
        setError("Telefon nömrəsini tam daxil edin");
        return;
      }
    }

    onSave(value);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className={styles.modalBody}>
        <div className={styles.inputGroup}>
          <FormInput
            ref={inputRef}
            label=""
            id="edit-info-input"
            type={type === "phone" ? "text" : type}
            placeholder={type === "phone" ? PHONE_MASK : (placeholder || `-`)}
            value={value}
            onChange={(val) => {
              if (type === "phone") {
                handlePhoneChange(val, value, setValue);
              } else {
                setValue(val);
              }
              if (error) setError(null);
            }}
            onClick={() => {
              if (type === "phone") {
                const pos = getCursorPos(value);
                inputRef.current?.setSelectionRange(pos, pos);
              }
            }}
            onFocus={() => {
              if (type === "phone") {
                const pos = getCursorPos(value);
                inputRef.current?.setSelectionRange(pos, pos);
              }
            }}
            error={error || undefined}
          />
        </div>
        <div className={styles.buttonGroup}>
          <Button
            variant="clear"
            onClick={onClose}
            className={styles.cancelButton}
          >
            Ləğv et
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            className={styles.saveButton}
            isLoading={isLoading}
          >
            Yadda saxla
          </Button>
        </div>
      </div>
    </Modal>
  );
};
