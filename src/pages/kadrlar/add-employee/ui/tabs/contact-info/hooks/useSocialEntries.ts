import { useCallback, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { createWorkerService } from "@/features/kadrlar/create-worker/api/createWorkerService";
import type { NewSocialMediaState } from "@/pages/kadrlar/employee-shared/model/types";
import type { EntryId, SocialEntry } from "../types";
import { useDeleteConfirm } from "./useDeleteConfirm";
import { useEntryManager } from "./useEntryManager";

interface UseSocialEntriesArgs {
  personId: string | null;
  onChanged: () => void;
}

const NEW_SOCIAL: NewSocialMediaState = { type: null, value: "" };

export const useSocialEntries = ({ personId, onChanged }: UseSocialEntriesArgs) => {
  const queryClient = useQueryClient();
  const manager = useEntryManager<SocialEntry, NewSocialMediaState>(NEW_SOCIAL);
  const deleteConfirm = useDeleteConfirm();

  const invalidate = useCallback(() => {
    if (!personId) return;
    queryClient.invalidateQueries({ queryKey: ["contact-info", personId] });
  }, [personId, queryClient]);

  const addEntry = useCallback(async () => {
    if (!manager.draft.type || !manager.draft.value.trim()) {
      toast.error("Zəhmət olmasa sosial media növü və dəyərini qeyd edin");
      return;
    }
    if (!personId) {
      toast.error("İşçi ID tapılmadı");
      return;
    }

    try {
      const response = await createWorkerService.addSocialAccountInfo({
        personId,
        type: String(manager.draft.type.id),
        value: manager.draft.value,
      });
      if (!response?.isSuccess) {
        toast.error(response?.errorMessage || "Xəta baş verdi");
        return;
      }
      toast.success("Sosial media hesabı əlavə edildi");
      manager.resetDraft();
      onChanged();
      invalidate();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return;
      }
      toast.error("Bağlantı xətası");
    }
  }, [invalidate, manager, onChanged, personId]);

  const askRemoveEntry = useCallback((id: EntryId) => {
    deleteConfirm.openDelete(id);
  }, [deleteConfirm]);

  const confirmRemoveEntry = useCallback(async () => {
    if (!deleteConfirm.entryId) return;
    try {
      const response = await createWorkerService.removeSocialAccountInfo(deleteConfirm.entryId);
      if (!response?.isSuccess) {
        toast.error(response?.errorMessage || "Silinərkən xəta baş verdi");
        return;
      }
      toast.success("Sosial media hesabı silindi");
      onChanged();
      invalidate();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return;
      }
      toast.error("Bağlantı xətası");
    } finally {
      deleteConfirm.closeDelete();
    }
  }, [deleteConfirm, invalidate, onChanged]);

  const isAddDisabled = useMemo(
    () => !manager.draft.type || !manager.draft.value.trim(),
    [manager.draft],
  );

  return {
    entries: manager.entries,
    replaceEntries: manager.replaceEntries,
    newEntry: manager.draft,
    setNewEntry: manager.setDraft,
    resetNewEntry: manager.resetDraft,
    updateEntry: manager.updateEntry,
    addEntry,
    askRemoveEntry,
    confirmRemoveEntry,
    deleteConfirm,
    isAddDisabled,
  };
};



