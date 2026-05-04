import { useState, useMemo, useEffect } from "react";
import { useStateAwardsColumns } from "./useStateAwardsColumns";
import type { StateAward } from "@/features/settings/state-awards";
import type { Option } from "@/shared/types";
import { rowCountOptions } from "@/shared/config/tableOptions";
import {
  useStateAwards,
  useStateAwardById,
  useCreateStateAward,
  useUpdateStateAward,
  useDeleteStateAward,
  useSetActiveStateAward,
} from "@/features/settings/state-awards";
import { useDebounce } from "@/shared/hooks";
import { getBackendErrorMessage } from "@/shared/api/httpClient";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";

export const useStateAwardsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRowCount, setSelectedRowCount] = useState<Option | null>(
    rowCountOptions[0] || null
  );
  const [searchName, setSearchName] = useState<string>("");

  const [selectedOperation, setSelectedOperation] = useState<Option | null>(null);
  const [selectedStateAward, setSelectedStateAward] = useState<StateAward | null>(null);
  const [activePanelMode, setActivePanelMode] = useState<
    "edit" | "detail" | null
  >(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{
    isOpen: boolean;
    stateAwardId: string | null;
  }>({ isOpen: false, stateAwardId: null });

  const debouncedSearchName = useDebounce(searchName, 1000);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchName]);

  const { data: stateAwardsResponse, isLoading, isError, isFetching, refetch: refetchStateAwards } =
    useStateAwards();

  const allStateAwards = useMemo<StateAward[]>(() => {
    if (!stateAwardsResponse?.result) return [];
    
    const stateAwardsArray = Array.isArray(stateAwardsResponse.result)
      ? stateAwardsResponse.result
      : (stateAwardsResponse.result as any).data || [];
    
    return stateAwardsArray;
  }, [stateAwardsResponse]);

  const pageSize = Number(selectedRowCount?.id) || 10;
  
  const filteredAndPaginatedData = useMemo<StateAward[]>(() => {
    let filtered = allStateAwards;
    if (debouncedSearchName.trim()) {
      const searchLower = debouncedSearchName.trim().toLowerCase();
      filtered = allStateAwards.filter(
        (item) =>
          item.name.toLowerCase().includes(searchLower) ||
          item.typeCode.toLowerCase().includes(searchLower)
      );
    }

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filtered.slice(startIndex, endIndex);
  }, [allStateAwards, debouncedSearchName, currentPage, pageSize]);

  const totalCount = useMemo(() => {
    if (debouncedSearchName.trim()) {
      const searchLower = debouncedSearchName.trim().toLowerCase();
      return allStateAwards.filter(
        (item) =>
          item.name.toLowerCase().includes(searchLower) ||
          item.typeCode.toLowerCase().includes(searchLower)
      ).length;
    }
    return allStateAwards.length;
  }, [allStateAwards, debouncedSearchName]);

  const data = filteredAndPaginatedData;

  const handleDetail = (stateAward: StateAward) => {
    setSelectedStateAward(stateAward);
    setActivePanelMode("detail");
  };

  const handleDelete = (stateAward: StateAward) => {
    setDeleteConfirmModal({ isOpen: true, stateAwardId: stateAward.id });
  };

  const handleCancelDelete = () => {
    setDeleteConfirmModal({ isOpen: false, stateAwardId: null });
  };

  const deleteStateAwardMutation = useDeleteStateAward();
  const handleConfirmDelete = () => {
    if (deleteConfirmModal.stateAwardId) {
      deleteStateAwardMutation.mutate(String(deleteConfirmModal.stateAwardId), {
        onSuccess: () => {
          if (selectedStateAward?.id === deleteConfirmModal.stateAwardId) {
            handleClosePanel();
          }
          setDeleteConfirmModal({ isOpen: false, stateAwardId: null });
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

  const createStateAwardMutation = useCreateStateAward();
  const handleSaveNewStateAward = (newData: Partial<StateAward>) => {
    createStateAwardMutation.mutate(newData, {
      onSuccess: () => {
        setIsCreateModalOpen(false);
        refetchStateAwards();
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

  const updateStateAwardMutation = useUpdateStateAward();
  const handleUpdateStateAward = (stateAwardData: Partial<StateAward> & { id: string }) => {
    updateStateAwardMutation.mutate(stateAwardData as any, {
      onSuccess: () => {
        handleClosePanel();
        refetchStateAwards();
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
    setSelectedStateAward(null);
  };

  const handleRefresh = () => {
    refetchStateAwards();
    setSearchName("");
  };

  const setActiveStateAwardMutation = useSetActiveStateAward();
  const handleSetActive = (id: string, isActive: boolean) => {
    setActiveStateAwardMutation.mutate(
      { id: String(id), isActive },
      {
        onSuccess: () => {
          refetchStateAwards();
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

  const { data: stateAwardDetailResponse, isLoading: isLoadingStateAwardDetail } =
    useStateAwardById(
      (activePanelMode === "edit" || activePanelMode === "detail") && selectedStateAward?.id
        ? String(selectedStateAward.id)
        : null,
      activePanelMode === "edit" || activePanelMode === "detail"
    );

  const columns = useStateAwardsColumns({
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
    selectedStateAward,
    stateAwardDetail: stateAwardDetailResponse?.result || null,
    isLoadingStateAwardDetail,
    handleClosePanel,
    handleUpdateStateAward,
    isUpdatingStateAward: updateStateAwardMutation.isPending,
    isCreateModalOpen,
    handleCreate,
    handleCloseCreateModal,
    handleSaveNewStateAward,
    isCreatingStateAward: createStateAwardMutation.isPending,
    deleteConfirmModal,
    handleCancelDelete,
    handleConfirmDelete,
    isDeletingStateAward: deleteStateAwardMutation.isPending,
    handleRefresh,
    handleSetActive,
    isSettingActive: setActiveStateAwardMutation.isPending,
  };
};
