import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cashOperationsService } from "../api/cashOperationsService";
import type { DeleteCashOperationResponse } from "../model/types";


export const useDeleteCashOperation = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteCashOperationResponse, Error, string>({
    mutationFn: (id: string) => cashOperationsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cashOperations"],
      });
    },
  });
};
