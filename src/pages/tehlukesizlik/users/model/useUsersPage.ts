import { useState, useCallback, useEffect, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useUsers, USERS_QUERY_KEYS } from "@/features/security/users";
import type { User } from "./types";
import type { Option } from "@/shared/types";
import { rowCountOptions } from "@/shared/config/tableOptions";
import { useDebounce } from "@/shared/hooks";
import { useUsersColumns } from "./useUsersColumns";

export const useUsersPage = () => {
  const queryClient = useQueryClient();

  // --- States ---
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRowCount, setSelectedRowCount] = useState<Option | null>(rowCountOptions[0] || null);
  const [searchName, setSearchName] = useState<string>("");
  const [searchStatus, setSearchStatus] = useState<string>("");
  const [selectedOperation, setSelectedOperation] = useState<Option | null>(null);
  
  // Panel States
  const [panelMode, setPanelMode] = useState<'create' | 'edit' | 'detail' | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Modal State-ləri
  const [resetPasswordUser, setResetPasswordUser] = useState<User | null>(null);

  // --- Debounced Search ---
  const debouncedSearchName = useDebounce(searchName, 1000);

  // Reset page to 1 when debounced search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchName]);

  // --- API Data ---
  const pageSize = Number(selectedRowCount?.id) || 10;
  const pageIndex = currentPage - 1;
  
  // Convert status string to boolean
  const isActiveFilter = useMemo(() => {
    if (searchStatus === "active") return true;
    if (searchStatus === "inactive") return false;
    return null;
  }, [searchStatus]);

  const { 
    data, 
    isLoading, 
    isError,
    isFetching,
    refetch 
  } = useUsers({ 
    username: debouncedSearchName.trim() || null,
    isActive: isActiveFilter,
    pageSize,
    pageIndex,
  });
  const users = useMemo<User[]>(() => {
    if (!data?.result?.data) return [];
    return data.result.data;
  }, [data]);

  // --- Columns ---
  const columns = useUsersColumns({
    currentPage,
    selectedRowCount,
    onDetail: (user) => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEYS.detail(user.id) });
      setPanelMode('detail');
      setSelectedUser(user);
    },
    onDelete: () => {
      // Silinmə funksionallığı burada həyata keçiriləcək
    },
  });


  const openPanel = useCallback((mode: 'create' | 'edit' | 'detail', user: User | null = null) => {
    setPanelMode(mode);
    setSelectedUser(user);
  }, []);

  // 2. Paneli bağlamaq
  const closePanel = useCallback(() => {
    setPanelMode(null);
    setSelectedUser(null);
    refetch(); 
  }, [refetch]);

  // 3. Şifrə sıfırlama modalını idarə etmək
  const openResetPassword = useCallback((user: User) => {
    setResetPasswordUser(user);
  }, []);

  const closeResetPassword = useCallback(() => {
    setResetPasswordUser(null);
  }, []);

  // 4. Refresh handler
  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  // --- RETURN ---
  return {
    // Data
    users,
    totalCount: data?.result?.totalCount || 0,
    isLoading: isLoading || isFetching,
    isError,
    columns,
    
    // Pagination
    currentPage,
    setCurrentPage,
    selectedRowCount,
    setSelectedRowCount,
    
    // Search
    searchName,
    setSearchName,
    searchStatus,
    setSearchStatus,
    
    // Operation
    selectedOperation,
    setSelectedOperation,
    
    // Panel
    panelMode,
    selectedUser,
    
    // Modal
    resetPasswordUser,
    
    // Actions
    openPanel,
    closePanel,
    openResetPassword,
    closeResetPassword,
    handleRefresh,
  };
};