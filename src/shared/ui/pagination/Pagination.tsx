import React from 'react';
import styles from './Pagination.module.css';
import type { PaginationProps } from '@/shared/types';

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  maxVisiblePages = 5,
  disabled = false,
}) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);
    
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, currentPage + halfVisible);
    
    if (currentPage <= halfVisible) {
      endPage = Math.min(maxVisiblePages, totalPages);
    }
    
    if (currentPage + halfVisible >= totalPages) {
      startPage = Math.max(1, totalPages - maxVisiblePages + 1);
    }
    
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push('...');
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }
    
    return pages;
  };

  const handlePageClick = (page: number | string) => {
    if (typeof page === 'number' && page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <div className={styles.pagination}>
      {showFirstLast && (
        <button
          className={styles.pageButton}
          onClick={() => onPageChange(1)}
          disabled={disabled || currentPage === 1}
        >
          «
        </button>
      )}
      
      <button
        className={styles.pageButton}
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={disabled || currentPage === 1}
      >
        ‹
      </button>

      {getPageNumbers().map((page, index) => (
        <button
          key={index}
          className={`${styles.pageButton} ${
            page === currentPage ? styles.active : ''
          } ${page === '...' ? styles.dots : ''}`}
          onClick={() => handlePageClick(page)}
          disabled={disabled || page === '...'}
        >
          {page}
        </button>
      ))}

      <button
        className={styles.pageButton}
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={disabled || currentPage === totalPages}
      >
        ›
      </button>

      {showFirstLast && (
        <button
          className={styles.pageButton}
          onClick={() => onPageChange(totalPages)}
          disabled={disabled || currentPage === totalPages}
        >
          »
        </button>
      )}
    </div>
  );
};

export default Pagination;


