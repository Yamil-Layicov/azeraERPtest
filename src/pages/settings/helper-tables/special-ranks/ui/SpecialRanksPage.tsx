import { useState } from "react";
import toast from "react-hot-toast";
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
import styles from "./SpecialRanksPage.module.css";
import { useSpecialRanksPage } from "../model/useSpecialRanksPage";
import { SpecialRanksPanel } from "./components/special-ranks-panel/SpecialRanksPanel";
import { CreateSpecialRankModal } from "./components/create-modal/CreateSpecialRankModal";
import { operationOptions } from "@/shared/config/tableOptions";
import { useExcelExport } from "@/shared/lib/hooks/useExcelExport";
import { useEnumItemsByCode } from "@/features/lookups";
import type { Option } from "@/shared/types";
import type { SpecialRank } from "@/features/settings/special-ranks";

export function SpecialRanksPage() {
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
    selectedSpecialRank,
    specialRankDetail,
    isLoadingSpecialRankDetail,
    handleClosePanel,
    handleUpdateSpecialRank,
    isUpdatingSpecialRank,
    isCreateModalOpen,
    handleCreate,
    handleCloseCreateModal,
    handleSaveNewSpecialRank,
    isCreatingSpecialRank,
    deleteConfirmModal,
    handleCancelDelete,
    handleConfirmDelete,
    isDeletingSpecialRank,
    handleRefresh,
    handleSetActive,
    isSettingActive,
  } = useSpecialRanksPage();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { exportToExcel } = useExcelExport<SpecialRank>();
  const { options: organOptions } = useEnumItemsByCode("Organs", true);

  const handleOperationChange = (value: Option | null) => {
    if (value?.id === "export_excel") {
      if (data.length === 0) {
        toast.error("İxrac etmək üçün məlumat yoxdur");
        setSelectedOperation(null);
        return;
      }

      exportToExcel({
        data: data,
        columns: [
          { header: "Sıra №", accessor: "sortOrder" },
          { 
            header: "Orqan", 
            accessor: "organCode",
            render: (item) => {
              const matched = organOptions.find(
                (opt) => String(opt.id) === String(item.organCode)
              );
              return matched ? matched.fullName : item.organCode || "-";
            }
          },
          { header: "Ad", accessor: "name" },
          {
            header: "Status",
            accessor: "isActive",
            render: (item) => (item.isActive ? "Aktiv" : "Qeyri-aktiv"),
          },
        ],
        fileName: "xususi-rutbeler",
        sheetName: "Xüsusi rütbələr",
      });
      setSelectedOperation(null);
      return;
    }
    setSelectedOperation(value);
  };

  const isEditOrDetailMode =
    activePanelMode === "edit" || activePanelMode === "detail";
  const shouldShowPanel = isEditOrDetailMode && !isMobile;
  const shouldShowModal = isEditOrDetailMode && isMobile;

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
    <SpecialRanksPanel
      key={selectedSpecialRank?.id || "panel"}
      mode={activePanelMode}
      specialRankDetail={specialRankDetail}
      isLoadingSpecialRankDetail={isLoadingSpecialRankDetail}
      onClose={handleClosePanel}
      onSave={handleUpdateSpecialRank}
      onSetActive={handleSetActive}
      isLoading={isUpdatingSpecialRank}
      isSettingActive={isSettingActive}
      title={shouldShowPanel ? "Xüsusi Rütbə Məlumatları" : ""}
      isModal={shouldShowModal}
    />
  );

  return (
    <div className={styles.container}>
      <PageHeader
        title="Xüsusi rütbələr"
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
              operationOptions={operationOptions}
              selectedOperation={selectedOperation}
              onOperationChange={handleOperationChange}
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

      <CreateSpecialRankModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSave={handleSaveNewSpecialRank}
        isLoading={isCreatingSpecialRank}
      />

      {shouldShowModal && (
        <Modal
          isOpen={true}
          onClose={handleClosePanel}
          title="Xüsusi Rütbə Məlumatları"
          size="md"
        >
          {panelContent}
        </Modal>
      )}

      <ConfirmModal
        isOpen={deleteConfirmModal.isOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Xüsusi rütbəni sil"
        message="Bu xüsusi rütbəni silmək istədiyinizə əminsiniz? Bu əməliyyat geri alına bilməz."
        confirmText="Sil"
        cancelText="Ləğv et"
        isLoading={isDeletingSpecialRank}
      />
    </div>
  );
}
