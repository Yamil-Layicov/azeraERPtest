import { useQuery } from "@tanstack/react-query";
import { lookupsService } from "../api";
import { mapEnumItemsToOptions } from "../lib/mapEnumItemsToOptions";
import type { Option } from "@/shared/types";

export const citiesByCountryQueryKey = (countryId: string) =>
  ["lookups", "citiesByCountry", countryId] as const;

export const useCitiesByCountryCode = (countryId: string | null, enabled: boolean) => {
  const query = useQuery({
    queryKey: citiesByCountryQueryKey(countryId ?? ""),
    queryFn: ({ signal }) => lookupsService.getCitiesByCountryCode(countryId!, signal),
    enabled: enabled && !!countryId,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
  });

  const options: Option[] = (() => {
    const raw = query.data?.result ?? query.data?.data;
    return mapEnumItemsToOptions(raw);
  })();

  return {
    ...query,
    options,
  };
};
