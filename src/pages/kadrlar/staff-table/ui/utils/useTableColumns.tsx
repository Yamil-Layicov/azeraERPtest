import { useMemo, type ReactNode } from "react";
import { TableButton, TableRowActions } from "@/shared/ui";
import type { NodeEntry } from "@/features/kadrlar/staff-table";
import type { ColumnDef } from "@/shared/types";
import { PermissionGuard } from "@/features/auth/components/PermissionGuard";
import { PERMISSIONS } from "@/shared/consts/permissions";
import { renderCheckStatus } from "./renderCheckStatus";
import { truncateText } from "./truncateText";
import { TruncatedTextTooltip } from "../components/tooltip/TruncatedTextTooltip";

interface UseTableColumnsProps {
  companiesMap: Map<string, string>;
  positionMap: Map<string, string>;
  staffCategoryMap: Map<string, string>;
  onEdit: (row: NodeEntry) => void;
  onDelete: (row: NodeEntry) => void;
}

const wrapStyle = {
  whiteSpace: "normal" as const, 
  wordBreak: "break-word" as const, 
  lineHeight: "1.4", 
  overflowWrap: "anywhere" as const,
};

export function useTableColumns({
  companiesMap,
  positionMap,
  staffCategoryMap,
  onEdit,
  onDelete,
}: UseTableColumnsProps): ColumnDef<NodeEntry>[] {
  return useMemo(
    () => [
      { 
        header: "İşçi", 
        accessor: "employeeName" as const,
        width: "12%",
        render: (row: NodeEntry) => (
          <div style={wrapStyle}>
            {row.employeeName || "-"}
          </div>
        )
      },
      {
        header: "Şöbə",
        accessor: "subCompanyId" as const,
        width: "15%",
        render: (row: NodeEntry): ReactNode => {
          if (!row.subCompanyId) return "-";
          const fullText = companiesMap.get(String(row.subCompanyId)) ?? "-";
          if (fullText === "-") return "-";
          const truncatedText = truncateText(fullText, 30);
          return (
            <TruncatedTextTooltip
              text={fullText}
              truncatedText={truncatedText}
              maxLength={30}
            />
          );
        },
      },
      {
        header: "Vəzifə",
        accessor: "positionId" as const,
        width: "130px",
        render: (row: NodeEntry): ReactNode => (
          <div style={wrapStyle}>
            {row.positionName || "-"}
          </div>
        ),
      },
      {
        header: "Əvəz olunan şəxs",
        accessor: "relatedName" as const,
        width: "12%", 
        render: (row: NodeEntry) => (
           <div style={wrapStyle}>
             {row.relatedName ?? "-"}
           </div>
        ),
      },
      {
        header: "Heyət",
        accessor: "staffCategoriesCode" as const,
        width: "200px",
        render: (row: NodeEntry) => (
          <div >
            {row.staffCategoriesCode ? staffCategoryMap.get(String(row.staffCategoriesCode)) ?? row.staffCategoriesCode : "-"}
          </div>
        ),
      },
      {
        header: "Əsas",
        accessor: "isMain" as const,
        width: "56px",
        render: (row: NodeEntry) => renderCheckStatus(row.isMain),
      },
      {
        header: "Aktiv",
        accessor: "isActive" as const,
        width: "56px",
        render: (row: NodeEntry) => renderCheckStatus(row.isActive),
      },
      {
        header: "",
        accessor: "action" as const,
        width: "80px",
        render: (row: NodeEntry) => (
          <TableRowActions>
            <TableButton variant="detail" onClick={() => onEdit(row)} />
            <PermissionGuard permission={PERMISSIONS.NODE.DELETE}>
              <TableButton variant="delete" onClick={() => onDelete(row)} />
            </PermissionGuard>
          </TableRowActions>
        ),
      },
    ],
    [companiesMap, positionMap, staffCategoryMap, onEdit, onDelete]
  );
}