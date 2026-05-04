import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { usersService } from "../api";
import type { GetLdapGroupsResponse } from "../model";

export const useLdapGroups = (enabled: boolean = true) => {
  return useQuery<GetLdapGroupsResponse, AxiosError>({
    queryKey: ["ldapGroups"],
    queryFn: ({ signal }) => usersService.getLdapGroups(signal),
    enabled,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};
