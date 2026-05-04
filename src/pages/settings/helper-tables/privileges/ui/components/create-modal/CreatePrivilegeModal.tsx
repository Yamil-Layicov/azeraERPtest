import { useState } from "react";
import { Modal } from "@/shared/ui/modal/base";
import { FormInput, Button } from "@/shared/ui";
import type { Privilege } from "@/features/settings/privileges";
import { EnumLookupSelect } from "@/features/lookups";
import type { Option } from "@/shared/types";
import styles from "./CreatePrivilegeModal.module.css";

interface CreatePrivilegeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Privilege>) => void;
  isLoading: boolean;
}

export const CreatePrivilegeModal = ({
  isOpen,
  onClose,
  onSave,
  isLoading,
}: CreatePrivilegeModalProps) => {
  const [name, setName] = useState("");
  const [legalBasisOption, setLegalBasisOption] = useState<Option | null>(null);
  const [sortOrder, setSortOrder] = useState<number>(0);
  const [extraVacation, setExtraVacation] = useState<number>(0);

  const handleSave = () => {
    if (!name.trim() || isLoading) return;
    onSave({
      name: name.trim(),
      legalBasisCode: legalBasisOption ? String(legalBasisOption.id) : "",
      sortOrder,
      extraVacation,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Yeni İmtiyaz Əlavə Et"
      size="md"
    >
      <div className={styles.modalBody}>
        <div className={styles.formWrapper}>
          <FormInput
            label="Ad"
            id="new-name"
            type="text"
            placeholder="Daxil edin"
            value={name}
            onChange={(val) => setName(val)}
          />
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Hüquqi Əsas</label>
            <EnumLookupSelect
              id="new-legalBasisCode"
              code="LegalBasis"
              value={legalBasisOption}
              onChange={(option) => setLegalBasisOption(option)}
              defaultText="Seçin"
              disabled={isLoading}
            />
          </div>
          <FormInput
            label="Əlavə məzuniyyət"
            id="new-extraVacation"
            type="number"
            placeholder="0"
            value={String(extraVacation)}
            onChange={(val) => setExtraVacation(Number(val) || 0)}
          />
          <FormInput
            label="Sıra №"
            id="new-sortOrder"
            type="number"
            placeholder="0"
            value={String(sortOrder)}
            onChange={(val) => setSortOrder(Number(val) || 0)}
          />
        </div>
      </div>
      <div className={styles.modalFooter}>
        <Button
          variant="secondary"
          onClick={onClose}
          className={styles.footerBtn}
        >
          Ləğv et
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
          className={styles.footerBtn}
          disabled={isLoading || !name.trim()}
        >
          {isLoading ? "Yüklənir..." : "Əlavə et"}
        </Button>
      </div>
    </Modal>
  );
};
