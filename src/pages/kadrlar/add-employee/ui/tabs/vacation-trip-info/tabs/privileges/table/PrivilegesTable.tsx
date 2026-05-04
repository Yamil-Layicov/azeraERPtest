import React, { useMemo } from "react";
import { EmptyState, Table, TableButton, TableRowActions } from "@/shared/ui";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useEnumItemsByCode } from "@/features/lookups/hooks";
import { PermissionGuard } from "@/features/auth/components/PermissionGuard";
import { PERMISSIONS } from "@/shared/consts/permissions";
import type { PrivilegeItem } from "../types";
import type { ColumnDef } from "@/shared/types";
import { formatDateDisplayDDMMYYYY } from "@/shared/lib/utils";
import styles from "./PrivilegesTable.module.css";

interface PrivilegesTableProps {
    data: PrivilegeItem[];
    onDelete: (id: string) => void;
    onEdit?: (id: string) => void;
}

export const PrivilegesTable: React.FC<PrivilegesTableProps> = ({ data, onDelete, onEdit }) => {
    const { options: legalBasisOptions } = useEnumItemsByCode("LegalBasis", true);

    const renderLegalBasis = (code: string) => {
        if (!code) return "—";
        const found = legalBasisOptions.find(opt => String(opt.id) === code);
        return found ? found.fullName : code;
    };

    const columns = useMemo<ColumnDef<PrivilegeItem>[]>(() => [
        {
            header: "NN",
            accessor: "id",
            width: "50px",
            render: (_item, index) => (index ?? 0) + 1
        },
        { header: "İmtiyazlar", accessor: "privilege" },
        {
            header: "Qanunvericilik üzrə əsası",
            accessor: "legalBasis",
            render: (item) => renderLegalBasis(item.legalBasis)
        },
        {
            header: "Verilmə tarixi",
            accessor: "issueDate",
            render: (item) => formatDateDisplayDDMMYYYY(item.issueDate)
        },
        {
            header: "Əlavə məzuniyyət",
            accessor: "extraVacation",
            render: (item) => String(item.extraVacation ?? 0),
        },
        {
            header: "",
            accessor: "actions",
            width: "80px",
            render: (item) => (
                <TableRowActions>
                    <PermissionGuard permission={PERMISSIONS.EMPLOYEE.UPDATE}>
                        <TableButton variant="edit" onClick={() => onEdit?.(item.id)} title="Düzəliş et" />
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
            )
        }
    ], [onDelete, onEdit]);

    if (data.length === 0) {
        return <EmptyState />;
    }

    return (
        <div className={styles.container}>
            <Table data={data} columns={columns} />
        </div>
    );
};
