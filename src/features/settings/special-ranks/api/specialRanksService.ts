import { httpClient } from "@/shared/api";
import type { AxiosResponse } from "axios";
import type {
  GetSpecialRanksResponse,
  SpecialRankResponse,
  SpecialRank,
} from "../model/types";

const getProxyUrl = () => {
  const proxyUrl =
    import.meta.env.VITE_PROXY_URL || import.meta.env.PROXY_URL || "/api/proxy";
  return proxyUrl.startsWith("/api") ? proxyUrl.replace("/api", "") : proxyUrl;
};

const PROXY_URL = getProxyUrl();

const SPECIAL_RANKS_ENDPOINTS = {
  GET: `${PROXY_URL}/specialRank/get`,
  GET_BY_ID: (id: string) => `${PROXY_URL}/specialRank/getById/${id}`,
  CREATE: `${PROXY_URL}/specialRank/create`,
  UPDATE: `${PROXY_URL}/specialRank/update`,
  DELETE: (id: string) => `${PROXY_URL}/specialRank/delete/${id}`,
  SET_ACTIVE: (id: string, isActive: boolean) =>
    `${PROXY_URL}/specialRank/setActive/${id}?isActive=${isActive}`,
} as const;

export const specialRanksService = {
  getSpecialRanks: async (
    signal?: AbortSignal,
  ): Promise<GetSpecialRanksResponse> => {
    const response: AxiosResponse<GetSpecialRanksResponse> =
      await httpClient.get(SPECIAL_RANKS_ENDPOINTS.GET, { signal });
    return response.data;
  },

  getById: async (
    id: string,
    signal?: AbortSignal,
  ): Promise<SpecialRankResponse> => {
    const response: AxiosResponse<SpecialRankResponse> = await httpClient.get(
      SPECIAL_RANKS_ENDPOINTS.GET_BY_ID(id),
      { signal },
    );
    return response.data;
  },

  create: async (
    payload: Partial<SpecialRank>,
  ): Promise<SpecialRankResponse> => {
    const response: AxiosResponse<SpecialRankResponse> = await httpClient.post(
      SPECIAL_RANKS_ENDPOINTS.CREATE,
      payload,
    );
    return response.data;
  },

  update: async (
    payload: Partial<SpecialRank> & { id: number },
  ): Promise<SpecialRankResponse> => {
    const response: AxiosResponse<SpecialRankResponse> = await httpClient.post(
      SPECIAL_RANKS_ENDPOINTS.UPDATE,
      payload,
    );
    return response.data;
  },

  delete: async (id: string): Promise<SpecialRankResponse> => {
    const response: AxiosResponse<SpecialRankResponse> = await httpClient.get(
      SPECIAL_RANKS_ENDPOINTS.DELETE(id),
    );
    return response.data;
  },

  setActive: async (
    id: string,
    isActive: boolean,
  ): Promise<SpecialRankResponse> => {
    const response: AxiosResponse<SpecialRankResponse> = await httpClient.get(
      SPECIAL_RANKS_ENDPOINTS.SET_ACTIVE(id, isActive),
    );
    return response.data;
  },
};
