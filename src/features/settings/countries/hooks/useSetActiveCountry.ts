import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import { countriesService } from "../api/countriesService";
import { COUNTRIES_QUERY_KEYS } from "./useCountries";
import { getBackendErrorMessage } from "@/shared/api/httpClient";

interface SetActiveCountryParams {
  id: string;
  isActive: boolean;
}

export const useSetActiveCountry = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, SetActiveCountryParams>({
    mutationFn: ({ id, isActive }) => countriesService.setActive(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COUNTRIES_QUERY_KEYS.all });
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
