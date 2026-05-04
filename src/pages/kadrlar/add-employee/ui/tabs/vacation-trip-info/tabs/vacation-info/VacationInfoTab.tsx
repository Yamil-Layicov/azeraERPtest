import { useEffect, useMemo, useState } from "react";
import { useForm, type Path, type PathValue } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { FormInput, ModernDatePicker, Button, ConfirmModal, CustomSelect } from "@/shared/ui";
import { EnumLookupSelect } from "@/features/lookups";
import styles from "./VacationInfoTab.module.css";
import { VacationTable, type VacationItem } from "./VacationTable";
import { toast } from "react-hot-toast";
import { useAddEmployeeStore } from "@/features/kadrlar/create-worker/model/useAddEmployeeStore";
import { createWorkerService } from "@/features/kadrlar/create-worker/api/createWorkerService";
import type { VacationEntryRequest, VacationsInfoListItem } from "@/features/kadrlar/create-worker/model/types";
import { getBackendErrorMessage } from "@/shared/api";
import { formatDateDisplayDDMMYYYY, formatDateToYMD } from "@/shared/lib/utils";
import axios, { AxiosError } from "axios";
import { PermissionGuard } from "@/features/auth/components/PermissionGuard";
import { PERMISSIONS } from "@/shared/consts/permissions";
import {
  vacationFormSchema,
  defaultVacationFormValues,
  type VacationFormValues,
} from "./vacationFormSchema";
import type { EnumLookupItem } from "@/features/lookups/model/types";
import { useEmployeeStore } from "@/features/kadrlar/create-worker/model/useEmployeeStore";
import type { Option } from "@/shared/types";

const matchLookupCode = (
  code: string,
  row: { value?: unknown; id?: unknown; code?: unknown },
) => {
  const c = code.trim().toLowerCase();
  const v = String(row.value ?? "").trim().toLowerCase();
  const id = String(row.id ?? "").trim().toLowerCase();
  const co = String(row.code ?? "").trim().toLowerCase();
  return v === c || id === c || co === c;
};

const parseApiDate = (s: string | null | undefined): Date => {
  if (!s) return new Date(NaN);
  const d = new Date(s);
  if (!Number.isNaN(d.getTime())) return d;
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(s).trim());
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return new Date(NaN);
};

const parseDDMMYYYY = (s: string): Date => {
  const m = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(String(s).trim());
  if (!m) return new Date(NaN);
  return new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
};

const parseWorkYearRange = (raw: string): { startDate: Date; endDate: Date } | null => {
  const [startRaw, endRaw] = String(raw).split("-").map((x) => x.trim());
  if (!startRaw || !endRaw) return null;
  const startDate = parseDDMMYYYY(startRaw);
  const endDate = parseDDMMYYYY(endRaw);
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) return null;
  return { startDate, endDate };
};

const pickNum = (...vals: unknown[]): number | undefined => {
  for (const v of vals) {
    if (typeof v === "number" && !Number.isNaN(v)) return v;
  }
  return undefined;
};

const pickStr = (...vals: unknown[]): string | null => {
  for (const v of vals) {
    if (v === null || v === undefined) continue;
    const s = String(v).trim();
    if (s !== "") return s;
  }
  return null;
};

const formatWorkYearRange = (start: string | null | undefined, end: string | null | undefined): string => {
  if (!start || !end) return "-";
  const ds = parseApiDate(start);
  const de = parseApiDate(end);
  if (Number.isNaN(ds.getTime()) || Number.isNaN(de.getTime())) return "-";
  const a = formatDateDisplayDDMMYYYY(ds);
  const b = formatDateDisplayDDMMYYYY(de);
  /* Tire sonrası ikinci tarix alt sətirdə */
  return `${a} -\n${b}`;
};

