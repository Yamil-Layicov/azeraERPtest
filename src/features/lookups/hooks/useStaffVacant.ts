import { useQuery } from "@tanstack/react-query";
import { lookupsService } from "../api/lookupsService";
import { mapEnumItemsToOptions } from "../lib/mapEnumItemsToOptions";

export const useStaffVacant = (subCompanyId: string | null) => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["staffVacant", subCompanyId],
    queryFn: ({ signal }) => 
      subCompanyId 
        ? lookupsService.getStaffVacant(subCompanyId, signal) 
        : Promise.resolve({ result: [] }),
    enabled: !!subCompanyId,
  });

  const options = mapEnumItemsToOptions(data?.result ?? []);

  return {
    options,
    isLoading,
    refetch,
  };
};
