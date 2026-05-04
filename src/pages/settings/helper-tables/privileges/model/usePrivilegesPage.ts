import { useState, useMemo, useEffect } from "react";
import { usePrivilegesColumns } from "./usePrivilegesColumns";
import type { Privilege } from "@/features/settings/privileges";
import type { Option } from "@/shared/types";
import { rowCountOptions } from "@/shared/config/tableOptions";
import {
  usePrivileges,
  useCreatePrivilege,
  useUpdatePrivilege,
  useDeletePrivilege,
  useSetActivePrivilege,
} from "@/features/settings/privileges";
import { useDebounce } from "@/shared/hooks";
import { getBackendErrorMessage } from "@/shared/api/httpClient";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";

export const usePrivilegesPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRowCount, setSelectedRowCount] = useState<Option | null>(
    rowCountOptions[0] || null
  );
  const [searchName, setSearchName] = useState<string>("");

  const [selectedOperation, setSelectedOperation] = useState<Option | null>(null);
  const [selectedPrivilege, setSelectedPrivilege] = useState<Privilege | null>(null);
  const [activePanelMode, setActivePanelMode] = useState<
    "edit" | "detail" | null
  >(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{
    isOpen: boolean;
    privilegeId: number | null;
  }>({ isOpen: false, privilegeId: null });

  const debouncedSearchName = useDebounce(searchName, 1000);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchName]);

  const { data: privilegesResponse, isLoading, isError, isFetching, refetch: refetchPrivileges } =
    usePrivileges();

  const allPrivileges = useMemo<Privilege[]>(() => {
    if (!privilegesResponse?.result) return [];
    
    const privilegesArray = Array.isArray(privilegesResponse.result)
      ? privilegesResponse.result
      : (privilegesResponse.result as any).data || [];
    
    return privilegesArray;
  }, [privilegesResponse]);

  const pageSize = Number(selectedRowCount?.id) || 10;
  
  const filteredAndPaginatedData = useMemo<Privilege[]>(() => {
    let filtered = allPrivileges;
    if (debouncedSearchName.trim()) {
      const searchLower = debouncedSearchName.trim().toLowerCase();
      filtered = allPrivileges.filter(
        (item) =>
          item.name.toLowerCase().includes(searchLower) ||
          item.legalBasisCode.toLowerCase().includes(searchLower)
      );
    }

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filtered.slice(startIndex, endIndex);
  }, [allPrivileges, debouncedSearchName, currentPage, pageSize]);

  const totalCount = useMemo(() => {
    if (debouncedSearchName.trim()) {
      const searchLower = debouncedSearchName.trim().toLowerCase();
      return allPrivileges.filter(
        (item) =>
          item.name.toLowerCase().includes(searchLower) ||
          item.legalBasisCode.toLowerCase().includes(searchLower)
      ).length;
    }
    return allPrivileges.length;
  }, [allPrivileges, debouncedSearchName]);

  const data = filteredAndPaginatedData;

  const handleDetail = (privilege: Privilege) => {
    setSelectedPrivilege(privilege);
    setActivePanelMode("detail");
  };

  const handleDelete = (privilege: Privilege) => {
    setDeleteConfirmModal({ isOpen: true, privilegeId: privilege.id });
  };

  const handleCancelDelete = () => {
    setDeleteConfirmModal({ isOpen: false, privilegeId: null });
  };

  const deletePrivilegeMutation = useDeletePrivilege();
  const handleConfirmDelete = () => {
    if (deleteConfirmModal.privilegeId) {
      deletePrivilegeMutation.mutate(deleteConfirmModal.privilegeId, {
        onSuccess: () => {
          if (selectedPrivilege?.id === deleteConfirmModal.privilegeId) {
            handleClosePanel();
          }
          setDeleteConfirmModal({ isOpen: false, privilegeId: null });
          toast.success("Uğurla silindi");
        },
        onError: (error) => {
          const axiosError = error as AxiosError;
          const errorData = axiosError.response?.data as { errorMessage?: string } | undefined;
          if (errorData?.errorMessage) {
            toast.error(errorData.errorMessage);
          } else {
            const errorMessage = getBackendErrorMessage(axiosError);
            toast.error(errorMessage);
          }
        },
      });
    }
  };

  const handleCreate = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const createPrivilegeMutation = useCreatePrivilege();
  const handleSaveNewPrivilege = (newData: Partial<Privilege>) => {
    createPrivilegeMutation.mutate(newData, {
      onSuccess: () => {
        setIsCreateModalOpen(false);
        refetchPrivileges();
        toast.success("Uğurla yaradıldı");
      },
      onError: (error) => {
        const axiosError = error as AxiosError;
        const errorData = axiosError.response?.data as { errorMessage?: string } | undefined;
        if (errorData?.errorMessage) {
          toast.error(errorData.errorMessage);
        } else {
          const errorMessage = getBackendErrorMessage(axiosError);
          toast.error(errorMessage);
        }
      },
    });
  };

  const updatePrivilegeMutation = useUpdatePrivilege();
  const handleUpdatePrivilege = (privilegeData: Partial<Privilege> & { id: number }) => {
    updatePrivilegeMutation.mutate(privilegeData, {
      onSuccess: () => {
        handleClosePanel();
        refetchPrivileges();
        toast.success("Uğurla yeniləndi");
      },
      onError: (error) => {
        const axiosError = error as AxiosError;
        const errorData = axiosError.response?.data as { errorMessage?: string } | undefined;
        if (errorData?.errorMessage) {
          toast.error(errorData.errorMessage);
        } else {
          const errorMessage = getBackendErrorMessage(axiosError);
          toast.error(errorMessage);
        }
      },
    });
  };

  const handleClosePanel = () => {
    setActivePanelMode(null);
    setSelectedPrivilege(null);
  };

  const handleRefresh = () => {
    refetchPrivileges();
    setSearchName("");
  };

  const setActivePrivilegeMutation = useSetActivePrivilege();
  const handleSetActive = (id: number, isActive: boolean) => {
    setActivePrivilegeMutation.mutate(
      { id, isActive },
      {
        onSuccess: () => {
          refetchPrivileges();
          toast.success("Status yeniləndi");
        },
        onError: (error) => {
          const axiosError = error as AxiosError;
          const errorData = axiosError.response?.data as { errorMessage?: string } | undefined;
          if (errorData?.errorMessage) {
            toast.error(errorData.errorMessage);
          }
        }
      }
    );
  };

  const columns = usePrivilegesColumns({
    currentPage,
    selectedRowCount,
    onDetail: handleDetail,
    onDelete: handleDelete,
  });

  return {
    data,
    totalCount,
    isLoading: isLoading || isFetching,
    isError,
    columns,
    currentPage,
    setCurrentPage,
    selectedRowCount,
    setSelectedRowCount,
    selectedOperation,
    setSelectedOperation,
    searchName,
    setSearchName,
    activePanelMode,
    selectedPrivilege,
    privilegeDetail: selectedPrivilege,
    isLoadingPrivilegeDetail: false,
    handleClosePanel,
    handleUpdatePrivilege,
    isUpdatingPrivilege: updatePrivilegeMutation.isPending,
    isCreateModalOpen,
    handleCreate,
    handleCloseCreateModal,
    handleSaveNewPrivilege,
    isCreatingPrivilege: createPrivilegeMutation.isPending,
    deleteConfirmModal,
    handleCancelDelete,
    handleConfirmDelete,
    isDeletingPrivilege: deletePrivilegeMutation.isPending,
    handleRefresh,
    handleSetActive,
    isSettingActive: setActivePrivilegeMutation.isPending,
  };
};
