import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { cashOperationsService } from "../api";
import type { GetCashBoxesAllRequest, GetCashBoxesAllResponse } from "../model/types";

export const CASH_BOXES_ALL_QUERY_KEY = ["cashBoxes", "getAll"] as const;

export const useGetCashBoxesAll = (
  params: GetCashBoxesAllRequest,
  options?: Omit<UseQueryOptions<GetCashBoxesAllResponse, Error>, "queryKey" | "queryFn">
) => {
  return useQuery<GetCashBoxesAllResponse, Error>({
    queryKey: [...CASH_BOXES_ALL_QUERY_KEY, params],
    queryFn: ({ signal }) => cashOperationsService.getCashBoxesAll(params, signal),
    ...options,
  });
};
