import { useCallback, useState } from "react";
import type { EntryId } from "../types";

interface WithId {
  id: EntryId;
}

export const useEntryManager = <TEntry extends WithId, TNew>(initialNew: TNew) => {
  const [entries, setEntries] = useState<TEntry[]>([]);
  const [draft, setDraft] = useState<TNew>(initialNew);

  const areEntriesEqual = (a: TEntry[], b: TEntry[]) => {
    if (a === b) return true;
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i += 1) {
      const left = a[i];
      const right = b[i];
      if (!left || !right) return false;
      if (left.id !== right.id) return false;
      if (JSON.stringify(left) !== JSON.stringify(right)) return false;
    }
    return true;
  };

  const replaceEntries = useCallback((next: TEntry[]) => {
    setEntries((prev) => (areEntriesEqual(prev, next) ? prev : next));
  }, []);

  const resetDraft = useCallback(() => {
    setDraft(initialNew);
  }, [initialNew]);

  const updateEntry = useCallback((id: EntryId, updater: (prev: TEntry) => TEntry) => {
    setEntries((prev) => prev.map((entry) => (entry.id === id ? updater(entry) : entry)));
  }, []);

  return {
    entries,
    setEntries,
    replaceEntries,
    draft,
    setDraft,
    resetDraft,
    updateEntry,
  };
};

