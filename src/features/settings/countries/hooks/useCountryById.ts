import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { countriesService } from "../api/countriesService";
import type { GetCountryByIdResponse } from "../model/types";
import { COUNTRIES_QUERY_KEYS } from "./useCountries";

export const useCountryById = (countryId: string | null, enabled: boolean = true) => {
  return useQuery<GetCountryByIdResponse, AxiosError>({
    queryKey: [...COUNTRIES_QUERY_KEYS.all, "detail", countryId] as const,
    queryFn: ({ signal }) => countriesService.getCountryById(countryId!, signal),
    enabled: enabled && !!countryId,
    staleTime: 0,
    gcTime: 1000 * 60 * 30,
  });
};
