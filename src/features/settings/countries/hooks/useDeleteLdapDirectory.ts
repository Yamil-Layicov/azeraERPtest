import { useMutation, useQueryClient } from "@tanstack/react-query";
import { countriesService } from "../api/countriesService";
import { LDAP_DIRECTORIES_QUERY_KEYS } from "./useGetLdapDirectories";

export const useDeleteLdapDirectory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => countriesService.deleteLdapDirectory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LDAP_DIRECTORIES_QUERY_KEYS.all });
    },
  });
};
