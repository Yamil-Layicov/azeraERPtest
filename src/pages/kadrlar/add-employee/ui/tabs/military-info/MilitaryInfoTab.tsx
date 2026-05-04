import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MilitaryForm } from "./components/military-form/MilitaryForm";
import type { MilitaryFormHandle } from "./components/military-form/MilitaryForm";
import { MilitaryTable } from "./components/military-table";
import { useAddEmployeeStore } from "@/features/kadrlar/create-worker/model/useAddEmployeeStore";
import { createWorkerService } from "@/features/kadrlar/create-worker/api/createWorkerService";
import { useEnumItemsByCode } from "@/features/lookups/hooks";
import toast from "react-hot-toast";
import type { MilitaryServiceEntryRequest, PersonSpecialRankListItem } from "@/features/kadrlar/create-worker/model/types";
import { ConfirmModal } from "@/shared/ui";
import { formatDateToYMD } from "@/shared/lib/utils";
import { getBackendErrorMessage } from "@/shared/api";
import axios from "axios";

export interface MilitaryInfoTabHandle {
  submit: () => Promise<void>;
  isDirty: () => boolean;
}



const parseBackendDate = (value: string | null | undefined): Date | null => {
  if (!value) return null;
  const direct = new Date(value);
  if (!Number.isNaN(direct.getTime())) return direct;

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

export const MilitaryInfoTab = forwardRef<MilitaryInfoTabHandle>((_, ref) => {
  const formRef = useRef<MilitaryFormHandle>(null);
  const { personId, currentStep, setStepCompleted } = useAddEmployeeStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [militaryDeleteId, setMilitaryDeleteId] = useState<string | null>(null);
  const { options: militaryRankOptions } = useEnumItemsByCode("MilitaryRanks", currentStep === 10);
  const { options: militaryStatusOptions } = useEnumItemsByCode("MilitaryStatuses", currentStep === 10);
  const { options: organOptions } = useEnumItemsByCode("Organs", currentStep === 10);
  const { data: militaryInfoData, refetch } = useQuery({
    queryKey: ["militaryInfo", personId],
    queryFn: () => createWorkerService.getMilitaryServicesInfoByPersonId(personId!),
    enabled: false,
  });

  useEffect(() => {
    if (currentStep !== 10 || !personId) return;
    void refetch();
  }, [currentStep, personId, refetch]);

  const militaryTableItems = useMemo(() => {
    const militaryService = militaryInfoData?.result?.militaryService;
    if (!militaryService) return [];

    const findOptionLabel = (
      code: string | null | undefined,
      options: { id: string | number; fullName?: string }[],
    ) => {
      if (!code) return "—";
      return options.find((x) => String(x.id) === String(code))?.fullName ?? code;
    };

    return [
      {
        id: militaryService.id,
        militaryBookNumber: militaryService.militaryBookNumber ?? "",
        issueDate: parseBackendDate(militaryService.issueDate),
        militaryRankCode: militaryService.militaryRankCode ?? null,
        militaryStatusCode: militaryService.militaryStatusCode ?? null,
        militaryRank: findOptionLabel(militaryService.militaryRankCode, militaryRankOptions),
        militaryStatus: findOptionLabel(militaryService.militaryStatusCode, militaryStatusOptions),
      },
    ];
  }, [militaryInfoData, militaryRankOptions, militaryStatusOptions]);

  const specialRankInitialItems = useMemo(() => {
    const list: PersonSpecialRankListItem[] = militaryInfoData?.result?.specialRankList ?? [];
    if (!Array.isArray(list) || list.length === 0) return [];

    const findOrganOption = (code: string | null | undefined) => {
      if (!code) return null;
      const found = organOptions.find((o) => String(o.id) === String(code));
      if (found) return found;
      return { id: code, fullName: code, label: code };
    };

    return list.map((item) => {
      const row = item as PersonSpecialRankListItem & Record<string, unknown>;
      const id = String(
        item.id ??
          row.Id ??
          row.personSpecialRankInfoId ??
          row.PersonSpecialRankInfoId ??
          row.specialRankInfoId ??
          row.SpecialRankInfoId ??
          "",
      );
      const organCode = String(item.organCode ?? row.OrganCode ?? "").trim();
      const specialRankId = String(item.specialRankId ?? row.SpecialRankId ?? "").trim();
      const specialRankLabel = String(
        item.specialRank ?? row.specialRank ?? row.SpecialRank ?? "",
      ).trim();
      const issueRaw = String(item.issueDate ?? row.IssueDate ?? "").trim();

      return {
        id,
        organ: findOrganOption(organCode || null),
        specialRankId,
        specialRankLabel: specialRankLabel || undefined,
        issueDate: parseBackendDate(issueRaw || null),
      };
    });
  }, [militaryInfoData, organOptions]);

  const submitMilitaryInfo = async () => {
    const values = formRef.current?.getValues();
    if (!values || !personId) return;

    const payload: MilitaryServiceEntryRequest = {
      personId,
      id: editingId,
      isModify: !!editingId,
      militaryBookNumber: values.ticketNumber.trim(),
      issueDate: formatDateToYMD(values.issueDate),
      militaryRankCode: values.rank?.id ? String(values.rank.id) : null,
      militaryStatusCode: values.serviceInfo?.id ? String(values.serviceInfo.id) : null,
    };

    try {
      const response = await createWorkerService.addOrEditMilitaryServiceInfo(payload);
      if (!response?.isSuccess) {
        if (response?.errorMessage) toast.error(response.errorMessage);
        return;
      }
      setStepCompleted(10);
      toast.success("Hərbi xidmət məlumatları yadda saxlanıldı");
      setEditingId(null);
      formRef.current?.clear();
      void refetch();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(getBackendErrorMessage(error));
      } else {
        toast.error("Gözlənilməz xəta baş verdi");
      }
    }
  };

  useImperativeHandle(ref, () => ({
    submit: submitMilitaryInfo,
    isDirty: () => false,
  }));

  const handleEdit = (item: (typeof militaryTableItems)[number]) => {
    const rankOption =
      militaryRankOptions.find((opt) => String(opt.id) === String(item.militaryRankCode ?? "")) ?? null;
    const statusOption =
      militaryStatusOptions.find((opt) => String(opt.id) === String(item.militaryStatusCode ?? "")) ?? null;

    formRef.current?.setValues({
      ticketNumber: item.militaryBookNumber,
      issueDate: item.issueDate,
      rank: rankOption,
      serviceInfo: statusOption,
    });
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRemoveRequest = (id: string) => {
    if (!id) return;
    setMilitaryDeleteId(id);
  };

  const confirmMilitaryRemove = async () => {
    const id = militaryDeleteId;
    if (!id) return;
    try {
      const response = await createWorkerService.removeMilitaryServiceInfo(id);
      if (!response?.isSuccess) {
        if (response?.errorMessage) toast.error(response.errorMessage);
        return;
      }
      if (editingId === id) {
        setEditingId(null);
        formRef.current?.clear();
      }
      toast.success("Məlumat silindi");
      void refetch();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(getBackendErrorMessage(error));
      } else {
        toast.error("Gözlənilməz xəta baş verdi");
      }
    } finally {
      setMilitaryDeleteId(null);
    }
  };

  return (
    <div>
      <MilitaryForm
        ref={formRef}
        personId={personId}
        onRefetch={refetch}
        onSubmit={submitMilitaryInfo}
        addButtonLabel={editingId ? "Yenilə" : "Əlavə et"}
        isEditMode={!!editingId}
        initialSpecialRanks={specialRankInitialItems}
        tableContent={
          <MilitaryTable items={militaryTableItems} onEdit={handleEdit} onRemove={handleRemoveRequest} />
        }
      />
      <ConfirmModal
        isOpen={!!militaryDeleteId}
        onClose={() => setMilitaryDeleteId(null)}
        onConfirm={confirmMilitaryRemove}
        title="Məlumatı silmək istədiyinizə əminsiniz?"
        description="Bu məlumatı sildikdə geri qaytara bilməyəcəksiniz."
        confirmText="Sil"
        cancelText="Ləğv et"
        variant="danger"
      />
    </div>
  );
});

MilitaryInfoTab.displayName = "MilitaryInfoTab";
