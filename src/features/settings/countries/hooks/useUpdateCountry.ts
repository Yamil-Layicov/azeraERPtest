import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import { countriesService } from "../api/countriesService";
import type { UpdateCountryRequest } from "../model/types";
import { COUNTRIES_QUERY_KEYS } from "./useCountries";

export const useUpdateCountry = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, UpdateCountryRequest>({
    mutationFn: (payload: UpdateCountryRequest) => countriesService.update(payload),
    onSuccess: () => {
      toast.success("Ölkə uğurla yeniləndi");
      queryClient.invalidateQueries({ queryKey: COUNTRIES_QUERY_KEYS.lists() });
    },
  });
};
