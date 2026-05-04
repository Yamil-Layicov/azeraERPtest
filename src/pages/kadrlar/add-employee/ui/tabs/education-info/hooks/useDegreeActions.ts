import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { educationService } from "@/features/kadrlar/create-worker/api/educationService";
import { useAddEmployeeStore } from "@/features/kadrlar/create-worker/model/useAddEmployeeStore";
import type { AcademicDegreeEntryRequest } from "@/features/kadrlar/create-worker/model/types";
import type { NewScientificDegreeState } from "../components/scientific-degree";

interface UseDegreeActionsProps {
  newDegree: NewScientificDegreeState;
  setNewDegree: (val: NewScientificDegreeState) => void;
  setHasChanges: (val: boolean) => void;
}

export function useDegreeActions({
  newDegree,
  setNewDegree,
  setHasChanges,
}: UseDegreeActionsProps) {
  const queryClient = useQueryClient();

  const handleAddScientificDegree = useCallback(async () => {
    if (!newDegree.degree || !newDegree.diplomaSerialNumber.trim()) {
      toast.error("Zəhmət olmasa dərəcə və diplom nömrəsini qeyd edin");
      return;
    }

    const { personId } = useAddEmployeeStore.getState();
    if (!personId) return;

    const formatDate = (date: Date | null) => {
      if (!date) return null;
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    };

    const payload: AcademicDegreeEntryRequest = {
      personId,
      degreeCode: newDegree.degree.id as string,
      issueDate: formatDate(newDegree.awardedDate),
      diplomaNumber: newDegree.diplomaSerialNumber,
    };

    try {
      const response = await educationService.addAcademicDegreeInfo(payload);
      if (response.isSuccess) {
        toast.success("Elmi dərəcə əlavə edildi");
        queryClient.invalidateQueries({ queryKey: ["personnel", "education", personId] });
        setNewDegree({ degree: null, awardedDate: null, diplomaSerialNumber: "" });
        setHasChanges(true);
      } else {
        toast.error(response.errorMessage || "Elmi dərəcə əlavə edilərkən xəta baş verdi");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) return;
      toast.error("Əməliyyat zamanı xəta baş verdi");
    }
  }, [newDegree, queryClient, setNewDegree, setHasChanges]);

  const confirmRemoveScientificDegree = useCallback(async (
    idToDelete: string | number | null,
    onClose: () => void,
  ) => {
    if (!idToDelete) return;
    const { personId } = useAddEmployeeStore.getState();

    try {
      const response = await educationService.removeAcademicDegreeInfo(String(idToDelete));
      if (response.isSuccess) {
        toast.success("Elmi dərəcə silindi");
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

  return { handleAddScientificDegree, confirmRemoveScientificDegree };
}