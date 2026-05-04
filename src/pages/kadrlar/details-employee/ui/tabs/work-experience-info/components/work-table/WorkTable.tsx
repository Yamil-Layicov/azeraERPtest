import React, { useMemo } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { Table } from "@/shared/ui/table";
import { TableButton, TableRowActions, EmptyState } from "@/shared/ui";
import type { ColumnDef } from "@/shared/types";
import styles from "./WorkTable.module.css";

export type WorkTableItem = {
  id: number;
  workplace: string;
  position: string;
  appointmentDate: Date | null;
  appointmentOrderNumber: string;
  releaseDate: Date | null;
  releaseOrderNumber: string;
  releaseReason: string;
  experienceType: string;
  legalBasisOrTransfer: string;
};

const formatDate = (date: Date | null): string => {
  if (!date) return "—";
  const d = date.getDate().toString().padStart(2, "0");
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const y = date.getFullYear();
  return `${d}.${m}.${y}`;
};

export interface WorkTableProps {
  data: WorkTableItem[];
  onRemove?: (id: number) => void;
  className?: string;
}

export const WorkTable: React.FC<WorkTableProps> = ({ data, onRemove, className }) => {
  const columns = useMemo<ColumnDef<WorkTableItem>[]>(
    () => [
      { header: "Staj növüu]", accessor: "experienceType", sortable: false },
      { header: "İş yeri", accessor: "workplace", sortable: false },
      { header: "Vəzifəsi", accessor: "position", sortable: false },
      {
        header: "Təyinat", 
        accessor: "appointmentDate",
        sortable: false,
        render: (item) => formatDate(item.appointmentDate),
      },
      { header: "Əmr №", accessor: "appointmentOrderNumber", sortable: false },
      {
        header: "Azad olma",
        accessor: "releaseDate",
        sortable: false,
        render: (item) => formatDate(item.releaseDate),
      },
      { header: "Azad №", accessor: "releaseOrderNumber", sortable: false, width: "85px" },
      { header: "Səbəb", accessor: "releaseReason", sortable: false, width: "200px" },
      {
        header: "İşdən azad olmanın hüquqi əsası və ya yerdəyişmə",
        accessor: "legalBasisOrTransfer",
        sortable: false,
        width: "220px",
      },
      {
        header: "",
        accessor: "actions",
        sortable: false,
        render: (item) => (
          <TableRowActions>
            <TableButton variant="edit" onClick={() => { /* TODO: edit */ }} title="Düzəliş et" />
            
            {onRemove && (
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => onRemove(item.id)}
                title="Sil"
              >
                <TrashIcon className={styles.icon} />
              </button>
            )}
            <button type="button" className={styles.azadEtBtn} onClick={() => { /* TODO: azad et */ }} title="Azad et">
              Azad et
            </button>
          </TableRowActions>
        ),
      },
    ],
    [onRemove]
  );

  return (
    <div className={`${styles.wrapper} ${className || ""}`}>
      {data.length === 0 ? (
        <EmptyState />
      ) : (
        <div className={styles.tableScroll}>
             <Table data={data} columns={columns} />
        </div>
      )}
    </div>
  );
};