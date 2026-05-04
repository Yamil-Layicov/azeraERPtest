import { useState, useMemo } from "react";
import toast from "react-hot-toast";
import styles from "./PositionsPage.module.css";
import { Button } from "@/shared/ui/button";
import { Table } from "@/shared/ui/table";
import { Pagination } from "@/shared/ui/pagination";
import {
  TableControls,
  TableActionGroup,
  PageHeader,
  TableToolbar,
} from "@/shared/ui";
import {
  operationOptions,
  rowCountOptions,
} from "@/shared/config/tableOptions";
import type { Option } from "@/shared/types";
import PositionsFormPanel from "./components/form-panel/PositionsFormPanel";
import PositionSearchModal, {
  type PositionSearchFormData,
} from "./components/search-modal/PositionSearchModal";
import { usePositionsColumns } from "../model/usePositionsColumns";
import {
  usePositions,
  useCreatePosition,
  useGetPositionById,
  useUpdatePosition,
  useDeletePosition,
  type PositionEntry,
} from "@/features/kadrlar/positions";
import { Modal } from "@/shared/ui/modal/base";
import { ConfirmModal } from "@/shared/ui/modal/confirm";
import { Loading } from "@/shared/ui/loading";
import { useMediaQuery } from "@/shared/lib/hooks/useMediaQuery";
import { useExcelExport } from "@/shared/lib/hooks/useExcelExport";

