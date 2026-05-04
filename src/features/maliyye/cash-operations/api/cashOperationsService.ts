import { httpClient } from "@/shared/api";
import type { AxiosResponse } from "axios";
import type {
  CreateCashOperationRequest,
  UpdateCashOperationRequest,
  CreateCashOperationResponse,
  GetCashPurposesResponse,
  GetRootCompaniesResponse,
  GetCashBoxesResponse,
  GetCurrenciesResponse,
  GetCounterpartiesResponse,
  GetCashOperationsRequest,
  GetCashOperationsResponse,
  GetAllPendingApprovalCashOperationsRequest,
  GetAllPendingApprovalCashOperationsResponse,
  ApproveCashOperationRequest,
  ApproveCashOperationResponse,
  TreasurerApproveCashOperationRequest,
  TreasurerApproveCashOperationResponse,
  CreateCashPurposeRequest,
  CreateCashPurposeResponse,
  CreateCounterpartyRequest,
  CreateCounterpartyResponse,
  GetOperationTypesResponse,
  DeleteCashOperationResponse,
  ReverseCashOperationRequest,
  ReverseCashOperationResponse,
  RejectCashOperationRequest,
  RejectCashOperationResponse,
  GetCashOperationByIdResponse,
  GetNodesParams,
  GetNodesResponse,
  CreateCashBoxRequest,
  CreateCashBoxResponse,
  UpdateCashBoxRequest,
  GetCashBoxesAllRequest,
  GetCashBoxesAllResponse,
  GetStatusTypesResponse,
  GetCashBoxByIdResponse,
  GetCashBoxDailyReportRequest,
  GetCashBoxDailyReportResponse,
  DeleteCashBoxResponse,
  UpdateCashBoxResponse,
  GetCashBoxDailyReportByIdResponse,
  DashboardGraphsRequest,
  DashboardGraphsResponse,
  UploadCashflowFileResponse,
} from "../model/types";

const PROXY_URL = import.meta.env.VITE_PROXY_URL ?? "";

const CASH_OPERATION_ENDPOINTS = {
  CREATE: `${PROXY_URL}/cashoperation/create`,
  GET_CASH_PURPOSES: `${PROXY_URL}/cashflow/lookups/cashPurposes`,
  GET_OPERATION_TYPES: `${PROXY_URL}/cashflow/lookups/operationType`,
  GET_ROOT_COMPANIES: `${PROXY_URL}/cashflow/lookups/rootCompanies`,
  GET_STATUS_TYPES: `${PROXY_URL}/cashflow/lookups/statusType`,
  GET_CASH_BOXES: (companyId: string) =>
    `${PROXY_URL}/cashflow/lookups/cashBoxes/${companyId}`,
  GET_PENDING_APPROVAL_CASH_BOXES: `${PROXY_URL}/cashflow/lookups/pendingApprovalCashBoxes`,
  GET_NODES: (rootCompanyId: string) =>
    `${PROXY_URL}/cashflow/lookups/nodes/${rootCompanyId}`,
  GET_CURRENCIES: `${PROXY_URL}/cashflow/lookups/currencyType`,
  GET_COUNTERPARTIES: `${PROXY_URL}/cashflow/lookups/counterParties`,
  GET_ALL: `${PROXY_URL}/cashoperation/getAll`,
  GET_PENDING_APPROVAL_CASH_OPERATIONS: `${PROXY_URL}/cashOperation/getAllPendingApprovalCashOperations`,
  APPROVE: `${PROXY_URL}/cashOperation/approve`,
  TREASURER_APPROVE: `${PROXY_URL}/cashOperation/treasurer-approve`,
  REJECT: `${PROXY_URL}/cashOperation/reject`,
  REVERSE: `${PROXY_URL}/cashOperation/reverse`,
  CREATE_CASH_PURPOSE: `${PROXY_URL}/cashPurpose/create`,
  CREATE_COUNTERPARTY: `${PROXY_URL}/counterParty/create`,
  UPDATE: `${PROXY_URL}/cashOperation/update`,
  DELETE: (id: string) => `${PROXY_URL}/cashOperation/delete/${id}`,
  GET_BY_ID: (id: string) => `${PROXY_URL}/cashOperation/getById/${id}`,
  CREATE_CASH_BOX: `${PROXY_URL}/cashBox/create`,
  UPDATE_CASH_BOX: `${PROXY_URL}/cashBox/update`,
  DELETE_CASH_BOX: (id: string) => `${PROXY_URL}/cashBox/delete/${id}`,
  GET_CASH_BOX_BY_ID: (id: string) => `${PROXY_URL}/cashBox/getById/${id}`,
  GET_CASH_BOXES_ALL: `${PROXY_URL}/cashBox/getAll`,
  GET_CASH_BOX_DAILY_REPORT_ALL: `${PROXY_URL}/cashBoxDailyReport/getAll`,
  GET_CASH_BOX_DAILY_REPORT_BY_ID: (id: string) =>
    `${PROXY_URL}/cashBoxDailyReport/getById/${id}`,
  GET_DASHBOARD_GRAPHS: `${PROXY_URL}/cashBoxDailyReport/dashboardGraphs`,
  UPLOAD_FILE: `${PROXY_URL}/cashflow/file/upload`,
  DOWNLOAD_FILE: (attachId: string) =>
    `${PROXY_URL}/cashflow/file/download/${attachId}`,
} as const;

