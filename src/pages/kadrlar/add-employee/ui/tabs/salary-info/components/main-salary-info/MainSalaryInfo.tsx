import React from "react";
import type { Control, FieldErrors } from "react-hook-form";
import { Controller, useWatch } from "react-hook-form";
import styles from "./MainSalaryInfo.module.css";
import { FormInput } from "@/shared/ui/input";
import { Checkbox } from "@/shared/ui/checkbox";
import { EnumLookupSelect } from "@/features/lookups";
import { ModernDatePicker } from "@/shared/ui";
import type { Option } from "@/shared/types";
import { Button } from "@/shared/ui";

export interface SalaryFormValues {
  grossSalary: "" | number;
  cashSalary: "" | number;
  bonus?: "" | number;
  calculationYear: Option | null;
  calculationDateFrom?: Date | null;
  includeUnionDues: boolean;
  isSalaryIncrease: boolean;
}

interface MainSalaryInfoProps {
  control: Control<SalaryFormValues>;
  onCalculate?: () => void;
  onClear?: () => void;
  isLoading?: boolean;
  errors?: FieldErrors<SalaryFormValues>;
  isEditMode?: boolean;
  disableSalaryIncreaseToggle?: boolean;
}

export const MainSalaryInfo: React.FC<MainSalaryInfoProps> = ({
  control,
  onCalculate,
  onClear,
  isLoading = false,
  errors = {},
  isEditMode = false,
  disableSalaryIncreaseToggle = false,
}) => {
  const isSalaryIncrease = useWatch({
    control,
    name: "isSalaryIncrease",
  });

  return (
    <div className={styles.container}>
      <div className={styles.mainGrid}>
        <div className={styles.fieldWrapper}>
          <Controller
            control={control}
            name="grossSalary"
            render={({ field }) => (
              <FormInput
                id="salary-grossSalary"
                type="number"
                label="Əmək haqqı (GROSS)"
                placeholder="0.00"
                value={field.value === undefined || field.value === null ? "" : String(field.value)}
                onChange={(val) => field.onChange(val === "" ? "" : Number(val))}
                error={errors.grossSalary?.message}
              />
            )}
          />
        </div>
        
        <div className={styles.fieldWrapper}>
          <Controller
            control={control}
            name="cashSalary"
            render={({ field }) => (
              <FormInput
                id="salary-cashSalary"
                type="number"
                label="Əmək haqqı (kassa)"
                placeholder="0.00"
                value={field.value === undefined || field.value === null ? "" : String(field.value)}
                onChange={(val) => field.onChange(val === "" ? "" : Number(val))}
                error={errors.cashSalary?.message}
              />
            )}
          />
        </div>

        <div className={styles.fieldWrapper}>
          <Controller
            control={control}
            name="bonus"
            render={({ field }) => (
              <FormInput
                id="salary-bonus"
                type="number"
                label="Bonus"
                placeholder="0.00"
                value={field.value === undefined || field.value === null ? "" : String(field.value)}
                onChange={(val) => field.onChange(val === "" ? "" : Number(val))}
              />
            )}
          />
        </div>

        {/* 2nd Row */}
        <div className={styles.fieldWrapper}>
          <div className={styles.labelArea}>
            <label className={styles.label}>Hesablama ili <span className={styles.required}>*</span></label>
          </div>
          <Controller
            control={control}
            name="calculationYear"
            render={({ field }) => (
              <EnumLookupSelect
                id="calculation-year-select"
                code="SalaryCalculationYear"
                value={field.value}
                onChange={field.onChange}
                defaultText="Seçin"
                isClearable={true}
                error={errors.calculationYear?.message as string}
                disabled={isEditMode}
              />
            )}
          />
        </div>

        <div className={styles.checkboxGroup}>
          <Controller
            control={control}
            name="includeUnionDues"
            render={({ field: { value, onChange } }) => (
              <Checkbox
                id="includeUnionDues"
                checked={!!value}
                onChange={(checked) => onChange(checked)}
                label="Həmkarlar haqqı"
              />
            )}
          />
          {isEditMode && (
            <Controller
              control={control}
              name="isSalaryIncrease"
              render={({ field: { value, onChange } }) => (
                <Checkbox
                  id="isSalaryIncrease"
                  checked={!!value}
                  onChange={(checked) => onChange(checked)}
                  label="Maaş dəyişikliyi"
                  disabled={disableSalaryIncreaseToggle}
                />
              )}
            />
          )}
        </div>

        {isSalaryIncrease && isEditMode && (
          <div className={styles.fieldWrapper}>
            <div className={styles.labelArea}>
              <label className={styles.label}>Qüvvəyə minmə tarixi <span className={styles.required}>*</span></label>
            </div>
            <Controller
              control={control}
              name="calculationDateFrom"
              render={({ field }) => (
                <ModernDatePicker
                  id="salary-calculationDateFrom"
                  value={field.value ?? null}
                  onChange={field.onChange}
                  placeholder="dd.mm.yyyy"
                  error={errors.calculationDateFrom?.message as string}
                />
              )}
            />
          </div>
        )}
      </div>

      <div className={styles.actionRow}>
        <Button
          type="button"
          variant="outline"
          className={styles.calculateBtn}
          onClick={onCalculate}
          isLoading={isLoading}
        >
          {isEditMode ? "Yenilə" : "Hesabla"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          className={styles.calculateBtn}
          onClick={onClear}
        >
          Təmizlə
        </Button>
      </div>
    </div>
  );
};
