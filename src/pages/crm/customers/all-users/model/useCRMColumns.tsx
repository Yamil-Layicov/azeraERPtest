import { useMemo } from "react";
import { StatusBadge } from "@/shared/ui";
import type { ColumnDef } from "@/shared/types";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import type { CRMUser } from "./types";
import styles from "../ui/AllUsers.module.css";

interface UseCRMColumnsProps {
  onEdit?: (user: CRMUser) => void;
  onDelete?: (user: CRMUser) => void;
}

export const useCRMColumns = ({ onEdit, onDelete }: UseCRMColumnsProps = {}) => {
  return useMemo<ColumnDef<CRMUser>[]>(
    () => [
      {
        header: "№",
        accessor: "id",
        render: (_, rowIndex) => <span className={styles.rowNumber}>{(rowIndex ?? 0) + 1}</span>,
      },
      {
        header: "Ad, Soyad",
        accessor: "fullName",
      },
      {
        header: "İstifadəçi adı",
        accessor: "username",
      },
      {
        header: "Telefon",
        accessor: "phone",
      },
      {
        header: "Rol",
        accessor: "role",
      },
      {
        header: "Son giriş",
        accessor: "lastLogin",
      },
      {
        header: "Status",
        accessor: "status",
        render: (item) => (
          <StatusBadge
            variant={item.status === "active" ? "success" : "danger"}
            label={item.status === "active" ? "Aktiv" : "Deaktiv"}
          />
        ),
      },
      {
        header: "",
        accessor: "actions",
        render: (item) => (
          <div className={styles.actionGroup}>
            <button 
              className={`${styles.customActionBtn} ${styles.editBtn}`}
              onClick={() => onEdit?.(item)}
            >
              <PencilSquareIcon width={16} />
            </button>
            <button 
              className={`${styles.customActionBtn} ${styles.deleteBtn}`}
              onClick={() => onDelete?.(item)}
            >
              <TrashIcon width={16} />
            </button>
          </div>
        ),
      },
    ],
    [onEdit, onDelete]
  );
};
