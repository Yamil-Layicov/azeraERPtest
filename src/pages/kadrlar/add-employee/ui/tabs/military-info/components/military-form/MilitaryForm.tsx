import React, { useState } from "react";
import { Button, ConfirmModal, FormInput, ModernDatePicker} from "@/shared/ui";
import { EnumLookupSelect } from "@/features/lookups";
import { PermissionGuard } from "@/features/auth/components/PermissionGuard";
import { PERMISSIONS } from "@/shared/consts/permissions";
import type { Option } from "@/shared/types";
import { IncentiveMeasuresSection } from "@/pages/kadrlar/employee-shared/ui/incentive-measures-info";
import type { IncentiveItem, NewIncentiveState } from "@/pages/kadrlar/employee-shared/model/types";
import { createWorkerService } from "@/features/kadrlar/create-worker/api/createWorkerService";
import { getBackendErrorMessage } from "@/shared/api";
import { formatDateToYMD } from "@/shared/lib/utils";
import axios from "axios";
import type { PersonSpecialRankEntryRequest } from "@/features/kadrlar/create-worker/model/types";
import toast from "react-hot-toast";
import styles from "./MilitaryForm.module.css";
// import { useAddEmployeeStore } from "@/features/kadrlar/create-worker/model/useAddEmployeeStore";

export interface MilitaryFormState {
  ticketNumber: string;
  issueDate: Date | null;
  rank: Option | null;
  serviceInfo: Option | null;
}

const INITIAL_STATE: MilitaryFormState = {
  ticketNumber: "",
  issueDate: null,
  rank: null,
  serviceInfo: null,
};

export interface MilitaryFormProps {
  personId?: string | null;
  onSubmit?: () => void;
  addButtonLabel?: string;
  isEditMode?: boolean;
  tableContent?: React.ReactNode;
  initialSpecialRanks?: {
    id: string;
    organ: Option | null;
    specialRankId: string;
    /** GET cavabındakı `specialRank` — seçicidə göstərmə üçün */
    specialRankLabel?: string;
    issueDate: Date | null;
  }[];
  onRefetch?: () => void;
}

export interface MilitaryFormHandle {
  validateAndGet: () => MilitaryFormState | null;
  getValues: () => MilitaryFormState;
  setValues: (values: MilitaryFormState) => void;
  clear: () => void;
}

