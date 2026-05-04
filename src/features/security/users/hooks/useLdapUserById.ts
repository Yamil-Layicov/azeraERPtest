import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { usersService } from "../api";
import type { GetLdapUserByIdResponse } from "../model";

export const useLdapUserById = (ldapUserId: string | null, enabled: boolean = true) => {
  return useQuery<GetLdapUserByIdResponse, AxiosError>({
    queryKey: ["ldapUser", ldapUserId],
    queryFn: ({ signal }) => usersService.getLdapUserById(ldapUserId!, signal),
    enabled: enabled && !!ldapUserId,
    staleTime: 0,
    gcTime: 1000 * 60 * 5,
  });
};
