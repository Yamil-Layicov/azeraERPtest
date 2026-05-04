import { useQuery } from "@tanstack/react-query";
import { lookupsService } from "../api";

export const useLookups = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["lookups", "all"],
    queryFn: ({ signal }) => lookupsService.getLookups(signal),
    enabled,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 2,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};
