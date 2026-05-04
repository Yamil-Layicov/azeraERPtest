import { useQuery } from "@tanstack/react-query";
import { lookupsService } from "../api/lookupsService";

export const useWorkloadRates = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["lookups", "workloadRates"],
    queryFn: ({ signal }) =>
      lookupsService.getEnumItemsByTypeCode("WorkloadRate", signal),
    enabled,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 2,
  });
};