
import React, { useMemo } from "react";
import { EmptyState, Table, TableButton, TableRowActions } from "@/shared/ui";
import { TrashIcon } from "@heroicons/react/24/outline";
import type { PermissionItem } from "../types";
import type { ColumnDef } from "@/shared/types";
import { formatDateDisplayDDMMYYYY } from "@/shared/lib/utils";
import { PermissionGuard } from "@/features/auth/components/PermissionGuard";
import { PERMISSIONS } from "@/shared/consts/permissions";
import { useAddEmployeeStore } from "@/features/kadrlar/create-worker/model/useAddEmployeeStore";
import styles from "./PermissionTable.module.css";

interface PermissionTableProps {
    data: PermissionItem[];
    onDelete: (id: string) => void;
    onEdit?: (id: string) => void;
}

export const PermissionTable: React.FC<PermissionTableProps> = ({ data, onDelete, onEdit }) => {
    const globalEmployeeId = useAddEmployeeStore((state) => state.employeeId);
    
    const columns = useMemo<ColumnDef<PermissionItem>[]>(() => [
        {
            header: "NN",
            accessor: "id",
            width: "50px",
            render: (_item, index) => index !== undefined ? index + 1 : 0
        },
        {
            header: "Növü",
            accessor: "type",
            render: (item) => item.type,
        },
        {
            header: "Səbəb",
            accessor: "reason",
            render: (item) => item.reason,
        },
        {
            header: "Tarix",
            accessor: "date",
            render: (item) => formatDateDisplayDDMMYYYY(item.date)
        },
        {
            header: "Müddət",
            accessor: "duration",
            render: (item) => `${item.startTime} - ${item.endTime}`
        },
        {
            header: "Rəhbər",
            accessor: "approver"
        },
        {
            header: "Qeyd",
            accessor: "note"
        },
        {
            header: "",
            accessor: "actions",
            width: "80px",
            render: (item) => {
                const isOwner = 
                    globalEmployeeId != null && 
                    item.employeeId != null && 
                    String(item.employeeId) === String(globalEmployeeId);

                if (!isOwner) return null;

                return (
                    <TableRowActions>
                        <PermissionGuard permission={PERMISSIONS.EMPLOYEE.UPDATE}>
                            <TableButton 
                                variant="edit" 
                                onClick={() => onEdit?.(item.id)} 
                                title="Düzəliş et"
                            />
                        </PermissionGuard>
                        <PermissionGuard permission={PERMISSIONS.EMPLOYEE.DELETE}>
                            <button 
                                type="button"
                                className={styles.deleteButton}
                                onClick={() => onDelete(item.id)}
                                title="Sil"
                            >
                                <TrashIcon width={20} />
                            </button>
                        </PermissionGuard>
                    </TableRowActions>
                );
            }
        }
    ], [onDelete, onEdit, globalEmployeeId]);

    if (data.length === 0) {
        return <EmptyState />;
    }

    return (
        <div className={styles.container}>
            <Table 
                data={data}
                columns={columns}
            />
        </div>
    );
};

