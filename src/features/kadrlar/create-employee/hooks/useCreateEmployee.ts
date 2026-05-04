import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { createEmployeeService } from "../api";
import type { CreateEmployeeRequest, CreateEmployeeResponse } from "../model";
import { EMPLOYEES_QUERY_KEYS } from "../../employees";

export const CREATE_EMPLOYEE_QUERY_KEYS = {
  all: ["create-employee"] as const,
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateEmployeeResponse, AxiosError, CreateEmployeeRequest>({
    mutationFn: (payload: CreateEmployeeRequest) => createEmployeeService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMPLOYEES_QUERY_KEYS.all });
    },
  });
};
