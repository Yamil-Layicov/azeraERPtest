import { httpClient } from "@/shared/api";
import type { AxiosResponse } from "axios";
import type { 
  GetEnumItemsByTypeCodeResponse, 
  GetLookupsResponse 
} from "../model/types";

const getProxyUrl = () => {
  const proxyUrl =
    import.meta.env.VITE_PROXY_URL || import.meta.env.PROXY_URL || "";
  return proxyUrl.startsWith("/api") ? proxyUrl.replace("/api", "") : proxyUrl;
};

const PROXY_URL = getProxyUrl();

const LOOKUPS_ENDPOINTS = {
  GET_ENUM_ITEMS_BY_TYPE_CODE: (code: string) =>
    `${PROXY_URL}/identity/lookups/getEnumItemsByTypeCode/${encodeURIComponent(code)}`,
  GET_COUNTRIES: `${PROXY_URL}/identity/lookups/countries`,
  GET_CITIES_BY_COUNTRY_CODE: (countryId: string) =>
    `${PROXY_URL}/identity/lookups/citiesByCountryCode/${encodeURIComponent(countryId)}`,
  GET_SUB_COMPANIES: (rootCompanyId: string) =>
    `${PROXY_URL}/identity/lookups/subCompanies/${encodeURIComponent(rootCompanyId)}`,
  GET_STAFF_VACANT: (subCompanyId: string) =>
    `${PROXY_URL}/identity/lookups/staffVacant/${encodeURIComponent(subCompanyId)}`,
  GET_PRIVILEGES: `${PROXY_URL}/identity/lookups/privileges`,
  GET_SPECIAL_NOTE_ATTACH_TYPE: `${PROXY_URL}/identity/lookups/specialNoteAttachType`,
  GET_SPECIAL_RANKS: (organCode?: string) =>
    organCode
      ? `${PROXY_URL}/identity/lookups/specialRanks/${encodeURIComponent(organCode)}`
      : `${PROXY_URL}/identity/lookups/specialRanks`,
  GET_EMPLOYEE_STATUS: `${PROXY_URL}/identity/lookups/employeeStatus`,
  GET_POSITIONS: (pageIndex: number, value?: string) =>
    `${PROXY_URL}/identity/lookups/positions?pageIndex=${pageIndex}${
      value ? `&value=${encodeURIComponent(value)}` : ""
    }`,
  GET_USER_CREATION_REQUEST_STATUS: `${PROXY_URL}/identity/lookups/userCreationRequestStatus`,
  GET_LOOKUPS: `${PROXY_URL}/identity/lookups/getLookups`,
  GET_STATE_AWARDS: (typeCode: string) =>
    `${PROXY_URL}/identity/lookups/stateAwards/${encodeURIComponent(typeCode)}`,
} as const;

