import { useMutation, useQueryClient } from "@tanstack/react-query";
import { countriesService } from "../api/countriesService";
import { LDAP_DIRECTORIES_QUERY_KEYS } from "./useGetLdapDirectories";

export const useUpdateLdapDirectory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: any) => countriesService.updateLdapDirectory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LDAP_DIRECTORIES_QUERY_KEYS.all });
    },
  });
};
