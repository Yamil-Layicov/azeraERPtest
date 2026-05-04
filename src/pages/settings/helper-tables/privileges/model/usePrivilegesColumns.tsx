import { useMemo } from "react";
import type { Privilege } from "@/features/settings/privileges";
import { EyeIcon, TrashIcon } from "@heroicons/react/24/outline";
import { CheckIcon } from "@heroicons/react/24/solid";
import { useEnumItemsByCode } from "@/features/lookups";
import styles from "../ui/PrivilegesPage.module.css";
import type { Option, ColumnDef } from "@/shared/types";

interface UsePrivilegesColumnsProps {
  currentPage: number;
  selectedRowCount: Option | null;
  onDetail: (privilege: Privilege) => void;
  onDelete: (privilege: Privilege) => void;
}

export const usePrivilegesColumns = ({
  onDetail,
  onDelete,
}: UsePrivilegesColumnsProps) => {
  const { options: legalBasisOptions } = useEnumItemsByCode("LegalBasis", true);

  const renderCheckStatus = (isActive: boolean) => {
    return isActive ? (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <CheckIcon width={20} style={{ color: "#16a34a" }} />
      </div>
    ) : (
      <div style={{ textAlign: "center", color: "var(--text-muted)" }}>-</div>
    );
  };

  return useMemo<ColumnDef<Privilege>[]>(
    () => [
      {
        header: "Sıra №", 
        accessor: "sortOrder",
        sortable: false,
        render: (item) => item.sortOrder ?? "-",
      },
      {
        header: "Hüquqi Əsas",
        accessor: "legalBasisCode",
        sortable: false,
        render: (item) => {
          const matched = legalBasisOptions.find(
            (opt) => String(opt.id) === String(item.legalBasisCode)
          );
          return matched ? matched.fullName : item.legalBasisCode || "-";
        },
      },
      {
        header: "Ad",
        accessor: "name",
        sortable: false,
        render: (item) => <span className={styles.roleName}>{item.name}</span>,
      },
      {
        header: "Əlavə məzuniyyət",
        accessor: "extraVacation",
        sortable: false,
        render: (item) => item.extraVacation ?? "-",
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
    [onDetail, onDelete]
  );
};