const mapApiRowToVacationItem = (row: VacationsInfoListItem, lookups: EnumLookupItem[]): VacationItem => {
  const r = row as unknown as Record<string, unknown>;
  const code = String(row.vacationTypeCode ?? r.VacationTypeCode ?? "").trim();
  const typeObj = lookups.find((e) => matchLookupCode(code, e));
  const label =
    typeObj?.fullName ?? typeObj?.displayName ?? typeObj?.label ?? code;

  const workYearDisplay = formatWorkYearRange(
    pickStr(
      row.workYearStartDate,
      r.WorkYearStartDate,
      row.workYearStart,
      r.WorkYearStart,
    ),
    pickStr(row.workYearEndDate, r.WorkYearEndDate, row.workYearEnd, r.WorkYearEnd),
  );

  const returnRaw = pickStr(row.returnToWorkDate, r.ReturnToWorkDate);
  const parsedReturnToWork = returnRaw ? parseApiDate(returnRaw) : null;

  const entitledBase = pickNum(row.entitledBaseDays, r.EntitledBaseDays);
  const entitledExtra = pickNum(row.entitledExtraDays, r.EntitledExtraDays);
  const usedBase = pickNum(row.usedBaseDays, r.UsedBaseDays);
  const usedExtra = pickNum(row.usedExtraDays, r.UsedExtraDays);
  const remBase = pickNum(row.remainingBaseDays, r.RemainingBaseDays);
  const remExtra = pickNum(row.remainingExtraDays, r.RemainingExtraDays);

  const entitlementMain = entitledBase !== undefined ? String(entitledBase) : "-";
  const entitlementExtra = entitledExtra !== undefined ? String(entitledExtra) : "-";
  const usedMain = usedBase !== undefined ? String(usedBase) : "-";
  const usedExtraStr = usedExtra !== undefined ? String(usedExtra) : "-";

  let remainingMain = "-";
  if (remBase !== undefined) remainingMain = String(remBase);
  else if (entitledBase !== undefined && usedBase !== undefined) {
    remainingMain = String(entitledBase - usedBase);
  }

  let remainingExtra = "-";
  if (remExtra !== undefined) remainingExtra = String(remExtra);
  else if (entitledExtra !== undefined && usedExtra !== undefined) {
    remainingExtra = String(entitledExtra - usedExtra);
  }

  const orderNum = pickStr(row.orderNumber, r.OrderNumber);
  const rowEmployeeId = pickStr(row.employeeId, r.EmployeeId);

  return {
    id: String(row.id ?? r.Id ?? ""),
    employeeId: rowEmployeeId,
    type: { id: code, fullName: label, label },
    workYearDisplay,
    startDate: parseApiDate(pickStr(row.startDate, r.StartDate)),
    endDate: parseApiDate(pickStr(row.endDate, r.EndDate)),
    returnToWorkDate:
      parsedReturnToWork && !Number.isNaN(parsedReturnToWork.getTime()) ? parsedReturnToWork : null,
    entitlementMain,
    entitlementExtra,
    usedMain,
    usedExtra: usedExtraStr,
    remainingMain,
    remainingExtra,
    orderDate: parseApiDate(pickStr(row.orderDate, r.OrderDate)),
    orderNumber: orderNum ?? "",
  };
};

const cellNumToFormField = (display: string): string => {
  const t = String(display).trim();
  if (t === "" || t === "-") return "";
  return t;
};

const safeVacationDate = (d: Date): Date | null => {
  if (!d || Number.isNaN(d.getTime())) return null;
  return d;
};

const vacationItemToFormValues = (item: VacationItem): VacationFormValues => {
  const isAnnual = item.type.id === "AnnualLeave";
  return {
    vacationType: {
      id: item.type.id,
      fullName: item.type.fullName ?? item.type.label ?? String(item.type.id),
      label: item.type.label ?? item.type.fullName,
    },
    startDate: safeVacationDate(item.startDate),
    endDate: safeVacationDate(item.endDate),
    orderDate: safeVacationDate(item.orderDate),
    orderNumber: item.orderNumber,
    rights: isAnnual ? cellNumToFormField(item.entitlementMain) : "",
    extraRights: isAnnual ? cellNumToFormField(item.entitlementExtra) : "",
    mainDays: isAnnual ? cellNumToFormField(item.usedMain) : "",
    extraDays: isAnnual ? cellNumToFormField(item.usedExtra) : "",
  };
};

export type VacationInnerTab =
  | "vacation"
  | "business-trip"
  | "permission"
  | "sick-leave"
  | "privileges"
  | "special-notes";

interface VacationInfoTabProps {
  /** Alt tab seçimini izləmək üçün (Məzuniyyətə hər keçiddə siyahı yenilənsin) */
  activeInnerTab?: VacationInnerTab;
}

