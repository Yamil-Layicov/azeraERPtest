import { useState, useEffect } from "react";
import { FormTextarea, FileDropzone, Button } from "@/shared/ui";
import styles from "./SpecialNotesTab.module.css";
import { useAddEmployeeStore } from "@/features/kadrlar/create-worker/model/useAddEmployeeStore";
import { createWorkerService } from "@/features/kadrlar/create-worker/api/createWorkerService";
import type { SpecialNoteEntryRequest } from "@/features/kadrlar/create-worker/model/types";
import { toast } from "react-hot-toast";
import axios from "axios";
import { getBackendErrorMessage } from "@/shared/api";
import { useQuery } from "@tanstack/react-query";
import { useEmployeeStore } from "@/features/kadrlar/create-worker/model/useEmployeeStore";
import { lookupsService } from "@/features/lookups";
import type { EnumLookupItem } from "@/features/lookups/model/types";

const DEFAULT_HIRING_TYPE = "HiringOpinion";
const DEFAULT_PROBATION_TYPE = "ProbationResult";
const SPECIAL_NOTE_UPLOAD_TYPE = "SpecialNote";

type InnerTab = "vacation" | "business-trip" | "permission" | "sick-leave" | "privileges" | "special-notes";

interface SpecialNotesTabProps {
  activeInnerTab?: InnerTab;
  tabVisitKey?: number;
}

type ExistingSpecialAttachment = {
  rowId: string;
  attachmentId: string;
  fileName: string;
  type: string;
};

