import { useQuery } from "@tanstack/react-query";
import { cashOperationsService } from "../api";

export const CASH_BOXES_QUERY_KEY = (companyId?: string) => ["cash-boxes", companyId] as const;

export const useGetCashBoxes = (companyId?: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: CASH_BOXES_QUERY_KEY(companyId),
    queryFn: ({ signal }) => {
      if (!companyId) throw new Error("companyId is required");
      return cashOperationsService.getCashBoxes(companyId, signal);
    },
    enabled: (options?.enabled ?? true) && !!companyId,
  });
};
