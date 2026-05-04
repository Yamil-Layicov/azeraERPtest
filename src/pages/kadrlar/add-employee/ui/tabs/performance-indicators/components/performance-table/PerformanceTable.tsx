import React, { useMemo } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { Table } from "@/shared/ui/table";
import { EmptyState, TableButton, TableRowActions } from "@/shared/ui";
import type { ColumnDef } from "@/shared/types";
import { PermissionGuard } from "@/features/auth/components/PermissionGuard";
import { PERMISSIONS } from "@/shared/consts/permissions";
import styles from "./PerformanceTable.module.css";

export type PerformanceTableItem = {
  id: string | number;
  il: Date | null;
  qiymet: string;
  illikBonusMeblegi: string;
  employeeId?: string | number;
};

const formatYear = (date: Date | null): string => {
  if (!date) return "—";
  return String(date.getFullYear());
};

export interface PerformanceTableProps {
  items: PerformanceTableItem[];
  onRemove?: (id: string | number) => void;
  onEdit?: (item: PerformanceTableItem) => void;
  canManageRow?: (item: PerformanceTableItem) => boolean;
}

export const PerformanceTable: React.FC<PerformanceTableProps> = ({ items, onRemove, onEdit, canManageRow }) => {
  const columns = useMemo<ColumnDef<PerformanceTableItem>[]>(
    () => [
      {
        header: "İl",
        accessor: "il",
        sortable: false,
        render: (item) => formatYear(item.il),
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
              render: (item: PerformanceTableItem) => {
                const canManage = canManageRow ? canManageRow(item) : true;
                return (
                  <TableRowActions>
                    {canManage && (
                      <>
                        <PermissionGuard permission={PERMISSIONS.EMPLOYEE.UPDATE}>
                          <TableButton variant="edit" onClick={() => onEdit?.(item)} title="Düzəliş et" />
                        </PermissionGuard>
                        <PermissionGuard permission={PERMISSIONS.EMPLOYEE.DELETE}>
                          <button
                            type="button"
                            className={styles.removeBtn}
                            onClick={() => onRemove(item.id)}
                            title="Sil"
                          >
                            <TrashIcon className={styles.icon} />
                          </button>
                        </PermissionGuard>
                      </>
                    )}
                  </TableRowActions>
                );
              },
            },
          ]
        : []),
    ],
    [onRemove, onEdit, canManageRow]
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
