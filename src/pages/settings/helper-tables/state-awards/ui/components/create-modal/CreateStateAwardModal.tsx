import { useState } from "react";
import { Modal } from "@/shared/ui/modal/base";
import { FormInput, Button } from "@/shared/ui";
import type { StateAward } from "@/features/settings/state-awards";
import { EnumLookupSelect } from "@/features/lookups";
import type { Option } from "@/shared/types";
import styles from "./CreateStateAwardModal.module.css";

interface CreateStateAwardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<StateAward>) => void;
  isLoading: boolean;
}

export const CreateStateAwardModal = ({
  isOpen,
  onClose,
  onSave,
  isLoading,
}: CreateStateAwardModalProps) => {
  const [name, setName] = useState("");
  const [legalBasisOption, setLegalBasisOption] = useState<Option | null>(null);
  const [sortOrder, setSortOrder] = useState<number>(0);

  const handleSave = () => {
    if (!name.trim() || isLoading) return;
    onSave({
      name: name.trim(),
      typeCode: legalBasisOption ? String(legalBasisOption.id) : "",
      sortOrder,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Yeni Dövlət Mükafatı Əlavə Et" size="md">
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
            <label className={styles.label}>Mükafat növü</label>
            <EnumLookupSelect
              id="new-stateAwardTypeCode"
              code="StateAwardTypes"
              value={legalBasisOption}
              onChange={(option) => setLegalBasisOption(option)}
              defaultText="Seçin"
              disabled={isLoading}
              isClearable={true}
            />
          </div>
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
        <Button variant="secondary" onClick={onClose} className={styles.footerBtn}>
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
