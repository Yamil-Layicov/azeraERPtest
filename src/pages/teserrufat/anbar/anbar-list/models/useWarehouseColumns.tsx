import { useMemo } from "react";
import { Button, StatusBadge } from "@/shared/ui";
import type { Warehouse } from "./types";
import { EyeIcon } from "@heroicons/react/24/outline";
import styles from "../ui/Anbars.module.css";
export const useWarehouseColumns = () => {
  const typeMap: Record<Warehouse["type"], string> = {
    Central: "Mərkəzi",
    Distribution: "Paylayıcı",
    Retail: "Pərakəndə",
    ColdStorage: "Soyuq Anbar",
  };

  return useMemo(
    () => [
      {
        header: "Anbar Adı",
        accessor: "name",
        render: (item: Warehouse) => (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontWeight: 500, color: "#1e293b" }}>
              {item.name}
            </span>
            <span style={{ fontSize: "12px", color: "#64748b" }}>
              ID: {item.id}
            </span>
          </div>
        ),
        sortable: true,
      },
      {
        header: "Şirkət",
        accessor: "company",
        sortable: true,
      },
      {
        header: "Növ",
        accessor: "type",
        render: (item: Warehouse) => typeMap[item.type],
        sortable: true,
      },
      {
        header: "Ünvan",
        accessor: "location",
        render: (item: Warehouse) => (
          <span style={{ fontSize: "13px", color: "#475569" }}>
            {item.location}
          </span>
        ),
      },
      {
        header: "Sahə / Tutum",
        accessor: "area",
        render: (item: Warehouse) => (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span>{item.area} m²</span>
            <span style={{ fontSize: "12px", color: "#64748b" }}>
              Tutum: {item.capacity} vahid
            </span>
          </div>
        ),
        sortable: true,
      },
      {
        header: "Məsul Şəxs",
        accessor: "manager",
        sortable: true,
      },
      {
        header: "Status",
        accessor: "status",
        render: (item: Warehouse) => (
          <StatusBadge
            label={item.status === "Active" ? "Aktiv" : "Deaktiv"}
            variant={item.status === "Active" ? "success" : "danger"}
          />
        ),
        sortable: true,
      },
      {
        header: "",
        accessor: "operations",
        render: () => (
          <div
            style={{
              display: "flex",
              gap: "14px",
              alignItems: "center",
              justifyContent: "center", 
              color: "#64748b", 
            }}
          >
              {/* <div style={{ cursor: "pointer", transition: "color 0.2s" }}>
                <Button className={styles.iconButton2} variant="default">
                  <PencilIcon width={20} strokeWidth={2} />
                </Button>
              </div>
            <div style={{ cursor: "pointer", transition: "color 0.2s" }}>
                <Button className={styles.iconButton3} variant="default">
                  <TrashIcon width={20} strokeWidth={2} />
                </Button>
              </div> */}
            <div style={{ cursor: "pointer", transition: "color 0.2s" }}>
              <Button className={styles.iconButton1} variant="default">
                <EyeIcon width={20} strokeWidth={2} />
              </Button>
            </div>

          

            
          </div>
        ),
        sortable: false,
      },
    ],
    [],
  );
};
