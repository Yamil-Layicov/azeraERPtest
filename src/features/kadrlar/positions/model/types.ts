// ============================================================================
// REQUEST TYPES
// ============================================================================

export interface GetPositionsRequest {
  pageSize: number;
  pageIndex: number;
  isDesc: boolean;
  orderBy: string | null;
  name: string | null;
  isActive: boolean | null;
}

export interface CreatePositionRequest {
  name: string;
  isActive: boolean;
  sortOrder: number;
}

export interface UpdatePositionRequest {
  id: string;
  name: string;
  isActive: boolean;
  sortOrder: number;
}

// ============================================================================
// RESPONSE TYPES
// ============================================================================

export interface PositionEntry {
  id: string;
  name: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  createdBy?: string | null;
}

export interface PositionsResult {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  data: PositionEntry[];
}

export interface GetPositionsResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result: PositionsResult;
}

export interface GetPositionByIdResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result: PositionEntry;
}

export interface DeletePositionResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result?: any;
}