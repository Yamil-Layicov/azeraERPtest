import React, { useMemo } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { Table } from "@/shared/ui/table";
import { EmptyState, TableButton, TableRowActions } from "@/shared/ui";
import type { ColumnDef, Option } from "@/shared/types";
import styles from "./TrainingTable.module.css";

export type TrainingTableItem = {
  id: number;
  telimNovu: Option | null;
  kursunAdi: string;
  baslamaTarixi: Date | null;
  bitmeTarixi: Date | null;
  sertifikatTarixi: Date | null;
  sertifikatNomresi: string;
  fileCount: number;
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
  onRemove?: (id: number) => void;
}

export const TrainingTable: React.FC<TrainingTableProps> = ({ items, onRemove }) => {
  const columns = useMemo<ColumnDef<TrainingTableItem>[]>(
    () => [
      {
        header: "Təlim növü",
        accessor: "telimNovu",
        sortable: false,
        render: (item) => item.telimNovu?.fullName ?? "—",
      },
      { header: "Kursun adı",accessor: "kursunAdi", sortable: false, render: (item) => item.kursunAdi || "—" },
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
      {
        header: "Fayllar",
        accessor: "fileCount",
        sortable: false,
        render: (item) => (item.fileCount > 0 ? `${item.fileCount} fayl` : "—"),
      },
      ...(onRemove
        ? [
            {
              header: "",
              accessor: "actions" as keyof TrainingTableItem,
              sortable: false,
              render: (item: TrainingTableItem) => (
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
