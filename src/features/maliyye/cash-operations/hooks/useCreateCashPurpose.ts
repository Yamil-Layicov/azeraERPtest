import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cashOperationsService } from "../api/cashOperationsService";
import type { CreateCashPurposeRequest, CreateCashPurposeResponse } from "../model/types";
import { CASH_PURPOSES_QUERY_KEY } from "./useGetCashPurposes";

export const useCreateCashPurpose = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateCashPurposeResponse, Error, CreateCashPurposeRequest>({
    mutationFn: (data: CreateCashPurposeRequest) =>
      cashOperationsService.createCashPurpose(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CASH_PURPOSES_QUERY_KEY });
    },
  });
};
