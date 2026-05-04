import { useMutation, useQueryClient } from "@tanstack/react-query";
import { countriesService } from "../api/countriesService";
import { LDAP_DIRECTORIES_QUERY_KEYS } from "./useGetLdapDirectories";

export const useAddOrRemoveLdapDirectoryCompanies = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { directoryId: string; companyIds: string[] }) =>
      countriesService.addOrRemoveLdapDirectoryCompany(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LDAP_DIRECTORIES_QUERY_KEYS.all });
    },
  });
};
