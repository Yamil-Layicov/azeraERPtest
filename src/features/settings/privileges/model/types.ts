export interface Privilege {
  id: number;
  name: string;
  legalBasisCode: string;
  extraVacation: number;
  isActive: boolean;
  sortOrder: number;
}

export interface PrivilegesResult {
  data: Privilege[];
  totalCount: number;
}

export interface GetPrivilegesResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result: Privilege[] | PrivilegesResult;
}

export interface PrivilegeResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result: Privilege;
}
