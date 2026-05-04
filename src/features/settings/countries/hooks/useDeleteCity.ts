import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import { countriesService } from "../api/countriesService";
import { CITIES_QUERY_KEYS } from "./useGetCities";
import { getBackendErrorMessage } from "@/shared/api/httpClient";

export const useDeleteCity = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, string>({
    mutationFn: (id: string) => countriesService.deleteCity(id),
    onSuccess: () => {
      toast.success("Şəhər uğurla silindi");
      queryClient.invalidateQueries({ queryKey: CITIES_QUERY_KEYS.all });
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
