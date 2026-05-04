// ============================================================================
// REQUEST TYPES
// ============================================================================

export interface GetDepartmentsRequest {
  pageSize: number;
  pageIndex: number;
  isDesc: boolean;
  orderBy: string | null;
  name: string | null;
  isActive: boolean | null;
}

export interface CreateDepartmentRequest {
  name: string;
  legalName: string | null;
  organizationType: string;
  activity: string | null;
  voen: string | null;
  workScheduleCode: string | null;
  webSite: string | null;

  fax: string | null;
  phone: string | null;
  sortOrder: number;
  parentDepartmentId: string | null;
}

export interface UpdateDepartmentRequest {
  id: string;
  name: string;
  legalName: string | null;
  activity: string | null;
  voen: string | null;
  workScheduleCode: string | null;
  isActive: boolean;
  sortOrder?: number;
  webSite: string | null;

  fax: string | null;
  phone: string | null;
}

// ============================================================================
// RESPONSE TYPES
// ============================================================================

export interface DepartmentEntry {
  id: string;
  name: string;
  legalName?: string | null;
  shortName?: string | null;
  organizationType?: string | null;
  activity?: string | null;
  isActive: boolean;
  voen?: string | null;
  workScheduleCode?: string | null;
  parentDepartmentId?: string | null;
  sortOrder?: number | null;
  createdAt: string;
  createdBy?: string | null;
  webSite?: string | null;
  website?: string | null;
  fax?: string | null;
  phone?: string | null;

  children?: DepartmentEntry[];
}

export interface DepartmentsResult {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  data: DepartmentEntry[];
}

export interface GetDepartmentsResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result: DepartmentEntry[];
}

export interface GetDepartmentByIdResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result: DepartmentEntry;
}

export interface CreateDepartmentResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result: DepartmentEntry;
}

export interface UpdateDepartmentResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result: DepartmentEntry;
}

export interface DeleteDepartmentResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result?: unknown;
}

export interface LookupItem {
  value: string;
  label: string;
  disabled: boolean;
}

export interface LookupListResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result: LookupItem[];
}
export interface LookupResult {
  cities: LookupItem[];
  countries: LookupItem[];
  contactTypes: LookupItem[];
  employeeStatus: LookupItem[];
  employmentTypes: LookupItem[];
  genders: LookupItem[];
  maritalStatuses: LookupItem[];
  socialPlatforms: LookupItem[];
  staffCategories: LookupItem[];
  languageSkills: LookupItem[];
  otherPrograms: LookupItem[];
  programSkills: LookupItem[];
  proficiencyLevels: LookupItem[];
}

export interface LookupResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result: LookupResult;
}

export interface LookupPagedResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result: {
    pageIndex: number;
    pageSize: number;
    totalCount: number;
    data: LookupItem[];
  };
}

// ============================================================================
// STAFFING TYPES
// ============================================================================

export interface CreateStaffingRequest {
  organizationUnitId: string;
  positionId: string;
  workloadRateCode: string;
  staffCategoryCode: string;
  positionCount?: number;
}

export interface CreateStaffingResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result?: unknown;
}

export interface StaffingEntry {
  id: string;
  organizationUnitId: string;
  organizationUnit?: string;
  positionId: string;
  positionName: string;
  employeeName?: string;
  workloadRateCode?: string;
  staffCategoryCode?: string;
  positionCount?: number;
  isActive?: boolean;
  createdAt?: string;
  createdBy?: string | null;
}

export interface UpdateStaffingRequest {
  id: string;
  organizationUnitId: string;
  positionId: string;
  workloadRateCode: string;
  staffCategoryCode: string;
  positionCount?: number;
}

export interface GetStaffingByIdResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result: StaffingEntry;
}