export const lookupsService = {
  getEnumItemsByTypeCode: async (
    code: string,
    signal?: AbortSignal,
  ): Promise<GetEnumItemsByTypeCodeResponse> => {
    const response: AxiosResponse<GetEnumItemsByTypeCodeResponse> =
      await httpClient.get(
        LOOKUPS_ENDPOINTS.GET_ENUM_ITEMS_BY_TYPE_CODE(code),
        { signal },
      );
    return response.data;
  },

  getStateAwardsByType: async (
    typeCode: string,
    signal?: AbortSignal,
  ): Promise<GetEnumItemsByTypeCodeResponse> => {
    const response: AxiosResponse<GetEnumItemsByTypeCodeResponse> =
      await httpClient.get(LOOKUPS_ENDPOINTS.GET_STATE_AWARDS(typeCode), {
        signal,
      });
    return response.data;
  },

  getPrivilegeTypes: async (
    signal?: AbortSignal,
  ): Promise<GetEnumItemsByTypeCodeResponse> => {
    const response: AxiosResponse<GetEnumItemsByTypeCodeResponse> =
      await httpClient.get(LOOKUPS_ENDPOINTS.GET_PRIVILEGES, { signal });
    return response.data;
  },

  getSpecialRanks: async (
    organCode?: string,
    signal?: AbortSignal,
  ): Promise<any> => {
    const response: AxiosResponse<any> = await httpClient.get(
      LOOKUPS_ENDPOINTS.GET_SPECIAL_RANKS(organCode),
      { signal },
    );
    return response.data;
  },

  getSpecialNoteAttachType: async (
    signal?: AbortSignal,
  ): Promise<GetEnumItemsByTypeCodeResponse> => {
    const response: AxiosResponse<GetEnumItemsByTypeCodeResponse> =
      await httpClient.get(LOOKUPS_ENDPOINTS.GET_SPECIAL_NOTE_ATTACH_TYPE, {
        signal,
      });
    return response.data;
  },

  getCountries: async (
    signal?: AbortSignal,
  ): Promise<GetEnumItemsByTypeCodeResponse> => {
    const response: AxiosResponse<GetEnumItemsByTypeCodeResponse> =
      await httpClient.get(LOOKUPS_ENDPOINTS.GET_COUNTRIES, { signal });
    return response.data;
  },

  getCitiesByCountryCode: async (
    countryId: string,
    signal?: AbortSignal,
  ): Promise<GetEnumItemsByTypeCodeResponse> => {
    const response: AxiosResponse<GetEnumItemsByTypeCodeResponse> =
      await httpClient.get(
        LOOKUPS_ENDPOINTS.GET_CITIES_BY_COUNTRY_CODE(countryId),
        { signal },
      );
    return response.data;
  },

  getSubCompanies: async (
    rootCompanyId: string,
    signal?: AbortSignal,
  ): Promise<GetEnumItemsByTypeCodeResponse> => {
    const response: AxiosResponse<GetEnumItemsByTypeCodeResponse> =
      await httpClient.get(LOOKUPS_ENDPOINTS.GET_SUB_COMPANIES(rootCompanyId), {
        signal,
      });
    return response.data;
  },

  getStaffVacant: async (
    subCompanyId: string,
    signal?: AbortSignal,
  ): Promise<GetEnumItemsByTypeCodeResponse> => {
    const response: AxiosResponse<GetEnumItemsByTypeCodeResponse> =
      await httpClient.get(LOOKUPS_ENDPOINTS.GET_STAFF_VACANT(subCompanyId), {
        signal,
      });
    return response.data;
  },

  getEmployeeStatus: async (
    signal?: AbortSignal,
  ): Promise<GetEnumItemsByTypeCodeResponse> => {
    const response: AxiosResponse<GetEnumItemsByTypeCodeResponse> =
      await httpClient.get(LOOKUPS_ENDPOINTS.GET_EMPLOYEE_STATUS, { signal });
    return response.data;
  },

  getPositions: async (
    pageIndex: number,
    value?: string,
    signal?: AbortSignal,
  ): Promise<any> => {
    const response: AxiosResponse<any> = await httpClient.get(
      LOOKUPS_ENDPOINTS.GET_POSITIONS(pageIndex, value),
      { signal },
    );
    return response.data;
  },

  getUserCreationRequestStatus: async (
    signal?: AbortSignal,
  ): Promise<GetEnumItemsByTypeCodeResponse> => {
    const response: AxiosResponse<GetEnumItemsByTypeCodeResponse> =
      await httpClient.get(LOOKUPS_ENDPOINTS.GET_USER_CREATION_REQUEST_STATUS, {
        signal,
      });
    return response.data;
  },

  getLookups: async (signal?: AbortSignal): Promise<GetLookupsResponse> => {
    const response: AxiosResponse<GetLookupsResponse> = await httpClient.get(
      LOOKUPS_ENDPOINTS.GET_LOOKUPS,
      { signal },
    );
    return response.data;
  },
};