export const MilitaryForm = React.forwardRef<MilitaryFormHandle, MilitaryFormProps>(
  ({ personId, onSubmit, addButtonLabel = "Əlavə et", isEditMode = false, tableContent, initialSpecialRanks, onRefetch }, ref) => {
  const [formState, setFormState] = useState<MilitaryFormState>(INITIAL_STATE);
  const [newIncentive, setNewIncentive] = useState<NewIncentiveState>({
    organ: null,
    adi: null,
    verilmeTarixi: null,
    sebebi: "",
    emrNomresi: "",
  });
  const [addedIncentives, setAddedIncentives] = useState<IncentiveItem[]>([]);
  const [verilmeTarixiResetSeq, setVerilmeTarixiResetSeq] = useState(0);
  const [pendingIncentiveRemoveId, setPendingIncentiveRemoveId] = useState<string | number | null>(null);

  React.useImperativeHandle(ref, () => ({
    validateAndGet: () => {
      const { ticketNumber, issueDate, rank, serviceInfo } = formState;
      if (
        !ticketNumber.trim() ||
        !issueDate ||
        !rank ||
        !serviceInfo
      ) {
        return null;
      }
      return formState;
    },
    getValues: () => formState,
    setValues: (values: MilitaryFormState) => {
      setFormState(values);
    },
    clear: () => {
      setFormState(INITIAL_STATE);
    },
  }));

  React.useEffect(() => {
    if (!initialSpecialRanks) return;
    setAddedIncentives(initialSpecialRanks.map((item) => {
      const label = item.specialRankLabel?.trim() ?? "";
      return {
        id: item.id,
        organ: item.organ ?? null,
        adi: {
          id: item.specialRankId,
          fullName: label,
          label,
          shortName: "",
          code: "",
        },
        verilmeTarixi: item.issueDate,
        sebebi: "",
        emrNomresi: "",
      };
    }));
  }, [initialSpecialRanks]);

  const handleNewIncentiveChange = <K extends keyof NewIncentiveState>(
    field: K,
    value: NewIncentiveState[K]
  ) => {
    setNewIncentive((prev) => ({ ...prev, [field]: value }));
  };


  const handleAddIncentive = async () => {
    if (
      !newIncentive.adi ||
      !newIncentive.verilmeTarixi
    ) {
      return;
    }
    if (!personId) return;

    try {
      const payload: PersonSpecialRankEntryRequest = {
        personId,
        specialRankId: String(newIncentive.adi?.id),
        issueDate: String(formatDateToYMD(newIncentive.verilmeTarixi) ?? ""),
      };

      const response = await createWorkerService.addPersonSpecialRankInfo(payload);
      if (!response?.isSuccess) {
        if (response?.errorMessage) toast.error(response.errorMessage);
        return;
      }

      const relationId =
        (typeof response?.result === "string" ? response.result : null) ??
        response?.result?.id ??
        response?.result?.Id ??
        response?.result?.personSpecialRankInfoId ??
        response?.result?.specialRankInfoId ??
        response?.result?.[0]?.id ??
        response?.result?.[0]?.Id ??
        response?.result?.[0]?.personSpecialRankInfoId ??
        response?.result?.[0]?.specialRankInfoId ??
        Date.now();

      setVerilmeTarixiResetSeq((s) => s + 1);
      setAddedIncentives((prev) => [
        ...prev,
        {
          id: relationId,
          organ: newIncentive.organ ?? null,
          adi: newIncentive.adi,
          verilmeTarixi: newIncentive.verilmeTarixi,
          sebebi: "",
          emrNomresi: "",
        },
      ]);
      setNewIncentive({
        organ: null,
        adi: null,
        verilmeTarixi: null,
        sebebi: "",
        emrNomresi: "",
      });
      onRefetch?.();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(getBackendErrorMessage(error));
      } else {
        toast.error("Gözlənilməz xəta baş verdi");
      }
    }
  };

  const handleRemoveIncentiveRequest = (id: string | number) => {
    setPendingIncentiveRemoveId(id);
  };

  const confirmRemoveIncentive = () => {
    if (pendingIncentiveRemoveId == null) return;

    void (async () => {
      try {
        const id = String(pendingIncentiveRemoveId);
        const response = await createWorkerService.removePersonSpecialRankInfo(id);
        if (!response?.isSuccess) {
          if (response?.errorMessage) toast.error(response.errorMessage);
          return;
        }

        setAddedIncentives((prev) => prev.filter((item) => String(item.id) !== id));
        setPendingIncentiveRemoveId(null);
        onRefetch?.();
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          toast.error(getBackendErrorMessage(error));
        } else {
          toast.error("Gözlənilməz xəta baş verdi");
        }
      }
    })();
  };

  const handleListIncentiveChange = <K extends keyof IncentiveItem>(
    id: string | number,
    field: K,
    value: IncentiveItem[K]
  ) => {
    setAddedIncentives((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleClearAll = () => {
    setFormState(INITIAL_STATE);
    setVerilmeTarixiResetSeq((s) => s + 1);
    setNewIncentive({
      organ: null,
      adi: null,
      verilmeTarixi: null,
      sebebi: "",
      emrNomresi: "",
    });
    setAddedIncentives([]);
  };

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        <FormInput
          id="military-ticket-number"
          type="text"
          label="Hərbi biletin seriyası və nömrəsi"
          placeholder="Daxil edin"
          value={formState.ticketNumber}
          onChange={(val) =>
            setFormState({ ...formState, ticketNumber: val })
          }
        />

        <ModernDatePicker
          id="military-issue-date"
          label="Verilmə tarixi"
          value={formState.issueDate}
          onChange={(date: Date | null) =>
            setFormState({ ...formState, issueDate: date })
          }
          placeholder="dd.mm.yyyy"
        />

        <div className={styles.field}>
          <label className={styles.label} htmlFor="military-rank">
            Hərbi rütbəsi
          </label>
          <EnumLookupSelect
            id="military-rank"
            code="MilitaryRanks"
            defaultText="Seçin..."
            value={formState.rank}
            onChange={(val) => setFormState({ ...formState, rank: val })}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="military-service-info">
            Hərbi xidməti barədə məlumat
          </label>
          <EnumLookupSelect
            id="military-service-info"
            code="MilitaryStatuses"
            defaultText="Seçin..."
            value={formState.serviceInfo}
            onChange={(val) => setFormState({ ...formState, serviceInfo: val })}
          />
        </div>

      </div>

      <div className={styles.actions}>
        <PermissionGuard
          permission={isEditMode ? PERMISSIONS.EMPLOYEE.UPDATE : PERMISSIONS.EMPLOYEE.CREATE}
        >
          <Button
            type="button"
            variant="secondary"
            className={styles.addButton}
            onClick={() => onSubmit?.()}
          >
            {addButtonLabel}
          </Button>
        </PermissionGuard>
        <Button
          type="button"
          variant="outline"
          className={styles.clearButton}
          onClick={handleClearAll}
        >
          Təmizlə
        </Button>
      </div>

      {tableContent}

      <IncentiveMeasuresSection
        title="Xüsusi rütbə"
        showOrgansField={true}
        organsFieldLabel="Orqanlar"
        showReasonAndOrderFields={false}
        firstFieldLabel="Adı"
        firstFieldType="specialRank"
        newIncentiveVerilmeResetKey={verilmeTarixiResetSeq}
        newIncentive={newIncentive}
        addedIncentives={addedIncentives}
        onNewIncentiveChange={handleNewIncentiveChange}
        onAddIncentive={handleAddIncentive}
        onRemoveIncentive={handleRemoveIncentiveRequest}
        onListIncentiveChange={handleListIncentiveChange}
        createPermission={PERMISSIONS.EMPLOYEE.CREATE}
        deletePermission={PERMISSIONS.EMPLOYEE.DELETE}
      />
      <ConfirmModal
        isOpen={pendingIncentiveRemoveId != null}
        onClose={() => setPendingIncentiveRemoveId(null)}
        onConfirm={confirmRemoveIncentive}
        title="Məlumatı silmək istədiyinizə əminsiniz?"
        description="Bu məlumatı sildikdə geri qaytara bilməyəcəksiniz."
        confirmText="Sil"
        cancelText="Ləğv et"
        variant="danger"
      />
    </div>
  );
});