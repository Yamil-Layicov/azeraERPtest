import { useQuery } from "@tanstack/react-query";
import { countriesService } from "../api/countriesService";
import { CITIES_QUERY_KEYS } from "./useGetCities";

export const useGetCityById = (id: string | null, enabled: boolean = true) => {
  return useQuery({
    queryKey: [...CITIES_QUERY_KEYS.all, "byId", id],
    queryFn: ({ signal }) => countriesService.getCityById(id!, signal),
    enabled: enabled && !!id,
    staleTime: 0,
    gcTime: 1000 * 60 * 30,
  });
};
