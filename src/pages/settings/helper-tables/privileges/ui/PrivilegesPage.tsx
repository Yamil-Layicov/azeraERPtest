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
import styles from "./PrivilegesPage.module.css";
import { usePrivilegesPage } from "../model/usePrivilegesPage";
import { PrivilegesPanel } from "./components/privileges-panel/PrivilegesPanel";
import { CreatePrivilegeModal } from "./components/create-modal/CreatePrivilegeModal";
import { operationOptions } from "@/shared/config/tableOptions";
import { useExcelExport } from "@/shared/lib/hooks/useExcelExport";
import { useEnumItemsByCode } from "@/features/lookups";
import type { Option } from "@/shared/types";
import type { Privilege } from "@/features/settings/privileges";

export function PrivilegesPage() {
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
    selectedPrivilege,
    privilegeDetail,
    isLoadingPrivilegeDetail,
    handleClosePanel,
    handleUpdatePrivilege,
    isUpdatingPrivilege,
    isCreateModalOpen,
    handleCreate,
    handleCloseCreateModal,
    handleSaveNewPrivilege,
    isCreatingPrivilege,
    deleteConfirmModal,
    handleCancelDelete,
    handleConfirmDelete,
    isDeletingPrivilege,
    handleRefresh,
    handleSetActive,
    isSettingActive,
  } = usePrivilegesPage();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { exportToExcel } = useExcelExport<Privilege>();
  const { options: legalBasisOptions } = useEnumItemsByCode("LegalBasis", true);

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
          { header: "Ad", accessor: "name" },
          { 
            header: "Hüquqi Əsas", 
            accessor: "legalBasisCode",
            render: (item) => {
              const matched = legalBasisOptions.find(
                (opt) => String(opt.id) === String(item.legalBasisCode)
              );
              return matched ? matched.fullName : item.legalBasisCode || "-";
            }
          },
          { header: "Əlavə Məzuniyyət", accessor: "extraVacation" },
          {
            header: "Status",
            accessor: "isActive",
            render: (item) => (item.isActive ? "Aktiv" : "Qeyri-aktiv"),
          },
        ],
        fileName: "imtiyazlar",
        sheetName: "İmtiyazlar",
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
    <PrivilegesPanel
      key={selectedPrivilege?.id || "panel"}
      mode={activePanelMode}
      privilegeDetail={privilegeDetail}
      isLoadingPrivilegeDetail={isLoadingPrivilegeDetail}
      onClose={handleClosePanel}
      onSave={handleUpdatePrivilege}
      onSetActive={handleSetActive}
      isLoading={isUpdatingPrivilege}
      isSettingActive={isSettingActive}
      title={shouldShowPanel ? "İmtiyaz Məlumatları" : ""}
      isModal={shouldShowModal}
    />
  );

  return (
    <div className={styles.container}>
      <PageHeader
        title="İmtiyazlar"
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

      <CreatePrivilegeModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSave={handleSaveNewPrivilege}
        isLoading={isCreatingPrivilege}
      />

      {shouldShowModal && (
        <Modal
          isOpen={true}
          onClose={handleClosePanel}
          title="İmtiyaz Məlumatları"
          size="md"
        >
          {panelContent}
        </Modal>
      )}

      <ConfirmModal
        isOpen={deleteConfirmModal.isOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="İmtiyazı sil"
        message="Bu imtiyazı silmək istədiyinizə əminsiniz? Bu əməliyyat geri alına bilməz."
        confirmText="Sil"
        cancelText="Ləğv et"
        isLoading={isDeletingPrivilege}
      />
    </div>
  );
}
