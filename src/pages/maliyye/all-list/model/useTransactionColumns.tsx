import { useMemo } from "react";
import styles from "../ui/AllListPage.module.css"; 
import { TableButton, TableRowActions, StatusBadge } from "@/shared/ui";
import type { ColumnDef, Option } from "@/shared/types";
import type { Transaction } from "./types";
import { getStatusVariant } from "./consts";

interface UseTransactionColumnsProps {
  currentPage: number;
  selectedRowCount: Option | null;
  onDetail: (item: Transaction) => void;
  onEdit: (item: Transaction) => void;
  onPrint: (item: Transaction) => void;
  onDelete: (item: Transaction) => void;
}

export const useTransactionColumns = ({
  currentPage,
  selectedRowCount,
  onDetail,
  onEdit,
  onPrint,
  onDelete
}: UseTransactionColumnsProps) => {
  
  const columns = useMemo<ColumnDef<Transaction>[]>(() => [
    {
      header: "#",
      accessor: "id",
      width: "35px",
      render: (_, index = 0) => {
        const itemsPerPage = Number(selectedRowCount?.id) || 10;
        const rowNumber = (currentPage - 1) * itemsPerPage + index + 1;
        return rowNumber;
      },
    },
    {
      header: "Əməliyyatın növü",
      accessor: "type",
      sortKey: "cashOperationType",
    },
    {
      header: "Mənbə",
      accessor: "source",
      sortKey: "fromCashBoxName or toCashBoxName",
    },
    {
      header: "Məbləğ",
      accessor: "amount",
      sortKey: "amount",
      render: (item) => {
        const isDown = item.amountType === "down";
        return (
          <span className={isDown ? styles.amountDown : styles.amountUp}>
            {isDown ? (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 2V12M7 12L2 7M7 12L12 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 12V2M7 2L2 7M7 2L12 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
            {item.amount}
          </span>
        );
      },
    },
    {
      header: "Pulu alan/verən",
      accessor: "person",
      sortKey: "payerOrRecipientName",
    },
    {
      header: "Status",
      accessor: "status",
      render: (item) => (
        <StatusBadge 
          label={item.status} 
          variant={getStatusVariant(item.statusType)} 
        />
      ),
    },
    {
      header: "Təyinat",
      accessor: "purpose",
      sortKey: "cashPurposeName",
    },
    {
      header: "Daxilolma tarixi",
      accessor: "createdAt",
      sortKey: "createdDate",
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
            <TableButton 
              variant="edit" 
              onClick={() => onEdit(item)}
              title="Düzəliş et"
            />
            <TableButton 
              variant="print" 
              onClick={() => onPrint(item)} 
            />
            <TableButton 
              variant="delete" 
              onClick={() => onDelete(item)} 
            />
        </TableRowActions>
      ),
    },
  ], [currentPage, selectedRowCount, onDetail, onPrint, onDelete]);

  return columns;
};