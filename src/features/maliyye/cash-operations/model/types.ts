export enum CurrencyType {
  AZN = 1,
  USD = 2,
  EUR = 3,
}

export enum CashOperationType {
  INCOME = 1,
  EXPENSE = 2,
  TRANSFER = 3,
}

/** ID sahələri rəqəmdirsə number, UUID-dirsə string göndərilir. */
export interface CreateCashOperationRequest {
  createdDate: string;
  rootCompanyId: string | number | null;
  cashPurposeId: string | number | null;
  counterPartyId: string | number | null;
  payerOrRecipientName: string | null;
  fromCashBoxId: string | number | null;
  toCashBoxId: string | number | null;
  amount: number;
  currencyType: CurrencyType;
  exchangeRate: number;
  cashOperationType: CashOperationType;
  creatorId: string | number | null;
  note: string | null;
  attachmentIds: string[] | null;
}

export interface CreateCashOperationResponse {
  id?: string;
  success?: boolean;
}

export interface UpdateCashOperationRequest extends CreateCashOperationRequest {
  cashOperationId: string;
}

export interface CreateCashPurposeRequest {
  name: string;
  creatorId: string | null;
}

export interface CreateCashPurposeResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
}

export interface CreateCounterpartyRequest {
  name: string;
  creatorId: string | null;
}

export interface CreateCounterpartyResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
}

export interface CashPurposeOption {
  value: string;
  label: string;
  disabled: boolean;
}

export interface GetCashPurposesResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result: CashPurposeOption[];
}

export interface CompanyOption {
  value: string;
  label: string;
  disabled: boolean;
}

export interface GetRootCompaniesResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result: CompanyOption[];
}

export interface OperationTypeOption {
  value: string;
  label: string;
  disabled: boolean;
}

export interface GetOperationTypesResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result: OperationTypeOption[];
}

export interface CashBoxOption {
  value: string;
  label: string;
  disabled: boolean;
}

export interface GetCashBoxesResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result: CashBoxOption[];
}

export interface GetStatusTypesResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result: { value: string; label: string; disabled: boolean }[];
}

export interface CurrencyOption {
  value: string;
  label: string;
  disabled: boolean;
}

export interface GetCurrenciesResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result: CurrencyOption[];
}

export interface CounterpartyOption {
  value: string;
  label: string;
  disabled: boolean;
}

export interface GetCounterpartiesResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result: CounterpartyOption[];
}
export interface GetNodesParams {
  rootCompanyId: string;
  pageIndex: number;
  value?: string;
}

export interface NodeOption {
  value: string;
  label: string;
  disabled: boolean;
}

export interface GetNodesResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result: {
    pageIndex: number;
    pageSize: number;
    totalCount: number;
    data: NodeOption[];
  };
}

export interface GetAllPendingApprovalCashOperationsRequest {
  pageSize: number;
  pageIndex: number;
  isDesc?: boolean;
  orderBy?: string;
  startDate?: string;
  endDate?: string;
  operationType?: string;
  cashPurposeId?: string;
  counterPartyId?: string;
  cashBoxId?: string;
  payerOrRecipientName?: string;
  status?: number;
}

export interface GetAllPendingApprovalCashOperationsResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result: {
    pageIndex: number;
    pageSize: number;
    totalCount: number;
    data: unknown[];
  };
}

export interface RejectCashOperationRequest {
  cashOperationId: string;
}

export interface RejectCashOperationResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
}

export interface ApproveCashOperationRequest {
  cashOperationId: string;
  approverId: string | null;
}

export interface ApproveCashOperationResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
}

export interface TreasurerApproveCashOperationRequest {
  cashOperationId: string;
  treasurerId: string | null;
}

export interface TreasurerApproveCashOperationResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
}

export interface GetCashOperationsRequest {
  pageSize: number;
  pageIndex: number;
  isDesc: boolean;
  orderBy: string;
  startDate?: string;
  endDate?: string;
  operationType?: string;
  cashPurposeId?: string;
  counterPartyId?: string;
  cashBoxId?: string;
  payerOrRecipientName?: string;
  status?: number | string;
}

export interface GetCashOperationsResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result: {
    pageIndex: number;
    pageSize: number;
    totalCount: number;
    data: any[];
  };
}

export interface DeleteCashOperationResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
}

export interface ReverseCashOperationRequest {
  cashOperationId: string;
}

export interface ReverseCashOperationResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
}

export interface DeleteCashBoxResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
}

export interface UpdateCashBoxResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
}

export interface CashOperationLog {
  id: string;
  note: string;
  createdDate: string;
}

export interface CashOperationApprover {
  id: string;
  nameId: string;
  orderNumber: number;
  minAmount: number;
  maxAmount: number;
}

