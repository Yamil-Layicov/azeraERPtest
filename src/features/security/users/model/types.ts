// ============================================================================
// REQUEST TYPES
// ============================================================================

export interface GetUsersRequest {
  pageSize: number;
  pageIndex: number;
  isDesc?: boolean;
  orderBy?: string | null;
  username?: string | null;
  isActive?: boolean | null;
}

export interface GetRolesRequest {
  pageSize: number;
  pageIndex: number;
  isDesc?: boolean;
  orderBy?: string | null;
  name?: string | null;
}

export interface ChangeUserRoleRequest {
  nodeId: string;
  roleNames: string[];
}

export interface ChangeUserRoleResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
}

export interface CreateRoleRequest {
  name: string;
  description: string;
}

export interface UpdateRoleRequest {
  id: string;
  name: string;
  description: string;
}

export interface ChangeUserStatusRequest {
  isActive: boolean;
}

export interface GetUserCreationRequest {
  pageIndex: number;
  pageSize: number;
  requestStatus?: string | null;
  fullname?: string | null;
  isDesc?: boolean;
  orderBy?: string | null;
}

export interface ResetPasswordRequest {
  username: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface RejectUserCreationRequest {
  id: string;
  rejectReason: string;
}

export interface GetEmployeesRequest {
  pageIndex: number;
  pageSize: number;
  value?: string | null;
}

// ============================================================================
// RESPONSE TYPES
// ============================================================================

export interface UserNode {
  value: string;
  label: string;
  disabled: boolean;
}

export interface UserEntry {
  id: string;
  ldapUserId: string | null;
  username: string;
  isActive: boolean;
  lockoutEnabled: boolean;
  lockoutEnd: string | null;
  email: string | null;
  emailConfirmed: boolean;
  phoneNumber: string | null;
  phoneNumberConfirmed: boolean;
  createdAt: string;
  userNodes: UserNode[];
}

export interface UsersResult {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  data: UserEntry[];
}

export interface GetUsersResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result: UsersResult;
}

export interface GetUserByIdResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result: UserEntry;
}

export interface UserCreationRequestItem {
  id: string;
  personId: string;
  requestDate: string;
  fullname: string;
  organizationUnitId: string;
  organizationUnit: string | null;
  requestStatus: string;
  note: string;
  rejectReason: string | null;
}

export interface UserCreationRequestsResult {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  data: UserCreationRequestItem[];
}

export interface GetUserCreationRequestsResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result: UserCreationRequestsResult;
}

export interface RoleItem {
  id: string;
  name: string;
  description: string;
  noAction: boolean;
  claims: unknown[];
}

export interface GetRoleByIdResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result: RoleItem;
}

export interface ChangeRoleClaimRequest {
  roleId: string;
  claimList: string[];
}

export interface RolesResult {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  data: RoleItem[]; // Array of role objects
}

export interface GetUserRolesResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result: RolesResult;
}

export interface GetUserRolesByNodeIdResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result: string[]; // Array of role names
}

export interface LdapGroup {
  name: string;
  samAccountName: string;
  distinguishedName: string;
  id: string;
}

export interface GetLdapGroupsResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result: LdapGroup[];
}

export interface LdapUser {
  id: string;
  name: string;
  surname: string;
  patronymic: string;
  email: string;
  phone: string;
  mobile: string;
  fullname: string;
  username: string;
  organization: string;
  accountStatus: string;
  memberOf: string[]; 
}

export interface GetLdapUserByIdResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result: LdapUser;
}

export interface ChangeUserGroupRequest {
  userId: string;
  groupIdList: string[];
}

export interface EmployeePerson {
  id: string;
  name: string;
  surname: string;
  patronymic: string | null;
  pin: string | null;
  username: string | null;
  photo: string | null;
}

export interface EmployeeItem {
  id: string;
  status: string;
  rootCompanyId: string;
  rootCompanyName: string | null;
  person: EmployeePerson;
}

export interface GetEmployeesResult {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  data: EmployeeItem[];
}

export interface GetEmployeesResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result: GetEmployeesResult;
}

