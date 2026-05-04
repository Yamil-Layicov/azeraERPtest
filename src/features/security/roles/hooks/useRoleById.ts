import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { usersService } from "../../users/api";
import type { GetRoleByIdResponse } from "../../users/model";
import { ROLES_QUERY_KEYS } from "./useRoles";

export const useRoleById = (roleId: string | null, enabled: boolean = true) => {
  return useQuery<GetRoleByIdResponse, AxiosError>({
    queryKey: [...ROLES_QUERY_KEYS.all, "detail", roleId] as const,
    queryFn: ({ signal }) => usersService.getRoleById(roleId!, signal),
    enabled: enabled && !!roleId,
    staleTime: 0,
    gcTime: 1000 * 60 * 30,
  });
};

