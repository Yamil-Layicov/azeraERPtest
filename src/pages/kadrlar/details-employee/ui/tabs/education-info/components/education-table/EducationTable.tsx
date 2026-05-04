import React from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import type { Option } from "@/shared/types";
import { EmptyState, TableButton, TableRowActions } from "@/shared/ui";
import styles from "./EducationTable.module.css";

export type EducationTableItem = {
  id: number;
  educationLevel: Option | null;
  institution: Option | null;
  specialty: string;
  entryDate: Date | null;
  graduationDate: Date | null;
  diplomaSerialNumber: string;
};

const formatYear = (date: Date | null): string => {
  if (!date) return "—";
  return String(date.getFullYear());
};

export interface EducationTableProps {
  items: EducationTableItem[];
  onRemove?: (id: number) => void;
}

export const EducationTable: React.FC<EducationTableProps> = ({ items, onRemove }) => {
  return (
    <div className={styles.wrapper}>
      {items.length === 0 ? (
        <EmptyState />
      ) : (
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Təhsil pilləsi</th>
            <th className={styles.th}>Təhsil müəssisəsinin adı</th>
            <th className={styles.th}>İxtisası</th>
            <th className={styles.th}>Daxil olduğu tarix</th>
            <th className={styles.th}>Bitirdiyi tarix</th>
            <th className={styles.th}>Diplom seriyası və nömrəsi</th>
            {onRemove && <th className={styles.thAction} />}
          </tr>
        </thead>
        <tbody>
          {items.map((row) => (
            <tr key={row.id} className={styles.tr}>
              <td className={styles.td}>{row.educationLevel?.fullName ?? "—"}</td>
              <td className={styles.td}>{row.institution?.fullName ?? "—"}</td>
              <td className={styles.td}>{row.specialty || "—"}</td>
              <td className={styles.td}>{formatYear(row.entryDate)}</td>
              <td className={styles.td}>{formatYear(row.graduationDate)}</td>
              <td className={styles.td}>{row.diplomaSerialNumber || "—"}</td>
              {onRemove && (
                <td className={styles.tdAction}>
                  <TableRowActions>
                    <TableButton variant="edit" onClick={() => {}} title="Düzəliş et" />
                    <button
                      type="button"
                      className={styles.removeBtn}
                      onClick={() => onRemove(row.id)}
                      title="Sil"
                    >
                      <TrashIcon className={styles.icon} />
                    </button>
                  </TableRowActions>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      )}
    </div>
  );
};
