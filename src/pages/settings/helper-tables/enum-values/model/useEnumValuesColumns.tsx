import { useMemo } from "react";
import { EyeIcon, TrashIcon } from "@heroicons/react/24/outline";
import { CheckIcon } from "@heroicons/react/24/solid";
import type { ColumnDef, Option } from "@/shared/types";
import type { EnumItem } from "./types";
import styles from "../ui/EnumValuesPage.module.css";

interface UseEnumValuesColumnsProps {
  currentPage?: number;
  selectedRowCount?: Option | null;
  onDetail?: (item: EnumItem) => void;
  onDelete?: (item: EnumItem) => void;
}

export const useEnumValuesColumns = ({
  currentPage = 1,
  selectedRowCount,
  onDetail,
  onDelete,
}: UseEnumValuesColumnsProps) => {
  const renderCheckStatus = (isActive: boolean) => {
    return isActive ? (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <CheckIcon width={20} style={{ color: "#16a34a" }} />
      </div>
    ) : (
      <div style={{ textAlign: "center", color: "var(--text-muted)" }}>-</div>
    );
  };

  const columns = useMemo<ColumnDef<EnumItem>[]>(
    () => [
      {
        header: "Sıra №",
        accessor: "sortOrder",
        sortable: false,
        render: (item) => {
          return <span className={styles.rowNumber}>{item.sortOrder ?? "-"}</span>;
        },
      },
      {
        header: "Kod",
        accessor: "code",
        sortable: false,
        render: (item) => item.code || "-",
      },
      {
        header: "Adı",
        accessor: "displayName",
        sortable: false,
        render: (item) => <span className={styles.roleName}>{item.displayName}</span>,
      },
      {
        header: "Aktiv",
        accessor: "isActive",
        sortable: false,
        render: (item) => renderCheckStatus(item.isActive),
      },
      {
        header: "",
        accessor: "actions",
        width: "80px",
        sortable: false,
        render: (item) => (
          <div className={styles.actionGroup}>
            {onDetail && (
              <button
                className={`${styles.customActionBtn} ${styles.detailBtn}`}
                onClick={() => onDetail(item)}
                title="Ətraflı bax"
              >
                <EyeIcon width={16} />
              </button>
            )}
            {onDelete && (
              <button
                className={`${styles.customActionBtn} ${styles.deleteBtn}`}
                onClick={() => !item.isSystem && onDelete(item)}
                title={item.isSystem ? "Sistem dəyəri silinə bilməz" : "Sil"}
                disabled={item.isSystem}
              >
                <TrashIcon width={16} />
              </button>
            )}
          </div>
        ),
      },
    ],
    [currentPage, selectedRowCount, onDetail, onDelete]
  );

  return columns;
};