export const SpecialNotesTab = ({
  activeInnerTab = "special-notes",
  tabVisitKey = 0,
}: SpecialNotesTabProps) => {
  const [value, setValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hiringOpinionFiles, setHiringOpinionFiles] = useState<File[] | null>(null);
  const [probationResultFiles, setProbationResultFiles] = useState<File[] | null>(null);
  const [existingHiringAttachments, setExistingHiringAttachments] = useState<ExistingSpecialAttachment[]>([]);
  const [existingProbationAttachments, setExistingProbationAttachments] = useState<ExistingSpecialAttachment[]>([]);
  const [deletedAttachments, setDeletedAttachments] = useState<ExistingSpecialAttachment[]>([]);

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
  const normalizedRootCompanyId =
    effectiveRootCompanyId != null &&
    String(effectiveRootCompanyId).trim() !== ""
      ? String(effectiveRootCompanyId).trim()
      : null;
  const { data: specialNoteAttachTypeData } = useQuery({
    queryKey: ["specialNoteAttachTypeLookup"],
    queryFn: ({ signal }) => lookupsService.getSpecialNoteAttachType(signal),
    staleTime: 1000 * 60 * 60,
  });
  const { refetch: refetchSpecialNote } = useQuery({
    queryKey: ["specialNoteInfo", personId],
    queryFn: () => createWorkerService.getSpecialNoteInfoByPersonId(personId!),
    enabled: false,
  });

  const attachTypeItems: EnumLookupItem[] =
    specialNoteAttachTypeData?.result ?? specialNoteAttachTypeData?.data ?? [];

  const findTypeValueByLabel = (label: string, fallbackValue: string): string => {
    const found = attachTypeItems.find(
      (x) => String(x.label ?? "").trim().toLowerCase() === label.trim().toLowerCase(),
    );
    return String(found?.value ?? fallbackValue);
  };

  const hiringTypeValue = findTypeValueByLabel("İşə qəbul haqqında rəy", DEFAULT_HIRING_TYPE);
  const probationTypeValue = findTypeValueByLabel("Sınaq müddətinin nəticəsi haqqında", DEFAULT_PROBATION_TYPE);

  useEffect(() => {
    setValue("");
    setHiringOpinionFiles(null);
    setProbationResultFiles(null);
    setExistingHiringAttachments([]);
    setExistingProbationAttachments([]);
    setDeletedAttachments([]);
  }, [personId]);

  useEffect(() => {
    if (!personId) return;
    if (currentStep !== 9) return;
    if (activeInnerTab !== "special-notes") return;
    void refetchSpecialNote().then((result) => {
      const data = result.data;
      if (!data?.isSuccess || !data.result) return;
      setValue(String(data.result.note ?? ""));
      const all = Array.isArray(data.result.specialNoteAttachments)
        ? data.result.specialNoteAttachments
        : [];
      const normalized: ExistingSpecialAttachment[] = all
        .map((item) => {
          const rowId = String(item.id ?? "").trim();
          const attachmentId = String(item.attachment?.id ?? "").trim();
          if (!rowId || !attachmentId) return null;
          return {
            rowId,
            attachmentId,
            fileName: String(item.attachment?.fileName ?? attachmentId),
            type: String(item.specialNoteAttachType ?? ""),
          };
        })
        .filter((x): x is ExistingSpecialAttachment => x !== null);
      setExistingHiringAttachments(
        normalized.filter((x) => x.type.toLowerCase() === hiringTypeValue.toLowerCase()),
      );
      setExistingProbationAttachments(
        normalized.filter((x) => x.type.toLowerCase() === probationTypeValue.toLowerCase()),
      );
      setDeletedAttachments([]);
      // New-file pickers are local only.
      setHiringOpinionFiles(null);
      setProbationResultFiles(null);
    });
  }, [personId, currentStep, activeInnerTab, tabVisitKey, refetchSpecialNote, hiringTypeValue, probationTypeValue]);

  const handleAdd = async () => {
    if (!personId) {
      toast.error("İşçi ID tapılmadı");
      return;
    }

    setIsSubmitting(true);
    try {
      const attachments: SpecialNoteEntryRequest["attachments"] = [];

      attachments.push(
        ...existingHiringAttachments.map((item) => ({
          isCreate: false,
          isDeleted: false,
          id: item.rowId,
          attachmentId: item.attachmentId,
          type: hiringTypeValue,
        })),
        ...existingProbationAttachments.map((item) => ({
          isCreate: false,
          isDeleted: false,
          id: item.rowId,
          attachmentId: item.attachmentId,
          type: probationTypeValue,
        })),
        ...deletedAttachments.map((item) => ({
          isCreate: false,
          isDeleted: true,
          id: item.rowId,
          attachmentId: item.attachmentId,
          type: item.type,
        })),
      );

      if ((hiringOpinionFiles?.length ?? 0) > 0) {
        const uploadResponse = await createWorkerService.uploadFiles(
          hiringOpinionFiles ?? [],
          SPECIAL_NOTE_UPLOAD_TYPE,
        );
        if (!uploadResponse.isSuccess) {
          toast.error(uploadResponse.errorMessage || "Fayllar yüklənmədi");
          return;
        }
        const uploaded = (uploadResponse.result ?? [])
          .map((f) => f.attachId)
          .filter((id): id is string => !!id);
        attachments.push(
          ...uploaded.map((attachmentId) => ({
            isCreate: true,
            isDeleted: false,
            id: null,
            attachmentId,
            type: hiringTypeValue,
          })),
        );
      }

      if ((probationResultFiles?.length ?? 0) > 0) {
        const uploadResponse = await createWorkerService.uploadFiles(
          probationResultFiles ?? [],
          SPECIAL_NOTE_UPLOAD_TYPE,
        );
        if (!uploadResponse.isSuccess) {
          toast.error(uploadResponse.errorMessage || "Fayllar yüklənmədi");
          return;
        }
        const uploaded = (uploadResponse.result ?? [])
          .map((f) => f.attachId)
          .filter((id): id is string => !!id);
        attachments.push(
          ...uploaded.map((attachmentId) => ({
            isCreate: true,
            isDeleted: false,
            id: null,
            attachmentId,
            type: probationTypeValue,
          })),
        );
      }

      const payload: SpecialNoteEntryRequest = {
        personId,
        employeeId: normalizedEmployeeId,
        rootCompanyId: normalizedRootCompanyId,
        note: value.trim(),
        attachments,
      };

      const response = (await createWorkerService.addOrEditSpecialNoteInfo(payload)) as {
        isSuccess?: boolean;
        errorMessage?: string | null;
      };
      if (response?.isSuccess === false) {
        toast.error(response?.errorMessage ?? "Xəta baş verdi");
        return;
      }
      toast.success("Əlavə edildi");
      await refetchSpecialNote();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(getBackendErrorMessage(error));
      } else {
        toast.error("Xəta baş verdi");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <div className={styles.fieldGroup}>
          <FormTextarea
            id="specialNotes"
            label="Xüsusi qeydlər (yalnız holdingin İRD rəhbəri və məhdud sayda rəhbərlər üçün)"
            placeholder="Daxil edin"
            value={value}
            onChange={setValue}
            rows={4}
          />
        </div>

        <FileDropzone
          id="recruitment-feedback-files"
          label="İşə qəbul haqqında rəy"
          value={hiringOpinionFiles}
          onChange={setHiringOpinionFiles}
          existingAttachments={existingHiringAttachments.map((x) => ({
            id: x.attachmentId,
            fileName: x.fileName,
          }))}
          onRemoveExistingAttachment={(attachmentId) => {
            setExistingHiringAttachments((prev) => {
              const removed = prev.find((x) => x.attachmentId === attachmentId);
              if (removed) {
                setDeletedAttachments((items) =>
                  items.some((x) => x.rowId === removed.rowId) ? items : [...items, removed],
                );
              }
              return prev.filter((x) => x.attachmentId !== attachmentId);
            });
          }}
        />

        <FileDropzone
          id="probation-result-files"
          label="Sınaq müddətinin nəticəsi haqqında"
          value={probationResultFiles}
          onChange={setProbationResultFiles}
          existingAttachments={existingProbationAttachments.map((x) => ({
            id: x.attachmentId,
            fileName: x.fileName,
          }))}
          onRemoveExistingAttachment={(attachmentId) => {
            setExistingProbationAttachments((prev) => {
              const removed = prev.find((x) => x.attachmentId === attachmentId);
              if (removed) {
                setDeletedAttachments((items) =>
                  items.some((x) => x.rowId === removed.rowId) ? items : [...items, removed],
                );
              }
              return prev.filter((x) => x.attachmentId !== attachmentId);
            });
          }}
        />
      </div>
      <div className={styles.actions}>
        <Button
          type="button"
          variant="secondary"
          className={styles.addButton}
          onClick={() => void handleAdd()}
          disabled={isSubmitting}
        >
          Yadda saxla
        </Button>
      </div>
    </div>
  );
};
