import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import styles from "./VacationTripInfoTab.module.css";
import { VacationInfoTab } from "./tabs/vacation-info";
import { PermissionInfoTab } from "./tabs/permission";
import { BusinessTripTab } from "./tabs/business-trip";
import { SickLeaveTab } from "./tabs/sick-leave";
import { PrivilegesTab } from "./tabs/privileges";
import { SpecialNotesTab } from "./tabs/special-notes";
import { useAddEmployeeStore } from "@/features/kadrlar/create-worker/model/useAddEmployeeStore";
import { usePermission } from "@/features/auth/hooks/usePermission";
import { PERMISSIONS } from "@/shared/consts/permissions";

export interface VacationTripInfoTabHandle {
  submit: () => void;
  isDirty: () => boolean;
}

type TabType = "vacation" | "business-trip" | "permission" | "sick-leave" | "privileges" | "special-notes";

export const VacationTripInfoTab = forwardRef<VacationTripInfoTabHandle>((_, ref) => {
    const [activeTab, setActiveTab] = useState<TabType>("vacation");
    /** Ezamiyyət tabına hər klikdə GET (refetch) üçün artan açar */
    const [businessTripTabVisitKey, setBusinessTripTabVisitKey] = useState(0);
    /** İcazə tabına hər klikdə GET (refetch) üçün artan açar */
    const [permissionTabVisitKey, setPermissionTabVisitKey] = useState(0);
    /** Əmək qabiliyyətinin olmaması tabına hər klikdə GET (refetch) üçün artan açar */
    const [sickLeaveTabVisitKey, setSickLeaveTabVisitKey] = useState(0);
    /** İmtiyazlar tabına hər klikdə GET (refetch) üçün artan açar */
    const [privilegesTabVisitKey, setPrivilegesTabVisitKey] = useState(0);
    /** Xüsusi qeydlər tabına hər klikdə GET (refetch) üçün artan açar */
    const [specialNotesTabVisitKey, setSpecialNotesTabVisitKey] = useState(0);
    const { nextStep, setStepCompleted } = useAddEmployeeStore();
    const canViewSpecialNotes = usePermission(PERMISSIONS.EMPLOYEE.SPECIAL_NOTE);

    useEffect(() => {
        if (activeTab === "special-notes" && !canViewSpecialNotes) {
            setActiveTab("vacation");
        }
    }, [activeTab, canViewSpecialNotes]);

    useImperativeHandle(ref, () => ({
        submit: () => {
            // Bu tab daxilində məlumatlar lokal state-də saxlanılır.
            // Burada sadəcə step-i tamam sayıb növbətiyə keçiririk.
            setStepCompleted(9);
            nextStep();
        },
        isDirty: () => false,
    }));

    const renderContent = () => {
        switch (activeTab) {
            case "vacation":
                return <VacationInfoTab activeInnerTab={activeTab} />;
            case "business-trip":
                return (
                    <BusinessTripTab
                        activeInnerTab={activeTab}
                        tabVisitKey={businessTripTabVisitKey}
                    />
                );
            case "permission":
                return (
                    <PermissionInfoTab
                        activeInnerTab={activeTab}
                        tabVisitKey={permissionTabVisitKey}
                    />
                );
            case "sick-leave":
                return (
                    <SickLeaveTab
                        activeInnerTab={activeTab}
                        tabVisitKey={sickLeaveTabVisitKey}
                    />
                );
            case "privileges":
                return (
                    <PrivilegesTab
                        activeInnerTab={activeTab}
                        tabVisitKey={privilegesTabVisitKey}
                    />
                );
            case "special-notes":
                return (
                    <SpecialNotesTab
                        activeInnerTab={activeTab}
                        tabVisitKey={specialNotesTabVisitKey}
                    />
                );
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
                    type="button"
                    className={`${styles.tabButton} ${activeTab === "business-trip" ? styles.activeTab : ""}`}
                    onClick={() => {
                        setActiveTab("business-trip");
                        setBusinessTripTabVisitKey((k) => k + 1);
                    }}
                >
                    Ezamiyyət məlumatları
                </button>
                <button
                    type="button"
                    className={`${styles.tabButton} ${activeTab === "permission" ? styles.activeTab : ""}`}
                    onClick={() => {
                        setActiveTab("permission");
                        setPermissionTabVisitKey((k) => k + 1);
                    }}
                >
                    İcazə məlumatları
                </button>
                <button
                    type="button"
                    className={`${styles.tabButton} ${activeTab === "sick-leave" ? styles.activeTab : ""}`}
                    onClick={() => {
                        setActiveTab("sick-leave");
                        setSickLeaveTabVisitKey((k) => k + 1);
                    }}
                >
                    Əmək qabiliyyətinin olmaması
                </button>
                <button
                    type="button"
                    className={`${styles.tabButton} ${activeTab === "privileges" ? styles.activeTab : ""}`}
                    onClick={() => {
                        setActiveTab("privileges");
                        setPrivilegesTabVisitKey((k) => k + 1);
                    }}
                >
                    İmtiyazlar
                </button>
                {canViewSpecialNotes ? (
                    <button
                        type="button"
                        className={`${styles.tabButton} ${activeTab === "special-notes" ? styles.activeTab : ""}`}
                        onClick={() => {
                            setActiveTab("special-notes");
                            setSpecialNotesTabVisitKey((k) => k + 1);
                        }}
                    >
                        Xüsusi qeydlər
                    </button>
                ) : null}
            </div>
            <div className={styles.content}>
                {renderContent()}
            </div>
        </div>
    );
});