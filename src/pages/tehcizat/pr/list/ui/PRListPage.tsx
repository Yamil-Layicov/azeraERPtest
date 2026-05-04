import React, { useState, useMemo } from "react";
import styles from "./PRListPage.module.css";
import {
  PageHeader,
  Table,
  Button,
  Pagination,
  TableToolbar,
  TableControls,
  SuccessModal,
  FormInput,
  RefreshButton,
  SearchButton,
} from "@/shared/ui";
import { usePRColumns } from "../model/usePRColumns";
import { mockPRs } from "../model/mockData";
import { useTableSort } from "@/shared/hooks/useTableSort";
import NewPRModal from "./components/NewPRModal";
import PRDetailModal from "./components/PRDetailModal";
import type { PurchaseRequest } from "../model/types";
import { rowCountOptions } from "@/shared/config/tableOptions";
import type { Option } from "@/shared/types";

const PRListPage: React.FC = () => {
  const [prs, setPrs] = useState<PurchaseRequest[]>(mockPRs);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [selectedPR, setSelectedPR] = useState<PurchaseRequest | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState<Option>(rowCountOptions[0]!);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const { sortColumn, sortDirection, handleSort } = useTableSort({});

  const [currentPage, setCurrentPage] = useState(1);

  const handleDetail = (pr: PurchaseRequest) => {
    setSelectedPR(pr);
    setIsDetailModalOpen(true);
  };

  const handleEdit = () => {
    // Redaktə funksionallığı burada həyata keçiriləcək
  };

  const handleDelete = (pr: PurchaseRequest) => {
    if (
      window.confirm(`${pr.prNo} nömrəli tələbi silmək istədiyinizə əminsiniz?`)
    ) {
      setPrs((prev) => prev.filter((p) => p.id !== pr.id));
      setSuccessMessage("Satınalma tələbi silindi.");
      setIsSuccessModalOpen(true);
    }
  };

  const handleReload = () => {
    setPrs(mockPRs);
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleSearch = () => {
    setIsSearchVisible((prev) => !prev);
    setCurrentPage(1);
  };

  const handleFormSubmit = (data: any) => {
    const newPR: PurchaseRequest = {
      ...data,
      id: (prs.length + 1).toString(),
      prNo: `PR-00${12 + prs.length}`,
      requester: "Turan Həsənov",
      authorId: "currentUser",
      department: "İT",
      status: "pending",
    };
    setPrs([newPR, ...prs]);
    setIsNewModalOpen(false);
    setSuccessMessage("Yeni satınalma tələbi yaradıldı.");
    setIsSuccessModalOpen(true);
  };

  const columns = usePRColumns({
    onDetail: handleDetail,
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  const userRequests = useMemo(() => {
    let filtered = prs.filter((p) => p.authorId === "currentUser");

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.prNo.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.department.toLowerCase().includes(query),
      );
    }

    if (sortColumn) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[sortColumn as keyof PurchaseRequest];
        const bValue = b[sortColumn as keyof PurchaseRequest];

        if (aValue === bValue) return 0;
        const res = (aValue ?? "") > (bValue ?? "") ? 1 : -1;
        return sortDirection === "asc" ? res : -res;
      });
    }

    return filtered;
  }, [prs, searchQuery, sortColumn, sortDirection]);

  const itemsPerPage = Number(pageSize.id);
  const totalCount = userRequests.length;
  const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;

  const paginatedData = useMemo(() => {
    return userRequests.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    );
  }, [currentPage, itemsPerPage, userRequests]);

  return (
    <div className={styles.container}>
      <PageHeader
        title="Mənim Satınalma Tələblərim"
      />

      <TableToolbar>
        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            alignItems: "center",
            flex: 1,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <TableControls
              selectedRowCount={pageSize}
              onRowCountChange={(val) => val && setPageSize(val)}
              totalCount={totalCount}
            />
          </div>
        </div>
        <div className={styles.managementSection}>
          {" "}
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
            <SearchButton onClick={handleSearch} />
          </div>
          <Button className={styles.newPRButton} variant="primary" onClick={() => setIsNewModalOpen(true)}>
            Yeni Tələb
          </Button>
        </div>
      </TableToolbar>

      <div className={styles.tableCard}>
        <Table
          columns={columns}
          data={paginatedData}
          onSort={handleSort}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      <NewPRModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSubmit={handleFormSubmit}
      />

      <PRDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        pr={selectedPR}
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

export default PRListPage;
