import React, { useMemo } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { Table } from "@/shared/ui/table";
import { TableButton, TableRowActions, EmptyState } from "@/shared/ui";
import { PermissionGuard } from "@/features/auth/components/PermissionGuard";
import { PERMISSIONS } from "@/shared/consts/permissions";
import type { ColumnDef } from "@/shared/types";
import type { WorkExperienceInfoListItem } from "@/features/kadrlar/create-worker/model/types";
import styles from "./WorkTable.module.css";

export type WorkTableItem = {
  id: string | number;
  workplace: string;
  position: string;
  appointmentDate: Date | null;
  appointmentOrderNumber: string;
  releaseDate: Date | null;
  releaseOrderNumber: string;
  releaseReason: string;
  experienceType: string;
  legalBasisOrTransfer: string;
  status?: string | null;
  statusValue?: string | null;
  raw?: WorkExperienceInfoListItem;
  isTerminated?: boolean;
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
  onRemove?: (id: string | number) => void;
  onEdit?: (item: WorkTableItem, action: "edit" | "terminate") => void;
  className?: string;
}

export const WorkTable: React.FC<WorkTableProps> = ({
  data,
  onRemove,
  onEdit,
  className,
}) => {
  const columns = useMemo<ColumnDef<WorkTableItem>[]>(
    () => [
      { header: "Staj növü", accessor: "experienceType", sortable: false },
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
      {
        header: "Azad №",
        accessor: "releaseOrderNumber",
        sortable: false,
        width: "85px",
      },
      {
        header: "Səbəb",
        accessor: "releaseReason",
        sortable: false,
        width: "200px",
      },
      {
        header: (
          <>
            İşdən azad olmanın hüquqi əsası <br /> və ya yerdəyişmə
          </>
        ),
        accessor: "legalBasisOrTransfer",
        sortable: false,
        width: "220px",
        render: (item) => (
          <div style={{ whiteSpace: "normal", fontSize: "14px", lineHeight: "1.4" }}>
            {item.legalBasisOrTransfer}
          </div>
        ),
      },
      {
        header: "",
        accessor: "actions",
        sortable: false,
        render: (item) => {
          const status = item.raw?.status ?? item.status ?? "";
          const isTerminated = item.raw?.isTerminated ?? item.isTerminated ?? false;

          const showTerminateButton =
            status === "Approved" && isTerminated === false;

          return (
            <TableRowActions>
              {showTerminateButton ? (
                <PermissionGuard permission={PERMISSIONS.EMPLOYEE.TERMINATED}>
                  <button
                    type="button"
                    className={styles.azadEtBtn}
                    onClick={() => onEdit?.(item, "terminate")}
                  >
                    Azad et
                  </button>
                </PermissionGuard>
              ) : (
                <>
                  <PermissionGuard permission={PERMISSIONS.EMPLOYEE.UPDATE}>
                    <TableButton
                      variant="edit"
                      onClick={() => onEdit?.(item, "edit")}
                      title="Düzəliş et"
                    />
                  </PermissionGuard>

                  {onRemove && (
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
                  )}
                </>
              )}
            </TableRowActions>
          );
        },
      },
    ],
    [onRemove, onEdit],
  );

  const getRowClassName = (item: WorkTableItem) => {
    const status = item.raw?.status ?? item.status ?? "";
    if (status === "Pending") return styles.pendingRow;
    if (status === "Approved") return styles.approvedRow;
    return "";
  };

  return (
    <div className={`${styles.wrapper} ${className || ""}`}>
      {data.length === 0 ? (
        <EmptyState />
      ) : (
        <Table
          data={data}
          columns={columns}
          className={styles.tableScroll}
          getRowClassName={getRowClassName}
        />
      )}
    </div>
  );
};
