import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./RFQPage.module.css";
import {
  PageHeader,
  Table,
  Pagination,
  TableControls,
  FormInput,
  RefreshButton,
  SearchButton,
  SuccessModal,
} from "@/shared/ui";
import { mockPendingItems, mockActiveRFQs } from "../model/mockData";
import { usePendingColumns, useActiveColumns } from "../model/useRFQColumns";
import { useTableSort } from "@/shared/hooks/useTableSort";
import { rowCountOptions } from "@/shared/config/tableOptions";
import type { Option } from "@/shared/types";
import CreateRFQModal from "./components/CreateRFQModal";
import type { PendingRFQItem, ActiveRFQ } from "../model/types";

const RFQPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"pending" | "active">("pending");
  const [pendingItems, setPendingItems] = useState(mockPendingItems);
  const [activeRFQs, setActiveRFQs] = useState(mockActiveRFQs);

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [pageSize, setPageSize] = useState<Option>(rowCountOptions[0]!);
  const [currentPage, setCurrentPage] = useState(1);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPendingItem, setSelectedPendingItem] =
    useState<PendingRFQItem | null>(null);

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const { sortColumn, sortDirection, handleSort } = useTableSort({});

  const handleCreateRFQClick = (item: PendingRFQItem) => {
    setSelectedPendingItem(item);
    setIsCreateModalOpen(true);
  };

  const handleActiveRFQDetail = (rfq: ActiveRFQ) => {
    navigate(`/tehcizat/satinalma/rfq/detail/${rfq.id}`);
  };
  const handleCreateSubmit = (rfqData: any) => {
    if (!selectedPendingItem) return;

    const newRFQ: ActiveRFQ = {
      id: `rfq-${Date.now()}`,
      rfqNo: `RFQ-26-00${activeRFQs.length + 1}`,
      title: selectedPendingItem.itemName,
      deadline: rfqData.deadline,
      vendorCount: rfqData.vendors.length,
      status: "published",
    };

    setActiveRFQs([newRFQ, ...activeRFQs]);

    setPendingItems((prev) =>
      prev.filter((p) => p.id !== selectedPendingItem.id)
    );

    setIsCreateModalOpen(false);
    setSelectedPendingItem(null);
    setSuccessMessage(
      "Təklif sorğusu (RFQ) uğurla yaradıldı və şirkətlərə göndərildi."
    );
    setIsSuccessModalOpen(true);
  };

  const pendingCols = usePendingColumns({
    onCreateRFQ: handleCreateRFQClick,
  }) as any;
  const activeCols = useActiveColumns({
    onDetail: handleActiveRFQDetail,
  }) as any;

  const filteredData = useMemo(() => {
    const data = activeTab === "pending" ? pendingItems : activeRFQs;
    if (!searchQuery) return data;

    const query = searchQuery.toLowerCase();
    return (data as any[]).filter((item) => {
      if (activeTab === "pending") {
        const p = item as PendingRFQItem;
        return (
          p.prNo.toLowerCase().includes(query) ||
          p.itemName.toLowerCase().includes(query) ||
          p.requester.toLowerCase().includes(query)
        );
      } else {
        const r = item as ActiveRFQ;
        return (
          r.rfqNo.toLowerCase().includes(query) ||
          r.title.toLowerCase().includes(query)
        );
      }
    });
  }, [activeTab, pendingItems, activeRFQs, searchQuery]);

  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;
    return [...filteredData].sort((a: any, b: any) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];
      if (aValue === bValue) return 0;
      const res = (aValue ?? "") > (bValue ?? "") ? 1 : -1;
      return sortDirection === "asc" ? res : -res;
    });
  }, [filteredData, sortColumn, sortDirection]);

  const itemsPerPage = Number(pageSize.id);
  const totalCount = sortedData.length;
  const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;

  const paginatedData = useMemo(() => {
    return sortedData.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [currentPage, itemsPerPage, sortedData]);

  const handleSearchToggle = () => setIsSearchVisible(!isSearchVisible);

  const handleReload = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  return (
    <div className={styles.container}>
      <PageHeader
        title="Təklif Sorğuları (RFQ)"
        description="Gözləyən tələblər üçün qiymət sorğuları yaradın və aktiv sorğuları idarə edin."
      />

      <div className={styles.tabsContainer}>
        <button
          className={`${styles.tab} ${
            activeTab === "pending" ? styles.activeTab : ""
          }`}
          onClick={() => {
            setActiveTab("pending");
            setCurrentPage(1);
          }}
        >
          Gözləyən Tələblər
          <span className={styles.tabBadge}>{pendingItems.length}</span>
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "active" ? styles.activeTab : ""
          }`}
          onClick={() => {
            setActiveTab("active");
            setCurrentPage(1);
          }}
        >
          Aktiv Sorğular
          <span className={styles.tabBadge}>{activeRFQs.length}</span>
        </button>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.toolbarRow}>
          <div className={styles.toolbarGroup}>
            <TableControls
              selectedRowCount={pageSize}
              onRowCountChange={(val) => val && setPageSize(val)}
              totalCount={totalCount}
            />
          </div>
          <div className={styles.toolbarGroup}>
            <RefreshButton onClick={handleReload} />
            <div
              className={`${styles.searchWrapper} ${
                isSearchVisible ? styles.searchVisible : ""
              }`}
            >
              <div className={styles.searchInput}>
                <FormInput
                  label=""
                  id="search"
                  type="text"
                  placeholder="Axtar..."
                  value={searchQuery}
                  onChange={setSearchQuery}
                />
              </div>
              <SearchButton onClick={handleSearchToggle} />
            </div>
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <Table
            columns={activeTab === "pending" ? pendingCols : activeCols}
            data={paginatedData}
            onSort={handleSort}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
          />
        </div>

        <div className={styles.pagination}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      <CreateRFQModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        pendingItem={selectedPendingItem}
        onSubmit={handleCreateSubmit}
      />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="Uğurlu Əməliyyat"
        text={successMessage}
      />
    </div>
  );
};

export default RFQPage;
