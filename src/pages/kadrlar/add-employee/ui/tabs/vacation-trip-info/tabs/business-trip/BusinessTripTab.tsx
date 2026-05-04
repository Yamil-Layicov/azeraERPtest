import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, type Path, type PathValue } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FormInput, ModernDatePicker, Button, ConfirmModal } from "@/shared/ui";
import { BusinessTripTable } from "./BusinessTripTable";
import type { BusinessTripItem } from "./BusinessTripTable";
import styles from "./BusinessTripTab.module.css";
import { toast } from "react-hot-toast";
import { useAddEmployeeStore } from "@/features/kadrlar/create-worker/model/useAddEmployeeStore";
import { createWorkerService } from "@/features/kadrlar/create-worker/api/createWorkerService";
import type { BusinessTripEntryRequest, BusinessTripsInfoListItem } from "@/features/kadrlar/create-worker/model/types";
import { getBackendErrorMessage } from "@/shared/api";
import { formatDateToYMD } from "@/shared/lib/utils";
import { PermissionGuard } from "@/features/auth/components/PermissionGuard";
import { PERMISSIONS } from "@/shared/consts/permissions";
import {
  businessTripFormSchema,
  defaultBusinessTripFormValues,
  type BusinessTripFormValues,
} from "./businessTripFormSchema";
import { useEmployeeStore } from "@/features/kadrlar/create-worker/model/useEmployeeStore";

type InnerTab = "vacation" | "business-trip" | "permission" | "sick-leave" | "privileges" | "special-notes";

interface BusinessTripTabProps {
  activeInnerTab?: InnerTab;
  /** Ana tabda «Ezamiyyət» düyməsinə hər klikdə artır — GET refetch */
  tabVisitKey?: number;
}

const parseApiDate = (s: string | null | undefined): Date => {
  if (!s) return new Date(NaN);
  const d = new Date(s);
  if (!Number.isNaN(d.getTime())) return d;
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(s).trim());
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return new Date(NaN);
};

const pickStr = (...vals: unknown[]): string => {
  for (const v of vals) {
    if (v === null || v === undefined) continue;
    const t = String(v).trim();
    if (t !== "") return t;
  }
  return "";
};

const mapApiRowToItem = (row: BusinessTripsInfoListItem | Record<string, unknown>): BusinessTripItem => {
  const r = row as Record<string, unknown>;
  const id = pickStr(row.id, r.Id);
  const employeeId = pickStr(row.employeeId, r.EmployeeId);
  const destination = pickStr(row.destination, r.Destination);
  const reason = pickStr(row.reason, r.Reason);
  const orderNumber = pickStr(row.orderNumber, r.OrderNumber);

  const startRaw = pickStr(row.startDate, r.StartDate);
  const endRaw = pickStr(row.endDate, r.EndDate);
  const returnRaw = pickStr(row.returnToWorkDate, r.ReturnToWorkDate);
  const orderRaw = pickStr(row.orderDate, r.OrderDate);

  const startDate = parseApiDate(startRaw);
  const endDate = parseApiDate(endRaw);
  const returnToWorkDate = returnRaw ? parseApiDate(returnRaw) : null;
  const orderDateParsed = parseApiDate(orderRaw);

  let duration = 1;
  if (!Number.isNaN(startDate.getTime()) && !Number.isNaN(endDate.getTime())) {
    const diff = endDate.getTime() - startDate.getTime();
    duration = Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1);
  }

  const returnValid = returnToWorkDate && !Number.isNaN(returnToWorkDate.getTime());

  return {
    id,
    employeeId,
    destination,
    reason,
    startDate,
    endDate,
    returnToWorkDate: returnValid ? returnToWorkDate : null,
    duration,
    orderDate: orderDateParsed,
    orderNumber,
  };
};

const safeTripDate = (d: Date): Date | null => {
  if (!d || Number.isNaN(d.getTime())) return null;
  return d;
};

