import { httpClient } from "@/shared/api";
import type { AxiosResponse } from "axios";
import type {
  GetCountriesResponse,
  GetCountryByIdResponse,
  CreateCountryRequest,
  UpdateCountryRequest,
} from "../model/types";
import type {
  GetCitiesResponse,
  CreateCityRequest,
  UpdateCityRequest,
  GetCityByIdResponse,
} from "../model/cityTypes";

const getProxyUrl = (): string => {
  const proxyUrl = import.meta.env.VITE_PROXY_URL || import.meta.env.PROXY_URL || "/api/proxy";
  return proxyUrl.startsWith("/api") ? proxyUrl.replace("/api", "") : proxyUrl;
};

const PROXY_URL = getProxyUrl();

const COUNTRIES_ENDPOINTS = {
  GET: `${PROXY_URL}/country/get`,
  GET_BY_ID: (id: string) => `${PROXY_URL}/country/getById/${id}`,
  CREATE: `${PROXY_URL}/country/create`,
  UPDATE: `${PROXY_URL}/country/update`,
  DELETE: (id: string) => `${PROXY_URL}/country/delete/${id}`,
  SET_ACTIVE: (id: string, isActive: boolean) => `${PROXY_URL}/country/setActive/${id}?isActive=${isActive}`,
  GET_CITIES: (countryId: string) => `${PROXY_URL}/city/getByCountryId/${countryId}`,
  GET_CITY_BY_ID: (id: string) => `${PROXY_URL}/city/getById/${id}`,
  CREATE_CITY: `${PROXY_URL}/city/create`,
  UPDATE_CITY: `${PROXY_URL}/city/update`,
  DELETE_CITY: (id: string) => `${PROXY_URL}/city/delete/${id}`,
  SET_ACTIVE_CITY: (id: string, isActive: boolean) => `${PROXY_URL}/city/setActive/${id}?isActive=${isActive}`,
  CREATE_LDAP_DIRECTORY: `${PROXY_URL}/ldapDirectory/create`,
  UPDATE_LDAP_DIRECTORY: `${PROXY_URL}/ldapDirectory/update`,
  DELETE_LDAP_DIRECTORY: (id: string) => `${PROXY_URL}/ldapDirectory/delete/${id}`,
  GET_LDAP_DIRECTORIES: `${PROXY_URL}/ldapDirectory/get`,
  GET_LDAP_BY_ID: (id: string) => `${PROXY_URL}/ldapDirectory/getById/${id}`,
  SET_ACTIVE_LDAP_DIRECTORY: (id: string, isActive: boolean) => `${PROXY_URL}/ldapDirectory/setActive/${id}?isActive=${isActive}`,
  TEST_LDAP_CONNECTION: (id: string) => `${PROXY_URL}/ldapDirectory/testConnection/${id}`,
  ADD_OR_REMOVE_COMPANY: `${PROXY_URL}/ldapDirectory/addOrRemoveCompany`,
} as const;

