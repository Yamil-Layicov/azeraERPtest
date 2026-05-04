import React from "react";
import styles from "../AnbarChanges.module.css";
import { CustomSelect, FormTextarea, FormInput } from "@/shared/ui";
import { REASON_OPTIONS, type AnbarChangeGeneralInfo } from "../../model/types";

interface GeneralInfoTabProps {
  data: AnbarChangeGeneralInfo;
  onChange: (data: AnbarChangeGeneralInfo) => void;
}

const GeneralInfoTab: React.FC<GeneralInfoTabProps> = ({ data, onChange }) => {
  const handleChange = (field: keyof AnbarChangeGeneralInfo, value: any) => {
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
        <label className={styles.label}>Anbar</label>
        <CustomSelect
          options={[]} 
          value={data.anbar}
          onChange={(val) => handleChange("anbar", val)}
          defaultText="Anbar seçin"
          isSearchable
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Məsul şəxs</label>
        <CustomSelect
          options={[]} 
          value={data.responsiblePerson}
          onChange={(val) => handleChange("responsiblePerson", val)}
          defaultText="Məsul şəxs seçin"
          isSearchable
        />
      </div>

      <div className={styles.formGroup}>
        <FormInput
          label="Məsuliyyətli şəxs"
          value={data.responsiblePersonName}
          onChange={(val) => handleChange("responsiblePersonName", val)}
          placeholder="Ad daxil edin"
          type="text"
          id="responsiblePersonName"
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Səbəb</label>
        <CustomSelect
          options={REASON_OPTIONS}
          value={data.reason}
          onChange={(val) => handleChange("reason", val)}
          defaultText="Səbəb seçin"
        />
      </div>

      <div className={styles.formGroup}>
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
