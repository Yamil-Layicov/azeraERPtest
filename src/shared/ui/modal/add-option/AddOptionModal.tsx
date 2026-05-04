import React, { useState, useEffect } from "react";
import Modal from "@/shared/ui/modal/base/Modal";
import { Button } from "@/shared/ui/button";
import { FormInput } from "@/shared/ui/input";
import styles from "./AddOptionModal.module.css";

interface AddOptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (value: string) => void;
  title: string;
  placeholder?: string;
}

const AddOptionModal: React.FC<AddOptionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  title,
  placeholder = "Ad daxil edin...",
}) => {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState(false);

  // Modal hər açılanda inputu təmizləyək
  useEffect(() => {
    if (isOpen) {
      setInputValue("");
      setError(false);
    }
  }, [isOpen]);

  const handleSave = () => {
    if (!inputValue.trim()) {
      setError(true);
      return;
    }
    onSave(inputValue.trim());
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className={styles.container}>
        <div className={styles.inputWrapper}>
          <FormInput
            label="Yeni seçim adı"
            id="new-option-input"
            type="text"
            placeholder={placeholder}
            value={inputValue}
            onChange={(val) => {
              setInputValue(val);
              if (val.trim()) setError(false);
            }}
            className={error ? "error" : ""}
          />
          {error && <span className={styles.errorMessage}>Bu sahə boş ola bilməz</span>}
        </div>

        <div className={styles.footer}>
          <Button type="button" variant="primary" onClick={handleSave}>
            Əlavə et
          </Button>
          <Button type="button" variant="secondary" onClick={onClose}>
            Ləğv et
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddOptionModal;