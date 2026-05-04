import React, { useState, useMemo } from "react";
import styles from "./ReviewsPage.module.css";
import {
  PageHeader,
  Table,
  SuccessModal,
  FormInput,
  Pagination,
  TableControls,
  RefreshButton,
  SearchButton,
} from "@/shared/ui";
import { useReviewColumns } from "../model/useReviewColumns";
import { useTableSort } from "@/shared/hooks/useTableSort";
import ReviewDetailModal from "./components/ReviewDetailModal";
import { rowCountOptions } from "@/shared/config/tableOptions";
import type { Option } from "@/shared/types";
import { mockReviewRequests } from "../model/mockData";
import type { ReviewRequest } from "../model/types";

const ReviewsPage: React.FC = () => {
  const [requests, setRequests] = useState<ReviewRequest[]>(mockReviewRequests);
  const [activeDept, setActiveDept] = useState("Hamısı");
  const [selectedRequest, setSelectedRequest] = useState<ReviewRequest | null>(
    null,
  );
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [pageSize, setPageSize] = useState<Option>(rowCountOptions[0]!);
  const [currentPage, setCurrentPage] = useState(1);

  const { sortColumn, sortDirection, handleSort } = useTableSort({});

  const departments = useMemo(() => {
    const deptMap = new Map<string, number>();
    requests.forEach((r) => {
      deptMap.set(r.department, (deptMap.get(r.department) || 0) + 1);
    });
    return [
      { name: "Hamısı", count: requests.length },
      ...Array.from(deptMap.entries()).map(([name, count]) => ({
        name,
        count,
      })),
    ];
  }, [requests]);

  const handleDetail = (item: ReviewRequest) => {
    setSelectedRequest(item);
  };

  const handleApprove = (id: string, comment: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "approved" as const,
              note: comment || r.note,
            }
          : r,
      ),
    );
    setSelectedRequest(null);
    setSuccessMessage("Rəy verildi — tələb satınalmaya yönləndirildi.");
    setIsSuccessModalOpen(true);
  };

  const handleReject = (id: string, comment: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "rejected" as const,
              note: comment || r.note,
            }
          : r,
      ),
    );
    setSelectedRequest(null);
    setSuccessMessage("Tələb rədd edildi.");
    setIsSuccessModalOpen(true);
  };

  const handleReload = () => {
    setRequests(mockReviewRequests);
    setSearchQuery("");
    setCurrentPage(1);
    setSelectedRequest(null);
    setActiveDept("Hamısı");
  };

  const columns = useReviewColumns({ onDetail: handleDetail });

  const filteredData = useMemo(() => {
    let filtered = requests;
    if (activeDept !== "Hamısı") {
      filtered = filtered.filter((r) => r.department === activeDept);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.prNo.toLowerCase().includes(q) ||
          r.requester.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.department.toLowerCase().includes(q),
      );
    }
    return filtered;
  }, [requests, activeDept, searchQuery]);

  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortColumn as keyof ReviewRequest];
      const bVal = b[sortColumn as keyof ReviewRequest];
      if (aVal === bVal) return 0;
      const res = (aVal ?? "") > (bVal ?? "") ? 1 : -1;
      return sortDirection === "asc" ? res : -res;
    });
  }, [filteredData, sortColumn, sortDirection]);

  const itemsPerPage = Number(pageSize.id);
  const totalCount = sortedData.length;
  const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;

  const paginatedData = useMemo(() => {
    return sortedData.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    );
  }, [currentPage, itemsPerPage, sortedData]);

  return (
    <div className={styles.container}>
      <PageHeader title="Rəylər" />

      <div className={styles.contentLayout}>
        <div className={styles.deptSidebar}>
          <div className={styles.sidebarTitle}>Şöbələr</div>
          <div className={styles.deptList}>
            {departments.map((dept) => (
              <button
                key={dept.name}
                className={`${styles.deptItem} ${activeDept === dept.name ? styles.deptItemActive : ""}`}
                onClick={() => {
                  setActiveDept(dept.name);
                  setCurrentPage(1);
                }}
              >
                {dept.name}
                <span className={styles.deptCount}>{dept.count}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.tableArea}>
          <div className={styles.toolbarRow}>
            <div className={styles.toolbarLeft}>
              <TableControls
                selectedRowCount={pageSize}
                onRowCountChange={(val) => val && setPageSize(val)}
                totalCount={totalCount}
              />
            </div>
            <div className={styles.toolbarRight}>
              <RefreshButton onClick={handleReload} />
              <div
                className={`${styles.searchWrapper} ${isSearchVisible ? styles.searchVisible : ""}`}
              >
                <div className={styles.searchInput}>
                  <FormInput
                    label=""
                    id="search-reviews"
                    type="text"
                    placeholder="Axtar..."
                    value={searchQuery}
                    onChange={setSearchQuery}
                  />
                </div>
                <SearchButton
                  onClick={() => setIsSearchVisible((prev) => !prev)}
                />
              </div>
            </div>
          </div>

          <div className={styles.tableWrapper}>
            <Table
              columns={columns}
              data={paginatedData}
              onSort={handleSort}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
            />
          </div>

          <div className={styles.paginationRow}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>

      <ReviewDetailModal
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        request={selectedRequest}
        onApprove={handleApprove}
        onReject={handleReject}
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

export default ReviewsPage;
