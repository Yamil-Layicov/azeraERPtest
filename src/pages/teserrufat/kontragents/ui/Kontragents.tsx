import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button, PageHeader, TableToolbar, TableControls, TableActionGroup } from "@/shared/ui";
import { Pagination } from "@/shared/ui/pagination";
import Table from "@/shared/ui/table/Table";
import { ROUTES } from "@/app/routes/consts";
import { MOCK_KONTRAGENTS } from "../model/mockData";
import { getKontragentColumns } from "../model/columns";
import { rowCountOptions, operationOptions } from "@/shared/config/tableOptions";
import type { Option } from "@/shared/types";
import styles from "./Kontragents.module.css";

const Kontragents = () => {
  const navigate = useNavigate();
  const columns = getKontragentColumns();

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRowCount, setSelectedRowCount] = useState<Option | null>(
    rowCountOptions[0] || null,
  );
  const [selectedOperation, setSelectedOperation] = useState<Option | null>(null);

  const itemsPerPage = Number(selectedRowCount?.id) || 10;
  const totalCount = MOCK_KONTRAGENTS.length;
  const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowCountChange = (value: Option | null) => {
    setSelectedRowCount(value);
    setCurrentPage(1);
  };

  const handleOperationChange = (value: Option | null) => {
    setSelectedOperation(value);
  };

  const handleRefresh = () => {
    console.log("Refreshing data...");
  };

  const handleSearchClick = () => {
    console.log("Search clicked...");
  };

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return MOCK_KONTRAGENTS.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, itemsPerPage]);

  return (
    <div className={styles.kontragents}>
      <div className={styles.header}>
        <PageHeader title="Kontragentlər" />
        <Button
          variant="primary"
          onClick={() => navigate(ROUTES.TESERRUFAT.ADD_KONTRAGENTS.LINK)}
          className={styles.createButton}
        >
          + Yeni
        </Button>
      </div>

      <TableToolbar>
        <TableControls
          selectedRowCount={selectedRowCount}
          onRowCountChange={handleRowCountChange}
          totalCount={totalCount}
        />

        <TableActionGroup
          onRefresh={handleRefresh}
          onSearch={handleSearchClick}
          onOperationChange={handleOperationChange}
          operationOptions={operationOptions}
          selectedOperation={selectedOperation}
        />
      </TableToolbar>

      <div className={styles.tableContent}>
        <Table data={paginatedData} columns={columns} />
      </div>

      <TableToolbar>
        <TableControls
          selectedRowCount={selectedRowCount}
          onRowCountChange={handleRowCountChange}
          totalCount={totalCount}
        />
      </TableToolbar>

      <div className={styles.pagination}>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          showFirstLast={true}
          maxVisiblePages={5}
        />
      </div>
    </div>
  );
};

export default Kontragents;
