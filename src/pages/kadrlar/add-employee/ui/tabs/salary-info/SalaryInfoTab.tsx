import { useState, useImperativeHandle, forwardRef, useMemo, useEffect} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import styles from "./SalaryInfoTab.module.css";
import { MainSalaryInfo, type SalaryFormValues } from "./components/main-salary-info/MainSalaryInfo";
import { SalaryResultInfo } from "./components/salary-result-info/SalaryResultInfo";
import { SalaryTable, type SalaryTableItem } from "./components/salary-table/SalaryTable";
import { useSalaryCalculation } from "@/features/kadrlar/create-worker/hooks/useSalaryCalculation";
import { salaryService } from "@/features/kadrlar/create-worker/api/salaryService";
import { useSalaryInfo } from "@/features/kadrlar/create-worker/hooks/useSalaryInfo";
import { Modal } from "@/shared/ui/modal/base";
import { Button, ConfirmModal, TableActionGroup } from "@/shared/ui";
import { useAddEmployeeStore } from "@/features/kadrlar/create-worker/model/useAddEmployeeStore";
import { useEmployeeStore } from "@/features/kadrlar/create-worker/model/useEmployeeStore";
import { useQueryClient } from "@tanstack/react-query";
import type { SalaryCalcEntryRequest } from "@/features/kadrlar/create-worker/model/types";
import { format } from "date-fns";
import { PermissionGuard } from "@/features/auth/components";
import { PERMISSIONS } from "@/shared/consts/permissions";

export interface SalaryInfoTabHandle {
  submit: () => void;
  isDirty: () => boolean;
}

interface ExtendedSalaryItem extends SalaryTableItem {
  allCalculationData?: any;
  isDeleted?: boolean;
}

const salarySchema = z.object({
  grossSalary: z.union([z.number(), z.literal("")]).refine(val => val !== "", "Əmək haqqı (GROSS) vacibdir"),
  cashSalary: z.union([z.number(), z.literal("")]).refine(val => val !== "", "Əmək haqqı (kassa) vacibdir"),
  bonus: z.union([z.number(), z.literal("")]).optional(),
  calculationYear: z.any().refine(val => val !== null, "Hesablama ili vacibdir"),
  calculationDateFrom: z.any().optional(),
  includeUnionDues: z.boolean().default(false),
  isSalaryIncrease: z.boolean().default(false),
}).refine((data) => {
  if (data.isSalaryIncrease && !data.calculationDateFrom) {
    return false;
  }
  return true;
}, {
  message: "Qüvvəyə minmə tarixi vacibdir",
  path: ["calculationDateFrom"],
});

