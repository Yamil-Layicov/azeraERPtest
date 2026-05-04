import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import { countriesService } from "../api/countriesService";
import { COUNTRIES_QUERY_KEYS } from "./useCountries";

export const useDeleteCountry = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, string>({
    mutationFn: (id: string) => countriesService.delete(id),
    onSuccess: () => {
      toast.success("Ölkə uğurla silindi");
      queryClient.invalidateQueries({ queryKey: COUNTRIES_QUERY_KEYS.all });
    },
  });
};
