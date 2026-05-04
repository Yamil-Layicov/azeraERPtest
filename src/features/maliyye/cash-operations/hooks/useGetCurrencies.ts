import { useQuery } from "@tanstack/react-query";
import { cashOperationsService } from "../api";

export const CURRENCIES_QUERY_KEY = ["currencies"] as const;

export const useGetCurrencies = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: CURRENCIES_QUERY_KEY,
    queryFn: ({ signal }) => cashOperationsService.getCurrencies(signal),
    ...options,
  });
};
