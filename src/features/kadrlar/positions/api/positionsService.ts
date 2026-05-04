import { httpClient } from "@/shared/api";
import type { AxiosResponse } from "axios";
import type { GetPositionsRequest, GetPositionsResponse, GetPositionByIdResponse, CreatePositionRequest, UpdatePositionRequest, PositionEntry, DeletePositionResponse } from "../model/types";

const getProxyUrl = () => {
  const proxyUrl = import.meta.env.VITE_PROXY_URL || import.meta.env.PROXY_URL || "/api/proxy";
  return proxyUrl.startsWith("/api") ? proxyUrl.replace("/api", "") : proxyUrl;
};

const PROXY_URL = getProxyUrl();

const POSITIONS_ENDPOINTS = {
  GET: `${PROXY_URL}/position/get`,
  GET_BY_ID: (id: string) => `${PROXY_URL}/position/getById/${id}`,
  CREATE: `${PROXY_URL}/position/create`,
  UPDATE: `${PROXY_URL}/position/update`,
  DELETE: (id: string) => `${PROXY_URL}/position/delete/${id}`,
} as const;

export const positionsService = {
  getPositions: async (
    payload: GetPositionsRequest,
    signal?: AbortSignal
  ): Promise<GetPositionsResponse> => {
    const response: AxiosResponse<GetPositionsResponse> = await httpClient.post(
      POSITIONS_ENDPOINTS.GET,
      payload,
      { signal }
    );
    return response.data;
  },

  getById: async (id: string, signal?: AbortSignal): Promise<PositionEntry> => {
    const response: AxiosResponse<GetPositionByIdResponse> = await httpClient.get(
      POSITIONS_ENDPOINTS.GET_BY_ID(id),
      { signal }
    );
    return response.data.result;
  },

  create: async (
    payload: CreatePositionRequest,
    signal?: AbortSignal
  ): Promise<PositionEntry> => {
    const response: AxiosResponse<PositionEntry> = await httpClient.post(
      POSITIONS_ENDPOINTS.CREATE,
      payload,
      { signal }
    );
    return response.data;
  },

  update: async (
    payload: UpdatePositionRequest,
    signal?: AbortSignal
  ): Promise<PositionEntry> => {
    const response: AxiosResponse<PositionEntry> = await httpClient.post(
      POSITIONS_ENDPOINTS.UPDATE,
      payload,
      { signal }
    );
    return response.data;
  },

  delete: async (id: string, signal?: AbortSignal): Promise<DeletePositionResponse> => {
    const response: AxiosResponse<DeletePositionResponse> = await httpClient.get(
      POSITIONS_ENDPOINTS.DELETE(id),
      { signal }
    );
    return response.data;
  },
};
