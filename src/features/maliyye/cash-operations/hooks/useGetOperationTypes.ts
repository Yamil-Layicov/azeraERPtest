import { useQuery } from "@tanstack/react-query";
import { cashOperationsService } from "../api/cashOperationsService";
export const OPERATION_TYPES_QUERY_KEY = ["operation-types"] as const;
import type { UseQueryOptions } from "@tanstack/react-query";
import type { GetOperationTypesResponse } from "../model/types";

export const useGetOperationTypes = (
  options?: Omit<
    UseQueryOptions<GetOperationTypesResponse, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<GetOperationTypesResponse, Error>({
    queryKey: OPERATION_TYPES_QUERY_KEY,
    queryFn: ({ signal }) => cashOperationsService.getOperationTypes(signal),
    ...options,
  });
};
