import { useState, useMemo } from "react";
import styles from "./PendingApprovalPage.module.css";
import { Table } from "@/shared/ui/table";
import { Pagination } from "@/shared/ui/pagination";
import {
  PendingApprovalSearchModal,
  type PendingApprovalSearchFormData,
} from "@/shared/ui/cashbox-modals";
import type { Option } from "@/shared/types";
import {
  operationOptions,
  rowCountOptions,
} from "@/shared/config/tableOptions";
import {
  TableActionGroup,
  TableControls,
  PageHeader,
  TableToolbar,
} from "@/shared/ui";
import { usePendingApprovalColumns } from "../model/usePendingApprovalColumns";
import type { PendingApprovalEntry } from "../model/types";
import { useGetAllPendingApprovalCashOperations } from "@/features/maliyye/cash-operations";
import { useTableSort } from "@/shared/hooks";
import { useExcelExport } from "@/shared/lib/hooks/useExcelExport";

import PendingApprovalDetailModal from "./components/PendingApprovalDetailModal";
import toast from "react-hot-toast";

export default function PendingApprovalPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRowCount, setSelectedRowCount] = useState<Option | null>(
    rowCountOptions[0] || null,
  );
  const [selectedOperation, setSelectedOperation] = useState<Option | null>(
    null,
  );
  const { exportToExcel } = useExcelExport<any>();

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState<{
    // Burada backend-ə gedəcək raw dəyəri saxlayırıq: "Income" | "Expense" | "Transfer"
    operationType?: string;
    cashBoxId?: string;
    cashPurposeId?: string;
    payerOrRecipientName?: string;
  }>({});

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PendingApprovalEntry | null>(
    null,
  );

  const itemsPerPage = Number(selectedRowCount?.id) || 10;

  const { sortColumn, sortDirection, handleSort, orderBy, isDesc } =
    useTableSort({ initialColumn: "createdDate", initialDirection: "desc" });

  const {
    data: operationsResponse,
    isFetching,
    refetch: refetchOperations,
  } = useGetAllPendingApprovalCashOperations({
    pageSize: itemsPerPage,
    pageIndex: currentPage - 1,
    isDesc: isDesc ?? true,
    orderBy: orderBy ?? "createdDate",
    status: 1,
    operationType:
      searchFilter.operationType !== undefined
        ? searchFilter.operationType
        : selectedOperation
          ? String(selectedOperation.id)
          : undefined,
    cashBoxId: searchFilter.cashBoxId,
    cashPurposeId: searchFilter.cashPurposeId,
    payerOrRecipientName: searchFilter.payerOrRecipientName,
  });

  const totalCount = operationsResponse?.result?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowCountChange = (value: Option | null) => {
    setSelectedRowCount(value);
    setCurrentPage(1);
  };

  type CashOperationListItem = {
    id: string;
    cashOperationType?: number;
    amount?: number;
    currencyType?: number;
    cashPurposeName?: string;
    fromCashBoxName?: string | null;
    toCashBoxName?: string | null;
    payerOrRecipientName?: string | null;
    createdDate?: string;
    status?: number;
  };

  const paginatedData = useMemo(() => {
    if (!operationsResponse?.result?.data) return [];

    return (operationsResponse.result.data as CashOperationListItem[]).map(
      (item) => {
        const typeStr =
          item.cashOperationType === 1
            ? "Mədaxil"
            : item.cashOperationType === 2
              ? "Məxaric"
              : "Köçürmə";

        const dateStr = item.createdDate
          ? new Date(item.createdDate).toLocaleString("az-AZ", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "-";

        const itemDate = item.createdDate ? new Date(item.createdDate) : null;
        const today = new Date();

        const itemDateOnly = itemDate
          ? new Date(
              itemDate.getFullYear(),
              itemDate.getMonth(),
              itemDate.getDate(),
            ).getTime()
          : null;
        const todayDateOnly = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
        ).getTime();

        const isToday = itemDateOnly === todayDateOnly;
        const isFuture = itemDateOnly !== null && itemDateOnly > todayDateOnly;

        const currencyMap: Record<number, string> = {
          1: "AZN",
          2: "USD",
          3: "EUR",
        };

        return {
          id: item.id,
          operationType: typeStr,
          date: dateStr,
          isToday,
          isFuture,
          source:
            item.cashOperationType === 1
              ? item.toCashBoxName || "-"
              : item.cashOperationType === 2
                ? item.fromCashBoxName || "-"
                : item.fromCashBoxName || item.toCashBoxName || "-",
          amount: item.amount || 0,
          currency: currencyMap[item.currencyType ?? 1] || "AZN",
          destination: item.cashPurposeName || "-",
        } as PendingApprovalEntry;
      },
    );
  }, [operationsResponse]);

  const handleRefresh = () => {
    // Mövcud filtr, səhifə və sort parametrləri ilə eyni sorğunu yenidən işə sal
    refetchOperations();
  };

  const handleOperationChange = (value: Option | null) => {
    if (value?.id === "export_excel") {
      const allData = (operationsResponse?.result?.data ||
        []) as CashOperationListItem[];
      if (allData.length === 0) {
        toast.error("İxrac etmək üçün məlumat yoxdur");
        return;
      }
      const exportData = allData.map((item) => {
        const typeStr =
          item.cashOperationType === 1
            ? "Mədaxil"
            : item.cashOperationType === 2
              ? "Məxaric"
              : "Köçürmə";
        const statusMap: Record<number, string> = {
          1: "Təsdiq gözləyir",
          2: "Yaradıldı",
          3: "Təsdiq olundu",
          4: "Rədd edildi",
          5: "Geri qaytarıldı",
          6: "Xəzinədarın təsdiqi",
        };
        const currencyMap: Record<number, string> = {
          1: "AZN",
          2: "USD",
          3: "EUR",
        };
        const currency = currencyMap[item.currencyType ?? 1] || "AZN";
        const source =
          item.cashOperationType === 1
            ? item.toCashBoxName || "-"
            : item.cashOperationType === 2
              ? item.fromCashBoxName || "-"
              : item.fromCashBoxName || item.toCashBoxName || "-";
        return {
          type: typeStr,
          source,
          amount: `${item.amount} ${currency}`,
          status: statusMap[item.status ?? 1] || "Bilinmir",
          createdAt: item.createdDate
            ? new Date(item.createdDate).toLocaleString("az-AZ")
            : "-",
          payerOrRecipientName: item.payerOrRecipientName || "-",
          cashPurposeName: item.cashPurposeName || "-",
        };
      });
      exportToExcel({
        data: exportData,
        columns: [
          { header: "Tarix", accessor: "createdAt" },
          { header: "Əməliyyatin Növü", accessor: "type" },
          { header: "Məbləğ", accessor: "amount" },
          { header: "Mənbə", accessor: "source" },
          { header: "Status", accessor: "status" },
          { header: "Təyinat", accessor: "cashPurposeName" },
        ],
        fileName: "tedbir-emeliyyatlar",
        sheetName: "Əməliyyatlar",
      });
      setSelectedOperation(null);
      return;
    }
    setSelectedOperation(value);
  };

  const handleSearch = (searchData: PendingApprovalSearchFormData) => {
    setSearchFilter({
      // Burada string value-nu saxlayırıq, request zamanı eyni dəyər göndəriləcək
      operationType: searchData.operationType
        ? String(searchData.operationType.id)
        : undefined,
      cashBoxId: searchData.source ? String(searchData.source.id) : undefined,
      cashPurposeId: searchData.purpose
        ? String(searchData.purpose.id)
        : undefined,
      payerOrRecipientName: searchData.treasurer
        ? String(searchData.treasurer.id)
        : undefined,
    });
    setCurrentPage(1);
    // İstifadəçi "Axtar" düyməsinə basanda, cari filtrlərlə sorğunu
    // mütləq yenidən göndərək (hətta parametrlər dəyişməsə belə).
    refetchOperations();
  };

  const handleDetailClick = (item: PendingApprovalEntry) => {
    setSelectedItem(item);
    setIsDetailModalOpen(true);
  };

  // Columns hook
  const columns = usePendingApprovalColumns({
    currentPage,
    selectedRowCount,
    onDetail: handleDetailClick,
  });

  return (
    <div className={styles.pageContainer}>
      <PageHeader title="Təsdiq gözləyən" />

      <TableToolbar>
        <TableControls
          selectedRowCount={selectedRowCount}
          onRowCountChange={handleRowCountChange}
          totalCount={totalCount}
        />

        <div className={styles.actionsGroup}>
          <TableActionGroup
            onRefresh={handleRefresh}
            onSearch={() => setIsSearchModalOpen(true)}
            onOperationChange={handleOperationChange}
            operationOptions={operationOptions}
            selectedOperation={selectedOperation}
          />
        </div>
      </TableToolbar>

      {isFetching ? (
        <div style={{ textAlign: "center", padding: "2rem" }}>Yüklənir...</div>
      ) : (
        <Table
          data={paginatedData}
          columns={columns}
          onSort={handleSort}
          sortColumn={sortColumn ?? undefined}
          sortDirection={sortDirection}
        />
      )}

      <TableToolbar>
        <TableControls
          selectedRowCount={selectedRowCount}
          onRowCountChange={handleRowCountChange}
          totalCount={totalCount}
        />
      </TableToolbar>

      <div className={styles.pagination}>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          showFirstLast={true}
          maxVisiblePages={5}
        />
      </div>

      <PendingApprovalSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSearch={handleSearch}
      />

      <PendingApprovalDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        data={selectedItem}
      />
    </div>
  );
}
