import { useState, useEffect } from "react";
import { FormInput, Button } from "@/shared/ui";
import { Modal } from "@/shared/ui/modal/base";
import styles from "./CreateEnumItemModal.module.css";

export type CreateEnumItemPayload = {
  code: string;
  displayName: string;
  sortOrder: number;
};

interface CreateEnumItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateEnumItemPayload) => void;
  isLoading?: boolean;
}

export const CreateEnumItemModal = ({
  isOpen,
  onClose,
  onSave,
  isLoading = false,
}: CreateEnumItemModalProps) => {
  const [code, setCode] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [sortOrder, setSortOrder] = useState<number>(0);

  useEffect(() => {
    if (isOpen) {
      setCode("");
      setDisplayName("");
      setSortOrder(0);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim() || isLoading) return;
    onSave({
      code: code.trim(),
      displayName: displayName.trim(),
      sortOrder: sortOrder,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Yeni enum dəyəri əlavə et"
      size="sm"
      className={styles.modal}
    >
      <form onSubmit={handleSubmit}>
        <div className={styles.formContainer}>
          <FormInput
            label="Kod"
            id="create-enum-item-code"
            type="text"
            placeholder="Məs: CorporateEmail"
            value={code}
            onChange={(val) => setCode(val)}
            autoComplete="off"
          />
          <FormInput
            label="Adı"
            id="create-enum-item-displayName"
            type="text"
            placeholder="Məs: Korporativ e-poçt"
            value={displayName}
            onChange={(val) => setDisplayName(val)}
            required
            autoComplete="off"
          />
          <FormInput
            label="Sıra"
            id="create-enum-item-sortOrder"
            type="number"
            placeholder="0"
            value={String(sortOrder)}
            onChange={(val) => {
              const num = parseInt(val, 10);
              if (!isNaN(num)) {
                setSortOrder(num);
              } else if (val === "") {
                setSortOrder(0);
              }
            }}
            autoComplete="off"
          />
        </div>

        <div className={styles.footer}>
          <Button
            type="submit"
            variant="primary"
            className={styles.footerButton}
            disabled={isLoading || !displayName.trim()}
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
