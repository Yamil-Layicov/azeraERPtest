import { useMemo } from "react";
// DÜZƏLİŞ: PencilSquareIcon silindi, EyeIcon əlavə edildi
import { EyeIcon, TrashIcon } from "@heroicons/react/24/outline"; 
import type { ColumnDef, Option } from "@/shared/types";
import type { Role } from "./types";
import styles from "../ui/RolesPage.module.css";

interface UseRolesColumnsProps {
  currentPage?: number;
  selectedRowCount?: Option | null;
  onDetail: (role: Role) => void;
  onDelete: (role: Role) => void;
}

export const useRolesColumns = ({
  currentPage = 1,
  selectedRowCount,
  onDetail, // Bu funksiya "Ətraflı" paneli açacaq
  onDelete,
}: UseRolesColumnsProps) => {

  const columns = useMemo<ColumnDef<Role>[]>(() => [
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
      header: "Rolun Adı",
      accessor: "name",
      render: (item) => <span className={styles.roleName}>{item.name}</span>,
    },
    {
      header: "Açıqlama",
      accessor: "description",
      render: (item) => item.description || "-",
    },
    {
      header: "",
      accessor: "actions",
      width: "120px",
      render: (item) => (
        <div className={styles.actionGroup}>
          {/* DÜZƏLİŞ: Düzəliş butonu Ətraflı ilə əvəz olundu */}
          <button
            className={`${styles.customActionBtn} ${styles.detailBtn}`}
            onClick={() => onDetail(item)}
            title="Ətraflı bax"
          >
            <EyeIcon width={16} />
            <span>Ətraflı</span>
          </button>

          <button
            className={`${styles.customActionBtn} ${styles.deleteBtn}`}
            onClick={() => onDelete(item)}
            disabled={item.noAction === true}
            title={item.noAction === true ? "Bu rol silinə bilməz" : "Rolu sil"}
          >
            <TrashIcon width={16} />
            <span>Sil</span>
          </button>
        </div>
      ),
    },
  ], [currentPage, selectedRowCount, onDetail, onDelete]);

  return columns;
};