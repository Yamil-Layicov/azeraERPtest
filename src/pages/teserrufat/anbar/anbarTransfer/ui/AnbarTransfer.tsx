import React, {  useState } from "react";
import styles from "./AnbarTransfer.module.css";
import { PageHeader, Button } from "@/shared/ui";

import GeneralInfoTab from "./tabs/GeneralInfoTab";
import ItemsTableTab from "./tabs/ItemsTableTab";
import { HiOutlineDocumentText, HiOutlineCube } from "react-icons/hi";
import {
  type AnbarTransferGeneralInfo,
  type AnbarTransferItem,
} from "../model/types";

const AnbarTransfer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"general" | "items">("general");

  const [generalInfo, setGeneralInfo] = useState<AnbarTransferGeneralInfo>({
    operationDate: new Date().toISOString().split("T")[0] || "",
    documentNumber: "",
    senderWarehouse: null,
    receiverWarehouse: null,
    company: null,
    responsiblePerson: null,
    status: "Draft",
    note: "",
  });

  const [items, setItems] = useState<AnbarTransferItem[]>(
    Array.from({ length: 1 }).map(() => ({
      id: Math.random().toString(36).substr(2, 9),
      nomenklatura: null,
      systemQuantity: 0,
      transferQuantity: 0,
      price: 0,
      amount: 0,
    })),
  );

  const handleSave = () => {
    console.log("salam Azerbaycan");
  };

  return (
    <div className={styles.container}>
      <PageHeader title="Anbarlar arası mal transferi" />

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

export default AnbarTransfer;
