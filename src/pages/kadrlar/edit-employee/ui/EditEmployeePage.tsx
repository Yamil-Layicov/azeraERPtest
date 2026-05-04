import { useNavigate } from "react-router-dom";
import styles from "../../create-employee/ui/CreateEmployeePage.module.css";
import { Button, PageHeader, Loading } from "@/shared/ui";
import InfoTab from "../../employee-shared/ui/info-tab/InfoTab";
import SecurityTab from "../../employee-shared/ui/security-tab/SecurityTab";
import AvatarUploader from "../../employee-shared/ui/avatar-uploader/AvatarUploader";
import LdapSearchModal from "../../employee-shared/ui/ldap-search-modal/LdapSearchModal";
import { useEditEmployeeForm } from "../model/useEditEmployeeForm";
import { CreateEmployeeProvider, useCreateEmployeeContext } from "../../create-employee/contexts/CreateEmployeeContext";
import { ROUTES } from "@/app/routes/consts";

function EditEmployeePageContent() {
  const navigate = useNavigate();
  const {
    activeTab,
    setActiveTab,
    isLdapModalOpen,
    setIsLdapModalOpen,
    handleLdapConfirm,
    handleSave,
    handleClearAll,
    isLoading,
    companiesOptions,
  } = useCreateEmployeeContext();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className={styles.container}>
      <PageHeader title="İşçi Məlumatları" />

      <div className={styles.pageWrapper}>
        <div className={styles.leftColumn}>
          <AvatarUploader />
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.tabsHeader}>
            <button 
              className={`${styles.tabButton} ${activeTab === "info" ? styles.active : ""}`} 
              onClick={() => setActiveTab("info")}
            >
              Əsas Məlumatlar
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === "security" ? styles.active : ""}`} 
              onClick={() => setActiveTab("security")}
            >
              Təhlükəsizlik
            </button>
          </div>

          <div className={styles.tabContent}>
            {activeTab === "info" && (
              <InfoTab 
                companiesOptions={companiesOptions}
                isEditMode={false}
                readOnlyFields={['fin', 'company']}
              />
            )}

            {activeTab === "security" && (
              <SecurityTab
                onLdapSearch={() => setIsLdapModalOpen(true)}
                onCancel={() => navigate(ROUTES.KADRLAR.EMPLOYEES.LINK)}
              />
            )}
          </div>

          {activeTab !== "security" && (
            <div className={styles.formFooter}>
              <div className={styles.footerButtons}>
                <Button type="button" variant="primary" onClick={handleSave} className={styles.actionBtn}>
                  Yadda saxla
                </Button>
                <Button type="button" variant="secondary" onClick={handleClearAll} className={styles.actionBtn}>
                  İmtina et
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <LdapSearchModal
        isOpen={isLdapModalOpen}
        onClose={() => setIsLdapModalOpen(false)}
        onConfirm={handleLdapConfirm}
      />
    </div>
  );
}

export default function EditEmployeePage() {
  const contextValue = useEditEmployeeForm();

  return (
    <CreateEmployeeProvider value={contextValue}>
      <EditEmployeePageContent />
    </CreateEmployeeProvider>
  );
} 