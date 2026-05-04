import { useState, useMemo } from "react";
import { rowCountOptions } from "@/shared/config/tableOptions";
import type { Option } from "@/shared/types";

export function useTablePagination<T>(data: T[]) {
  // Default olaraq ilk seçimi (10) götürürük
  const [selectedRowCount, setSelectedRowCount] = useState<Option | null>(
    rowCountOptions[0] || null
  );
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = Number(selectedRowCount?.id) || 10;
  
  // Ümumi səhifə sayı
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Datanın bölünməsi (Slicing)
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  }, [currentPage, itemsPerPage, data]);

  // Handlerlar
  const handleRowCountChange = (value: Option | null) => {
    setSelectedRowCount(value);
    setCurrentPage(1); // Sətir sayı dəyişəndə 1-ci səhifəyə qayıt
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return {
    paginatedData,      // Cədvələ veriləcək data (hazır kəsilmiş)
    currentPage,        // Pagination üçün
    totalPages,         // Pagination üçün
    selectedRowCount,   // TableControls üçün
    handlePageChange,   // Pagination üçün
    handleRowCountChange, // TableControls üçün
    totalCount: data.length // TableControls üçün
  };
}