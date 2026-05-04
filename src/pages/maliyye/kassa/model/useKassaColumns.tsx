import { useMemo } from "react";
import styles from "../ui/KassaPage.module.css";
import { TableButton, TableRowActions } from "@/shared/ui";
import type { ColumnDef, Option } from "@/shared/types";
import type { CashboxEntry } from "./types";
import { CheckIcon } from "@heroicons/react/24/solid";

interface UseKassaColumnsProps {
  currentPage: number;
  selectedRowCount: Option | null;
  onDetail: (item: CashboxEntry) => void;
  onDelete: (item: CashboxEntry) => void;
  onEdit: (item: CashboxEntry) => void;
  showDetail?: boolean;
}

const renderCheckStatus = (isActive: boolean) => {
  return isActive ? (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <CheckIcon width={20} style={{ color: "#16a34a" }} />
    </div>
  ) : (
    <div style={{ textAlign: "center", color: "var(--text-muted)" }}>-</div>
  );
};

export const useKassaColumns = ({
  currentPage,
  selectedRowCount,
  onDetail,
  onDelete,
  onEdit,
  showDetail = true,
}: UseKassaColumnsProps) => {
  const columns = useMemo<ColumnDef<CashboxEntry>[]>(
    () => [
      {
        header: "#",
        accessor: "id",
        width: "35px",
        render: (_, index = 0) => {
          const itemsPerPage = Number(selectedRowCount?.id) || 10;
          const rowNumber = (currentPage - 1) * itemsPerPage + index + 1;
          return <span className={styles.rowNumber}>{rowNumber}</span>;
        },
      },
      {
        header: "Adı",
        accessor: "name",
        sortKey: "name",
      },
      {
        header: "Şirkət",
        accessor: "company",
        sortKey: "companyName",
      },
      {
        header: "Aktiv",
        accessor: "active",
        width: "15%",
        render: (item: CashboxEntry) => {
          return renderCheckStatus(item.active);
        },
      },
      {
        header: "Balans",
        accessor: "balance",
        sortKey: "balance",
        render: (item) => {
          return <strong>{item.balance.toFixed(2)}</strong>;
        },
      },
      {
        header: "Valyuta",
        accessor: "currency",
        sortKey: "currencyType",
      },
      {
        header: "Xəzinədar",
        accessor: "treasurer",
        sortKey: "treasurerName",
      },
      {
        header: "",
        accessor: "action",
        render: (item) => (
          <TableRowActions>
            {showDetail && (
              <TableButton variant="detail" onClick={() => onDetail(item)} />
            )}
            <TableButton
              variant="edit"
              title="Düzəliş et"
              onClick={() => onEdit(item)}
            />
            <TableButton variant="delete" onClick={() => onDelete(item)} />
          </TableRowActions>
        ),
      },
    ],
    [currentPage, selectedRowCount, onDetail, onDelete, onEdit, showDetail],
  );

  return columns;
};
