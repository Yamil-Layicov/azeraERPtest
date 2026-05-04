import React from "react";
import styles from "./Tabs.module.css";
import type { TabKey } from "../../../../employee-shared/model/types";

export interface TabItem {
  key: TabKey;
  label: string;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: TabKey;
  onTabChange: (tabKey: TabKey) => void;
  className?: string;
  disabledTabs?: TabKey[];
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange, className, disabledTabs = [] }) => {
  return (
    <div className={`${styles.tabsHeader} ${className || ""}`}>
      {tabs.map((tab) => {
        const isDisabled = disabledTabs.includes(tab.key);
        return (
          <button
            key={tab.key}
            className={`${styles.tabButton} ${activeTab === tab.key ? styles.active : ""} ${isDisabled ? styles.disabled : ""}`}
            onClick={() => !isDisabled && onTabChange(tab.key)}
            disabled={isDisabled}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;

