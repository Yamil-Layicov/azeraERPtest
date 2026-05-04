import React from "react";
import { Button, CustomSelect, FormInput, ModernDatePicker } from "@/shared/ui";
import type { Option } from "@/shared/types";
import styles from "./EducationInfoSection.module.css";

export type EducationInfoValue = {
  educationLevel: Option | null;
  institution: Option | null;
  specialty: string;
  entryDate: Date | null;
  graduationDate: Date | null;
  diplomaSerialNumber: string;
};

export interface EducationInfoSectionProps {
  value: EducationInfoValue;
  educationLevelOptions: Option[];
  institutionOptions: Option[];
  onEducationLevelChange: (val: Option | null) => void;
  onChange: (field: keyof Omit<EducationInfoValue, "educationLevel">, val: Option | null | Date | null | string) => void;
  onAddClick?: () => void;
  onClear?: () => void;
}

export const EducationInfoSection: React.FC<EducationInfoSectionProps> = ({
  value,
  educationLevelOptions,
  institutionOptions,
  onEducationLevelChange,
  onChange,
  onAddClick,
  onClear,
}) => {
  const handleClear = () => onClear?.();

  return (
    <>
      {/* 1 sətir, 4 sahə: Təhsil pilləsi | Müəssisə | İxtisası | Daxil olma / Bitmə (1 input, 2 yyyy) */}
      <div className={styles.fieldsRow}>
        <div className={styles.field}>
          <div className={styles.labelWrap}>
            <label className={styles.label} htmlFor="education-level">Təhsil pilləsi</label>
          </div>
          <div className={styles.controlWrap}>
            <CustomSelect
              id="education-level"
              options={educationLevelOptions}
              value={value.educationLevel}
              onChange={onEducationLevelChange}
              defaultText="Seçin"
              isSearchable={true}
              searchPlaceholder="Axtar..."
              variant="form"
            />
          </div>
        </div>

        <div className={styles.field}>
          <div className={styles.labelWrap}>
            <label className={styles.label} htmlFor="education-institution">Təhsil müəssisəsinin adı</label>
          </div>
          <div className={styles.controlWrap}>
            <CustomSelect
              id="education-institution"
              options={institutionOptions}
              value={value.institution}
              onChange={(val) => onChange("institution", val)}
              defaultText="Seçin"
              isSearchable={true}
              searchPlaceholder="Axtar..."
              variant="form"
            />
          </div>
        </div>

        <div className={`${styles.field} ${styles.inputField}`}>
          <div className={styles.labelWrap}>
            <label className={styles.label} htmlFor="education-specialty">İxtisası</label>
          </div>
          <div className={styles.controlWrap}>
            <FormInput
              label=""
              id="education-specialty"
              type="text"
              placeholder="Daxil edin"
              value={value.specialty}
              onChange={(val) => onChange("specialty", val)}
            />
          </div>
        </div>

        {/* 1 input: içində 2 məsafəli yyyy; labellar üstdə, digərləri ilə eyni font; hündürlük 40px */}
        <div className={styles.field}>
          <div className={styles.dateRangeLabelRow}>
            <label className={styles.label} htmlFor="education-entryDate">Daxil olma tarixi</label>
            <span className={styles.dateRangeLabelSpacer} aria-hidden />
            <label className={styles.label} htmlFor="education-graduationDate">Bitmə tarixi</label>
          </div>
          <div className={styles.controlWrap}>
            <div className={styles.dateRangeWrap}>
              <ModernDatePicker
                id="education-entryDate"
                mode="year"
                value={value.entryDate}
                onChange={(date) => onChange("entryDate", date)}
                className={styles.dateInputSmall}
              />
              <span className={styles.dateRangeDivider} aria-hidden />
              <ModernDatePicker
                id="education-graduationDate"
                mode="year"
                value={value.graduationDate}
                onChange={(date) => onChange("graduationDate", date)}
                className={styles.dateInputSmall}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2-ci sətir: Diplom seriyası və nömrəsi */}
      <div className={styles.diplomaRow}>
        <div className={`${styles.field} ${styles.inputField}`}>
          <div className={styles.labelWrap}>
            <label className={styles.label} htmlFor="education-diplomaSerialNumber">Diplom seriyası və nömrəsi</label>
          </div>
          <div className={styles.controlWrap}>
            <FormInput
              label=""
              id="education-diplomaSerialNumber"
              type="text"
              placeholder="Daxil edin"
              value={value.diplomaSerialNumber}
              onChange={(val) => onChange("diplomaSerialNumber", val)}
            />
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <Button type="button" variant="secondary" className={styles.addButton} onClick={onAddClick}>
          Əlavə et
        </Button>
        <Button type="button" variant="outline" className={styles.clearButton} onClick={handleClear}>
          Təmizlə
        </Button>
      </div>
    </>
  );
};
