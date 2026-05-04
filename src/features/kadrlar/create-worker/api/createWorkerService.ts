import { httpClient } from "@/shared/api";
import type { AxiosResponse } from "axios";
import type {
  CreateWorkerRequest,
  CreateWorkerResponse,
  FileUploadResponse,
  MilitaryServiceEntryRequest,
  MilitaryServiceInfoListResponse,
  PersonSpecialRankEntryRequest,
  PersonnelActionEntryRequest,
  PerformanceEntryRequest,
  TerminateWorkExperienceRequest,
  TrainingEntryRequest,
  VacationEntryRequest,
  WorkExperienceEntryRequest,
  WorkExperienceInfoListResponse,
  TrainingsInfoListResponse,
  VacationsInfoListResponse,
  BusinessTripEntryRequest,
  BusinessTripsInfoListResponse,
  TimeOffEntryRequest,
  TimeOffsInfoListResponse,
  IncapacityEntryRequest,
  IncapacitiesInfoListResponse,
  PersonPrivilegeEntryRequest,
  PersonPrivilegesInfoListResponse,
  SpecialNoteEntryRequest,
  SpecialNoteInfoResponse,
  EmployeeCompleteRequest,
} from "../model/types";

const getProxyUrl = () => {
  const proxyUrl = import.meta.env.VITE_PROXY_URL || import.meta.env.PROXY_URL || "/api/proxy";
  return proxyUrl.startsWith("/api") ? proxyUrl.replace("/api", "") : proxyUrl;
};

const PROXY_URL = getProxyUrl();

const CREATE_WORKER_ENDPOINTS = {
  CREATE: `${PROXY_URL}/employee/create`,
  UPDATE: `${PROXY_URL}/employee/update`,
  COMPLETE: `${PROXY_URL}/employee/complete`,
  UPLOAD_FILE: `${PROXY_URL}/identity/file/upload`,
} as const;

type ContactInfoApiEntry = {
  id: string;
  type: string;
  value: string;
};

type ContactApiEntry = ContactInfoApiEntry & {
  isCorporate: boolean;
};

type ContactInfoResult = {
  contactList: ContactApiEntry[];
  socialAccountList: ContactInfoApiEntry[];
  externalAccountList: ContactInfoApiEntry[];
};

type ContactInfoResponse = {
  version?: string;
  isSuccess?: boolean;
  errorCode?: string | null;
  errorMessage?: string | null;
  result?: unknown;
};

const toArray = <T,>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : []);

const normalizeContactResult = (result: unknown): ContactInfoResult => {
  const raw = Array.isArray(result)
    ? (result[0] as Record<string, unknown> | undefined)
    : (result as Record<string, unknown> | undefined);

  if (!raw || typeof raw !== "object") {
    return { contactList: [], socialAccountList: [], externalAccountList: [] };
  }

  const nested = raw.result as Record<string, unknown> | undefined;
  const src = nested && typeof nested === "object" ? nested : raw;

  return {
    contactList: toArray<ContactApiEntry>(src.contactList ?? src.ContactList),
    socialAccountList: toArray<ContactInfoApiEntry>(src.socialAccountList ?? src.SocialAccountList),
    externalAccountList: toArray<ContactInfoApiEntry>(src.externalAccountList ?? src.ExternalAccountList),
  };
};

