import React from "react";
import { Button, CustomSelect, FormInput, FormTextarea, ModernDatePicker } from "@/shared/ui";
import { EnumLookupSelect } from "@/features/lookups";
import type { Option } from "@/shared/types";
import styles from "./WorkInputForm.module.css";

export type WorkInputFormValue = {
  experienceType: Option | null;
  workplace: string;
  position: Option | null;
  appointmentDate: Date | null;
  appointmentOrderNumber: string;
  releaseDate: Date | null;
  releaseOrderNumber: string;
  releaseLegalBasis: Option | null;
  resignationReason: string;
};

export interface WorkInputFormProps {
  value: WorkInputFormValue;
  experienceTypeOptions: Option[];
  positionOptions: Option[];
  onChange: (field: keyof WorkInputFormValue, val: Option | null | Date | null | string) => void;
  onAddClick?: () => void;
  onClear?: () => void;
}



export const WorkInputForm: React.FC<WorkInputFormProps> = ({
  value,
  experienceTypeOptions,
  positionOptions,
  onChange,
  onAddClick,
  onClear,
}) => {
  const handleClear = () => onClear?.();

  return (
    <div className={styles.container} data-work-input-form>
      {/* 1 sətir: 4 element */}
      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="work-experienceType">
            Staj növü
          </label>
          <div className={styles.controlWrap}>
            <CustomSelect
              id="work-experienceType"
              options={experienceTypeOptions}
              value={value.experienceType}
              onChange={(val) => onChange("experienceType", val)}
              defaultText="Seçin"
              searchPlaceholder="Axtar..."
              variant="form"
            />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="work-workplace">
            İş yeri<span className={styles.required}>*</span>
          </label>
          <div className={styles.controlWrap}>
            <FormInput
              label=""
              id="work-workplace"
              type="text"
              placeholder="Daxil edin"
              value={value.workplace}
              onChange={(val) => onChange("workplace", val)}
            />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="work-position">
            Vəzifəsi<span className={styles.required}>*</span>
          </label>
          <div className={styles.controlWrap}>
            <CustomSelect
              id="work-position"
              options={positionOptions}
              value={value.position}
              onChange={(val) => onChange("position", val)}
              defaultText="Seçin"
              isSearchable={true}
              searchPlaceholder="Axtar..."
              variant="form"
            />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="work-appointmentDate">
            Təyinat tarixi<span className={styles.required}>*</span>
          </label>
          <div className={styles.controlWrap}>
            <ModernDatePicker
              id="work-appointmentDate"
              value={value.appointmentDate}
              onChange={(date) => onChange("appointmentDate", date)}
              placeholder="dd.mm.yy"
              className={styles.datePicker}
            />
          </div>
        </div>
      </div>

      {/* 2-ci sətir: Təyinat əmr nömrəsi, Azad olma tarixi, Azad olma əmr nömrəsi, Hüquqi əsas */}
      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="work-appointmentOrderNumber">
            Təyinat əmr nömrəsi
          </label>
          <div className={styles.controlWrap}>
            <FormInput
              label=""
              id="work-appointmentOrderNumber"
              type="text"
              placeholder="Daxil edin"
              value={value.appointmentOrderNumber}
              onChange={(val) => onChange("appointmentOrderNumber", val)}
            />
          </div>
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="work-releaseDate">
            Azad olma tarixi
          </label>
          <div className={styles.controlWrap}>
            <ModernDatePicker
              id="work-releaseDate"
              value={value.releaseDate}
              onChange={(date) => onChange("releaseDate", date)}
              placeholder="dd.mm.yyyy"
              className={styles.datePicker}
            />
          </div>
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="work-releaseOrderNumber">
            Azad olma əmr nömrəsi
          </label>
          <div className={styles.controlWrap}>
            <FormInput
              label=""
              id="work-releaseOrderNumber"
              type="text"
              placeholder="Daxil edin"
              value={value.releaseOrderNumber}
              onChange={(val) => onChange("releaseOrderNumber", val)}
            />
          </div>
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="work-releaseLegalBasis">
            İşdən azad olmanın hüquqi əsası və ya yerdəyişmə
          </label>
          <div className={styles.controlWrap}>
            <EnumLookupSelect
              id="work-releaseLegalBasis"
              code="TerminationReasons"
              value={value.releaseLegalBasis}
              onChange={(val) => onChange("releaseLegalBasis", val)}
              defaultText="Seçin"
              isSearchable={true}
              variant="form"
            />
          </div>
        </div>
      </div>

      {/* 3-cü sətir: İşdən ayrılma səbəbi (textarea) */}
      <div className={styles.textareaRow}>
        <div className={styles.fieldFull}>
          <label className={styles.label} htmlFor="work-resignationReason">
            İşdən ayrılma səbəbi
          </label>
          <FormTextarea
            id="work-resignationReason"
            label=""
            placeholder="Daxil edin"
            value={value.resignationReason}
            onChange={(val) => onChange("resignationReason", val)}
            rows={3}
          />
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
    </div>
  );
};
