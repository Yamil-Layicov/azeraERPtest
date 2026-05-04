import { httpClient } from "@/shared/api";
import type { AxiosResponse } from "axios";
import type {
  GetEnumTypesResponse,
  GetEnumTypeByIdResponse,
  UpdateEnumTypeRequest,
  CreateEnumTypeRequest,
  GetEnumItemsByEnumTypeIdResponse,
  GetEnumItemByIdResponse,
  CreateEnumItemRequest,
  UpdateEnumItemRequest,
} from "../model/types";

const getProxyUrl = (): string => {
  const proxyUrl = import.meta.env.VITE_PROXY_URL || import.meta.env.PROXY_URL || "/api/proxy";
  return proxyUrl.startsWith("/api") ? proxyUrl.replace("/api", "") : proxyUrl;
};

const PROXY_URL = getProxyUrl();

const ENUM_TYPES_ENDPOINTS = {
  GET: `${PROXY_URL}/metaDataEnum/getEnumTypes`,
  GET_BY_ID: (id: string) => `${PROXY_URL}/metaDataEnum/getEnumTypeById/${id}`,
  UPDATE: `${PROXY_URL}/metaDataEnum/updateEnumType`,
  CREATE: `${PROXY_URL}/metaDataEnum/createEnumType`,
  DELETE: (id: string) => `${PROXY_URL}/metaDataEnum/deleteEnumType/${id}`,
  SET_ACTIVE: (id: string, isActive: boolean) => `${PROXY_URL}/metaDataEnum/setActiveEnumType/${id}?isActive=${isActive}`,
  GET_ENUM_ITEMS_BY_TYPE_ID: (enumTypeId: string) => `${PROXY_URL}/metaDataEnum/getEnumItemsByEnumTypeId/${enumTypeId}`,
  GET_ENUM_ITEM_BY_ID: (id: string) => `${PROXY_URL}/metaDataEnum/getEnumItemById/${id}`,
  DELETE_ENUM_ITEM: (id: string) => `${PROXY_URL}/metaDataEnum/deleteEnumItem/${id}`,
  CREATE_ENUM_ITEM: `${PROXY_URL}/metaDataEnum/createEnumItem`,
  UPDATE_ENUM_ITEM: `${PROXY_URL}/metaDataEnum/updateEnumItem`,
  SET_ACTIVE_ENUM_ITEM: (id: string, isActive: boolean) => `${PROXY_URL}/metaDataEnum/setActiveEnumItem/${id}?isActive=${isActive}`,
} as const;

export const enumTypesService = {
  getEnumTypes: async (signal?: AbortSignal): Promise<GetEnumTypesResponse> => {
    const response: AxiosResponse<GetEnumTypesResponse> = await httpClient.get(
      ENUM_TYPES_ENDPOINTS.GET,
      { signal }
    );
    return response.data;
  },

  getEnumTypeById: async (id: string, signal?: AbortSignal): Promise<GetEnumTypeByIdResponse> => {
    const response: AxiosResponse<GetEnumTypeByIdResponse> = await httpClient.get(
      ENUM_TYPES_ENDPOINTS.GET_BY_ID(id),
      { signal }
    );
    return response.data;
  },

  updateEnumType: async (
    payload: UpdateEnumTypeRequest,
    signal?: AbortSignal
  ): Promise<void> => {
    await httpClient.post(ENUM_TYPES_ENDPOINTS.UPDATE, payload, { signal });
  },

  createEnumType: async (
    payload: CreateEnumTypeRequest,
    signal?: AbortSignal
  ): Promise<void> => {
    await httpClient.post(ENUM_TYPES_ENDPOINTS.CREATE, payload, { signal });
  },

  deleteEnumType: async (id: string, signal?: AbortSignal): Promise<void> => {
    await httpClient.get(ENUM_TYPES_ENDPOINTS.DELETE(id), { signal });
  },

  setActiveEnumType: async (id: string, isActive: boolean, signal?: AbortSignal): Promise<void> => {
    await httpClient.get(ENUM_TYPES_ENDPOINTS.SET_ACTIVE(id, isActive), { signal });
  },

  getEnumItemsByEnumTypeId: async (
    enumTypeId: string,
    signal?: AbortSignal
  ): Promise<GetEnumItemsByEnumTypeIdResponse> => {
    const response: AxiosResponse<GetEnumItemsByEnumTypeIdResponse> = await httpClient.get(
      ENUM_TYPES_ENDPOINTS.GET_ENUM_ITEMS_BY_TYPE_ID(enumTypeId),
      { signal }
    );
    return response.data;
  },

  getEnumItemById: async (id: string, signal?: AbortSignal): Promise<GetEnumItemByIdResponse> => {
    const response: AxiosResponse<GetEnumItemByIdResponse> = await httpClient.get(
      ENUM_TYPES_ENDPOINTS.GET_ENUM_ITEM_BY_ID(id),
      { signal }
    );
    return response.data;
  },

  deleteEnumItem: async (id: string, signal?: AbortSignal): Promise<void> => {
    await httpClient.get(ENUM_TYPES_ENDPOINTS.DELETE_ENUM_ITEM(id), { signal });
  },

  createEnumItem: async (
    payload: CreateEnumItemRequest,
    signal?: AbortSignal
  ): Promise<void> => {
    await httpClient.post(ENUM_TYPES_ENDPOINTS.CREATE_ENUM_ITEM, payload, { signal });
  },

  updateEnumItem: async (
    payload: UpdateEnumItemRequest,
    signal?: AbortSignal
  ): Promise<void> => {
    await httpClient.post(ENUM_TYPES_ENDPOINTS.UPDATE_ENUM_ITEM, payload, { signal });
  },

  setActiveEnumItem: async (id: string, isActive: boolean, signal?: AbortSignal): Promise<void> => {
    await httpClient.get(ENUM_TYPES_ENDPOINTS.SET_ACTIVE_ENUM_ITEM(id, isActive), { signal });
  },
};
