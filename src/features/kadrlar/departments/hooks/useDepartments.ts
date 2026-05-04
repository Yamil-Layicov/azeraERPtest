import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import type { AxiosError } from "axios";
import { departmentsService } from "../api";
import type { 
  GetDepartmentsRequest, 
  GetDepartmentsResponse,
  CreateDepartmentRequest,
  CreateDepartmentResponse,
  CreateStaffingRequest,
  CreateStaffingResponse,
  UpdateStaffingRequest,
  UpdateDepartmentRequest,
  UpdateDepartmentResponse,
  DeleteDepartmentResponse,
  DepartmentEntry,
  StaffingEntry 
} from "../model";
import type { Option } from "@/shared/types";

export const DEPARTMENTS_QUERY_KEYS = {
  all: ["departments"] as const,
  list: (params: GetDepartmentsRequest) => [...DEPARTMENTS_QUERY_KEYS.all, "list", params] as const,
  detail: (id: string) => [...DEPARTMENTS_QUERY_KEYS.all, "detail", id] as const,
  staffing: (orgId: string) => [...DEPARTMENTS_QUERY_KEYS.all, "staffing", orgId] as const,
  staffingDetail: (id: string) => [...DEPARTMENTS_QUERY_KEYS.all, "staffingDetail", id] as const,
  positionsLookup: (pageIndex: number, value?: string) =>
    [...DEPARTMENTS_QUERY_KEYS.all, "lookup", "positions", pageIndex, value ?? ""] as const,
};

export const useDepartments = (params: GetDepartmentsRequest) => {
  return useQuery<GetDepartmentsResponse, AxiosError>({
    queryKey: DEPARTMENTS_QUERY_KEYS.list(params),
    queryFn: ({ signal }) => departmentsService.getDepartments(params, signal),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
};

export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation<UpdateDepartmentResponse, AxiosError, UpdateDepartmentRequest>({
    mutationFn: (payload: UpdateDepartmentRequest) =>
      departmentsService.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...DEPARTMENTS_QUERY_KEYS.all, "list"] });
      queryClient.fetchQuery({ 
        queryKey: [...DEPARTMENTS_QUERY_KEYS.all, "lookup", "companies"],
        queryFn: () => departmentsService.getCompaniesLookup(),
      });
    },
  });
};

export const useCreateDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation<CreateDepartmentResponse, AxiosError, CreateDepartmentRequest>({
    mutationFn: (payload: CreateDepartmentRequest) => departmentsService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...DEPARTMENTS_QUERY_KEYS.all, "list"] });
      queryClient.fetchQuery({
        queryKey: [...DEPARTMENTS_QUERY_KEYS.all, "lookup", "companies"],
        queryFn: () => departmentsService.getCompaniesLookup(),
      });
    },
  });
};

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation<DeleteDepartmentResponse, AxiosError, string>({
    mutationFn: (id: string) => departmentsService.delete(id),
    onSuccess: (response, id) => {
      queryClient.invalidateQueries({ queryKey: [...DEPARTMENTS_QUERY_KEYS.all, "list"] });
      queryClient.removeQueries({ queryKey: DEPARTMENTS_QUERY_KEYS.detail(id) });
      queryClient.fetchQuery({
        queryKey: [...DEPARTMENTS_QUERY_KEYS.all, "lookup", "companies"],
        queryFn: () => departmentsService.getCompaniesLookup(),
      });
      if (response.isSuccess) {
        toast.success("Uğurlu əməliyyat");
      }
    },
    onError: () => {},
  });
};


export const useGetDepartmentById = (id: string | null, enabled: boolean = true) => {
  return useQuery<DepartmentEntry, AxiosError>({
    queryKey: DEPARTMENTS_QUERY_KEYS.detail(id!),
    queryFn: ({ signal }) => departmentsService.getById(id!, signal),
    enabled: enabled && !!id,
    staleTime: 0,
    gcTime: 0,
  });
};

export const useStaffingByOrganizationUnitId = (orgId: string | null, enabled: boolean = true) => {
  return useQuery<unknown, AxiosError>({
    queryKey: DEPARTMENTS_QUERY_KEYS.staffing(orgId!),
    queryFn: ({ signal }) => departmentsService.getStaffingByOrganizationUnitId(orgId!, signal),
    enabled: enabled && !!orgId,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 10,
  });
};

export const useCreateStaffing = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateStaffingResponse, AxiosError, CreateStaffingRequest>({
    mutationFn: (payload) => departmentsService.createStaffing(payload),
    onSuccess: (response, variables) => {
      if (response.isSuccess) {
        queryClient.invalidateQueries({
          queryKey: DEPARTMENTS_QUERY_KEYS.staffing(variables.organizationUnitId),
        });
        queryClient.invalidateQueries({ queryKey: DEPARTMENTS_QUERY_KEYS.all });
      }
    },
  });
};

export const useGetStaffingById = (id: string | null, enabled: boolean = true) => {
  return useQuery<StaffingEntry, AxiosError>({
    queryKey: DEPARTMENTS_QUERY_KEYS.staffingDetail(id!),
    queryFn: ({ signal }) => departmentsService.getStaffingById(id!, signal),
    enabled: enabled && !!id,
    staleTime: 0, 
    gcTime: 1000 * 60 * 5,
  });
};

