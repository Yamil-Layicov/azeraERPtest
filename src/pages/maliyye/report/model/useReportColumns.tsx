import { useMemo } from "react";
import { TableButton, TableRowActions } from "@/shared/ui";
import type { ColumnDef } from "@/shared/types";
import type { ReportTableData } from "./types";

interface UseReportColumnsProps {
  onDetail: (id: string) => void;
}

export const useReportColumns = ({ onDetail }: UseReportColumnsProps) => {
  const columns = useMemo<ColumnDef<ReportTableData>[]>(
    () => [
      {
        header: "Mənbə",
        accessor: "source",
        sortable: false,
      },
      {
        header: "Tarix",
        accessor: "date",
        sortKey: "createdDate",
      },
      {
        header: "Əvvəlki qalıq",
        accessor: "startBalance",
        sortKey: "previousBalance",
        render: (item) => `${item.startBalance.toLocaleString()} ₼`,
      },
      {
        header: "Mədaxil",
        accessor: "income",
        sortKey: "income",
        // MƏNTİQ: Əgər income varsa (0 deyilsə) göstər, yoxsa tire qoy
        render: (item) =>
          item.income !== 0 ? (
            <span style={{ color: "#10b981", fontWeight: 600 }}>
              + {item.income.toLocaleString()} ₼
            </span>
          ) : (
            <span style={{ color: "var(--text-muted)", fontWeight: 500 }}>
              -
            </span>
          ),
      },
      {
        header: "Məxaric",
        accessor: "expense",
        sortKey: "expense",
        // MƏNTİQ: Əgər expense varsa (0 deyilsə) göstər, yoxsa tire qoy
        render: (item) =>
          item.expense !== 0 ? (
            <span style={{ color: "#ef4444", fontWeight: 600 }}>
              - {item.expense.toLocaleString()} ₼
            </span>
          ) : (
            <span style={{ color: "var(--text-muted)", fontWeight: 500 }}>
              -
            </span>
          ),
      },
      {
        header: "Sonrakı qalıq",
        accessor: "endBalance",
        sortKey: "closingBalance",
        render: (item) => <strong>{item.endBalance.toLocaleString()} ₼</strong>,
      },
      {
        header: "",
        accessor: "action",
        render: (item) => (
          <TableRowActions>
            <TableButton
              variant="detail"
              title="Ətraflı bax"
              onClick={() => onDetail(item.id)}
            />
          </TableRowActions>
        ),
      },
    ],
    [onDetail],
  );

  return columns;
};
