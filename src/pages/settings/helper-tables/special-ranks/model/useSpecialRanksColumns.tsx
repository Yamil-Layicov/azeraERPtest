import { useMemo } from "react";
import type { SpecialRank } from "@/features/settings/special-ranks";
import { EyeIcon, TrashIcon } from "@heroicons/react/24/outline";
import { CheckIcon } from "@heroicons/react/24/solid";
import { useEnumItemsByCode } from "@/features/lookups";
import styles from "../ui/SpecialRanksPage.module.css";
import type { Option, ColumnDef } from "@/shared/types";

interface UseSpecialRanksColumnsProps {
  currentPage: number;
  selectedRowCount: Option | null;
  onDetail: (specialRank: SpecialRank) => void;
  onDelete: (specialRank: SpecialRank) => void;
}

export const useSpecialRanksColumns = ({
  onDetail,
  onDelete,
}: UseSpecialRanksColumnsProps) => {
  const { options: organOptions } = useEnumItemsByCode("Organs", true);

  const renderCheckStatus = (isActive: boolean) => {
    return isActive ? (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <CheckIcon width={20} style={{ color: "#16a34a" }} />
      </div>
    ) : (
      <div style={{ textAlign: "center", color: "var(--text-muted)" }}>-</div>
    );
  };

  return useMemo<ColumnDef<SpecialRank>[]>(
    () => [
      {
        header: "Sıra №",
        accessor: "sortOrder",
        sortable: false,
        render: (item) => item.sortOrder ?? "-",
      },
      {
        header: "Orqan",
        accessor: "organCode",
        sortable: false,
        render: (item) => {
          const matched = organOptions.find(
            (opt) => String(opt.id) === String(item.organCode)
          );
          return matched ? matched.fullName : item.organCode || "-";
        },
      },
      {
        header: "Ad",
        accessor: "name",
        sortable: false,
        render: (item) => <span className={styles.roleName}>{item.name}</span>,
      },
      {
        header: "Status",
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
              onClick={() => onDelete(item)}
              title="Sil"
            >
              <TrashIcon width={16} />
            </button>
          </div>
        ),
      },
    ],
    [onDetail, onDelete, organOptions]
  );
};
