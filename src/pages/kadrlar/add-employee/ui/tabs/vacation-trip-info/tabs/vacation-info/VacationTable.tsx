import React from "react";
import { EmptyState, TableButton, TableRowActions } from "@/shared/ui";
import { TrashIcon } from "@heroicons/react/24/outline";
import { formatDateDisplayDDMMYYYY } from "@/shared/lib/utils";
import { PermissionGuard } from "@/features/auth/components/PermissionGuard";
import { PERMISSIONS } from "@/shared/consts/permissions";
import { useAddEmployeeStore } from "@/features/kadrlar/create-worker/model/useAddEmployeeStore";
import styles from "./VacationTable.module.css";
import type { Option } from "@/shared/types";

export interface VacationItem {
    id: string;
    employeeId: string | null;
    type: Option;
    /** İş ili: iki sətir "dd.mm.yyyy -\ndd.mm.yyyy" və ya "-" */
    workYearDisplay: string;
    startDate: Date;
    endDate: Date;
    returnToWorkDate: Date | null;
    entitlementMain: string;
    entitlementExtra: string;
    usedMain: string;
    usedExtra: string;
    remainingMain: string;
    remainingExtra: string;
    orderNumber: string;
    orderDate: Date;
}

interface VacationTableProps {
    data: VacationItem[];
    onDelete: (id: string) => void;
    onEdit?: (id: string) => void;
}

const fmtDate = (d: Date | null): string => formatDateDisplayDDMMYYYY(d);

export const VacationTable: React.FC<VacationTableProps> = ({ data, onDelete, onEdit }) => {
    const globalEmployeeId = useAddEmployeeStore((state) => state.employeeId);

    if (data.length === 0) {
        return <EmptyState />;
    }

    return (
        <div className={styles.container}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th className={styles.th} rowSpan={2}>NN</th>
                        <th className={styles.th} rowSpan={2}>Məzuniyyət növü</th>
                        <th className={styles.th} rowSpan={2}>İş ili</th>
                        <th className={styles.th} rowSpan={2}>Başlama tarixi</th>
                        <th className={styles.th} rowSpan={2}>Bitmə tarixi</th>
                        <th className={styles.th} rowSpan={2}>İşə çıxma tarixi</th>
                        <th className={`${styles.th} ${styles.thCenter} ${styles.thHeadingTwoLines}`} colSpan={2}>
                            Əmək məzuniyyəti hüququ
                            <br />
                            (gün)
                        </th>
                        <th className={`${styles.th} ${styles.thCenter} ${styles.thHeadingTwoLines}`} colSpan={2}>
                            Əmək məzuniyyətindən istifadə
                            <br />
                            olunan günlər
                        </th>
                        <th className={`${styles.th} ${styles.thCenter}`} colSpan={2}>Qalıq</th>
                        <th className={`${styles.th} ${styles.thCenter}`} colSpan={2}>Əmr Məlumatları</th>
                        <th className={styles.th} rowSpan={2}>Əməliyyat</th>
                    </tr>
                    <tr>
                        <th className={`${styles.th} ${styles.thCenter}`}>Əsas</th>
                        <th className={`${styles.th} ${styles.thCenter}`}>Əlavə</th>
                        <th className={`${styles.th} ${styles.thCenter}`}>Əsas</th>
                        <th className={`${styles.th} ${styles.thCenter}`}>Əlavə</th>
                        <th className={`${styles.th} ${styles.thCenter}`}>Əsas</th>
                        <th className={`${styles.th} ${styles.thCenter}`}>Əlavə</th>
                        <th className={`${styles.th} ${styles.thCenter}`}>Nömrə</th>
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
                                <td className={styles.td}>{item.type.fullName ?? "-"}</td>
                                <td className={`${styles.td} ${styles.workYearCell}`}>{item.workYearDisplay}</td>
                                <td className={styles.td}>{fmtDate(item.startDate)}</td>
                                <td className={styles.td}>{fmtDate(item.endDate)}</td>
                                <td className={styles.td}>{fmtDate(item.returnToWorkDate)}</td>
                                <td className={`${styles.td} ${styles.thCenter}`}>{item.entitlementMain}</td>
                                <td className={`${styles.td} ${styles.thCenter}`}>{item.entitlementExtra}</td>
                                <td className={`${styles.td} ${styles.thCenter}`}>{item.usedMain}</td>
                                <td className={`${styles.td} ${styles.thCenter}`}>{item.usedExtra}</td>
                                <td className={`${styles.td} ${styles.thCenter}`}>{item.remainingMain}</td>
                                <td className={`${styles.td} ${styles.thCenter}`}>{item.remainingExtra}</td>
                                <td className={`${styles.td} ${styles.thCenter}`}>{item.orderNumber || "-"}</td>
                                <td className={`${styles.td} ${styles.thCenter}`}>{fmtDate(item.orderDate)}</td>
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

