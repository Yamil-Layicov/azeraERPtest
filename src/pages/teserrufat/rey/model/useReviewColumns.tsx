import { useMemo } from "react";
import type { ReviewRequest, ReviewStatus } from "./types";
import { StatusBadge } from "@/shared/ui";
import { EyeIcon } from "@heroicons/react/24/outline";

interface UseReviewColumnsProps {
  onDetail?: (item: ReviewRequest) => void;
}

export const useReviewColumns = ({ onDetail }: UseReviewColumnsProps) => {
  const statusMap: Record<ReviewStatus, { label: string; variant: any }> = {
    pending: { label: "Gözləyir", variant: "warning" },
    approved: { label: "Təsdiqləndi", variant: "success" },
    rejected: { label: "Rədd edildi", variant: "danger" },
  };

  return useMemo(
    () => [
      {
        header: "PR №",
        accessor: "prNo",
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
        header: "Rədd Edilən Mənbə",
        accessor: "rejectedFrom",
        sortable: true,
      },
      {
        header: "Rədd Tarixi",
        accessor: "rejectedDate",
        sortable: true,
        render: (item: ReviewRequest) =>
          new Date(item.rejectedDate).toLocaleDateString("az-AZ"),
      },
      {
        header: "Vəziyyət",
        accessor: "status",
        sortable: true,
        render: (item: ReviewRequest) => {
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
        render: (item: ReviewRequest) => (
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
                color:"#3b82f6",
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
