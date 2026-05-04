import { useState, useEffect } from "react";
import { Loading } from "@/shared/ui";
import { Modal } from "@/shared/ui/modal/base";
import { ConfirmModal } from "@/shared/ui/modal/confirm";
import { useMediaQuery } from "@/shared/lib/hooks/useMediaQuery";
import StaffSearchModal, { type StaffSearchFilters } from "./components/search-modal/StaffSearchModal";
import StaffFormPanel from "./components/form/StaffFormPanel";
import { useStaffTable } from "./hooks/useStaffTable";
import { useTableColumns } from "./utils/useTableColumns";
import { StaffTableHeader } from "./components/header/StaffTableHeader";
import { StaffTableToolbar } from "./components/toolbar/StaffTableToolbar";
import { StaffTable } from "./components/table/StaffTable";
import { StaffTableFooter } from "./components/footer/StaffTableFooter";
import { StaffTableSidebar } from "./components/sidebar/StaffTableSidebar";
import { useGetNodeById, useDeleteNode } from "@/features/kadrlar/staff-table";
import type { NodeEntry } from "@/features/kadrlar/staff-table";
import type { Option } from "@/shared/types";
import { toast } from "react-hot-toast";
import { isAxiosError } from "axios";
import { getBackendErrorMessage } from "@/shared/api";
import styles from "./StaffTablePage.module.css";

