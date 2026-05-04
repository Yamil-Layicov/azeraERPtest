import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { usersService } from "../api";
import type { GetUsersRequest, GetUsersResponse } from "../model";

export const USERS_QUERY_KEYS = {
  all: ["users"] as const,
  lists: () => [...USERS_QUERY_KEYS.all, "list"] as const,
  list: (filters: GetUsersRequest) => [...USERS_QUERY_KEYS.lists(), filters] as const,
  detail: (userId: string) => [...USERS_QUERY_KEYS.all, "detail", userId] as const,
};

export const useUsers = (params: {
  username?: string | null;
  isActive?: boolean | null;
  pageSize: number;
  pageIndex: number;
  isDesc?: boolean;
  orderBy?: string | null;
}) => {
  const payload: GetUsersRequest = {
    pageSize: params.pageSize,
    pageIndex: params.pageIndex,
    username: params.username ?? null,
    isActive: params.isActive ?? null,
    isDesc: params.isDesc,
    orderBy: params.orderBy ?? null,
  };

  return useQuery<GetUsersResponse, AxiosError>({
    queryKey: USERS_QUERY_KEYS.list(payload),
    queryFn: ({ signal }) => usersService.getUsers(payload, signal),
    staleTime: 0,
    gcTime: 1000 * 60 * 5,
  });
};
