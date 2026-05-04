import { useQuery } from "@tanstack/react-query";
import { cashOperationsService } from "../api/cashOperationsService";
import type { GetCashOperationsRequest } from "../model/types";

export const useGetCashOperations = (params: GetCashOperationsRequest) => {
  return useQuery({
    queryKey: ["cashOperations", "getAll", params],
    queryFn: ({ signal }) => cashOperationsService.getAll(params, signal),
  });
};
