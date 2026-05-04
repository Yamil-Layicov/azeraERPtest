import type { Option } from "@/shared/types";

type EditableEntry = {
  type: Option | null;
  value: string;
};

type UpdateEntryFn<TEntry extends EditableEntry> = (
  id: string,
  updater: (prev: TEntry) => TEntry,
) => void;

export const createListChangeHandler = <TEntry extends EditableEntry>(
  updateEntry: UpdateEntryFn<TEntry>,
  onChanged: () => void,
) => {
  return (id: string | number, field: "type" | "value", val: Option | null | string) => {
    updateEntry(String(id), (prev) => {
      if (field === "type") {
        return { ...prev, type: val as Option | null };
      }

      return { ...prev, value: String(val ?? "") };
    });

    onChanged();
  };
};

