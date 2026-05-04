import React, { useMemo } from "react";
import styles from "../relatives-table/RelativesTable.module.css";
import { Table } from "@/shared/ui/table";
import type { ColumnDef } from "@/shared/types";

export type SharedRelativeItem = {
  id: string;
  relativeFullName: string;
  relativePin: string;
  otherEmployeeRelationship: string;
  otherEmployeeFullName: string;
  otherEmployeePin: string;
};

interface SharedRelativesTableProps {
  data: SharedRelativeItem[];
}

export const SharedRelativesTable: React.FC<SharedRelativesTableProps> = ({ data }) => {
  const columns = useMemo<ColumnDef<SharedRelativeItem>[]>(
    () => [
      { 
        header: "Qohumun tam adı", 
        accessor: "relativeFullName",
        sortable: false 
      },
      { 
        header: "Qohumun fini", 
        accessor: "relativePin",
        sortable: false 
      },
      { 
        header: "Qohumluq əlaqəsi", 
        accessor: "otherEmployeeRelationship",
        sortable: false,
      },
      { 
        header: "İşçinin tam adı", 
        accessor: "otherEmployeeFullName",
        sortable: false 
      },
      { 
        header: "İşçinin fini", 
        accessor: "otherEmployeePin",
        sortable: false 
      },
    ],
    []
  );

  return (
    <div className={styles.wrapper}>
      <Table 
          data={data} 
          columns={columns} 
      />
    </div>
  );
};