export const countriesService = {
  getCountries: async (signal?: AbortSignal): Promise<GetCountriesResponse> => {
    const response: AxiosResponse<GetCountriesResponse> = await httpClient.get(
      COUNTRIES_ENDPOINTS.GET,
      { signal }
    );
    return response.data;
  },

  getAllCountries: async (signal?: AbortSignal): Promise<GetCountriesResponse> => {
    const response: AxiosResponse<GetCountriesResponse> = await httpClient.get(
      COUNTRIES_ENDPOINTS.GET,
      { signal }
    );
    return response.data;
  },

  getCountryById: async (
    id: string,
    signal?: AbortSignal
  ): Promise<GetCountryByIdResponse> => {
    const response: AxiosResponse<GetCountryByIdResponse> = await httpClient.get(
      COUNTRIES_ENDPOINTS.GET_BY_ID(id),
      { signal }
    );
    return response.data;
  },

  create: async (
    payload: CreateCountryRequest,
    signal?: AbortSignal
  ): Promise<void> => {
    await httpClient.post(COUNTRIES_ENDPOINTS.CREATE, payload, { signal });
  },

  update: async (
    payload: UpdateCountryRequest,
    signal?: AbortSignal
  ): Promise<void> => {
    await httpClient.post(COUNTRIES_ENDPOINTS.UPDATE, payload, { signal });
  },

  delete: async (id: string, signal?: AbortSignal): Promise<void> => {
    await httpClient.get(COUNTRIES_ENDPOINTS.DELETE(id), { signal });
  },

  setActive: async (id: string, isActive: boolean, signal?: AbortSignal): Promise<void> => {
    await httpClient.get(COUNTRIES_ENDPOINTS.SET_ACTIVE(id, isActive), { signal });
  },

  getCities: async (countryId: string, signal?: AbortSignal): Promise<GetCitiesResponse> => {
    const response: AxiosResponse<GetCitiesResponse> = await httpClient.get(
      COUNTRIES_ENDPOINTS.GET_CITIES(countryId),
      { signal }
    );
    return response.data;
  },

  createCity: async (
    payload: CreateCityRequest,
    signal?: AbortSignal
  ): Promise<void> => {
    await httpClient.post(COUNTRIES_ENDPOINTS.CREATE_CITY, payload, { signal });
  },

  getCityById: async (
    id: string,
    signal?: AbortSignal
  ): Promise<GetCityByIdResponse> => {
    const response: AxiosResponse<GetCityByIdResponse> = await httpClient.get(
      COUNTRIES_ENDPOINTS.GET_CITY_BY_ID(id),
      { signal }
    );
    return response.data;
  },

  updateCity: async (
    payload: UpdateCityRequest,
    signal?: AbortSignal
  ): Promise<void> => {
    await httpClient.post(COUNTRIES_ENDPOINTS.UPDATE_CITY, payload, { signal });
  },

  deleteCity: async (id: string, signal?: AbortSignal): Promise<void> => {
    await httpClient.get(COUNTRIES_ENDPOINTS.DELETE_CITY(id), { signal });
  },

  setActiveCity: async (id: string, isActive: boolean, signal?: AbortSignal): Promise<void> => {
    await httpClient.get(COUNTRIES_ENDPOINTS.SET_ACTIVE_CITY(id, isActive), { signal });
  },

  createLdapDirectory: async (
    payload: any,
    signal?: AbortSignal
  ): Promise<void> => {
    await httpClient.post(COUNTRIES_ENDPOINTS.CREATE_LDAP_DIRECTORY, payload, { signal });
  },

  getLdapDirectories: async (signal?: AbortSignal): Promise<any> => {
    const response: AxiosResponse<any> = await httpClient.get(
      COUNTRIES_ENDPOINTS.GET_LDAP_DIRECTORIES,
      { signal }
    );
    return response.data;
  },

  getLdapDirectoryById: async (id: string, signal?: AbortSignal): Promise<any> => {
    const response: AxiosResponse<any> = await httpClient.get(
      COUNTRIES_ENDPOINTS.GET_LDAP_BY_ID(id),
      { signal }
    );
    return response.data;
  },

  updateLdapDirectory: async (
    payload: any,
    signal?: AbortSignal
  ): Promise<void> => {
    await httpClient.post(COUNTRIES_ENDPOINTS.UPDATE_LDAP_DIRECTORY, payload, { signal });
  },

  deleteLdapDirectory: async (id: string, signal?: AbortSignal): Promise<void> => {
    await httpClient.get(COUNTRIES_ENDPOINTS.DELETE_LDAP_DIRECTORY(id), { signal });
  },

  setActiveLdapDirectory: async (id: string, isActive: boolean, signal?: AbortSignal): Promise<void> => {
    await httpClient.get(COUNTRIES_ENDPOINTS.SET_ACTIVE_LDAP_DIRECTORY(id, isActive), { signal });
  },

  testLdapConnection: async (id: string, signal?: AbortSignal): Promise<any> => {
    const response: AxiosResponse<any> = await httpClient.get(
      COUNTRIES_ENDPOINTS.TEST_LDAP_CONNECTION(id),
      { signal }
    );
    return response.data;
  },

  addOrRemoveLdapDirectoryCompany: async (
    payload: { directoryId: string; companyIds: string[] },
    signal?: AbortSignal
  ): Promise<void> => {
    await httpClient.post(COUNTRIES_ENDPOINTS.ADD_OR_REMOVE_COMPANY, payload, { signal });
  },
};