export const useSetStaffingActive = () => {
  const queryClient = useQueryClient();

  return useMutation<
    CreateStaffingResponse,
    AxiosError,
    { id: string; organizationUnitId: string; isActive: boolean }
  >({
    mutationFn: ({ id, isActive }) => departmentsService.setStaffingActive(id, isActive),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: DEPARTMENTS_QUERY_KEYS.staffingDetail(variables.id) });
      queryClient.invalidateQueries({ queryKey: DEPARTMENTS_QUERY_KEYS.staffing(variables.organizationUnitId) });
    },
  });
};

export const useDeleteStaffing = () => {
  const queryClient = useQueryClient();

  return useMutation<
    CreateStaffingResponse,
    AxiosError,
    { id: string; organizationUnitId: string }
  >({
    mutationFn: ({ id }) => departmentsService.deleteStaffing(id),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: DEPARTMENTS_QUERY_KEYS.staffing(variables.organizationUnitId) });
    },
  });
};

export const useUpdateStaffing = () => {
  const queryClient = useQueryClient();

  return useMutation<
    CreateStaffingResponse,
    AxiosError,
    UpdateStaffingRequest
  >({
    mutationFn: (payload) => departmentsService.updateStaffing(payload),
    onSuccess: (_response, variables) => {
      queryClient.removeQueries({ queryKey: DEPARTMENTS_QUERY_KEYS.staffingDetail(variables.id) });
      queryClient.invalidateQueries({ queryKey: DEPARTMENTS_QUERY_KEYS.staffing(variables.organizationUnitId) });
    },
  });
};

export const useCompaniesLookup = (enabled: boolean = true) => {
  return useQuery<Option[], AxiosError>({
    queryKey: [...DEPARTMENTS_QUERY_KEYS.all, "lookup", "companies"],
    queryFn: () => departmentsService.getCompaniesLookup(),
    enabled,
    staleTime: 1000 * 60 * 30, 
    gcTime: 1000 * 60 * 60, 
  });
};


export const useRootCompaniesLookup = (enabled: boolean = true) => {
  return useQuery<Option[], AxiosError>({
    queryKey: [...DEPARTMENTS_QUERY_KEYS.all, "lookup", "rootCompanies"],
    queryFn: ({ signal }) => departmentsService.getRootCompaniesLookup(signal),
    enabled,
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
  });
};

export const useOrganizationUnitTypeLookup = (enabled: boolean = true) => {
  return useQuery<Option[], AxiosError>({
    queryKey: [...DEPARTMENTS_QUERY_KEYS.all, "lookup", "organizationUnitType"],
    queryFn: ({ signal }) => departmentsService.getOrganizationUnitTypeLookup(signal),
    enabled,
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
  });
};

export const useDocumentTypesLookup = () => {
  return useQuery<Option[], AxiosError>({
    queryKey: [...DEPARTMENTS_QUERY_KEYS.all, "lookup", "documentTypes"],
    queryFn: ({ signal }) => departmentsService.getDocumentTypesLookup(signal),
    staleTime: 1000 * 60 * 30, 
    gcTime: 1000 * 60 * 60, 
  });
};


export const useSubCompaniesLookup = (rootId: string | null) => {
  return useQuery<Option[], AxiosError>({
    queryKey: [...DEPARTMENTS_QUERY_KEYS.all, "lookup", "subCompanies", rootId],
    queryFn: ({ signal }) => departmentsService.getSubCompaniesLookup(rootId!, signal),
    enabled: !!rootId,
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
  });
};

export const useEmployeesLookup = (rootCompanyId: string | null, pageIndex: number = 0, value?: string) => {
  return useQuery<Option[], AxiosError>({
    queryKey: [...DEPARTMENTS_QUERY_KEYS.all, "lookup", "employees", rootCompanyId, pageIndex, value],
    queryFn: ({ signal }) => departmentsService.getEmployeesLookup(rootCompanyId!, pageIndex, value, signal),
    enabled: !!rootCompanyId,
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
  });
};

export const useNodesLookup = (rootCompanyId: string | null, pageIndex: number = 0, value?: string) => {
  return useQuery<Option[], AxiosError>({
    queryKey: [...DEPARTMENTS_QUERY_KEYS.all, "lookup", "nodes", rootCompanyId, pageIndex, value],
    queryFn: ({ signal }) => departmentsService.getNodesLookup(rootCompanyId!, pageIndex, value, signal),
    enabled: !!rootCompanyId,
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
  });
};

export const usePositionsLookup = () => {
  return useQuery<Option[], AxiosError>({
    queryKey: [...DEPARTMENTS_QUERY_KEYS.all, "lookup", "positions"],
    queryFn: ({ signal }) => departmentsService.getPositionsLookup(0, undefined, signal).then((res) => res.options),
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
  });
};

export const usePositionsLookupPaged = (
  pageIndex: number = 0,
  value?: string,
  enabled: boolean = true
) => {
  return useQuery<
    { options: Option[]; totalCount: number; pageIndex: number; pageSize: number },
    AxiosError
  >({
    queryKey: DEPARTMENTS_QUERY_KEYS.positionsLookup(pageIndex, value),
    queryFn: ({ signal }) => departmentsService.getPositionsLookup(pageIndex, value, signal),
    enabled,
    staleTime: 0,
    gcTime: 1000 * 60 * 10,
  });
};
