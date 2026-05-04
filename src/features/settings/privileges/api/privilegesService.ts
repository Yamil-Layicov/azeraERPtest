import { httpClient } from "@/shared/api";
import type { AxiosResponse } from "axios";
import type { 
  GetPrivilegesResponse, 
  PrivilegeResponse,
  Privilege 
} from "../model/types";

const getProxyUrl = () => {
  const proxyUrl = import.meta.env.VITE_PROXY_URL || import.meta.env.PROXY_URL || "/api/proxy";
  return proxyUrl.startsWith("/api") ? proxyUrl.replace("/api", "") : proxyUrl;
};

const PROXY_URL = getProxyUrl();

const PRIVILEGES_ENDPOINTS = {
  GET: `${PROXY_URL}/privilege/get`,
  GET_BY_ID: (id: number | string) => `${PROXY_URL}/privilege/getById/${id}`,
  CREATE: `${PROXY_URL}/privilege/create`,
  UPDATE: `${PROXY_URL}/privilege/update`,
  DELETE: (id: number | string) => `${PROXY_URL}/privilege/delete/${id}`,
  SET_ACTIVE: (id: number | string, isActive: boolean) =>
    `${PROXY_URL}/privilege/setActive/${id}?isActive=${isActive}`,
} as const;

export const privilegesService = {
  getPrivileges: async (signal?: AbortSignal): Promise<GetPrivilegesResponse> => {
    const response: AxiosResponse<GetPrivilegesResponse> = await httpClient.get(
      PRIVILEGES_ENDPOINTS.GET,
      { signal }
    );
    return response.data;
  },

  getById: async (id: number | string, signal?: AbortSignal): Promise<PrivilegeResponse> => {
    const response: AxiosResponse<PrivilegeResponse> = await httpClient.get(
      PRIVILEGES_ENDPOINTS.GET_BY_ID(id),
      { signal }
    );
    return response.data;
  },

  create: async (payload: Partial<Privilege>): Promise<PrivilegeResponse> => {
    const response: AxiosResponse<PrivilegeResponse> = await httpClient.post(
      PRIVILEGES_ENDPOINTS.CREATE,
      payload
    );
    return response.data;
  },

  update: async (payload: Partial<Privilege> & { id: number }): Promise<PrivilegeResponse> => {
    const response: AxiosResponse<PrivilegeResponse> = await httpClient.post(
      PRIVILEGES_ENDPOINTS.UPDATE,
      payload
    );
    return response.data;
  },

  delete: async (id: number | string): Promise<PrivilegeResponse> => {
    const response: AxiosResponse<PrivilegeResponse> = await httpClient.get(
      PRIVILEGES_ENDPOINTS.DELETE(id)
    );
    return response.data;
  },

  setActive: async (id: number | string, isActive: boolean): Promise<PrivilegeResponse> => {
    const response: AxiosResponse<PrivilegeResponse> = await httpClient.get(
      PRIVILEGES_ENDPOINTS.SET_ACTIVE(id, isActive)
    );
    return response.data;
  },
};
