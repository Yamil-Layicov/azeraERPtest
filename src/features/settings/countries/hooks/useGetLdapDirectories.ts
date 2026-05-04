import { useQuery } from "@tanstack/react-query";
import { countriesService } from "../api/countriesService";

export const LDAP_DIRECTORIES_QUERY_KEYS = {
  all: ["ldap-directories"] as const,
};

export const useGetLdapDirectories = () => {
  return useQuery({
    queryKey: LDAP_DIRECTORIES_QUERY_KEYS.all,
    queryFn: ({ signal }) => countriesService.getLdapDirectories(signal),
    staleTime: 1000 * 60 * 5, // 5 dəq
  });
};
