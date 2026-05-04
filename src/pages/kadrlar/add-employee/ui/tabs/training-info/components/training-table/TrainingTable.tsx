import React, { useMemo } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { Table } from "@/shared/ui/table";
import { EmptyState, TableButton, TableRowActions } from "@/shared/ui";
import type { ColumnDef, Option } from "@/shared/types";
import type { TrainingsInfoListItem } from "@/features/kadrlar/create-worker/model/types";
import { PermissionGuard } from "@/features/auth/components/PermissionGuard";
import { PERMISSIONS } from "@/shared/consts/permissions";
import styles from "./TrainingTable.module.css";

export type TrainingTableItem = {
  id: string | number;
  telimNovu: Option | null;
  kursunAdi: string;
  baslamaTarixi: Date | null;
  bitmeTarixi: Date | null;
  sertifikatTarixi: Date | null;
  sertifikatNomresi: string;
  fileCount: number;
  raw?: TrainingsInfoListItem;
};

const formatDate = (date: Date | null): string => {
  if (!date) return "—";
  const d = date.getDate().toString().padStart(2, "0");
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const y = date.getFullYear();
  return `${d}.${m}.${y}`;
};

export interface TrainingTableProps {
  items: TrainingTableItem[];
  onRemove?: (id: string | number) => void;
  onEdit?: (item: TrainingTableItem) => void;
}

export const TrainingTable: React.FC<TrainingTableProps> = ({ items, onRemove, onEdit }) => {
  const columns = useMemo<ColumnDef<TrainingTableItem>[]>(
    () => [
      {
        header: "Təlim növü",
        accessor: "telimNovu",
        sortable: false,
        render: (item) => item.telimNovu?.fullName ?? "—",
      },
      { header: "Kursun adı", minWidth: "200px", maxWidth: "200px", accessor: "kursunAdi", sortable: false, render: (item) => item.kursunAdi || "—" },
      {
        header: "Başlama tarixi",
        accessor: "baslamaTarixi",
        sortable: false,
        render: (item) => formatDate(item.baslamaTarixi),
      },
      {
        header: "Bitmə tarixi",
        accessor: "bitmeTarixi",
        sortable: false,
        render: (item) => formatDate(item.bitmeTarixi),
      },
      {
        header: "Sertifikatın tarixi",
        accessor: "sertifikatTarixi",
        sortable: false,
        render: (item) => formatDate(item.sertifikatTarixi),
      },
      {
        header: "Sertifikatın nömrəsi",
        accessor: "sertifikatNomresi",
        sortable: false,
        render: (item) => item.sertifikatNomresi || "—",
      },
      ...(onRemove
        ? [
            {
              header: "",
              accessor: "actions" as keyof TrainingTableItem,
              sortable: false,
              render: (item: TrainingTableItem) => (
                <TableRowActions>
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
                </TableRowActions>
              ),
            },
          ]
        : []),
    ],
    [onRemove, onEdit]
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
