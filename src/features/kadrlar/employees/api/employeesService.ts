import { httpClient } from "@/shared/api";
import type { AxiosResponse } from "axios";
import type { 
  GetEmployeesRequest, 
  GetEmployeesResponse,
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
  UpdateEmployeeResponse,
  EmployeeEntry 
} from "../model";
import type { Option } from "@/shared/types";

const getProxyUrl = () => {
  const proxyUrl = import.meta.env.VITE_PROXY_URL || import.meta.env.PROXY_URL || "/api/proxy";
  return proxyUrl.startsWith("/api") ? proxyUrl.replace("/api", "") : proxyUrl;
};

const PROXY_URL = getProxyUrl();

const EMPLOYEES_ENDPOINTS = {
  GET: `${PROXY_URL}/employee/get`,
  GET_BY_ID: (id: string) => `${PROXY_URL}/employee/getById/${id}`,
  GET_BY_PIN: (pin: string) => `${PROXY_URL}/person/checkPin/${pin}`,
  GET_BY_PIN_ADD_EMPLOYEE: (pin: string) => `${PROXY_URL}/person/getByPin/${pin}`,
  EDIT_PIN: `${PROXY_URL}/person/editPin`,
  CREATE: "/employee/create",
  UPDATE: `${PROXY_URL}/employee/update`,
  DELETE: (id: string) => `${PROXY_URL}/employee/delete/${id}`,
  PRINT: (id: string) => `${PROXY_URL}/employee/print/${id}`,
  LOOKUPS_DOCUMENT_TYPES: `${PROXY_URL}/identity/lookups/documentTypes`,
} as const;

interface LookupItem {
  value: string;
  label: string;
  disabled?: boolean;
}

interface LookupResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result: LookupItem[];
}

interface ApiResponse<T> {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result: T;
}

interface ApiEmployeeGetRow {
  id: string;
  employmentTypeCode?: string | null;
  referrerName?: string | null;
  rootCompanyId?: string | null;
  createdAt?: string | null;
  createdBy?: string | null;
  status?: string | null;
  person?: Partial<EmployeeEntry> & {
    id?: string;
    employees?: Array<{
      id?: string;
      status?: string;
      employmentTypeCode?: string | null;
      companyId?: string | null;
      companyName?: string | null;
      referrerName?: string | null;
      createdAt?: string | null;
    }>;
  };
}

