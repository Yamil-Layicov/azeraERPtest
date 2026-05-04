import { useState } from "react";
import { PageHeader } from "@/shared/ui";
import {
  Squares2X2Icon,
  DocumentTextIcon,
  NewspaperIcon,
} from "@heroicons/react/24/outline";
import { NewsTab, PartnerTab, TermsTab } from "./tabs";
import styles from "./RoyalityMenagment.module.css";

type TabType = "partners" | "terms" | "news";

export const RoyalityMenagment = () => {
  const [activeTab, setActiveTab] = useState<TabType>("terms");

  const renderTabContent = () => {
    switch (activeTab) {
      case "partners":
        return <PartnerTab />;
      case "terms":
        return <TermsTab />;
      case "news":
        return <NewsTab />;

      default:
        return <PartnerTab />;
    }
  };

  return (
    <div className={styles.pageContainer}>
      <PageHeader title="Loyallıq tətbiqinin idarəsi" />

      <div className={styles.contentWrapperLayout}>
        <div className={styles.sidebarContainer}>
          <button
            className={`${styles.sidebarButton} ${activeTab === "terms" ? styles.activeSidebarButton : ""}`}
            onClick={() => setActiveTab("terms")}
          >
            <DocumentTextIcon className={styles.sidebarIcon} />
            <span>Qaydalar və Şərtlər</span>
          </button>
          <button
            className={`${styles.sidebarButton} ${activeTab === "partners" ? styles.activeSidebarButton : ""}`}
            onClick={() => setActiveTab("partners")}
          >
            <Squares2X2Icon className={styles.sidebarIcon} />
            <span>Tərəfdaşlar</span>
          </button>
          <button
            className={`${styles.sidebarButton} ${activeTab === "news" ? styles.activeSidebarButton : ""}`}
            onClick={() => setActiveTab("news")}
          >
            <NewspaperIcon className={styles.sidebarIcon} />
            <span>Xəbərlər</span>
          </button>
        </div>

        <div className={styles.mainContentWrapper}>
          <div className={styles.tabContent}>{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default RoyalityMenagment;
