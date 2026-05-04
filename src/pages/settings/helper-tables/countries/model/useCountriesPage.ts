import { useState, useMemo, useEffect } from "react";
import { useCountriesColumns } from "./useCountriesColumns";
import type { Country } from "./types";
import type { Option } from "@/shared/types";
import { rowCountOptions } from "@/shared/config/tableOptions";
import {
  useCountries,
  useCountryById,
  useCreateCountry,
  useUpdateCountry,
  useDeleteCountry,
  useSetActiveCountry,
} from "@/features/settings/countries";
import { useDebounce } from "@/shared/hooks";
import { getBackendErrorMessage } from "@/shared/api/httpClient";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import { ROUTES } from "@/app/routes/consts";

export const useCountriesPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRowCount, setSelectedRowCount] = useState<Option | null>(
    rowCountOptions[0] || null
  );
  const [searchName, setSearchName] = useState<string>("");

  const [selectedOperation, setSelectedOperation] = useState<Option | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [activePanelMode, setActivePanelMode] = useState<
    "edit" | "detail" | null
  >(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{
    isOpen: boolean;
    countryId: number | null;
  }>({ isOpen: false, countryId: null });

  const debouncedSearchName = useDebounce(searchName, 1000);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchName]);

  // Frontend pagination için tüm veriyi çekiyoruz
  const { data: countriesResponse, isLoading, isError, isFetching, refetch: refetchCountries } =
    useCountries(true);

  // Tüm ülkeleri map ediyoruz
  const allCountries = useMemo<Country[]>(() => {
    if (!countriesResponse?.result) return [];
    
    // Response result bir array mi yoksa CountriesResult mu kontrol ediyoruz
    const countriesArray = Array.isArray(countriesResponse.result)
      ? countriesResponse.result
      : (countriesResponse.result as any).data || [];
    
    return countriesArray.map((item: any) => ({
      id: item.id,
      name: item.name,
      code: item.code || "",
      sortOrder: item.sortOrder ?? 0,
      nativeName: item.nativeName || "",
      phoneCode: item.phoneCode || "",
      currencyCode: item.currencyCode || "",
      isActive: item.isActive ?? false,
      isSystem: item.isSystem ?? false,
    }));
  }, [countriesResponse]);

  // Frontend'de filtreleme ve pagination
  const pageSize = Number(selectedRowCount?.id) || 10;
  
  const filteredAndPaginatedData = useMemo<Country[]>(() => {
    // Arama filtresi
    let filtered = allCountries;
    if (debouncedSearchName.trim()) {
      const searchLower = debouncedSearchName.trim().toLowerCase();
      filtered = allCountries.filter(
        (country) =>
          country.name.toLowerCase().includes(searchLower) ||
          country.code.toLowerCase().includes(searchLower) ||
          country.nativeName.toLowerCase().includes(searchLower)
      );
    }

    // Pagination
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filtered.slice(startIndex, endIndex);
  }, [allCountries, debouncedSearchName, currentPage, pageSize]);

  const totalCount = useMemo(() => {
    if (debouncedSearchName.trim()) {
      const searchLower = debouncedSearchName.trim().toLowerCase();
      return allCountries.filter(
        (country) =>
          country.name.toLowerCase().includes(searchLower) ||
          country.code.toLowerCase().includes(searchLower) ||
          country.nativeName.toLowerCase().includes(searchLower)
      ).length;
    }
    return allCountries.length;
  }, [allCountries, debouncedSearchName]);

  const data = filteredAndPaginatedData;

  const handleDetail = (country: Country) => {
    setSelectedCountry(country);
    setActivePanelMode("detail");
  };

  const handleDelete = (country: Country) => {
    setDeleteConfirmModal({ isOpen: true, countryId: country.id });
  };

  const handleCities = (country: Country) => {
    const url = `${window.location.origin}/app${ROUTES.SETTINGS.HELPER_TABLES.CITIES.LINK}?countryId=${country.id}`;
    window.open(url, '_blank');
  };

  const handleCancelDelete = () => {
    setDeleteConfirmModal({ isOpen: false, countryId: null });
  };

  const deleteCountryMutation = useDeleteCountry();
  const handleConfirmDelete = () => {
    if (deleteConfirmModal.countryId) {
      deleteCountryMutation.mutate(String(deleteConfirmModal.countryId), {
        onSuccess: () => {
          if (selectedCountry?.id === deleteConfirmModal.countryId) {
            handleClosePanel();
          }
          setDeleteConfirmModal({ isOpen: false, countryId: null });
        },
        onError: (error) => {
          // Response-dakı errorMessage-ı göstər
          const axiosError = error as AxiosError;
          const errorData = axiosError.response?.data as { errorMessage?: string } | undefined;
          
          // Əvvəlcə errorMessage-ı yoxla (response-dan birbaşa)
          if (errorData?.errorMessage) {
            toast.error(errorData.errorMessage);
          } else {
            // errorMessage yoxdursa, getBackendErrorMessage istifadə et
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

  const createCountryMutation = useCreateCountry();
  const handleSaveNewCountry = (newData: {
    code: string;
    name: string;
    nativeName: string | null;
    phoneCode: string | null;
    currencyCode: string | null;
    sortOrder: number | null;
  }) => {
    createCountryMutation.mutate(
      {
        code: newData.code,
        name: newData.name,
        nativeName: newData.nativeName,
        phoneCode: newData.phoneCode,
        currencyCode: newData.currencyCode,
        sortOrder: newData.sortOrder,
      },
      {
        onSuccess: () => {
          setIsCreateModalOpen(false);
          refetchCountries();
        },
        onError: (error) => {
          // Response-dakı errorMessage-ı göstər
          const axiosError = error as AxiosError;
          const errorData = axiosError.response?.data as { errorMessage?: string } | undefined;
          
          // Əvvəlcə errorMessage-ı yoxla (response-dan birbaşa)
          if (errorData?.errorMessage) {
            toast.error(errorData.errorMessage);
          } else {
            // errorMessage yoxdursa, getBackendErrorMessage istifadə et
            const errorMessage = getBackendErrorMessage(axiosError);
            toast.error(errorMessage);
          }
        },
      }
    );
  };

  const updateCountryMutation = useUpdateCountry();
  const handleUpdateCountry = (countryData: {
    id: number;
    name: string;
    code: string;
    sortOrder: number;
    nativeName: string;
    phoneCode: string;
    currencyCode: string;
  }) => {
    updateCountryMutation.mutate(
      {
        id: countryData.id,
        code: countryData.code,
        name: countryData.name,
        nativeName: countryData.nativeName,
        phoneCode: countryData.phoneCode,
        currencyCode: countryData.currencyCode,
        sortOrder: countryData.sortOrder,
      },
      {
        onSuccess: () => {
          handleClosePanel();
          refetchCountries();
        },
        onError: (error) => {
          // Response-dakı errorMessage-ı göstər
          const axiosError = error as AxiosError;
          const errorData = axiosError.response?.data as { errorMessage?: string } | undefined;
          
          // Əvvəlcə errorMessage-ı yoxla (response-dan birbaşa)
          if (errorData?.errorMessage) {
            toast.error(errorData.errorMessage);
          } else {
            // errorMessage yoxdursa, getBackendErrorMessage istifadə et
            const errorMessage = getBackendErrorMessage(axiosError);
            toast.error(errorMessage);
          }
        },
      }
    );
  };

  const handleClosePanel = () => {
    setActivePanelMode(null);
    setSelectedCountry(null);
  };

  const handleRefresh = () => {
    refetchCountries();
    setSearchName("");
  };

  const setActiveCountryMutation = useSetActiveCountry();
  const handleSetActive = (id: number, isActive: boolean) => {
    setActiveCountryMutation.mutate(
      { id: String(id), isActive },
      {
        onSuccess: () => {
          refetchCountries();
        },
      }
    );
  };

  // Edit və detail üçün API-dan güncəl məlumat gətir (həmişə güncəl məlumat lazımdır)
  const { data: countryDetailResponse, isLoading: isLoadingCountryDetail } =
    useCountryById(
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
    onCities: handleCities,
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
    countryDetail: countryDetailResponse?.result || null,
    isLoadingCountryDetail,
    handleClosePanel,
    handleUpdateCountry,
    isUpdatingCountry: updateCountryMutation.isPending,
    isCreateModalOpen,
    handleCreate,
    handleCloseCreateModal,
    handleSaveNewCountry,
    isCreatingCountry: createCountryMutation.isPending,
    deleteConfirmModal,
    handleCancelDelete,
    handleConfirmDelete,
    isDeletingCountry: deleteCountryMutation.isPending,
    handleRefresh,
    handleSetActive,
    isSettingActive: setActiveCountryMutation.isPending,
  };
};
