import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import styles from "./AllListPage.module.css";
import { Pagination } from "@/shared/ui/pagination";
import { Table } from "@/shared/ui/table";
import { Button } from "@/shared/ui/button";
import {
  operationOptions,
  rowCountOptions,
} from "@/shared/config/tableOptions";
import { ROUTES } from "@/app/routes/consts";
import type { Option } from "@/shared/types";
import { CustomSelect } from "@/shared/ui/select";
import {
  SearchModal,
  TableControls,
  TableActionGroup,
  PageHeader,
  TableToolbar,
  ConfirmModal,
} from "@/shared/ui";
import TransactionDetailModal from "./components/TransactionDetailModal";
import { useTransactionColumns } from "../model/useTransactionColumns";
import type { Transaction } from "../model/types";
import { BuildingOfficeIcon } from "@heroicons/react/24/outline";
import { useTableSort } from "@/shared/hooks";
import { useExcelExport } from "@/shared/lib/hooks/useExcelExport";
import {
  useGetRootCompanies,
  useGetCashOperations,
  useDeleteCashOperation,
} from "@/features/maliyye/cash-operations";

export default function AllListPage() {
  const navigate = useNavigate();
  const { exportToExcel } = useExcelExport<Transaction>();

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRowCount, setSelectedRowCount] = useState<Option | null>(
    rowCountOptions[0] || null,
  );

  const [searchParams, setSearchParams] = useState({
    startDate: undefined as string | undefined,
    endDate: undefined as string | undefined,
    operationType: undefined as string | undefined,
    cashPurposeId: undefined as string | undefined,
    counterPartyId: undefined as string | undefined,
    cashBoxId: undefined as string | undefined,
    payerOrRecipientName: undefined as string | undefined,
    rootCompanyId: undefined as string | undefined,
    status: undefined as string | undefined,
  });

  const [selectedCompany, setSelectedCompany] = useState<Option | null>(null);

  const { data: rootCompaniesData, refetch: refetchRootCompanies } =
    useGetRootCompanies({ enabled: false });

  const companyOptions: Option[] = useMemo(() => {
    if (rootCompaniesData?.isSuccess && rootCompaniesData.result) {
      return rootCompaniesData.result.map((c) => ({
        id: c.value,
        fullName: c.label,
        role: "",
      }));
    }
    return [];
  }, [rootCompaniesData]);

  const itemsPerPage = Number(selectedRowCount?.id) || 10;

  const { sortColumn, sortDirection, handleSort, orderBy, isDesc } =
    useTableSort({ initialColumn: "createdDate", initialDirection: "desc" });

  const {
    data: operationsResponse,
    isFetching,
    refetch: refetchOperations,
  } = useGetCashOperations({
    pageSize: itemsPerPage,
    pageIndex: currentPage - 1,
    isDesc: isDesc ?? true,
    orderBy: orderBy ?? "createdDate",
    ...searchParams,
  });

  const { mutate: deleteOperation } = useDeleteCashOperation();

  const totalCount = operationsResponse?.result?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowCountChange = (value: Option | null) => {
    setSelectedRowCount(value);
    setCurrentPage(1);
  };

  const paginatedData = useMemo<Transaction[]>(() => {
    const items = operationsResponse?.result?.data;
    if (!items) return [];

    return items.map((item) => {
      const typeStr =
        item.cashOperationType === 1
          ? "Mədaxil"
          : item.cashOperationType === 2
            ? "Məxaric"
            : "Köçürmə";

      const amountType =
        item.cashOperationType === 1
          ? "down"
          : item.cashOperationType === 2
            ? "up"
            : "down";

      const statusMap: Record<
        number,
        {
          label: string;
          type:
            | "approved"
            | "pending"
            | "rejected"
            | "cancelled"
            | "returned"
            | "created"
            | "treasurer_approved";
        }
      > = {
        1: { label: "Təsdiq gözləyir", type: "pending" },
        2: { label: "Yaradıldı", type: "created" },
        3: { label: "Təsdiq olundu", type: "approved" },
        4: { label: "Rədd edildi", type: "rejected" },
        5: { label: "Geri qaytarıldı", type: "returned" },
        6: { label: "Xəzinədarın təsdiqi", type: "treasurer_approved" },
      };

      const s = statusMap[item.status] || {
        label: "Bilinmir",
        type: "pending",
      };
      const currencyMap: Record<number, string> = {
        1: "AZN",
        2: "USD",
        3: "EUR",
      };
      const currency = currencyMap[item.currencyType] || "AZN";

      return {
        id: item.id,
        type: typeStr,
        source:
          item.cashOperationType === 1
            ? item.toCashBoxName || "-"
            : item.cashOperationType === 2
              ? item.fromCashBoxName || "-"
              : item.fromCashBoxName || item.toCashBoxName || "-",
        amount: `${item.amount} ${currency}`,
        amountType,
        person: item.payerOrRecipientName || "-",
        status: s.label,
        statusType: s.type,
        purpose: item.cashPurposeName || "-",
        createdAt: new Date(item.createdDate).toLocaleString("az-AZ", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }),
      } as Transaction;
    });
  }, [operationsResponse]);

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState<Option | null>(
    null,
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Transaction | null>(null);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Transaction | null>(null);

  const handleAddNew = () => navigate(ROUTES.KASSA.ADD_KASSA.LINK);
  const handleRefresh = () => {
    refetchOperations();
  };
  const handleSearchClick = () => setIsSearchModalOpen(true);

  type SearchFormShape = {
    startDate?: Date | null;
    endDate?: Date | null;
    operationType?: Option | null;
    source?: Option | null;
    contractor?: Option | null;
    purpose?: Option | null;
    person?: string;
    status?: Option | null;
  };

  const handleSearch = (searchData: SearchFormShape) => {
    setSearchParams((prev) => ({
      ...prev,
      startDate: searchData.startDate
        ? searchData.startDate.toISOString()
        : undefined,
      endDate: searchData.endDate
        ? searchData.endDate.toISOString()
        : undefined,
      operationType: searchData.operationType
        ? String(searchData.operationType.id)
        : undefined,
      cashBoxId: searchData.source ? String(searchData.source.id) : undefined,
      counterPartyId: searchData.contractor
        ? String(searchData.contractor.id)
        : undefined,
      cashPurposeId: searchData.purpose
        ? String(searchData.purpose.id)
        : undefined,
      payerOrRecipientName: searchData.person ? searchData.person : undefined,
      status: searchData.status ? String(searchData.status.id) : undefined,
    }));
    setCurrentPage(1);
  };
  const handleOperationChange = (value: Option | null) => {
    if (value?.id === "export_excel") {
      const allData = operationsResponse?.result?.data || [];
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
        const currency = currencyMap[item.currencyType] || "AZN";
        const source =
          item.cashOperationType === 1
            ? item.toCashBoxName || "-"
            : item.cashOperationType === 2
              ? item.fromCashBoxName || "-"
              : item.fromCashBoxName || item.toCashBoxName || "-";
        return {
          ...item,
          type: typeStr,
          source,
          amount: `${item.amount} ${currency}`,
          status: statusMap[item.status] || "Bilinmir",
          createdAt: new Date(item.createdDate).toLocaleString("az-AZ"),
        };
      });
      exportToExcel({
        data: exportData,
        columns: [
          { header: "Tarix", accessor: "createdAt" },
          { header: "Əməliyyatin Növü", accessor: "type" },
          { header: "Məbləğ", accessor: "amount" },
          { header: "Mənbə", accessor: "source" },
          { header: "Pulu Alan verən", accessor: "payerOrRecipientName" },
          { header: "Status", accessor: "status" },
          { header: "Təyinat", accessor: "cashPurposeName" },
        ],
        fileName: "kassa-emeliyyatlar",
        sheetName: "Əməliyyatlar",
        lookupData: { rootCompaniesOptions: companyOptions },
      });
      setSelectedOperation(null);
      return;
    }
    setSelectedOperation(value);
  };

  const handleDetailClick = (item: Transaction) => {
    setSelectedItem(item);
    setIsDetailModalOpen(true);
  };

  const handleEditClick = (item: Transaction) => {
    navigate(ROUTES.KASSA.EDIT_KASSA.LINK.replace(":id", String(item.id)));
  };

  const handlePrintClick = () => {};

  const handleDeleteClick = (item: Transaction) => {
    setItemToDelete(item);
    setIsConfirmModalOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      deleteOperation(String(itemToDelete.id), {
        onSuccess: () => {
          setIsConfirmModalOpen(false);
          setItemToDelete(null);
        },
      });
    }
  };

  const columns = useTransactionColumns({
    currentPage,
    selectedRowCount,
    onDetail: handleDetailClick,
    onEdit: handleEditClick,
    onPrint: handlePrintClick,
    onDelete: handleDeleteClick,
  });

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <PageHeader title="Kassa Əməliyyatları" className={styles.pageHeader} />
        <div className={styles.headerCompanySelectContainer}>
          <CustomSelect
            id="header-company"
            options={companyOptions}
            value={selectedCompany}
            onChange={(value) => {
              setSelectedCompany(value as Option);
              setSearchParams((prev) => ({
                ...prev,
                rootCompanyId: value ? String((value as Option).id) : undefined,
              }));
              setCurrentPage(1);
            }}
            defaultText="Şirkət seçin"
            variant="form"
            isSearchable={true}
            searchPlaceholder="Axtar..."
            onMenuOpen={refetchRootCompanies}
            className={styles.headerCompanySelect}
            icon={BuildingOfficeIcon}
          />
          <Button
            className={styles.addButton}
            type="button"
            variant="primary"
            onClick={handleAddNew}
          >
            + Yeni
          </Button>
        </div>
      </div>

      <TableToolbar>
        <TableControls
          selectedRowCount={selectedRowCount}
          onRowCountChange={handleRowCountChange}
          totalCount={totalCount}
        />

        <TableActionGroup
          onRefresh={handleRefresh}
          onSearch={handleSearchClick}
          onOperationChange={handleOperationChange}
          operationOptions={operationOptions}
          selectedOperation={selectedOperation}
        />
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

      <TransactionDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        data={selectedItem}
        onApproveSuccess={refetchOperations}
      />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Təsdiq"
        message="Bu əməliyyatı silmək istədiyinizə əminsiniz?"
      />

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSearch={handleSearch}
        rootCompanyId={searchParams.rootCompanyId}
      />
    </div>
  );
}
