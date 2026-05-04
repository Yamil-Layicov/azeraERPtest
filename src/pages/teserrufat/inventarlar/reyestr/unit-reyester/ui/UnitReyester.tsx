import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import ListAltIcon from "@mui/icons-material/ListAlt";
import BusinessIcon from "@mui/icons-material/Business";
import styles from "./UnitReyester.module.css";
import { statsData, navigationTabs } from "../model/mockData";
import { PageHeader } from "@/shared/ui";
import { BusinessUnitsTab, ProgramsTab } from "./components";

const UnitReyester: React.FC = () => {
  const [activeTab, setActiveTab] = useState("programs");
  const [filter, setFilter] = useState("all");


  const getTabIcon = (icon: string) => {
    switch (icon) {
      case "programs":
        return <ListAltIcon fontSize="small" />;
      case "business":
        return <BusinessIcon fontSize="small" />;
      default:
        return <ListAltIcon fontSize="small" />;
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "programs":
        return <ProgramsTab filter={filter} setFilter={setFilter} />;
      case "business-units":
        return <BusinessUnitsTab />;
      default:
        return (
          <Box p={4} textAlign="center">
            <Typography variant="h6" color="var(--text-muted)">
              Tezliklə...
            </Typography>
          </Box>
        );
    }
  };

  return (
    <div className={styles.container}>
      <PageHeader title="Vahid Reyestri" />
      <div className={styles.content}>
        <div className={styles.statsGrid}>
          {statsData.map((stat, index) => (
            <div key={index} className={styles.statCard}>
              <span className={styles.statLabel}>{stat.label}</span>
              <span className={styles.statValue}>{stat.value}</span>
            </div>
          ))}
        </div>

        <div className={styles.navSection}>
          <div className={styles.tabsList}>
            {navigationTabs.map((tab) => (
              <button
                key={tab.id}
                className={`${styles.tabButton} ${
                  activeTab === tab.id ? styles.activeTab : ""
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {getTabIcon(tab.icon)}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {renderTabContent()}
      </div>
    </div>
  );
};

export default UnitReyester;
