import React from "react";
import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";
import styles from "./MainSalaryInfo.module.css";
import { FormInput } from "@/shared/ui/input";
import { CustomSelect } from "@/shared/ui/select";
import { Checkbox } from "@/shared/ui/checkbox";
import type { Option } from "@/shared/types";
import { Button } from "@/shared/ui";

export interface SalaryFormValues {
  grossSalary: "" | number;
  cashSalary: "" | number;
  bonus: "" | number;
  calculationYear: Option | null;
  includeUnionDues: boolean;
}

const yearOptions: Option[] = [
  { id: "2026", fullName: "2026", role: "" },
  { id: "2027", fullName: "2027", role: "" },
  { id: "2028", fullName: "2028", role: "" },
];

interface MainSalaryInfoProps {
  control: Control<SalaryFormValues>;
  onCalculate?: () => void;
}

export const MainSalaryInfo: React.FC<MainSalaryInfoProps> = ({
  control,
  onCalculate,
}) => {
  return (
    <div className={styles.container}>
      {/* 1-ci Row: 3 Input */}
      <div className={styles.gridrow}>
        <Controller
          control={control}
          name="grossSalary"
          render={({ field }) => (
            <FormInput
              id="salary-grossSalary"
              type="number"
              label="Əmək haqqı (GROSS)"
              placeholder="0.00"
              value={
                field.value === undefined || field.value === null
                  ? ""
                  : String(field.value)
              }
              onChange={(val) => field.onChange(val === "" ? "" : Number(val))}
            />
          )}
        />
        <Controller
          control={control}
          name="cashSalary"
          render={({ field }) => (
            <FormInput
              id="salary-cashSalary"
              type="number"
              label="Əmək haqqı (kassa)"
              placeholder="0.00"
              value={
                field.value === undefined || field.value === null
                  ? ""
                  : String(field.value)
              }
              onChange={(val) => field.onChange(val === "" ? "" : Number(val))}
            />
          )}
        />
        <Controller
          control={control}
          name="bonus"
          render={({ field }) => (
            <FormInput
              id="salary-bonus"
              type="number"
              label="Bonus"
              placeholder="0.00"
              value={
                field.value === undefined || field.value === null
                  ? ""
                  : String(field.value)
              }
              onChange={(val) => field.onChange(val === "" ? "" : Number(val))}
            />
          )}
        />
      </div>

      {/* 2-ci Row: Select və Checkbox */}
      <div className={styles.bottomRow}>
        <div className={styles.selectWrapper}>
          <span className={styles.selectLabel}>
            Hesablama ili <span className={styles.required}>*</span>
          </span>
          <Controller
            control={control}
            name="calculationYear"
            render={({ field }) => (
              <CustomSelect
                options={yearOptions}
                value={field.value}
                onChange={field.onChange}
                defaultText="Seçin"
              />
            )}
          />
        </div>

        <div className={styles.checkboxWrapper}>
          <Controller
            control={control}
            name="includeUnionDues"
            render={({ field: { value, onChange } }) => (
              <Checkbox
                id="includeUnionDues"
                checked={!!value}
                onChange={(checked) => onChange(checked)}
                label="Həmkarlar haqqı daxil edin"
              />
            )}
          />
        </div>
      </div>

      <div className={styles.actionRow}>
        <Button
          type="button"
          variant="secondary"
          className={styles.calculateBtn}
          onClick={onCalculate}
        >
          Hesabla
        </Button>
      </div>
    </div>
  );
};
