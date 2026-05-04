import { useMemo, useState } from "react";
import { Table, StatusBadge, Pagination, TableControls } from "@/shared/ui";
import { rowCountOptions } from "@/shared/config/tableOptions";
import type { ColumnDef, Option } from "@/shared/types";
import styles from "../ProfileSettings.module.css";

interface LoginHistoryItem {
  id: string;
  date: string;
  device: string;
  ip: string;
  location: string;
  status: "success" | "warning" | "danger" | "info" | "neutral";
  statusLabel: string;
}

const MOCK_HISTORY: LoginHistoryItem[] = [
  {
    id: "1",
    date: "04.03.2026 14:20",
    device: "Chrome (Windows 11)",
    ip: "192.168.1.45",
    location: "Bakı, Azərbaycan",
    status: "success",
    statusLabel: "Uğurlu",
  },
  {
    id: "2",
    date: "03.03.2026 10:15",
    device: "Safari (iPhone 15 Pro)",
    ip: "172.20.10.2",
    location: "Sumqayıt, Azərbaycan",
    status: "success",
    statusLabel: "Uğurlu",
  },
  {
    id: "3",
    date: "02.03.2026 22:45",
    device: "Firefox (Ubuntu)",
    ip: "85.132.78.21",
    location: "Gəncə, Azərbaycan",
    status: "danger",
    statusLabel: "Uğursuz",
  },
  {
    id: "4",
    date: "01.03.2026 09:00",
    device: "Chrome (Windows 11)",
    ip: "192.168.1.45",
    location: "Bakı, Azərbaycan",
    status: "success",
    statusLabel: "Uğurlu",
  },
  {
    id: "5",
    date: "28.02.2026 18:30",
    device: "Chrome (MacOS Sonoma)",
    ip: "77.95.20.114",
    location: "Bakı, Azərbaycan",
    status: "warning",
    statusLabel: "Şübhəli",
  },
];

export const HistoryInfo = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRowCount, setSelectedRowCount] = useState<Option | null>(
    rowCountOptions[0] || null,
  );

  const totalItems = MOCK_HISTORY.length;
  const totalPages = 1;

  const handleRowCountChange = (value: Option | null) => {
    setSelectedRowCount(value);
    setCurrentPage(1);
  };

  const columns = useMemo<ColumnDef<LoginHistoryItem>[]>(
    () => [
      {
        header: "Tarix",
        accessor: "date",
        width: "20%",
      },
      {
        header: "Cihaz / Brauzer",
        accessor: "device",
        width: "25%",
      },
      {
        header: "IP Ünvanı",
        accessor: "ip",
        width: "20%",
      },
      {
        header: "Məkan",
        accessor: "location",
        width: "20%",
      },
      {
        header: "Status",
        accessor: "status",
        width: "15%",
        render: (item) => (
          <StatusBadge label={item.statusLabel} variant={item.status} />
        ),
      },
    ],
    [],
  );

  return (
    <div className={styles.tabContent}>
      <div className={styles.tabHeader}>
        <h2 className={styles.tabTitle}>Giriş Tarixçəsi</h2>
      </div>
      <TableControls
        selectedRowCount={selectedRowCount}
        onRowCountChange={handleRowCountChange}
        totalCount={totalItems}
      />

      <div style={{ marginTop: "1rem" }}>
        <Table data={MOCK_HISTORY} columns={columns} />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "1.5rem",
            padding: "0 0.5rem",
          }}
        >
          <TableControls
            selectedRowCount={selectedRowCount}
            onRowCountChange={handleRowCountChange}
            totalCount={totalItems}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};
