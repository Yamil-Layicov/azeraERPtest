import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { usersService } from "../api";
import type { GetUserByIdResponse } from "../model";
import { USERS_QUERY_KEYS } from "./useUsers";

export const useUserById = (userId: string | null, enabled: boolean = true) => {
  return useQuery<GetUserByIdResponse, AxiosError>({
    queryKey: USERS_QUERY_KEYS.detail(userId ?? ""),
    queryFn: ({ signal }) => usersService.getUserById(userId!, signal),
    enabled: enabled && !!userId,
    staleTime: 0,
    gcTime: 1000 * 60 * 5,
  });
};
