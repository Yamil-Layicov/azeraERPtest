import { useMemo } from "react";
import { EyeIcon, TrashIcon } from "@heroicons/react/24/outline";
import { CheckIcon } from "@heroicons/react/24/solid";
import type { ColumnDef, Option } from "@/shared/types";
import type { City } from "./types";
import styles from "../ui/CitiesPage.module.css";

interface UseCitiesColumnsProps {
  currentPage?: number;
  selectedRowCount?: Option | null;
  onDetail: (city: City) => void;
  onDelete: (city: City) => void;
}

export const useCitiesColumns = ({
  currentPage = 1,
  selectedRowCount,
  onDetail,
  onDelete,
}: UseCitiesColumnsProps) => {
  const renderCheckStatus = (isActive: boolean) => {
    return isActive ? (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <CheckIcon width={20} style={{ color: "#16a34a" }} />
      </div>
    ) : (
      <div style={{ textAlign: "center", color: "var(--text-muted)" }}>-</div>
    );
  };

  const columns = useMemo<ColumnDef<City>[]>(
    () => [
      {
        header: "Sıra nö:",
        accessor: "id",
        sortable: false,
        render: (_item, index) => {
          const itemsPerPage = Number(selectedRowCount?.id) || 10;
          const rowNumber = (currentPage - 1) * itemsPerPage + (index ?? 0) + 1;
          return rowNumber;
        },
      },
      {
        header: "Adı",
        accessor: "name",
        sortable: false,
        render: (item) => <span className={styles.cityName}>{item.name}</span>,
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
        width: "120px",
        sortable: false,
        render: (item) => (
          <div className={styles.actionGroup}>
            <button
              className={`${styles.customActionBtn} ${styles.detailBtn}`}
              onClick={() => onDetail(item)}
              title="Ətraflı bax"
            >
              <EyeIcon width={16} />
            </button>
            <button
              className={`${styles.customActionBtn} ${styles.deleteBtn}`}
              onClick={() => !item.isSystem && onDelete(item)}
              title={item.isSystem ? "Sistem şəhəri silinə bilməz" : "Şəhəri sil"}
              disabled={item.isSystem}
            >
              <TrashIcon width={16} />
            </button>
          </div>
        ),
      },
    ],
    [currentPage, selectedRowCount, onDetail, onDelete]
  );

  return columns;
};
