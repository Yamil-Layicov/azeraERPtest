import { httpClient } from "@/shared/api";
import type { AxiosResponse } from "axios";
import type {
  GetStateAwardsResponse,
  StateAwardResponse,
  StateAward,
} from "../model/types";

const getProxyUrl = () => {
  const proxyUrl =
    import.meta.env.VITE_PROXY_URL || import.meta.env.PROXY_URL || "/api/proxy";
  return proxyUrl.startsWith("/api") ? proxyUrl.replace("/api", "") : proxyUrl;
};

const PROXY_URL = getProxyUrl();

const STATE_AWARDS_ENDPOINTS = {
  GET: `${PROXY_URL}/stateAward/get`,
  GET_BY_ID: (id: string) => `${PROXY_URL}/stateAward/getById/${id}`,
  CREATE: `${PROXY_URL}/stateAward/create`,
  UPDATE: `${PROXY_URL}/stateAward/update`,
  DELETE: (id: string) => `${PROXY_URL}/stateAward/delete/${id}`,
  SET_ACTIVE: (id: string, isActive: boolean) =>
    `${PROXY_URL}/stateAward/setActive/${id}?isActive=${isActive}`,
} as const;

export const stateAwardsService = {
  getStateAwards: async (
    signal?: AbortSignal,
  ): Promise<GetStateAwardsResponse> => {
    const response: AxiosResponse<GetStateAwardsResponse> =
      await httpClient.get(STATE_AWARDS_ENDPOINTS.GET, { signal });
    
    // Map stateAwardTypeCode to typeCode for frontend consistency
    if (response.data.result) {
      if (Array.isArray(response.data.result)) {
        response.data.result = response.data.result.map((item: any) => ({
          ...item,
          typeCode: item.stateAwardTypeCode || item.typeCode,
        }));
      } else if ((response.data.result as any).data) {
        (response.data.result as any).data = (response.data.result as any).data.map((item: any) => ({
          ...item,
          typeCode: item.stateAwardTypeCode || item.typeCode,
        }));
      }
    }
    
    return response.data;
  },

  getById: async (
    id: string,
    signal?: AbortSignal,
  ): Promise<StateAwardResponse> => {
    const response: AxiosResponse<StateAwardResponse> = await httpClient.get(
      STATE_AWARDS_ENDPOINTS.GET_BY_ID(id),
      { signal },
    );

    // Map stateAwardTypeCode to typeCode for frontend consistency
    if (response.data.result) {
      (response.data.result as any).typeCode = (response.data.result as any).stateAwardTypeCode || (response.data.result as any).typeCode;
    }

    return response.data;
  },

  create: async (
    payload: Partial<StateAward>,
  ): Promise<StateAwardResponse> => {
    const response: AxiosResponse<StateAwardResponse> = await httpClient.post(
      STATE_AWARDS_ENDPOINTS.CREATE,
      payload,
    );
    return response.data;
  },

  update: async (
    payload: Partial<StateAward> & { id: string },
  ): Promise<StateAwardResponse> => {
    const response: AxiosResponse<StateAwardResponse> = await httpClient.post(
      STATE_AWARDS_ENDPOINTS.UPDATE,
      payload,
    );
    return response.data;
  },

  delete: async (id: string): Promise<StateAwardResponse> => {
    const response: AxiosResponse<StateAwardResponse> = await httpClient.get(
      STATE_AWARDS_ENDPOINTS.DELETE(id),
    );
    return response.data;
  },

  setActive: async (
    id: string,
    isActive: boolean,
  ): Promise<StateAwardResponse> => {
    const response: AxiosResponse<StateAwardResponse> = await httpClient.get(
      STATE_AWARDS_ENDPOINTS.SET_ACTIVE(id, isActive),
    );
    return response.data;
  },
};
