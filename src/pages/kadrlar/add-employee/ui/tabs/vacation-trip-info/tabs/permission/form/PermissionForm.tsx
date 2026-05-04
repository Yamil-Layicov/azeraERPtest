import { useEffect, useState } from "react";
import { useForm, type Path, type PathValue } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { FormInput, ModernDatePicker, Button, FormTextarea, TimePicker } from "@/shared/ui";
import { EnumLookupSelect } from "@/features/lookups";
import { toast } from "react-hot-toast";
import styles from "./PermissionForm.module.css";
import { createWorkerService } from "@/features/kadrlar/create-worker/api/createWorkerService";
import type { TimeOffEntryRequest } from "@/features/kadrlar/create-worker/model/types";
import { getBackendErrorMessage } from "@/shared/api";
import { formatDateToYMD } from "@/shared/lib/utils";
import { PermissionGuard } from "@/features/auth/components/PermissionGuard";
import { PERMISSIONS } from "@/shared/consts/permissions";
import {
  permissionFormSchema,
  defaultPermissionFormValues,
  type PermissionFormValues,
} from "./permissionFormSchema";

interface PermissionFormProps {
  personId: string | null;
  /** Uğurlu POST-dan sonra cədvəli yeniləmək üçün */
  onAdded?: () => void;
  /** Düzəliş rejimi üçün sətir id-si */
  editingId?: string | null;
  /** Hər düzəliş klikində artır — form reset */
  editFormKey?: number;
  /** Düzəliş üçün form dəyərləri */
  editValues?: PermissionFormValues | null;
  /** Təmizlə / uğurlu əlavə/yeniləmədən sonra düzəliş state-i təmizlə */
  onClearEdit?: () => void;
  employeeId?: string | null;
  rootCompanyId?: string | null;
}

