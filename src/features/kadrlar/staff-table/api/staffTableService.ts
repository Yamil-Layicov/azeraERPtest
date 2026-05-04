import { httpClient } from "@/shared/api";
import type { AxiosResponse } from "axios";
import type { 
  GetStaffTableRequest, 
  GetStaffTableResponse,
  CreateStaffTableRequest,
  StaffTableEntry,
  NodeGetRequest,
  NodeGetResponse,
  NodeEntry,
  DeactivateNodeRequest,
  CreateNodeRequest,
} from "../model";
import type { Option } from "@/shared/types";

// PROXY_URL
const getProxyUrl = () => {
  const proxyUrl = import.meta.env.VITE_PROXY_URL || import.meta.env.PROXY_URL || "/api/proxy";
  return proxyUrl.startsWith("/api") ? proxyUrl.replace("/api", "") : proxyUrl;
};

const PROXY_URL = getProxyUrl();

const STAFF_TABLE_ENDPOINTS = {
  GET: `${PROXY_URL}/staff-table/get`,
  NODE_GET: `${PROXY_URL}/node/get`,
  NODE_CREATE: `${PROXY_URL}/node/create`,
  NODE_GET_BY_ID: (id: string) => `${PROXY_URL}/node/getById/${id}`,
  NODE_DEACTIVATE: `${PROXY_URL}/node/deactivate`,
  NODE_ACTIVATE: (id: string) => `${PROXY_URL}/node/activate/${id}`,
  NODE_SET_ACTIVE: (id: string) => `${PROXY_URL}/node/setActive/${id}`,
  NODE_DELETE: (id: string) => `${PROXY_URL}/node/delete/${id}`,
  LOOKUPS_INACTIVE_STATUS: `${PROXY_URL}/identity/lookups/InactiveStatus`,
  GET_BY_ID: (id: string) => `${PROXY_URL}/staff-table/${id}`,
  CREATE: `${PROXY_URL}/staff-table/create`,
  UPDATE: (id: string) => `${PROXY_URL}/staff-table/update/${id}`,
  DELETE: (id: string) => `${PROXY_URL}/staff-table/delete/${id}`,
} as const;

export const staffTableService = {
  getStaffTable: async (
    payload: GetStaffTableRequest,
    signal?: AbortSignal
  ): Promise<GetStaffTableResponse> => {
    const response: AxiosResponse<GetStaffTableResponse> = await httpClient.post(
      STAFF_TABLE_ENDPOINTS.GET,
      payload,
      { signal }
    );
    return response.data;
  },

  getNodeList: async (
    payload: NodeGetRequest,
    signal?: AbortSignal
  ): Promise<NodeGetResponse> => {
    const response: AxiosResponse<NodeGetResponse> = await httpClient.post(
      STAFF_TABLE_ENDPOINTS.NODE_GET,
      payload,
      { signal }
    );
    return response.data;
  },

  getNodeById: async (id: string, signal?: AbortSignal): Promise<NodeEntry> => {
    const response: AxiosResponse<{ version: string; isSuccess: boolean; errorCode: string | null; errorMessage: string | null; result: NodeEntry }> = await httpClient.get(
      STAFF_TABLE_ENDPOINTS.NODE_GET_BY_ID(id),
      { signal }
    );
    return response.data.result;
  },

  getById: async (id: string, signal?: AbortSignal): Promise<StaffTableEntry> => {
    const response: AxiosResponse<StaffTableEntry> = await httpClient.get(
      STAFF_TABLE_ENDPOINTS.GET_BY_ID(id),
      { signal }
    );
    return response.data;
  },

  create: async (
    payload: CreateStaffTableRequest,
    signal?: AbortSignal
  ): Promise<StaffTableEntry> => {
    const response: AxiosResponse<StaffTableEntry> = await httpClient.post(
      STAFF_TABLE_ENDPOINTS.CREATE,
      payload,
      { signal }
    );
    return response.data;
  },

  update: async (
    id: string,
    payload: Partial<CreateStaffTableRequest>,
    signal?: AbortSignal
  ): Promise<StaffTableEntry> => {
    const response: AxiosResponse<StaffTableEntry> = await httpClient.put(
      STAFF_TABLE_ENDPOINTS.UPDATE(id),
      payload,
      { signal }
    );
    return response.data;
  },

  delete: async (id: string, signal?: AbortSignal): Promise<void> => {
    await httpClient.delete(STAFF_TABLE_ENDPOINTS.DELETE(id), { signal });
  },

  deactivateNode: async (
    payload: DeactivateNodeRequest,
    signal?: AbortSignal
  ): Promise<void> => {
    await httpClient.post(STAFF_TABLE_ENDPOINTS.NODE_DEACTIVATE, payload, { signal });
  },

  activateNode: async (id: string, signal?: AbortSignal): Promise<void> => {
    await httpClient.get(STAFF_TABLE_ENDPOINTS.NODE_ACTIVATE(id), { signal });
  },

  setNodeActive: async (
    nodeId: string,
    isActive: boolean,
    signal?: AbortSignal
  ): Promise<void> => {
    await httpClient.get(STAFF_TABLE_ENDPOINTS.NODE_SET_ACTIVE(nodeId), {
      params: { isActive },
      signal,
    });
  },

  deleteNode: async (id: string, signal?: AbortSignal): Promise<void> => {
    await httpClient.get(STAFF_TABLE_ENDPOINTS.NODE_DELETE(id), { signal });
  },

  createNode: async (
    payload: CreateNodeRequest,
    signal?: AbortSignal
  ): Promise<NodeEntry> => {
    const response: AxiosResponse<{ version: string; isSuccess: boolean; errorCode: string | null; errorMessage: string | null; result: NodeEntry }> = await httpClient.post(
      STAFF_TABLE_ENDPOINTS.NODE_CREATE,
      payload,
      { signal }
    );
    return response.data.result;
  },

  getInactiveStatusLookup: async (signal?: AbortSignal): Promise<Option[]> => {
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
    const response: AxiosResponse<LookupResponse> = await httpClient.get(
      STAFF_TABLE_ENDPOINTS.LOOKUPS_INACTIVE_STATUS,
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
