import { httpClient } from "@/shared/api";
import type { AxiosResponse } from "axios";
import type { 
  GetDepartmentsRequest, 
  GetDepartmentsResponse,
  GetDepartmentByIdResponse,
  CreateDepartmentResponse,
  UpdateDepartmentResponse,
  DeleteDepartmentResponse,
  CreateStaffingRequest,
  CreateStaffingResponse,
  UpdateStaffingRequest,
  GetStaffingByIdResponse,
  StaffingEntry,
  LookupPagedResponse,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
  DepartmentEntry, 
  LookupListResponse
} from "../model";
import type { Option } from "@/shared/types";

const getProxyUrl = () => {
  const proxyUrl = import.meta.env.VITE_PROXY_URL || import.meta.env.PROXY_URL || "/api/proxy";
  return proxyUrl.startsWith("/api") ? proxyUrl.replace("/api", "") : proxyUrl;
};

const PROXY_URL = getProxyUrl();

const DEPARTMENTS_ENDPOINTS = {
  GET: `${PROXY_URL}/company/get`,
  GET_BY_ID: (id: string) => `${PROXY_URL}/company/getById/${id}`,
  CREATE: `${PROXY_URL}/company/create`,
  UPDATE: `${PROXY_URL}/company/update`,
  DELETE: (companyId: string) => `${PROXY_URL}/company/delete/${companyId}`,
  LOOKUPS_COMPANIES: `${PROXY_URL}/identity/lookups/companies`,
  LOOKUPS_ROOT_COMPANIES: `${PROXY_URL}/identity/lookups/rootCompanies`,
  LOOKUPS_SUB_COMPANIES: (rootId: string) => `${PROXY_URL}/identity/lookups/subCompanies/${rootId}`,
  LOOKUPS_EMPLOYEES: (rootCompanyId: string, pageIndex?: number, value?: string) => {
    const params = new URLSearchParams();
    if (pageIndex !== undefined) params.append('pageIndex', String(pageIndex));
    if (value) params.append('value', value);
    const queryString = params.toString();
    return `${PROXY_URL}/identity/lookups/employees/${rootCompanyId}${queryString ? `?${queryString}` : ''}`;
  },
  LOOKUPS_NODES: (rootCompanyId: string, pageIndex?: number, value?: string) => {
    const params = new URLSearchParams();
    if (pageIndex !== undefined) params.append('pageIndex', String(pageIndex));
    if (value) params.append('value', value);
    const queryString = params.toString();
    return `${PROXY_URL}/identity/lookups/nodes/${rootCompanyId}${queryString ? `?${queryString}` : ''}`;
  },
  LOOKUPS_ORGANIZATION_UNIT_TYPE: `${PROXY_URL}/identity/lookups/organizationUnitType`,
  LOOKUPS_DOCUMENT_TYPES: `${PROXY_URL}/identity/lookups/documentTypes`,
  LOOKUPS_POSITIONS: (pageIndex?: number, value?: string) => {
    const params = new URLSearchParams();
    if (pageIndex !== undefined) params.append("pageIndex", String(pageIndex));
    if (value) params.append("value", value);
    const queryString = params.toString();
    return `${PROXY_URL}/identity/lookups/positions${queryString ? `?${queryString}` : ""}`;
  },
  STAFFING_BY_ORG_UNIT: (orgId: string) => `${PROXY_URL}/staffing/getByOrganizationUnitId/${orgId}`,
  STAFFING_CREATE: `${PROXY_URL}/staffing/create`,
  STAFFING_UPDATE: `${PROXY_URL}/staffing/update`,
  STAFFING_GET_BY_ID: (id: string) => `${PROXY_URL}/staffing/getById/${id}`,
  STAFFING_SET_ACTIVE: (id: string, isActive: boolean) =>
    `${PROXY_URL}/staffing/setActive/${id}?isActive=${isActive}`,
  STAFFING_DELETE: (id: string) => `${PROXY_URL}/staffing/delete/${id}`,
  LOOKUPS_STAFF_CATEGORIES: `${PROXY_URL}/identity/lookups/staffCategories`,
} as const;

