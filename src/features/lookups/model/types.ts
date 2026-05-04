/** Backend response item from getEnumItemsByTypeCode */
export interface EnumLookupItem {
  value: string;
  label: string;
  disabled?: boolean;
  /** Legacy fields for backward compatibility */
  id?: number | string;
  code?: string;
  displayName?: string;
  fullName?: string;
  [key: string]: unknown;
}

export interface GetEnumItemsByTypeCodeResponse {
  isSuccess?: boolean;
  result?: EnumLookupItem[];
  data?: EnumLookupItem[];
}

export interface GetLookupsResponse {
  isSuccess: boolean;
  result: {
    employeeStatus: EnumLookupItem[];
    reportTypes: EnumLookupItem[];
    [key: string]: EnumLookupItem[];
  };
}
