import  {
  useState,
  useEffect,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { TrainingForm } from "./components/training-form";
import { formatDateToYMD } from "@/shared/lib/utils";
import axios from "axios";
import type { TrainingFormValue } from "./components/training-form";
import { TrainingTable, type TrainingTableItem } from "./components/training-table";
import styles from "./TrainingInfoTab.module.css";
import { ConfirmModal } from "@/shared/ui";
import { createWorkerService } from "@/features/kadrlar/create-worker/api/createWorkerService";
import { useAddEmployeeStore } from "@/features/kadrlar/create-worker/model/useAddEmployeeStore";
import type {
  TrainingsInfoListItem,
  TrainingEntryRequest,
} from "@/features/kadrlar/create-worker/model/types";
import type { EnumLookupItem } from "@/features/lookups/model/types";
import { z } from "zod";
type ExistingTrainingAttachment = { id: string; fileName: string };

const initialFormValue: TrainingFormValue = {
  telimNovu: null,
  kursunAdi: "",
  baslamaTarixi: null,
  bitmeTarixi: null,
  sertifikatTarixi: null,
  sertifikatNomresi: "",
  uploadedFiles: [],
};

const trainingFormSchema = z.object({
  telimNovu: z
    .custom<TrainingFormValue["telimNovu"]>()
    .nullable()
    .refine((val) => !!val?.id, "Təlim növü vacibdir"),
  kursunAdi: z.string().trim().min(1, "Kursun adı vacibdir"),
  baslamaTarixi: z.date().nullable().refine((val) => !!val, "Başlama tarixi vacibdir"),
  bitmeTarixi: z.date().nullable(),
  sertifikatTarixi: z.date().nullable(),
  sertifikatNomresi: z.string(),
  uploadedFiles: z.array(z.instanceof(File)),
}); 

export interface TrainingInfoTabHandle {
  submit: () => void;
  isDirty: () => boolean;
}

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

/** GET may return flat ids or nested attachment rows. */
const extractTrainingAttachments = (row: TrainingsInfoListItem): ExistingTrainingAttachment[] => {
  const legacy = row.attachments;
  if (Array.isArray(legacy) && legacy.length > 0) {
    return legacy
      .map(String)
      .filter((id) => id.length > 0)
      .map((id) => ({ id, fileName: id }));
  }
  const nested = row.trainingAttachments;
  if (!Array.isArray(nested) || nested.length === 0) {
    return [];
  }
  return nested
    .map((x) => {
      const id = x?.attachment?.id;
      if (typeof id !== "string" || id.length === 0) return null;
      return {
        id,
        fileName: x?.attachment?.fileName || id,
      };
    })
    .filter((item): item is ExistingTrainingAttachment => item !== null);
};

const mapApiRowToTableItem = (
  row: TrainingsInfoListItem,
  lookups: EnumLookupItem[],
): TrainingTableItem => {
  const code = String(row.trainingTypeCode ?? "").trim();
  const typeObj = lookups.find((e) => matchLookupCode(code, e));
  const label =
    typeObj?.label ??
    typeObj?.displayName ??
    typeObj?.fullName ??
    code;

  return {
    id: row.id,
    telimNovu: { id: row.trainingTypeCode, fullName: label },
    kursunAdi: row.courseName ?? "",
    baslamaTarixi: row.startDate ? new Date(row.startDate) : null,
    bitmeTarixi: row.endDate ? new Date(row.endDate) : null,
    sertifikatTarixi: row.certificateDate ? new Date(row.certificateDate) : null,
    sertifikatNomresi: row.certificateNumber ?? "",
    fileCount: extractTrainingAttachments(row).length,
    raw: row,
  };
};

export const TrainingInfoTab = forwardRef<TrainingInfoTabHandle>((_, ref) => {
  const { personId, currentStep, nextStep, setStepCompleted } = useAddEmployeeStore();
  const [localItems, setLocalItems] = useState<TrainingTableItem[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [trainingIdToDelete, setTrainingIdToDelete] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingAttachments, setEditingAttachments] = useState<ExistingTrainingAttachment[]>([]);
  const form = useForm<TrainingFormValue>({
    resolver: zodResolver(trainingFormSchema),
    defaultValues: initialFormValue,
    mode: "onTouched",
  });
  const {
    watch,
    setValue,
    reset,
    trigger,
    formState: { errors },
  } = form;
  const formValue = watch();

  useEffect(() => {
    reset(initialFormValue);
    setLocalItems([]);
    setIsDeleteModalOpen(false);
    setTrainingIdToDelete(null);
    setEditingId(null);
    setEditingAttachments([]);
  }, [personId, reset]);

  const { data: trainingTypesData } = useQuery({
    queryKey: ["trainingTypesLookup"],
    queryFn: () => createWorkerService.getTrainingTypes(),
    staleTime: 1000 * 60 * 60,
  });

  const { data: trainingsData, refetch, isFetching } = useQuery({
    queryKey: ["trainingsInfo", personId],
    queryFn: () => createWorkerService.getTrainingsInfoByPersonId(personId!),
    enabled: false,
  });

  useEffect(() => {
    if (currentStep !== 7 || !personId) return;
    void refetch();
  }, [currentStep, personId, refetch]);

  const lookups: EnumLookupItem[] =
    (trainingTypesData as { result?: EnumLookupItem[]; data?: EnumLookupItem[] } | undefined)?.result ??
    (trainingTypesData as { result?: EnumLookupItem[]; data?: EnumLookupItem[] } | undefined)?.data ??
    [];

  const serverItems = useMemo(() => {
    if (!trainingsData?.isSuccess || !Array.isArray(trainingsData.result)) return [];
    return trainingsData.result.map((row) => mapApiRowToTableItem(row, lookups));
  }, [trainingsData, lookups]);

  const items = useMemo(() => [...serverItems, ...localItems], [serverItems, localItems]);

  const handleClear = () => {
    setEditingId(null);
    setEditingAttachments([]);
    reset(initialFormValue);
  };



  const handleAdd = async () => {
    if (!personId) {
      toast.error("İşçi ID tapılmadı");
      return;
    }
    const isValid = await trigger(["telimNovu", "kursunAdi", "baslamaTarixi"]);
    if (!isValid) return;
    const selectedTrainingType = formValue.telimNovu;
    if (!selectedTrainingType?.id) return;
    try {
      let attachmentIds: string[] = [];
      if (formValue.uploadedFiles.length > 0) {
        const uploadResponse = await createWorkerService.uploadFiles(formValue.uploadedFiles, "Certificate");
        if (!uploadResponse.isSuccess) {
          toast.error(uploadResponse.errorMessage || "Fayllar yüklənmədi");
          return;
        }
        attachmentIds = (uploadResponse.result || [])
          .map((file) => file.attachId)
          .filter((id): id is string => typeof id === "string" && id.length > 0);
      }

      const payload: TrainingEntryRequest = {
        personId,
        id: editingId,
        isModify: !!editingId,
        trainingTypeCode: String(selectedTrainingType.id),
        courseName: formValue.kursunAdi.trim(),
        startDate: formatDateToYMD(formValue.baslamaTarixi),
        endDate: formatDateToYMD(formValue.bitmeTarixi),
        certificateDate: formatDateToYMD(formValue.sertifikatTarixi),
        certificateNumber: formValue.sertifikatNomresi.trim() || null,
        attachments: Array.from(
          new Set([...editingAttachments.map((item) => item.id), ...attachmentIds]),
        ),
      };

      const response = await createWorkerService.addOrEditTrainingInfo(payload);
      if (!response.isSuccess) {
        toast.error(response.errorMessage || "Məlumat əlavə edilərkən xəta baş verdi");
        return;
      }

      toast.success(editingId ? "Məlumat yeniləndi" : "Məlumat əlavə edildi");
      handleClear();
      await refetch();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        // HTTP xətası üçün toast interceptor tərəfindən göstərilir.
        return;
      } else {
        toast.error("Məlumat əlavə edilərkən xəta baş verdi");
      }
    }
  };

  const handleRemove = (id: string | number) => {
    const idStr = String(id).trim();
    if (idStr.startsWith("local-")) {
      setLocalItems((prev) => prev.filter((row) => String(row.id) !== idStr));
      return;
    }
    if (!idStr) {
      toast.error("Sətirin ID-si tapılmadı");
      return;
    }
    setTrainingIdToDelete(idStr);
    setIsDeleteModalOpen(true);
  };

  const handleEdit = (item: TrainingTableItem) => {
    const raw = item.raw;
    const id = String(item.id);
    setEditingId(id);
    setEditingAttachments(raw ? extractTrainingAttachments(raw) : []);
    reset({
      telimNovu: item.telimNovu,
      kursunAdi: item.kursunAdi,
      baslamaTarixi: item.baslamaTarixi,
      bitmeTarixi: item.bitmeTarixi,
      sertifikatTarixi: item.sertifikatTarixi,
      sertifikatNomresi: item.sertifikatNomresi,
      uploadedFiles: [],
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const confirmRemoveTraining = async () => {
    if (!trainingIdToDelete) return;
    try {
      const response = await createWorkerService.removeTrainingInfo(trainingIdToDelete);
      if (response.isSuccess) {
        toast.success("Məlumat silindi");
        await refetch();
      } else {
        if (response.errorMessage) {
          toast.error(response.errorMessage);
        }
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
      setTrainingIdToDelete(null);
    }
  };

  useImperativeHandle(ref, () => ({
    submit: () => {
      setStepCompleted(7);
      nextStep();
    },
    isDirty: () => false,
  }));

  return (
    <div className={styles.container}>
      {isFetching && <p className={styles.savingText}>Yüklənir...</p>}
      <TrainingForm
        value={formValue}
        onChange={(next) => {
          (Object.keys(next) as (keyof TrainingFormValue)[]).forEach((key) => {
            setValue(key, next[key], { shouldDirty: true, shouldTouch: true });
          });
        }}
        errors={{
          telimNovu: errors.telimNovu?.message,
          kursunAdi: errors.kursunAdi?.message,
          baslamaTarixi: errors.baslamaTarixi?.message,
        }}
        onAdd={handleAdd}
        addButtonLabel={editingId ? "Yenilə" : "Əlavə et"}
        isEditMode={!!editingId}
        existingAttachments={editingAttachments}
        onRemoveExistingAttachment={(attachmentId) => {
          setEditingAttachments((prev) => prev.filter((item) => item.id !== attachmentId));
        }}
        onClear={handleClear}
      />
      <TrainingTable items={items} onRemove={handleRemove} onEdit={handleEdit} />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setTrainingIdToDelete(null);
        }}
        onConfirm={confirmRemoveTraining}
        title="Təlim məlumatını silmək istədiyinizə əminsiniz?"
        description="Bu məlumatı sildikdə geri qaytara bilməyəcəksiniz."
        confirmText="Sil"
        cancelText="Ləğv et"
        variant="danger"
      />
    </div>
  );
});

TrainingInfoTab.displayName = "TrainingInfoTab";
