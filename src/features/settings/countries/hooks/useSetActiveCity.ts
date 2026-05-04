import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import { countriesService } from "../api/countriesService";
import { getBackendErrorMessage } from "@/shared/api/httpClient";

interface SetActiveCityParams {
  id: string;
  isActive: boolean;
}

export const useSetActiveCity = () => {
  return useMutation<void, AxiosError, SetActiveCityParams>({
    mutationFn: ({ id, isActive }) => countriesService.setActiveCity(id, isActive),
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
