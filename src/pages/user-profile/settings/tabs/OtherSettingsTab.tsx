import styles from "../ProfileSettings.module.css";
import { WrenchScrewdriverIcon } from "@heroicons/react/24/outline";

export const OtherSettingsTab = () => {
  return (
    <div className={styles.tabContent}>
            <div className={styles.tabHeader}>
        <h2 className={styles.tabTitle}>Bildirişlər</h2>
    
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "4rem 2rem",
          color: "var(--text-secondary)",
          textAlign: "center",
        }}
      >
        <WrenchScrewdriverIcon
          style={{
            width: "64px",
            height: "64px",
            marginBottom: "1rem",
            opacity: 0.5,
          }}
        />
        <h3
          style={{
            fontSize: "1.25rem",
            color: "var(--text-primary)",
            marginBottom: "0.5rem",
          }}
        >
          Tezliklə
        </h3>
        <p>Bu bölməyə tezliklə yeni e-mail bildirişləri əlavə ediləcək.</p>
      </div>
    </div>
  );
};
