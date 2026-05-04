import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cashOperationsService } from "../api/cashOperationsService";
import type { CreateCounterpartyRequest, CreateCounterpartyResponse } from "../model/types";
import { COUNTERPARTIES_QUERY_KEY } from "./useGetCounterparties";

export const useCreateCounterparty = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateCounterpartyResponse, Error, CreateCounterpartyRequest>({
    mutationFn: (data: CreateCounterpartyRequest) =>
      cashOperationsService.createCounterparty(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COUNTERPARTIES_QUERY_KEY });
    },
  });
};
