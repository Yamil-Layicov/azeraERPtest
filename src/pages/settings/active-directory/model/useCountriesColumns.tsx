import { useMemo } from "react";
import { EyeIcon, TrashIcon} from "@heroicons/react/24/outline";
import { CheckIcon } from "@heroicons/react/24/solid";
import type { ColumnDef, Option } from "@/shared/types";
import type { LdapDirectory } from "./types";
import styles from "../ui/ActiveDirectory.module.css";

interface UseCountriesColumnsProps {
  currentPage?: number;
  selectedRowCount?: Option | null;
  onDetail: (item: LdapDirectory) => void;
  onDelete: (item: LdapDirectory) => void;
}

export const useCountriesColumns = ({
  currentPage = 1,
  selectedRowCount,
  onDetail,
  onDelete,
}: UseCountriesColumnsProps) => {
  const renderCheckStatus = (isActive: boolean) => {
    return isActive ? (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <CheckIcon width={20} style={{ color: "#16a34a" }} />
      </div>
    ) : (
      <div style={{ textAlign: "center", color: "var(--text-muted)" }}>-</div>
    );
  };

  const columns = useMemo<ColumnDef<LdapDirectory>[]>(
    () => [
      {
        header: "№",
        accessor: "id",
        sortable: false,
        render: (_item, index) => (index || 0) + 1,
      },
      {
        header: "Ad",
        accessor: "name",
        sortable: false,
        render: (item) => <span className={styles.roleName}>{item.name}</span>,
      },
      {
        header: "Domain",
        accessor: "domain",
        sortable: false,
        render: (item) => item.domain || "-",
      },
      {
        header: "Host",
        accessor: "host",
        sortable: false,
        render: (item) => item.host || "-",
      },
      {
        header: "Port",
        accessor: "port",
        sortable: false,
        render: (item) => item.port || "-",
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
              onClick={() => onDelete(item)}
              title="Sil"
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
