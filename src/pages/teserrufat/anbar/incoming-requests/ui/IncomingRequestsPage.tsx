import React, { useState, useMemo } from "react";
import styles from "./IncomingRequestsPage.module.css";
import {
  PageHeader,
  Table,
  SuccessModal,
  Pagination,
  TableControls,
  RefreshButton,
  SearchButton,
} from "@/shared/ui";
import { useIncomingColumns } from "../model/useIncomingColumns";
import { mockIncomingRequests } from "../model/mockData";
import { useTableSort } from "@/shared/hooks/useTableSort";
import type { IncomingRequest, IncomingRequestStatus } from "../model/types";
import IncomingDetailModal, {
  type ProductDecisionItem,
} from "./components/IncomingDetailModal";
import IncomingFilterModal from "./components/IncomingFilterModal";
import { rowCountOptions } from "@/shared/config/tableOptions";
import type { Option } from "@/shared/types";

const IncomingRequestsPage: React.FC = () => {
  const [requests, setRequests] =
    useState<IncomingRequest[]>(mockIncomingRequests);
  const [activeDept, setActiveDept] = useState("Hamısı");
  const [selectedRequest, setSelectedRequest] =
    useState<IncomingRequest | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatuses, setFilterStatuses] = useState<IncomingRequestStatus[]>(
    ["pending", "active"],
  );
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
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

  const handleDetail = (item: IncomingRequest) => {
    setSelectedRequest(item);
  };

  const handleSubmitDecisions = (
    requestId: string,
    decisions: ProductDecisionItem[],
    note?: string,
  ) => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id !== requestId) return r;

        const updatedProducts = r.products.map((p) => {
          const decision = decisions.find((d) => d.productId === p.id);
          if (!decision) return p;
          return {
            ...p,
            fulfilledQty: p.fulfilledQty + decision.giveQty,
          };
        });

        const isFullyFulfilled = updatedProducts.every(
          (p) => p.fulfilledQty >= p.requestedQty,
        );
        const newStatus = isFullyFulfilled ? "closed" : "active";

        return {
          ...r,
          products: updatedProducts,
          status: newStatus,
          note: note || r.note,
        };
      }),
    );

    setSelectedRequest(null);
    setSuccessMessage("Əməliyyat uğurla başa çatdı. Tələb statusu yeniləndi.");
    setIsSuccessModalOpen(true);
  };

  const handleReload = () => {
    setRequests(mockIncomingRequests);
    setSearchQuery("");
    setCurrentPage(1);
    setSelectedRequest(null);
    setActiveDept("Hamısı");
  };

  const columns = useIncomingColumns({ onDetail: handleDetail });

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

    if (filterStatuses.length > 0) {
      filtered = filtered.filter((r) => filterStatuses.includes(r.status));
    }

    return filtered;
  }, [requests, activeDept, searchQuery, filterStatuses]);

  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortColumn as keyof IncomingRequest];
      const bVal = b[sortColumn as keyof IncomingRequest];
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
      <PageHeader title="Anbara Gələn Tələblər" />

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
              <div className={styles.searchBox}>
                <SearchButton onClick={() => setIsFilterModalOpen(true)} />
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

      <IncomingDetailModal
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        request={selectedRequest}
        onSubmitDecisions={handleSubmitDecisions}
      />

      <IncomingFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        selectedStatuses={filterStatuses}
        onFilterChange={setFilterStatuses}
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

export default IncomingRequestsPage;
