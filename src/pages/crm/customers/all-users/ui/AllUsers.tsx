import { useState } from "react";
import {
  PageHeader,
  Table,
  TableToolbar,
  TableControls,
  Pagination,
  TableActionGroup,
} from "@/shared/ui";
import { rowCountOptions, operationOptions } from "@/shared/config/tableOptions";
import type { Option } from "@/shared/types";
import { MOCK_CRM_USERS } from "../model/constants";
import { useCRMColumns } from "../model/useCRMColumns";
import styles from "./AllUsers.module.css";

const AllUsers = () => {
  const [data] = useState(MOCK_CRM_USERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRowCount, setSelectedRowCount] = useState<Option | null>(rowCountOptions[0] ?? null);
  const [selectedOperation, setSelectedOperation] = useState<Option | null>(null);

  const columns = useCRMColumns({
    onEdit: () => {},
    onDelete: () => {},
  });

  const handleRefresh = () => {};

  const handleSearch = () => {};

  return (
    <div className={styles.container}>
      <PageHeader title="Müştərilər" />

      <div className={styles.contentWrapper}>
        <TableToolbar>
          <TableControls
            selectedRowCount={selectedRowCount}
            onRowCountChange={setSelectedRowCount}
            totalCount={data.length}
          />

          <TableActionGroup
            onRefresh={handleRefresh}
            onSearch={handleSearch}
            operationOptions={operationOptions}
            selectedOperation={selectedOperation}
            onOperationChange={setSelectedOperation}
          />
        </TableToolbar>

        <div className={styles.tableWrapper}>
          <Table data={data} columns={columns} />
        </div>

        <div className={styles.pagination}>
          <Pagination
            currentPage={currentPage}
            totalPages={1}
            onPageChange={setCurrentPage}
            showFirstLast={true}
          />
        </div>
      </div>
    </div>
  );
};

export default AllUsers;
