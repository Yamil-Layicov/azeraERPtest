import { forwardRef, useEffect, useImperativeHandle, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  PerformanceForm,
  type PerformanceFormValue,
} from "./components/performance-form";
import { PerformanceTable } from "./components/performance-table";
import { IncentiveMeasuresSection } from "../../../../employee-shared/ui/incentive-measures-info";
import { DisciplinaryWarningsSection } from "../../../../employee-shared/ui/disciplinary-warnings-info";
import type {
  DisciplinaryWarningItem,
  IncentiveItem,
  NewDisciplinaryWarningState,
  NewIncentiveState,
} from "../../../../employee-shared/model/types";
import type { PerformanceTableItem } from "./components/performance-table";
import styles from "./PerformanceIndicatorsTab.module.css";
import { useAddEmployeeStore } from "@/features/kadrlar/create-worker/model/useAddEmployeeStore";
import { createWorkerService } from "@/features/kadrlar/create-worker/api/createWorkerService";
import { useEnumItemsByCode } from "@/features/lookups/hooks";
import type {
  PerformanceEntryRequest,
  PersonnelActionEntryRequest,
} from "@/features/kadrlar/create-worker/model/types";
import toast from "react-hot-toast";
import { ConfirmModal } from "@/shared/ui";
import { formatDateToYMD } from "@/shared/lib/utils";
import { getBackendErrorMessage } from "@/shared/api";
import { PERMISSIONS } from "@/shared/consts/permissions";
import axios from "axios";
import { useEmployeeStore } from "@/features/kadrlar/create-worker/model/useEmployeeStore";

const initialPerformanceFormValue: PerformanceFormValue = {
  il: null,
  qiymet: "",
  illikBonusMeblegi: "",
};

const parseBackendDate = (value: string | null | undefined): Date | null => {
  if (!value) return null;
  const d = new Date(value);
  if (!Number.isNaN(d.getTime())) return d;
  const parts = value.split("/");
  if (parts.length === 3) {
    const month = Number(parts[0]);
    const day = Number(parts[1]);
    const year = Number(parts[2]);
    if (!Number.isNaN(month) && !Number.isNaN(day) && !Number.isNaN(year)) {
      return new Date(year, month - 1, day);
    }
  }
  return null;
};

export interface PerformanceIndicatorsTabHandle {
  submit: () => void;
  isDirty: () => boolean;
}