export const createWorkerService = {
  uploadFiles: async (files: File[], type: string): Promise<FileUploadResponse> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("Files", file, file.name);
    });
    formData.append("Type", type);

    const response: AxiosResponse<FileUploadResponse> = await httpClient.post(
      CREATE_WORKER_ENDPOINTS.UPLOAD_FILE,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  create: async (payload: CreateWorkerRequest): Promise<CreateWorkerResponse> => {
    const response: AxiosResponse<CreateWorkerResponse> = await httpClient.post(
      CREATE_WORKER_ENDPOINTS.CREATE,
      payload
    );
    return response.data;
  },

  update: async (payload: CreateWorkerRequest & { id: string }): Promise<CreateWorkerResponse> => {
    const response: AxiosResponse<CreateWorkerResponse> = await httpClient.post(
      CREATE_WORKER_ENDPOINTS.UPDATE,
      payload
    );
    return response.data;
  },

  completeEmployee: async (payload: EmployeeCompleteRequest) => {
    const response = await httpClient.post(CREATE_WORKER_ENDPOINTS.COMPLETE, payload);
    return response.data;
  },

  addContactInfo: async (payload: any) => {
    const response = await httpClient.post(`${PROXY_URL}/personalInfoForm/addContactInfo`, payload);
    return response.data;
  },

  getContactInfoByPersonId: async (personId: string) => {
    const response = await httpClient.get(`${PROXY_URL}/personalInfoForm/getContactInfoByPersonId/${personId}`);
    const data = response.data as ContactInfoResponse;
    return {
      ...data,
      result: normalizeContactResult(data?.result),
    };
  },

  removeContactInfo: async (contactId: string) => {
    const response = await httpClient.get(`${PROXY_URL}/personalInfoForm/removeContactInfo/${contactId}`);
    return response.data;
  },

  addSocialAccountInfo: async (payload: { personId: string; type: string; value: string }) => {
    const response = await httpClient.post(`${PROXY_URL}/personalInfoForm/addSocialAccountInfo`, payload);
    return response.data;
  },

  removeSocialAccountInfo: async (socialId: string) => {
    const response = await httpClient.get(`${PROXY_URL}/personalInfoForm/removeSocialAccountInfo/${socialId}`);
    return response.data;
  },

  addExternalAccountInfo: async (payload: { personId: string; type: string; value: string }) => {
    const response = await httpClient.post(`${PROXY_URL}/personalInfoForm/addExternalAccountInfo`, payload);
    return response.data;
  },

  removeExternalAccountInfo: async (exAccInfoId: string) => {
    const response = await httpClient.get(`${PROXY_URL}/personalInfoForm/removeExternalAccountInfo/${exAccInfoId}`);
    return response.data;
  },

  getWorkExperienceSummary: async (personId: string) => {
    const response = await httpClient.get(`${PROXY_URL}/personalInfoForm/getWorkExperienceSummary/${personId}`);
    return response.data;
  },

  getWorkExperienceInfoByPersonId: async (personId: string): Promise<WorkExperienceInfoListResponse> => {
    const response = await httpClient.get(
      `${PROXY_URL}/personalInfoForm/getWorkExperienceInfoByPersonId/${personId}`,
    );
    return response.data;
  },

  getTerminationReasons: async () => {
    const response = await httpClient.get(`${PROXY_URL}/identity/lookups/getEnumItemsByTypeCode/TerminationReasons`);
    return response.data;
  },

  getExperienceTypes: async () => {
    const response = await httpClient.get(`${PROXY_URL}/identity/lookups/getEnumItemsByTypeCode/ExperienceTypes`);
    return response.data;
  },

  getTrainingTypes: async () => {
    const response = await httpClient.get(`${PROXY_URL}/identity/lookups/getEnumItemsByTypeCode/TrainingTypes`);
    return response.data;
  },

  getLeaveTypes: async () => {
    const response = await httpClient.get(`${PROXY_URL}/identity/lookups/getEnumItemsByTypeCode/LeaveTypes`);
    return response.data;
  },

  getTrainingsInfoByPersonId: async (personId: string): Promise<TrainingsInfoListResponse> => {
    const response = await httpClient.get(
      `${PROXY_URL}/personalInfoForm/getTrainingsInfoByPersonId/${personId}`,
    );
    return response.data;
  },

  getPerformanceInfoByPersonId: async (personId: string) => {
    const response = await httpClient.get(
      `${PROXY_URL}/personalInfoForm/getPerformanceInfoByPersonId/${personId}`,
    );
    return response.data;
  },

  addOrEditPerformanceInfo: async (payload: PerformanceEntryRequest) => {
    const response = await httpClient.post(
      `${PROXY_URL}/personalInfoForm/addOrEditPerformanceInfo`,
      payload,
    );
    return response.data;
  },

  removePerformanceInfo: async (performanceInfoId: string) => {
    const response = await httpClient.get(
      `${PROXY_URL}/personalInfoForm/removePerformanceInfo/${performanceInfoId}`,
    );
    return response.data;
  },

  addPersonnelActionInfo: async (payload: PersonnelActionEntryRequest) => {
    const response = await httpClient.post(
      `${PROXY_URL}/personalInfoForm/addPersonnelActionInfo`,
      payload,
    );
    return response.data;
  },

  removePersonnelActionInfo: async (personnelActionId: string) => {
    const response = await httpClient.get(
      `${PROXY_URL}/personalInfoForm/removePersonnelActionInfo/${personnelActionId}`,
    );
    return response.data;
  },

  addOrEditTrainingInfo: async (payload: TrainingEntryRequest) => {
    const response = await httpClient.post(`${PROXY_URL}/personalInfoForm/addOrEditTrainingInfo`, payload);
    return response.data;
  },

  removeTrainingInfo: async (trainingInfoId: string) => {
    const response = await httpClient.get(
      `${PROXY_URL}/personalInfoForm/removeTrainingInfo/${trainingInfoId}`,
    );
    return response.data;
  },

  removeWorkExperienceInfo: async (experienceId: string) => {
    const response = await httpClient.get(`${PROXY_URL}/personalInfoForm/removeWorkExperienceInfo/${experienceId}`);
    return response.data;
  },

  addOrEditWorkExperienceInfo: async (payload: WorkExperienceEntryRequest) => {
    const response = await httpClient.post(`${PROXY_URL}/personalInfoForm/addOrEditWorkExperienceInfo`, payload);
    return response.data;
  },

  terminatedWorkExperienceInfo: async (payload: TerminateWorkExperienceRequest) => {
    const response = await httpClient.post(`${PROXY_URL}/personalInfoForm/terminatedWorkExperienceInfo`, payload);
    return response.data;
  },

  getPersonRelativeByPin: async (pin: string) => {
    const response = await httpClient.get(`${PROXY_URL}/personalInfoForm/getPersonRelativeByPin/${pin}`);
    return response.data;
  },

  getRelativeInfoByPersonId: async (personId: string) => {
    const response = await httpClient.get(`${PROXY_URL}/personalInfoForm/getRelativeInfoByPersonId/${personId}`);
    return response.data;
  },

  getSharedRelativesByPersonId: async (personId: string) => {
    const response = await httpClient.get(`${PROXY_URL}/personalInfoForm/getSharedRelativesByPersonId/${personId}`);
    return response.data;
  },

  removeRelativeInfo: async (id: string) => {
    const response = await httpClient.get(`${PROXY_URL}/personalInfoForm/removeRelativeInfo/${id}`);
    return response.data;
  },

  addOrEditRelativeInfo: async (payload: any) => {
    const response = await httpClient.post(`${PROXY_URL}/personalInfoForm/addOrEditRelativeInfo`, payload);
    return response.data;
  },

  addOrEditMilitaryServiceInfo: async (payload: MilitaryServiceEntryRequest) => {
    const response = await httpClient.post(
      `${PROXY_URL}/personalInfoForm/addOrEditMilitaryServiceInfo`,
      payload,
    );
    return response.data;
  },

  getMilitaryServicesInfoByPersonId: async (personId: string): Promise<MilitaryServiceInfoListResponse> => {
    const response = await httpClient.get(
      `${PROXY_URL}/personalInfoForm/getMilitaryServicesInfoByPersonId/${personId}`,
    );
    return response.data;
  },

  removeMilitaryServiceInfo: async (militaryServiceInfoId: string) => {
    const response = await httpClient.get(
      `${PROXY_URL}/personalInfoForm/removeMilitaryServiceInfo/${militaryServiceInfoId}`,
    );
    return response.data;
  },

  addPersonSpecialRankInfo: async (payload: PersonSpecialRankEntryRequest) => {
    const response = await httpClient.post(
      `${PROXY_URL}/personalInfoForm/addPersonSpecialRankInfo`,
      payload,
    );
    return response.data;
  },

  removePersonSpecialRankInfo: async (personSpecialRankInfoId: string) => {
    const response = await httpClient.get(
      `${PROXY_URL}/personalInfoForm/removePersonSpecialRankInfo/${personSpecialRankInfoId}`,
    );
    return response.data;
  },

  getEntitledExtraDaysByPersonId: async (personId: string) => {
    const response = await httpClient.get(
      `${PROXY_URL}/personalInfoForm/getEntitledExtraDaysByPersonId/${personId}`,
    );
    return response.data;
  },

  getWorkYearDateByEmployeeIdAsync: async (employeeId: string) => {
    const response = await httpClient.get(
      `${PROXY_URL}/personalInfoForm/getWorkYearDateByEmployeeIdAsync/${employeeId}`,
    );
    return response.data;
  },

  addOrEditVacationInfo: async (payload: VacationEntryRequest) => {
    const response = await httpClient.post(
      `${PROXY_URL}/personalInfoForm/addOrEditVacationInfo`,
      payload,
    );
    return response.data;
  },

  getVacationsInfoByPersonId: async (personId: string): Promise<VacationsInfoListResponse> => {
    const response = await httpClient.get(
      `${PROXY_URL}/personalInfoForm/getVacationsInfoByPersonId/${personId}`,
    );
    return response.data;
  },

  removeVacationInfo: async (vacationInfoId: string) => {
    const response = await httpClient.get(
      `${PROXY_URL}/personalInfoForm/removeVacationInfo/${vacationInfoId}`,
    );
    return response.data;
  },

  addOrEditBusinessTripInfo: async (payload: BusinessTripEntryRequest) => {
    const response = await httpClient.post(
      `${PROXY_URL}/personalInfoForm/addOrEditBusinessTripInfo`,
      payload,
    );
    return response.data;
  },

  getBusinessTripsInfoByPersonId: async (personId: string): Promise<BusinessTripsInfoListResponse> => {
    const response = await httpClient.get(
      `${PROXY_URL}/personalInfoForm/getBusinessTripsInfoByPersonId/${personId}`,
    );
    return response.data;
  },

  removeBusinessTripInfo: async (businessTripInfoId: string) => {
    const response = await httpClient.get(
      `${PROXY_URL}/personalInfoForm/removeBusinessTripInfo/${businessTripInfoId}`,
    );
    return response.data;
  },

  addOrEditTimeOffInfo: async (payload: TimeOffEntryRequest) => {
    const response = await httpClient.post(`${PROXY_URL}/personalInfoForm/addOrEditTimeOffInfo`, payload);
    return response.data;
  },

  getTimeOffsInfoByPersonId: async (personId: string): Promise<TimeOffsInfoListResponse> => {
    const response = await httpClient.get(
      `${PROXY_URL}/personalInfoForm/getTimeOffsInfoByPersonId/${personId}`,
    );
    return response.data;
  },

  removeTimeOffInfo: async (timeOffInfoId: string) => {
    const response = await httpClient.get(
      `${PROXY_URL}/personalInfoForm/removeTimeOffInfo/${timeOffInfoId}`,
    );
    return response.data;
  },

  addOrEditIncapacityInfo: async (payload: IncapacityEntryRequest) => {
    const response = await httpClient.post(
      `${PROXY_URL}/personalInfoForm/addOrEditIncapacityInfo`,
      payload,
    );
    return response.data;
  },

  getIncapacitiesInfoByPersonId: async (personId: string): Promise<IncapacitiesInfoListResponse> => {
    const response = await httpClient.get(
      `${PROXY_URL}/personalInfoForm/getIncapacitiesInfoByPersonId/${personId}`,
    );
    return response.data;
  },

  removeIncapacityInfo: async (incapacityInfoId: string) => {
    const response = await httpClient.get(
      `${PROXY_URL}/personalInfoForm/removeIncapacityInfo/${incapacityInfoId}`,
    );
    return response.data;
  },

  addOrEditPersonPrivilegeInfo: async (payload: PersonPrivilegeEntryRequest) => {
    const response = await httpClient.post(
      `${PROXY_URL}/personalInfoForm/addOrEditPersonPrivilegeInfo`,
      payload,
    );
    return response.data;
  },

  getPersonPrivilegesInfoByPersonId: async (personId: string): Promise<PersonPrivilegesInfoListResponse> => {
    const response = await httpClient.get(
      `${PROXY_URL}/personalInfoForm/getPersonPrivilegesInfoByPersonId/${personId}`,
    );
    return response.data;
  },

  removePersonPrivilegeInfo: async (personPrivilegeInfoId: string) => {
    const response = await httpClient.get(
      `${PROXY_URL}/personalInfoForm/removePersonPrivilegeInfo/${personPrivilegeInfoId}`,
    );
    return response.data;
  },

  addOrEditSpecialNoteInfo: async (payload: SpecialNoteEntryRequest) => {
    const response = await httpClient.post(
      `${PROXY_URL}/personalInfoForm/addOrEditSpecialNoteInfo`,
      payload,
    );
    return response.data;
  },

  getSpecialNoteInfoByPersonId: async (personId: string): Promise<SpecialNoteInfoResponse> => {
    const response = await httpClient.get(
      `${PROXY_URL}/personalInfoForm/getSpecialNoteInfoByPersonId/${personId}`,
    );
    return response.data;
  },

  addPersonStateAwardInfo: async (payload: {
    personId: string;
    stateAwardId: string | null;
    documentNumber: string;
    documentDate: string;
  }) => {
    const response = await httpClient.post(
      `${PROXY_URL}/personalInfoForm/addPersonStateAwardInfo`,
      payload,
    );
    return response.data;
  },

  removePersonStateAwardInfo: async (id: string) => {
    const response = await httpClient.get(
      `${PROXY_URL}/personalInfoForm/removePersonStateAwardInfo/${id}`,
    );
    return response.data;
  },
};