export const VacationInfoTab = ({ activeInnerTab = "vacation" }: VacationInfoTabProps) => {
  const personId = useAddEmployeeStore((state) => state.personId);
  const employeeId = useAddEmployeeStore((state) => state.employeeId);
  const rootCompanyIdFromAdd = useAddEmployeeStore((state) => state.rootCompanyId);
  const currentStep = useAddEmployeeStore((state) => state.currentStep);
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
  const [editingVacationId, setEditingVacationId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [vacationIdToDelete, setVacationIdToDelete] = useState<string | null>(null);
  const [isDeletingVacation, setIsDeletingVacation] = useState(false);
  const [isSubmittingVacation, setIsSubmittingVacation] = useState(false);
  const [selectedWorkYearId, setSelectedWorkYearId] = useState<string | null>(null);
  const [workYearOptions, setWorkYearOptions] = useState<
    (Option & { startDate: Date; endDate: Date; workYearDate: string })[]
  >([]);

  const { data: leaveTypesData } = useQuery({
    queryKey: ["leaveTypesLookup"],
    queryFn: () => createWorkerService.getLeaveTypes(),
    staleTime: 1000 * 60 * 60,
  });

  const { data: vacationsData, refetch, isFetching } = useQuery({
    queryKey: ["vacationsInfo", personId],
    queryFn: () => createWorkerService.getVacationsInfoByPersonId(personId!),
    enabled: false,
  });

  const lookups: EnumLookupItem[] = useMemo(() => {
    const d = leaveTypesData as { result?: EnumLookupItem[]; data?: EnumLookupItem[] } | undefined;
    return d?.result ?? d?.data ?? [];
  }, [leaveTypesData]);

  useEffect(() => {
    if (!personId) return;
    if (currentStep !== 9) return;
    if (activeInnerTab !== "vacation") return;
    void refetch();
  }, [personId, currentStep, activeInnerTab, refetch]);

  const serverVacations = useMemo(() => {
    if (!vacationsData?.isSuccess || !Array.isArray(vacationsData.result)) return [];
    return vacationsData.result.map((row) => mapApiRowToVacationItem(row, lookups));
  }, [vacationsData, lookups]);

  const vacations = serverVacations;

  const {
    watch,
    setValue,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm<VacationFormValues>({
    resolver: zodResolver(vacationFormSchema),
    defaultValues: defaultVacationFormValues,
    mode: "onTouched",
  });

  const vacationType = watch("vacationType");
  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const orderDate = watch("orderDate");
  const orderNumber = watch("orderNumber");
  const rights = watch("rights");
  const extraRights = watch("extraRights");
  const mainDays = watch("mainDays");
  const extraDays = watch("extraDays");

  const isAnnualLeave = vacationType?.id === "AnnualLeave";

  useEffect(() => {
    if (vacationType?.id === "AnnualLeave") {
      void handleCalculateExtraRights();
      void handleFetchWorkYears();
    } else {
      setSelectedWorkYearId(null);
      setValue("rights", "", { shouldValidate: false });
      setValue("extraRights", "", { shouldValidate: false });
      setValue("mainDays", "", { shouldValidate: false });
      setValue("extraDays", "", { shouldValidate: false });
      clearErrors(["rights", "extraRights", "mainDays", "extraDays"]);
    }
  }, [vacationType?.id, setValue, clearErrors]);

  const handleFetchWorkYears = async () => {
    const idToUse = normalizedEmployeeId || personId;
    if (!idToUse) return;

    try {
      const response = await createWorkerService.getWorkYearDateByEmployeeIdAsync(idToUse);
      if (response?.isSuccess && Array.isArray(response.result)) {
        const options = response.result
          .map((item: any) => {
            const id = String(item?.id ?? item?.value ?? "");
            const label = String(item?.label ?? item?.fullName ?? item?.name ?? item?.value ?? "");
            const workYearDate = String(item?.value ?? label ?? "");
            const parsedRange =
              parseWorkYearRange(workYearDate) ??
              parseWorkYearRange(label);
            if (parsedRange) {
              return { id, label, workYearDate, ...parsedRange };
            }
            return {
              id,
              label,
              workYearDate,
              startDate: parseApiDate(item?.startDate ?? item?.StartDate ?? item?.workYearStartDate),
              endDate: parseApiDate(item?.endDate ?? item?.EndDate ?? item?.workYearEndDate),
            };
          })
          .filter(
            (x: Option & { startDate: Date; endDate: Date; workYearDate: string }) =>
              x.id && !Number.isNaN(x.startDate.getTime()) && !Number.isNaN(x.endDate.getTime()),
          );

        setWorkYearOptions(options);
      }
    } catch (error) {
      toast.error(getBackendErrorMessage(error as AxiosError) || "İş ili məlumatları alınarkən xəta baş verdi");
    }
  };

  const handleCalculateExtraRights = async () => {
    if (!personId) {
      toast.error("İşçi ID tapılmadı");
      return;
    }

    try {
      const response = await createWorkerService.getEntitledExtraDaysByPersonId(personId);

      if (!response?.isSuccess) {
        if (response?.errorMessage) toast.error(response.errorMessage);
        return;
      }

      const result = response.result;
      const days =
        typeof result === "number"
          ? result
          : typeof result?.entitledExtraDays === "number"
            ? result.entitledExtraDays
            : null;

      if (days != null) {
        setValue("extraRights", String(days), {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
      } else {
        if (response?.errorMessage) toast.error(response.errorMessage);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(getBackendErrorMessage(error));
      }
    }
  };

  const onSubmitForm = async (data: VacationFormValues) => {
    if (isSubmittingVacation) return;
    if (!personId) {
      toast.error("İşçi ID tapılmadı");
      return;
    }

    const vt = data.vacationType;
    if (!vt?.id) return;

    const isAnnual = vt.id === "AnnualLeave";

    let entitledBaseDays: number | null = null;
    let usedBaseDays: number | null = null;
    let usedExtraDays: number | null = null;

    if (isAnnual) {
      const eb = Number.parseFloat(String(data.rights).replace(",", "."));
      const ub = Number.parseInt(String(data.mainDays).trim(), 10);
      const ue = Number.parseInt(String(data.extraDays).trim(), 10);
      entitledBaseDays = eb;
      usedBaseDays = ub;
      usedExtraDays = ue;
    }

    const startYmd = formatDateToYMD(data.startDate);
    const endYmd = formatDateToYMD(data.endDate);
    const orderYmd = formatDateToYMD(data.orderDate);
    if (!startYmd || !endYmd || !orderYmd) return;
    const selectedWorkYear = workYearOptions.find((opt) => opt.id === selectedWorkYearId);
    const workYearDate = selectedWorkYear?.workYearDate ?? null;

    const payload: VacationEntryRequest = {
      personId,
      id: editingVacationId,
      isModify: Boolean(editingVacationId),
      vacationTypeCode: String(vt.id),
      workYearDate: isAnnual ? workYearDate : null,
      startDate: startYmd,
      endDate: endYmd,
      entitledBaseDays,
      usedBaseDays,
      usedExtraDays,
      orderNumber: data.orderNumber.trim(),
      orderDate: orderYmd,
      employeeId: normalizedEmployeeId,
      rootCompanyId: rootCompanyIdForPayload || null,
    };

    setIsSubmittingVacation(true);
    try {
      const response = await createWorkerService.addOrEditVacationInfo(payload);
      if (!response?.isSuccess) {
        return;
      }

      reset(defaultVacationFormValues);
      toast.success("Məzuniyyət əlavə edildi");
      await refetch();
    } catch (error: unknown) {
      // Global httpClient interceptor already shows error toast.
      if (!axios.isAxiosError(error)) {
        toast.error(error instanceof Error ? error.message : String(error));
      }
    } finally {
      setIsSubmittingVacation(false);
    }
  };

  const handleClear = () => {
    setEditingVacationId(null);
    setSelectedWorkYearId(null);
    reset(defaultVacationFormValues);
  };

  const handleEdit = (id: string) => {
    const item = serverVacations.find((v) => v.id === id);
    if (!item) {
      toast.error("Məlumat tapılmadı");
      return;
    }
    setEditingVacationId(id);
    reset(vacationItemToFormValues(item));
    clearErrors();
  };

  const handleDeleteRequest = (id: string) => {
    setVacationIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    if (isDeletingVacation) return;
    setIsDeleteModalOpen(false);
    setVacationIdToDelete(null);
  };

  const confirmDeleteVacation = async () => {
    if (!vacationIdToDelete) return;
    setIsDeletingVacation(true);
    try {
      const response = (await createWorkerService.removeVacationInfo(vacationIdToDelete)) as {
        isSuccess?: boolean;
        errorMessage?: string | null;
      };
      if (response?.isSuccess === false) {
        if (response?.errorMessage) toast.error(response.errorMessage);
        return;
      }
      toast.success("Məzuniyyət silindi");
      if (editingVacationId === vacationIdToDelete) {
        setEditingVacationId(null);
        reset(defaultVacationFormValues);
      }
      await refetch();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(getBackendErrorMessage(error));
      } else {
        toast.error(error instanceof Error ? error.message : String(error));
      }
    } finally {
      setIsDeletingVacation(false);
      setIsDeleteModalOpen(false);
      setVacationIdToDelete(null);
    }
  };

  const setField = <P extends Path<VacationFormValues>>(field: P, value: PathValue<VacationFormValues, P>) => {
    setValue(field, value, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
  };

  return (
    <div className={styles.container}>
      {isFetching && <p className={styles.fetchingText}>Yüklənir...</p>}
      <div className={styles.grid}>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>
            Məzuniyyət növü <span className={styles.required}>*</span>
          </label>
          <div className={styles.controlWrap}>
            <EnumLookupSelect
              id="vacation-type"
              code="LeaveTypes"
              value={vacationType}
              onChange={(v) => setField("vacationType", v)}
              defaultText="Seçin"
              error={errors.vacationType?.message}
            />
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <div className={styles.twoColumnGroup}>
            <div className={styles.subField}>
              <label className={styles.label}>
                Başlama tarixi <span className={styles.required}>*</span>
              </label>
              <ModernDatePicker
                id="vacation-start-date"
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
                id="vacation-end-date"
                placeholder="dd.mm.yyyy"
                value={endDate}
                onChange={(v) => setField("endDate", v)}
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
                id="vacation-order-date"
                placeholder="dd.mm.yyyy"
                value={orderDate}
                onChange={(v) => setField("orderDate", v)}
                error={errors.orderDate?.message}
              />
            </div>
            <div className={styles.subField}>
              <FormInput
                id="vacation-order-number"
                placeholder="Daxil edin"
                type="text"
                label="Əmr nömrəsi"
                required={true}
                value={orderNumber}
                onChange={(val) => setField("orderNumber", val)}
                error={errors.orderNumber?.message}
              />
            </div>
          </div>
        </div>

        {isAnnualLeave && (
          <>
            {/* Column 1: Annual Work Year Selection */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                İş ili <span className={styles.required}>*</span>
              </label>
              <CustomSelect
                id="vacation-work-year"
                options={workYearOptions}
                value={
                  workYearOptions.find((opt) => opt.id === selectedWorkYearId) || null
                }
                onChange={(opt) => setSelectedWorkYearId(opt?.id ? String(opt.id) : null)}
                defaultText="Seçin"
                error={undefined}
              />
            </div>

            {/* Column 2: Rights */}
            <div className={styles.fieldGroup}>
              <div className={styles.twoColumnGroup}>
                <div className={styles.subField}>
                  <FormInput
                    id="vacation-rights"
                    type="number"
                    label="Hüququ(Gün) / Əsas"
                    labelClassName={styles.annualRowLabel}
                    required={true}
                    placeholder="Daxil edin"
                    value={rights}
                    onChange={(val) => setField("rights", val)}
                    error={errors.rights?.message}
                  />
                </div>
                <div className={styles.subField}>
                  <FormInput
                    id="vacation-extra-rights"
                    type="text"
                    label="Hüququ(Gün) / Əlavə"
                    labelClassName={styles.annualRowLabel}
                    required={true}
                    placeholder="Otomatik hesablanır"
                    value={extraRights}
                    onChange={() => {}}
                    disabled
                    error={errors.extraRights?.message}
                  />
                </div>
              </div>
            </div>

            {/* Column 3: Usage */}
            <div className={styles.fieldGroup}>
              <div className={styles.twoColumnGroup}>
                <div className={styles.subField}>
                  <FormInput
                    id="vacation-used-days"
                    type="number"
                    label="İstifadə (Gün) / Əsas"
                    labelClassName={styles.annualRowLabel}
                    required={true}
                    placeholder="Daxil edin"
                    value={mainDays}
                    onChange={(val) => setField("mainDays", val)}
                    error={errors.mainDays?.message}
                  />
                </div>
                <div className={styles.subField}>
                  <FormInput
                    id="vacation-extra-days"
                    type="number"
                    label="İstifadə (Gün) / Əlavə"
                    labelClassName={styles.annualRowLabel}
                    required={true}
                    placeholder="Daxil edin"
                    value={extraDays}
                    onChange={(val) => setField("extraDays", val)}
                    error={errors.extraDays?.message}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        <div className={styles.actions}>
          <PermissionGuard
            permission={editingVacationId ? PERMISSIONS.EMPLOYEE.UPDATE : PERMISSIONS.EMPLOYEE.CREATE}
          >
            <Button
              type="button"
              variant="secondary"
              className={styles.addButton}
              disabled={isSubmittingVacation}
              onClick={handleSubmit(onSubmitForm)}
            >
              {editingVacationId ? "Yadda saxla" : "Əlavə et"}
            </Button>
          </PermissionGuard>
          <Button type="button" variant="outline" className={styles.clearButton} onClick={handleClear}>
            Təmizlə
          </Button>
        </div>
      </div>

      <VacationTable data={vacations} onDelete={handleDeleteRequest} onEdit={handleEdit} />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDeleteVacation}
        title="Məzuniyyətini silmək istədiyinizə əminsiniz?"
        description="Bu məlumatı sildikdə geri qaytara bilməyəcəksiniz."
        confirmText="Sil"
        cancelText="Ləğv et"
        variant="danger"
        isLoading={isDeletingVacation}
      />
    </div>
  );
};

