import { TableToolbar, TableControls, TableActionGroup } from "@/shared/ui";
import { operationOptions } from "@/shared/config/tableOptions";
import type { Option } from "@/shared/types";

interface StaffTableToolbarProps {
  selectedRowCount: Option | null;
  totalCount: number;
  selectedOperation: Option | null;
  onRowCountChange: (option: Option | null) => void;
  onRefresh: () => void;
  onSearch: () => void;
  onOperationChange: (option: Option | null) => void;
}

export function StaffTableToolbar({
  selectedRowCount,
  totalCount,
  selectedOperation,
  onRowCountChange,
  onRefresh,
  onSearch,
  onOperationChange,
}: StaffTableToolbarProps) {
  return (
    <TableToolbar>
      <TableControls
        selectedRowCount={selectedRowCount}
        onRowCountChange={onRowCountChange}
        totalCount={totalCount}
      />
      <TableActionGroup
        onRefresh={onRefresh}
        onSearch={onSearch}
        onOperationChange={onOperationChange}
        operationOptions={operationOptions}
        selectedOperation={selectedOperation}
      />
    </TableToolbar>
  );
}