export const BusinessTripTab = ({
  activeInnerTab = "business-trip",
  tabVisitKey = 0,
}: BusinessTripTabProps) => {
  const personId = useAddEmployeeStore((s) => s.personId);
  const employeeId = useAddEmployeeStore((s) => s.employeeId);
  const rootCompanyIdFromAdd = useAddEmployeeStore((s) => s.rootCompanyId);
  const currentStep = useAddEmployeeStore((s) => s.currentStep);
  const currentRootCompanyId = useEmployeeStore((state) => state.rootCompanyId);
  const effectiveRootCompanyId = rootCompanyIdFromAdd ?? currentRootCompanyId;
  const normalizedEmployeeId =
    employeeId != null && String(employeeId).trim() !== ""
      ? String(employeeId).trim()
      : null;
  const rootCompanyIdForPayload =
    effectiveRootCompanyId != null && String(effectiveRootCompanyId).trim() !== ""
      ? String(effectiveRootCompanyId).trim()
      : "";

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    watch,
    setValue,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm<BusinessTripFormValues>({
    resolver: zodResolver(businessTripFormSchema),
    defaultValues: defaultBusinessTripFormValues,
    mode: "onTouched",
  });

  const destination = watch("destination");
  const reason = watch("reason");
  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const orderDate = watch("orderDate");
  const orderNumber = watch("orderNumber");

  const setField = <P extends Path<BusinessTripFormValues>>(
    field: P,
    value: PathValue<BusinessTripFormValues, P>,
  ) => {
    setValue(field, value, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
  };

  const { data: tripsData, refetch, isFetching } = useQuery({
    queryKey: ["businessTripsInfo", personId],
    queryFn: () => createWorkerService.getBusinessTripsInfoByPersonId(personId!),
    enabled: false,
  });

  useEffect(() => {
    if (!personId) return;
    if (currentStep !== 9) return;
    if (activeInnerTab !== "business-trip") return;
    void refetch();
  }, [personId, currentStep, activeInnerTab, tabVisitKey, refetch]);

  const list = useMemo(() => {
    if (!tripsData?.isSuccess || !Array.isArray(tripsData.result)) return [];
    return tripsData.result.map((row) => mapApiRowToItem(row));
  }, [tripsData]);

  const resetForm = useCallback(() => {
    setEditingId(null);
    reset(defaultBusinessTripFormValues);
  }, [reset]);

  const handleClear = () => {
    resetForm();
  };

  const onSubmitForm = async (data: BusinessTripFormValues) => {
    if (!personId) {
      toast.error("İşçi ID tapılmadı");
      return;
    }

    const startYmd = formatDateToYMD(data.startDate);
    const endYmd = formatDateToYMD(data.endDate);
    const orderYmd = formatDateToYMD(data.orderDate);
    if (!startYmd || !endYmd || !orderYmd) {
      toast.error("Tarixlər düzgün deyil");
      return;
    }

    const payload: BusinessTripEntryRequest = {
      personId,
      id: editingId,
      isModify: Boolean(editingId),
      destination: data.destination.trim(),
      reason: data.reason.trim(),
      startDate: startYmd,
      endDate: endYmd,
      orderNumber: data.orderNumber.trim(),
      orderDate: orderYmd,
      employeeId: normalizedEmployeeId,
      rootCompanyId: rootCompanyIdForPayload || null,
    };

    setIsSubmitting(true);
    try {
      const response = (await createWorkerService.addOrEditBusinessTripInfo(payload)) as {
        isSuccess?: boolean;
        errorMessage?: string | null;
      };
      if (response?.isSuccess === false) {
        toast.error(response?.errorMessage ?? "");
        return;
      }
      toast.success(editingId ? "Ezamiyyət yeniləndi" : "Ezamiyyət əlavə edildi");
      setEditingId(null);
      reset(defaultBusinessTripFormValues);
      await refetch();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(getBackendErrorMessage(error));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (id: string) => {
    const item = list.find((x) => x.id === id);
    if (!item) {
      toast.error("Məlumat tapılmadı");
      return;
    }
    setEditingId(id);
    reset({
      destination: item.destination,
      reason: item.reason,
      startDate: safeTripDate(item.startDate),
      endDate: safeTripDate(item.endDate),
      orderDate: safeTripDate(item.orderDate),
      orderNumber: item.orderNumber,
    });
    clearErrors();
  };

  const requestDelete = (id: string) => {
    setDeleteId(id);
    setIsDeleteOpen(true);
  };

  const closeDelete = () => {
    if (isDeleting) return;
    setIsDeleteOpen(false);
    setDeleteId(null);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const response = (await createWorkerService.removeBusinessTripInfo(deleteId)) as {
        isSuccess?: boolean;
        errorMessage?: string | null;
      };
      if (response?.isSuccess === false) {
        toast.error(response?.errorMessage ?? "Silinərkən xəta baş verdi");
        return;
      }
      toast.success("Silindi");
      if (editingId === deleteId) resetForm();
      await refetch();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(getBackendErrorMessage(error));
      } else {
        toast.error("Silinmə zamanı xəta baş verdi");
      }
    } finally {
      setIsDeleting(false);
      setIsDeleteOpen(false);
      setDeleteId(null);
    }
  };

  return (
    <div className={styles.container}>
      {isFetching && <p className={styles.fetchingText}>Yüklənir...</p>}
      <div className={styles.grid}>
        <div className={styles.fieldGroup}>
          <FormInput
            id="trip-destination"
            type="text"
            label="Getdiyi yerwqw"
            required={true}
            placeholder="Daxil edin"
            value={destination}
            onChange={(val) => setField("destination", val)}
            error={errors.destination?.message}
          />
        </div>
        <div className={styles.fieldGroup}>
          <FormInput
            id="trip-reason"
            type="text"
            label="Səbəb"
            required={true}
            placeholder="Daxil edin"
            value={reason}
            onChange={(val) => setField("reason", val)}
            error={errors.reason?.message}
          />
        </div>
        <div className={styles.fieldGroup}>
          <div className={styles.twoColumnGroup}>
            <div className={styles.subField}>
              <label className={styles.label}>
                Başlama tarixi <span className={styles.required}>*</span>
              </label>
              <ModernDatePicker
                id="trip-start"
                placeholder="dd.mm.yyyy"
                value={startDate}
                onChange={(v) => setField("startDate", v)}
                error={errors.startDate?.message}
              />
            </div>
            <div className={styles.subField}>
              <label className={styles.label}>
                Bitmə tarixi <span className={styles.required}>*</span>
              </label>
              <ModernDatePicker
                id="trip-end"
                placeholder="dd.mm.yyyy"
                value={endDate}
                onChange={(v) => setField("endDate", v)}
                align="right"
                error={errors.endDate?.message}
              />
            </div>
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <div className={styles.twoColumnGroup}>
            <div className={styles.subField}>
              <label className={styles.label}>
                Əmr tarixi <span className={styles.required}>*</span>
              </label>
              <ModernDatePicker
                id="trip-order-date"
                placeholder="dd.mm.yyyy"
                value={orderDate}
                onChange={(v) => setField("orderDate", v)}
                error={errors.orderDate?.message}
              />
            </div>
            <div className={styles.subField}>
              <FormInput
                id="trip-order-number"
                type="text"
                placeholder="Daxil edin"
                label="Əmr nömrəsi"
                required={true}
                value={orderNumber}
                onChange={(val) => setField("orderNumber", val)}
                error={errors.orderNumber?.message}
              />
            </div>
          </div>
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
              {editingId ? "Yadda saxla" : "Əlavə et"}
            </Button>
          </PermissionGuard>
          <Button type="button" variant="outline" className={styles.clearButton} onClick={handleClear} disabled={isSubmitting}>
            Təmizlə
          </Button>
        </div>
      </div>

      <BusinessTripTable data={list} onDelete={requestDelete} onEdit={handleEdit} />

      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={closeDelete}
        onConfirm={() => void confirmDelete()}
        title="Ezamiyyəti silmək istədiyinizə əminsiniz?"
        description="Bu məlumatı sildikdə geri qaytara bilməyəcəksiniz."
        confirmText="Sil"
        cancelText="Ləğv et"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};
