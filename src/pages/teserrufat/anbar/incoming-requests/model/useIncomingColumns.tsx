import { useMemo } from "react";
import { StatusBadge } from "@/shared/ui";
import type { IncomingRequest, IncomingRequestStatus } from "./types";
import { EyeIcon } from "@heroicons/react/24/outline";

interface UseIncomingColumnsProps {
  onDetail?: (item: IncomingRequest) => void;
}

export const useIncomingColumns = ({ onDetail }: UseIncomingColumnsProps) => {
  const statusMap: Record<
    IncomingRequestStatus,
    { label: string; variant: any }
  > = {
    pending: { label: "Gözləyir", variant: "warning" },
    active: { label: "Aktiv (Borcunuz var)", variant: "primary" },
    closed: { label: "Bağlanıb", variant: "success" },
  };

  return useMemo(
    () => [
      {
        header: "Tələb No",
        accessor: "prNo",
        sortable: true,
      },
      {
        header: "Təsdiq Tarixi",
        accessor: "approvedDate",
        render: (item: IncomingRequest) => {
          const date = new Date(item.approvedDate);
          return date.toLocaleDateString("az-AZ");
        },
        sortable: true,
      },
      {
        header: "İstəyən Şəxs",
        accessor: "requester",
        sortable: true,
      },
      {
        header: "Şöbə",
        accessor: "department",
        sortable: true,
      },
      {
        header: "Mövzu",
        accessor: "description",
        render: (item: IncomingRequest) => (
          <div
            style={{
              maxWidth: "200px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {item.description}
          </div>
        ),
      },
      {
        header: "Vəziyyət",
        accessor: "status",
        render: (item: IncomingRequest) => {
          const config = statusMap[item.status] || {
            label: item.status,
            variant: "pending",
          };
          return <StatusBadge label={config.label} variant={config.variant} />;
        },
      },
      {
        header: "",
        accessor: "actions",
        render: (item: IncomingRequest) => (
          <div
            style={{ display: "flex", gap: "0.75rem", alignItems: "center",border:"1px solid #95bbf8ff", width:"fit-content", backgroundColor:"#e3ebfbff",borderRadius:"8px", color:"#3b82f6",boxShadow:"0 0 10px rgba(0, 0, 0, 0.1)"}}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDetail?.(item);
              }}
              title="Ətraflı bax"
              style={{
                color: "var(--primary)",
                cursor: "pointer",
                background: "none",
                border: "none",
                padding: "4px",
                display: "flex",
                alignItems: "center",
                borderRadius: "4px",
                transition: "background-color 0.2s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.05)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <EyeIcon style={{ width: "18px", height: "18px" }} />
            </button>
          </div>
        ),
      },
    ],
    [onDetail, statusMap],
  );
};
