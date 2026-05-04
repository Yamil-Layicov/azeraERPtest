import { httpClient } from "@/shared/api/httpClient";
import { tokenStorage } from "@/shared/lib/utils/tokenStorage";
import  { type AxiosResponse } from "axios";
import type { BackendResponse } from "@/shared/types/api";
import {
  loginResponseSchema,
  authMeResponseSchema,
  getUserProfileResponseSchema,
  type LoginFormValues,
  type LoginResponseType,
  type MeResponseType,
  type ChangePasswordFormValues,
  type GetUserProfileResponseType,
} from "../model/schema";

type RenewPasswordPayload = {
  token: string;
  username: string;
  newPassword: string;
  confirmNewPassword: string;
};
 
const AUTH_ENDPOINTS = {
  ANTI_FORGERY: "/auth/antiforgery",
  SIGN_IN: "/auth/signin",
  ME: "/account/me",
  SIGN_OUT: "/auth/signout",
  REFRESH_PER_INFO: "/account/refreshPerInfo",
  GET_USER_PROFILE: "/account/getUserProfile",
  CHANGE_USER_NODE: (nodeId: string) => `/account/changeUserNode/${nodeId}`,
  CHANGE_PASSWORD: "/auth/changePassword",
  CHANGE_USER_CONTACT: "/account/changeUserContact",
  SENT_CONFIRM_CODE: (type: "Email" | "Mobile") =>
    `/account/sentConfirmCode/${type}`,
  CONFIRM_PHONE_NUMBER: (code: string) =>
    `/account/confirmPhoneNumberCode?code=${code}`,
  CONFIRM_EMAIL: (code: string) => `/account/confirmEmailCode?code=${code}`,
  PROFILE_CHANGE_PASSWORD: "/proxy/account/changePassword",
} as const;

export const authService = {
  getAntiForgery: async (signal?: AbortSignal): Promise<void> => {
    const response = await httpClient.get(AUTH_ENDPOINTS.ANTI_FORGERY, {
      signal,
    });
    const token =
      response.headers["x-xsrf-token"] ||
      response.headers["X-XSRF-TOKEN"] ||
      response.headers["xsrf-token"] ||
      (response.headers as Record<string, string>)["X-XSRF-TOKEN"];

    if (token) {
      tokenStorage.set(token);
    }
  },

  login: async (
    payload: LoginFormValues,
    signal?: AbortSignal,
  ): Promise<LoginResponseType> => {
    const response = await httpClient.post(AUTH_ENDPOINTS.SIGN_IN, payload, {
      signal,
    });
    return loginResponseSchema.parse(response.data);
  },

  getMe: async (signal?: AbortSignal): Promise<MeResponseType> => {
    const response = await httpClient.get(AUTH_ENDPOINTS.ME, { signal });

    return authMeResponseSchema.parse(response.data);
  },

  getProfileInfo: async (
    signal?: AbortSignal,
  ): Promise<GetUserProfileResponseType> => {
    const response = await httpClient.get(AUTH_ENDPOINTS.GET_USER_PROFILE, {
      signal,
    });
    return getUserProfileResponseSchema.parse(response.data);
  },

  logout: async (signal?: AbortSignal): Promise<void> => {
    await httpClient.get(AUTH_ENDPOINTS.SIGN_OUT, { signal });
  },

  refreshPerInfo: async (signal?: AbortSignal): Promise<void> => {
    await httpClient.get(AUTH_ENDPOINTS.REFRESH_PER_INFO, { signal });
  },

  changeUserNode: async (
    nodeId: string,
    signal?: AbortSignal,
  ): Promise<void> => {
    await httpClient.get(AUTH_ENDPOINTS.CHANGE_USER_NODE(nodeId), { signal });
  },

  changePassword: async (
    payload: ChangePasswordFormValues,
    signal?: AbortSignal,
  ): Promise<BackendResponse<void>> => {
    const response: AxiosResponse<BackendResponse<void>> =
      await httpClient.post(AUTH_ENDPOINTS.CHANGE_PASSWORD, payload, {
        signal,
      });
    return response.data;
  },

  profileChangePassword: async (
    payload: ChangePasswordFormValues,
    signal?: AbortSignal
  ): Promise<BackendResponse<void>> => {
    const response: AxiosResponse<BackendResponse<void>> = await httpClient.post(
      AUTH_ENDPOINTS.PROFILE_CHANGE_PASSWORD,
      payload,
      { signal }
    );
    return response.data;
  },

  changeUserContact: async (
    payload: { type: string; value: string },
    signal?: AbortSignal,
  ): Promise<BackendResponse<void>> => {
    const response: AxiosResponse<BackendResponse<void>> =
      await httpClient.post(AUTH_ENDPOINTS.CHANGE_USER_CONTACT, payload, {
        signal,
      });
    return response.data;
  },

  downloadFile: async (fileId: string, signal?: AbortSignal): Promise<Blob> => {
    const response = await httpClient.get(
      `/proxy/identity/file/download/${fileId}`,
      {
        responseType: "blob",
        signal,
      },
    );
    return response.data;
  },

  renewPassword: async (
    payload: RenewPasswordPayload,
    signal?: AbortSignal,
  ): Promise<BackendResponse<void>> => {
    const response: AxiosResponse<BackendResponse<void>> =
      await httpClient.post(AUTH_ENDPOINTS.CHANGE_PASSWORD, payload, {
        signal,
      });
    return response.data;
  },

  sentConfirmCode: async (
    type: "Email" | "Mobile",
    signal?: AbortSignal,
  ): Promise<BackendResponse<void>> => {
    const response: AxiosResponse<BackendResponse<void>> = await httpClient.get(
      AUTH_ENDPOINTS.SENT_CONFIRM_CODE(type),
      { signal },
    );
    return response.data;
  },

  confirmPhoneNumber: async (
    code: string,
    signal?: AbortSignal,
  ): Promise<BackendResponse<void>> => {
    const response: AxiosResponse<BackendResponse<void>> = await httpClient.get(
      AUTH_ENDPOINTS.CONFIRM_PHONE_NUMBER(code),
      { signal },
    );
    return response.data;
  },

  confirmEmail: async (
    code: string,
    signal?: AbortSignal,
  ): Promise<BackendResponse<void>> => {
    const response: AxiosResponse<BackendResponse<void>> = await httpClient.get(
      AUTH_ENDPOINTS.CONFIRM_EMAIL(code),
      { signal },
    );
    return response.data;
  },
};
