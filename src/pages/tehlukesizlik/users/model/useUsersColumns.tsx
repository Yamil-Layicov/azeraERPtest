import { useMemo } from "react";
import { CheckIcon, MinusIcon } from "@heroicons/react/24/solid";
import { EyeIcon } from "@heroicons/react/24/outline";
import type { ColumnDef, Option } from "@/shared/types";
import type { User } from "./types";
import styles from "../ui/UsersPage.module.css";
import { StatusBadge } from "@/shared/ui";

const CheckStatus = ({ isActive }: { isActive: boolean }) =>
  isActive ? (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <CheckIcon width={20} style={{ color: "#16a34a" }} />
    </div>
  ) : (
    <div style={{ textAlign: "center", color: "var(--text-muted)" }}>
      <MinusIcon width={20} />
    </div>
  );

interface UseUsersColumnsProps {
  currentPage?: number;
  selectedRowCount?: Option | null;
  onDelete: (user: User) => void;
  onDetail: (user: User) => void;
}

export const useUsersColumns = ({ 
  currentPage = 1,
  selectedRowCount,
  onDelete, 
  onDetail 
}: UseUsersColumnsProps) => {
  const columns = useMemo<ColumnDef<User>[]>(() => [
    {
      header: "#",
      accessor: "id",
      width: "50px",
      render: (_, index = 0) => {
        const itemsPerPage = Number(selectedRowCount?.id) || 10;
        const rowNumber = (currentPage - 1) * itemsPerPage + index + 1;
        return <span className={styles.rowNumber}>{rowNumber}</span>;
      },
    },
    {
      header: "İstifadəçi adı",
      accessor: "username",
    },
    {
      header: "Aktiv",
      accessor: "isActive",
      render: (item) => <CheckStatus isActive={item.isActive} />,
    },
    {
      header: "Əlaqəli sistem",
      accessor: "ldapUserId",
      sortable: false,
      render: (item) => {
        const user = item as User;
        return user.ldapUserId ? (
          <StatusBadge label="LDAP" variant="info" />
        ) : (
          <span>-</span>
        );
      },
    },
    {
      header: "",
      accessor: "actions",
      render: (item) => (
        <div className={styles.actionGroup}>
          <button 
            className={`${styles.customActionBtn} ${styles.detailBtn}`}
            onClick={() => onDetail(item)}
            title="Ətraflı bax"
          >
            <EyeIcon width={16} />  
            <span>Ətraflı</span>
          </button>
        </div>
      ),
    },
  ], [currentPage, selectedRowCount, onDelete, onDetail]);

  return columns;
};