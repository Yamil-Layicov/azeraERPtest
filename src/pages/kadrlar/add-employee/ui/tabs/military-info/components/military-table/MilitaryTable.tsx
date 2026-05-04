import React, { useMemo } from "react";
import { Table } from "@/shared/ui/table";
import { EmptyState, TableButton, TableRowActions } from "@/shared/ui";
import { PermissionGuard } from "@/features/auth/components/PermissionGuard";
import { PERMISSIONS } from "@/shared/consts/permissions";
import type { ColumnDef } from "@/shared/types";
import styles from "./MilitaryTable.module.css";

export type MilitaryTableItem = {
  id: string;
  militaryBookNumber: string;
  issueDate: Date | null;
  militaryRankCode: string | null;
  militaryStatusCode: string | null;
  militaryRank: string;
  militaryStatus: string;
};

export interface MilitaryTableProps {
  items: MilitaryTableItem[];
  onEdit?: (item: MilitaryTableItem) => void;
  onRemove?: (id: string) => void;
}

const formatDate = (date: Date | null): string => {
  if (!date) return "—";
  const d = date.getDate().toString().padStart(2, "0");
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const y = date.getFullYear();
  return `${d}.${m}.${y}`;
};

export const MilitaryTable: React.FC<MilitaryTableProps> = ({ items, onEdit, onRemove }) => {
  const columns = useMemo<ColumnDef<MilitaryTableItem>[]>(
    () => [
      {
        header: "Hərbi biletin seriyası və nömrəsi",
        accessor: "militaryBookNumber",
        sortable: false,
        render: (item) => item.militaryBookNumber || "—",
      },
      {
        header: "Verilmə tarixi",
        accessor: "issueDate",
        sortable: false,
        render: (item) => formatDate(item.issueDate),
      },
      {
        header: "Hərbi rütbəsi",
        accessor: "militaryRank",
        sortable: false,
        render: (item) => item.militaryRank || "—",
      },
      {
        header: "Hərbi xidməti barədə məlumat",
        accessor: "militaryStatus",
        sortable: false,
        render: (item) => item.militaryStatus || "—",
      },
      {
        header: "",
        accessor: "actions" as keyof MilitaryTableItem,
        sortable: false,
        render: (item) => (
          <TableRowActions>
            <PermissionGuard permission={PERMISSIONS.EMPLOYEE.UPDATE}>
              <TableButton variant="edit" onClick={() => onEdit?.(item)} title="Düzəliş et" />
            </PermissionGuard>
            <PermissionGuard permission={PERMISSIONS.EMPLOYEE.DELETE}>
              <TableButton variant="delete" onClick={() => onRemove?.(item.id)} title="Sil" />
            </PermissionGuard>
          </TableRowActions>
        ),
      },
    ],
    [onEdit, onRemove],
  );

  return (
    <div className={styles.wrapper}>
      {items.length === 0 ? (
        <EmptyState />
      ) : (
        <div className={styles.tableScroll}>
          <Table data={items} columns={columns} />
        </div>
      )}
    </div>
  );
};
