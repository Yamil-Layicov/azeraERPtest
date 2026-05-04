import { useMemo } from "react";
import styles from "../ui/PendingApprovalPage.module.css";
import { TableButton, TableRowActions } from "@/shared/ui";
import type { ColumnDef, Option } from "@/shared/types";
import type { PendingApprovalEntry } from "./types";

interface UsePendingApprovalColumnsProps {
  currentPage: number;
  selectedRowCount: Option | null;
  onDetail: (item: PendingApprovalEntry) => void;
}

export const usePendingApprovalColumns = ({
  currentPage,
  selectedRowCount,
  onDetail,
}: UsePendingApprovalColumnsProps) => {
  
  const columns = useMemo<ColumnDef<PendingApprovalEntry>[]>(() => [
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
      header: "Əməliyyatın növü",
      accessor: "operationType",
      sortKey: "cashOperationType",
    },
    {
      header: "Tarix",
      accessor: "date",
      sortKey: "createdDate",
      render: (item) => (
        <span
          className={
            item.isToday
              ? styles.todayDate
              : item.isFuture
                ? styles.futureDate
                : undefined
          }
        >
          {item.date}
        </span>
      ),
    },
    {
      header: "Mənbə",
      accessor: "source",
      sortKey: "cashBoxName",
    },
    {
      header: "Məbləğ",
      accessor: "amount",
      render: (item) => {
        return <strong>{item.amount.toFixed(2)}</strong>;
      },
    },
    {
      header: "Valyuta",
      accessor: "currency",
      sortKey: "currencyType",
    },
    {
      header: "Təyinat",
      accessor: "destination",
      sortKey: "cashPurposeName",
    },
    {
      header: "",
      accessor: "action",
      render: (item) => (
        <TableRowActions>
          <TableButton
            variant="detail"
            onClick={() => onDetail(item)}
          />
        </TableRowActions>
      ),
    },
  ], [currentPage, selectedRowCount, onDetail]);

  return columns;
};