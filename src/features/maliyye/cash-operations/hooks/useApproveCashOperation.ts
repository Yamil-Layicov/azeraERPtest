import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cashOperationsService } from "../api/cashOperationsService";
import type { ApproveCashOperationRequest } from "../model/types";
import { CASH_OPERATIONS_QUERY_KEYS } from "./useCreateCashOperation";

export const useApproveCashOperation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ApproveCashOperationRequest) =>
      cashOperationsService.approve(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CASH_OPERATIONS_QUERY_KEYS.all],
      });
      queryClient.invalidateQueries({
        queryKey: ["cashOperations", "getAllPendingApprovalCashOperations"],
      });
    },
  });
};
