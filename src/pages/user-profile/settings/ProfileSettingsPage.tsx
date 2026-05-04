import { useState } from "react";
import { PageHeader } from "@/shared/ui";
import { UserIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import { PersonalInfoTab } from "./tabs/PersonalInfoTab";
import styles from "./ProfileSettings.module.css";
import { SecurityTab, OtherSettingsTab, HistoryInfo } from "./tabs";
import { MdOutlineEmail } from "react-icons/md";
import { GoHistory } from "react-icons/go";
import { useGetUserProfile } from "@/features/auth/hooks";

type TabType = "personal" | "security" | "other" | "history";

const ProfileSettingsPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>("personal");
  const { data: profileInfo } = useGetUserProfile();

  const renderTabContent = () => {
    switch (activeTab) {
      case "personal":
        return <PersonalInfoTab profileInfo={profileInfo || null} />;
      case "security":
        return <SecurityTab />;
      case "other":
        return <OtherSettingsTab />;
      case "history":
        return <HistoryInfo />;
      default:
        return <PersonalInfoTab profileInfo={profileInfo || null} />;
    }
  };

  return (
    <div className={styles.pageContainer}>
      <PageHeader title="Profil" />

      <div className={styles.contentWrapperLayout}>
        <div className={styles.sidebarContainer}>
          <button
            className={`${styles.sidebarButton} ${activeTab === "personal" ? styles.activeSidebarButton : ""}`}
            onClick={() => setActiveTab("personal")}
          >
            <UserIcon className={styles.sidebarIcon} />
            <span>Şəxsi Məlumatlar</span>
          </button>

          <button
            className={`${styles.sidebarButton} ${activeTab === "security" ? styles.activeSidebarButton : ""}`}
            onClick={() => setActiveTab("security")}
          >
            <ShieldCheckIcon className={styles.sidebarIcon} />
            <span>Təhlükəsizlik</span>
          </button>

          <button
            className={`${styles.sidebarButton} ${activeTab === "other" ? styles.activeSidebarButton : ""}`}
            onClick={() => setActiveTab("other")}
          >
            <MdOutlineEmail className={styles.sidebarIcon} />
            <span>E-poçt bildirişləri</span>
          </button>
          <button
            className={`${styles.sidebarButton} ${activeTab === "history" ? styles.activeSidebarButton : ""}`}
            onClick={() => setActiveTab("history")}
          >
            <GoHistory className={styles.sidebarIcon} />
            <span>Giriş Tarixçəsi</span>
          </button>
        </div>

        <div className={styles.mainContentWrapper}>{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default ProfileSettingsPage;
