import React, { useState } from "react";
import styles from "./AnbarChanges.module.css";
import { PageHeader, Button } from "@/shared/ui";
import {
  REASON_OPTIONS,
  type AnbarChangeGeneralInfo,
  type AnbarChangeItem,
} from "../model/types";
import GeneralInfoTab from "./tabs/GeneralInfoTab";
import ItemsTableTab from "./tabs/ItemsTableTab";
import { HiOutlineDocumentText, HiOutlineCube } from "react-icons/hi";

const AnbarChanges: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"general" | "items">("general");

  const [generalInfo, setGeneralInfo] = useState<AnbarChangeGeneralInfo>({
    company: null,
    anbar: null,
    responsiblePerson: null,
    responsiblePersonName: "",
    reason: REASON_OPTIONS[0] ?? null,
    status: "Draft",
    note: "",
  });

  const [items, setItems] = useState<AnbarChangeItem[]>(
    Array.from({ length: 1 }).map(() => ({
      id: Math.random().toString(36).substr(2, 9),
      nomenklatura: null,
      systemQuantity: 0,
      actualQuantity: 0,
      difference: 0,
    })),
  );

  const handleSave = () => {
    // Yadda saxlama funksionallığı burada həyata keçiriləcək
  };

  return (
    <div className={styles.container}>
      <PageHeader title="Mal əskikliyinin silinməsi" />
      <div className={styles.tabsContainer}>
        <div
          className={`${styles.tabItem} ${activeTab === "general" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("general")}
        >
          <HiOutlineDocumentText size={18} />
          <span>Ümumi Məlumatlar</span>
        </div>
        <div
          className={`${styles.tabItem} ${activeTab === "items" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("items")}
        >
          <HiOutlineCube size={18} />
          <span>Malların Siyahısı</span>
        </div>
      </div>

      <div className={styles.tabPanel}>
        {activeTab === "general" ? (
          <GeneralInfoTab data={generalInfo} onChange={setGeneralInfo} />
        ) : (
          <ItemsTableTab items={items} setItems={setItems} />
        )}
      </div>

      <div className={styles.footer}>
        <Button variant="outline">İmtina</Button>
        <Button variant="primary" onClick={handleSave}>
          Yadda saxla
        </Button>
      </div>
    </div>
  );
};

export default AnbarChanges;
