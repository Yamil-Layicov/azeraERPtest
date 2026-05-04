import { useState, useMemo } from "react";
import {
  useGetCashBoxesAll,
  cashOperationsService,
  useGetRootCompanies,
} from "@/features/maliyye/cash-operations";
import type { Option } from "@/shared/types";
import type { CashboxSearchFormData } from "@/shared/ui/cashbox-modals/CashboxSearchModal";
import type { CashboxEntry } from "./types";
import type { CashBoxListItem } from "@/features/maliyye/cash-operations";
import { useTableSort } from "@/shared/hooks";
import toast from "react-hot-toast";
import { getBackendErrorMessage } from "@/shared/api/httpClient";
import { useExcelExport } from "@/shared/lib/hooks/useExcelExport";

const DEFAULT_PAGE_SIZE = 10;

function mapCashBoxToEntry(item: CashBoxListItem): CashboxEntry {
  const currencyType = item.currencyType ?? 1;
  const currency =
    item.currency ??
    (currencyType === 1 ? "AZN" : currencyType === 2 ? "USD" : "EUR");
  const isActive =
    item.active ?? item.isActive ?? (item.status === 1 || item.status === "Aktiv");

  return {
    id: String(item.id ?? ""),
    name: item.name ?? "",
    company: item.companyName ?? "",
    status: isActive ? "Aktiv" : "Qeyri-aktiv",
    balance: Number(item.balance) || 0,
    currency,
    treasurer: item.treasurerName ?? "",
    active: !!isActive,
  };
}

export const useKassaPage = () => {
  const { exportToExcel } = useExcelExport<CashboxEntry>();
  const [selectedOperation, setSelectedOperation] = useState<Option | null>(
    null
  );
  const [selectedCompany, setSelectedCompany] = useState<Option | null>(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRowCount, setSelectedRowCount] = useState<Option | null>({
    id: DEFAULT_PAGE_SIZE,
    fullName: String(DEFAULT_PAGE_SIZE),
    role: "",
  });
  const [filters, setFilters] = useState<{
    rootCompanyId?: string | null;
    treasureId?: string | null;
    status?: number | string;
    cashBoxId?: string | null;
  }>({});

  // Modal states
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [itemToDelete, setItemToDelete] = useState<CashboxEntry | null>(null);
  const [itemToEdit, setItemToEdit] = useState<CashboxEntry | null>(null);

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

  const pageSize = Number(selectedRowCount?.id) || DEFAULT_PAGE_SIZE;
  const pageIndex = currentPage - 1;

  const { sortColumn, sortDirection, handleSort, orderBy, isDesc } =
    useTableSort({ initialColumn: "createdDate", initialDirection: "desc" });

  const requestParams = useMemo(
    () => ({
      pageSize,
      pageIndex,
      isDesc: isDesc ?? true,
      orderBy: orderBy ?? "createdDate",
      rootCompanyId: filters.rootCompanyId ?? undefined,
      treasureId: filters.treasureId ?? undefined,
      status: filters.status,
      cashBoxId: filters.cashBoxId ?? undefined,
    }),
    [pageSize, pageIndex, filters, isDesc, orderBy]
  );

  const { data, isFetching, refetch } = useGetCashBoxesAll(requestParams);

  const result = data?.result;
  const totalCount = result?.totalCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const paginatedData: CashboxEntry[] = useMemo(
    () => (result?.data ?? []).map(mapCashBoxToEntry),
    [result?.data]
  );

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleRowCountChange = (option: Option | null) => {
    setSelectedRowCount(option);
    setCurrentPage(1);
  };
  const handleRefresh = () => refetch();
  const handleOperationChange = (value: Option | null) => {
    if (value?.id === "export_excel") {
      const allData = paginatedData;
      if (allData.length === 0) {
        toast.error("İxrac etmək üçün məlumat yoxdur");
        setSelectedOperation(null);
        return;
      }
      exportToExcel({
        data: allData,
        columns: [
          { header: "Ad", accessor: "name" },
          { header: "Şirkət", accessor: "company" },
          { header: "Status", accessor: "status" },
          { header: "Balans", accessor: "balance" },
          { header: "Valyuta", accessor: "currency" },
          { header: "Xəzinədar", accessor: "treasurer" },
        ],
        fileName: "kassalar",
        sheetName: "Kassalar",
        lookupData: { rootCompaniesOptions: companyOptions },
      });
      setSelectedOperation(null);
      return;
    }
    setSelectedOperation(value);
  };
  const handleAddNew = () => setIsAddModalOpen(true);
  const handleSearch = (searchData: CashboxSearchFormData) => {
    setFilters((prev) => ({
      ...prev,
      treasureId: searchData.treasurer?.id
        ? String(searchData.treasurer.id)
        : null,
      cashBoxId: searchData.source?.id ? String(searchData.source.id) : null,
    }));
    setCurrentPage(1);
    setIsSearchModalOpen(false);
  };

  const handleCompanyChange = (value: Option | null) => {
    setSelectedCompany(value);
    setFilters((prev) => ({
      ...prev,
      rootCompanyId: value ? String(value.id) : null,
    }));
    setCurrentPage(1);
  };
  const handleDetailClick = (item: CashboxEntry) => {
    setModalMessage(`Ətraflı baxılır: ${item.name}`);
    setIsSuccessModalOpen(true);
  };

  const handleEditClick = (item: CashboxEntry) => {
    setItemToEdit(item);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (item: CashboxEntry) => {
    setItemToDelete(item);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      const response = await cashOperationsService.deleteCashBox(
        String(itemToDelete.id)
      );
      if (response.isSuccess) {
        setIsConfirmModalOpen(false);
        handleRefresh();
      } else {
        setModalMessage(
          response.errorMessage || "Silinmə zamanı xəta baş verdi"
        );
        setIsErrorModalOpen(true);
      }
    } catch (error) {
      toast.error(
        getBackendErrorMessage(error as any) ||
          "Silinmə zamanı xəta baş verdi",
      );
      setIsConfirmModalOpen(false);
      setModalMessage("Serverlə əlaqə zamanı xəta baş verdi");
      setIsErrorModalOpen(true);
    } finally {
      setItemToDelete(null);
    }
  };
  const handleCloseSearchModal = () => setIsSearchModalOpen(false);
  const handleOpenSearchModal = () => setIsSearchModalOpen(true);
  const handleCloseAddModal = () => setIsAddModalOpen(false);
  const handleCloseEditModal = () => setIsEditModalOpen(false);

  return {
    paginatedData,
    totalCount,
    currentPage,
    totalPages,
    selectedRowCount,
    handlePageChange,
    handleRowCountChange,
    isSearchModalOpen,
    isAddModalOpen,
    isEditModalOpen,
    isConfirmModalOpen,
    isSuccessModalOpen,
    isErrorModalOpen,
    modalMessage,
    itemToEdit,
    setIsConfirmModalOpen,
    setIsSuccessModalOpen,
    setIsErrorModalOpen,
    handleConfirmDelete,
    selectedOperation,
    handleRefresh,
    handleOperationChange,
    handleAddNew,
    handleSearch,
    handleDetailClick,
    handleEditClick,
    handleDeleteClick,
    handleOpenSearchModal,
    handleCloseSearchModal,
    handleCloseAddModal,
    handleCloseEditModal,
    isFetching,
    sortColumn,
    sortDirection,
    handleSort,
    selectedCompany,
    companyOptions,
    handleCompanyChange,
    refetchRootCompanies,
    filters,
  };
};
