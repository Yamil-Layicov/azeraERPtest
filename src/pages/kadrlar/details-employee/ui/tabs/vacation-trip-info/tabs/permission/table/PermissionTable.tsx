
import React, { useMemo } from "react";
import { EmptyState, Table, TableButton, TableRowActions } from "@/shared/ui";
import { TrashIcon } from "@heroicons/react/24/outline";
import type { PermissionItem } from "../types";
import type { ColumnDef } from "@/shared/types";
import { formatDateDisplayDDMMYYYY } from "@/shared/lib/utils";
import styles from "./PermissionTable.module.css";

interface PermissionTableProps {
    data: PermissionItem[];
    onDelete: (id: string) => void;
    onEdit?: (id: string) => void;
}

export const PermissionTable: React.FC<PermissionTableProps> = ({ data, onDelete, onEdit }) => {
    
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
            render: (item) => item.type === "odenisli" ? "Ödənişli" : "Ödənişsiz"
        },
        {
            header: "Səbəb",
            accessor: "reason",
            render: (item) => {
                 return item.reason === "aile" ? "Ailə vəziyyəti ilə əlaqədar" :
                        item.reason === "tehsil" ? "Təhsil" : "Digər";
            }
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
            render: (item) => (
                <TableRowActions>
                    <TableButton 
                        variant="edit" 
                        onClick={() => onEdit?.(item.id)} 
                        title="Düzəliş et"
                    />
                    <button 
                        type="button"
                        className={styles.deleteButton}
                        onClick={() => onDelete(item.id)}
                        title="Sil"
                    >
                        <TrashIcon width={20} />
                    </button>
                </TableRowActions>
            )
        }
    ], [onDelete, onEdit]);

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
