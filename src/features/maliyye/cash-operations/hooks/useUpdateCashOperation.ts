import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cashOperationsService } from "../api";
import { CASH_OPERATIONS_QUERY_KEYS } from "./useCreateCashOperation";
import type { UpdateCashOperationRequest } from "../model/types";

export const useUpdateCashOperation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCashOperationRequest) => cashOperationsService.updateCashOperation(data),
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: CASH_OPERATIONS_QUERY_KEYS.all,
      });
    },
  });
};