export const PermissionForm = ({
  personId,
  onAdded,
  editingId = null,
  editFormKey = 0,
  editValues = null,
  onClearEdit,
  employeeId = null,
  rootCompanyId = null,
}: PermissionFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    watch,
    setValue,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm<PermissionFormValues>({
    resolver: zodResolver(permissionFormSchema),
    defaultValues: defaultPermissionFormValues,
    mode: "onTouched",
  });
  const timeOffType = watch("timeOffType");
  const timeOffReason = watch("timeOffReason");
  const issueDate = watch("issueDate");
  const startTime = watch("startTime");
  const endTime = watch("endTime");
  const approvedBy = watch("approvedBy");
  const note = watch("note");

  const setField = <P extends Path<PermissionFormValues>>(field: P, value: PathValue<PermissionFormValues, P>) => {
    setValue(field, value, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
  };

  useEffect(() => {
    if (!editValues || !editFormKey) return;
    reset(editValues);
    clearErrors();
  }, [editFormKey, editValues, reset, clearErrors]);

  const onSubmitForm = async (data: PermissionFormValues) => {
    if (!personId) {
      toast.error("İşçi ID tapılmadı");
      return;
    }

    const vt = data.timeOffType;
    const vr = data.timeOffReason;
    if (!vt?.id || !vr?.id) return;

    const issueYmd = formatDateToYMD(data.issueDate);
    if (!issueYmd || !data.startTime || !data.endTime) return;

    const isModify = Boolean(editingId);
    const normalizedEmployeeId =
      employeeId != null && String(employeeId).trim() !== ""
        ? String(employeeId).trim()
        : null;

    const normalizedRootCompanyId =
      rootCompanyId != null && String(rootCompanyId).trim() !== ""
        ? String(rootCompanyId).trim()
        : null;

    const payload: TimeOffEntryRequest = {
      personId,
      id: isModify ? editingId : null,
      isModify,
      timeOffTypeCode: String(vt.id),
      timeOffReasonCode: String(vr.id),
      issueDate: issueYmd,
      startTime: data.startTime,
      endTime: data.endTime,
      approvedBy: data.approvedBy.trim(),
      note: data.note.trim(),
      employeeId: normalizedEmployeeId,
      rootCompanyId: normalizedRootCompanyId,
    };

    setIsSubmitting(true);
    try {
      const response = (await createWorkerService.addOrEditTimeOffInfo(payload)) as {
        isSuccess?: boolean;
        errorMessage?: string | null;
        result?: { id?: string } | string;
      };
      if (response?.isSuccess === false) {
        toast.error(response?.errorMessage ?? "");
        return;
      }

      reset(defaultPermissionFormValues);
      onClearEdit?.();
      toast.success(isModify ? "İcazə yeniləndi" : "İcazə əlavə edildi");
      onAdded?.();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(getBackendErrorMessage(error));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClear = () => {
    reset(defaultPermissionFormValues);
    clearErrors();
    onClearEdit?.();
  };

  return (
    <div className={styles.grid}>
      <div className={styles.fieldGroup}>
        <label className={styles.label}>
          Növü <span className={styles.required}>*</span>
        </label>
        <div className={styles.controlWrap}>
          <EnumLookupSelect
            id="permission-type"
            code="TimeOffTypes"
            defaultText="Seçin"
            value={timeOffType}
            onChange={(v) => setField("timeOffType", v)}
            error={errors.timeOffType?.message}
          />
        </div>
      </div>
      <div className={styles.fieldGroup}>
        <label className={styles.label}>
          Səbəb <span className={styles.required}>*</span>
        </label>
        <div className={styles.controlWrap}>
          <EnumLookupSelect
            id="permission-reason"
            code="TimeOffReasons"
            defaultText="Seçin"
            value={timeOffReason}
            onChange={(v) => setField("timeOffReason", v)}
            error={errors.timeOffReason?.message}
          />
        </div>
      </div>
      <div className={styles.fieldGroup}>
        <label className={styles.label}>
          İcazə verilən tarix <span className={styles.required}>*</span>
        </label>
        <ModernDatePicker
          id="permission-issue-date"
          value={issueDate}
          onChange={(v) => setField("issueDate", v)}
          placeholder="dd.mm.yyyy"
          error={errors.issueDate?.message}
        />
      </div>

      <div className={styles.fieldGroup}>
        <div className={styles.twoColumnGroup}>
          <div className={styles.subField}>
            <TimePicker
              id="permission-start-time"
              label="Başlama saatı"
              required
              value={startTime}
              onChange={(v) => setField("startTime", v)}
              placeholder="HH:mm"
              error={errors.startTime?.message}
            />
          </div>
          <div className={styles.subField}>
            <TimePicker
              id="permission-end-time"
              label="Bitmə saatı"
              required
              value={endTime}
              onChange={(v) => setField("endTime", v)}
              placeholder="HH:mm"
              align="right"
              error={errors.endTime?.message}
            />
          </div>
        </div>
      </div>
      <div className={styles.fieldGroup}>
        <FormInput
          id="approver"
          type="text"
          label="İcazəni təsdiq edən rəhbər"
          placeholder="Daxil edin"
          value={approvedBy}
          onChange={(val) => setField("approvedBy", val)}
          required={true}
          error={errors.approvedBy?.message}
        />
      </div>
      <div className={styles.fieldGroup}>
        <FormTextarea
          id="note"
          label="Qeyd"
          placeholder="Daxil edin"
          value={note}
          onChange={(val) => setField("note", val)}
          rows={1}
          required={false}
          error={errors.note?.message}
        />
      </div>

      <div className={styles.actions}>
        <PermissionGuard
          permission={editingId ? PERMISSIONS.EMPLOYEE.UPDATE : PERMISSIONS.EMPLOYEE.CREATE}
        >
          <Button
            type="button"
            variant="secondary"
            className={styles.addButton}
            onClick={handleSubmit(onSubmitForm)}
            disabled={isSubmitting}
          >
            {editingId ? "Yenilə" : "Əlavə et"}
          </Button>
        </PermissionGuard>
        <Button
          type="button"
          variant="outline"
          className={styles.clearButton}
          onClick={handleClear}
          disabled={isSubmitting}
        >
          Təmizlə
        </Button>
      </div>
    </div>
  );
};
