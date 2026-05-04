import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";
import { ConfirmModal } from "@/shared/ui";
import { getBackendErrorMessage } from "@/shared/api";
import styles from "./PermissionInfoTab.module.css";
import { PermissionForm } from "./form";
import { PermissionTable } from "./table";
import type { PermissionItem } from "./types";
import { useAddEmployeeStore } from "@/features/kadrlar/create-worker/model/useAddEmployeeStore";
import { createWorkerService } from "@/features/kadrlar/create-worker/api/createWorkerService";
import type { TimeOffsInfoListItem } from "@/features/kadrlar/create-worker/model/types";
import { useEnumItemsByCode } from "@/features/lookups";
import type { EnumLookupItem } from "@/features/lookups/model/types";
import { mapEnumItemsToOptions } from "@/features/lookups/lib/mapEnumItemsToOptions";
import type { Option } from "@/shared/types";
import type { PermissionFormValues } from "./form/permissionFormSchema";
import { useEmployeeStore } from "@/features/kadrlar/create-worker/model/useEmployeeStore";

const matchLookupCode = (code: string, row: { value?: unknown; id?: unknown; code?: unknown }) => {
  const c = code.trim().toLowerCase();
  const v = String(row.value ?? "").trim().toLowerCase();
  const id = String(row.id ?? "").trim().toLowerCase();
  const co = String(row.code ?? "").trim().toLowerCase();
  return v === c || id === c || co === c;
};

const resolveLookupLabel = (code: string | undefined, items: EnumLookupItem[]): string => {
  if (!code?.trim()) return "-";
  if (!items.length) return code.trim();
  const found = items.find((item) => matchLookupCode(code, item));
  if (found) {
    const label =
      found.fullName ??
      found.displayName ??
      found.label ??
      (typeof found.name === "string" ? found.name : undefined) ??
      (found.value != null ? String(found.value) : "");
    return label.trim() || code.trim();
  }
  return code.trim();
};

/** API "HH:mm:ss" və ya "HH:mm" → cədvəldə qısa göstəriş */
const formatTimeDisplay = (raw: string | undefined): string => {
  const t = String(raw ?? "").trim();
  if (!t) return "-";
  const parts = t.split(":");
  if (parts.length >= 2) {
    const hour = parts[0]?.padStart?.(2, "0") ?? "00";
    const minute = parts[1]?.padStart?.(2, "0") ?? "00";
    return `${hour}:${minute}`;
  }
  return t;
};

const safeDate = (d: Date): Date | null => {
  if (!d || Number.isNaN(d.getTime())) return null;
  return d;
};

const findOptionForCode = (code: string, items: EnumLookupItem[]): Option | null => {
  const found = items.find((item) => matchLookupCode(code, item));
  if (!found) return null;
  const opts = mapEnumItemsToOptions([found]);
  return opts[0] ?? null;
};

const fallbackOption = (code: string, label: string): Option => ({
  id: code,
  fullName: label,
  label,
});

const itemToFormValues = (
  item: PermissionItem,
  typeItems: EnumLookupItem[],
  reasonItems: EnumLookupItem[],
): PermissionFormValues => {
  const typeOpt =
    findOptionForCode(item.timeOffTypeCode, typeItems) ??
    fallbackOption(item.timeOffTypeCode, item.type);
  const reasonOpt =
    findOptionForCode(item.timeOffReasonCode, reasonItems) ??
    fallbackOption(item.timeOffReasonCode, item.reason);
  const st = item.startTime === "-" ? null : item.startTime;
  const et = item.endTime === "-" ? null : item.endTime;
  return {
    timeOffType: typeOpt,
    timeOffReason: reasonOpt,
    issueDate: safeDate(item.date),
    startTime: st,
    endTime: et,
    approvedBy: item.approver,
    note: item.note,
  };
};

type InnerTab = "vacation" | "business-trip" | "permission" | "sick-leave" | "privileges" | "special-notes";

