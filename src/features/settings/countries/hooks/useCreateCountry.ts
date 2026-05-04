import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import { countriesService } from "../api/countriesService";
import type { CreateCountryRequest } from "../model/types";
import { COUNTRIES_QUERY_KEYS } from "./useCountries";

export const useCreateCountry = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, CreateCountryRequest>({
    mutationFn: (payload: CreateCountryRequest) => countriesService.create(payload),
    onSuccess: () => {
      toast.success("Ölkə uğurla yaradıldı");
      queryClient.invalidateQueries({ queryKey: COUNTRIES_QUERY_KEYS.all });
    },
  });
};
