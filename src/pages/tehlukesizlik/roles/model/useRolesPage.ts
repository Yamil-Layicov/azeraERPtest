import { useState, useMemo, useEffect } from "react"; 
import { useRolesColumns } from "./useRolesColumns";
import type { Role } from "./types";
import type { Option } from "@/shared/types";
import { rowCountOptions } from "@/shared/config/tableOptions";
import { useRoles, useCreateRole, useUpdateRole, useDeleteRole, useRoleById } from "@/features/security/roles/hooks";
import { useDebounce } from "@/shared/hooks";
import { getBackendErrorMessage } from "@/shared/api/httpClient";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";

export const useRolesPage = () => {
  // --- States ---
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRowCount, setSelectedRowCount] = useState<Option | null>(rowCountOptions[0] || null);
  const [searchName, setSearchName] = useState<string>("");

  const [selectedOperation, setSelectedOperation] = useState<Option | null>(null);
  
  // Panel States
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [activePanelMode, setActivePanelMode] = useState<'create' | 'edit' | 'detail' | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{ isOpen: boolean; roleId: string | null }>({
    isOpen: false,
    roleId: null,
  });

  // --- Debounced Search ---
  const debouncedSearchName = useDebounce(searchName, 1000);

  // Reset page to 1 when debounced search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchName]);

  // --- API Data ---
  const pageSize = Number(selectedRowCount?.id) || 10;
  const pageIndex = currentPage - 1;
  
  const { data: rolesResponse, isLoading, isError, isFetching, refetch: refetchRoles } = useRoles(
    {
      pageSize,
      pageIndex,
      isDesc: false,
      orderBy: null,
      name: debouncedSearchName.trim() || null,
    },
    true
  );

  // Transform API data to Role format
  const data = useMemo<Role[]>(() => {
    if (!rolesResponse?.result?.data) return [];
    return rolesResponse.result.data.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description || "",
      noAction: item.noAction,
    }));
  }, [rolesResponse]);

  // --- Handlers ---
  
  const handleDetail = (role: Role) => {
    setSelectedRole(role);
    setActivePanelMode('detail');
  };

  // const handleEdit = (role: Role) => {
  //   setSelectedRole(role);
  //   setActivePanelMode('edit');
  // };

  const handleDelete = (role: Role) => {
    setDeleteConfirmModal({ isOpen: true, roleId: role.id });
  };

  const handleCancelDelete = () => {
    setDeleteConfirmModal({ isOpen: false, roleId: null });
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmModal.roleId) {
      deleteRoleMutation.mutate(deleteConfirmModal.roleId, {
        onSuccess: () => {
          if (selectedRole?.id === deleteConfirmModal.roleId) {
            handleClosePanel();
          }
          setDeleteConfirmModal({ isOpen: false, roleId: null });
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

  const createRoleMutation = useCreateRole();
  const updateRoleMutation = useUpdateRole();
  const deleteRoleMutation = useDeleteRole();

  const handleSaveNewRole = (newRoleData: { name: string; description: string }) => {
    createRoleMutation.mutate(
      {
        name: newRoleData.name,
        description: newRoleData.description,
      },
      {
        onSuccess: () => {
          setIsCreateModalOpen(false);
        },
        onError: (error) => {
          toast.error(getBackendErrorMessage(error as AxiosError) || "Rol yaradılarkən xəta baş verdi");
        },
      }
    );
  };

  const handleUpdateRole = (roleData: { id: string; name: string; description: string }) => {
    updateRoleMutation.mutate(
      {
        id: roleData.id,
        name: roleData.name,
        description: roleData.description,
      },
      {
        onSuccess: () => {
          handleClosePanel();
        },
        onError: (error) => {
          toast.error(getBackendErrorMessage(error as AxiosError) || "Rol yenilənərkən xəta baş verdi");
        },
      }
    );
  };

  const handleClosePanel = () => {
    setActivePanelMode(null);
    setSelectedRole(null);
  };

  const handleRefresh = () => {
    refetchRoles();
    setSearchName("");
  };

  // --- API: Get Role By ID (for detail mode) ---
  const { data: roleDetailResponse, isLoading: isLoadingRoleDetail } = useRoleById(
    activePanelMode === 'detail' ? selectedRole?.id || null : null,
    activePanelMode === 'detail'
  );

  // --- Columns ---
  const columns = useRolesColumns({
    currentPage,
    selectedRowCount,
    onDetail: handleDetail,
    onDelete: handleDelete,
  });

  return {
    data,
    totalCount: rolesResponse?.result?.totalCount || 0,
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
    selectedRole,
    roleDetail: roleDetailResponse?.result || null,
    isLoadingRoleDetail,
    handleClosePanel,
    handleUpdateRole,
    isUpdatingRole: updateRoleMutation.isPending,
    isCreateModalOpen,
    handleCreate,
    handleCloseCreateModal,
    handleSaveNewRole,
    isCreatingRole: createRoleMutation.isPending,
    deleteConfirmModal,
    handleCancelDelete,
    handleConfirmDelete,
    isDeletingRole: deleteRoleMutation.isPending,
    handleRefresh
  };
};