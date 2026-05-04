import { useState, useMemo, useEffect } from "react";
import { useCitiesColumns } from "./useCitiesColumns";
import type { City } from "./types";
import type { Option } from "@/shared/types";
import { rowCountOptions } from "@/shared/config/tableOptions";
import { countriesService } from "@/features/settings/countries/api/countriesService";
import { useDebounce } from "@/shared/hooks";
import { getBackendErrorMessage } from "@/shared/api/httpClient";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import {
  useCreateCity,
  useDeleteCity,
  useGetCityById,
  useUpdateCity,
  useSetActiveCity,
} from "@/features/settings/countries";

interface UseCitiesPageProps {
  countryId: number;
}

export const useCitiesPage = ({ countryId }: UseCitiesPageProps) => {
  const [countryName, setCountryName] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRowCount, setSelectedRowCount] = useState<Option | null>(
    rowCountOptions[0] || null
  );
  const [searchName, setSearchName] = useState<string>("");
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [activePanelMode, setActivePanelMode] = useState<"detail" | null>(null);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{
    isOpen: boolean;
    cityId: number | null;
  }>({ isOpen: false, cityId: null });

  const debouncedSearchName = useDebounce(searchName, 1000);

  // Şəhərləri yüklə
  const loadCities = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const response = await countriesService.getCities(String(countryId));
      if (response.isSuccess && response.result) {
        const citiesData: City[] = response.result.map((item) => ({
          id: item.id,
          countryId: item.countryId,
          name: item.name,
          isActive: item.isActive,
          isSystem: item.isSystem,
        }));
        setCities(citiesData);
      }
    } catch (error) {
      setIsError(true);
      const errorMessage = getBackendErrorMessage(error as AxiosError);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Ölkə adını və şəhərləri yüklə
  useEffect(() => {
    const loadCountryName = async () => {
      try {
        const response = await countriesService.getCountryById(String(countryId));
        if (response.isSuccess && response.result) {
          setCountryName(response.result.name);
        }
      } catch (error) {
        toast.error(getBackendErrorMessage(error as AxiosError));
      }
    };
    if (countryId) {
      loadCountryName();
      loadCities();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryId]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchName]);

  // Frontend'de filtreleme ve pagination
  const pageSize = Number(selectedRowCount?.id) || 10;

  const filteredAndPaginatedData = useMemo<City[]>(() => {
    // Arama filtresi
    let filtered = cities;
    if (debouncedSearchName.trim()) {
      const searchLower = debouncedSearchName.trim().toLowerCase();
      filtered = cities.filter((city) =>
        city.name.toLowerCase().includes(searchLower)
      );
    }

    // Pagination
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filtered.slice(startIndex, endIndex);
  }, [cities, debouncedSearchName, currentPage, pageSize]);

  const totalCount = useMemo(() => {
    if (debouncedSearchName.trim()) {
      const searchLower = debouncedSearchName.trim().toLowerCase();
      return cities.filter((city) =>
        city.name.toLowerCase().includes(searchLower)
      ).length;
    }
    return cities.length;
  }, [cities, debouncedSearchName]);

  const data = filteredAndPaginatedData;

  const handleDetail = (city: City) => {
    setSelectedCity(city);
    setActivePanelMode("detail");
  };

  const handleClosePanel = () => {
    setSelectedCity(null);
    setActivePanelMode(null);
  };

  const { data: cityDetailResponse, isLoading: isLoadingCityDetail } = useGetCityById(
    selectedCity ? String(selectedCity.id) : null,
    activePanelMode === "detail"
  );

  const cityDetail = cityDetailResponse?.isSuccess ? cityDetailResponse.result : null;

  const updateCityMutation = useUpdateCity();
  const handleUpdateCity = (data: { id: number; name: string }) => {
    updateCityMutation.mutate(
      {
        id: data.id,
        name: data.name,
      },
      {
        onSuccess: () => {
          handleClosePanel();
          loadCities();
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
      } 
    );
  };

  const handleDelete = (city: City) => {
    setDeleteConfirmModal({ isOpen: true, cityId: city.id });
  };

  const handleCancelDelete = () => {
    setDeleteConfirmModal({ isOpen: false, cityId: null });
  };

  const deleteCityMutation = useDeleteCity();
  const handleConfirmDelete = () => {
    if (deleteConfirmModal.cityId) {
      deleteCityMutation.mutate(String(deleteConfirmModal.cityId), {
        onSuccess: () => {
          setDeleteConfirmModal({ isOpen: false, cityId: null });
          loadCities();
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

  const columns = useCitiesColumns({
    currentPage,
    selectedRowCount,
    onDetail: handleDetail,
    onDelete: handleDelete,
  });

  const handleRefresh = () => {
    loadCities();
    setSearchName("");
  };

  const setActiveCityMutation = useSetActiveCity();
  const handleSetActiveCity = (id: number, isActive: boolean) => {
    setActiveCityMutation.mutate(
      { id: String(id), isActive },
      { onSuccess: () => loadCities() }
    );
  };

  const handleCreate = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const createCityMutation = useCreateCity();
  const handleSaveNewCity = (newData: {
    name: string;
    countryId: number;
  }) => {
    createCityMutation.mutate(newData, {
      onSuccess: () => {
        handleCloseCreateModal();
        loadCities();
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

  return {
    data,
    totalCount,
    isLoading,
    isError,
    columns,
    currentPage,
    setCurrentPage,
    selectedRowCount,
    setSelectedRowCount,
    searchName,
    setSearchName,
    countryName,
    handleRefresh,
    isCreateModalOpen,
    handleCreate,
    handleCloseCreateModal,
    handleSaveNewCity,
    isCreatingCity: createCityMutation.isPending,
    countryId,
    deleteConfirmModal,
    handleCancelDelete,
    handleConfirmDelete,
    isDeletingCity: deleteCityMutation.isPending,
    selectedCity,
    activePanelMode,
    cityDetail,
    isLoadingCityDetail,
    handleClosePanel,
    handleUpdateCity,
    isUpdatingCity: updateCityMutation.isPending,
    handleSetActiveCity,
    isSettingActiveCity: setActiveCityMutation.isPending,
  };
};
