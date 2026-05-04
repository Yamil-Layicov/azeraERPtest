import { useMemo } from "react";
import { TableRowActions, TableButton } from "@/shared/ui";
import type { ColumnDef } from "@/shared/types";
import type { Notification } from "./index";
import styles from "./UseNotification.module.css";

interface UseNotificationColumnsProps {
  onEdit: (row: Notification) => void;
  onToggleStatus: (id: number) => void;
  onDetail: (row: Notification) => void;
}

export const useNotificationColumns = ({
  onEdit,
  onToggleStatus,
  onDetail,
}: UseNotificationColumnsProps) => {
  const columns = useMemo<ColumnDef<Notification>[]>(
    () => [
      { header: "Tarix", accessor: "date" },

      {
        header: "Başlıq",
        accessor: "title",
        render: (row) => (
          <div className={styles.titleColumn}>
            <span className={styles.tableTitle}>{row.title}</span>
          </div>
        ),
      },
      {
        header: "Movzu",
        accessor: "description",
        render: (row) => {
          const plainText = row.description.replace(/<[^>]+>/g, "");
          const words = plainText.split(" ");
          const truncatedText = words.slice(0, 4).join(" ");
          return (
            <span title={plainText}>
              {words.length > 10 ? `${truncatedText}...` : truncatedText}
            </span>
          );
        },
      },

      {
        header: "",
        accessor: "id",
        render: (row) => (
          <TableRowActions>
            <TableButton variant="detail" onClick={() => onDetail(row)} />
            <TableButton variant="edit" onClick={() => onEdit(row)} />
            <TableButton variant="delete" onClick={() => {}} />

            <button
              className={`${styles.tableToggleButton} ${
                row.isActive ? styles.deactivateBtn : styles.activateBtn
              }`}
              onClick={() => onToggleStatus(row.id)}
            >
              {row.isActive ? "Deaktiv et" : "Aktiv et"}
            </button>
          </TableRowActions>
        ),
      },
    ],
    [onEdit, onToggleStatus, onDetail],
  );

  return columns;
};
