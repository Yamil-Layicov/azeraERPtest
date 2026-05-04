import React from "react";
import { EmptyState, TableButton, TableRowActions } from "@/shared/ui";
import { TrashIcon } from "@heroicons/react/24/outline";
import { formatDateDisplayDDMMYYYY } from "@/shared/lib/utils";
import styles from "./BusinessTripTable.module.css";

export interface BusinessTripItem {
    id: string;
    destination: string;
    reason: string;
    startDate: Date;
    endDate: Date;
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
                    {data.map((item, index) => (
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
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
