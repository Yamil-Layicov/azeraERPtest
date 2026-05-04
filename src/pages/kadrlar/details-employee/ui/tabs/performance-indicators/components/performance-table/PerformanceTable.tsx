import React, { useMemo } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { Table } from "@/shared/ui/table";
import { EmptyState, TableButton, TableRowActions } from "@/shared/ui";
import type { ColumnDef } from "@/shared/types";
import styles from "./PerformanceTable.module.css";

export type PerformanceTableItem = {
  id: number;
  il: Date | null;
  qiymet: string;
  illikBonusMeblegi: string;
};

const formatDate = (date: Date | null): string => {
  if (!date) return "—";
  const d = date.getDate().toString().padStart(2, "0");
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const y = date.getFullYear();
  return `${d}.${m}.${y}`;
};

export interface PerformanceTableProps {
  items: PerformanceTableItem[];
  onRemove?: (id: number) => void;
}

export const PerformanceTable: React.FC<PerformanceTableProps> = ({ items, onRemove }) => {
  const columns = useMemo<ColumnDef<PerformanceTableItem>[]>(
    () => [
      {
        header: "İl",
        accessor: "il",
        sortable: false,
        render: (item) => formatDate(item.il),
      },
      {
        header: "Qiymət",
        accessor: "qiymet",
        sortable: false,
        render: (item) => item.qiymet || "—",
      },
      {
        header: "İllik bonus məbləği",
        accessor: "illikBonusMeblegi",
        sortable: false,
        render: (item) => item.illikBonusMeblegi || "—",
      },
      ...(onRemove
        ? [
            {
              header: "",
              accessor: "actions" as keyof PerformanceTableItem,
              sortable: false,
              render: (item: PerformanceTableItem) => (
                <TableRowActions>
                  <TableButton variant="edit" onClick={() => {}} title="Düzəliş et" />
                  <button
                    type="button"
                    className={styles.removeBtn}
                    onClick={() => onRemove(item.id)}
                    title="Sil"
                  >
                    <TrashIcon className={styles.icon} />
                  </button>
                </TableRowActions>
              ),
            },
          ]
        : []),
    ],
    [onRemove]
  );

  return (
    <div className={styles.wrapper}>
      {items.length === 0 ? (
        <EmptyState />
      ) : (
        <Table data={items} columns={columns} />
      )}
    </div>
  );
};
