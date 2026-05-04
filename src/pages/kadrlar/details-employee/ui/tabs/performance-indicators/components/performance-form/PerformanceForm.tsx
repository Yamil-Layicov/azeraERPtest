import React from "react";
import { FormInput, ModernDatePicker, Button } from "@/shared/ui";
import styles from "./PerformanceForm.module.css";

export type PerformanceFormValue = {
  il: Date | null;
  qiymet: string;
  illikBonusMeblegi: string;
};

export interface PerformanceFormProps {
  value: PerformanceFormValue;
  onChange: (field: keyof PerformanceFormValue, value: Date | null | string) => void;
  onAdd: () => void;
}

export const PerformanceForm: React.FC<PerformanceFormProps> = ({ value, onChange, onAdd }) => {
  const { il, qiymet, illikBonusMeblegi } = value;
  const canAdd = il != null && qiymet.trim() !== "" && illikBonusMeblegi.trim() !== "";

  const handleAdd = () => {
    if (!canAdd) return;
    onAdd();
  };

  return (
    <div className={styles.container}>
      <div className={styles.formRow}>
        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="performance-il">
            İl
          </label>
          <ModernDatePicker
            id="performance-il"
            value={il}
            onChange={(v) => onChange("il", v)}
            placeholder="dd.mm.yyyy"
          />
        </div>
        <div className={styles.fieldGroup}>
          <FormInput
            id="performance-qiymet"
            type="text"
            label="Qiymət"
            placeholder="Daxil edin"
            value={qiymet}
            onChange={(val) => onChange("qiymet", val)}
          />
        </div>
        <div className={styles.fieldGroup}>
          <FormInput
            id="performance-illik-bonus"
            type="text"
            label="İllik bonus məbləği"
            placeholder="Daxil edin"
            value={illikBonusMeblegi}
            onChange={(val) => onChange("illikBonusMeblegi", val)}
          />
        </div>
        <div className={styles.buttonCell}>
          <Button
            variant="secondary"
            onClick={handleAdd}
            type="button"
            className={styles.addButton}
            disabled={!canAdd}
          >
            Əlavə et
          </Button>
        </div>
      </div>
    </div>
  );
};
