import React from "react";
import { Button,  FormInput, ModernDatePicker } from "@/shared/ui";
import { EnumLookupSelect } from "@/features/lookups";
import { PermissionGuard } from "@/features/auth/components";
import { PERMISSIONS } from "@/shared/consts/permissions";
import type { Option } from "@/shared/types";
import styles from "./EducationInfoSection.module.css";

export type EducationInfoValue = {
  educationLevel: Option | null;
  institution: Option | null;
  specialty: Option | null;
  entryDate: Date | null;
  graduationDate: Date | null;
  diplomaSerialNumber: string;
};

export type EducationInfoChange =
  | { field: "institution" | "specialty"; val: Option | null }
  | { field: "entryDate" | "graduationDate"; val: Date | null }
  | { field: "diplomaSerialNumber"; val: string };

export interface EducationInfoSectionProps {
  value: EducationInfoValue;
  errors?: Record<string, string>;
  onEducationLevelChange: (val: Option | null) => void;
  onChange: (change: EducationInfoChange) => void;
  onAddClick?: () => void;
  onClear?: () => void;
  isEditing?: boolean;
}

export const EducationInfoSection: React.FC<EducationInfoSectionProps> = ({
  value,
  errors = {},
  onEducationLevelChange,
  onChange,
  onAddClick,
  onClear,
  isEditing = false,
}) => {
  return (
    <>
      <div className={styles.fieldsRow}>
        <div className={styles.field}>
          <div className={styles.labelWrap}>
            <label className={styles.label} htmlFor="education-level">
              Təhsil pilləsi<span className={styles.requiredStar}>*</span>
            </label>
          </div>
          <div className={styles.controlWrap}>
            <EnumLookupSelect
              id="education-level"
              code="EducationLevels"
              value={value.educationLevel}
              onChange={onEducationLevelChange}
              defaultText="Seçin"
              isClearable={true}
              error={errors.educationLevel}
            />
          </div>
        </div>

        <div className={styles.field}>
          <div className={styles.labelWrap}>
            <label className={styles.label} htmlFor="education-institution">
              Təhsil müəssisəsinin adı<span className={styles.requiredStar}>*</span>
            </label>
          </div>
          <div className={styles.controlWrap}>
            <EnumLookupSelect
              id="education-institution"
              code="EducationInstitutionName"
              value={value.institution}
              onChange={(val) => onChange({ field: "institution", val })}
              defaultText="Seçin"
              isSearchable={true}
              isClearable={true}
              error={errors.institution}
            />
          </div>
        </div>

        <div className={styles.field}>
          <div className={styles.labelWrap}>
            <label className={styles.label} htmlFor="education-specialty">
              İxtisası<span className={styles.requiredStar}>*</span>
            </label>
          </div>
          <div className={styles.controlWrap}>
            <EnumLookupSelect
              id="education-specialty"
              code="Specialties"
              value={value.specialty}
              onChange={(val) => onChange({ field: "specialty", val })}
              defaultText="Seçin"
              isSearchable={true}
              isClearable={true}
              error={errors.specialty}
            />
          </div>
        </div>

        <div className={styles.field}>
          <div className={styles.dateRangeLabelRow}>
            <label className={styles.label} htmlFor="education-entryDate">
              Daxil olma ili<span className={styles.requiredStar}>*</span>
            </label>
            <span className={styles.dateRangeLabelSpacer} aria-hidden />
            <label className={styles.label} htmlFor="education-graduationDate">Bitmə ili</label>
          </div>
          <div className={styles.controlWrap}>
            <div className={styles.dateRangeWrap}>
              <ModernDatePicker
                id="education-entryDate"
                mode="year"
                value={value.entryDate}
                onChange={(date) => onChange({ field: "entryDate", val: date })}
                className={styles.dateInputSmall}
                error={errors.entryDate}
              />
              <span className={styles.dateRangeDivider} aria-hidden />
              <ModernDatePicker
                id="education-graduationDate"
                mode="year"
                value={value.graduationDate}
                onChange={(date) => onChange({ field: "graduationDate", val: date })}
                className={styles.dateInputSmall}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.diplomaRow}>
        <div className={`${styles.field} ${styles.inputField}  ${styles.diplomaInputOther}`}>
          <div className={styles.labelWrap}>
            <label className={styles.label} htmlFor="education-diplomaSerialNumber">Diplom seriyası və nömrəsi</label>
          </div>
          <div className={`${styles.controlWrap}`}>
            <FormInput
              label=""
              id="education-diplomaSerialNumber"
              type="text"
              placeholder="Daxil edin"
              value={value.diplomaSerialNumber}
              onChange={(val) => onChange({ field: "diplomaSerialNumber", val })}
            />
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <PermissionGuard permission={PERMISSIONS.EMPLOYEE.CREATE}>
          <Button
            type="button"
            variant="outline"
            className={styles.addButton}
            onClick={() => {
              onAddClick?.();
            }}
          >
            {isEditing ? "Yenilə" : "Əlavə et"}
          </Button>
        </PermissionGuard>
        <Button type="button" variant="secondary" className={styles.clearButton} onClick={onClear}>
          Təmizlə
        </Button>
      </div>
    </>
  );
};
