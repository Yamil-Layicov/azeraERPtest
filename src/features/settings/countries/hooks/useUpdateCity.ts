import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import { countriesService } from "../api/countriesService";
import type { UpdateCityRequest } from "../model/cityTypes";
import { CITIES_QUERY_KEYS } from "./useGetCities";

export const useUpdateCity = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, UpdateCityRequest>({
    mutationFn: (payload: UpdateCityRequest) => countriesService.updateCity(payload),
    onSuccess: () => {
      toast.success("Şəhər uğurla yeniləndi");
      queryClient.invalidateQueries({ queryKey: CITIES_QUERY_KEYS.all });
    },
  });
};
