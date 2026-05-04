import React, { useMemo } from "react";
import styles from "./RelativesTable.module.css";
import { Table } from "@/shared/ui/table";
import { TableButton, TableRowActions, EmptyState } from "@/shared/ui";
import type { ColumnDef, Option } from "@/shared/types";

// Table üçün data tipi
export type RelativeItem = {
  id: string;
  degree: Option | null;
  surname: string;
  name: string;
  patronymic: string;
  birthDate: Date | null;
  birthCity: string;
  workplace: string;
  pin: string;
  address: string;
  isDeceased: boolean;
  isPensioner: boolean;
};

interface RelativesTableProps {
  data: RelativeItem[];
  onRemove: (id: string) => void;
  onEdit?: (item: RelativeItem) => void;
}

export const RelativesTable: React.FC<RelativesTableProps> = ({ 
  data, 
  onRemove, 
  onEdit 
}) => {

  const formatDate = (date: Date | null) => {
    if (!date) return "-";
    return date.toLocaleDateString("az-AZ");
  };

  const columns = useMemo<ColumnDef<RelativeItem>[]>(
    () => [
      { 
        header: "Qohumluq dərəcəsi", 
        accessor: "degree",
        sortable: false,
        render: (item) => <span>{item.degree?.fullName || "-"}</span>
      },
      { 
        header: "Soyadı", 
        accessor: "surname",
        sortable: false 
      },
      { 
        header: "Adı", 
        accessor: "name",
        sortable: false 
      },
      { 
        header: "Atasının adı", 
        accessor: "patronymic",
        sortable: false 
      },
      { 
        header: "Doğum tarixi", 
        accessor: "birthDate",
        render: (item) => formatDate(item.birthDate),
        sortable: false
      },
      { 
        header: "Doğulduğu şəhər/rayon", 
        accessor: "birthCity",
        sortable: false,
        render: (item) => <span>{item.birthCity || "-"}</span>
      },
      { 
        header: "İş yeri", 
        accessor: "workplace",
        sortable: false 
      },
      { 
        header: "FİN", 
        accessor: "pin",
        sortable: false 
      },
      { 
        header: "Yaşadığı ünvan", 
        accessor: "address",
        sortable: false 
      },
      {
        header: "",
        accessor: "actions", // "actions" bizim shared Table-da xüsusi handle olunur
        sortable: false,
        render: (item) => (
          <TableRowActions>
            <TableButton variant="edit" onClick={() => onEdit?.(item)} title="Düzəliş et" />
            <TableButton variant="delete" onClick={() => onRemove(item.id)} title="Sil" />
          </TableRowActions>
        ),
      },
    ],
    [onRemove, onEdit]
  );

  return (
    <div className={styles.wrapper}>
      {data.length === 0 ? (
        <EmptyState />
      ) : (
        <Table 
            data={data} 
            columns={columns} 
        />
      )}
    </div>
  );
};