import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cashOperationsService } from "../api";
import type {
  CreateCashBoxRequest,
  CreateCashBoxResponse,
} from "../model/types";
import { CASH_BOXES_ALL_QUERY_KEY } from "./useGetCashBoxesAll";

export const useCreateCashBox = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateCashBoxResponse, Error, CreateCashBoxRequest>({
    mutationFn: (payload) => cashOperationsService.createCashBox(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cash-boxes"] });
      queryClient.invalidateQueries({ queryKey: CASH_BOXES_ALL_QUERY_KEY });
    },
  });
};
