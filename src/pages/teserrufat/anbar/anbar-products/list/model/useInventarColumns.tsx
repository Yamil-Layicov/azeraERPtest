import { useMemo } from "react";
import { StatusBadge } from "@/shared/ui";
import type { InventoryItem, StockStatus } from "./types";
import styles from "../ui/InventarListPage.module.css";

export const useInventarColumns = () => {
  const statusMap: Record<StockStatus, { label: string; variant: any }> = {
    inStock: { label: "Mövcuddur", variant: "success" },
    lowStock: { label: "Azalıb", variant: "warning" },
    outOfStock: { label: "Bitib", variant: "danger" },
    overstocked: { label: "Həddindən artıq", variant: "primary" },
  };

  return useMemo(
    () => [
      {
        header: "SKU / Barkod",
        accessor: "sku",
        render: (item: InventoryItem) => (
          <div className={styles.skuColumn}>
            <span className={styles.skuText}>{item.sku}</span>
            <span className={styles.barcodeText}>{item.barcode}</span>
          </div>
        ),
        sortable: true,
      },
      {
        header: "Məhsul Adı",
        accessor: "name",
        render: (item: InventoryItem) => (
          <div className={styles.nameColumn}>
            <span className={styles.itemName}>{item.name}</span>
            <span className={styles.categoryBadge}>{item.category}</span>
          </div>
        ),
        sortable: true,
      },
      {
        header: "Anbar / Yer",
        accessor: "warehouse",
        render: (item: InventoryItem) => (
          <div className={styles.locationColumn}>
            <span className={styles.warehouseName}>{item.warehouse}</span>
            <span className={styles.locationName}>{item.location}</span>
          </div>
        ),
        sortable: true,
      },
      {
        header: "Lot / Seriya",
        accessor: "lotSerial",
        render: (item: InventoryItem) => (
          <span className={styles.lotSerialText}>{item.lotSerial || "-"}</span>
        ),
      },
      {
        header: "Mövcud Stok",
        accessor: "onHand",
        render: (item: InventoryItem) => (
          <div className={styles.qtyColumn}>
            <div className={styles.qtyMain}>
              <span className={styles.onHandValue}>{item.onHand}</span>
              <span className={styles.unitText}>{item.unit}</span>
            </div>
            {item.allocated > 0 && (
              <span className={styles.allocatedText}>
                Rezerv: {item.allocated}
              </span>
            )}
          </div>
        ),
        sortable: true,
      },
      {
        header: "Min/Max",
        accessor: "minLevel",
        render: (item: InventoryItem) => (
          <div className={styles.thresholdColumn}>
            <span className={styles.minMaxText}>
              {item.minLevel} / {item.maxLevel}
            </span>
            <div className={styles.thresholdBar}>
              <div
                className={styles.thresholdProgress}
                style={{
                  width: `${Math.min((item.onHand / item.maxLevel) * 100, 100)}%`,
                  backgroundColor:
                    item.onHand < item.minLevel ? "#ef4444" : "#10b981",
                }}
              />
            </div>
          </div>
        ),
      },
      {
        header: "Vəziyyət",
        accessor: "status",
        render: (item: InventoryItem) => {
          const config = statusMap[item.status];
          return <StatusBadge label={config.label} variant={config.variant} />;
        },
        sortable: true,
      },
      {
        header: "Son Hərəkət",
        accessor: "lastMovementDate",
        render: (item: InventoryItem) => (
          <span className={styles.dateText}>
            {new Date(item.lastMovementDate).toLocaleDateString("az-AZ")}
          </span>
        ),
        sortable: true,
      },
    ],
    [],
  );
};
