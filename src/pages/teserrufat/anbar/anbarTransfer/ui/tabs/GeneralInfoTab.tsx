import React from "react";
import styles from "../AnbarTransfer.module.css";
import { CustomSelect, FormTextarea, FormInput } from "@/shared/ui";
import { type AnbarTransferGeneralInfo } from "../../model/types";

interface GeneralInfoTabProps {
  data: AnbarTransferGeneralInfo;
  onChange: (data: AnbarTransferGeneralInfo) => void;
}

const GeneralInfoTab: React.FC<GeneralInfoTabProps> = ({ data, onChange }) => {
  const handleChange = (field: keyof AnbarTransferGeneralInfo, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className={styles.formGrid}>
      <div className={styles.fullWidth} >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-muted)' }}>Status:</span>
          <span className={`${styles.statusBadge} ${data.status === "Draft" ? styles.statusDraft : styles.statusCompleted}`}>
            {data.status}
          </span>
        </div>
      </div>

      <div className={styles.formGroup}>
        <FormInput
          label="Əməliyyat tarixi"
          value={data.operationDate}
          onChange={(val) => handleChange("operationDate", val)}
          placeholder=""
          type="text"
          id="operationDate"
        />
      </div>

      <div className={styles.formGroup}>
        <FormInput
          label="Sənəd nömrəsi"
          value={data.documentNumber}
          onChange={(val) => handleChange("documentNumber", val)}
          placeholder="Sənəd nömrəsini daxil edin"
          type="text"
          id="documentNumber"
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Göndərən anbar</label>
        <CustomSelect
          options={[]} 
          value={data.senderWarehouse}
          onChange={(val) => handleChange("senderWarehouse", val)}
          defaultText="Anbar seçin"
          isSearchable
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Qəbul edən anbar</label>
        <CustomSelect
          options={[]} 
          value={data.receiverWarehouse}
          onChange={(val) => handleChange("receiverWarehouse", val)}
          defaultText="Anbar seçin"
          isSearchable
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Şirkət</label>
        <CustomSelect
          options={[]} 
          value={data.company}
          onChange={(val) => handleChange("company", val)}
          defaultText="Şirkət seçin"
          isSearchable
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Məsuliyyətli</label>
        <CustomSelect
          options={[]} 
          value={data.responsiblePerson}
          onChange={(val) => handleChange("responsiblePerson", val)}
          defaultText="Məsul şəxs seçin"
          isSearchable
        />
      </div>

      <div className={styles.fullWidth}>
        <label className={styles.label}>Qeyd</label>
        <FormTextarea
          value={data.note}
          placeholder="Əlavə şərhlər üçün..."
          onChange={(val) => handleChange("note", val)}
          label=""
          id="note"
          rows={4}
        />
      </div>
    </div>
  );
};

export default GeneralInfoTab;