const PerformanceIndicatorsTab = forwardRef<PerformanceIndicatorsTabHandle>(
  (_, ref) => {
    const { personId, employeeId, rootCompanyId, currentStep, nextStep, setStepCompleted } =
      useAddEmployeeStore();
    const currentRootCompanyId = useEmployeeStore((state) => state.rootCompanyId);
    const effectiveRootCompanyId = rootCompanyId ?? currentRootCompanyId;
    const { options: rewardTypeOptions } = useEnumItemsByCode(
      "RewardTypes",
      currentStep === 8,
    );
    const { options: stateAwardOptions } = useEnumItemsByCode(
      "StateAwardTypes",
      currentStep === 8,
    );
    const { options: disciplinaryTypeOptions } = useEnumItemsByCode(
      "DisciplinaryActionTypes",
      currentStep === 8,
    );
    const { data: performanceData, refetch } = useQuery({
      queryKey: ["performanceInfo", personId],
      queryFn: () =>
        createWorkerService.getPerformanceInfoByPersonId(personId!),
      enabled: false,
    });
    useEffect(() => {
      if (currentStep !== 8 || !personId) return;
      void refetch();
    }, [currentStep, personId, refetch]);

    // Parent "Növbəti" düyməsi bu handle-lə çağırır.
    useImperativeHandle(ref, () => ({
      submit: () => {
        // Bu tabda məlumatlar artıq table/form üzərindən dərhal serverə yazılır.
        // Ona görə step completion mark edib növbətini açırıq.
        setStepCompleted(8);
        nextStep();
      },
      isDirty: () => false,
    }));

    const [performanceFormValue, setPerformanceFormValue] =
      useState<PerformanceFormValue>(initialPerformanceFormValue);
    const [performanceItems, setPerformanceItems] = useState<
      PerformanceTableItem[]
    >([]);
    const [editingPerformanceId, setEditingPerformanceId] = useState<
      string | null
    >(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [performanceIdToDelete, setPerformanceIdToDelete] = useState<
      string | null
    >(null);
    const [isActionDeleteModalOpen, setIsActionDeleteModalOpen] =
      useState(false);
    const [actionIdToDelete, setActionIdToDelete] = useState<string | null>(
      null,
    );
    const [isStateAwardDeleteModalOpen, setIsStateAwardDeleteModalOpen] =
      useState(false);
    const [stateAwardIdToDelete, setStateAwardIdToDelete] = useState<string | null>(
      null,
    );

    useEffect(() => {
      const list = performanceData?.result?.performanceList;
      if (!Array.isArray(list)) return;

      const mapped: PerformanceTableItem[] = list.map(
        (item: {
          id: string;
          year: number;
          rating: number;
          annualBonus: number;
          employeeId?: string | number;
        }) => ({
          id: item.id,
          il: new Date(item.year, 0, 1),
          qiymet: String(item.rating ?? ""),
          illikBonusMeblegi: String(item.annualBonus ?? ""),
          employeeId: item.employeeId,
        }),
      );
      setPerformanceItems(mapped);
    }, [performanceData]);
    useEffect(() => {
      const actionList = performanceData?.result?.personnelActionList;
      if (!Array.isArray(actionList)) return;

      const findOption = (
        code: string | null | undefined,
        options: { id: string | number; fullName?: string }[],
      ) => {
        if (!code) return null;
        return options.find((opt) => String(opt.id) === String(code)) ?? null;
      };

      const mappedIncentives: IncentiveItem[] = actionList
        .filter(
          (item: { personnelActionTypeCode?: string | null }) =>
            item.personnelActionTypeCode === "Reward",
        )
        .map(
          (item: {
            id: string;
            rewardTypeCode: string | null;
            issueDate: string | null;
            reason: string | null;
            orderNumber: string | null;
            employeeId?: string | number;
          }) => ({
            id: item.id,
            adi: findOption(item.rewardTypeCode, rewardTypeOptions),
            verilmeTarixi: parseBackendDate(item.issueDate),
            sebebi: item.reason ?? "",
            emrNomresi: item.orderNumber ?? "",
            employeeId: item.employeeId,
          }),
        );

      const mappedDisciplinary: DisciplinaryWarningItem[] = actionList
        .filter(
          (item: { personnelActionTypeCode?: string | null }) =>
            item.personnelActionTypeCode === "Disciplinary",
        )
        .map(
          (item: {
            id: string;
            disciplinaryActionTypeCode: string | null;
            issueDate: string | null;
            reason: string | null;
            orderNumber: string | null;
            employeeId?: string | number;
          }) => ({
            id: item.id,
            adi: findOption(
              item.disciplinaryActionTypeCode,
              disciplinaryTypeOptions,
            ),
            verilmeTarixi: parseBackendDate(item.issueDate),
            sebebi: item.reason ?? "",
            emrNomresi: item.orderNumber ?? "",
            employeeId: item.employeeId,
          }),
        );

      const stateAwardList = performanceData?.result?.personStateAwardList;
      const mappedExtraIncentives: IncentiveItem[] = Array.isArray(stateAwardList)
        ? stateAwardList.map(
            (item: {
              id: string;
              stateAwardId: string | null;
              stateAward: string | null;
              typeCode: string | null;
              documentDate: string | null;
              documentNumber: string | null;
              employeeId?: string | number;
            }) => ({
              id: item.id,
              adi: findOption(item.typeCode, stateAwardOptions),
              nov: item.stateAwardId
                ? { id: item.stateAwardId, fullName: item.stateAward ?? "" }
                : null,
              verilmeTarixi: parseBackendDate(item.documentDate),
              sebebi: "",
              emrNomresi: item.documentNumber ?? "",
              employeeId: item.employeeId,
            }),
          )
        : [];

      setAddedIncentives(mappedIncentives);
      setAddedExtraIncentives(mappedExtraIncentives);
      setAddedDisciplinary(mappedDisciplinary);
    }, [performanceData, rewardTypeOptions, disciplinaryTypeOptions, stateAwardOptions]);

    const normalizedEmployeeId =
      employeeId != null && String(employeeId).trim() !== ""
        ? String(employeeId).trim()
        : null;

    const normalizedRootCompanyId =
      effectiveRootCompanyId != null &&
      String(effectiveRootCompanyId).trim() !== ""
        ? String(effectiveRootCompanyId).trim()
        : null;

    const canManagePerformanceRow = useMemo(
      () => (item: PerformanceTableItem) => {
        const selectedEmployeeId = String(employeeId ?? "").trim().toLowerCase();
        const itemEmployeeId = String(item.employeeId ?? "").trim().toLowerCase();
        
        if (!selectedEmployeeId) return true;
        if (!itemEmployeeId) return false;
        return itemEmployeeId === selectedEmployeeId;
      },
      [employeeId]
    );

    const canManageListedRow = useMemo(
      () => (item: IncentiveItem | DisciplinaryWarningItem) => {
        const selectedEmployeeId = String(employeeId ?? "").trim().toLowerCase();
        const itemEmployeeId = String(item.employeeId ?? "").trim().toLowerCase();
        
        if (!selectedEmployeeId) return true;
        if (!itemEmployeeId || itemEmployeeId === "undefined" || itemEmployeeId === "null") return true; 
        return itemEmployeeId === selectedEmployeeId;
      },
      [employeeId]
    );

    const handleAddPerformance = async (values: PerformanceFormValue) => {
      const safePersonId = personId ?? "";
      const { il, qiymet, illikBonusMeblegi } = values;
      if (il == null || !qiymet.trim() || !illikBonusMeblegi.trim()) return;

      const rating = Number(qiymet.trim().replace(",", "."));
      const annualBonus = Number(illikBonusMeblegi.trim().replace(",", "."));

      try {
        const payload: PerformanceEntryRequest = {
          personId: safePersonId,
          id: editingPerformanceId,
          isModify: !!editingPerformanceId,
          year: il.getFullYear(),
          rating,
          annualBonus,
          employeeId: normalizedEmployeeId,
          rootCompanyId: normalizedRootCompanyId,
        };

        const response =
          await createWorkerService.addOrEditPerformanceInfo(payload);
        if (!response?.isSuccess) {
          if (response?.errorMessage) toast.error(response.errorMessage);
          return;
        }
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          toast.error(getBackendErrorMessage(error));
        } else {
          toast.error("Gözlənilməz xəta baş verdi");
        }
        return;
      }

      setPerformanceFormValue(initialPerformanceFormValue);
      setEditingPerformanceId(null);
      void refetch();
    };

    const handleEditPerformance = (item: PerformanceTableItem) => {
      setEditingPerformanceId(String(item.id));
      setPerformanceFormValue({
        il: item.il,
        qiymet: item.qiymet,
        illikBonusMeblegi: item.illikBonusMeblegi,
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleRemovePerformance = (id: string | number) => {
      const idStr = String(id).trim();
      if (!idStr) return;
      setPerformanceIdToDelete(idStr);
      setIsDeleteModalOpen(true);
    };

    const confirmRemovePerformance = async () => {
      if (!performanceIdToDelete) return;
      try {
        const response = await createWorkerService.removePerformanceInfo(
          performanceIdToDelete,
        );
        if (!response?.isSuccess) {
          if (response?.errorMessage) toast.error(response.errorMessage);
          return;
        }
        void refetch();
      } catch (error: unknown) {
        const message =
          error && typeof error === "object" && "response" in error
            ? (error as { response?: { data?: { errorMessage?: string } } })
                .response?.data?.errorMessage
            : undefined;
        if (message) toast.error(message);
      } finally {
        setIsDeleteModalOpen(false);
        setPerformanceIdToDelete(null);
      }
    };

    const [newIncentive, setNewIncentive] = useState<NewIncentiveState>({
      adi: null,
      verilmeTarixi: null,
      sebebi: "",
      emrNomresi: "",
    });
    const [addedIncentives, setAddedIncentives] = useState<IncentiveItem[]>([]);

    const [newExtraIncentive, setNewExtraIncentive] = useState<NewIncentiveState>({
      adi: null,
      verilmeTarixi: null,
      sebebi: "",
      emrNomresi: "",
    });
    const [addedExtraIncentives, setAddedExtraIncentives] = useState<IncentiveItem[]>([]);

    const handleNewIncentiveChange = <K extends keyof NewIncentiveState>(
      field: K,
      value: NewIncentiveState[K],
    ) => {
      setNewIncentive((prev) => ({ ...prev, [field]: value }));
    };

    const handleNewExtraIncentiveChange = <K extends keyof NewIncentiveState>(
      field: K,
      value: NewIncentiveState[K],
    ) => {
      setNewExtraIncentive((prev) => ({ ...prev, [field]: value }));
    };

    const handleAddIncentive = async () => {
      if (
        !newIncentive.adi ||
        !newIncentive.verilmeTarixi ||
        !newIncentive.sebebi.trim() ||
        !newIncentive.emrNomresi.trim()
      )
        return;
      try {
        const payload: PersonnelActionEntryRequest = {
          personId: personId ?? "",
          personnelActionTypeCode: "Reward",
          rewardTypeCode: newIncentive.adi?.id
            ? String(newIncentive.adi.id)
            : null,
          disciplinaryActionTypeCode: null,
          issueDate: formatDateToYMD(newIncentive.verilmeTarixi),
          reason: newIncentive.sebebi.trim(),
          orderNumber: newIncentive.emrNomresi.trim(),
          employeeId: normalizedEmployeeId,
          rootCompanyId: normalizedRootCompanyId,
        };
        const response =
          await createWorkerService.addPersonnelActionInfo(payload);
        if (!response?.isSuccess) {
          if (response?.errorMessage) toast.error(response.errorMessage);
          return;
        }
        setNewIncentive({
          adi: null,
          verilmeTarixi: null,
          sebebi: "",
          emrNomresi: "",
        });
        void refetch();
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          toast.error(getBackendErrorMessage(error));
        } else {
          toast.error("Gözlənilməz xəta baş verdi");
        }
      }
    };

    const handleAddExtraIncentive = async () => {
      if (
        !personId ||
        !newExtraIncentive.adi ||
        !newExtraIncentive.nov ||
        !newExtraIncentive.verilmeTarixi ||
        !newExtraIncentive.emrNomresi.trim()
      )
        return;
      try {
        const payload = {
          personId: String(personId),
          stateAwardId: newExtraIncentive.nov?.id
            ? String(newExtraIncentive.nov.id)
            : null,
          documentDate: formatDateToYMD(newExtraIncentive.verilmeTarixi) as string,
          documentNumber: newExtraIncentive.emrNomresi.trim(),
        };
        const response =
          await createWorkerService.addPersonStateAwardInfo(payload);
        if (!response?.isSuccess) {
          if (response?.errorMessage) toast.error(response.errorMessage);
          return;
        }
        setNewExtraIncentive({
          adi: null,
          nov: null,
          verilmeTarixi: null,
          sebebi: "",
          emrNomresi: "",
        });
        void refetch();
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          toast.error(getBackendErrorMessage(error));
        } else {
          toast.error("Gözlənilməz xəta baş verdi");
        }
      }
    };

    const handleRemoveIncentive = (id: string | number) => {
      const idStr = String(id).trim();
      if (!idStr) return;
      setActionIdToDelete(idStr);
      setIsActionDeleteModalOpen(true);
    };

    const handleRemoveExtraIncentive = (id: string | number) => {
      const idStr = String(id).trim();
      if (!idStr) return;
      setStateAwardIdToDelete(idStr);
      setIsStateAwardDeleteModalOpen(true);
    };

    const confirmRemoveStateAward = async () => {
      if (!stateAwardIdToDelete) return;
      try {
        const response = await createWorkerService.removePersonStateAwardInfo(
          stateAwardIdToDelete,
        );
        if (!response?.isSuccess) {
          if (response?.errorMessage) toast.error(response.errorMessage);
          return;
        }
        void refetch();
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          toast.error(getBackendErrorMessage(error));
        } else {
          toast.error("Gözlənilməz xəta baş verdi");
        }
      } finally {
        setIsStateAwardDeleteModalOpen(false);
        setStateAwardIdToDelete(null);
      }
    };

    const handleListIncentiveChange = <K extends keyof IncentiveItem>(
      id: string | number,
      field: K,
      value: IncentiveItem[K],
    ) => {
      setAddedIncentives((prev) =>
        prev.map((x) => (x.id === id ? { ...x, [field]: value } : x)),
      );
    };

    const handleListExtraIncentiveChange = <K extends keyof IncentiveItem>(
      id: string | number,
      field: K,
      value: IncentiveItem[K],
    ) => {
      setAddedExtraIncentives((prev) =>
        prev.map((x) => (x.id === id ? { ...x, [field]: value } : x)),
      );
    };

    const [newDisciplinary, setNewDisciplinary] =
      useState<NewDisciplinaryWarningState>({
        adi: null,
        verilmeTarixi: null,
        sebebi: "",
        emrNomresi: "",
      });
    const [addedDisciplinary, setAddedDisciplinary] = useState<
      DisciplinaryWarningItem[]
    >([]);

    const handleNewDisciplinaryChange = <
      K extends keyof NewDisciplinaryWarningState,
    >(
      field: K,
      value: NewDisciplinaryWarningState[K],
    ) => {
      setNewDisciplinary((prev) => ({ ...prev, [field]: value }));
    };

    const handleAddDisciplinary = async () => {
      if (
        !newDisciplinary.adi ||
        !newDisciplinary.verilmeTarixi ||
        !newDisciplinary.sebebi.trim() ||
        !newDisciplinary.emrNomresi.trim()
      )
        return;
      try {
        const payload: PersonnelActionEntryRequest = {
          personId: personId ?? "",
          personnelActionTypeCode: "Disciplinary",
          rewardTypeCode: null,
          disciplinaryActionTypeCode: newDisciplinary.adi?.id
            ? String(newDisciplinary.adi.id)
            : null,
          issueDate: formatDateToYMD(newDisciplinary.verilmeTarixi),
          reason: newDisciplinary.sebebi.trim(),
          orderNumber: newDisciplinary.emrNomresi.trim(),
          employeeId: normalizedEmployeeId,
          rootCompanyId: normalizedRootCompanyId,
        };
        const response =
          await createWorkerService.addPersonnelActionInfo(payload);
        if (!response?.isSuccess) {
          if (response?.errorMessage) toast.error(response.errorMessage);
          return;
        }
        setNewDisciplinary({
          adi: null,
          verilmeTarixi: null,
          sebebi: "",
          emrNomresi: "",
        });
        void refetch();
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          toast.error(getBackendErrorMessage(error));
        } else {
          toast.error("Gözlənilməz xəta baş verdi");
        }
      }
    };

    const handleRemoveDisciplinary = (id: string | number) => {
      const idStr = String(id).trim();
      if (!idStr) return;
      setActionIdToDelete(idStr);
      setIsActionDeleteModalOpen(true);
    };

    const confirmRemovePersonnelAction = async () => {
      if (!actionIdToDelete) return;
      try {
        const response =
          await createWorkerService.removePersonnelActionInfo(actionIdToDelete);
        if (!response?.isSuccess) {
          if (response?.errorMessage) toast.error(response.errorMessage);
          return;
        }
        void refetch();
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          toast.error(getBackendErrorMessage(error));
        } else {
          toast.error("Gözlənilməz xəta baş verdi");
        }
      } finally {
        setIsActionDeleteModalOpen(false);
        setActionIdToDelete(null);
      }
    };

    const handleListDisciplinaryChange = <
      K extends keyof DisciplinaryWarningItem,
    >(
      id: string | number,
      field: K,
      value: DisciplinaryWarningItem[K],
    ) => {
      setAddedDisciplinary((prev) =>
        prev.map((x) => (x.id === id ? { ...x, [field]: value } : x)),
      );
    };

    return (
      <div className={styles.container}>
        <PerformanceForm
          value={performanceFormValue}
          onAdd={handleAddPerformance}
          addButtonLabel={editingPerformanceId ? "Yenilə" : "Əlavə et"}
          isEditMode={!!editingPerformanceId}
        />
        <PerformanceTable
          items={performanceItems}
          onRemove={handleRemovePerformance}
          onEdit={handleEditPerformance}
          canManageRow={canManagePerformanceRow}
        />
        <IncentiveMeasuresSection
          newIncentive={newExtraIncentive}
          addedIncentives={addedExtraIncentives}
          onNewIncentiveChange={handleNewExtraIncentiveChange}
          onAddIncentive={handleAddExtraIncentive}
          onRemoveIncentive={handleRemoveExtraIncentive}
          onListIncentiveChange={handleListExtraIncentiveChange}
          createPermission={PERMISSIONS.EMPLOYEE.CREATE}
          deletePermission={PERMISSIONS.EMPLOYEE.DELETE}
          title="Dövlət təltifi məlumatları"
          lookupCode="StateAwardTypes"
          firstFieldLabel="Növü"
          showSecondSelect={true}
          secondSelectLabel="Adı"
          dateFieldLabel="Sənəd tarixi"
          orderNumberFieldLabel="Sənəd nömrəsi"
          showReasonField={false}
          disableListedIncentives={true}
          canManageRow={canManageListedRow}
        />
        <IncentiveMeasuresSection
          newIncentive={newIncentive}
          addedIncentives={addedIncentives}
          onNewIncentiveChange={handleNewIncentiveChange}
          onAddIncentive={handleAddIncentive}
          onRemoveIncentive={handleRemoveIncentive}
          onListIncentiveChange={handleListIncentiveChange}
          createPermission={PERMISSIONS.EMPLOYEE.CREATE}
          deletePermission={PERMISSIONS.EMPLOYEE.DELETE}
          title="Həvəsləndirmə tədbirləri barədə məlumat"
          disableListedIncentives={true}
          canManageRow={canManageListedRow}
        />
        <DisciplinaryWarningsSection
          title="İntizam tənbehi tədbirləri və yazılı xəbərdarlıq barədə məlumat"
          newItem={newDisciplinary}
          addedItems={addedDisciplinary}
          onNewItemChange={handleNewDisciplinaryChange}
          onAddItem={handleAddDisciplinary}
          onRemoveItem={handleRemoveDisciplinary}
          onListItemChange={handleListDisciplinaryChange}
          createPermission={PERMISSIONS.EMPLOYEE.CREATE}
          deletePermission={PERMISSIONS.EMPLOYEE.DELETE}
          disableListedItems={true}
          canManageRow={canManageListedRow}
        />
        <ConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setPerformanceIdToDelete(null);
          }}
          onConfirm={confirmRemovePerformance}
          title="Məlumatı silmək istədiyinizə əminsiniz?"
          description="Bu məlumatı sildikdə geri qaytara bilməyəcəksiniz."
          confirmText="Sil"
          cancelText="Ləğv et"
          variant="danger"
        />
        <ConfirmModal
          isOpen={isActionDeleteModalOpen}
          onClose={() => {
            setIsActionDeleteModalOpen(false);
            setActionIdToDelete(null);
          }}
          onConfirm={confirmRemovePersonnelAction}
          title="Məlumatı silmək istədiyinizə əminsiniz?"
          description="Bu məlumatı sildikdə geri qaytara bilməyəcəksiniz."
          confirmText="Sil"
          cancelText="Ləğv et"
          variant="danger"
        />
        <ConfirmModal
          isOpen={isStateAwardDeleteModalOpen}
          onClose={() => {
            setIsStateAwardDeleteModalOpen(false);
            setStateAwardIdToDelete(null);
          }}
          onConfirm={confirmRemoveStateAward}
          title="Məlumatı silmək istədiyinizə əminsiniz?"
          description="Bu məlumatı sildikdə geri qaytara bilməyəcəksiniz."
          confirmText="Sil"
          cancelText="Ləğv et"
          variant="danger"
        />
      </div>
    );
  },
);

export default PerformanceIndicatorsTab;
