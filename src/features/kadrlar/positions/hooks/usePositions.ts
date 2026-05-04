import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { positionsService } from "../api";
import type { GetPositionsRequest, GetPositionsResponse } from "../model";

export const POSITIONS_QUERY_KEYS = {
  all: ["positions"] as const,
  list: (params: GetPositionsRequest) => [...POSITIONS_QUERY_KEYS.all, "list", params] as const,
  detail: (id: string) => [...POSITIONS_QUERY_KEYS.all, "detail", id] as const,
};

export const usePositions = (params: GetPositionsRequest) => {
  return useQuery<GetPositionsResponse, AxiosError>({
    queryKey: POSITIONS_QUERY_KEYS.list(params),
    queryFn: ({ signal }) => positionsService.getPositions(params, signal),
    staleTime: 0, 
    gcTime: 1000 * 60 * 30,
  });
};