export const departmentsService = {
  getDepartments: async (
    _params: GetDepartmentsRequest,
    signal?: AbortSignal
  ): Promise<GetDepartmentsResponse> => {
    const response: AxiosResponse<GetDepartmentsResponse> = await httpClient.get(
      DEPARTMENTS_ENDPOINTS.GET,
      { signal }
    );
    return response.data;
  },

  getById: async (id: string, signal?: AbortSignal): Promise<DepartmentEntry> => {
    const response: AxiosResponse<GetDepartmentByIdResponse> = await httpClient.get(
      DEPARTMENTS_ENDPOINTS.GET_BY_ID(id),
      { signal }
    );
    return response.data.result;
  },

  create: async (
    payload: CreateDepartmentRequest,
    signal?: AbortSignal
  ): Promise<CreateDepartmentResponse> => {
    const response: AxiosResponse<CreateDepartmentResponse> = await httpClient.post(
      DEPARTMENTS_ENDPOINTS.CREATE,
      payload,
      { signal }
    );
    return response.data;
  },

  update: async (
    payload: UpdateDepartmentRequest,
    signal?: AbortSignal
  ): Promise<UpdateDepartmentResponse> => {
    const response: AxiosResponse<UpdateDepartmentResponse> = await httpClient.post(
      DEPARTMENTS_ENDPOINTS.UPDATE,
      payload,
      { signal }  
    );
    return response.data;
  },

  delete: async (id: string, signal?: AbortSignal): Promise<DeleteDepartmentResponse> => {
    const response: AxiosResponse<DeleteDepartmentResponse> = await httpClient.get(
      DEPARTMENTS_ENDPOINTS.DELETE(id),
      { signal }
    );
    return response.data;
  },

  getCompaniesLookup: async (signal?: AbortSignal): Promise<Option[]> => {
    const response: AxiosResponse<LookupListResponse> = await httpClient.get(
      DEPARTMENTS_ENDPOINTS.LOOKUPS_COMPANIES,
      { signal }
    );
    return response.data.result.map((item) => ({
      id: item.value,
      fullName: item.label,
      role: "",
      disabled: item.disabled, 
    }));
  },

  getRootCompaniesLookup: async (signal?: AbortSignal): Promise<Option[]> => {
    const response: AxiosResponse<LookupListResponse> = await httpClient.get(
      DEPARTMENTS_ENDPOINTS.LOOKUPS_ROOT_COMPANIES,
      { signal }
    );
    return response.data.result.map((item) => ({
      id: item.value,
      fullName: item.label,
      role: "",
      disabled: item.disabled, 
    }));
  },

  getOrganizationUnitTypeLookup: async (signal?: AbortSignal): Promise<Option[]> => {
    const response: AxiosResponse<LookupListResponse> = await httpClient.get(
      DEPARTMENTS_ENDPOINTS.LOOKUPS_ORGANIZATION_UNIT_TYPE,
      { signal }
    );
    return response.data.result.map((item) => ({
      id: item.value,
      fullName: item.label,
      role: "",
    }));
  },

  getDocumentTypesLookup: async (signal?: AbortSignal): Promise<Option[]> => {
    const response: AxiosResponse<LookupListResponse> = await httpClient.get(
      DEPARTMENTS_ENDPOINTS.LOOKUPS_DOCUMENT_TYPES,
      { signal }
    );
    return response.data.result.map((item) => ({
      id: item.value,
      fullName: item.label,
      role: "",
      disabled: item.disabled, 
    }));
  },

  getSubCompaniesLookup: async (rootId: string, signal?: AbortSignal): Promise<Option[]> => {
    const response: AxiosResponse<LookupListResponse> = await httpClient.get(
      DEPARTMENTS_ENDPOINTS.LOOKUPS_SUB_COMPANIES(rootId),
      { signal }
    );
    return response.data.result.map((item) => ({
      id: item.value,
      fullName: item.label,
      role: "",
      disabled: item.disabled, 
    }));
  },

  getPositionsLookup: async (
    pageIndex: number = 0,
    value?: string,
    signal?: AbortSignal
  ): Promise<{ options: Option[]; totalCount: number; pageIndex: number; pageSize: number }> => {
    const response: AxiosResponse<LookupPagedResponse> = await httpClient.get(
      DEPARTMENTS_ENDPOINTS.LOOKUPS_POSITIONS(pageIndex, value),
      { signal }
    );
    return {
      options: response.data.result.data.map((item) => ({
      id: item.value,
      fullName: item.label,
      role: "",
      disabled: item.disabled,
      })),
      totalCount: response.data.result.totalCount,
      pageIndex: response.data.result.pageIndex,
      pageSize: response.data.result.pageSize,
    };
  },

  getEmployeesLookup: async (
    rootCompanyId: string,
    pageIndex: number = 0,
    value?: string,
    signal?: AbortSignal
  ): Promise<Option[]> => {
    const response: AxiosResponse<LookupPagedResponse> = await httpClient.get(
      DEPARTMENTS_ENDPOINTS.LOOKUPS_EMPLOYEES(rootCompanyId, pageIndex, value),
      { signal }
    );
    return response.data.result.data.map((item) => ({
      id: item.value,
      fullName: item.label,
      role: "",
      disabled: item.disabled,
    }));
  },

  getStaffingByOrganizationUnitId: async (
    orgId: string,
    signal?: AbortSignal
  ): Promise<unknown> => {
    const response = await httpClient.get(
      DEPARTMENTS_ENDPOINTS.STAFFING_BY_ORG_UNIT(orgId),
      { signal }
    );
    return response.data;
  },

  createStaffing: async (
    payload: CreateStaffingRequest,
    signal?: AbortSignal
  ): Promise<CreateStaffingResponse> => {
    const response = await httpClient.post<CreateStaffingResponse>(
      DEPARTMENTS_ENDPOINTS.STAFFING_CREATE,
      payload,
      { signal }
    );
    return response.data;
  },

  updateStaffing: async (
    payload: UpdateStaffingRequest,
    signal?: AbortSignal
  ): Promise<CreateStaffingResponse> => {
    const response = await httpClient.post<CreateStaffingResponse>(
      DEPARTMENTS_ENDPOINTS.STAFFING_UPDATE,
      payload,
      { signal }
    );
    return response.data;
  },

  getStaffingById: async (id: string, signal?: AbortSignal): Promise<StaffingEntry> => {
    const response: AxiosResponse<GetStaffingByIdResponse> = await httpClient.get(
      DEPARTMENTS_ENDPOINTS.STAFFING_GET_BY_ID(id),
      { signal }
    );
    return response.data.result;
  },

  setStaffingActive: async (
    id: string,
    isActive: boolean,
    signal?: AbortSignal
  ): Promise<CreateStaffingResponse> => {
    const response: AxiosResponse<CreateStaffingResponse> = await httpClient.get(
      DEPARTMENTS_ENDPOINTS.STAFFING_SET_ACTIVE(id, isActive),
      { signal }
    );
    return response.data;
  },

  deleteStaffing: async (id: string, signal?: AbortSignal): Promise<CreateStaffingResponse> => {
    const response: AxiosResponse<CreateStaffingResponse> = await httpClient.get(
      DEPARTMENTS_ENDPOINTS.STAFFING_DELETE(id),
      { signal }
    );
    return response.data;
  },

  getNodesLookup: async (
    rootCompanyId: string,
    pageIndex: number = 0,
    value?: string,
    signal?: AbortSignal
  ): Promise<Option[]> => {
    const response: AxiosResponse<LookupPagedResponse> = await httpClient.get(
      DEPARTMENTS_ENDPOINTS.LOOKUPS_NODES(rootCompanyId, pageIndex, value),
      { signal }
    );
    return response.data.result.data.map((item) => ({
      id: item.value,
      fullName: item.label,
      role: "",
      disabled: item.disabled,
    }));
  },
};
