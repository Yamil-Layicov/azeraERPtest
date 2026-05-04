export interface SpecialRank {
  id: number;
  name: string;
  organCode: string;
  isActive: boolean;
  sortOrder: number;
}

export interface SpecialRanksResult {
  data: SpecialRank[];
  totalCount: number;
}

export interface GetSpecialRanksResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result: SpecialRank[] | SpecialRanksResult;
}

export interface SpecialRankResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result: SpecialRank;
}
