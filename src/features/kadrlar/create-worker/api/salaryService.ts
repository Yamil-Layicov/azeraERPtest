import { httpClient } from "@/shared/api/httpClient";
import type { SalaryCalcEntryRequest } from "../model/types";

const PROXY_URL = import.meta.env.VITE_PROXY_URL ?? "";

export interface SalaryCalculationRequest {
  calculationYear: number;
  grossSalary: number;
  informalSalary: number;
  bonus: number;
  includeTradeUnionFee: boolean;
}

export interface SalaryCalculationResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result: any;
}

export const salaryService = {
  calculateSalary: async (payload: SalaryCalculationRequest, signal?: AbortSignal): Promise<SalaryCalculationResponse> => {
    const response = await httpClient.post(`${PROXY_URL}/personalInfoForm/calculationSalary`, payload, { signal });
    return response.data;
  },

  // 1. Maaş Hesablamasını Yadda Saxla (POST)
  addOrEditSalaryCalcInfo: async (payload: SalaryCalcEntryRequest) => {
    const response = await httpClient.post(`${PROXY_URL}/personalInfoForm/addOrEditSalaryCalcInfo`, payload);
    return response.data;
  },

  // 2. Maaş Məlumatlarını Gətir (GET)
  getSalaryCalcInfoByPersonId: async (employeeId: string, signal?: AbortSignal) => {
    const response = await httpClient.get(`${PROXY_URL}/personalInfoForm/getSalaryCalcInfoByPersonId/${employeeId}`, { signal });
    return response.data;
  },

  // 3. Maaş Hesablamasını Sil (GET)
  removeSalaryCalcInfo: async (salaryCalcId: string) => {
    const response = await httpClient.get(`${PROXY_URL}/personalInfoForm/removeSalaryCalcInfo/${salaryCalcId}`);
    return response.data;
  }
};
