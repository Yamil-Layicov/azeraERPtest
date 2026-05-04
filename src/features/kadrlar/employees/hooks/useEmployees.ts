import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { employeesService } from "../api";
import type { 
  GetEmployeesRequest, 
  GetEmployeesResponse,
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
  EmployeeEntry
} from "../model";

export const EMPLOYEES_QUERY_KEYS = {
  all: ["employees"] as const,
  list: (params: GetEmployeesRequest) => [...EMPLOYEES_QUERY_KEYS.all, "list", params] as const,
  detail: (id: string) => [...EMPLOYEES_QUERY_KEYS.all, "detail", id] as const,
};

export const useEmployees = (params: GetEmployeesRequest, enabled: boolean = true) => {
  return useQuery<GetEmployeesResponse, AxiosError>({
    queryKey: EMPLOYEES_QUERY_KEYS.list(params),
    queryFn: ({ signal }) => employeesService.getEmployees(params, signal),
    enabled,
    staleTime: 0, 
    gcTime: 1000 * 60 * 30,
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateEmployeeRequest) => employeesService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMPLOYEES_QUERY_KEYS.all });
    },
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<UpdateEmployeeRequest> }) =>
      employeesService.update({ id, ...payload } as UpdateEmployeeRequest),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMPLOYEES_QUERY_KEYS.all });
    },
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => employeesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMPLOYEES_QUERY_KEYS.all });
    },
  });
};

export const useGetEmployeeById = (id: string | null, enabled: boolean = true) => {
  return useQuery<EmployeeEntry, AxiosError>({
    queryKey: EMPLOYEES_QUERY_KEYS.detail(id!),
    queryFn: ({ signal }) => employeesService.getById(id!, signal),
    enabled: enabled && !!id,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
};
