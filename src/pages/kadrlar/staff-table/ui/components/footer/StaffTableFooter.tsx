import { Pagination, TableControls } from "@/shared/ui";
import type { Option } from "@/shared/types";
import styles from "../../StaffTablePage.module.css";

interface StaffTableFooterProps {
  selectedRowCount: Option | null;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  onRowCountChange: (option: Option | null) => void;
  onPageChange: (page: number) => void;
}

export function StaffTableFooter({
  selectedRowCount,
  totalCount,
  currentPage,
  totalPages,
  onRowCountChange,
  onPageChange,
}: StaffTableFooterProps) {
  return (
    <div className={styles.footer}>
      <div className={styles.footerRowCount}>
        <TableControls
          selectedRowCount={selectedRowCount}
          onRowCountChange={onRowCountChange}
          totalCount={totalCount}
          wrapperClassName={styles.paginationSelectWrapper}
          selectClassName={styles.paginationSelect}
        />
      </div>
      <div className={styles.paginationWrapper}>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          showFirstLast
          maxVisiblePages={5}
        />
      </div>
    </div>
  );
}
