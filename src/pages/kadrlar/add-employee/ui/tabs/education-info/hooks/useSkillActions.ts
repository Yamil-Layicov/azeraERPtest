import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { educationService } from "@/features/kadrlar/create-worker/api/educationService";
import { useAddEmployeeStore } from "@/features/kadrlar/create-worker/model/useAddEmployeeStore";
import type { SkillEntryRequest } from "@/features/kadrlar/create-worker/model/types";
import type { NewSkillState, SkillItem } from "../components/skills";

interface ExtendedSkillItem extends SkillItem {
  isDeleted?: boolean;
  category?: string;
}

interface UseSkillActionsProps {
  newLanguage: NewSkillState;
  newTechnical: NewSkillState;
  setNewLanguage: (val: NewSkillState) => void;
  setNewTechnical: (val: NewSkillState) => void;
  setAddedLanguages: React.Dispatch<React.SetStateAction<ExtendedSkillItem[]>>;
  setAddedTechnical: React.Dispatch<React.SetStateAction<ExtendedSkillItem[]>>;
  setHasChanges: (val: boolean) => void;
}

export function useSkillActions({
  newLanguage,
  newTechnical,
  setNewLanguage,
  setNewTechnical,
  setAddedLanguages,
  setAddedTechnical,
  setHasChanges,
}: UseSkillActionsProps) {
  const queryClient = useQueryClient();

  const handleAddSkill = useCallback(async (
    category: "LanguageSkill" | "ProgramSkill"
  ) => {
    const targetState = category === "LanguageSkill" ? newLanguage : newTechnical;

    if (!targetState.skill || !targetState.level) {
      toast.error("Zəhmət olmasa bilik və səviyyəni qeyd edin");
      return;
    }

    const { personId } = useAddEmployeeStore.getState();
    if (!personId) return;

    const payload: SkillEntryRequest = {
      personId,
      skillCategoryCode: category,
      skillCode: targetState.skill.id as string,
      proficiencyLevelCode: targetState.level,
    };

    try {
      const response = await educationService.addSkillInfo(payload);
      if (response.isSuccess) {
        toast.success(
          category === "LanguageSkill"
            ? "Dil biliyi əlavə edildi"
            : "Texniki bilik əlavə edildi"
        );
        queryClient.invalidateQueries({ queryKey: ["personnel", "education", personId] });
        if (category === "LanguageSkill") {
          setNewLanguage({ skill: null, level: "" });
        } else {
          setNewTechnical({ skill: null, level: "" });
        }
        setHasChanges(true);
      } else {
        toast.error(response.errorMessage || "Bilik əlavə edilərkən xəta baş verdi");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) return;
      toast.error("Əməliyyat zamanı xəta baş verdi");
    }
  }, [newLanguage, newTechnical, queryClient, setNewLanguage, setNewTechnical, setHasChanges]);

  const handleRemoveSkill = useCallback((id: string | number) => {
    const idStr = String(id).trim();

    if (idStr.startsWith("local-")) {
      setAddedLanguages((prev) => prev.filter((x) => String(x.id) !== idStr));
      setAddedTechnical((prev) => prev.filter((x) => String(x.id) !== idStr));
      return;
    }

    if (!idStr) {
      toast.error("Sətirin ID-si tapılmadı");
      return;
    }

    return idStr; // modal.open() için id'yi döndür
  }, [setAddedLanguages, setAddedTechnical]);

  const confirmRemoveSkill = useCallback(async (
    idToDelete: string | null,
    onClose: () => void,
  ) => {
    if (!idToDelete) {
      toast.error("Silmək üçün ID seçilməyib");
      return;
    }
    const { personId } = useAddEmployeeStore.getState();

    try {
      const response = await educationService.removeSkillInfo(idToDelete);
      if (response.isSuccess) {
        toast.success("Bilik silindi");
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

  return { handleAddSkill, handleRemoveSkill, confirmRemoveSkill };
}