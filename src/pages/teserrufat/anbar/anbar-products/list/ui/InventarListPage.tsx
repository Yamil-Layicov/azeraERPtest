import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  PageHeader,
  Table,
  Button,
  TableControls,
  Pagination,
  TableActionGroup,
} from "@/shared/ui";
import { ROUTES } from "@/app/routes/consts";
import { rowCountOptions } from "@/shared/config/tableOptions";
import type { Option } from "@/shared/types";
import { mockInventory } from "../model/mockData";
import { useInventarColumns } from "../model/useInventarColumns";
import { useTableSort } from "@/shared/hooks/useTableSort";
import InventorySummaryModal from "./components/InventorySummaryModal";
import type { InventoryItem } from "../model/types";
import styles from "./InventarListPage.module.css";
import Searchmodal from "./components/Searchmodal";

const InventarListPage: React.FC = () => {
  const navigate = useNavigate();
  const [data] = useState<InventoryItem[]>(mockInventory);
  const [searchQuery] = useState("");
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [summaryModalTitle, setSummaryModalTitle] = useState("");
  const [summaryModalItems, setSummaryModalItems] = useState<InventoryItem[]>(
    [],
  );
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [pageSize, setPageSize] = useState<Option>(rowCountOptions[0]!);
  const [currentPage, setCurrentPage] = useState(1);

  const openSummaryModal = (title: string, items: InventoryItem[]) => {
    setSummaryModalTitle(title);
    setSummaryModalItems(items);
    setIsSummaryModalOpen(true);
  };

  const columns = useInventarColumns();
  const sortState = useTableSort({});

  const stats = useMemo(() => {
    return {
      total: data.length,
      lowStock: data.filter((i: InventoryItem) => i.status === "lowStock")
        .length,
      outOfStock: data.filter((i: InventoryItem) => i.status === "outOfStock")
        .length,
      totalValue: 45200,
    };
  }, [data]);

  const sortedData = useMemo(() => {
    let filtered = data;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (i: InventoryItem) =>
          i.name.toLowerCase().includes(q) ||
          i.sku.toLowerCase().includes(q) ||
          i.barcode.includes(q) ||
          i.warehouse.toLowerCase().includes(q),
      );
    }

    const { sortColumn, sortDirection } = sortState;

    if (sortColumn) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[sortColumn as keyof InventoryItem];
        const bValue = b[sortColumn as keyof InventoryItem];

        if (aValue === bValue) return 0;
        const res = (aValue ?? "") > (bValue ?? "") ? 1 : -1;
        return sortDirection === "asc" ? res : -res;
      });
    }

    return filtered;
  }, [data, searchQuery, sortState]);

  const itemsPerPage = Number(pageSize.id);
  const totalCount = sortedData.length;
  const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;

  const paginatedData = useMemo(() => {
    return sortedData.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    );
  }, [currentPage, itemsPerPage, sortedData]);

  const handleSearch = () => {
    setSearchModalOpen(true);
  };

  const { sortColumn, sortDirection, handleSort } = sortState;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <PageHeader title="Anbar Məhsulları" />
        <div className={styles.buttonGroup}>
          <Button
            variant="default"
            className={styles.transferButton}
            onClick={() => navigate(ROUTES.TESERRUFAT.ANBAR.TRANSFER.LINK)}
          >
            Anbarlararasi transfer
          </Button>
          <Button
            variant="default"
            className={styles.changesButton}
            onClick={() => navigate(ROUTES.TESERRUFAT.ANBAR.CHANGES.LINK)}
          >
            Məhsul dəyişiklikləri
          </Button>
          <Button
            variant="primary"
            className={styles.addButton}
            onClick={() => navigate(ROUTES.TESERRUFAT.ANBAR.ADD.LINK)}
          >
            + Yeni
          </Button>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div
          className={`${styles.statCard} ${styles.clickableCard}`}
          onClick={() => openSummaryModal("Bütün Məhsullar (SKU)", data)}
        >
          <span className={styles.statLabel}>Ümumi SKU Sayı</span>
          <span className={styles.statValue}>{stats.total}</span>
          <span className={`${styles.statTrend} ${styles.trendNeutral}`}>
            Bütün anbarlar üzrə
          </span>
        </div>
        <div
          className={`${styles.statCard} ${styles.clickableCard}`}
          onClick={() =>
            openSummaryModal(
              "Kritik Səviyyədə Olan Məhsullar",
              data.filter((i) => i.status === "lowStock"),
            )
          }
        >
          <span className={styles.statLabel}>Kritik Səviyyə (Azalıb)</span>
          <span className={styles.statValue} style={{ color: "#f59e0b" }}>
            {stats.lowStock}
          </span>
          <span className={`${styles.statTrend} ${styles.trendNegative}`}>
            Sifariş verilməlidir
          </span>
        </div>
        <div
          className={`${styles.statCard} ${styles.clickableCard}`}
          onClick={() =>
            openSummaryModal(
              "Bitmiş Məhsullar",
              data.filter((i) => i.status === "outOfStock"),
            )
          }
        >
          <span className={styles.statLabel}>Bitmiş Məhsullar</span>
          <span className={styles.statValue} style={{ color: "#ef4444" }}>
            {stats.outOfStock}
          </span>
          <span className={`${styles.statTrend} ${styles.trendNegative}`}>
            Təcili tədarük lazımdır
          </span>
        </div>
        <div
          className={`${styles.statCard} ${styles.clickableCard}`}
          onClick={() => openSummaryModal("Anbar Dəyəri Üzrə Məhsullar", data)}
        >
          <span className={styles.statLabel}>Ümumi Anbar Dəyəri</span>
          <span className={styles.statValue}>
            {stats.totalValue.toLocaleString()} AZN
          </span>
          <span className={`${styles.statTrend} ${styles.trendPositive}`}>
            +2.4%Keçən aydan
          </span>
        </div>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableToolbar}>
          <div className={styles.toolbarLeft}>
            <div className={styles.toolbarRight}>
              <TableControls
                selectedRowCount={pageSize}
                onRowCountChange={(val) => {
                  if (val) {
                    setPageSize(val);
                    setCurrentPage(1);
                  }
                }}
                totalCount={totalCount}
              />
            </div>
          </div>
          <div className={styles.searchWrapper}>
            <TableActionGroup onRefresh={() => {}} onSearch={handleSearch} />
          </div>
        </div>

        <Table
          columns={columns}
          data={paginatedData}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
        <div className={styles.paginationRow}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      <InventorySummaryModal
        isOpen={isSummaryModalOpen}
        onClose={() => setIsSummaryModalOpen(false)}
        title={summaryModalTitle}
        items={summaryModalItems}
      />
      <Searchmodal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </div>
  );
};

export default InventarListPage;
