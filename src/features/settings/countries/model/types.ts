// ============================================================================
// REQUEST TYPES
// ============================================================================

export interface CreateCountryRequest {
  code: string;
  name: string;
  nativeName: string | null;
  phoneCode: string | null;
  currencyCode: string | null;
  sortOrder: number | null;
}

export interface UpdateCountryRequest {
  id: number;
  code: string;
  name: string;
  nativeName: string;
  phoneCode: string;
  currencyCode: string;
  sortOrder: number;
}

// ============================================================================
// RESPONSE TYPES
// ============================================================================

export interface CountryEntry {
  id: number;
  name: string;
  code: string;
  sortOrder: number;
  nativeName: string;
  phoneCode: string;
  currencyCode: string;
  isActive: boolean;
  isSystem?: boolean;
}

export interface CountriesResult {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  data: CountryEntry[];
}

export interface GetCountriesResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result: CountriesResult | CountryEntry[];
}

export interface GetCountryByIdResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result: CountryEntry;
}