export default function StaffTablePage() {
  const {
    state,
    dispatch,
    rootCompaniesOptions,
    isLoadingCompanies,
    loadRootCompanies,
    companiesOptions,
    companiesMap,
    positionMap,
    staffCategoryMap,
    paginatedData,
    totalCount,
    totalPages,
    isLoading,
    isFetching,
    currentPage,
    selectedRowCount,
    handlePageChange,
    handleRowCountChange,
    refetch,
  } = useStaffTable();

  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleCompanyChange = (company: any) => {
    dispatch({ type: "SET_SELECTED_COMPANY", payload: company });
    handlePageChange(1);
  };

  const handleRefresh = () => refetch();
  const handleSearchClick = () => dispatch({ type: "SET_SEARCH_MODAL_OPEN", payload: true });
  const handleOperationChange = (val: any) => dispatch({ type: "SET_SELECTED_OPERATION", payload: val });

  const handleAdvancedSearch = (filters: StaffSearchFilters) => {
    dispatch({ type: "SET_SEARCH_PARAMS", payload: filters });
    handlePageChange(1);
  };

  const handleSort = (accessor: string, direction: "asc" | "desc") => {
    dispatch({ type: "SET_ORDER_BY", payload: accessor });
    dispatch({ type: "SET_IS_DESC", payload: direction === "desc" });
    handlePageChange(1);
  };

  const handleAddNew = () => {
    dispatch({ type: "OPEN_FORM_FOR_CREATE" });
  };

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [lastOpenedNodeId, setLastOpenedNodeId] = useState<string | null>(null);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{ isOpen: boolean; id: string | null }>({
    isOpen: false,
    id: null
  });
  
  const { data: nodeDetail, isLoading: isLoadingNodeDetail } = useGetNodeById(
    selectedNodeId,
    !!selectedNodeId
  );

  useEffect(() => {
    if (nodeDetail && selectedNodeId) {
      dispatch({ type: "OPEN_FORM_FOR_EDIT", payload: nodeDetail });
      setLastOpenedNodeId(selectedNodeId); 
    }
  }, [nodeDetail, selectedNodeId, dispatch]);

  const handleEdit = (row: NodeEntry) => {
    if (lastOpenedNodeId === row.id && nodeDetail) {
      dispatch({ type: "OPEN_FORM_FOR_EDIT", payload: nodeDetail });
      return;
    }
    
    if (selectedNodeId === row.id && isLoadingNodeDetail) {
      return;
    }
    
    setSelectedNodeId(row.id);
  };

  const handleCloseForm = () => {
    dispatch({ type: "CLOSE_FORM" });
  };

  const handleSave = () => {
    dispatch({ type: "CLOSE_FORM" });
    refetch();
  };

  const deleteNodeMutation = useDeleteNode();

  const handleDeleteClick = (row: NodeEntry) => {
    setDeleteConfirmModal({ isOpen: true, id: row.id });
  };

  const handleCancelDelete = () => {
    setDeleteConfirmModal({ isOpen: false, id: null });
  };

  const handleConfirmDelete = async () => {
    if (deleteConfirmModal.id) {
      try {
        await deleteNodeMutation.mutateAsync(deleteConfirmModal.id);
        setDeleteConfirmModal({ isOpen: false, id: null });
        toast.success("Ştat uğurla silindi");
        refetch();
      } catch (error) {
        const message = isAxiosError(error) ? getBackendErrorMessage(error) : (error instanceof Error ? error.message : "Silinmə zamanı xəta baş verdi");
        toast.error(message);
      }
    }
  };

  const columns = useTableColumns({
    companiesMap,
    positionMap,
    staffCategoryMap,
    onEdit: handleEdit,
    onDelete: handleDeleteClick,
  });

  const isCreateMode = !state.selectedItem;
  const shouldShowModal = isCreateMode || isMobile;
  const shouldShowPanel = !isCreateMode && !isMobile;

  const findOptionById = (options: Option[], id: string | null | undefined): Option | null => {
    if (!id) return null;
    return options.find(opt => String(opt.id) === String(id)) || null;
  };

  const formInitialData = state.selectedItem
    ? {
        id: state.selectedItem.id as never,
        employeeId: state.selectedItem.employeeId,
        employee: state.selectedItem.employeeName,
        positionId: state.selectedItem.positionId,
        position:
          state.selectedItem.positionId && state.selectedItem.positionName
            ? { id: state.selectedItem.positionId, fullName: state.selectedItem.positionName, role: "" }
            : null,
        company: findOptionById(companiesOptions, state.selectedItem.rootCompanyId) || findOptionById(rootCompaniesOptions, state.selectedItem.rootCompanyId) || state.selectedCompany,
        department: findOptionById(companiesOptions, state.selectedItem.subCompanyId) || null,
        replacedPerson: state.selectedItem.relatedName ?? null,
        isMain: state.selectedItem.isMain,
        isLeader: state.selectedItem.isHead,
        isActive: state.selectedItem.isActive,
        staffCategoriesCode: state.selectedItem.staffCategoriesCode,
        createdAt: state.selectedItem.createdAt,
        createdBy: state.selectedItem.createdBy,
      }
    : null;

  const formContent = (
    <StaffFormPanel
      key={state.selectedItem ? state.selectedItem.id : "new"}
      mode={state.selectedItem ? "edit" : "create"}
      initialData={formInitialData}
      onCancel={handleCloseForm}
      onSave={handleSave}
      onClose={handleCloseForm}
      showTitle={shouldShowPanel}
    />
  );

  return (
    <div className={styles.container}>
      <StaffTableHeader
        selectedCompany={state.selectedCompany}
        rootCompaniesOptions={rootCompaniesOptions}
        isLoadingCompanies={isLoadingCompanies}
        onCompanyChange={handleCompanyChange}
        onCompanyMenuOpen={loadRootCompanies}
        onAddNew={handleAddNew}
      />

      {(isFetching || isLoading || isLoadingNodeDetail) && <Loading />}

      <div className={styles.contentArea}>
        <div className={styles.leftColumn}>
          <div className={styles.tableWrapper}>
            <StaffTableToolbar
              selectedRowCount={selectedRowCount}
              totalCount={totalCount}
              selectedOperation={state.selectedOperation}
              onRowCountChange={handleRowCountChange}
              onRefresh={handleRefresh}
              onSearch={handleSearchClick}
              onOperationChange={handleOperationChange}
            />

            <StaffTable
              data={paginatedData}
              columns={columns}
              orderBy={state.orderBy}
              isDesc={state.isDesc}
              onSort={handleSort}
            />

            <StaffTableFooter
              selectedRowCount={selectedRowCount}
              totalCount={totalCount}
              currentPage={currentPage}
              totalPages={totalPages}
              onRowCountChange={handleRowCountChange}
              onPageChange={handlePageChange}
            />
          </div>
        </div>

        {!isMobile && (
          <>
            <div className={styles.divider} />
            <StaffTableSidebar
              isFormOpen={state.isFormOpen}
              selectedItem={state.selectedItem}
              selectedCompany={state.selectedCompany}
              rootCompaniesOptions={rootCompaniesOptions}
              companiesOptions={companiesOptions}
              shouldShowPanel={shouldShowPanel}
              onClose={handleCloseForm}
              onSave={handleSave}
              onCancel={handleCloseForm}
            />
          </>
        )}
      </div>

      {shouldShowModal && (
        <Modal
          isOpen={state.isFormOpen}
          onClose={handleCloseForm}
          title={state.selectedItem ? "Ştat Vahidinə Düzəliş" : "Yeni Ştat Vahidi"}
          size="sm"
        >
          {formContent}
        </Modal>
      )}

      <StaffSearchModal
        isOpen={state.isSearchModalOpen}
        onClose={() => dispatch({ type: "SET_SEARCH_MODAL_OPEN", payload: false })}
        onSearch={handleAdvancedSearch}
        companiesOptions={companiesOptions}
      />

      {/* DELETE CONFIRMATION */}
      <ConfirmModal
        isOpen={deleteConfirmModal.isOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Ştatı sil"
        message="Bu ştatı silmək istədiyinizə əminsiniz? Bu əməliyyat geri alına bilməz."
        confirmText="Sil"
        cancelText="Ləğv et"
        isLoading={deleteNodeMutation.isPending}
      />
    </div>
  );
}
