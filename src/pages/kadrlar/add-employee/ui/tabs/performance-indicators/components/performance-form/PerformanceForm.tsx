import React, { useEffect } from "react";
import { FormInput, ModernDatePicker, Button } from "@/shared/ui";
import { PermissionGuard } from "@/features/auth/components/PermissionGuard";
import { PERMISSIONS } from "@/shared/consts/permissions";
import styles from "./PerformanceForm.module.css";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export type PerformanceFormValue = {
  il: Date | null;
  qiymet: string;
  illikBonusMeblegi: string;
};

const performanceFormSchema = z.object({
  il: z.date().nullable().refine((v) => v !== null, { message: "İl vacibdir" }),
  qiymet: z.string().trim().min(1, { message: "Qiymət vacibdir" }),
  illikBonusMeblegi: z.string().trim().min(1, { message: "İllik bonus məbləği vacibdir" }),
});

export interface PerformanceFormProps {
  value: PerformanceFormValue;
  onAdd: (values: PerformanceFormValue) => void;
  addButtonLabel?: string;
  isEditMode?: boolean;
}

export const PerformanceForm: React.FC<PerformanceFormProps> = ({
  value,
  onAdd,
  addButtonLabel = "Əlavə et",
  isEditMode = false,
}) => {
  const {
    reset,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PerformanceFormValue>({
    resolver: zodResolver(performanceFormSchema),
    mode: "onTouched",
    defaultValues: value,
  });

  // Keep RHF in sync with edit/reset values coming from parent.
  useEffect(() => {
    reset(value);
  }, [value.il, value.qiymet, value.illikBonusMeblegi, reset]);

  const current = watch();

  return (
    <div className={styles.container}>
      <div className={styles.formRow}>
        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="performance-il">
            İl <span className="required-star">*</span>
          </label>
          <ModernDatePicker
            id="performance-il"
            value={current.il}
            onChange={(v) =>
              setValue("il", v, { shouldDirty: true, shouldValidate: true, shouldTouch: true })
            }
            mode="year"
            placeholder="yyyy"
            error={errors.il?.message}
          />
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="performance-qiymet">
            Qiymət <span className="required-star">*</span>
          </label>
          <FormInput
            id="performance-qiymet"
            type="number"
            label=""
            required={false}
            placeholder="Daxil edin"
            value={current.qiymet}
            onChange={(val) =>
              setValue("qiymet", val, { shouldDirty: true, shouldValidate: true, shouldTouch: true })
            }
            error={errors.qiymet?.message}
          />
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="performance-illik-bonus">
            İllik bonus məbləği <span className="required-star">*</span>
          </label>
          <FormInput
            id="performance-illik-bonus"
            type="number"
            label=""
            required={false}
            placeholder="Daxil edin"
            value={current.illikBonusMeblegi}
            onChange={(val) =>
              setValue("illikBonusMeblegi", val, { shouldDirty: true, shouldValidate: true, shouldTouch: true })
            }
            error={errors.illikBonusMeblegi?.message}
          />
        </div>
        <div className={styles.buttonCell}>
          <PermissionGuard
            permission={isEditMode ? PERMISSIONS.EMPLOYEE.UPDATE : PERMISSIONS.EMPLOYEE.CREATE}
          >
            <Button
              variant="secondary"
              onClick={() => {
                void handleSubmit(onAdd)();
              }}
              type="button"
              className={styles.addButton}
            >
              {addButtonLabel}
            </Button>
          </PermissionGuard>
        </div>
      </div>
    </div>
  );
};
