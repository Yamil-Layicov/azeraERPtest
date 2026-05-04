// Response types
export interface EnumTypeEntry {
  id: number;
  code: string;
  displayName: string;
  description: string | null;
  isActive: boolean;
  isSystem: boolean;
}

export interface GetEnumTypesResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result: EnumTypeEntry[];
}

export interface GetEnumTypeByIdResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result: EnumTypeEntry;
}

export interface UpdateEnumTypeRequest {
  id: number;
  displayName: string;
  description: string;
}

export interface CreateEnumTypeRequest {
  code: string;
  displayName: string;
  description: string;
}

// Enum Items (Values) types
export interface EnumItemEntry {
  id: number;
  enumTypeId: number;
  enumTypeCode: string;
  code: string;
  displayName: string;
  sortOrder: number;
  isActive: boolean;
  isSystem: boolean;
}

export interface GetEnumItemsByEnumTypeIdResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result: EnumItemEntry[];
}

export interface GetEnumItemByIdResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result: EnumItemEntry;
}

export interface CreateEnumItemRequest {
  enumTypeId: number;
  code: string;
  displayName: string;
  sortOrder: number;
}

export interface UpdateEnumItemRequest {
  id: number;
  displayName: string;
  sortOrder: number;
}
