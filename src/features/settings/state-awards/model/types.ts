export interface StateAward {
  id: string;
  name: string;
  typeCode: string;
  isActive: boolean;
  sortOrder: number;
}

export interface StateAwardsResult {
  data: StateAward[];
  totalCount: number;
}

export interface GetStateAwardsResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result: StateAward[] | StateAwardsResult;
}

export interface StateAwardResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result: StateAward;
}
