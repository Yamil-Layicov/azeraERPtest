// ============================================================================
// CITY TYPES
// ============================================================================

export interface CityEntry {
  id: number;
  countryId: number;
  name: string;
  isActive: boolean;
  isSystem: boolean;
}

export interface CreateCityRequest {
  name: string;
  countryId: number;
}

export interface UpdateCityRequest {
  id: number;
  name: string;
}

export interface GetCityByIdResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result: CityEntry;
}

export interface GetCitiesResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result: CityEntry[];
}
