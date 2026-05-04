import { useMemo } from "react";
import { EyeIcon, ListBulletIcon, TrashIcon } from "@heroicons/react/24/outline";
import type { ColumnDef, Option } from "@/shared/types";
import type { EnumType } from "./types";
import styles from "../ui/EnumTypesPage.module.css";

interface UseEnumTypesColumnsProps {
  currentPage?: number;
  selectedRowCount?: Option | null;
  onDetail: (enumType: EnumType) => void;
  onEnum?: (enumType: EnumType) => void;
  onDelete?: (enumType: EnumType) => void;
}

export const useEnumTypesColumns = ({
  currentPage = 1,
  selectedRowCount,
  onDetail,
  onEnum,
  onDelete,
}: UseEnumTypesColumnsProps) => {
  const columns = useMemo<ColumnDef<EnumType>[]>(
    () => [
      {
        header: "Sıra №",
        accessor: "id",
        sortable: false,
        render: (_item, index) => {
          const rowNumber = (currentPage - 1) * (Number(selectedRowCount?.id) || 10) + (index ?? 0) + 1;
          return <span className={styles.rowNumber}>{rowNumber}</span>;
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
        header: "Təsvir",
        accessor: "description",
        sortable: false,
        render: (item) => item.description || "-",
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
            {onDelete && (
              <button
                className={`${styles.customActionBtn} ${styles.deleteBtn}`}
                onClick={() => !item.isSystem && onDelete(item)}
                title={item.isSystem ? "Sistem enum tipi silinə bilməz" : "Enum tipini sil"}
                disabled={item.isSystem}
              >
                <TrashIcon width={16} />
              </button>
            )}
            {onEnum && (
              <button
                className={`${styles.customActionBtn} ${styles.enumBtn}`}
                onClick={() => onEnum(item)}
                title="Enum dəyərləri"
              >
                <ListBulletIcon width={16} />
                <span>Enum</span>
              </button>
            )}
          </div>
        ),
      },
    ],
    [currentPage, selectedRowCount, onDetail, onEnum, onDelete]
  );

  return columns;
};
