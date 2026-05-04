import { useCallback, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { createWorkerService } from "@/features/kadrlar/create-worker/api/createWorkerService";
import type { ContactEntryRequest } from "@/features/kadrlar/create-worker/model/types";
import type { NewContactState } from "@/pages/kadrlar/employee-shared/model/types";
import { isEmailContactType, isMobileContactType } from "@/pages/kadrlar/employee-shared/model/contacts-documents-schema";
import type { ContactEntry, EntryId } from "../types";
import { useDeleteConfirm } from "./useDeleteConfirm";
import { useEntryManager } from "./useEntryManager";

interface UseContactEntriesArgs {
  personId: string | null;
  onChanged: () => void;
}

const NEW_CONTACT: NewContactState = { type: null, value: "", isPrimary: false };

export const useContactEntries = ({ personId, onChanged }: UseContactEntriesArgs) => {
  const queryClient = useQueryClient();
  const manager = useEntryManager<ContactEntry, NewContactState>(NEW_CONTACT);
  const deleteConfirm = useDeleteConfirm();

  const invalidate = useCallback(() => {
    if (!personId) return;
    queryClient.invalidateQueries({ queryKey: ["contact-info", personId] });
  }, [personId, queryClient]);

  const addEntry = useCallback(async () => {
    if (!manager.draft.type || !manager.draft.value.trim()) {
      toast.error("Zəhmət olmasa Əlaqə növü və dəyərini qeyd edin");
      return;
    }

    // --- VALIDATION ---
    const contactValue = manager.draft.value.trim();

    if (isMobileContactType(manager.draft.type)) {
      if (!/^\d+$/.test(contactValue)) {
        toast.error("Mobil növü üçün yalnız rəqəm daxil edilməlidir");
        return;
      }
    } else if (isEmailContactType(manager.draft.type)) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(contactValue)) {
        toast.error("Düzgün E-poçt formatı daxil edin");
        return;
      }
    }

    if (!personId) {
      toast.error("İşçi ID tapılmadı");
      return;
    }

    const payload: ContactEntryRequest = {
      personId,
      type: String(manager.draft.type.id),
      value: manager.draft.value,
      isCorporate: !!manager.draft.isPrimary,
    };

    try {
      const response = await createWorkerService.addContactInfo(payload);
      if (!response?.isSuccess) {
        toast.error(response?.errorMessage || "Xəta baş verdi");
        return;
      }
      toast.success("Əlaqə məlumatı əlavə edildi");
      manager.resetDraft();
      onChanged();
      invalidate();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        // HTTP xətası üçün toast interceptor tərəfindən göstərilir.
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
      const response = await createWorkerService.removeContactInfo(deleteConfirm.entryId);
      if (!response?.isSuccess) {
        toast.error(response?.errorMessage || "SilinÉ™rkÉ™n xÉ™ta baÅŸ verdi");
        return;
      }
      toast.success("Əlaqə məlumatı silindi");
      onChanged();
      invalidate();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        // HTTP xətası üçün toast interceptor tərəfindən göstərilir.
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



