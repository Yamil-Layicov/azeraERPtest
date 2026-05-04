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
import styles from "./StateAwardsPage.module.css";
import { useStateAwardsPage } from "../model/useStateAwardsPage";
import { StateAwardsPanel } from "./components/state-awards-panel/StateAwardsPanel";
import { CreateStateAwardModal } from "./components/create-modal/CreateStateAwardModal";
import { operationOptions } from "@/shared/config/tableOptions";
import { useExcelExport } from "@/shared/lib/hooks/useExcelExport";
import { useEnumItemsByCode } from "@/features/lookups";
import type { Option } from "@/shared/types";
import type { StateAward } from "@/features/settings/state-awards";

export function StateAwardsPage() {
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
    selectedStateAward,
    stateAwardDetail,
    isLoadingStateAwardDetail,
    handleClosePanel,
    handleUpdateStateAward,
    isUpdatingStateAward,
    isCreateModalOpen,
    handleCreate,
    handleCloseCreateModal,
    handleSaveNewStateAward,
    isCreatingStateAward,
    deleteConfirmModal,
    handleCancelDelete,
    handleConfirmDelete,
    isDeletingStateAward,
    handleRefresh,
    handleSetActive,
    isSettingActive,
  } = useStateAwardsPage();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { exportToExcel } = useExcelExport<StateAward>();
  const { options: stateAwardTypeOptions } = useEnumItemsByCode("StateAwardTypes", true);

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
            header: "Mükafat növü", 
            accessor: "typeCode",
            render: (item) => {
              const matched = stateAwardTypeOptions.find(
                (opt) => String(opt.id) === String(item.typeCode)
              );
              return matched ? matched.fullName : item.typeCode || "-";
            }
          },
          { header: "Ad", accessor: "name" },
          {
            header: "Status",
            accessor: "isActive",
            render: (item) => (item.isActive ? "Aktiv" : "Qeyri-aktiv"),
          },
        ],
        fileName: "dovlet-teltifleri",
        sheetName: "Dövlət təltifləri",
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
    <StateAwardsPanel
      key={selectedStateAward?.id || "panel"}
      mode={activePanelMode}
      stateAwardDetail={stateAwardDetail}
      isLoadingStateAwardDetail={isLoadingStateAwardDetail}
      onClose={handleClosePanel}
      onSave={handleUpdateStateAward}
      onSetActive={handleSetActive}
      isLoading={isUpdatingStateAward}
      isSettingActive={isSettingActive}
      title={shouldShowPanel ? "Dövlət Mükafatı Məlumatları" : ""}
      isModal={shouldShowModal}
    />
  );

  return (
    <div className={styles.container}>
      <PageHeader
        title="Dövlət təltifləri"
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

      <CreateStateAwardModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSave={handleSaveNewStateAward}
        isLoading={isCreatingStateAward}
      />

      {shouldShowModal && (
        <Modal
          isOpen={true}
          onClose={handleClosePanel}
          title="Dövlət Mükafatı Məlumatları"
          size="md"
        >
          {panelContent}
        </Modal>
      )}

      <ConfirmModal
        isOpen={deleteConfirmModal.isOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Dövlət mükafatını sil"
        message="Bu dövlət mükafatını silmək istədiyinizə əminsiniz? Bu əməliyyat geri alına bilməz."
        confirmText="Sil"
        cancelText="Ləğv et"
        isLoading={isDeletingStateAward}
      />
    </div>
  );
}
