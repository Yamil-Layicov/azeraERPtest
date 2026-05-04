import { useQuery } from "@tanstack/react-query";
import { cashOperationsService } from "../api";

export const COUNTERPARTIES_QUERY_KEY = ["counterparties"] as const;

export const useGetCounterparties = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: COUNTERPARTIES_QUERY_KEY,
    queryFn: ({ signal }) => cashOperationsService.getCounterparties(signal),
    ...options,
  });
};
