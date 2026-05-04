import { httpClient } from "@/shared/api/httpClient";
import type { 
  EducationEntryRequest, 
  AcademicDegreeEntryRequest, 
  SkillEntryRequest 
} from "../model/types";

const PROXY_URL = import.meta.env.VITE_PROXY_URL ?? "";

export const educationService = {
  getEducationInfoByPersonId: async (personId: string, signal?: AbortSignal) => {
    const response = await httpClient.get(`${PROXY_URL}/personalInfoForm/getEducationInfoByPersonId/${personId}`, { signal });
    return response.data;
  },

  // 1. Təhsil pilləsi (Education)
  addOrEditEducationInfo: async (payload: EducationEntryRequest) => {
    const response = await httpClient.post(`${PROXY_URL}/personalInfoForm/addOrEditEducationInfo`, payload);
    return response.data;
  },

  // 2. Elmi dərəcə (Academic Degree)
  addAcademicDegreeInfo: async (payload: AcademicDegreeEntryRequest) => {
    const response = await httpClient.post(`${PROXY_URL}/personalInfoForm/addAcademicDegreeInfo`, payload);
    return response.data;
  },

  // 3. Biliklər (Skills - Dil və Texniki)
  addSkillInfo: async (payload: SkillEntryRequest) => {
    const response = await httpClient.post(`${PROXY_URL}/personalInfoForm/addSkillInfo`, payload);
    return response.data;
  },

  // 4. Təhsil məlumatını sil (GET request)
  removeEducationInfo: async (eduId: string) => {
    const response = await httpClient.get(`${PROXY_URL}/personalInfoForm/removeEducationInfo/${eduId}`);
    return response.data;
  },

  // 5. Elmi dərəcə məlumatını sil (GET request)
  removeAcademicDegreeInfo: async (aceDegreeId: string) => {
    const response = await httpClient.get(`${PROXY_URL}/personalInfoForm/removeAcademicDegreeInfo/${aceDegreeId}`);
    return response.data;
  },

  // 6. Bilik məlumatını sil (GET request)
  removeSkillInfo: async (skillInfoId: string) => {
    const response = await httpClient.get(`${PROXY_URL}/personalInfoForm/removeSkillInfo/${skillInfoId}`);
    return response.data;
  }
};
