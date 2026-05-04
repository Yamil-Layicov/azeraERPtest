import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { usersService } from "../../users/api";
import type { GetRolesRequest, GetUserRolesResponse } from "../../users/model";

export const ROLES_QUERY_KEYS = {
  all: ["roles"] as const,
  lists: () => [...ROLES_QUERY_KEYS.all, "list"] as const,
  list: (filters: GetRolesRequest) => [...ROLES_QUERY_KEYS.lists(), filters] as const,
};

export const useRoles = (payload: GetRolesRequest, enabled: boolean = true) => {
  return useQuery<GetUserRolesResponse, AxiosError>({
    queryKey: ROLES_QUERY_KEYS.list(payload),
    queryFn: ({ signal }) => usersService.getUserRoles(payload, signal),
    enabled: enabled,
    staleTime: 0,
    gcTime: 1000 * 60 * 30,
  });
};