export const cashOperationsService = {
  create: async (
    payload: CreateCashOperationRequest,
    signal?: AbortSignal,
  ): Promise<CreateCashOperationResponse> => {
    const response: AxiosResponse<CreateCashOperationResponse> =
      await httpClient.post(CASH_OPERATION_ENDPOINTS.CREATE, payload, {
        signal,
      });
    return response.data;
  },

  updateCashOperation: async (
    payload: UpdateCashOperationRequest,
    signal?: AbortSignal,
  ): Promise<any> => {
    const response: AxiosResponse<any> = await httpClient.post(
      CASH_OPERATION_ENDPOINTS.UPDATE,
      payload,
      {
        signal,
      },
    );
    return response.data;
  },

  createCashPurpose: async (
    payload: CreateCashPurposeRequest,
    signal?: AbortSignal,
  ): Promise<CreateCashPurposeResponse> => {
    const response: AxiosResponse<CreateCashPurposeResponse> =
      await httpClient.post(
        CASH_OPERATION_ENDPOINTS.CREATE_CASH_PURPOSE,
        payload,
        { signal },
      );
    return response.data;
  },

  createCounterparty: async (
    payload: CreateCounterpartyRequest,
    signal?: AbortSignal,
  ): Promise<CreateCounterpartyResponse> => {
    const response: AxiosResponse<CreateCounterpartyResponse> =
      await httpClient.post(
        CASH_OPERATION_ENDPOINTS.CREATE_COUNTERPARTY,
        payload,
        { signal },
      );
    return response.data;
  },

  getCashPurposes: async (
    signal?: AbortSignal,
  ): Promise<GetCashPurposesResponse> => {
    const response: AxiosResponse<GetCashPurposesResponse> =
      await httpClient.get(CASH_OPERATION_ENDPOINTS.GET_CASH_PURPOSES, {
        signal,
      });
    return response.data;
  },

  getOperationTypes: async (
    signal?: AbortSignal,
  ): Promise<GetOperationTypesResponse> => {
    const response: AxiosResponse<GetOperationTypesResponse> =
      await httpClient.get(CASH_OPERATION_ENDPOINTS.GET_OPERATION_TYPES, {
        signal,
      });
    return response.data;
  },

  getRootCompanies: async (
    signal?: AbortSignal,
  ): Promise<GetRootCompaniesResponse> => {
    const response: AxiosResponse<GetRootCompaniesResponse> =
      await httpClient.get(CASH_OPERATION_ENDPOINTS.GET_ROOT_COMPANIES, {
        signal,
      });
    return response.data;
  },

  getStatusTypes: async (
    signal?: AbortSignal,
  ): Promise<GetStatusTypesResponse> => {
    const response: AxiosResponse<GetStatusTypesResponse> =
      await httpClient.get(CASH_OPERATION_ENDPOINTS.GET_STATUS_TYPES, {
        signal,
      });
    return response.data;
  },

  getCashBoxes: async (
    companyId: string,
    signal?: AbortSignal,
  ): Promise<GetCashBoxesResponse> => {
    const response: AxiosResponse<GetCashBoxesResponse> = await httpClient.get(
      CASH_OPERATION_ENDPOINTS.GET_CASH_BOXES(companyId),
      {
        signal,
      },
    );
    return response.data;
  },

  getPendingApprovalCashBoxes: async (
    signal?: AbortSignal,
  ): Promise<GetCashBoxesResponse> => {
    const response: AxiosResponse<GetCashBoxesResponse> = await httpClient.get(
      CASH_OPERATION_ENDPOINTS.GET_PENDING_APPROVAL_CASH_BOXES,
      { signal },
    );
    return response.data;
  },

  getNodes: async (
    params: GetNodesParams,
    signal?: AbortSignal,
  ): Promise<GetNodesResponse> => {
    const { rootCompanyId, pageIndex, value } = params;
    const response: AxiosResponse<GetNodesResponse> = await httpClient.get(
      CASH_OPERATION_ENDPOINTS.GET_NODES(rootCompanyId),
      {
        params: { pageIndex, value },
        signal,
      },
    );
    return response.data;
  },

  getCurrencies: async (
    signal?: AbortSignal,
  ): Promise<GetCurrenciesResponse> => {
    const response: AxiosResponse<GetCurrenciesResponse> = await httpClient.get(
      CASH_OPERATION_ENDPOINTS.GET_CURRENCIES,
      {
        signal,
      },
    );
    return response.data;
  },

  getCounterparties: async (
    signal?: AbortSignal,
  ): Promise<GetCounterpartiesResponse> => {
    const response: AxiosResponse<GetCounterpartiesResponse> =
      await httpClient.get(CASH_OPERATION_ENDPOINTS.GET_COUNTERPARTIES, {
        signal,
      });
    return response.data;
  },

  getAll: async (
    payload: GetCashOperationsRequest,
    signal?: AbortSignal,
  ): Promise<GetCashOperationsResponse> => {
    const response: AxiosResponse<GetCashOperationsResponse> =
      await httpClient.post(CASH_OPERATION_ENDPOINTS.GET_ALL, payload, {
        signal,
      });
    return response.data;
  },

  getAllPendingApprovalCashOperations: async (
    payload: GetAllPendingApprovalCashOperationsRequest,
    signal?: AbortSignal,
  ): Promise<GetAllPendingApprovalCashOperationsResponse> => {
    const response: AxiosResponse<GetAllPendingApprovalCashOperationsResponse> =
      await httpClient.post(
        CASH_OPERATION_ENDPOINTS.GET_PENDING_APPROVAL_CASH_OPERATIONS,
        payload,
        { signal },
      );
    return response.data;
  },

  approve: async (
    payload: ApproveCashOperationRequest,
    signal?: AbortSignal,
  ): Promise<ApproveCashOperationResponse> => {
    const response: AxiosResponse<ApproveCashOperationResponse> =
      await httpClient.post(CASH_OPERATION_ENDPOINTS.APPROVE, payload, {
        signal,
      });
    return response.data;
  },

  treasurerApprove: async (
    payload: TreasurerApproveCashOperationRequest,
    signal?: AbortSignal,
  ): Promise<TreasurerApproveCashOperationResponse> => {
    const response: AxiosResponse<TreasurerApproveCashOperationResponse> =
      await httpClient.post(
        CASH_OPERATION_ENDPOINTS.TREASURER_APPROVE,
        payload,
        {
          signal,
        },
      );
    return response.data;
  },

  reject: async (
    payload: RejectCashOperationRequest,
    signal?: AbortSignal,
  ): Promise<RejectCashOperationResponse> => {
    const response: AxiosResponse<RejectCashOperationResponse> =
      await httpClient.post(CASH_OPERATION_ENDPOINTS.REJECT, payload, {
        signal,
      });
    return response.data;
  },

  reverse: async (
    payload: ReverseCashOperationRequest,
    signal?: AbortSignal,
  ): Promise<ReverseCashOperationResponse> => {
    const response: AxiosResponse<ReverseCashOperationResponse> =
      await httpClient.post(CASH_OPERATION_ENDPOINTS.REVERSE, payload, {
        signal,
      });
    return response.data;
  },

  delete: async (
    id: string,
    signal?: AbortSignal,
  ): Promise<DeleteCashOperationResponse> => {
    const response: AxiosResponse<DeleteCashOperationResponse> =
      await httpClient.get(CASH_OPERATION_ENDPOINTS.DELETE(id), {
        signal,
      });
    return response.data;
  },

  getById: async (
    id: string,
    signal?: AbortSignal,
  ): Promise<GetCashOperationByIdResponse> => {
    const response: AxiosResponse<GetCashOperationByIdResponse> =
      await httpClient.get(CASH_OPERATION_ENDPOINTS.GET_BY_ID(id), {
        signal,
      });
    return response.data;
  },

  createCashBox: async (
    payload: CreateCashBoxRequest,
    signal?: AbortSignal,
  ): Promise<CreateCashBoxResponse> => {
    const response: AxiosResponse<CreateCashBoxResponse> =
      await httpClient.post(CASH_OPERATION_ENDPOINTS.CREATE_CASH_BOX, payload, {
        signal,
      });
    return response.data;
  },

  updateCashBox: async (
    payload: UpdateCashBoxRequest,
    signal?: AbortSignal,
  ): Promise<UpdateCashBoxResponse> => {
    const response: AxiosResponse<UpdateCashBoxResponse> =
      await httpClient.post(CASH_OPERATION_ENDPOINTS.UPDATE_CASH_BOX, payload, {
        signal,
      });
    return response.data;
  },

  getCashBoxesAll: async (
    payload: GetCashBoxesAllRequest,
    signal?: AbortSignal,
  ): Promise<GetCashBoxesAllResponse> => {
    const response: AxiosResponse<GetCashBoxesAllResponse> =
      await httpClient.post(
        CASH_OPERATION_ENDPOINTS.GET_CASH_BOXES_ALL,
        payload,
        { signal },
      );
    return response.data;
  },

  deleteCashBox: async (
    id: string,
    signal?: AbortSignal,
  ): Promise<DeleteCashBoxResponse> => {
    const response: AxiosResponse<DeleteCashBoxResponse> = await httpClient.get(
      CASH_OPERATION_ENDPOINTS.DELETE_CASH_BOX(id),
      {
        signal,
      },
    );
    return response.data;
  },

  getCashBoxById: async (
    id: string,
    signal?: AbortSignal,
  ): Promise<GetCashBoxByIdResponse> => {
    const response: AxiosResponse<GetCashBoxByIdResponse> =
      await httpClient.get(CASH_OPERATION_ENDPOINTS.GET_CASH_BOX_BY_ID(id), {
        signal,
      });
    return response.data;
  },

  getCashBoxDailyReportAll: async (
    payload: GetCashBoxDailyReportRequest,
    signal?: AbortSignal,
  ): Promise<GetCashBoxDailyReportResponse> => {
    const response: AxiosResponse<GetCashBoxDailyReportResponse> =
      await httpClient.post(
        CASH_OPERATION_ENDPOINTS.GET_CASH_BOX_DAILY_REPORT_ALL,
        payload,
        { signal },
      );
    return response.data;
  },

  getCashBoxDailyReportById: async (
    id: string,
    signal?: AbortSignal,
  ): Promise<GetCashBoxDailyReportByIdResponse> => {
    const response: AxiosResponse<GetCashBoxDailyReportByIdResponse> =
      await httpClient.get(
        CASH_OPERATION_ENDPOINTS.GET_CASH_BOX_DAILY_REPORT_BY_ID(id),
        {
          signal,
        },
      );
    return response.data;
  },

  getDashboardGraphs: async (
    payload: DashboardGraphsRequest,
    signal?: AbortSignal,
  ): Promise<DashboardGraphsResponse> => {
    const response: AxiosResponse<DashboardGraphsResponse> =
      await httpClient.post(
        CASH_OPERATION_ENDPOINTS.GET_DASHBOARD_GRAPHS,
        payload,
        { signal },
      );
    return response.data;
  },

  uploadFile: async (
    files: File[],
    type: string,
    signal?: AbortSignal,
  ): Promise<UploadCashflowFileResponse> => {
    const formData = new FormData();
    files.forEach((file) => formData.append("Files", file));
    formData.append("Type", type);

    const response: AxiosResponse<UploadCashflowFileResponse> =
      await httpClient.post(CASH_OPERATION_ENDPOINTS.UPLOAD_FILE, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        signal,
      });
    return response.data;
  },

  downloadFile: async (
    attachId: string,
    signal?: AbortSignal,
  ): Promise<Blob> => {
    const response = await httpClient.get(
      CASH_OPERATION_ENDPOINTS.DOWNLOAD_FILE(attachId),
      {
        responseType: "blob",
        signal,
      },
    );
    return response.data;
  },
};
