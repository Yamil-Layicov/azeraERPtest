import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { cashOperationsService } from "../api/cashOperationsService";
import type { GetCashOperationByIdResponse } from "../model/types";

export const CASH_OPERATION_BY_ID_QUERY_KEY = "cashOperationById" as const;

export const useGetCashOperationById = (
  id?: string,
  options?: Omit<
    UseQueryOptions<GetCashOperationByIdResponse, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<GetCashOperationByIdResponse, Error>({
    queryKey: [CASH_OPERATION_BY_ID_QUERY_KEY, id],
    queryFn: ({ signal }) => {
      if (!id) throw new Error("ID is required");
      return cashOperationsService.getById(id, signal);
    },
    enabled: !!id,
    ...options,
  });
};
