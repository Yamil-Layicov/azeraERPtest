import { useState } from "react";
import styles from "./VacationTripInfoTab.module.css";
import { VacationInfoTab } from "./tabs/vacation-info";
import { PermissionInfoTab } from "./tabs/permission";
import { BusinessTripTab } from "./tabs/business-trip";
import { SickLeaveTab } from "./tabs/sick-leave";
import { PrivilegesTab } from "./tabs/privileges";
import { SpecialNotesTab } from "./tabs/special-notes";

type TabType = "vacation" | "business-trip" | "permission" | "sick-leave" | "privileges" | "special-notes";

export const VacationTripInfoTab = () => {
    const [activeTab, setActiveTab] = useState<TabType>("vacation");

    const renderContent = () => {
        switch (activeTab) {
            case "vacation":
                return <VacationInfoTab />;
            case "business-trip":
                return <BusinessTripTab />;
            case "permission":
                return <PermissionInfoTab />;
            case "sick-leave":
                return <SickLeaveTab />;
            case "privileges":
                return <PrivilegesTab />;
            case "special-notes":
                return <SpecialNotesTab />;
            default:
                return null;
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.tabsContainer}>
                <button
                    className={`${styles.tabButton} ${activeTab === "vacation" ? styles.activeTab : ""}`}
                    onClick={() => setActiveTab("vacation")}
                >
                    Məzuniyyət məlumatları
                </button>
                <button
                    className={`${styles.tabButton} ${activeTab === "business-trip" ? styles.activeTab : ""}`}
                    onClick={() => setActiveTab("business-trip")}
                >
                    Ezamiyyət məlumatları
                </button>
                <button
                    className={`${styles.tabButton} ${activeTab === "permission" ? styles.activeTab : ""}`}
                    onClick={() => setActiveTab("permission")}
                >
                    İcazə məlumatları
                </button>
                <button
                    className={`${styles.tabButton} ${activeTab === "sick-leave" ? styles.activeTab : ""}`}
                    onClick={() => setActiveTab("sick-leave")}
                >
                    Əmək qabiliyyətinin olmaması
                </button>
                <button
                    className={`${styles.tabButton} ${activeTab === "privileges" ? styles.activeTab : ""}`}
                    onClick={() => setActiveTab("privileges")}
                >
                    İmtiyazlar
                </button>
                <button
                    className={`${styles.tabButton} ${activeTab === "special-notes" ? styles.activeTab : ""}`}
                    onClick={() => setActiveTab("special-notes")}
                >
                    Xüsusi qeydlər
                </button>
            </div>
            <div className={styles.content}>
                {renderContent()}
            </div>
        </div>
    );
};