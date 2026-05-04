import { useQuery } from "@tanstack/react-query";
import { countriesService } from "../api/countriesService";
import { LDAP_DIRECTORIES_QUERY_KEYS } from "./useGetLdapDirectories";

export const useGetLdapDirectoryById = (id: string | null, enabled: boolean = true) => {
  return useQuery({
    queryKey: [...LDAP_DIRECTORIES_QUERY_KEYS.all, "detail", id],
    queryFn: ({ signal }) => countriesService.getLdapDirectoryById(id!, signal),
    enabled: enabled && !!id,
    staleTime: 0,
    gcTime: 0,
  });
};
