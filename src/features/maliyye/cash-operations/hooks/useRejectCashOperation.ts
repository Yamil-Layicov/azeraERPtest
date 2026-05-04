import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cashOperationsService } from "../api";
import { CASH_OPERATIONS_QUERY_KEYS } from "./useCreateCashOperation";
import type { RejectCashOperationRequest } from "../model/types";

export const useRejectCashOperation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RejectCashOperationRequest) => cashOperationsService.reject(data),
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: CASH_OPERATIONS_QUERY_KEYS.all,
      });
    },
  });
};
