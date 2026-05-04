import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import styles from "./CreateEmployeePage.module.css";
import { PageHeader } from "@/shared/ui";
import { ROUTES } from "@/app/routes/consts";
import LdapSearchModal from "../../employee-shared/ui/ldap-search-modal/LdapSearchModal";
import InfoTab from "../../employee-shared/ui/info-tab/InfoTab";
import SecurityTab from "../../employee-shared/ui/security-tab/SecurityTab";
import StaffTab from "./components/staff-tab/StaffTab";
import AvatarUploader from "../../employee-shared/ui/avatar-uploader/AvatarUploader";
import { useCreateEmployeeForm } from "../model/useCreateEmployeeForm";
import { CreateEmployeeProvider, useCreateEmployeeContext } from "../contexts/CreateEmployeeContext";
import Tabs from "./components/tabs-form-actions/Tabs";
import FormActions from "./components/tabs-form-actions/FormActions";
import PinSearchResultModal from "./components/pin-search-result-modal/PinSearchResultModal";
import SuccessModal from "@/shared/ui/modal/success/SuccessModal";
import type { TabKey } from "../../employee-shared/model/types";

const TABS = [
  { key: "info" as TabKey, label: "Əsas Məlumatlar" },
  { key: "staff" as TabKey, label: "Ştat cədvəli" },
  { key: "security" as TabKey, label: "Təhlükəsizlik" },
];

function CreateEmployeePageContent() {
  const navigate = useNavigate();
  const {
    activeTab,
    setActiveTab,
    isLdapModalOpen,
    setIsLdapModalOpen,
    handleLdapConfirm,
    handleSave,
    handleStaffSave,
    isStaffSaving,
    formData,
    employmentId,
    isPinSearchResultModalOpen,
    setIsPinSearchResultModalOpen,
    pinSearchResultData,
    handlePinSearchConfirm,
    handlePinSearchCancel,
    companiesOptions,
    isSuccessModalOpen,
    setIsSuccessModalOpen,
    handleSuccessModalCreateNew,
    handleSuccessModalContinue,
    areTabsEnabled,
    avatarPreview,
    fileInputRef,
    handleAvatarClick,
    handleClearAvatar,
    handleFileChange,
    // isDataLoaded,
  } = useCreateEmployeeContext();

  const handleCancel = useCallback(() => {
    navigate(ROUTES.KADRLAR.EMPLOYEES.LINK);
  }, [navigate]);

  const handleLdapSearch = useCallback(() => {
    setIsLdapModalOpen(true);
  }, [setIsLdapModalOpen]);

  const handleLdapClose = useCallback(() => {
    setIsLdapModalOpen(false);
  }, [setIsLdapModalOpen]);

  const formActionsButtons = [
    {
      label: isStaffSaving ? "Yadda saxlanılır..." : "Yadda saxla",
      variant: "primary" as const,
      onClick: activeTab === "staff" && handleStaffSave ? handleStaffSave : handleSave,
      disabled: activeTab === "staff" 
        ? (isStaffSaving || !employmentId || !formData.company || !formData.position)
        : false,
    },
    {
      label: "İmtina et",
      variant: "secondary" as const,
      onClick: handleCancel,
    },
  ];

    return (
      <div className={styles.container}>
        <PageHeader title="Yeni işçi">
          
        </PageHeader>

        <div className={styles.pageWrapper}>
          <div className={styles.leftColumn}>
            <AvatarUploader
              preview={avatarPreview}
              fileInputRef={fileInputRef}
              onFileChange={handleFileChange}
              onClear={handleClearAvatar}
              onClick={handleAvatarClick}
            />
          </div>

          <div className={`${styles.rightColumn} ${activeTab === "info" ? styles.infoTabActive : ""}`}>
            <Tabs
              tabs={TABS}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              disabledTabs={areTabsEnabled ? [] : ["staff", "security"]}
            />

            <div className={styles.tabContent}>
              {activeTab === "info" && (
                <InfoTab 
                  companiesOptions={companiesOptions} 
                />
              )}

              {activeTab === "security" && (
                <SecurityTab
                  onLdapSearch={handleLdapSearch}
                  onCancel={handleCancel}
                />
              )}

              {activeTab === "staff" && <StaffTab />}
            </div>

          
            {activeTab !== "security" && (
              <FormActions buttons={formActionsButtons} />
            )}
          </div>
        </div>

        <LdapSearchModal
          isOpen={isLdapModalOpen}
          onClose={handleLdapClose}
          onConfirm={handleLdapConfirm}
        />

        <PinSearchResultModal
          isOpen={isPinSearchResultModalOpen}
          onClose={() => setIsPinSearchResultModalOpen(false)}
          onConfirm={handlePinSearchConfirm || (() => {})}
          onCancel={handlePinSearchCancel || (() => {})}
          data={pinSearchResultData as any}
        />

        <SuccessModal
          isOpen={isSuccessModalOpen}
          onClose={() => setIsSuccessModalOpen(false)}
          title="Əmaliyyat uğurlu oldu"
          primaryButtonText="Dəvam et"
          secondaryButtonText="Yenidən yarat"
          onPrimaryAction={handleSuccessModalContinue}
          onSecondaryAction={handleSuccessModalCreateNew}
        />
      </div>
    );
}

export default function CreateEmployeePage() {
  const contextValue = useCreateEmployeeForm();

  return (
    <CreateEmployeeProvider value={contextValue}>
      <CreateEmployeePageContent />
    </CreateEmployeeProvider>
  );
}