import { useState } from "react";
import toast from "react-hot-toast";
import {
  Button,
  PageHeader,
  Table,
  TableToolbar,
  TableActionGroup,
  FormInput,
  TotalCount,
} from "@/shared/ui";
import { ContentLoading } from "@/shared/ui/loading";
import { ConfirmModal } from "@/shared/ui/modal/confirm";
import { Modal } from "@/shared/ui/modal/base";
import { useMediaQuery } from "@/shared/lib/hooks/useMediaQuery";
import styles from "./ActiveDirectory.module.css";
import { useCountriesPage } from "../model/useCountriesPage";
import { CountriesPanel } from "./components/countries-panel/CountriesPanel";
import { CreateLdapDirectoryModal } from "./components/create-modal/CreateLdapDirectoryModal";
import { operationOptions } from "@/shared/config/tableOptions";
import { useExcelExport } from "@/shared/lib/hooks/useExcelExport";
import type { Option } from "@/shared/types";
import type { LdapDirectory } from "../model/types";

export function ActiveDirectory() {
  const {
    data,
    totalCount,
    isLoading,
    isError,
    columns,
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
    testLdapConnection,
    handleAddOrRemoveCompany,
    isUpdatingCompanies,
  } = useCountriesPage();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { exportToExcel } = useExcelExport<LdapDirectory>();

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
          { header: "Domain", accessor: "domain" },
          { header: "Host", accessor: "host" },
          { header: "Port", accessor: "port" },
          { header: "Base DN", accessor: "baseDn" },
          {
            header: "SSL",
            accessor: "useSsl",
            render: (item) => (item.useSsl ? "Bəli" : "Xeyr"),
          },
          {
            header: "TLS",
            accessor: "useTls",
            render: (item) => (item.useTls ? "Bəli" : "Xeyr"),
          },
          {
            header: "Status",
            accessor: "isActive",
            render: (item) => (item.isActive ? "Aktiv" : "Qeyri-aktiv"),
          },
        ],
        fileName: "active-directory",
        sheetName: "Active Directory",
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
      onUpdateCompanies={handleAddOrRemoveCompany}
      onTestConnection={testLdapConnection}
      isLoading={isUpdatingCountry}
      isUpdatingCompanies={isUpdatingCompanies}
      isSettingActive={isSettingActive}
      title={shouldShowPanel ? "Məlumatlar" : ""}
      isModal={shouldShowModal}
    />
  );

  return (
    <div className={styles.container}>
      <PageHeader
        title="Active Directory"
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
            <TotalCount count={totalCount} />

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

      <CreateLdapDirectoryModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSave={handleSaveNewCountry}
        isLoading={isCreatingCountry}
      />

      {shouldShowModal && (
        <Modal
          isOpen={true}
          onClose={handleClosePanel}
          title="Məlumatlar"
          size="md"
        >
          {panelContent}
        </Modal>
      )}

      <ConfirmModal
        isOpen={deleteConfirmModal.isOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Sil"
        message="Seçilmiş məlumatı silmək istədiyinizə əminsiniz? Bu əməliyyat geri alına bilməz."
        confirmText="Sil"
        cancelText="Ləğv et"
        isLoading={isDeletingCountry}
      />
    </div>
  );
}

export default ActiveDirectory;

