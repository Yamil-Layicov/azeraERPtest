import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { educationService } from "@/features/kadrlar/create-worker/api/educationService";
import { useAddEmployeeStore } from "@/features/kadrlar/create-worker/model/useAddEmployeeStore";
import type { EducationEntryRequest } from "@/features/kadrlar/create-worker/model/types";
import type { EducationInfoValue } from "../components/education-info";

interface UseEducationActionsProps {
  formData: EducationInfoValue;
  editingEduId: string | number | null;
  resetForm: () => void;
  setErrors: (errors: Record<string, string>) => void;
  setHasChanges: (val: boolean) => void;
}

export function useEducationActions({
  formData,
  editingEduId,
  resetForm,
  setErrors,
  setHasChanges,
}: UseEducationActionsProps) {
  const queryClient = useQueryClient();

  const handleAddOrUpdateEducation = useCallback(async () => {
    if (
      !formData.educationLevel ||
      !formData.institution ||
      !formData.specialty ||
      !formData.entryDate
    ) {
      setErrors({
        educationLevel: !formData.educationLevel ? "Təhsil pilləsi vacibdir." : "",
        institution: !formData.institution ? "Müəssisə vacibdir" : "",
        specialty: !formData.specialty ? "İxtisas vacibdir" : "",
        entryDate: !formData.entryDate ? "Daxil olma tarixi vacibdir" : "",
      });
      return;
    }

    const { personId } = useAddEmployeeStore.getState();
    if (!personId) {
      toast.error("İşçi ID tapılmadı");
      return;
    }

    const isEditMode = editingEduId !== null;
    const payload: EducationEntryRequest = {
      personId,
      id: isEditMode && typeof editingEduId === "string" ? editingEduId : null,
      isModify: isEditMode,
      educationLevelCode: (formData.educationLevel?.id as string) || "",
      institutionNameCode: (formData.institution?.id as string) || "",
      specialtyCode: (formData.specialty?.id as string) || "",
      startYear: formData.entryDate ? formData.entryDate.getFullYear() : 0,
      endYear: formData.graduationDate ? formData.graduationDate.getFullYear() : null,
      documentNumber: formData.diplomaSerialNumber.trim() || null,
    };

    try {
      const response = await educationService.addOrEditEducationInfo(payload);
      if (response.isSuccess) {
        toast.success(isEditMode ? "Məlumat yeniləndi" : "Məlumat əlavə edildi");
        queryClient.invalidateQueries({ queryKey: ["personnel", "education", personId] });
        resetForm();
        setHasChanges(true);
      } else {
        toast.error(response.errorMessage || "Yadda saxlanarkən xəta baş verdi");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) return;
      toast.error("Əməliyyat zamanı xəta baş verdi");
    }
  }, [formData, editingEduId, queryClient, resetForm, setErrors, setHasChanges]);

  const confirmRemoveEducation = useCallback(async (
    idToDelete: string | number | null,
    onClose: () => void,
  ) => {
    if (!idToDelete) return;
    const { personId } = useAddEmployeeStore.getState();

    try {
      const response = await educationService.removeEducationInfo(String(idToDelete));
      if (response.isSuccess) {
        toast.success("Məlumat silindi");
        queryClient.invalidateQueries({ queryKey: ["personnel", "education", personId] });
      } else {
        toast.error(response.errorMessage || "Silinərkən xəta baş verdi");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) return;
      toast.error("Əməliyyat zamanı xəta baş verdi");
    } finally {
      onClose();
    }
  }, [queryClient]);

  return { handleAddOrUpdateEducation, confirmRemoveEducation };
}