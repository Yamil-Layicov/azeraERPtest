import { useState } from "react";
import {
  PageHeader,
  Table,
  TableToolbar,
  TableControls,
  Pagination,
  TableActionGroup,
  Button,
} from "@/shared/ui";
import { ContentLoading } from "@/shared/ui/loading";
import { Modal } from "@/shared/ui/modal/base";
import { useMediaQuery } from "@/shared/lib/hooks/useMediaQuery";
import styles from "./UsersPage.module.css";
import { useUsersPage } from "../model/useUsersPage";
import { UserPanel } from "./components/panels/UserPanel";
import ResetPasswordModal from "./components/reset-pass/ResetPasswordModal";
import { UserSearchModal } from "./components/search-modal/UserSearchModal";
import { operationOptions } from "@/shared/config/tableOptions";
import CreateModal from "./components/create-modal/CreateModal";
import { MdOutlineQuiz } from "react-icons/md";
import NewUserModal from "./components/newUser-modal/NewUserModal";

export default function UsersPage() {
  const {
    users,
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
    searchStatus,
    setSearchStatus,
    panelMode,
    selectedUser,
    resetPasswordUser,
    closePanel,
    openResetPassword,
    closeResetPassword,
    handleRefresh,
  } = useUsersPage();

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
  const handleCreateSearch = () => {
    setIsCreateModalOpen(true);
  };
  const handleNewUserModalClose = () => {
    setIsNewUserModalOpen(false);
  };
  const handleNewUserModalOpen = () => {
    setIsNewUserModalOpen(true);
  };

  const isEditOrDetailMode = panelMode === "edit" || panelMode === "detail";
  const shouldShowPanel = isEditOrDetailMode && !isMobile;
  const shouldShowModal = isEditOrDetailMode && isMobile;

  const panelContent = (
    <UserPanel
      key={selectedUser?.id || "panel"}
      mode={panelMode || "detail"}
      selectedUser={selectedUser}
      onClose={closePanel}
      onResetPassword={openResetPassword}
      title={shouldShowPanel ? "İstifadəçi Məlumatları" : ""}
    />
  );

  return (
    <div className={styles.container}>
      <PageHeader
        title="İstifadəçilər"
        children={
          <div className={styles.addButtonGroup}>
            <Button
              className={styles.addButton}
              variant="warning"
              onClick={handleCreateSearch}
            >
              <span className={styles.icon}><MdOutlineQuiz/></span>
              Sorgular
            </Button>
            <Button
              className={styles.addButton}
              variant="primary"
              onClick={handleNewUserModalOpen}
            >
              + Yeni
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
              onRefresh={handleRefresh}
              onSearch={() => setIsSearchModalOpen(true)}
              operationOptions={operationOptions}
              selectedOperation={selectedOperation}
              onOperationChange={setSelectedOperation}
            />
          </TableToolbar>

          <div className={styles.tableWrapper}>
            {isLoading ? (
              <ContentLoading />
            ) : isError ? (
              <div className={styles.emptyState}>
                <p>Xəta baş verdi</p>
              </div>
            ) : (
              <Table data={users} columns={columns} />
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
          onClose={closePanel}
          title="İstifadəçi Məlumatları"
          size="md"
        >
          {panelContent}
        </Modal>
      )}

      <ResetPasswordModal
        isOpen={!!resetPasswordUser}
        onClose={closeResetPassword}
        selectedUser={resetPasswordUser}
      />

      <UserSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSearch={(filters) => {
          setSearchName(filters.username);
          setSearchStatus(filters.status);
          setIsSearchModalOpen(false);
        }}
        onClear={() => {
          setSearchName("");
          setSearchStatus("");
          setIsSearchModalOpen(false);
        }}
        initialData={{
          username: searchName,
          status: searchStatus,
        }}
      />
      <CreateModal
        isCreateModalOpen={isCreateModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
        onSuccess={handleRefresh}
      />
      <NewUserModal
        isOpen={isNewUserModalOpen}
        onClose={handleNewUserModalClose}
        onSuccess={handleRefresh}
      />
    </div>
  );
}
