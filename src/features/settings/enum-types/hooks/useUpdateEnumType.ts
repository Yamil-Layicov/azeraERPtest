import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import { enumTypesService } from "../api";
import { getBackendErrorMessage } from "@/shared/api/httpClient";
import type { UpdateEnumTypeRequest } from "../model/types";

export const useUpdateEnumType = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, UpdateEnumTypeRequest>({
    mutationFn: (payload) => enumTypesService.updateEnumType(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enumTypes"] });
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
