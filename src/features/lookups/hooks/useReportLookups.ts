import { useQuery } from "@tanstack/react-query";
import { lookupsService } from "../api/lookupsService";
import { mapEnumItemsToOptions } from "../lib/mapEnumItemsToOptions";

export const useReportLookups = (enabled: boolean = true) => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["reportLookups", enabled],
    queryFn: ({ signal }) => lookupsService.getLookups(signal),
    staleTime: 1000 * 60 * 60, // 1 hour
    enabled: enabled,
  });

  const reportTypeOptions = mapEnumItemsToOptions(data?.result?.reportTypes ?? []);
  const employeeStatusOptions = mapEnumItemsToOptions(data?.result?.employeeStatus ?? []);

  return {
    reportTypeOptions,
    employeeStatusOptions,
    isLoading,
    refetch,
  };
};
