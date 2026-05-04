import { useMemo } from "react";
import type { PendingRFQItem, ActiveRFQ } from "./types";
import { PlusCircleIcon, EyeIcon } from "@heroicons/react/24/outline";

interface UsePendingColumnsProps {
  onCreateRFQ: (item: PendingRFQItem) => void;
}

export const usePendingColumns = ({ onCreateRFQ }: UsePendingColumnsProps) => {
  return useMemo(
    () => [
      {
        header: "Tələb Nömrəsi",
        accessor: "prNo",
      },
      {
        header: "Malın Adı",
        accessor: "itemName",
      },
      {
        header: "Miqdar",
        accessor: "requestedQty",
      },
      {
        header: "Tələb Edən",
        accessor: "requester",
      },
      {
        header: "Şöbə",
        accessor: "department",
      },
      {
        header: "Təsdiq Tarixi",
        accessor: "approvedDate",
        render: (item: PendingRFQItem) => (
          <span>{new Date(item.approvedDate).toLocaleDateString("az-AZ")}</span>
        ),
      },
      {
        header: "",
        accessor: "actions",
        render: (item: PendingRFQItem) => (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCreateRFQ(item);
            }}
            title="Sorğu Yarat"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.4rem 0.75rem",
              color: "#3b82f6",
              backgroundColor: "#eff6ff",
              border: "1px solid #bfdbfe",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "12px",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "#dbeafe";
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "#eff6ff";
            }}
          >
            <PlusCircleIcon style={{ width: "16px", height: "16px" }} />
            Sorğu Yarat
          </button>
        ),
      },
    ],
    [onCreateRFQ],
  );
};

interface UseActiveColumnsProps {
  onDetail: (rfq: ActiveRFQ) => void;
}

export const useActiveColumns = ({ onDetail }: UseActiveColumnsProps) => {
  return useMemo(
    () => [
      {
        header: "RFQ Nömrəsi",
        accessor: "rfqNo",
      },
      {
        header: "Təsvir / Ad",
        accessor: "title",
      },
      {
        header: "Son Tarix",
        accessor: "deadline",
        render: (rfq: ActiveRFQ) => (
          <span>
            {new Date(rfq.deadline).toLocaleString("az-AZ", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        ),
      },
      {
        header: "Dəvət Olunan Şirkətlər",
        accessor: "vendorCount",
        render: (rfq: ActiveRFQ) => (
          <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>
            {rfq.vendorCount} şirkət
          </span>
        ),
      },
      {
        header: "Status",
        accessor: "status",
        render: (rfq: ActiveRFQ) => {
          let badgeClass = "";
          let label = "";

          switch (rfq.status) {
            case "draft":
              badgeClass = "bg-gray-100 text-gray-700 border-gray-200";
              label = "Qaralama";
              break;
            case "published":
              badgeClass = "bg-blue-100 text-blue-700 border-blue-200";
              label = "Yayımlanıb";
              break;
            case "closed":
              badgeClass = "bg-green-100 text-green-700 border-green-200";
              label = "Bağlanıb";
              break;
          }

          return (
            <span
              className={badgeClass}
              style={{
                padding: "2px 8px",
                borderRadius: "12px",
                fontSize: "12px",
                fontWeight: 600,
                border: "1px solid transparent",
              }}
            >
              {label}
            </span>
          );
        },
      },
      {
        header: "",
        accessor: "actions",
        render: (rfq: ActiveRFQ) => (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDetail(rfq);
            }}
            title="Ətraflı"
            style={{
              color: "#3b82f6",
              cursor: "pointer",
              background: "none",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "4px",
            }}
          >
            <EyeIcon style={{ width: "20px", height: "20px" }} />
          </button>
        ),
      },
    ],
    [onDetail],
  );
};
