import { Table } from "@/shared/ui/table";
import type { NodeEntry } from "@/features/kadrlar/staff-table";
import type { ColumnDef } from "@/shared/types";

interface StaffTableProps {
  data: NodeEntry[];
  columns: ColumnDef<NodeEntry>[];
  orderBy: string | null;
  isDesc: boolean;
  onSort: (accessor: string, direction: "asc" | "desc") => void;
}

export function StaffTable({
  data,
  columns,
  orderBy,
  isDesc,
  onSort,
}: StaffTableProps) {
  return (
    <Table
      data={data}
      columns={columns}
      onSort={onSort}
      sortColumn={orderBy ?? undefined}
      sortDirection={isDesc ? "desc" : "asc"}
    />
  );
}
