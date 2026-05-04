import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { countriesService } from "../api/countriesService";
import type { GetCountriesResponse } from "../model/types";

export const COUNTRIES_QUERY_KEYS = {
  all: ["countries"] as const,
  lists: () => [...COUNTRIES_QUERY_KEYS.all, "list"] as const,
};

export const useCountries = (enabled: boolean = true) => {
  return useQuery<GetCountriesResponse, AxiosError>({
    queryKey: COUNTRIES_QUERY_KEYS.lists(),
    queryFn: ({ signal }) => countriesService.getCountries(signal),
    enabled,
    staleTime: 0,
    gcTime: 1000 * 60 * 30,
  });
};
