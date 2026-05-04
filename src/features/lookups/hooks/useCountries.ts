import { useQuery } from "@tanstack/react-query";
import { lookupsService } from "../api";
import { mapEnumItemsToOptions } from "../lib/mapEnumItemsToOptions";
import type { Option } from "@/shared/types";

export const COUNTRIES_QUERY_KEY = ["lookups", "countries"] as const;

export const useCountries = (enabled: boolean) => {
  const query = useQuery({
    queryKey: COUNTRIES_QUERY_KEY,
    queryFn: ({ signal }) => lookupsService.getCountries(signal),
    enabled,
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
