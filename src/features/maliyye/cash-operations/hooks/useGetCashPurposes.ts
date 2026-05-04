import { useQuery } from "@tanstack/react-query";
import { cashOperationsService } from "../api";

export const CASH_PURPOSES_QUERY_KEY = ["cash-purposes"] as const;

export const useGetCashPurposes = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: CASH_PURPOSES_QUERY_KEY,
    queryFn: ({ signal }) => cashOperationsService.getCashPurposes(signal),
    ...options,
  });
};
