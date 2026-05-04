import { useState, useMemo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEnumValuesColumns } from "./useEnumValuesColumns";
import type { EnumItem } from "./types";
import type { Option } from "@/shared/types";
import { rowCountOptions } from "@/shared/config/tableOptions";
import { useEnumItemsByTypeId, useEnumTypeById, useEnumItemById, useDeleteEnumItem, useCreateEnumItem, useUpdateEnumItem, useSetActiveEnumItem } from "@/features/settings/enum-types";
import type { CreateEnumItemRequest, UpdateEnumItemRequest } from "@/features/settings/enum-types";
import { useDebounce } from "@/shared/hooks";
import { ROUTES } from "@/app/routes/consts";

export const useEnumValuesPage = () => {
  const navigate = useNavigate();
  const { enumTypeId } = useParams<{ enumTypeId: string }>();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRowCount, setSelectedRowCount] = useState<Option | null>(
    rowCountOptions[0] || null
  );
  const [searchName, setSearchName] = useState<string>("");
  const [selectedEnumItem, setSelectedEnumItem] = useState<EnumItem | null>(null);
  const [activePanelMode, setActivePanelMode] = useState<"detail" | null>(null);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{
    isOpen: boolean;
    enumItemId: number | null;
  }>({ isOpen: false, enumItemId: null });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const debouncedSearchName = useDebounce(searchName, 1000);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchName]);

  // Fetch enum type info for title
  const { data: enumTypeResponse } = useEnumTypeById(enumTypeId || null, !!enumTypeId);

  // Fetch enum items
  const { data: enumItemsResponse, isLoading, isError, isFetching, refetch: refetchEnumItems } =
    useEnumItemsByTypeId(enumTypeId || null, !!enumTypeId);

  // Fetch enum item detail when panel is open
  const { data: enumItemDetailResponse, isLoading: isLoadingEnumItemDetail } = useEnumItemById(
    activePanelMode === "detail" && selectedEnumItem ? String(selectedEnumItem.id) : null,
    activePanelMode === "detail"
  );

  // Map enum items
  const allEnumItems = useMemo<EnumItem[]>(() => {
    if (!enumItemsResponse?.result) return [];
    
    const itemsArray = Array.isArray(enumItemsResponse.result)
      ? enumItemsResponse.result
      : (enumItemsResponse.result as any).data || [];
    
    return itemsArray.map((item: any) => ({
      id: item.id,
      enumTypeId: item.enumTypeId,
      enumTypeCode: item.enumTypeCode || "",
      code: item.code || "",
      displayName: item.displayName || "",
      sortOrder: item.sortOrder ?? 0,
      isActive: item.isActive ?? false,
      isSystem: item.isSystem ?? false,
    }));
  }, [enumItemsResponse]);

  // Frontend filtering and pagination
  const pageSize = Number(selectedRowCount?.id) || 10;
  
  const filteredAndPaginatedData = useMemo<EnumItem[]>(() => {
    let filtered = allEnumItems;
    if (debouncedSearchName.trim()) {
      const searchLower = debouncedSearchName.trim().toLowerCase();
      filtered = allEnumItems.filter(
        (item) =>
          item.code.toLowerCase().includes(searchLower) ||
          item.displayName.toLowerCase().includes(searchLower)
      );
    }

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filtered.slice(startIndex, endIndex);
  }, [allEnumItems, debouncedSearchName, currentPage, pageSize]);

  const totalCount = useMemo(() => {
    if (debouncedSearchName.trim()) {
      const searchLower = debouncedSearchName.trim().toLowerCase();
      return allEnumItems.filter(
        (item) =>
          item.code.toLowerCase().includes(searchLower) ||
          item.displayName.toLowerCase().includes(searchLower)
      ).length;
    }
    return allEnumItems.length;
  }, [allEnumItems, debouncedSearchName]);

  const data = filteredAndPaginatedData;

  const handleRefresh = () => {
    refetchEnumItems();
    setSearchName("");
  };

  const handleBack = () => {
    navigate(ROUTES.SETTINGS.HELPER_TABLES.ENUM_TYPES.LINK);
  };

  const handleDetail = (enumItem: EnumItem) => {
    setSelectedEnumItem(enumItem);
    setActivePanelMode("detail");
  };

  const handleClosePanel = () => {
    setActivePanelMode(null);
    setSelectedEnumItem(null);
  };

  const updateEnumItemMutation = useUpdateEnumItem();
  const handleUpdateEnumItem = (data: { id: number; displayName: string; sortOrder: number }) => {
    const payload: UpdateEnumItemRequest = {
      id: data.id,
      displayName: data.displayName.trim(),
      sortOrder: data.sortOrder,
    };
    updateEnumItemMutation.mutate(payload, {
      onSuccess: () => {
        refetchEnumItems();
        handleClosePanel();
      },
    });
  };

  const setActiveEnumItemMutation = useSetActiveEnumItem();
  const handleSetActiveEnumItem = (id: number, isActive: boolean) => {
    setActiveEnumItemMutation.mutate(
      { id: String(id), isActive },
      { onSuccess: () => refetchEnumItems() }
    );
  };

  const handleDelete = (enumItem: EnumItem) => {
    setDeleteConfirmModal({ isOpen: true, enumItemId: enumItem.id });
  };

  const handleCancelDelete = () => {
    setDeleteConfirmModal({ isOpen: false, enumItemId: null });
  };

  const deleteEnumItemMutation = useDeleteEnumItem();
  const handleConfirmDelete = () => {
    if (deleteConfirmModal.enumItemId) {
      deleteEnumItemMutation.mutate(String(deleteConfirmModal.enumItemId), {
        onSuccess: () => {
          if (selectedEnumItem?.id === deleteConfirmModal.enumItemId) {
            handleClosePanel();
          }
          setDeleteConfirmModal({ isOpen: false, enumItemId: null });
          refetchEnumItems();
        },
      });
    }
  };

  const handleCreate = () => setIsCreateModalOpen(true);
  const handleCloseCreateModal = () => setIsCreateModalOpen(false);

  const createEnumItemMutation = useCreateEnumItem();
  const handleSaveNewEnumItem = (data: { code: string; displayName: string; sortOrder: number }) => {
    if (!enumTypeId) return;
    const payload: CreateEnumItemRequest = {
      enumTypeId: parseInt(enumTypeId, 10),
      code: data.code.trim(),
      displayName: data.displayName.trim(),
      sortOrder: data.sortOrder,
    };
    createEnumItemMutation.mutate(payload, {
      onSuccess: () => {
        handleCloseCreateModal();
        refetchEnumItems();
      },
    });
  };

  const columns = useEnumValuesColumns({
    currentPage,
    selectedRowCount,
    onDetail: handleDetail,
    onDelete: handleDelete,
  });

  const enumTypeName = enumTypeResponse?.result?.displayName || "";
  const enumItemDetail = enumItemDetailResponse?.result ?? null;

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
    searchName,
    setSearchName,
    enumTypeName,
    handleRefresh,
    handleBack,
    activePanelMode,
    selectedEnumItem,
    enumItemDetail,
    isLoadingEnumItemDetail,
    handleClosePanel,
    handleUpdateEnumItem,
    isUpdatingEnumItem: updateEnumItemMutation.isPending,
    handleSetActiveEnumItem,
    isSettingActiveEnumItem: setActiveEnumItemMutation.isPending,
    deleteConfirmModal,
    handleCancelDelete,
    handleConfirmDelete,
    isDeletingEnumItem: deleteEnumItemMutation.isPending,
    isCreateModalOpen,
    handleCreate,
    handleCloseCreateModal,
    handleSaveNewEnumItem,
    isCreatingEnumItem: createEnumItemMutation.isPending,
  };
};
