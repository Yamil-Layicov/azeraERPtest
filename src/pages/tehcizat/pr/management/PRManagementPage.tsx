import React, { useState, useMemo } from "react";
import styles from "./PRManagementPage.module.css";
import {
  PageHeader,
  Table,
  Pagination,
  TableToolbar,
  TableControls,
  SuccessModal,
  FormInput,
  RefreshButton,
  SearchButton,
} from "@/shared/ui";
import { usePRColumns } from "../list/model/usePRColumns";
import { mockPRs } from "../list/model/mockData";
import { useTableSort } from "@/shared/hooks/useTableSort";
import { PRManagementAside } from "./ui/components/PRManagementAside";
import { RejectReasonModal } from "./ui/components/RejectReasonModal";
import type { PurchaseRequest } from "../list/model/types";
import { rowCountOptions } from "@/shared/config/tableOptions";
import type { Option } from "@/shared/types";
import { useMediaQuery } from "@/shared/lib/hooks/useMediaQuery";
import { Modal } from "@/shared/ui/modal/base";

const departments = [
  { id: "all", label: "Bütün sorğular" },
  { id: "İT", label: "İT" },
  { id: "HR", label: "HR" },
  { id: "Tikinti", label: "Tikinti" },
  { id: "Təsərrüfat", label: "Təsərrüfat" },
  { id: "Maliyyə", label: "Maliyyə" },
];

const PRManagementPage: React.FC = () => {
  const [prs, setPrs] = useState<PurchaseRequest[]>(mockPRs);
  const [selectedPR, setSelectedPR] = useState<PurchaseRequest | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [pageSize, setPageSize] = useState<Option>(rowCountOptions[0]!);

  const isMobile = useMediaQuery("(max-width: 768px)");

  const { sortColumn, sortDirection, handleSort } = useTableSort({});
  const [currentPage, setCurrentPage] = useState(1);

  const handleDetail = (pr: PurchaseRequest) => {
    setSelectedPR(pr);
  };

  const handleApprove = (id: string) => {
    setPrs((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: "approved" as const } : p,
      ),
    );
    if (selectedPR && selectedPR.id === id) {
      setSelectedPR({ ...selectedPR, status: "approved" as const });
    }
    setSuccessMessage("Satınalma tələbi müvəffəqiyyətlə təsdiqləndi.");
    setIsSuccessModalOpen(true);
  };

  const handleOpenRejectModal = () => {
    setIsRejectModalOpen(true);
  };

  const handleConfirmReject = (reason: string) => {
    if (!selectedPR) return;

    setPrs((prev) =>
      prev.map((p) =>
        p.id === selectedPR.id
          ? { ...p, status: "rejected" as const, rejectReason: reason }
          : p,
      ),
    );

    setSelectedPR({ ...selectedPR, status: "rejected" as const });
    setIsRejectModalOpen(false);
    setSuccessMessage("Satınalma tələbi rədd edildi.");
    setIsSuccessModalOpen(true);
  };

  const handleReload = () => {
    setPrs(mockPRs);
    setSearchQuery("");
    setCurrentPage(1);
    setSelectedPR(null);
    setActiveTab("all");
  };

  const handleSearchToggle = () => {
    setIsSearchVisible((prev) => !prev);
  };

  const columns = usePRColumns({
    onDetail: handleDetail,
  });

  const filteredByTabAndSearch = useMemo(() => {
    let filtered = prs;

    if (activeTab !== "all") {
      filtered = filtered.filter((p) => p.department === activeTab);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.prNo.toLowerCase().includes(query) ||
          p.requester.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.department.toLowerCase().includes(query),
      );
    }

    return filtered;
  }, [prs, activeTab, searchQuery]);

  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredByTabAndSearch;

    return [...filteredByTabAndSearch].sort((a, b) => {
      const aValue = a[sortColumn as keyof PurchaseRequest];
      const bValue = b[sortColumn as keyof PurchaseRequest];

      if (aValue === bValue) return 0;
      const res = (aValue ?? "") > (bValue ?? "") ? 1 : -1;
      return sortDirection === "asc" ? res : -res;
    });
  }, [filteredByTabAndSearch, sortColumn, sortDirection]);

  const itemsPerPage = Number(pageSize.id);
  const totalCount = sortedData.length;
  const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;

  const paginatedData = useMemo(() => {
    return sortedData.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    );
  }, [currentPage, itemsPerPage, sortedData]);

  const departmentStats = useMemo(() => {
    const stats: Record<string, number> = {};
    departments.forEach((dept) => {
      stats[dept.id] = 0;
    });

    prs.forEach((pr) => {
      const current = stats[pr.department];
      if (current !== undefined) {
        stats[pr.department] = current + 1;
      }
      const currentAll = stats.all;
      if (currentAll !== undefined) {
        stats.all = currentAll + 1; 
      }
    });

    return departments.map((dept) => ({
      ...dept,
      count: stats[dept.id] || 0,
    }));
  }, [prs]);

  return (
    <div className={styles.container}>
      <PageHeader title="Tələblərin İdarə Edilməsi (Admin)" />

      <div className={styles.tabsContainer}>
        {departmentStats.map((dept) => (
          <button
            key={dept.id}
            className={`${styles.tab} ${activeTab === dept.id ? styles.activeTab : ""}`}
            onClick={() => {
              setActiveTab(dept.id);
              setCurrentPage(1);
              setSelectedPR(null); 
            }}
          >
            {dept.label}
            <span className={styles.tabBadge}>{dept.count}</span>
          </button>
        ))}
      </div>

        <div className={styles.contentWrapper}>
        <div className={styles.leftPanel}>
          <TableToolbar>
            <div className={styles.leftGroup}>
              <TableControls
                selectedRowCount={pageSize}
                onRowCountChange={(val) => val && setPageSize(val)}
                totalCount={totalCount}
              />
            </div>

            <div className={styles.rightGroup}>
              <RefreshButton onClick={handleReload} />
              <div
                className={`${styles.searchWrapper} ${isSearchVisible ? styles.searchVisible : ""}`}
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
          </TableToolbar>

          <div className={styles.tableWrapper + " custom-scrollbar"}>
            <Table
              columns={columns}
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

        {!isMobile && (
          <div className={styles.rightPanel}>
            {selectedPR ? (
              <PRManagementAside
                pr={selectedPR}
                onClose={() => setSelectedPR(null)}
                onApprove={handleApprove}
                onReject={handleOpenRejectModal}
              />
            ) : (
              <div className={styles.emptyState}>
                <p>
                  Əməliyyat aparmaq üçün <br /> sol tərəfdən seçim edin
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {isMobile && selectedPR && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedPR(null)}
          title={`Tələb: ${selectedPR.prNo}`}
          size="md"
        >
          <PRManagementAside
            pr={selectedPR}
            onClose={() => setSelectedPR(null)}
            onApprove={handleApprove}
            onReject={handleOpenRejectModal}
          />
        </Modal>
      )}

      <RejectReasonModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onConfirm={handleConfirmReject}
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

export default PRManagementPage;
