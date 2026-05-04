import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  PageHeader,
  Table,
  TableToolbar,
  TableControls,
  TableActionGroup,
  Pagination,
  FormInput,
  Button,
} from "@/shared/ui";
import { ContentLoading } from "@/shared/ui/loading";
import { ConfirmModal } from "@/shared/ui/modal/confirm";
import { Modal } from "@/shared/ui/modal/base";
import { useMediaQuery } from "@/shared/lib/hooks/useMediaQuery";
import styles from "./CitiesPage.module.css";
import { useCitiesPage } from "../model/useCitiesPage";
import { ROUTES } from "@/app/routes/consts";
import { CreateCityModal } from "./components/create-modal/CreateCityModal";
import { CitiesPanel } from "./components/cities-panel/CitiesPanel";

function CitiesPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const countryIdParam = searchParams.get("countryId");
  const countryId = countryIdParam ? Number(countryIdParam) : 0;
  
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
    countryName,
    handleRefresh,
    isCreateModalOpen,
    handleCreate,
    handleCloseCreateModal,
    handleSaveNewCity,
    isCreatingCity,
    countryId: countryIdFromHook,
    deleteConfirmModal,
    handleCancelDelete,
    handleConfirmDelete,
    isDeletingCity,
    selectedCity,
    activePanelMode,
    cityDetail,
    isLoadingCityDetail,
    handleClosePanel,
    handleUpdateCity,
    isUpdatingCity,
    handleSetActiveCity,
    isSettingActiveCity,
  } = useCitiesPage({ countryId });

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const isDetailMode = activePanelMode === "detail";
  const shouldShowPanel = isDetailMode && !isMobile;
  const shouldShowModal = isDetailMode && isMobile;

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

  if (!countryId) {
    return (
      <div className={styles.container}>
        <div className={styles.errorMessage}>
          Ölkə ID tapılmadı. Zəhmət olmasa geri qayıdın.
        </div>
      </div>
    );
  }

  const panelContent = (
    <CitiesPanel
      key={selectedCity?.id || "panel"}
      mode={activePanelMode}
      selectedCity={selectedCity}
      cityDetail={cityDetail}
      isLoadingCityDetail={isLoadingCityDetail}
      onClose={handleClosePanel}
      onSave={handleUpdateCity}
      onSetActive={handleSetActiveCity}
      isLoading={isUpdatingCity}
      isSettingActive={isSettingActiveCity}
      title={shouldShowPanel ? "Şəhər Məlumatları" : ""}
      isModal={shouldShowModal}
    />
  );

  return (
    <div className={styles.container}>
      <PageHeader
        title={countryName ? `${countryName} - Şəhərlər` : "Şəhərlər"}
        className={styles.pageHeader}
        children={
          <>
            <Button
              type="button"
              variant="primary"
              onClick={handleCreate}
              className={styles.addButton}
            >
              Yeni
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(ROUTES.SETTINGS.HELPER_TABLES.COUNTRIES.LINK)}
              className={styles.backButton}
            >
              Geri
            </Button>
          </>
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
              searchLeftSlot={searchInput}
              isSearchLeftSlotOpen={isSearchOpen}
            />
          </TableToolbar>

          <div className={styles.tableWrapper}>
            {isLoading ? (
              <ContentLoading />
            ) : isError ? (
              <div className={styles.errorMessage}>
                Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.
              </div>
            ) : (
              <Table data={data} columns={columns} />
            )}
          </div>

          <TableToolbar className={styles.bottomToolbar}>
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

      {shouldShowModal && (
        <Modal
          isOpen={true}
          onClose={handleClosePanel}
          title="Şəhər Məlumatları"
          size="md"
        >
          {panelContent}
        </Modal>
      )}

      <CreateCityModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSave={handleSaveNewCity}
        isLoading={isCreatingCity}
        countryId={countryIdFromHook}
      />

      <ConfirmModal
        isOpen={deleteConfirmModal.isOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Şəhəri sil"
        message="Bu şəhəri silmək istədiyinizə əminsiniz? Bu əməliyyat geri alına bilməz."
        confirmText="Sil"
        cancelText="Ləğv et"
        isLoading={isDeletingCity}
      />
    </div>
  );
}

export default CitiesPage;
