import { TableButton, TableRowActions } from "@/shared/ui";
import { CheckIcon } from "@heroicons/react/24/solid";
import type { PositionEntry } from "@/features/kadrlar/positions";

interface UsePositionsColumnsProps {
  onEdit: (item: PositionEntry) => void;
  onDelete: (id: string) => void;
  disabled?: boolean;
}

export const usePositionsColumns = ({ onEdit, onDelete, disabled = false }: UsePositionsColumnsProps) => {
  
  const renderCheckStatus = (isActive: boolean) => {
    return isActive ? (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <CheckIcon width={20} style={{ color: '#16a34a' }} />
      </div>
    ) : (
      <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>-</div>
    );
  };

  return [
    {
      header: "Sira №",
      accessor: "sortOrder",
      width: "8%",
    },
    {
      header: "Vəzifə adı",
      accessor: "name",
      width: "40%",
    },
    {
      header: "Aktiv", 
      accessor: "isActive",
      width: "15%",
      render: (row: PositionEntry) => {
        return renderCheckStatus(row.isActive);
      }
    },
    {
      header: "",
      accessor: "actions",
      width: "15%",
      render: (row: PositionEntry) => (
        <TableRowActions>
          <TableButton variant="edit" onClick={() => onEdit(row)} disabled={disabled} />
          <TableButton variant="delete" onClick={() => onDelete(row.id)} disabled={disabled} />
        </TableRowActions>
      ),
    },
  ];
};