export interface GetCashOperationByIdResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result: {
    id: string;
    rootCompanyId: string;
    rootCompanyName: string | null;
    cashPurposeId: string;
    counterPartyId: string;
    fromCashBoxId: string | null;
    toCashBoxId: string | null;
    treasurerId: string | null;
    cashOperationType: number;
    amount: number;
    currencyType: number;
    status: number;
    cashPurposeName: string | null;
    payerOrRecipientName: string | null;
    treasurerApproveTime: string | null;
    fromCashBoxName: string | null;
    toCashBoxName: string | null;
    counterPartyName: string | null;
    note: string | null;
    createdDate: string;
    creatorName: string | null;
    logs: CashOperationLog[];
    attachmentIds: string[];
    attachments: any[];
    fromCashBoxApprovers: CashOperationApprover[];
    toCashBoxApprovers: CashOperationApprover[];
  };
}

// --- CashBox (Kassa) create ---

export interface CreateCashBoxApproverItem {
  nameId: string | null;
  orderNumber: number;
  minAmount: number;
  maxAmount: number;
}

export interface CreateCashBoxRequest {
  code: string;
  name: string;
  companyId: string | null;
  treasureId: string | null;
  balance: number;
  currencyType: number;
  maxOperationLimit: number;
  allowedOperationTypes: number[];
  approvers: CreateCashBoxApproverItem[];
  creatorId: string | null;
}

export interface CreateCashBoxResponse {
  version?: string;
  isSuccess?: boolean;
  errorCode?: string | null;
  errorMessage?: string | null;
}

export interface UpdateCashBoxApproverItem {
  id: string | null;
  nameId: string | null;
  orderNumber: number;
  minAmount: number;
  maxAmount: number;
}

export interface UpdateCashBoxRequest {
  cashBoxId: string;
  name: string;
  balance: number;
  currencyType: number;
  treasureId: string | null;
  companyId: string | null;
  maxOperationLimit: number;
  updatedId: string | null;
  allowedOperationTypes: number[];
  approvers: UpdateCashBoxApproverItem[];
}

export interface GetCashBoxByIdResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result: {
    id: string;
    name: string;
    code: string;
    balance: number;
    currencyType: number;
    currencyName?: string;
    treasureId: string | null;
    treasureName?: string;
    companyId: string | null;
    companyName?: string;
    maxOperationLimit: number;
    active: boolean;
    allowedOperationTypes?: number[];
    approvers: {
      id: string;
      nameId: string | null;
      name?: string;
      orderNumber: number;
      minAmount: number;
      maxAmount: number;
    }[];
  };
}

export interface GetEmployeesResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result: {
    pageIndex: number;
    pageSize: number;
    totalCount: number;
    data: { value: string; label: string; disabled?: boolean }[];
  };
}

export interface GetCashBoxesAllRequest {
  pageSize: number;
  pageIndex: number;
  isDesc: boolean;
  orderBy: string;
  rootCompanyId?: string | null;
  treasureId?: string | null;
  status?: number | string;
  cashBoxId?: string | null;
}

export interface CashBoxListItem {
  id?: string | number;
  name?: string;
  code?: string;
  companyId?: string;
  companyName?: string;
  balance?: number;
  currencyType?: number;
  currency?: string;
  treasurerId?: string;
  treasurerName?: string;
  status?: number | string;
  isActive?: boolean;
  [key: string]: unknown;
}

export interface GetCashBoxesAllResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result: {
    pageIndex: number;
    pageSize: number;
    totalCount: number;
    data: CashBoxListItem[];
  };
}

/** Gündəlik kassa hesabatı – getAll sorğusu */
export interface GetCashBoxDailyReportRequest {
  pageSize: number;
  pageIndex: number;
  isDesc?: boolean;
  orderBy?: string;
  companyId?: string | null;
  cashBoxId?: string | null;
  startDate?: string | null;
  endDate?: string | null;
}

export interface CashBoxDailyReportItem {
  id: string;
  cashBoxId: string;
  cashBoxName?: string;
  rootCompanyId?: string;
  rootCompanyName?: string;
  previousBalance: number;
  income: number;
  expense: number;
  closingBalance: number;
  createdDate: string;
}

export interface GetCashBoxDailyReportResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result:
    | CashBoxDailyReportItem[]
    | {
        pageIndex: number;
        pageSize: number;
        totalCount: number;
        data: CashBoxDailyReportItem[];
      };
}

export interface GetCashBoxDailyReportByIdResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result: {
    id: string;
    cashBoxId: string;
    previousBalance: number;
    income: number;
    expense: number;
    closingBalance: number;
    createdDate: string;
  };
}

export interface DashboardGraphsRequest {
  companyId: string | null;
  cashBoxId: string | null;
  startDate?: string;
  endDate?: string;
}

export interface DashboardGraphsResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result: {
    totalIncome: number;
    totalExpense: number;
    operationTypeAmounts: {
      operationType: number;
      amount: number;
    }[];
    cashPurposeExpenses: {
      cashPurposeId: string;
      cashPurposeName: string;
      amount: number;
    }[];
    cashBoxes: {
      id: string;
      name: string;
      balance?: number;
      operationCount?: number;
    }[];
    companies?: {
      id: string;
      name: string;
      amount?: number;
    }[];
    counterPartyExpenses?: {
      counterPartyId: string;
      counterPartyName: string;
      amount: number;
    }[];
  };
}

export interface UploadCashflowFileResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result: {
    attachId: string;
    fileName: string;
    contentType: string;
    status: string;
  }[];
}
