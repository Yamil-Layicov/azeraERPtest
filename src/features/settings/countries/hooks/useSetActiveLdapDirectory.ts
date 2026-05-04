import { useMutation, useQueryClient } from "@tanstack/react-query";
import { countriesService } from "../api/countriesService";
import { LDAP_DIRECTORIES_QUERY_KEYS } from "./useGetLdapDirectories";

export const useSetActiveLdapDirectory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      countriesService.setActiveLdapDirectory(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: LDAP_DIRECTORIES_QUERY_KEYS.all,
      });
    },
  });
};
