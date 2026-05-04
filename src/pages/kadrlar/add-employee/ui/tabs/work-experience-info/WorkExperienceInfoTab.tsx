import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import styles from "./WorkExperienceInfoTab.module.css";
import { EmploymentTypeCards } from "./components/employment-type-cards";
import { WorkInputForm } from "./components/work-input-form";
import { WorkTable } from "./components/work-table";
import type { WorkInputFormValue } from "./components/work-input-form";
import type { WorkTableItem } from "./components/work-table";
import { useAddEmployeeStore } from "@/features/kadrlar/create-worker/model/useAddEmployeeStore";
import { useEmployeeStore } from "@/features/kadrlar/create-worker/model/useEmployeeStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createWorkerService } from "@/features/kadrlar/create-worker/api/createWorkerService";
import { formatDateToYMD } from "@/shared/lib/utils";
import axios from "axios";
import { workExperienceSchema } from "@/features/kadrlar/create-worker/model/schemas";
import type {
  WorkExperienceEntryRequest,
  TerminateWorkExperienceRequest,
  WorkExperienceInfoListItem,
} from "@/features/kadrlar/create-worker/model/types";
import { Modal } from "@/shared/ui/modal/base";
import { Button, ConfirmModal, FormLabel, FormInput, FormTextarea, ModernDatePicker, TableActionGroup } from "@/shared/ui";
import { EnumLookupSelect } from "@/features/lookups";
import { WorkExperienceResultInfo } from "./components/work-experience-result-info/WorkExperienceResultInfo";
import type { Option } from "@/shared/types";
import type { EnumLookupItem } from "@/features/lookups/model/types";
import { usePendingWorkExperienceApproval } from "@/features/kadrlar/create-worker/hooks/usePendingWorkExperienceApproval";

export interface WorkExperienceInfoTabHandle {
  submit: () => void;
  isDirty: () => boolean;
}

const initialWorkForm: WorkInputFormValue = {
  experienceType: null,
  workplace: "",
  position: "",
  appointmentDate: null,
  appointmentOrderNumber: "",
  azadOlChecked: false,
  releaseDate: null,
  releaseOrderNumber: "",
  releaseLegalBasis: null,
  resignationReason: "",
};


