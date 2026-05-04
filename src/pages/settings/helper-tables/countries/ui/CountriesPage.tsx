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
import styles from "./CountriesPage.module.css";
import { useCountriesPage } from "../model/useCountriesPage";
import { CountriesPanel } from "./components/countries-panel/CountriesPanel";
import { CreateCountryModal } from "./components/create-modal/CreateCountryModal";
import { operationOptions } from "@/shared/config/tableOptions";
import { useExcelExport } from "@/shared/lib/hooks/useExcelExport";
import type { Option } from "@/shared/types";
import type { Country } from "../model/types";


export function CountriesPage() {
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
    selectedCountry,
    countryDetail,
    isLoadingCountryDetail,
    handleClosePanel,
    handleUpdateCountry,
    isUpdatingCountry,
    isCreateModalOpen,
    handleCreate,
    handleCloseCreateModal,
    handleSaveNewCountry,
    isCreatingCountry,
    deleteConfirmModal,
    handleCancelDelete,
    handleConfirmDelete,
    isDeletingCountry,
    handleRefresh,
    handleSetActive,
    isSettingActive,
  } = useCountriesPage();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { exportToExcel } = useExcelExport<Country>();

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
          { header: "Ölkə", accessor: "name" },
          { header: "Kod", accessor: "code" },
          { header: "Yerli Ad", accessor: "nativeName" },
          { header: "Telefon Kodu", accessor: "phoneCode" },
          { header: "Valyuta Kodu", accessor: "currencyCode" },
          {
            header: "Status",
            accessor: "isActive",
            render: (item) => (item.isActive ? "Aktiv" : "Qeyri-aktiv"),
          },
        ],
        fileName: "olkeler",
        sheetName: "Ölkələr",
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
    <CountriesPanel
      key={selectedCountry?.id || "panel"}
      mode={activePanelMode}
      countryDetail={countryDetail}
      isLoadingCountryDetail={isLoadingCountryDetail}
      onClose={handleClosePanel}
      onSave={handleUpdateCountry}
      onSetActive={handleSetActive}
      isLoading={isUpdatingCountry}
      isSettingActive={isSettingActive}
      title={shouldShowPanel ? "Ölkə Məlumatları" : ""}
      isModal={shouldShowModal}
    />
  );

  return (
    <div className={styles.container}>
      <PageHeader
        title="Ölkələr"
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

      <CreateCountryModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSave={handleSaveNewCountry}
        isLoading={isCreatingCountry}
      />

      {shouldShowModal && (
        <Modal
          isOpen={true}
          onClose={handleClosePanel}
          title="Ölkə Məlumatları"
          size="md"
        >
          {panelContent}
        </Modal>
      )}

      <ConfirmModal
        isOpen={deleteConfirmModal.isOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Ölkəni sil"
        message="Bu ölkəni silmək istədiyinizə əminsiniz? Bu əməliyyat geri alına bilməz."
        confirmText="Sil"
        cancelText="Ləğv et"
        isLoading={isDeletingCountry}
      />
    </div>
  );
}
