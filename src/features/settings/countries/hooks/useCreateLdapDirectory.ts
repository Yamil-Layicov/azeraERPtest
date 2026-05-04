import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { countriesService } from "../api/countriesService";

export const useCreateLdapDirectory = () => {
  return useMutation<void, AxiosError, any>({
    mutationFn: (payload: any) => countriesService.createLdapDirectory(payload),
  });
};
