import styles from "./KassaPage.module.css";
import {
  Button,
  Table,
  Pagination,
  TableActionGroup,
  TableControls,
  PageHeader,
  TableToolbar,
  ConfirmModal,
  SuccessModal,
  ErrorModal,
  CustomSelect,
} from "@/shared/ui";
import {
  CashboxSearchModal,
  AddCashboxModal,
  EditCashboxModal,
} from "@/shared/ui/cashbox-modals";
import { operationOptions } from "@/shared/config/tableOptions";
import { useKassaColumns } from "../model/useKassaColumns";
import { useKassaPage } from "../model/useKassaPage";
import { BuildingOfficeIcon } from "@heroicons/react/24/outline";

function KassaPage() {
  const {
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
    handleDeleteClick,
    handleEditClick,
    handleOpenSearchModal,
    handleCloseSearchModal,
    handleCloseAddModal,
    handleCloseEditModal,
    sortColumn,
    sortDirection,
    handleSort,
    selectedCompany,
    companyOptions,
    handleCompanyChange,
    refetchRootCompanies,
    filters,
  } = useKassaPage();

  const columns = useKassaColumns({
    currentPage,
    selectedRowCount,
    onDetail: handleDetailClick,
    onDelete: handleDeleteClick,
    onEdit: handleEditClick,
    showDetail: false, 
  });

  return (
    <div className={styles.pageContainer}>
      <PageHeader title="Kassalar" className={styles.headerContainer}>
        <CustomSelect
          id="header-company"
          options={companyOptions}
          value={selectedCompany}
          onChange={handleCompanyChange}
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
      </PageHeader>

      <TableToolbar>
        <TableControls
          selectedRowCount={selectedRowCount}
          onRowCountChange={handleRowCountChange}
          totalCount={totalCount}
        />

        <TableActionGroup
          onRefresh={handleRefresh}
          onSearch={handleOpenSearchModal}
          onOperationChange={handleOperationChange}
          operationOptions={operationOptions}
          selectedOperation={selectedOperation}
        />
      </TableToolbar>

      <Table
        data={paginatedData}
        columns={columns}
        onSort={handleSort}
        sortColumn={sortColumn ?? undefined}
        sortDirection={sortDirection}
      />

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

      <CashboxSearchModal
        isOpen={isSearchModalOpen}
        onClose={handleCloseSearchModal}
        onSearch={handleSearch}
        rootCompanyId={filters.rootCompanyId}
      />

      <AddCashboxModal isOpen={isAddModalOpen} onClose={handleCloseAddModal} />

      <EditCashboxModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSubmit={handleRefresh}
        cashboxId={itemToEdit?.id?.toString()}
      />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Kassanı sil"
        message="Bu kassanı silmək istədiyinizə əminsiniz?"
        confirmText="Sil"
        cancelText="Ləğv et"
      />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        text={modalMessage}
      />

      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        text={modalMessage}
      />
    </div>
  );
}

export default KassaPage;
