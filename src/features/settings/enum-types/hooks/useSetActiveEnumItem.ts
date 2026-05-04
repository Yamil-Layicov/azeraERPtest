import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import { enumTypesService } from "../api";
import { getBackendErrorMessage } from "@/shared/api/httpClient";

export const useSetActiveEnumItem = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, { id: string; isActive: boolean }>({
    mutationFn: ({ id, isActive }) => enumTypesService.setActiveEnumItem(id, isActive),
    onSuccess: () => {
      toast.success("Enum dəyəri uğurla yeniləndi");
      queryClient.invalidateQueries({ queryKey: ["enumItems"] });
      queryClient.invalidateQueries({ queryKey: ["enumItem"] });
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
