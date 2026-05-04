import { useState } from "react";
import toast from "react-hot-toast";
import {
  PageHeader,
  Table,
  TableToolbar,
  TableControls,
  Pagination,
  TableActionGroup,
  FormInput,
  Button,
} from "@/shared/ui";
import { ContentLoading } from "@/shared/ui/loading";
import { Modal } from "@/shared/ui/modal/base";
import { ConfirmModal } from "@/shared/ui/modal/confirm";
import { useMediaQuery } from "@/shared/lib/hooks/useMediaQuery";
import styles from "./EnumTypesPage.module.css";
import { useEnumTypesPage } from "../model/useEnumTypesPage";
import { EnumTypeDetailPanel } from "./components/enum-type-panel/EnumTypeDetailPanel";
import { CreateEnumTypeModal } from "./components/create-modal/CreateEnumTypeModal";
import { operationOptions } from "@/shared/config/tableOptions";
import { useExcelExport } from "@/shared/lib/hooks/useExcelExport";
import type { Option } from "@/shared/types";
import type { EnumType } from "../model/types";

export function EnumTypesPage() {
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
    enumTypeDetail,
    isLoadingEnumTypeDetail,
    handleClosePanel,
    handleRefresh,
    deleteConfirmModal,
    handleCancelDelete,
    handleConfirmDelete,
    isDeletingEnumType,
    isCreateModalOpen,
    handleCreate,
    handleCloseCreateModal,
    handleSaveNewEnumType,
    isCreatingEnumType,
    handleUpdateEnumType,
    isUpdatingEnumType,
  } = useEnumTypesPage();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { exportToExcel } = useExcelExport<EnumType>();

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
          { header: "Kod", accessor: "code" },
          { header: "Ad", accessor: "displayName" },
          { header: "Təsvir", accessor: "description" },
          
        ],
        fileName: "enum-tipleri",
        sheetName: "Enum tipləri",
      });
      setSelectedOperation(null);
      return;
    }
    setSelectedOperation(value);
  };

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
        title="Enum tipləri"
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
            <div className={styles.mobileSearchRow}>{searchInput}</div>
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
                totalCount / (Number(selectedRowCount?.id) || 10),
              )}
              onPageChange={setCurrentPage}
              showFirstLast={true}
            />
          </div>
        </div>

        {!isMobile && (
          <div className={styles.rightPanel}>
            {shouldShowPanel ? (
              isLoadingEnumTypeDetail ? (
                <ContentLoading />
              ) : enumTypeDetail ? (
                <EnumTypeDetailPanel
                  key={enumTypeDetail.id}
                  enumTypeDetail={enumTypeDetail}
                  onClose={handleClosePanel}
                  onSave={handleUpdateEnumType}
                  isLoading={isUpdatingEnumType}
                  title="Enum Tip Məlumatları"
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
          title="Enum Tip Məlumatları"
          size="md"
        >
          {isLoadingEnumTypeDetail ? (
            <ContentLoading />
          ) : enumTypeDetail ? (
            <EnumTypeDetailPanel
              key={enumTypeDetail.id}
              enumTypeDetail={enumTypeDetail}
              onClose={handleClosePanel}
              onSave={handleUpdateEnumType}
              isLoading={isUpdatingEnumType}
              isModal
            />
          ) : (
            <div style={{ padding: "2rem", textAlign: "center" }}>
              <p>Detallar yüklənir...</p>
            </div>
          )}
        </Modal>
      )}

      <CreateEnumTypeModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSave={handleSaveNewEnumType}
        isLoading={isCreatingEnumType}
      />

      <ConfirmModal
        isOpen={deleteConfirmModal.isOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Enum tipini sil"
        message="Bu enum tipini silmək istədiyinizə əminsiniz? Bu əməliyyat geri alına bilməz."
        confirmText="Sil"
        cancelText="Ləğv et"
        isLoading={isDeletingEnumType}
      />
    </div>
  );
}
