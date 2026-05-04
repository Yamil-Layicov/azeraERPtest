import React from "react";
import { CustomSelect } from "@/shared/ui";
import { EnumLookupSelect } from "@/features/lookups";
import type { Option } from "@/shared/types";
import styles from "../../StaffInfoTab.module.css";

export type StaffTableFormData = {
  departament: Option | null;
  vezife: Option | null;
  resmilesmeFormasi: Option | null;
};

export interface StaffTableSectionProps {
  value: StaffTableFormData;
  departamentOptions: Option[];
  vezifeOptions: Option[];
  onChange: (field: keyof StaffTableFormData, value: StaffTableFormData[keyof StaffTableFormData]) => void;
}

export const StaffTableSection: React.FC<StaffTableSectionProps> = ({
  value,
  departamentOptions,
  vezifeOptions,
  onChange,
}) => {
  return (
    <div className={styles.formGrid}>
      <div className={styles.formGroup}>
        <label className={styles.label}>
          Departament / Şöbə / Bölmə<span className="required-star">*</span>
        </label>
        <CustomSelect
          options={departamentOptions}
          value={value.departament}
          onChange={(val) => onChange("departament", val)}
          defaultText="Seçin"
          isSearchable={true}
          searchPlaceholder="Axtar..."
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>Vəzifə</label>
        <CustomSelect
          options={vezifeOptions}
          value={value.vezife}
          onChange={(val) => onChange("vezife", val)}
          defaultText="Seçin"
          isSearchable={true}
          searchPlaceholder="Axtar..."
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>
          Rəsmiləşmə forması<span className="required-star">*</span>
        </label>
        <EnumLookupSelect
          code="EmploymentTypes"
          value={value.resmilesmeFormasi}
          onChange={(val) => onChange("resmilesmeFormasi", val)}
          defaultText="Seçin"
          variant="form"
          isSearchable={true}
          searchPlaceholder="Axtar..."
        />
      </div>
    </div>
  );
};

