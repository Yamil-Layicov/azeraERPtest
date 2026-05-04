import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { countriesService } from "../api/countriesService";

export const CITIES_QUERY_KEYS = {
  all: ["cities"] as const,
  byCountry: (countryId: string) => [...CITIES_QUERY_KEYS.all, countryId] as const,
};

export const useGetCities = (countryId: string | null, enabled: boolean = true) => {
  return useQuery<any, AxiosError>({
    queryKey: CITIES_QUERY_KEYS.byCountry(countryId || ""),
    queryFn: ({ signal }) => countriesService.getCities(countryId!, signal),
    enabled: enabled && !!countryId,
    staleTime: 0,
    gcTime: 1000 * 60 * 30,
  });
};
