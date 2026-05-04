import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cashOperationsService } from "../api";
import type { UpdateCashBoxRequest } from "../model/types";
import { CASH_BOXES_ALL_QUERY_KEY } from "./useGetCashBoxesAll";

export const useUpdateCashBox = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateCashBoxRequest) =>
      cashOperationsService.updateCashBox(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CASH_BOXES_ALL_QUERY_KEY });
    },
  });
};
