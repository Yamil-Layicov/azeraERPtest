import { useQuery } from "@tanstack/react-query";
import { lookupsService } from "../api/lookupsService";
import { mapEnumItemsToOptions } from "../lib/mapEnumItemsToOptions";

export const useSubCompanies = (rootCompanyId: string | null, enabled: boolean = true) => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["subCompanies", rootCompanyId, enabled],
    queryFn: ({ signal }) => 
      rootCompanyId 
        ? lookupsService.getSubCompanies(rootCompanyId, signal) 
        : Promise.resolve({ result: [] }),
    enabled: !!rootCompanyId && enabled,
  });

  const options = mapEnumItemsToOptions(data?.result ?? []);

  return {
    options,
    isLoading,
    refetch,
  };
};
