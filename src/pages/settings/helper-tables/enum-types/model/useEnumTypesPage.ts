import { useState, useMemo, useEffect } from "react";
import { useEnumTypesColumns } from "./useEnumTypesColumns";
import type { EnumType } from "./types";
import type { Option } from "@/shared/types";
import { rowCountOptions } from "@/shared/config/tableOptions";
import {
  useEnumTypes,
  useEnumTypeById,
  useDeleteEnumType,
  useCreateEnumType,
  useUpdateEnumType,
} from "@/features/settings/enum-types";
import { useDebounce } from "@/shared/hooks";
import { ROUTES } from "@/app/routes/consts";

export const useEnumTypesPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRowCount, setSelectedRowCount] = useState<Option | null>(
    rowCountOptions[0] || null
  );
  const [searchName, setSearchName] = useState<string>("");
  const [selectedOperation, setSelectedOperation] = useState<Option | null>(null);
  const [selectedEnumType, setSelectedEnumType] = useState<EnumType | null>(null);
  const [activePanelMode, setActivePanelMode] = useState<"detail" | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{
    isOpen: boolean;
    enumTypeId: number | null;
  }>({ isOpen: false, enumTypeId: null });

  const debouncedSearchName = useDebounce(searchName, 1000);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchName]);

  // Fetch all enum types
  const { data: enumTypesResponse, isLoading, isError, isFetching, refetch: refetchEnumTypes } =
    useEnumTypes(true);

  // Göz ikonuna tıklananda seçilən enum tipinin detalları üçün request
  const { data: enumTypeDetailResponse, isLoading: isLoadingEnumTypeDetail } = useEnumTypeById(
    activePanelMode === "detail" && selectedEnumType ? String(selectedEnumType.id) : null,
    activePanelMode === "detail"
  );

  // Map enum types
  const allEnumTypes = useMemo<EnumType[]>(() => {
    if (!enumTypesResponse?.result) return [];
    
    const enumTypesArray = Array.isArray(enumTypesResponse.result)
      ? enumTypesResponse.result
      : (enumTypesResponse.result as any).data || [];
    
    return enumTypesArray.map((item: any) => ({
      id: item.id,
      code: item.code || "",
      displayName: item.displayName || "",
      description: item.description || null,
      isActive: item.isActive ?? false,
      isSystem: item.isSystem ?? false,
    }));
  }, [enumTypesResponse]);

  // Frontend filtering and pagination
  const pageSize = Number(selectedRowCount?.id) || 10;
  
  const filteredAndPaginatedData = useMemo<EnumType[]>(() => {
    let filtered = allEnumTypes;
    if (debouncedSearchName.trim()) {
      const searchLower = debouncedSearchName.trim().toLowerCase();
      filtered = allEnumTypes.filter(
        (enumType) =>
          enumType.code.toLowerCase().includes(searchLower) ||
          enumType.displayName.toLowerCase().includes(searchLower) ||
          (enumType.description && enumType.description.toLowerCase().includes(searchLower))
      );
    }

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filtered.slice(startIndex, endIndex);
  }, [allEnumTypes, debouncedSearchName, currentPage, pageSize]);

  const totalCount = useMemo(() => {
    if (debouncedSearchName.trim()) {
      const searchLower = debouncedSearchName.trim().toLowerCase();
      return allEnumTypes.filter(
        (enumType) =>
          enumType.code.toLowerCase().includes(searchLower) ||
          enumType.displayName.toLowerCase().includes(searchLower) ||
          (enumType.description && enumType.description.toLowerCase().includes(searchLower))
      ).length;
    }
    return allEnumTypes.length;
  }, [allEnumTypes, debouncedSearchName]);

  const data = filteredAndPaginatedData;

  const handleDetail = (enumType: EnumType) => {
    setSelectedEnumType(enumType);
    setActivePanelMode("detail");
  };

  const handleEnum = (enumType: EnumType) => {
    const url = `${window.location.origin}/app${ROUTES.SETTINGS.HELPER_TABLES.ENUM_VALUES.LINK.replace(":enumTypeId", String(enumType.id))}`;
    window.open(url, '_blank');
  };

  const handleClosePanel = () => {
    setActivePanelMode(null);
    setSelectedEnumType(null);
  };

  const handleDelete = (enumType: EnumType) => {
    setDeleteConfirmModal({ isOpen: true, enumTypeId: enumType.id });
  };

  const handleCancelDelete = () => {
    setDeleteConfirmModal({ isOpen: false, enumTypeId: null });
  };

  const deleteEnumTypeMutation = useDeleteEnumType();
  const handleConfirmDelete = () => {
    if (deleteConfirmModal.enumTypeId) {
      deleteEnumTypeMutation.mutate(String(deleteConfirmModal.enumTypeId), {
        onSuccess: () => {
          setDeleteConfirmModal({ isOpen: false, enumTypeId: null });
          handleClosePanel();
        },
      });
    }
  };

  const handleCreate = () => setIsCreateModalOpen(true);
  const handleCloseCreateModal = () => setIsCreateModalOpen(false);

  const createEnumTypeMutation = useCreateEnumType();
  const handleSaveNewEnumType = (payload: { code: string; displayName: string; description: string }) => {
    createEnumTypeMutation.mutate(payload, {
      onSuccess: () => handleCloseCreateModal(),
    });
  };

  const updateEnumTypeMutation = useUpdateEnumType();
  const handleUpdateEnumType = (payload: { id: number; displayName: string; description: string }) => {
    updateEnumTypeMutation.mutate(payload, {
      onSuccess: () => handleClosePanel(),
    });
  };

  const handleRefresh = () => {
    refetchEnumTypes();
    setSearchName("");
  };

  const columns = useEnumTypesColumns({
    currentPage,
    selectedRowCount,
    onDetail: handleDetail,
    onEnum: handleEnum,
    onDelete: handleDelete,
  });

  const enumTypeDetail = enumTypeDetailResponse?.result ?? null;

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
    selectedEnumType,
    enumTypeDetail,
    isLoadingEnumTypeDetail,
    handleClosePanel,
    handleRefresh,
    deleteConfirmModal,
    handleCancelDelete,
    handleConfirmDelete,
    isDeletingEnumType: deleteEnumTypeMutation.isPending,
    isCreateModalOpen,
    handleCreate,
    handleCloseCreateModal,
    handleSaveNewEnumType,
    isCreatingEnumType: createEnumTypeMutation.isPending,
    handleUpdateEnumType,
    isUpdatingEnumType: updateEnumTypeMutation.isPending,
  };
};
