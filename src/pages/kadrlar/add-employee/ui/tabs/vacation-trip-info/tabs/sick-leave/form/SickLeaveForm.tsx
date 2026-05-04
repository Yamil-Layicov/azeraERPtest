import { useEffect } from "react";
import { useForm, type Path, type PathValue } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormInput, ModernDatePicker, Button } from "@/shared/ui";
import { PermissionGuard } from "@/features/auth/components/PermissionGuard";
import { PERMISSIONS } from "@/shared/consts/permissions";
import { useAddEmployeeStore } from "@/features/kadrlar/create-worker/model/useAddEmployeeStore";
import styles from "./SickLeaveForm.module.css";
import type { SickLeaveItem } from "../types";

interface SickLeaveFormProps {
    onSubmit: (item: SickLeaveItem) => Promise<boolean>;
    editItem?: SickLeaveItem | null;
    onClearEdit?: () => void;
}

type SickLeaveFormValues = {
    seriesNumber: string;
    medicalInstitution: string;
    diagnosis: string;
    dateFrom: Date | null;
    dateTo: Date | null;
};

const addIssue = (ctx: z.RefinementCtx, path: (string | number)[], message: string) => {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message, path });
};

const sickLeaveFormSchema = z
    .object({
        seriesNumber: z.string(),
        medicalInstitution: z.string(),
        diagnosis: z.string(),
        dateFrom: z.date().nullable(),
        dateTo: z.date().nullable(),
    })
    .superRefine((data, ctx) => {
        if (!data.seriesNumber.trim()) {
            addIssue(ctx, ["seriesNumber"], "Vərəqənin seriya ve nömrəsi vacibdir");
        }
        if (!data.medicalInstitution.trim()) {
            addIssue(ctx, ["medicalInstitution"], "Vərəqəni verən tibbi müəssisə vacibdir");
        }
        if (!data.diagnosis.trim()) {
            addIssue(ctx, ["diagnosis"], "Diaqnoz vacibdir");
        }
        if (!data.dateFrom) {
            addIssue(ctx, ["dateFrom"], "Hansı gündən vacibdir");
        }
        if (!data.dateTo) {
            addIssue(ctx, ["dateTo"], "Hansı günədək vacibdir");
        }
        if (data.dateFrom && data.dateTo && data.dateTo < data.dateFrom) {
            addIssue(ctx, ["dateTo"], "Bitmə tarixi başlama tarixindən evvel ola bilmez");
        }
    });

const defaultSickLeaveFormValues: SickLeaveFormValues = {
    seriesNumber: "",
    medicalInstitution: "",
    diagnosis: "",
    dateFrom: null,
    dateTo: null,
};

export const SickLeaveForm = ({ onSubmit, editItem = null, onClearEdit }: SickLeaveFormProps) => {
    const globalEmployeeId = useAddEmployeeStore((s) => s.employeeId);

    const {
        watch,
        setValue,
        handleSubmit,
        reset,
        clearErrors,
        formState: { errors },
    } = useForm<SickLeaveFormValues>({
        resolver: zodResolver(sickLeaveFormSchema),
        defaultValues: defaultSickLeaveFormValues,
        mode: "onTouched",
    });

    const seriesNumber = watch("seriesNumber");
    const medicalInstitution = watch("medicalInstitution");
    const diagnosis = watch("diagnosis");
    const dateFrom = watch("dateFrom");
    const dateTo = watch("dateTo");

    const setField = <P extends Path<SickLeaveFormValues>>(field: P, value: PathValue<SickLeaveFormValues, P>) => {
        setValue(field, value, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
    };

    useEffect(() => {
        if (!editItem) {
            reset(defaultSickLeaveFormValues);
            return;
        }
        reset({
            seriesNumber: editItem.seriesNumber,
            medicalInstitution: editItem.medicalInstitution,
            diagnosis: editItem.diagnosis,
            dateFrom: editItem.dateFrom,
            dateTo: editItem.dateTo,
        });
        clearErrors();
    }, [editItem, reset, clearErrors]);

    const handleClear = () => {
        reset(defaultSickLeaveFormValues);
        clearErrors();
        onClearEdit?.();
    };

    const onSubmitForm = async (data: SickLeaveFormValues) => {
        const newItem: SickLeaveItem = {
            id: editItem?.id ?? Date.now().toString(),
            employeeId: editItem?.employeeId ?? globalEmployeeId,
            seriesNumber: data.seriesNumber.trim(),
            medicalInstitution: data.medicalInstitution.trim(),
            diagnosis: data.diagnosis.trim(),
            dateFrom: data.dateFrom!,
            dateTo: data.dateTo!,
        };
        const ok = await onSubmit(newItem);
        if (ok) handleClear();
    };

    return (
        <div className={styles.grid}>
            <div className={styles.fieldGroup}>
                <FormInput
                    id="seriesNumber"
                    type="text"
                    label="Vərəqənin seriya ve nömrəsi"
                    placeholder="Daxil edin"
                    value={seriesNumber}
                    onChange={(val) => setField("seriesNumber", val)}
                    error={errors.seriesNumber?.message}
                    required
                />
            </div>
            <div className={styles.fieldGroup}>
                <FormInput
                    id="medicalInstitution"
                    type="text"
                    label="Vərəqəni verən tibbi müəssisə"
                    placeholder="Daxil edin"
                    value={medicalInstitution}
                    onChange={(val) => setField("medicalInstitution", val)}
                    error={errors.medicalInstitution?.message}
                    required
                />
            </div>
            <div className={styles.fieldGroup}>
                <FormInput
                    id="diagnosis"
                    type="text"
                    label="Diaqnoz"
                    placeholder="Daxil edin"
                    value={diagnosis}
                    onChange={(val) => setField("diagnosis", val)}
                    error={errors.diagnosis?.message}
                    required
                />
            </div>
            <div className={styles.fieldGroup}>
                <label className={styles.label}>
                    Hansı gündən <span className={styles.required}>*</span>
                </label>
                <ModernDatePicker
                    value={dateFrom}
                    onChange={(val) => setField("dateFrom", val)}
                    placeholder="dd.mm.yyyy"
                    error={errors.dateFrom?.message}
                />
            </div>
            <div className={styles.fieldGroup}>
                <label className={styles.label}>
                    Hansı günədək <span className={styles.required}>*</span>
                </label>
                <ModernDatePicker
                    value={dateTo}
                    onChange={(val) => setField("dateTo", val)}
                    placeholder="dd.mm.yyyy"
                    error={errors.dateTo?.message}
                />
            </div>
            <div className={styles.actions}>
                <PermissionGuard
                    permission={editItem ? PERMISSIONS.EMPLOYEE.UPDATE : PERMISSIONS.EMPLOYEE.CREATE}
                >
                    <Button type="button" variant="secondary" className={styles.addButton} onClick={handleSubmit(onSubmitForm)}>
                        {editItem ? "Yenilə" : "Əlavə et"}
                    </Button>
                </PermissionGuard>
                <Button type="button" variant="outline" className={styles.clearButton} onClick={handleClear}>
                    Təmizlə
                </Button>
            </div>
        </div>
    );
};
