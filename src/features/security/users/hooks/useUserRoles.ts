import { useInfiniteQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { usersService } from "../api";
import type { GetRolesRequest, GetUserRolesResponse } from "../model";

const ROLES_QUERY_KEYS = {
  all: ["userRoles"] as const,
  list: (search: string) => [...ROLES_QUERY_KEYS.all, "list", search] as const,
};

const PAGE_SIZE = 20;

export const useUserRoles = (enabled: boolean, searchTerm: string) => {
  return useInfiniteQuery<GetUserRolesResponse, AxiosError>({
    queryKey: ROLES_QUERY_KEYS.list(searchTerm),
    queryFn: ({ signal, pageParam }) => {
      const payload: GetRolesRequest = {
        pageSize: PAGE_SIZE,
        pageIndex: pageParam as number,
        name: searchTerm.trim() || null,
      };
      return usersService.getUserRoles(payload, signal);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const result = lastPage?.result;
      if (!result) return undefined;
      const { pageIndex, pageSize, totalCount } = result;
      const loaded = (pageIndex + 1) * pageSize;
      return loaded < totalCount ? pageIndex + 1 : undefined;
    },
    enabled,
    staleTime: 0,
    gcTime: 1000 * 60 * 5,
  });
};
