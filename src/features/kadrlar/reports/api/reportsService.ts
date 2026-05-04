import { httpClient } from "@/shared/api";
import type { AxiosResponse } from "axios";
import type { ReportRequest, ReportResponse } from "../model/types";

const getProxyUrl = () => {
  const proxyUrl = import.meta.env.VITE_PROXY_URL || import.meta.env.PROXY_URL || "/api/proxy";
  return proxyUrl.startsWith("/api") ? proxyUrl.replace("/api", "") : proxyUrl;
};

const PROXY_URL = getProxyUrl();

const REPORTS_ENDPOINTS = {
  GET: `${PROXY_URL}/report/get`,
  GET_DETAIL: `${PROXY_URL}/report/getDetail`,
} as const;

export const reportsService = {
  getReport: async (
    payload: ReportRequest,
    signal?: AbortSignal
  ): Promise<ReportResponse> => {
    const response: AxiosResponse<ReportResponse> = await httpClient.post(
      REPORTS_ENDPOINTS.GET,
      payload,
      { signal }
    );
    return response.data;
  },

  getReportDetail: async (
    url: string,
    signal?: AbortSignal
  ): Promise<any> => {
    const response: AxiosResponse<any> = await httpClient.get(
      `${REPORTS_ENDPOINTS.GET_DETAIL}${url}`,
      { signal }
    );
    return response.data;
  },
};
