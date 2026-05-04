import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { usersService } from "../api";
import type { GetUserRolesByNodeIdResponse } from "../model";

export const useUserRolesByNodeId = (nodeId: string | null, enabled: boolean = true) => {
  return useQuery<GetUserRolesByNodeIdResponse, AxiosError>({
    queryKey: ["userRolesByNode", nodeId],
    queryFn: ({ signal }) => usersService.getUserRolesByNodeId(nodeId!, signal),
    enabled: enabled && !!nodeId,
    staleTime: 0,
    gcTime: 1000 * 60 * 5,
  });
};
