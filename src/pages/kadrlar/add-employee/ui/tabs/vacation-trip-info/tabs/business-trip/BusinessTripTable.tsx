import React from "react";
import { EmptyState, TableButton, TableRowActions } from "@/shared/ui";
import { TrashIcon } from "@heroicons/react/24/outline";
import { formatDateDisplayDDMMYYYY } from "@/shared/lib/utils";
import { PermissionGuard } from "@/features/auth/components/PermissionGuard";
import { PERMISSIONS } from "@/shared/consts/permissions";
import { useAddEmployeeStore } from "@/features/kadrlar/create-worker/model/useAddEmployeeStore";
import styles from "./BusinessTripTable.module.css";

export interface BusinessTripItem {
    id: string;
    employeeId: string | null;
    destination: string;
    reason: string;
    startDate: Date;
    endDate: Date;
    /** İşə çıxma tarixi */
    returnToWorkDate: Date | null;
    duration: number; // calculated days
    orderDate: Date;
    orderNumber: string;
}

interface BusinessTripTableProps {
    data: BusinessTripItem[];
    onDelete: (id: string) => void;
    onEdit?: (id: string) => void;
}

export const BusinessTripTable: React.FC<BusinessTripTableProps> = ({ data, onDelete, onEdit }) => {
    const globalEmployeeId = useAddEmployeeStore((state) => state.employeeId);

    if (data.length === 0) {
        return <EmptyState />;
    }

    return (
        <div className={styles.container}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th className={`${styles.th} ${styles.thCenter}`} rowSpan={2}>NN</th>
                        <th className={styles.th} rowSpan={2}>Getdiyi yer</th>
                        <th className={styles.th} rowSpan={2}>Səbəb</th>
                        <th className={styles.th} rowSpan={2}>Başlama tarixi</th>
                        <th className={styles.th} rowSpan={2}>Bitmə tarixi</th>
                        <th className={styles.th} rowSpan={2}>İşə çıxma tarixi</th>
                        <th className={`${styles.th} ${styles.thCenter}`} rowSpan={2}>Ezamiyyət müddəti</th>
                        <th className={`${styles.th} ${styles.thCenter}`} colSpan={2}>Əmr Məlumatları</th>
                        <th className={styles.th} rowSpan={2}></th>
                    </tr>
                    <tr>
                        <th className={`${styles.th} ${styles.thCenter}`}>Nömrəsi</th>
                        <th className={`${styles.th} ${styles.thCenter}`}>Tarix</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => {
                        const isOwner = 
                            globalEmployeeId != null && 
                            item.employeeId != null && 
                            String(item.employeeId) === String(globalEmployeeId);

                        return (
                            <tr key={item.id} className={styles.tr}>
                                <td className={`${styles.td} ${styles.thCenter}`}>{index + 1}</td>
                                <td className={styles.td}>{item.destination}</td>
                                <td className={styles.td}>{item.reason}</td>
                                <td className={styles.td}>{formatDateDisplayDDMMYYYY(item.startDate)}</td>
                                <td className={styles.td}>{formatDateDisplayDDMMYYYY(item.endDate)}</td>
                                <td className={styles.td}>{formatDateDisplayDDMMYYYY(item.returnToWorkDate)}</td>
                                <td className={`${styles.td} ${styles.thCenter}`}>{item.duration} gün</td>
                                <td className={`${styles.td} ${styles.thCenter}`}>{item.orderNumber}</td>
                                <td className={`${styles.td} ${styles.thCenter}`}>{formatDateDisplayDDMMYYYY(item.orderDate)}</td>
                                <td className={`${styles.td} ${styles.actionTd}`}>
                                    {isOwner && (
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
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

