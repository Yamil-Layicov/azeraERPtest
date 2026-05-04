import { httpClient } from "@/shared/api/httpClient";
import type { 
  WorkExperienceEntryRequest, 
  WorkExperienceInfoListResponse,
  TerminateWorkExperienceRequest
} from "../model/types";

const PROXY_URL = import.meta.env.VITE_PROXY_URL ?? "";

export const workExperienceService = {
  getWorkExperienceInfoByPersonId: async (personId: string, signal?: AbortSignal): Promise<WorkExperienceInfoListResponse> => {
    const response = await httpClient.get(
      `${PROXY_URL}/personalInfoForm/getWorkExperienceInfoByPersonId/${personId}`,
      { signal }
    );
    return response.data;
  },

  addOrEditWorkExperienceInfo: async (payload: WorkExperienceEntryRequest) => {
    const response = await httpClient.post(
      `${PROXY_URL}/personalInfoForm/addOrEditWorkExperienceInfo`, 
      payload
    );
    return response.data;
  },

  removeWorkExperienceInfo: async (experienceId: string) => {
    const response = await httpClient.get(
      `${PROXY_URL}/personalInfoForm/removeWorkExperienceInfo/${experienceId}`
    );
    return response.data;
  },

  terminatedWorkExperienceInfo: async (payload: TerminateWorkExperienceRequest) => {
    const response = await httpClient.post(
      `${PROXY_URL}/personalInfoForm/terminatedWorkExperienceInfo`, 
      payload
    );
    return response.data;
  },

  getWorkExperienceSummary: async (personId: string) => {
    const response = await httpClient.get(
      `${PROXY_URL}/personalInfoForm/getWorkExperienceSummary/${personId}`
    );
    return response.data;
  }
};
