import { useState } from "react";
import {
  Button,
  PageHeader,
  Table,
  TableToolbar,
  TableControls,
  Pagination,
  TableActionGroup,
  FormInput,
} from "@/shared/ui";
import { ContentLoading } from "@/shared/ui/loading";
import { ConfirmModal } from "@/shared/ui/modal/confirm";
import { Modal } from "@/shared/ui/modal/base";
import { useMediaQuery } from "@/shared/lib/hooks/useMediaQuery";
import styles from "./RolesPage.module.css";
import { useRolesPage } from "../model/useRolesPage";
import { RolesPanel } from "./components/roles-panel/RolesPanel";
import { CreateRoleModal } from "./components/create-modal/CreateRoleModal";
import { operationOptions } from "@/shared/config/tableOptions";

export default function RolesPage() {
  const {
    data,
    totalCount,
    isLoading,
    isError,
    columns,
    currentPage,
    setCurrentPage,
    selectedRowCount,
    setSelectedRowCount,
    selectedOperation,
    setSelectedOperation,
    searchName,
    setSearchName,
    activePanelMode,
    selectedRole,
    roleDetail,
    isLoadingRoleDetail,
    handleClosePanel,
    handleUpdateRole,
    isUpdatingRole,
    handleCreate,
    isCreateModalOpen,
    handleCloseCreateModal,
    handleSaveNewRole,
    isCreatingRole,
    deleteConfirmModal,
    handleCancelDelete,
    handleConfirmDelete,
    isDeletingRole,
    handleRefresh,
  } = useRolesPage();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // --- MƏNTİQ DƏYİŞİKLİKLƏRİ ---
  
  const isEditOrDetailMode = activePanelMode === 'edit' || activePanelMode === 'detail';
  const shouldShowPanel = isEditOrDetailMode && !isMobile;
  const shouldShowModal = isEditOrDetailMode && isMobile;

  // 1. INPUTU BURADA (RETURN-DƏN ƏVVƏL) TƏYİN EDİRİK
  const searchInput = (
    <div className={styles.searchWrapper}>
      <FormInput
        label=""
        id="search"
        type="text"
        value={searchName}
        onChange={(val) => setSearchName(val)}
        placeholder="Axtarış..."
        className={styles.searchInput}
        autoComplete="off"
      />
    </div>
  );

  const panelContent = (
    <RolesPanel
      key={selectedRole?.id || 'panel'}
      mode={activePanelMode}
      selectedRole={selectedRole}
      roleDetail={roleDetail}
      isLoadingRoleDetail={isLoadingRoleDetail}
      onClose={handleClosePanel}
      onSave={handleUpdateRole}
      isLoading={isUpdatingRole}
      title={shouldShowPanel ? "Rol Məlumatları" : ""}
      isModal={shouldShowModal}
    />
  );

  return (
    <div className={styles.container}>
      <PageHeader
        title="Rollar"
        children={
          <Button
            className={styles.addButton}
            variant="primary"
            onClick={handleCreate}
          >
            + Yeni
          </Button>
        }
      />

      <div className={styles.contentWrapper}>
        <div className={styles.leftPanel}>
          <TableToolbar className={styles.tableToolbar}>
            <TableControls
              selectedRowCount={selectedRowCount}
              onRowCountChange={setSelectedRowCount}
              totalCount={totalCount}
            />

            <TableActionGroup
              onRefresh={() => {
                handleRefresh();
                setIsSearchOpen(false);
              }}
              onSearch={() => setIsSearchOpen((prev) => !prev)}
              
              searchLeftSlot={!isMobile ? searchInput : null}
              
              isSearchLeftSlotOpen={isSearchOpen}
              operationOptions={operationOptions}
              selectedOperation={selectedOperation}
              onOperationChange={setSelectedOperation}
            />
          </TableToolbar>

          {/* 3. MOBİL ÜÇÜN: Əgər mobildirsə və axtarış açıqdırsa, inputu aşağıda göstəririk */}
          {isMobile && isSearchOpen && (
            <div className={styles.mobileSearchRow}>
              {searchInput}
            </div>
          )}

          <div className={styles.tableWrapper}>
            {isLoading ? (
              <ContentLoading />
            ) : isError ? (
              <div className={styles.emptyState}>
                <p>Xəta baş verdi</p>
              </div>
            ) : (
              <Table data={data} columns={columns} />
            )}
          </div>

          <TableToolbar>
            <TableControls
              selectedRowCount={selectedRowCount}
              onRowCountChange={setSelectedRowCount}
              totalCount={totalCount}
            />
          </TableToolbar>

          <div className={styles.pagination}>
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(
                totalCount / (Number(selectedRowCount?.id) || 10)
              )}
              onPageChange={setCurrentPage}
              showFirstLast={true}
            />
          </div>
        </div>

        {!isMobile && (
          <div className={styles.rightPanel}>
            {shouldShowPanel ? (
              panelContent
            ) : (
              <div className={styles.emptyState}>
                <p>
                  Əməliyyat aparmaq üçün <br /> sol tərəfdən seçim edin
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <CreateRoleModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSave={handleSaveNewRole}
        isLoading={isCreatingRole}
      />

      {shouldShowModal && (
        <Modal
          isOpen={true}
          onClose={handleClosePanel}
          title="Rol Məlumatları"
          size="md"
        >
          {panelContent}
        </Modal>
      )}

      <ConfirmModal
        isOpen={deleteConfirmModal.isOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Rolu sil"
        message="Bu rolu silmək istədiyinizə əminsiniz? Bu əməliyyat geri alına bilməz."
        confirmText="Sil"
        cancelText="Ləğv et"
        isLoading={isDeletingRole}
      />
    </div>
  );
}