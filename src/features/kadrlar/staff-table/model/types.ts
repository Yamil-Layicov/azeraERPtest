// ============================================================================
// REQUEST TYPES
// ============================================================================

/** POST /node/get – cədvəl siyahısı üçün */
export interface NodeGetRequest {
  pageSize: number;
  pageIndex: number;
  isDesc: boolean;
  orderBy: string | null;
  rootCompanyId: string | null;
  fullname: string | null;
  subCompanyId: string | null;
  positionId: string | null;
  staffCategoriesCode?: string | null;
  isMain: boolean | null;
  isActive: boolean | null;
  isHead: boolean | null;
}

export interface GetStaffTableRequest {
  pageSize: number;
  pageIndex: number;
  isDesc: boolean;
  orderBy: string | null;
  departmentId: string | null;
  positionId: string | null;
  isActive: boolean | null;
}

export interface CreateStaffTableRequest {
  departmentId: string;
  positionId: string;
  quantity: number;
  isActive: boolean;
}

export interface UpdateStaffTableRequest extends Partial<CreateStaffTableRequest> {}

// ============================================================================
// RESPONSE TYPES
// ============================================================================

export interface StaffTableEntry {
  id: string;
  departmentId: string;
  departmentName?: string;
  positionId: string;
  positionName?: string;
  quantity: number;
  filledCount?: number;
  isActive: boolean;
  createdAt: string;
}

export interface StaffTableResult {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  data: StaffTableEntry[];
}

export interface GetStaffTableResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result: StaffTableResult;
}

/** POST /node/get – cədvəl sətiri (API response ilə uyğun) */
export interface DeactivateResponse {
  inactiveDate: string | null;
  status: string | null;
  reason: string | null;
}

export interface NodeEntry {
  id: string;
  employmentId: string;
  employeeId: string;
  employeeName: string;
  rootCompanyId?: string;
  subCompanyId: string;
  positionId: string;
  staffCategoriesCode: string;
  relatedNodeId: string | null;
  relatedName: string | null;
  isActive: boolean;
  isHead: boolean;
  isMain: boolean;
  createdAt: string;
  createdBy: string | null;
  deactivateResponse?: DeactivateResponse;
  positionName?: string | null;
}

export interface NodeGetResult {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  data: NodeEntry[];
}

export interface NodeGetResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result: NodeGetResult;
}

export interface DeactivateNodeRequest {
  id: string;
  status: string;
  reason: string;
}

export interface CreateNodeRequest {
  isMain: boolean;
  employmentId: string;
  isHead: boolean;
  subCompanyId: string | null;
  positionId: string | null;
  relatedNodeId?: string | null;
}
