import { useState, useEffect } from "react";
import { FormInput, Button } from "@/shared/ui";
import { Modal } from "@/shared/ui/modal/base";
import styles from "./CreateEnumTypeModal.module.css";

export type CreateEnumTypePayload = {
  code: string;
  displayName: string;
  description: string;
};

interface CreateEnumTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateEnumTypePayload) => void;
  isLoading?: boolean;
}

export const CreateEnumTypeModal = ({
  isOpen,
  onClose,
  onSave,
  isLoading = false,
}: CreateEnumTypeModalProps) => {
  const [code, setCode] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (isOpen) {
      setCode("");
      setDisplayName("");
      setDescription("");
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !displayName.trim() || isLoading) return;
    onSave({
      code: code.trim(),
      displayName: displayName.trim(),
      description: description.trim(),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Yeni enum tipi əlavə et"
      size="sm"
      className={styles.modal}
    >
      <form onSubmit={handleSubmit}>
        <div className={styles.formContainer}>
          <FormInput
            label="Kod"
            id="create-enum-code"
            type="text"
            placeholder="Məs: ContactTypes"
            value={code}
            onChange={(val) => setCode(val)}
            required
            autoComplete="off"
          />
          <FormInput
            label="Adı"
            id="create-enum-displayName"
            type="text"
            placeholder="Məs: Əlaqə növləri"
            value={displayName}
            onChange={(val) => setDisplayName(val)}
            required
            autoComplete="off"
          />
          <FormInput
            label="Təsvir"
            id="create-enum-description"
            type="text"
            placeholder="Təsvir"
            value={description}
            onChange={(val) => setDescription(val)}
            autoComplete="off"
          />
        </div>

        <div className={styles.footer}>
          <Button
            type="submit"
            variant="primary"
            className={styles.footerButton}
            disabled={isLoading || !code.trim() || !displayName.trim()}
          >
            {isLoading ? "Yüklənir..." : "Yadda saxla"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className={styles.footerButton}
            disabled={isLoading}
          >
            Ləğv et
          </Button>
        </div>
      </form>
    </Modal>
  );
};
