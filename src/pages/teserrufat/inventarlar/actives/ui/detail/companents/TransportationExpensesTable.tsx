import { Table } from "@/shared/ui";
import type { ColumnDef } from "@/shared/types";
import styles from "./TransportationExpensesTable.module.css";
import AddExpenseModal from "./AddExpenseModal";
import { useState } from "react";
import { EyeIcon } from "@heroicons/react/24/outline";
import { Button } from "@mui/material";

interface ExpenseRow {
  date: string;
  type: string;
  vendor: string;
  amount: string;
}

const mockData: ExpenseRow[] = [
  { date: "12.04.2026", type: "Yanacaq", vendor: "SOCAR", amount: "45.00 AZN" },
  {
    date: "10.04.2026",
    type: "Təmir",
    vendor: "AvtoServis",
    amount: "120.00 AZN",
  },
  {
    date: "05.04.2026",
    type: "Yuyulma",
    vendor: "CleanCar",
    amount: "15.00 AZN",
  },
];

const columns: ColumnDef<ExpenseRow>[] = [
  { header: "Tarix", accessor: "date" },
  { header: "Tip", accessor: "type" },
  { header: "Vendor", accessor: "vendor" },
  { header: "Xərc", accessor: "amount" },
  {
    header: "",
    accessor: "action",
    render: () => (
      <Button variant="outlined" className={styles.viewBtn}>
        <EyeIcon />
      </Button>
    ),
  },
];

export default function TransportationExpensesTable() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className={styles.expenseSection}>
      <div className={styles.expenseHeader}>
        <h3 className={styles.expenseTitle}>Nəqliyyat xərcləri</h3>
        <button
          className={styles.addExpenseBtn}
          onClick={() => setIsModalOpen(true)}
        >
          Əlavə et
        </button>
      </div>
      <div className={styles.expenseTableWrapper}>
        <Table data={mockData} columns={columns} />
      </div>
      <AddExpenseModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
