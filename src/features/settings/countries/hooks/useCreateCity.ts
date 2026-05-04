import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import { countriesService } from "../api/countriesService";
import type { CreateCityRequest } from "../model/cityTypes";
import { CITIES_QUERY_KEYS } from "./useGetCities";

export const useCreateCity = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, CreateCityRequest>({
    mutationFn: (payload: CreateCityRequest) => countriesService.createCity(payload),
    onSuccess: (_, variables) => {
      toast.success("Şəhər uğurla yaradıldı");
      queryClient.invalidateQueries({ queryKey: CITIES_QUERY_KEYS.byCountry(String(variables.countryId)) });
    },
  });
};
