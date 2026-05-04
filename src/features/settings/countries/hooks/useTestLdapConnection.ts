import { useMutation } from "@tanstack/react-query";
import { countriesService } from "../api/countriesService";

export const useTestLdapConnection = () => {
  return useMutation({
    mutationFn: (id: string) => countriesService.testLdapConnection(id),
  });
};
