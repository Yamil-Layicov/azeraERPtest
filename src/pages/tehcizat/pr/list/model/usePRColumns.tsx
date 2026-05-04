import { useMemo } from "react";
import { StatusBadge } from "@/shared/ui";
import type { PRStatus, PurchaseRequest } from "./types";
import {
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

interface UsePRColumnsProps {
  onDetail?: (pr: PurchaseRequest) => void;
  onEdit?: (pr: PurchaseRequest) => void;
  onDelete?: (pr: PurchaseRequest) => void;
}

export const usePRColumns = ({
  onDetail,
  onEdit,
  onDelete,
}: UsePRColumnsProps) => {
  const statusMap: Record<PRStatus, { label: string; variant: any }> = {
    draft: { label: "Draft", variant: "info" },
    pending: { label: "Gözləyir", variant: "warning" },
    approved: { label: "Təsdiqləndi", variant: "success" },
    rejected: { label: "Rədd edildi", variant: "danger" },
  };

  return useMemo(
    () => [
      {
        header: "Tələb No",
        accessor: "prNo",
        sortable: true,
      },
      {
        header: "Yaranma Tarixi",
        accessor: "createdDate",
        render: (item: PurchaseRequest) => {
          const date = new Date(item.createdDate);
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
        render: (item: PurchaseRequest) => (
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
        header: "Məbləğ",
        accessor: "totalAmount",
        render: (item: PurchaseRequest) => `${item.totalAmount} AZN`,
        sortable: true,
      },
      {
        header: "Status",
        accessor: "status",
        render: (item: PurchaseRequest) => {
          const status = item.status;
          const config = statusMap[status] || {
            label: status,
            variant: "pending",
          };
          return <StatusBadge label={config.label} variant={config.variant} />;
        },
      },
      {
        header: "",
        accessor: "actions",
        render: (item: PurchaseRequest) => {
          return (
            <div
              style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}
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
              {onEdit && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.(item);
                  }}
                  title="Redaktə et"
                  style={{
                    color: "var(--warning)",
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
                  <PencilSquareIcon style={{ width: "18px", height: "18px" }} />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.(item);
                  }}
                  title="Sil"
                  style={{
                    color: "var(--danger)",
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
                    (e.currentTarget.style.backgroundColor =
                      "rgba(255,0,0,0.05)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <TrashIcon style={{ width: "18px", height: "18px" }} />
                </button>
              )}
            </div>
          );
        },
      },
    ],
    [onDetail, onEdit, onDelete, statusMap],
  );
};