export default function PositionsPage() {
  // --- 1. SEARCH & PAGINATION STATE ---
  const [requestParams, setRequestParams] = useState({
    pageSize: 10,
    pageIndex: 0,
    isDesc: false,
    orderBy: "sortOrder" as string | null,
    name: null as string | null,
    isActive: null as boolean | null,
  });
  const { exportToExcel } = useExcelExport<PositionEntry>();

  // --- 2. MAIN DATA FETCHING ---
  const { data, isLoading, isFetching, isError, refetch } =
    usePositions(requestParams);

  // Mutations
  const { mutate: createPosition, isPending: isCreating } = useCreatePosition();
  const { mutate: updatePosition, isPending: isUpdating } = useUpdatePosition();
  const { mutate: deletePosition, isPending: isDeleting } = useDeletePosition();

  // --- 3. UI STATE MANAGEMENT (SIMPLIFIED) ---
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Form State (Həm Create, həm Edit üçün vahid)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPositionId, setSelectedPositionId] = useState<string | null>(
    null,
  );

  // Search Modal & Confirm Modal States
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{
    isOpen: boolean;
    positionId: string | null;
  }>({
    isOpen: false,
    positionId: null,
  });

  const [searchFormData, setSearchFormData] = useState<PositionSearchFormData>({
    positionName: "",
    status: null,
  });
  const [selectedOperation, setSelectedOperation] = useState<Option | null>(
    null,
  );

  const { data: positionData, isLoading: isLoadingPosition } =
    useGetPositionById(selectedPositionId, !!selectedPositionId && isFormOpen);

  // --- 5. DATA PREPARATION ---
  const totalCount = data?.result?.totalCount || 0;
  const currentPage = requestParams.pageIndex + 1;
  const totalPages = Math.ceil(totalCount / requestParams.pageSize);

  const paginatedData = useMemo(() => {
    return data?.result?.data || [];
  }, [data]);

  const formInitialData = useMemo(() => {
    if (!selectedPositionId) return null;

    if (positionData && positionData.name !== undefined) {
      return {
        name: positionData.name || "",
        isActive: positionData.isActive ?? true,
        sortOrder: positionData.sortOrder ?? 0,
        createdAt: positionData.createdAt,
        createdBy: positionData.createdBy,
      };
    }
    return null;
  }, [selectedPositionId, positionData]);


  const handleAddNew = () => {
    setSelectedPositionId(null);
    setIsFormOpen(true);
  };

  const handleEdit = (item: PositionEntry) => {
    setSelectedPositionId(item.id);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedPositionId(null);
  };

  const handleSave = (formData: {
    name: string;
    isActive: boolean;
    sortOrder: number;
  }) => {
    if (selectedPositionId) {
      updatePosition(
        {
          id: selectedPositionId,
          name: formData.name,
          isActive: formData.isActive,
          sortOrder: formData.sortOrder,
        },
        {
          onSuccess: () => {
            handleCloseForm();
          },
        },
      );
    } else {
      createPosition(
        {
          name: formData.name,
          isActive: formData.isActive,
          sortOrder: formData.sortOrder,
        },
        {
          onSuccess: () => {
            handleCloseForm();
          },
        },
      );
    }
  };

  const handleDelete = (id: string) => {
    setDeleteConfirmModal({ isOpen: true, positionId: id });
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmModal.positionId) {
      deletePosition(deleteConfirmModal.positionId, {
        onSuccess: (data) => {
          if (data && (data as { isSuccess?: boolean }).isSuccess === false)
            return;
          setDeleteConfirmModal({ isOpen: false, positionId: null });
          if (selectedPositionId === deleteConfirmModal.positionId) {
            handleCloseForm();
          }
        },
      });
    }
  };

  const handlePageChange = (page: number) => {
    setRequestParams((prev) => ({ ...prev, pageIndex: page - 1 }));
  };

  const selectedRowCount: Option | null = useMemo(() => {
    const found = rowCountOptions.find(
      (opt) => Number(opt.id) === requestParams.pageSize,
    );
    return found ?? rowCountOptions[0] ?? null;
  }, [requestParams.pageSize]);

  const handleRowCountChange = (option: Option | null) => {
    if (option) {
      const pageSize = Number(option.id);
      setRequestParams((prev) => ({ ...prev, pageSize, pageIndex: 0 }));
    }
  };

  const handleRefresh = () => refetch();

  const handleSort = (accessor: string, direction: "asc" | "desc") => {
    setRequestParams((prev) => ({
      ...prev,
      orderBy: accessor,
      isDesc: direction === "desc",
      pageIndex: 0,
    }));
  };

  const handleSearchClick = () => setIsSearchModalOpen(true);

  const handleSearch = (data: PositionSearchFormData) => {
    setSearchFormData(data);
    setRequestParams((prev) => ({
      ...prev,
      pageIndex: 0,
      name: data.positionName.trim() || null,
      isActive: data.status
        ? data.status.id === "active"
          ? true
          : data.status.id === "inactive"
            ? false
            : null
        : null,
    }));
  };

  const handleClearSearch = () => {
    setSearchFormData({ positionName: "", status: null });
    setRequestParams((prev) => ({
      ...prev,
      pageIndex: 0,
      name: null,
      isActive: null,
    }));
  };

  const columns = usePositionsColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
    disabled: isFetching || isLoading,
  });

  const handleOperationChange = (value: Option | null) => {
    if (value?.id === "export_excel") {
      if (paginatedData.length === 0) {
        toast.error("İxrac etmək üçün məlumat yoxdur");
        setSelectedOperation(null);
        return;
      }

      exportToExcel({
        data: paginatedData,
        columns: [
          { header: "Vəzifə Adı", accessor: "name" },

          {
            header: "Status",
            accessor: "isActive",
            render: (item) => (item.isActive ? "Aktiv" : "Qeyri-aktiv"),
          },
        ],
        fileName: "positions.xlsx",
        sheetName: "Vəzifələr",
      });
      setSelectedOperation(null);
      return;
    }
    setSelectedOperation(value);
  };

  if (isError) {
    return <div>Xəta baş verdi</div>;
  }

  const isCreateMode = !selectedPositionId;
  const shouldShowModal = isCreateMode || isMobile;
  const shouldShowPanel = !isCreateMode && !isMobile;

  const formContent = (
    <PositionsFormPanel
      key={selectedPositionId || "create-new"}
      title={shouldShowPanel ? "Vəzifə Məlumatları" : ""}
      onClose={handleCloseForm}
      onSave={handleSave}
      initialData={formInitialData}
      isPending={isUpdating || isCreating}
      isLoadingDetail={isLoadingPosition}
      isEditMode={!!selectedPositionId}
      isOpen={isFormOpen}
    />
  );

  return (
    <div className={styles.container}>
      <PageHeader title="Vəzifələr">
        <Button
          className={styles.addButton}
          type="button"
          variant="primary"
          onClick={handleAddNew}
          disabled={isFetching || isLoading}
        >
          + Yeni
        </Button>
      </PageHeader>

      {(isFetching || isLoading) && <Loading />}

      <div className={styles.contentArea}>
        <div className={styles.tableWrapper}>
          <div className={styles.topBar}>
            <div className={styles.leftBar} style={{ width: "100%" }}>
              <div className={styles.controlsGroup}>
                <TableControls
                  selectedRowCount={selectedRowCount}
                  onRowCountChange={handleRowCountChange}
                  totalCount={totalCount}
                  disabled={isFetching || isLoading}
                />
              </div>

              <div className={styles.actionsGroup}>
                <TableActionGroup
                  onRefresh={handleRefresh}
                  onSearch={handleSearchClick}
                  onOperationChange={handleOperationChange}
                  operationOptions={operationOptions}
                  selectedOperation={selectedOperation}
                  disabled={isFetching || isLoading}
                />
              </div>
            </div>
          </div>

          <Table
            data={paginatedData}
            columns={columns}
            onSort={handleSort}
            sortColumn={requestParams.orderBy}
            sortDirection={requestParams.isDesc ? "desc" : "asc"}
          />

          <div className={styles.footer}>
            <div className={styles.footerRowCount}>
              <TableToolbar>
                <TableControls
                  selectedRowCount={selectedRowCount}
                  onRowCountChange={handleRowCountChange}
                  totalCount={totalCount}
                  disabled={isFetching || isLoading}
                />
              </TableToolbar>
            </div>

            <div className={styles.paginationWrapper}>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                showFirstLast={true}
                maxVisiblePages={5}
                disabled={isFetching || isLoading}
              />
            </div>
          </div>
        </div>

        {!isMobile && (
          <>
            <div className={styles.divider}></div>
            <div className={styles.sidePanelWrapper}>
              {shouldShowPanel && isFormOpen ? (
                formContent
              ) : (
                <div className={styles.emptyState}>
                  <p>
                    Əməliyyat aparmaq üçün <br />
                    sol tərəfdən seçim edin
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {shouldShowModal && (
        <Modal
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          title={
            selectedPositionId ? "Vəzifəni Redaktə Et" : "Yeni Vəzifə Əlavə Et"
          }
          size="sm"
        >
          {formContent}
        </Modal>
      )}

      <PositionSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSearch={handleSearch}
        onClear={handleClearSearch}
        initialData={searchFormData}
        onChange={setSearchFormData}
      />

      <ConfirmModal
        isOpen={deleteConfirmModal.isOpen}
        onClose={() =>
          setDeleteConfirmModal({ isOpen: false, positionId: null })
        }
        onConfirm={handleConfirmDelete}
        title="Vəzifəni sil"
        message="Bu vəzifəni silmək istədiyinizə əminsiniz? Bu əməliyyat geri alına bilməz."
        confirmText="Sil"
        cancelText="Ləğv et"
        isLoading={isDeleting}
      />
    </div>
  );
}
