import { httpClient } from "@/shared/api";
import type { AxiosResponse } from "axios";
import type { CreateEmployeeRequest, CreateEmployeeResponse } from "../model";

// PROXY_URL
const getProxyUrl = () => {
  const proxyUrl = import.meta.env.VITE_PROXY_URL || import.meta.env.PROXY_URL || "/api/proxy";
  return proxyUrl.startsWith("/api") ? proxyUrl.replace("/api", "") : proxyUrl;
};

const PROXY_URL = getProxyUrl();

const CREATE_EMPLOYEE_ENDPOINTS = {
  CREATE: `${PROXY_URL}/employment/create`,
  CREATE_NODE: `${PROXY_URL}/node/create`,  
} as const;

export interface CreateEmploymentRequest {
  isMain: boolean;
  employmentId: string;
  staffingId?: string | null;
  relatedNodeId?: string | null;
  experienceTypeCode?: string | null;
  appointmentDate?: string | null;
  appointmentOrderNumber?: string | null;
}

export const createEmployeeService = {
  create: async (
    payload: CreateEmployeeRequest,
    signal?: AbortSignal
  ): Promise<CreateEmployeeResponse> => {
    const response: AxiosResponse<CreateEmployeeResponse> = await httpClient.post(
      CREATE_EMPLOYEE_ENDPOINTS.CREATE,
      payload,
      { signal }
    );
    return response.data;
  },

  createNode: async (
    payload: CreateEmploymentRequest,
    signal?: AbortSignal
  ): Promise<any> => {
    const response: AxiosResponse<any> = await httpClient.post(
      CREATE_EMPLOYEE_ENDPOINTS.CREATE_NODE,
      payload,
      { signal }
    );
    return response.data;
  },
};
