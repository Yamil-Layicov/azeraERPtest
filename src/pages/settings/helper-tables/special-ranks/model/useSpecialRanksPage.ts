import { useState, useMemo, useEffect } from "react";
import { useSpecialRanksColumns } from "./useSpecialRanksColumns";
import type { SpecialRank } from "@/features/settings/special-ranks";
import type { Option } from "@/shared/types";
import { rowCountOptions } from "@/shared/config/tableOptions";
import {
  useSpecialRanks,
  useSpecialRankById,
  useCreateSpecialRank,
  useUpdateSpecialRank,
  useDeleteSpecialRank,
  useSetActiveSpecialRank,
} from "@/features/settings/special-ranks";
import { useDebounce } from "@/shared/hooks";
import { getBackendErrorMessage } from "@/shared/api/httpClient";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";

export const useSpecialRanksPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRowCount, setSelectedRowCount] = useState<Option | null>(
    rowCountOptions[0] || null
  );
  const [searchName, setSearchName] = useState<string>("");

  const [selectedOperation, setSelectedOperation] = useState<Option | null>(null);
  const [selectedSpecialRank, setSelectedSpecialRank] = useState<SpecialRank | null>(null);
  const [activePanelMode, setActivePanelMode] = useState<
    "edit" | "detail" | null
  >(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{
    isOpen: boolean;
    specialRankId: number | null;
  }>({ isOpen: false, specialRankId: null });

  const debouncedSearchName = useDebounce(searchName, 1000);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchName]);

  const { data: specialRanksResponse, isLoading, isError, isFetching, refetch: refetchSpecialRanks } =
    useSpecialRanks();

  const allSpecialRanks = useMemo<SpecialRank[]>(() => {
    if (!specialRanksResponse?.result) return [];
    
    const specialRanksArray = Array.isArray(specialRanksResponse.result)
      ? specialRanksResponse.result
      : (specialRanksResponse.result as any).data || [];
    
    return specialRanksArray;
  }, [specialRanksResponse]);

  const pageSize = Number(selectedRowCount?.id) || 10;
  
  const filteredAndPaginatedData = useMemo<SpecialRank[]>(() => {
    let filtered = allSpecialRanks;
    if (debouncedSearchName.trim()) {
      const searchLower = debouncedSearchName.trim().toLowerCase();
      filtered = allSpecialRanks.filter(
        (item) =>
          item.name.toLowerCase().includes(searchLower) ||
          item.organCode.toLowerCase().includes(searchLower)
      );
    }

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filtered.slice(startIndex, endIndex);
  }, [allSpecialRanks, debouncedSearchName, currentPage, pageSize]);

  const totalCount = useMemo(() => {
    if (debouncedSearchName.trim()) {
      const searchLower = debouncedSearchName.trim().toLowerCase();
      return allSpecialRanks.filter(
        (item) =>
          item.name.toLowerCase().includes(searchLower) ||
          item.organCode.toLowerCase().includes(searchLower)
      ).length;
    }
    return allSpecialRanks.length;
  }, [allSpecialRanks, debouncedSearchName]);

  const data = filteredAndPaginatedData;

  const handleDetail = (specialRank: SpecialRank) => {
    setSelectedSpecialRank(specialRank);
    setActivePanelMode("detail");
  };

  const handleDelete = (specialRank: SpecialRank) => {
    setDeleteConfirmModal({ isOpen: true, specialRankId: specialRank.id });
  };

  const handleCancelDelete = () => {
    setDeleteConfirmModal({ isOpen: false, specialRankId: null });
  };

  const deleteSpecialRankMutation = useDeleteSpecialRank();
  const handleConfirmDelete = () => {
    if (deleteConfirmModal.specialRankId) {
      deleteSpecialRankMutation.mutate(String(deleteConfirmModal.specialRankId), {
        onSuccess: () => {
          if (selectedSpecialRank?.id === deleteConfirmModal.specialRankId) {
            handleClosePanel();
          }
          setDeleteConfirmModal({ isOpen: false, specialRankId: null });
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

  const createSpecialRankMutation = useCreateSpecialRank();
  const handleSaveNewSpecialRank = (newData: Partial<SpecialRank>) => {
    createSpecialRankMutation.mutate(newData, {
      onSuccess: () => {
        setIsCreateModalOpen(false);
        refetchSpecialRanks();
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

  const updateSpecialRankMutation = useUpdateSpecialRank();
  const handleUpdateSpecialRank = (specialRankData: Partial<SpecialRank> & { id: number }) => {
    updateSpecialRankMutation.mutate(specialRankData, {
      onSuccess: () => {
        handleClosePanel();
        refetchSpecialRanks();
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
    setSelectedSpecialRank(null);
  };

  const handleRefresh = () => {
    refetchSpecialRanks();
    setSearchName("");
  };

  const setActiveSpecialRankMutation = useSetActiveSpecialRank();
  const handleSetActive = (id: number, isActive: boolean) => {
    setActiveSpecialRankMutation.mutate(
      { id: String(id), isActive },
      {
        onSuccess: () => {
          refetchSpecialRanks();
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

  const { data: specialRankDetailResponse, isLoading: isLoadingSpecialRankDetail } =
    useSpecialRankById(
      (activePanelMode === "edit" || activePanelMode === "detail") && selectedSpecialRank?.id
        ? String(selectedSpecialRank.id)
        : null,
      activePanelMode === "edit" || activePanelMode === "detail"
    );

  const columns = useSpecialRanksColumns({
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
    selectedSpecialRank,
    specialRankDetail: specialRankDetailResponse?.result || null,
    isLoadingSpecialRankDetail,
    handleClosePanel,
    handleUpdateSpecialRank,
    isUpdatingSpecialRank: updateSpecialRankMutation.isPending,
    isCreateModalOpen,
    handleCreate,
    handleCloseCreateModal,
    handleSaveNewSpecialRank,
    isCreatingSpecialRank: createSpecialRankMutation.isPending,
    deleteConfirmModal,
    handleCancelDelete,
    handleConfirmDelete,
    isDeletingSpecialRank: deleteSpecialRankMutation.isPending,
    handleRefresh,
    handleSetActive,
    isSettingActive: setActiveSpecialRankMutation.isPending,
  };
};
