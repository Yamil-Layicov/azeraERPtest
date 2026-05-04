import React, { useMemo } from "react";
import { TrashIcon, EyeIcon } from "@heroicons/react/24/outline";
import { Table } from "@/shared/ui/table";
import { EmptyState, TableButton, TableRowActions } from "@/shared/ui";
import { PermissionGuard } from "@/features/auth/components";
import { PERMISSIONS } from "@/shared/consts/permissions";
import type { ColumnDef } from "@/shared/types";
import styles from "./SalaryTable.module.css";

export type SalaryTableItem = {
  id: string | number;
  employeeId?: string | null;
  calculationYear: string | number;
  grossSalary: number;
  informalSalary: number;
  bonus: number;
  includeTradeUnionFee?: boolean;
  isSalaryIncrease?: boolean;
  effectiveDate?: string;
  rootCompanyId?: string | null;
  allCalculationData?: any;
  workPlace: string;
};

export interface SalaryTableProps {
  items: SalaryTableItem[];
  onRemove?: (id: string | number) => void;
  onEdit?: (item: SalaryTableItem) => void;
  onView?: (item: SalaryTableItem) => void;
  canManageRow?: (item: SalaryTableItem) => boolean;
  className?: string;
}

export const SalaryTable: React.FC<SalaryTableProps> = ({
  items,
  onRemove,
  onEdit,
  onView,
  canManageRow,
  className,
}) => {
  const columns = useMemo<ColumnDef<SalaryTableItem>[]>(
    () => [
      {
        header: "İş yeri və vəzifəsi",
        accessor: "workPlace",
        sortable: false,
        render: (item) => item.allCalculationData?.workPlace || "-",
      },
      {
        header: "Hesablanma ili",
        accessor: "calculationYear",
        sortable: false,
      },
      {
        header: "Əmək haqqı (GROSS)",
        accessor: "grossSalary",
        sortable: false,
        render: (item) => `${item.grossSalary} AZN`,
      },
      {
        header: "Əmək haqqı (kassa)",
        accessor: "informalSalary",
        sortable: false,
        render: (item) => `${item.informalSalary} AZN`,
      },
      {
        header: "Bonus",
        accessor: "bonus",
        sortable: false,
        render: (item) => `${item.bonus} AZN`,
      },
      {
        header: "Net Əmək Haqqı",
        accessor: "netSalary",
        sortable: false,
        render: (item) => `${item.allCalculationData?.netSalary || 0} AZN`,
      },
      {
        header: "Maaş fərqi",
        accessor: "salaryChange",
        sortable: false,
        render: (item) =>
          item.allCalculationData?.salaryChange
            ? `${item.allCalculationData?.salaryChange} AZN`
            : "-",
      },
      {
        header: "Qüvvəyə minmə tarixi",
        accessor: "effectiveDate",
        sortable: false,
        render: (item) =>
          item.effectiveDate
            ? new Date(item.effectiveDate).toLocaleDateString("az-AZ")
            : "-",
      },
      {
        header: "",
        accessor: "actions",
        sortable: false,
        render: (item) => (
          <TableRowActions>
            {onView && (
              <button
                type="button"
                className={styles.viewBtn}
                onClick={() => onView(item)}
                title="Bax"
              >
                <EyeIcon className={styles.icon} />
              </button>
            )}
            {(canManageRow?.(item) ?? true) && (
              <>
                <PermissionGuard permission={PERMISSIONS.EMPLOYEE.UPDATE}>
                  <TableButton
                    variant="edit"
                    onClick={() => onEdit?.(item)}
                    title="Düzəliş et"
                  />
                </PermissionGuard>
                <PermissionGuard permission={PERMISSIONS.EMPLOYEE.DELETE}>
                  <button
                    type="button"
                    className={styles.removeBtn}
                    onClick={() => onRemove?.(item.id)}
                    title="Sil"
                  >
                    <TrashIcon className={styles.icon} />
                  </button>
                </PermissionGuard>
              </>
            )}
          </TableRowActions>
        ),
      },
    ],
    [onRemove, onEdit, onView, canManageRow]
  );

  const getRowClassName = (item: SalaryTableItem) => {
    const status = (item as any).status || "";
    if (status === "Pending") return styles.pendingRow;
    if (status === "Approved") return styles.approvedRow;
    return "";
  };

  return (
    <div className={`${styles.wrapper} ${className ?? ""}`}>
      {items.length === 0 ? (
        <EmptyState title="Heç bir əmək haqqı məlumatı əlavə edilməyib" />
      ) : (
        <div className={styles.tableScroll}>
          <Table
            data={items}
            columns={columns}
            getRowClassName={getRowClassName}
          />
        </div>
      )}
    </div>
  );
};
