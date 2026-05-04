import { useCallback, useState } from "react";
import type { EntryId } from "../types";

export const useDeleteConfirm = () => {
  const [entryId, setEntryId] = useState<EntryId | null>(null);

  const openDelete = useCallback((id: EntryId) => {
    setEntryId(id);
  }, []);

  const closeDelete = useCallback(() => {
    setEntryId(null);
  }, []);

  return {
    isDeleteOpen: entryId !== null,
    entryId,
    openDelete,
    closeDelete,
  };
};

