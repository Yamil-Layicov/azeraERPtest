import React, { useMemo, useState, useCallback } from "react";
import {
  EmptyState,
  TableToolbar,
  TableActionGroup,
  Modal,
  TableButton,
} from "@/shared/ui";
import { Table } from "@/shared/ui/table";
import type { Option } from "@/shared/types";
import type { ColumnDef } from "@/shared/types";
import {
  operationOptions,
} from "@/shared/config/tableOptions";
import {
  useGetReportDetail,
  type ReportResponse,
} from "@/features/kadrlar/reports";
import { useExcelExport } from "@/shared/lib/hooks/useExcelExport";

interface ReportTableProps {
  hasSearched: boolean;
  isLoading?: boolean;
  reportData: ReportResponse | null;
  onRefresh?: () => void;
}

export const ReportTable: React.FC<ReportTableProps> = ({
  hasSearched,
  reportData,
  onRefresh,
}) => {
  const [selectedOperation, setSelectedOperation] = useState<Option | null>(
    null,
  );

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const getReportDetailMutation = useGetReportDetail();
  const { exportToExcel } = useExcelExport<any>();

  const handleRefresh = useCallback(() => {
    if (onRefresh) {
      onRefresh();
    }
  }, [onRefresh]);

  const handleOperationChange = (value: Option | null) => {
    setSelectedOperation(value);
    if (value?.id === "export_excel") {
      const exportColumns = columns
        .filter((col) => col.header !== "Əməliyyatlar" && col.header !== "№")
        .map((col) => ({
          header: col.header,
          accessor: String(col.accessor),
          render: col.render,
        }));

      exportToExcel({
        data: allData,
        columns: exportColumns,
        fileName: "Hesabat",
        sheetName: "Hesabat",
      });
       setTimeout(() => setSelectedOperation(null), 500);
    }
  };



  const handleEyeClick = (url: string) => {
    setIsDetailModalOpen(true);
    getReportDetailMutation.mutate(url);
  };


  const columns: ColumnDef<any>[] = useMemo(() => {
    if (!reportData?.result?.rows?.length) return [];

    const firstRow = reportData.result.rows[0];

    const dynamicColumns: ColumnDef<any>[] = [
      {
        header: "№",
        accessor: "no",
        sortable: false,
        render: (_, i) => (i ?? 0) + 1,
        width: "70px",
      },
    ];

    firstRow?.columns.forEach((col, index) => {
      dynamicColumns.push({
        header: col.key,
        accessor: `col_${index}`,
        width: col.key === "Əməliyyatlar" ? "100px" : undefined,
        render: (row: any) => {
          const value = row[`col_${index}`];
          if (
            col.key === "Əməliyyatlar" &&
            value &&
            typeof value === "string"
          ) {
            return (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <TableButton
                  onClick={() => handleEyeClick(value)}
                  variant="detail"
                  title="Dəyişə et"
                />
              </div>
            );
          }
          return value;
        },
        sortable: false,
      });
    });

    return dynamicColumns;
  }, [reportData]);

  const allData = useMemo(() => {
    if (!reportData?.result?.rows) return [];

    return reportData.result.rows.map((row) => {
      const flatRow: any = {};
      row.columns.forEach((col, index) => {
        flatRow[`col_${index}`] = col.value;
      });
      return flatRow;
    });
  }, [reportData]);
  



  if (!hasSearched) {
    return (
      <EmptyState
        title="Məlumat yoxdur"
        description="Hesabat üçün xanaları doldurun, hesabatın növünü seçin və «Axtar» düyməsinə klik edin."
      />
    );
  }

  return (
    <div style={{ position: "relative" }}>
      <TableToolbar>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        ><span></span>
       
          <TableActionGroup
            onRefresh={handleRefresh}
            onOperationChange={handleOperationChange}
            operationOptions={operationOptions}
            selectedOperation={selectedOperation}
          />
        </div>
      </TableToolbar>
      <Table<any> data={allData} columns={columns} />
    

      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Hesabat Detalları"
        size="lg"
      >
        <div style={{ padding: "20px", textAlign: "center" }}>
          {getReportDetailMutation.isPending ? (
            <p>Yüklənir...</p>
          ) : (
            <p>Məlumat yoxdur.</p>
          )}
        </div>
      </Modal>
    </div>
  );
};
