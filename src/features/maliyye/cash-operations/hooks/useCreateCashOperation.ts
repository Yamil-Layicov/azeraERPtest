import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cashOperationsService } from "../api";
import type { CreateCashOperationRequest } from "../model/types";

export const CASH_OPERATIONS_QUERY_KEYS = {
  all: ["cash-operations"] as const,
};

export const useCreateCashOperation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCashOperationRequest) =>
      cashOperationsService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CASH_OPERATIONS_QUERY_KEYS.all });
    },
  });
};
