import { useQuery } from "@tanstack/react-query";
import { cashOperationsService } from "../api/cashOperationsService";

export const useGetPendingApprovalCashBoxes = (options?: {
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: ["cashOperations", "pendingApprovalCashBoxes"],
    queryFn: ({ signal }) =>
      cashOperationsService.getPendingApprovalCashBoxes(signal),
    ...options,
  });
};
