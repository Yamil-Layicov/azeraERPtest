import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import { enumTypesService } from "../api";
import { getBackendErrorMessage } from "@/shared/api/httpClient";

interface SetActiveEnumTypeParams {
  id: string;
  isActive: boolean;
}

export const useSetActiveEnumType = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, SetActiveEnumTypeParams>({
    mutationFn: ({ id, isActive }) => enumTypesService.setActiveEnumType(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enumTypes"] });
      queryClient.invalidateQueries({ queryKey: ["enumType"] });
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
