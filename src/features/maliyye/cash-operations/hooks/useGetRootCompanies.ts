import { useQuery } from "@tanstack/react-query";
import { cashOperationsService } from "../api";

export const ROOT_COMPANIES_QUERY_KEY = ["root-companies"] as const;

export const useGetRootCompanies = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ROOT_COMPANIES_QUERY_KEY,
    queryFn: ({ signal }) => cashOperationsService.getRootCompanies(signal),
    ...options,
  });
};