export const SalaryInfoTab = forwardRef<SalaryInfoTabHandle>((_, ref) => {
  const {
    currentStep,
    globalResetCounter,
    personId,
    employeeId,
    rootCompanyId,
    setStepCompleted,
    nextStep,
  } = useAddEmployeeStore();
  const currentRootCompanyId = useEmployeeStore((state) => state.rootCompanyId);
  const effectiveRootCompanyId = rootCompanyId ?? currentRootCompanyId;
  const { data: apiData } = useSalaryInfo();
  const queryClient = useQueryClient();

  const [addedSalaries, setAddedSalaries] = useState<ExtendedSalaryItem[]>([]);
  const [originalSalaries, setOriginalSalaries] = useState<ExtendedSalaryItem[]>([]);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [isSalaryIncreaseLocked, setIsSalaryIncreaseLocked] = useState(false);
  const [calculationResult, setCalculationResult] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [salaryIdToDelete, setSalaryIdToDelete] = useState<string | number | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const { control, reset, handleSubmit, formState: { errors } } = useForm<SalaryFormValues>({
    resolver: zodResolver(salarySchema as any),
    defaultValues: {
      grossSalary: "", 
      cashSalary: "", 
      bonus: "", 
      calculationYear: null, 
      calculationDateFrom: null, 
      includeUnionDues: false,
      isSalaryIncrease: false,
    },
  });

  useEffect(() => {
    if (globalResetCounter > 0) {
      reset({ grossSalary: "", cashSalary: "", bonus: "", calculationYear: null, calculationDateFrom: null, includeUnionDues: false, isSalaryIncrease: false });
      setAddedSalaries([]);
      setOriginalSalaries([]);
      setEditingId(null);
      setIsSalaryIncreaseLocked(false);
      setCalculationResult(null);
      setIsModalOpen(false);
      setHasChanges(false);
    }
  }, [globalResetCounter, reset]);

  const { mutate: calculateSalary, isPending: isCalculating } = useSalaryCalculation();

  const visibleSalaries = useMemo(() => addedSalaries.filter(s => !s.isDeleted), [addedSalaries]);

  useEffect(() => {
    if (currentStep !== 5) return;
    if (apiData?.isSuccess && Array.isArray(apiData.result)) {
      const resList = apiData.result;
      const mappedSalaries: ExtendedSalaryItem[] = resList.map((item: any) => ({
        id: item.id,
        employeeId: item.employeeId ?? null,
        calculationYear: item.calculationYear,
        grossSalary: item.grossSalary,
        informalSalary: item.cashSalary,
        bonus: item.bonus,
        includeTradeUnionFee: !!item.includeTradeUnionFee,
        isSalaryIncrease: item.isSalaryIncrease,
        effectiveDate: item.salaryIncreaseDate,
        rootCompanyId: item.rootCompanyId ?? null,
        allCalculationData: item
      }));
      setAddedSalaries(mappedSalaries);
      setOriginalSalaries(mappedSalaries.map(item => ({ ...item })));
      setHasChanges(false);
    }
  }, [apiData, currentStep]);

  const onCalculateSubmit = (values: SalaryFormValues) => {
    const payload = {
      calculationYear: values.calculationYear ? Number(values.calculationYear.id) : new Date().getFullYear(),
      grossSalary: Number(values.grossSalary) || 0,
      informalSalary: Number(values.cashSalary) || 0,
      bonus: Number(values.bonus) || 0,
      includeTradeUnionFee: values.includeUnionDues,
    };

    calculateSalary(payload, {
      onSuccess: (response) => {
        if (response.isSuccess && response.result) {
          const calcData = Array.isArray(response.result) ? response.result[0] : response.result;
          if (!calcData) {
            toast.error("Hesablama məlumatı tapılmadı");
            return;
          }

          const mappedResult = {
            ...calcData,
            calculationYear: values.calculationYear?.fullName ?? payload.calculationYear.toString(),
            calculationDateFrom: values.calculationDateFrom ? format(values.calculationDateFrom, 'yyyy-MM-dd') : null,
            isSalaryIncrease: values.isSalaryIncrease,
            includeTradeUnionFee: values.includeUnionDues 
          };
          setCalculationResult(mappedResult);
          setIsModalOpen(true);
        } else {
          toast.error(response.errorMessage || "Hesablama uğursuz oldu");
        }
      },
    });
  };

  const canManageSalaryRow = (item: SalaryTableItem) => {
    const selectedEmployeeId = String(employeeId ?? "").trim().toLowerCase();
    const rowEmployeeId = String(
      item.employeeId ?? item.allCalculationData?.employeeId ?? "",
    )
      .trim()
      .toLowerCase();

    // Eğer selectedEmployeeId yoksa (boş), tüm items göster
    if (!selectedEmployeeId) return true;
    
    // Eğer selectedEmployeeId var ama rowEmployeeId yoksa, gösterme
    if (!rowEmployeeId) return false;
    
    // İkisi de varsa, match kontrolü yap
    return rowEmployeeId === selectedEmployeeId;
  };

  const handleAddFromModal = async () => {
    if (!calculationResult || !personId) return;

    const isEditMode = editingId !== null;
    const isSalaryIncrease = !!calculationResult.isSalaryIncrease;
    const isModify = isEditMode ? (isSalaryIncreaseLocked || !isSalaryIncrease) : false;

    const normalizedEmployeeId =
      employeeId != null && String(employeeId).trim() !== ""
        ? String(employeeId).trim()
        : null;

    const normalizedRootCompanyId =
      effectiveRootCompanyId != null &&
      String(effectiveRootCompanyId).trim() !== ""
        ? String(effectiveRootCompanyId).trim()
        : null;

    const payload: SalaryCalcEntryRequest = {
      personId: personId,
      employeeId: normalizedEmployeeId,
      rootCompanyId: normalizedRootCompanyId,
      id: isEditMode && typeof editingId === "string" ? editingId : null,
      isModify: isModify,
      isSalaryIncrease: isSalaryIncrease,
      salaryIncreaseDate: calculationResult.calculationDateFrom || null,
      includeTradeUnionFee: !!calculationResult.includeTradeUnionFee,
      calculationYear: String(calculationResult.calculationYear),
      grossSalary: Number(calculationResult.grossSalary),
      cashSalary: Number(calculationResult.informalSalary),
      bonus: Number(calculationResult.bonus)
    };

    try {
      const response = await salaryService.addOrEditSalaryCalcInfo(payload);
      if (response.isSuccess) {
        toast.success(isEditMode ? "Məlumat yeniləndi" : "Məlumat əlavə edildi");
        queryClient.invalidateQueries({ queryKey: ["personnel", "salary", personId] });
        setIsModalOpen(false);
        setEditingId(null);
        setIsSalaryIncreaseLocked(false);
        reset({ grossSalary: "", cashSalary: "", bonus: "", calculationYear: null, calculationDateFrom: null, includeUnionDues: false, isSalaryIncrease: false });
      } else {
        toast.error(response.errorMessage || "Xəta baş verdi");
      }
    } catch {
      // HTTP xətaları global interceptor tərəfindən göstərilir.
    }
  };

  // MAAŞ SİLMƏ
  const handleRemoveSalary = (id: string | number) => {
    if (typeof id === "number") {
      setAddedSalaries(prev => prev.filter(x => x.id !== id));
      return;
    }
    setSalaryIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmRemoveSalary = async () => {
    if (!salaryIdToDelete) return;
    try {
      const response = await salaryService.removeSalaryCalcInfo(String(salaryIdToDelete));
      if (response.isSuccess) {
        toast.success("Məlumat silindi");
        queryClient.invalidateQueries({ queryKey: ["personnel", "salary", personId] });
      } else {
        toast.error(response.errorMessage || "Silinərkən xəta baş verdi");
      }
    } catch {
      // HTTP xətaları global interceptor tərəfindən göstərilir.
    } finally {
      setIsDeleteModalOpen(false);
      setSalaryIdToDelete(null);
    }
  };

  useImperativeHandle(ref, () => ({
    isDirty: () => {
      const activeSalaries = addedSalaries.filter(s => !s.isDeleted);
      if (activeSalaries.length === 0) return true;
      return hasChanges || JSON.stringify(addedSalaries) !== JSON.stringify(originalSalaries);
    },
    submit: () => {
      const activeSalaries = addedSalaries.filter(s => !s.isDeleted);
      if (activeSalaries.length === 0) {
        toast.error("Ən azı bir əmək haqqı əlavə edilməlidir!");
        return;
      }
      setStepCompleted(5);
      nextStep();
    }
  }));

  const refreshSalaryTable = () => {
    queryClient.invalidateQueries({ queryKey: ["personnel", "salary", personId] });
  };

  return (
    <div className={styles.container}>
      <MainSalaryInfo 
        control={control} 
        onCalculate={handleSubmit(onCalculateSubmit)} 
        onClear={() => {
          reset({ grossSalary: "", cashSalary: "", bonus: "", calculationYear: null, calculationDateFrom: null, includeUnionDues: false, isSalaryIncrease: false });
          setEditingId(null);
          setIsSalaryIncreaseLocked(false);
        }}
        isLoading={isCalculating} 
        errors={errors} 
        isEditMode={editingId !== null}
        disableSalaryIncreaseToggle={isSalaryIncreaseLocked}
      />
      <div className={styles.tableContainer}>
        <TableActionGroup
          onRefresh={refreshSalaryTable}
          className={styles.tableActionGroup}
        />
        <SalaryTable 
          className={styles.salaryTable}
          items={visibleSalaries} 
          onRemove={handleRemoveSalary}
          canManageRow={canManageSalaryRow}
          onView={(item) => {
            const raw = item.allCalculationData;
            setCalculationResult({
              ...raw,
              calculationYear: raw.calculationYear,
              grossSalary: raw.grossSalary,
              informalSalary: raw.cashSalary,
              bonus: raw.bonus,
              includeTradeUnionFee: !!raw.includeTradeUnionFee,
              finalNetSalary: raw.netSalary,
              totalSalaryCost: raw.totalSalaryExpense,
              incomeTaxEmployee: raw.incomeTaxEmployee,
              socialSecurityEmployee: raw.dsmfEmployee,
              unemploymentInsuranceEmployee: raw.unemploymentInsuranceEmployee,
              mandatoryHealthInsuranceEmployee: raw.healthInsuranceEmployee,
              socialSecurityEmployer: raw.dsmfEmployer,
              unemploymentInsuranceEmployer: raw.unemploymentInsuranceEmployer,
              mandatoryHealthInsuranceEmployer: raw.healthInsuranceEmployer,
              tradeUnionFee: raw.unionFee,
              totalDeductionsFromEmployee: raw.totalEmployeeDeductions,
              totalDeductionsFromEmployer: raw.totalEmployerDeductions,
              totalDeductions: raw.totalDeductions,
              netOfficialSalary: raw.payableToEmployee,
            });
            setIsViewMode(true);
            setIsModalOpen(true);
          }}
          onEdit={(item) => {
            reset({
              grossSalary: item.grossSalary,
              cashSalary: item.informalSalary,
              bonus: item.bonus,
              calculationYear: { id: item.calculationYear.toString(), fullName: item.calculationYear.toString() },
              calculationDateFrom: item.effectiveDate ? new Date(item.effectiveDate) : null,
              includeUnionDues: !!item.allCalculationData?.includeTradeUnionFee,
              isSalaryIncrease: !!item.isSalaryIncrease,
            });
            setEditingId(item.id);
            setIsSalaryIncreaseLocked(!!item.isSalaryIncrease);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </div>
      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingId(null); setIsViewMode(false); }} title="Əmək haqqı üzrə göstəricilər" width="800px">
        <div className={styles.modalBody}><SalaryResultInfo data={calculationResult} /></div>
        <div className={styles.modalFooter}>
          <Button variant="outline" onClick={() => { setIsModalOpen(false); setEditingId(null); setIsViewMode(false); }}>Bağla</Button>
          {!isViewMode && (
            editingId !== null ? (
              <PermissionGuard permission={PERMISSIONS.EMPLOYEE.UPDATE}>
                <Button variant="primary" onClick={handleAddFromModal}>Yenilə</Button>
              </PermissionGuard>
            ) : (
              <PermissionGuard permission={PERMISSIONS.EMPLOYEE.CREATE}>
                <Button variant="primary" onClick={handleAddFromModal}>Əlavə et</Button>
              </PermissionGuard>
            )
          )}
        </div>
      </Modal>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => { setIsDeleteModalOpen(false); setSalaryIdToDelete(null); }}
        onConfirm={confirmRemoveSalary}
        title="Maaş məlumatını silmək istədiyinizə əminsiniz?"
        description="Bu məlumatı sildikdə geri qaytara bilməyəcəksiniz."
        confirmText="Sil"
        cancelText="Ləğv et"
        variant="danger"
      />
    </div>
  );
});

SalaryInfoTab.displayName = "SalaryInfoTab";
