import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import { enumTypesService } from "../api";
import { getBackendErrorMessage } from "@/shared/api/httpClient";

export const useDeleteEnumItem = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, string>({
    mutationFn: (id: string) => enumTypesService.deleteEnumItem(id),
    onSuccess: () => {
      toast.success("Enum dəyəri uğurla silindi");
      queryClient.invalidateQueries({ queryKey: ["enumItems"] });
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