interface PermissionInfoTabProps {
  activeInnerTab?: InnerTab;
  /** Ana tabda «İcazə» düyməsinə hər klikdə artır — GET refetch */
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

const mapApiRowToItem = (
  row: TimeOffsInfoListItem | Record<string, unknown>,
  typeLookups: EnumLookupItem[],
  reasonLookups: EnumLookupItem[],
): PermissionItem => {
  const r = row as Record<string, unknown>;
  const id = pickStr(row.id, r.Id);
  const employeeId = pickStr(row.employeeId, r.EmployeeId);
  const typeCode = pickStr(row.timeOffTypeCode, r.TimeOffTypeCode);
  const reasonCode = pickStr(row.timeOffReasonCode, r.TimeOffReasonCode);
  const typeLabel =
    pickStr(row.timeOffTypeName, r.TimeOffTypeName) ||
    resolveLookupLabel(typeCode, typeLookups);
  const reasonLabel =
    pickStr(row.timeOffReasonName, r.TimeOffReasonName) ||
    resolveLookupLabel(reasonCode, reasonLookups);
  const issueRaw = pickStr(row.issueDate, r.IssueDate);
  const date = parseApiDate(issueRaw);
  const startRaw = pickStr(row.startTime, r.StartTime);
  const endRaw = pickStr(row.endTime, r.EndTime);
  return {
    id,
    employeeId,
    type: typeLabel || "-",
    reason: reasonLabel || "-",
    timeOffTypeCode: typeCode || "",
    timeOffReasonCode: reasonCode || "",
    date,
    startTime: formatTimeDisplay(startRaw),
    endTime: formatTimeDisplay(endRaw),
    approver: pickStr(row.approvedBy, r.ApprovedBy) || "",
    note: pickStr(row.note, r.Note) || "",
  };
};

export const PermissionInfoTab = ({
  activeInnerTab = "permission",
  tabVisitKey = 0,
}: PermissionInfoTabProps) => {
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
  const normalizedRootCompanyId =
    effectiveRootCompanyId != null &&
    String(effectiveRootCompanyId).trim() !== ""
      ? String(effectiveRootCompanyId).trim()
      : null;
  
  const lookupsEnabled = currentStep === 9 && activeInnerTab === "permission";
  const { rawData: timeOffTypesRaw } = useEnumItemsByCode("TimeOffTypes", lookupsEnabled);
  const { rawData: timeOffReasonsRaw } = useEnumItemsByCode("TimeOffReasons", lookupsEnabled);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [timeOffIdToDelete, setTimeOffIdToDelete] = useState<string | null>(null);
  const [isDeletingTimeOff, setIsDeletingTimeOff] = useState(false);

  /** Düzəliş: form doldurulması üçün açar + id + dəyərlər */
  const [formEdit, setFormEdit] = useState<{
    key: number;
    id: string | null;
    values: PermissionFormValues | null;
  }>({ key: 0, id: null, values: null });

  const { data: timeOffsData, refetch, isFetching } = useQuery({
    queryKey: ["timeOffsInfo", personId],
    queryFn: () => createWorkerService.getTimeOffsInfoByPersonId(personId!),
    enabled: false,
  });

  useEffect(() => {
    if (!personId) return;
    if (currentStep !== 9) return;
    if (activeInnerTab !== "permission") return;
    void refetch();
  }, [personId, currentStep, activeInnerTab, tabVisitKey, refetch]);

  const serverList = useMemo(() => {
    if (!timeOffsData?.isSuccess || !Array.isArray(timeOffsData.result)) return [];
    const types = Array.isArray(timeOffTypesRaw) ? timeOffTypesRaw : [];
    const reasons = Array.isArray(timeOffReasonsRaw) ? timeOffReasonsRaw : [];
    return timeOffsData.result.map((row) => mapApiRowToItem(row, types, reasons));
  }, [timeOffsData, timeOffTypesRaw, timeOffReasonsRaw]);

  const list = serverList;

  const handleAdded = () => {
    void refetch();
  };

  const handleClearEdit = () => {
    setFormEdit({ key: 0, id: null, values: null });
  };

  const handleEdit = (id: string) => {
    const rawRow = timeOffsData?.result?.find((r) => String((r as TimeOffsInfoListItem).id) === id);
    if (!rawRow) {
      toast.error("Məlumat tapılmadı");
      return;
    }
    const types = Array.isArray(timeOffTypesRaw) ? timeOffTypesRaw : [];
    const reasons = Array.isArray(timeOffReasonsRaw) ? timeOffReasonsRaw : [];
    const item = mapApiRowToItem(rawRow, types, reasons);
    const values = itemToFormValues(item, types, reasons);
    setFormEdit((prev) => ({
      key: prev.key + 1,
      id,
      values,
    }));
  };

  const requestDelete = (id: string) => {
    setTimeOffIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    if (isDeletingTimeOff) return;
    setIsDeleteModalOpen(false);
    setTimeOffIdToDelete(null);
  };

  const confirmDeleteTimeOff = async () => {
    if (!timeOffIdToDelete) return;
    setIsDeletingTimeOff(true);
    try {
      const response = (await createWorkerService.removeTimeOffInfo(timeOffIdToDelete)) as {
        isSuccess?: boolean;
        errorMessage?: string | null;
      };
      if (response?.isSuccess === false) {
        toast.error(response?.errorMessage ?? "Silinərkən xəta baş verdi");
        return;
      }
      toast.success("Silindi");
      if (formEdit.id === timeOffIdToDelete) {
        handleClearEdit();
      }
      await refetch();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(getBackendErrorMessage(error));
      } else {
        toast.error("Silinmə zamanı xəta baş verdi");
      }
    } finally {
      setIsDeletingTimeOff(false);
      setIsDeleteModalOpen(false);
      setTimeOffIdToDelete(null);
    }
  };

  return (
    <div className={styles.container}>
      {isFetching && <p className={styles.fetchingText}>Yüklənir...</p>}
      <PermissionForm
        personId={personId}
        onAdded={handleAdded}
        editingId={formEdit.id}
        editFormKey={formEdit.key}
        editValues={formEdit.values}
        onClearEdit={handleClearEdit}
        employeeId={normalizedEmployeeId}
        rootCompanyId={normalizedRootCompanyId}
      />
      <PermissionTable data={list} onDelete={requestDelete} onEdit={handleEdit} />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={() => void confirmDeleteTimeOff()}
        title="İcazəni silmək istədiyinizə əminsiniz?"
        description="Bu məlumatı sildikdə geri qaytara bilməyəcəksiniz."
        confirmText="Sil"
        cancelText="Ləğv et"
        variant="danger"
        isLoading={isDeletingTimeOff}
      />
    </div>
  );
};
