import { useState, useMemo, useEffect } from "react";
import { useCountriesColumns } from "./useCountriesColumns";
import type { LdapDirectory } from "./types";
import type { Option } from "@/shared/types";
import { rowCountOptions } from "@/shared/config/tableOptions";
import {
  useSetActiveLdapDirectory,
  useTestLdapConnection,
  useCreateLdapDirectory,
  useGetLdapDirectories,
  useGetLdapDirectoryById,
  useUpdateLdapDirectory,
  useDeleteLdapDirectory,
  useAddOrRemoveLdapDirectoryCompanies,
} from "@/features/settings/countries";
import { useDebounce } from "@/shared/hooks";
import toast from "react-hot-toast";

export const useCountriesPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRowCount, setSelectedRowCount] = useState<Option | null>(
    rowCountOptions[0] || null
  );
  const [searchName, setSearchName] = useState<string>("");

  const [selectedOperation, setSelectedOperation] = useState<Option | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<LdapDirectory | null>(null);
  const [activePanelMode, setActivePanelMode] = useState<
    "edit" | "detail" | null
  >(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{
    isOpen: boolean;
    countryId: string | null;
  }>({ isOpen: false, countryId: null });

  const debouncedSearchName = useDebounce(searchName, 1000);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchName]);

  // LDAP Directory məlumatlarını çəkirik
  const { data: ldapResponse, isLoading, isError, isFetching, refetch: refetchLdap } =
    useGetLdapDirectories();

  // LDAP Directory-ləri map edirik
  const allLdapDirectories = useMemo<LdapDirectory[]>(() => {
    if (!ldapResponse?.result) return [];
    
    // Response result bir array mi yoksa object mi kontrol edirik
    const ldapArray = Array.isArray(ldapResponse.result)
      ? ldapResponse.result
      : (ldapResponse.result as any).data || [];
    
    return ldapArray.map((item: any) => ({
      id: item.id || "",
      name: item.name || "",
      domain: item.domain || "",
      host: item.host || "",
      port: item.port || 0,
      useSsl: item.useSsl ?? false,
      useTls: item.useTls ?? false,
      baseDn: item.baseDn || "",
      username: item.username || "",
      password: item.password || "",
      searchFilter: item.searchFilter || "",
      timeout: item.timeout || 0,
      isActive: item.isActive ?? false,
      companyResponses: item.companyResponses || [],
    }));
  }, [ldapResponse]);

  const data = allLdapDirectories;
  const totalCount = allLdapDirectories.length;

  const handleDetail = (item: LdapDirectory) => {
    setSelectedCountry(item);
    setActivePanelMode("detail");
  };

  const handleDelete = (item: LdapDirectory) => {
    setDeleteConfirmModal({ isOpen: true, countryId: item.id });
  };


  const handleCancelDelete = () => {
    setDeleteConfirmModal({ isOpen: false, countryId: null });
  };

  const deleteLdapDirectoryMutation = useDeleteLdapDirectory();
  const handleConfirmDelete = () => {
    if (deleteConfirmModal.countryId) {
      deleteLdapDirectoryMutation.mutate(deleteConfirmModal.countryId, {
        onSuccess: () => {
          if (selectedCountry?.id === deleteConfirmModal.countryId) {
            handleClosePanel();
          }
          setDeleteConfirmModal({ isOpen: false, countryId: null });
          toast.success("Uğurla silindi");
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

  const createLdapDirectoryMutation = useCreateLdapDirectory();
  const handleSaveNewCountry = (newData: {
    name: string;
    domain: string;
    host: string;
    port: number;
    useSsl: boolean;
    useTls: boolean;
    baseDn: string;
    username: string;
    password: string;
    searchFilter: string;
    timeout: number;
    isActive: boolean;
  }) => {
    createLdapDirectoryMutation.mutate(
      {
        name: newData.name,
        domain: newData.domain,
        host: newData.host,
        port: newData.port,
        useSsl: newData.useSsl,
        useTls: newData.useTls,
        baseDn: newData.baseDn,
        username: newData.username,
        password: newData.password,
        searchFilter: newData.searchFilter,
        timeout: newData.timeout,
        isActive: newData.isActive,
      },
      {
        onSuccess: () => {
          setIsCreateModalOpen(false);
          refetchLdap();
          toast.success("Yeni məlumat uğurla əlavə edildi");
        },
      }
    );
  };

  const updateLdapDirectoryMutation = useUpdateLdapDirectory();
  const handleUpdateCountry = (countryData: any) => {
    updateLdapDirectoryMutation.mutate(
      {
        ...countryData
      },
      {
        onSuccess: () => {
          handleClosePanel();
          refetchLdap();
          toast.success("Məlumat uğurla yeniləndi");
        },
      }
    );
  };

  const handleClosePanel = () => {
    setActivePanelMode(null);
    setSelectedCountry(null);
  };

  const handleRefresh = () => {
    refetchLdap();
    setSearchName("");
  };

  const setActiveLdapDirectoryMutation = useSetActiveLdapDirectory();
  const handleSetActive = (id: string, isActive: boolean) => {
    setActiveLdapDirectoryMutation.mutate(
      { id, isActive },
      {
        onSuccess: () => {
          refetchLdap();
          toast.success(`Məlumat uğurla ${isActive ? "aktiv" : "deaktiv"} edildi`);
        },
      }
    );
  };

  const addOrRemoveLdapDirectoryCompaniesMutation = useAddOrRemoveLdapDirectoryCompanies();
  const handleAddOrRemoveCompany = (directoryId: string, companyIds: string[]) => {
    addOrRemoveLdapDirectoryCompaniesMutation.mutate(
      { directoryId, companyIds },
      {
        onSuccess: () => {
          refetchLdap();
          toast.success("Şirkət məlumatları uğurla yeniləndi");
        },
      }
    );
  };

  // Edit və detail üçün API-dan güncəl məlumat gətir
  const { data: ldapDetailResponse, isLoading: isLoadingLdapDetail } =
    useGetLdapDirectoryById(
      (activePanelMode === "edit" || activePanelMode === "detail") && selectedCountry?.id
        ? String(selectedCountry.id)
        : null,
      activePanelMode === "edit" || activePanelMode === "detail"
    );

  const columns = useCountriesColumns({
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
    selectedCountry,
    countryDetail: ldapDetailResponse?.result || null,
    isLoadingCountryDetail: isLoadingLdapDetail,
    handleClosePanel,
    handleUpdateCountry,
    isUpdatingCountry: updateLdapDirectoryMutation.isPending,
    isCreateModalOpen,
    handleCreate,
    handleCloseCreateModal,
    handleSaveNewCountry,
    isCreatingCountry: createLdapDirectoryMutation.isPending,
    deleteConfirmModal,
    handleCancelDelete,
    handleConfirmDelete,
    isDeletingCountry: deleteLdapDirectoryMutation.isPending,
    handleRefresh,
    handleSetActive,
    isSettingActive: setActiveLdapDirectoryMutation.isPending,
    testLdapConnection: useTestLdapConnection(),
    handleAddOrRemoveCompany,
    isUpdatingCompanies: addOrRemoveLdapDirectoryCompaniesMutation.isPending,
  };
};

