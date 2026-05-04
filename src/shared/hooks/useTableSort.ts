import { useState, useCallback } from "react";

export type SortDirection = "asc" | "desc";

interface UseTableSortOptions {
  initialColumn?: string | null;
  initialDirection?: SortDirection;
}

export const useTableSort = (options: UseTableSortOptions = {}) => {
  const [sortColumn, setSortColumn] = useState<string | null>(
    options.initialColumn ?? null,
  );
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    options.initialDirection ?? "desc",
  );

  const handleSort = useCallback((accessor: string, direction: SortDirection) => {
    setSortColumn(accessor);
    setSortDirection(direction);
  }, []);

  const clearSort = useCallback(() => {
    setSortColumn(null);
    setSortDirection("desc");
  }, []);

  const orderBy = sortColumn ?? undefined;
  const isDesc = sortColumn ? sortDirection === "desc" : undefined;

  return {
    sortColumn,
    sortDirection,
    handleSort,
    clearSort,
    orderBy,
    isDesc,
  };
};