export const employeesService = {
  getEmployees: async (
    payload: GetEmployeesRequest,
    signal?: AbortSignal
  ): Promise<GetEmployeesResponse> => {
    const response: AxiosResponse<GetEmployeesResponse> = await httpClient.post(
      EMPLOYEES_ENDPOINTS.GET,
      payload,
      { signal }
    );
    const responseData = response.data;

    const normalizedData = (responseData.result?.data || []).map((row: unknown) => {
      const item = row as ApiEmployeeGetRow;

      if (!item?.person) {
        return row as EmployeeEntry;
      }

      const person = item.person;
      const primaryEmployee = person.employees?.find(
        (emp) => String(emp.id || "") === String(item.id || "")
      );

      return {
        id: item.id || person.id || "",
        name: person.name || "",
        surname: person.surname || "",
        patronymic: person.patronymic || null,
        birthDate: person.birthDate || "",
        gender: person.gender || "",
        maritalStatus: person.maritalStatus || "",
        pin: person.pin || "",
        isForeignCitizen: !!person.isForeignCitizen,
        citizenshipCode: person.citizenshipCode || null,
        birthCountryCode: person.birthCountryCode || null,
        birthCityId: person.birthCityId ?? null,
        foreignBirthCity: person.foreignBirthCity || null,
        photoId: person.photoId || null,
        username: person.username || null,
        rootCompanyId:
          item.rootCompanyId ||
          primaryEmployee?.companyId ||
          person.rootCompanyId ||
          null,
        createdAt: item.createdAt || primaryEmployee?.createdAt || person.createdAt || "",
        createdBy: item.createdBy || person.createdBy || null,
        address: person.address || null,
        documents: person.documents || [],
        contacts: person.contacts || (item as any).contacts || [],
        socialAccounts: person.socialAccounts || (item as any).socialAccounts || [],
        skills: person.skills || (item as any).skills || [],
        externalAccounts: person.externalAccounts || (item as any).externalAccounts || [],
        employees: person.employees || [],
        employmentTypeCode: item.employmentTypeCode || primaryEmployee?.employmentTypeCode || null,
        isPrimary: (item.employmentTypeCode || primaryEmployee?.employmentTypeCode) === "PrimaryEmployment",
        status: item.status || primaryEmployee?.status || null,
      } as EmployeeEntry;
    });

    return {
      ...responseData,
      result: {
        ...responseData.result,
        data: normalizedData,
      },
    };
  },

  getById: async (id: string, signal?: AbortSignal): Promise<EmployeeEntry> => {
    const response: AxiosResponse<ApiResponse<EmployeeEntry>> = await httpClient.get(
      EMPLOYEES_ENDPOINTS.GET_BY_ID(id),
      { signal }
    );
    return response.data.result;
  },

  getByPin: async (pin: string, signal?: AbortSignal): Promise<ApiResponse<EmployeeEntry>> => {
    const response: AxiosResponse<ApiResponse<EmployeeEntry>> = await httpClient.get(
      EMPLOYEES_ENDPOINTS.GET_BY_PIN(pin),
      { signal }
    );
    return response.data;
  },

  getByPinAddEmployee: async (pin: string, signal?: AbortSignal): Promise<ApiResponse<EmployeeEntry>> => {
    const response: AxiosResponse<ApiResponse<EmployeeEntry>> = await httpClient.get(
      EMPLOYEES_ENDPOINTS.GET_BY_PIN_ADD_EMPLOYEE(pin),
      { signal }
    );
    return response.data;
  },

  editPin: async (
    payload: { personId: string; pin: string },
    signal?: AbortSignal
  ): Promise<ApiResponse<unknown>> => {
    const response: AxiosResponse<ApiResponse<unknown>> = await httpClient.post(
      EMPLOYEES_ENDPOINTS.EDIT_PIN,
      payload,
      { signal }
    );
    return response.data;
  },

  create: async (
    payload: CreateEmployeeRequest,
    signal?: AbortSignal
  ): Promise<EmployeeEntry> => {
    const response: AxiosResponse<ApiResponse<EmployeeEntry>> = await httpClient.post(
      EMPLOYEES_ENDPOINTS.CREATE,
      payload,
      { signal }
    );
    return response.data.result;
  },

  update: async (
    payload: UpdateEmployeeRequest,
    signal?: AbortSignal
  ): Promise<UpdateEmployeeResponse> => {
    const response: AxiosResponse<UpdateEmployeeResponse> = await httpClient.post(
      EMPLOYEES_ENDPOINTS.UPDATE,
      payload,
      { signal }
    );
    return response.data;
  },

  delete: async (id: string, signal?: AbortSignal): Promise<void> => {
    await httpClient.get(EMPLOYEES_ENDPOINTS.DELETE(id), { signal });
  },

  print: async (id: string, signal?: AbortSignal): Promise<any> => {
    const response: AxiosResponse<ApiResponse<any>> = await httpClient.get(
      EMPLOYEES_ENDPOINTS.PRINT(id),
      { signal }
    );
    return response.data.result;
  },

  getDocumentTypesLookup: async (signal?: AbortSignal): Promise<Option[]> => {
    const response: AxiosResponse<LookupResponse> = await httpClient.get(
      EMPLOYEES_ENDPOINTS.LOOKUPS_DOCUMENT_TYPES,
      { signal }
    );
    return response.data.result.map((item) => ({
      id: item.value,
      fullName: item.label,
      role: "",
      disabled: item.disabled,
    }));
  },
};
