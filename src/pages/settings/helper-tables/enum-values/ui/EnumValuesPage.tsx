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
import { Modal } from "@/shared/ui/modal/base";
import { ConfirmModal } from "@/shared/ui/modal/confirm";
import { useMediaQuery } from "@/shared/lib/hooks/useMediaQuery";
import styles from "./EnumValuesPage.module.css";
import { useEnumValuesPage } from "../model/useEnumValuesPage";
import { EnumItemDetailPanel } from "./components/enum-item-panel/EnumItemDetailPanel";
import { CreateEnumItemModal } from "./components/create-modal/CreateEnumItemModal";

export function EnumValuesPage() {
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
    searchName,
    setSearchName,
    enumTypeName,
    handleRefresh,
    handleBack,
    activePanelMode,
    enumItemDetail,
    isLoadingEnumItemDetail,
    handleClosePanel,
    handleUpdateEnumItem,
    isUpdatingEnumItem,
    handleSetActiveEnumItem,
    isSettingActiveEnumItem,
    deleteConfirmModal,
    handleCancelDelete,
    handleConfirmDelete,
    isDeletingEnumItem,
    isCreateModalOpen,
    handleCreate,
    handleCloseCreateModal,
    handleSaveNewEnumItem,
    isCreatingEnumItem,
  } = useEnumValuesPage();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const shouldShowPanel = activePanelMode === "detail" && !isMobile;
  const shouldShowModal = activePanelMode === "detail" && isMobile;

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

  return (
    <div className={styles.container}>
      <PageHeader
        title={enumTypeName ? `${enumTypeName} - Dəyərlər` : "Enum Dəyərləri"}
        className={styles.pageHeader}
        children={
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Button
              className={styles.addButton}
              variant="primary"
              onClick={handleCreate}
            >
              + Yeni
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleBack}
              className={styles.backButton}
            >
              Geri
            </Button>
          </div>
        }
      />

      <div className={styles.contentWrapper}>
        <div className={styles.leftPanel}>
          <TableToolbar>
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
            />
          </TableToolbar>

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
              isLoadingEnumItemDetail ? (
                <ContentLoading />
              ) : enumItemDetail ? (
                <EnumItemDetailPanel
                  key={enumItemDetail.id}
                  enumItemDetail={enumItemDetail}
                  onClose={handleClosePanel}
                  onSave={handleUpdateEnumItem}
                  onSetActive={handleSetActiveEnumItem}
                  isLoading={isUpdatingEnumItem}
                  isSettingActive={isSettingActiveEnumItem}
                  title="Enum Dəyər Məlumatları"
                />
              ) : (
                <div className={styles.emptyState}>
                  <p>Detallar yüklənir...</p>
                </div>
              )
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

      {shouldShowModal && (
        <Modal
          isOpen={true}
          onClose={handleClosePanel}
          title="Enum Dəyər Məlumatları"
          size="md"
        >
          {isLoadingEnumItemDetail ? (
            <ContentLoading />
          ) : enumItemDetail ? (
            <EnumItemDetailPanel
              key={enumItemDetail.id}
              enumItemDetail={enumItemDetail}
              onClose={handleClosePanel}
              onSave={handleUpdateEnumItem}
              onSetActive={handleSetActiveEnumItem}
              isLoading={isUpdatingEnumItem}
              isSettingActive={isSettingActiveEnumItem}
              isModal
            />
          ) : (
            <div style={{ padding: "2rem", textAlign: "center" }}>
              <p>Detallar yüklənir...</p>
            </div>
          )}
        </Modal>
      )}

      <ConfirmModal
        isOpen={deleteConfirmModal.isOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Enum dəyərini sil"
        message="Bu enum dəyərini silmək istədiyinizə əminsiniz? Bu əməliyyat geri alına bilməz."
        confirmText="Sil"
        cancelText="Ləğv et"
        isLoading={isDeletingEnumItem}
      />

      <CreateEnumItemModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSave={handleSaveNewEnumItem}
        isLoading={isCreatingEnumItem}
      />
    </div>
  );
}