export const WorkExperienceInfoTab = forwardRef<WorkExperienceInfoTabHandle>((_, ref) => {
  const queryClient = useQueryClient();
  const {
    personId,
    employeeId,
    rootCompanyId,
    currentStep,
    nextStep,
    setStepCompleted,
  } = useAddEmployeeStore();
  const currentRootCompanyId = useEmployeeStore((state) => state.rootCompanyId);
  const effectiveRootCompanyId = rootCompanyId ?? currentRootCompanyId;
  const [workTableItems, setWorkTableItems] = useState<WorkTableItem[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAzadModalOpen, setIsAzadModalOpen] = useState(false);
  const [experienceIdToDelete, setExperienceIdToDelete] = useState<string | number | null>(null);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [selectedExperience, setSelectedExperience] = useState<WorkTableItem | null>(null);

  const azadForm = useForm({
    defaultValues: {
      releaseDate: null as Date | null,
      releaseOrderNumber: "",
      releaseLegalBasis: null as Option | null,
      resignationReason: ""
    }
  });

  const form = useForm<WorkInputFormValue>({
    resolver: zodResolver(workExperienceSchema),
    defaultValues: initialWorkForm,
    mode: "onTouched"
  });

  const { watch, setValue, reset, trigger, formState: { errors, isDirty } } = form;
  const workForm = watch();

  useEffect(() => {
    reset(initialWorkForm);
    azadForm.reset({
      releaseDate: null,
      releaseOrderNumber: "",
      releaseLegalBasis: null,
      resignationReason: ""
    });
    setWorkTableItems([]);
    setIsDeleteModalOpen(false);
    setIsAzadModalOpen(false);
    setExperienceIdToDelete(null);
    setEditingId(null);
    setSelectedExperience(null);
  }, [personId, reset, azadForm.reset]);

  // Summary Data Query
  const { data: summaryData } = useQuery({
    queryKey: ["workExperienceSummary", personId],
    queryFn: () => createWorkerService.getWorkExperienceSummary(personId!),
    enabled: !!personId && currentStep === 4,
    staleTime: 0,
    gcTime: 0
  });

  // Detailed List Query — GET personalInfoForm/getWorkExperienceInfoByPersonId/{personId}
  const { data: listData } = useQuery({
    queryKey: ["workExperienceList", personId],
    queryFn: () => createWorkerService.getWorkExperienceInfoByPersonId(personId!),
    enabled: !!personId && currentStep === 4,
    staleTime: 0,
    gcTime: 0,
  });

  usePendingWorkExperienceApproval({
    enabled: currentStep === 4,
    workExperienceList: listData?.result,
  });

  // Termination Reasons Lookup Query
  const { data: terminationReasonsData } = useQuery({
    queryKey: ["terminationReasonsLookup"],
    queryFn: () => createWorkerService.getTerminationReasons(),
    staleTime: 1000 * 60 * 60,
  });

  // Experience Types Lookup Query
  const { data: experienceTypesData } = useQuery({
    queryKey: ["experienceTypesLookup"],
    queryFn: () => createWorkerService.getExperienceTypes(),
    staleTime: 1000 * 60 * 60,
  });

  // Sync backend list to local table state
  useEffect(() => {
    if (!listData?.isSuccess || !Array.isArray(listData.result)) return;

    const reasons: EnumLookupItem[] = terminationReasonsData?.result ?? [];
    const experienceTypes: EnumLookupItem[] = experienceTypesData?.result ?? [];

    const matchLookupCode = (code: string, row: any) => {
      const c = String(code || "").trim().toLowerCase();
      if (!c) return false;
      const v = String(row?.value || "").trim().toLowerCase();
      const id = String(row?.id || "").trim().toLowerCase();
      const co = String(row?.code || "").trim().toLowerCase();
      return v === c || id === c || co === c;
    };

    const mappedItems: WorkTableItem[] = (listData.result as WorkExperienceInfoListItem[]).map((item) => {
      const reasonCode = String(item.terminationReasonCode || "").trim();
      const reasonObj = reasons.find((r) => matchLookupCode(reasonCode, r));

      const expTypeCode = String(item.experienceTypeCode || "").trim();
      const expTypeObj = experienceTypes.find((e) => matchLookupCode(expTypeCode, e));

      return {
        id: item.id || Math.random().toString(),
        workplace: item.workPlace || "",
        position: item.positionName || "",
        appointmentDate: item.appointmentDate ? new Date(item.appointmentDate) : null,
        appointmentOrderNumber: item.appointmentOrderNumber || "",
        status: item.status || null,
        statusValue: item.statusValue || null,
        releaseDate: item.terminationDate ? new Date(item.terminationDate) : null,
        releaseOrderNumber: item.terminationOrderNumber || "",
        releaseReason: item.terminationNote || "",
        experienceType: expTypeObj?.label || "—",
        legalBasisOrTransfer: reasonObj?.label || "—",
        raw: item,
      };
    });
    
    if (mappedItems.length > 0) {
      setWorkTableItems(mappedItems);
    } else if (listData.result.length === 0) {
      setWorkTableItems([]);
    }
  }, [listData, terminationReasonsData, experienceTypesData]);

  // Termination Mutation
  const { mutate: terminateExperience, isPending: isTerminating } = useMutation({
    mutationFn: (payload: TerminateWorkExperienceRequest) => createWorkerService.terminatedWorkExperienceInfo(payload),
    onSuccess: (response) => {
      if (response.isSuccess) {
        toast.success("Məlumat yeniləndi");
        queryClient.invalidateQueries({ queryKey: ["workExperienceSummary", personId] });
        queryClient.invalidateQueries({ queryKey: ["workExperienceList", personId] });
        setIsAzadModalOpen(false);
        setSelectedExperience(null);
      } else {
        toast.error(response.errorMessage || "Xəta baş verdi");
      }
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        // HTTP xətası üçün toast interceptor tərəfindən göstərilir.
        return;
      } else {
        toast.error("Şəbəkə xətası baş verdi");
      }
    }
  });

  // Add/Edit Mutation
  const { mutate: addOrEditExperience, isPending: isSaving } = useMutation({
    mutationFn: (payload: WorkExperienceEntryRequest) => createWorkerService.addOrEditWorkExperienceInfo(payload),
    onSuccess: (response) => {
      if (response.isSuccess) {
        toast.success(editingId ? "Məlumat yeniləndi" : "Məlumat əlavə edildi");
        queryClient.invalidateQueries({ queryKey: ["workExperienceSummary", personId] });
        queryClient.invalidateQueries({ queryKey: ["workExperienceList", personId] });
        reset(initialWorkForm);
        setEditingId(null);
      } else {
        toast.error(response.errorMessage || "Xəta baş verdi");
      }
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        // HTTP xətası üçün toast interceptor tərəfindən göstərilir.
        return;
      } else {
        toast.error("Şəbəkə xətası baş verdi");
      }
    }
  });

  const handleEdit = (item: WorkTableItem, action: "edit" | "terminate") => {
    const raw = item.raw;
    if (!raw) return;

    if (action === "terminate") {
      setSelectedExperience(item);
      azadForm.reset({
        releaseDate: null,
        releaseOrderNumber: "",
        releaseLegalBasis: null,
        resignationReason: ""
      });
      setIsAzadModalOpen(true);
      return;
    }

    // Normal edit mode: fill form and continue with isModify=true flow
    const resetValues = {
      experienceType: { id: raw.experienceTypeCode, fullName: item.experienceType },
      workplace: raw.organizationUnitId 
        ? { id: raw.organizationUnitId, fullName: raw.workPlace } 
        : raw.workPlace,
      position: raw.staffingId 
        ? { id: raw.staffingId, fullName: raw.positionName } 
        : raw.positionName,
      appointmentDate: raw.appointmentDate ? new Date(raw.appointmentDate) : null,
      appointmentOrderNumber: raw.appointmentOrderNumber || "",
      azadOlChecked: !raw.isTerminated,
      releaseDate: raw.terminationDate ? new Date(raw.terminationDate) : null,
      releaseOrderNumber: raw.terminationOrderNumber || "",
      // NOTE: Use explicit null/undefined check (0 is a valid id sometimes)
      releaseLegalBasis:
        raw.terminationReasonCode !== null && raw.terminationReasonCode !== undefined
          ? { id: raw.terminationReasonCode, fullName: item.legalBasisOrTransfer }
          : null,
      resignationReason: raw.terminationNote || "",
    };

    reset(resetValues);
    setEditingId(raw.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onAzadSubmit = async (data: any) => {
    if (!selectedExperience || !personId) return;

    const raw = selectedExperience.raw;
    if (!raw) return;
    if (!data.releaseDate) {
      toast.error("Azad olma tarixi daxil edilməlidir");
      return;
    }
    if (!data.releaseLegalBasis) {
      toast.error("Hüquqi əsas seçilməlidir");
      return;
    }

    const normalizedEmployeeId =
      employeeId != null && String(employeeId).trim() !== ""
        ? String(employeeId).trim()
        : null;

    const payload: TerminateWorkExperienceRequest = {
      id: String(raw.id),
      employeeId: normalizedEmployeeId,
      terminationDate: formatDateToYMD(data.releaseDate),
      terminationOrderNumber: data.releaseOrderNumber || null,
      terminationReasonCode:
        data.releaseLegalBasis?.id !== null && data.releaseLegalBasis?.id !== undefined
          ? String(data.releaseLegalBasis.id)
          : null,
      terminationNote: data.resignationReason || null
    };

    terminateExperience(payload);
  };

  const confirmRemoveExperience = async () => {
    if (!experienceIdToDelete) return;
    try {
      const response = await createWorkerService.removeWorkExperienceInfo(String(experienceIdToDelete));
      if (response.isSuccess) {
        toast.success("Məlumat silindi");
        queryClient.invalidateQueries({ queryKey: ["workExperienceSummary", personId] });
        queryClient.invalidateQueries({ queryKey: ["workExperienceList", personId] });
      } else {
        toast.error(response.errorMessage || "Silinərkən xəta baş verdi");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        // HTTP xətası üçün toast interceptor tərəfindən göstərilir.
        return;
      } else {
        toast.error("Silinmə zamanı xəta baş verdi");
      }
    } finally {
      setIsDeleteModalOpen(false);
      setExperienceIdToDelete(null);
    }
  };

  useImperativeHandle(ref, () => ({
    isDirty: () => isDirty,
    submit: () => {
      // Senior Check: At least one record must exist in the local table.
      const hasLocalEntries = workTableItems.length > 0;
      const hasBackendEntries = summaryData?.result && (
        (summaryData.result.totalYear || 0) > 0 || 
        (summaryData.result.totalMonth || 0) > 0 || 
        (summaryData.result.totalDay || 0) > 0
      );
      
      if (!hasLocalEntries && !hasBackendEntries) {
        toast.error("Ən azı bir məlumat daxil edilməlidir");
        return;
      }

      setStepCompleted(4);
      nextStep();
    }
  }));

  const handleWorkFormChange = <K extends keyof WorkInputFormValue>(field: K, val: any) => {
    setValue(field as any, val, { shouldDirty: true, shouldValidate: true, shouldTouch: true });
  };

  const handleWorkAddClick = async () => {
    const isValid = await trigger();
    if (!isValid || !personId) return;

    const experienceTypeCode = workForm.experienceType?.id ? String(workForm.experienceType.id) : null;
    const isOtherExperience =
      experienceTypeCode === "OtherExperience" || experienceTypeCode === "OtherMedicalExperience";
    const isHoldingExperience =
      experienceTypeCode === "HoldingExperience" || experienceTypeCode === "HoldingMedicalExperience";
    const isTerminated = !workForm.azadOlChecked;

    const normalizedEmployeeId =
      employeeId != null && String(employeeId).trim() !== ""
        ? String(employeeId).trim()
        : null;

    const normalizedRootCompanyId =
      effectiveRootCompanyId != null &&
      String(effectiveRootCompanyId).trim() !== ""
        ? String(effectiveRootCompanyId).trim()
        : null;

    // Senior Mapping: UI State -> API Request (Empty strings are converted to null)
    const payload: WorkExperienceEntryRequest = {
      id: editingId ? String(editingId) : null,
      isModify: !!editingId,
      personId: personId,
      employeeId: normalizedEmployeeId,
      rootCompanyId:
        isOtherExperience || !workForm.azadOlChecked ? null : normalizedRootCompanyId,
      experienceTypeCode: experienceTypeCode,
      
      // For holding experience types, backend requires these as null.
      workPlace: (isHoldingExperience && workForm.azadOlChecked)
        ? null
        : typeof workForm.workplace === "object"
          ? workForm.workplace?.fullName || null
          : (workForm.workplace || null),
      positionName: (isHoldingExperience && workForm.azadOlChecked)
        ? null
        : typeof workForm.position === "object"
          ? workForm.position?.fullName || null
          : (workForm.position || null),
      staffingId: typeof workForm.position === "object" ? String(workForm.position?.id || "") : null,
      
      appointmentDate: formatDateToYMD(workForm.appointmentDate),
      appointmentOrderNumber: workForm.appointmentOrderNumber ? String(workForm.appointmentOrderNumber) : null,
      
      isTerminated,
      terminationDate: isTerminated ? formatDateToYMD(workForm.releaseDate) : null,
      terminationOrderNumber: isTerminated
        ? (workForm.releaseOrderNumber ? String(workForm.releaseOrderNumber) : null)
        : null,
      terminationReasonCode: isTerminated
        ? (workForm.releaseLegalBasis?.id !== null && workForm.releaseLegalBasis?.id !== undefined
            ? String(workForm.releaseLegalBasis.id)
            : null)
        : null,
      terminationNote: isTerminated ? (workForm.resignationReason || null) : null
    };

    addOrEditExperience(payload);
  };
  const refreshWorkTable = () => {
    queryClient.invalidateQueries({ queryKey: ["workExperienceList", personId] });
  };

  return (
    <div className={styles.container}>
      <EmploymentTypeCards data={summaryData?.result} />
      <WorkInputForm
        value={workForm}
        onChange={handleWorkFormChange}
        onAddClick={handleWorkAddClick}
        onClear={() => {
            reset(initialWorkForm);
            setEditingId(null);
        }}
        errors={errors}
        isEditMode={!!editingId}
        isLoading={isSaving}
      />
    
   <div className={styles.tableContainer}>
     <TableActionGroup onRefresh={()=>refreshWorkTable()} className={styles.tableActionGroup}/>
      <WorkTable 
        data={workTableItems} 
        onRemove={(id) => {
            setExperienceIdToDelete(id);
            setIsDeleteModalOpen(true);
        }} 
        onEdit={handleEdit}
        className={styles.workTable}
      />
   </div>

      {/* Azad Et Modalı */}
      <Modal 
        isOpen={isAzadModalOpen} 
        onClose={() => { setIsAzadModalOpen(false); setSelectedExperience(null); }} 
        title="İşdən azad etmə" 
        width="800px"
      >
        <div className={styles.modalBody}>
          {selectedExperience && (
            <WorkExperienceResultInfo data={{
              workplace: selectedExperience.workplace,
              position: selectedExperience.position,
              appointmentDate: selectedExperience.appointmentDate,
              appointmentOrderNumber: selectedExperience.appointmentOrderNumber
            }} />
          )}
          
          <div className={styles.azadFormFields}>
              <div className={styles.modalField}>
                  <FormLabel label="Azad olma tarixi" required htmlFor="salary-releaseDate" />
                  <ModernDatePicker
                    id="salary-releaseDate"
                    value={azadForm.watch("releaseDate")}
                    onChange={(val) => azadForm.setValue("releaseDate", val)}
                    placeholder="dd.mm.yyyy"
                    error={azadForm.formState.errors.releaseDate?.message}
                  />
              </div>
              <div className={styles.modalField}>
                  <FormLabel label="Azad olma əmr nömrəsi" htmlFor="releaseOrderNumber" />
                  <FormInput
                    id="releaseOrderNumber"
                    type="text"
                    label=""
                    placeholder="Daxil edin"
                    value={azadForm.watch("releaseOrderNumber")}
                    onChange={(val) => azadForm.setValue("releaseOrderNumber", val)}
                  />
              </div>
              <div className={styles.modalField}>
                  <FormLabel label="Hüquqi əsas" required htmlFor="releaseLegalBasis" />
                  <EnumLookupSelect
                    id="releaseLegalBasis"
                    code="TerminationReasons"
                    value={azadForm.watch("releaseLegalBasis")}
                    onChange={(val) => azadForm.setValue("releaseLegalBasis", val)}
                    defaultText="Seçin"
                  />
              </div>
              <div className={styles.modalField}>
                  <FormLabel label="Səbəb" htmlFor="resignationReason" />
                  <FormTextarea
                    id="resignationReason"
                    label=""
                    placeholder="Daxil edin"
                    value={azadForm.watch("resignationReason")}
                    onChange={(val) => azadForm.setValue("resignationReason", val)}
                    rows={2}
                  />
              </div>
          </div>
        </div>
        <div className={styles.modalFooter}>
          <Button variant="outline" onClick={() => { setIsAzadModalOpen(false); setSelectedExperience(null); }}>Ləğv et</Button>
          <Button variant="primary" onClick={azadForm.handleSubmit(onAzadSubmit)} isLoading={isTerminating}>
            Təsdiqlə
          </Button>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => { setIsDeleteModalOpen(false); setExperienceIdToDelete(null); }}
        onConfirm={confirmRemoveExperience}
        title="İş tecrübəsini silmək istədiyinizə əminsiniz?"
        description="Bu məlumatı sildikdə geri qaytara bilməyəcəksiniz."
        confirmText="Sil"
        cancelText="Ləğv et"
        variant="danger"
      />
    </div>
  );
});

WorkExperienceInfoTab.displayName = "WorkExperienceInfoTab";
