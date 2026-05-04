import { useQuery } from "@tanstack/react-query";
import { cashOperationsService } from "../api/cashOperationsService";
import type { GetAllPendingApprovalCashOperationsRequest } from "../model/types";

export const useGetAllPendingApprovalCashOperations = (
  params: GetAllPendingApprovalCashOperationsRequest,
) => {
  return useQuery({
    queryKey: ["cashOperations", "getAllPendingApprovalCashOperations", params],
    queryFn: ({ signal }) =>
      cashOperationsService.getAllPendingApprovalCashOperations(params, signal),
  });
};
