import { useState, useEffect } from "react";
import styles from "./Table.module.css";
import type { TableProps } from "@/shared/types";

function Table<T>({
  data,
  columns,
  className,
  hideSortIcons = false,
  selectedRowId,
  rowIdKey = "id",
  onSort,
  sortColumn,
  sortDirection: propSortDirection,
  onRowClick,
  onRowDoubleClick,
  emptyMessage = "Məlumat tapılmadı",
  fixedLayout = false,
  getRowClassName,
}: TableProps<T>) {
   const [activeSortColumn, setActiveSortColumn] = useState<string | null>(
    sortColumn || null,
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">(
    propSortDirection || "desc",
  );

  useEffect(() => {
    if (sortColumn !== undefined) {
      setActiveSortColumn(sortColumn);
    }
  }, [sortColumn]);

  useEffect(() => {
    if (propSortDirection !== undefined) {
      setSortDirection(propSortDirection);
    }
  }, [propSortDirection]);

  const handleSortClick = (sortKey: string) => {
    let newDirection: "asc" | "desc";

    if (activeSortColumn === sortKey) {
      newDirection = sortDirection === "desc" ? "asc" : "desc";
      setSortDirection(newDirection);
    } else {
      setActiveSortColumn(sortKey);
      newDirection = "desc";
      setSortDirection(newDirection);
    }

    if (onSort) {
      onSort(sortKey, newDirection);
    }
  };

  return (
    <div className={`${styles.tableWrapper} ${className ?? ""}`}>
      <table className={styles.table} style={{ tableLayout: fixedLayout ? 'fixed' : 'auto' }}>
        <thead>
          <tr>
            {columns.map((column, index) => {
              const isAction =
                column.accessor === "action" || column.accessor === "actions";
              const isNumberHeader = column.header === "#";
              const columnSortKey = String(column.sortKey ?? column.accessor);
              const isSortable =
                !hideSortIcons &&
                column.sortable !== false &&
                column.header &&
                column.header !== "#" &&
                column.header !== "" &&
                !isAction;
              const isActiveSort = activeSortColumn === columnSortKey;

              return (
                <th
                  key={index}
                  style={{ 
                         width: column.width,
                         maxWidth: column.maxWidth,
                         minWidth: column.minWidth,
                         wordBreak: column.maxWidth ? "break-word" : undefined,
                         whiteSpace: column.maxWidth ? "normal" : undefined,
                          overflow: column.maxWidth ? "hidden" : undefined,
                          padding: column.maxWidth ? "12px 8px" : undefined,
                          fontSize: column.maxWidth ? "12px" : undefined
                        }}
                  className={`
                      ${styles.tableHeader} 
                      ${isNumberHeader ? styles.tableHeaderNumber : ""} 
                      ${isSortable ? styles.tableHeaderSortable : ""}
                      ${isAction ? styles.actionColumn : ""} 
                      ${column.headerClassName || ""}
                    `}
                  onClick={
                    isSortable
                      ? () => handleSortClick(columnSortKey)
                      : undefined
                  }
                >
                  <div className={styles.headerContent}>
                    <span>{column.header}</span>
                    {isSortable && (
                      <div className={styles.sortIconWrapper}>
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className={
                            isActiveSort && sortDirection === "desc"
                              ? styles.sortIconAsc
                              : styles.sortIconDesc
                          }
                          style={{
                            opacity: isActiveSort ? 1 : 0.3,
                          }}
                        >
                          <path
                            d="M6 2V10M6 10L2 6M6 10L10 6"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                style={{
                  textAlign: "center",
                  padding: "2rem",
                  color: "var(--text-black)",
                }}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, rowIndex) => {
              const itemAny = item as any;
              const isSelected =
                selectedRowId !== undefined &&
                selectedRowId !== null &&
                String(itemAny[rowIdKey]) === String(selectedRowId);

              return (
                <tr
                  key={rowIndex}
                  className={`${styles.tableRow} ${isSelected ? styles.selectedRow : ""} ${getRowClassName ? getRowClassName(item) : ""}`}
                  onClick={() => onRowClick && onRowClick(item)}
                  onDoubleClick={() => onRowDoubleClick && onRowDoubleClick(item)}
                >
                  {columns.map((column, colIndex) => {
                    const isAction =
                      column.accessor === "action" ||
                      column.accessor === "actions";

                    return (
                      <td
                        key={colIndex}
                        style={{ 
                          width: column.width,
                          maxWidth: column.maxWidth,
                          minWidth: column.minWidth,
                          wordBreak: column.maxWidth ? "break-word" : undefined,
                          whiteSpace: column.maxWidth ? "normal" : undefined,
                          overflow: column.maxWidth ? "hidden" : undefined,
                          padding: column.maxWidth ? "12px 8px" : undefined,
                          fontSize: column.maxWidth ? "12px" : undefined
                        }}
                        className={`
                          ${styles.tableCell} 
                          ${isAction ? styles.actionColumn : ""}
                          ${column.className || ""}
                        `}
                      >
                        {column.render
                          ? column.render(item, rowIndex)
                          : String(item[column.accessor as keyof T] ?? "")}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
