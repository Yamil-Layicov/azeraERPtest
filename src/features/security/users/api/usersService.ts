import { httpClient } from "@/shared/api";
import type { AxiosResponse } from "axios";
import type { GetUsersRequest, GetUsersResponse, GetUserByIdResponse, GetUserRolesResponse, GetUserRolesByNodeIdResponse, GetRolesRequest, ChangeUserRoleRequest, ChangeUserRoleResponse, CreateRoleRequest, UpdateRoleRequest, GetRoleByIdResponse, GetLdapGroupsResponse, GetLdapUserByIdResponse, ResetPasswordRequest, ChangeUserGroupRequest, ChangeRoleClaimRequest, GetUserCreationRequest, GetUserCreationRequestsResponse, RejectUserCreationRequest, GetEmployeesRequest, GetEmployeesResponse } from "../model";

const PROXY_URL = import.meta.env.VITE_PROXY_URL ?? "";

const USERS_ENDPOINTS = {
  GET: `${PROXY_URL}/security/getUsers`,
  GET_BY_ID: (userId: string) => `${PROXY_URL}/security/getUserById/${userId}`,
  LOCKOUT_ENABLED: (userId: string) => `${PROXY_URL}/security/lockoutEnabled/${userId}`,
  ACTIVATE_USER: (userId: string) => `${PROXY_URL}/security/activateUser/${userId}`,
  DEACTIVATE_USER: (userId: string) => `${PROXY_URL}/security/deactivateUser/${userId}`,
  GET_ROLES: `${PROXY_URL}/security/getRoles`,
  GET_ROLE_BY_ID: (roleId: string) => `${PROXY_URL}/security/getRoleById/${roleId}`,
  GET_USER_ROLES_BY_NODE: (nodeId: string) => `${PROXY_URL}/security/getUserRoles/${nodeId}`,
  CHANGE_USER_ROLE: `${PROXY_URL}/security/changeUserRole`,
  CREATE_ROLE: `${PROXY_URL}/security/createRole`,  
  UPDATE_ROLE: `${PROXY_URL}/security/updateRole`,
  DELETE_ROLE: (roleId: string) => `${PROXY_URL}/security/deleteRole/${roleId}`,
  CHANGE_ROLE_CLAIM: `${PROXY_URL}/security/changeRoleClaim`,
  RESET_PASSWORD: `${PROXY_URL}/security/resetPassword`,
  CHECK_USERNAME: (ldapChecked: boolean, username: string) => `${PROXY_URL}/security/checkUsername?ldapChecked=${ldapChecked}&username=${encodeURIComponent(username)}`,
  GET_LDAP_GROUPS: `${PROXY_URL}/ldap/getGroups`,
  GET_LDAP_USER_BY_ID: (ldapUserId: string) => `${PROXY_URL}/ldap/getUserById/${ldapUserId}`,
  CHANGE_USER_GROUP: `${PROXY_URL}/ldap/changeUserGroup`,
  GET_LDAP_USERS: `${PROXY_URL}/ldap/getUsers`,
  CREATE_USER: (personId: string, username: string, ldapChecked: boolean) => `${PROXY_URL}/security/createUser/${personId}?username=${encodeURIComponent(username)}&ldapChecked=${ldapChecked}`,
  GET_USER_CREATION_REQUESTS: `${PROXY_URL}/security/getUserCreationRequest`,
  REJECT_USER_CREATION_REQUEST: `${PROXY_URL}/security/rejectUserCreationRequest`,
  GET_EMPLOYEES: `${PROXY_URL}/security/getEmployees`,
  
} as const;

export const usersService = {
  getUsers: async (
    payload: GetUsersRequest,
    signal?: AbortSignal
  ): Promise<GetUsersResponse> => {
    const response: AxiosResponse<GetUsersResponse> = await httpClient.post(
      USERS_ENDPOINTS.GET,
      payload,
      { signal }
    );
    return response.data;
  },

  getUserById: async (
    userId: string,
    signal?: AbortSignal
  ): Promise<GetUserByIdResponse> => {
    const url = `${USERS_ENDPOINTS.GET_BY_ID(userId)}?_=${Date.now()}`;
    const response: AxiosResponse<GetUserByIdResponse> = await httpClient.get(
      url,
      { signal }
    );
    return response.data;
  },

  toggleLockoutEnabled: async (
    userId: string,
    signal?: AbortSignal
  ): Promise<void> => {
    await httpClient.get(USERS_ENDPOINTS.LOCKOUT_ENABLED(userId), { signal });
  },

  changeUserStatus: async (
    userId: string,
    isActive: boolean,
    signal?: AbortSignal
  ): Promise<void> => {
    const endpoint = isActive 
      ? USERS_ENDPOINTS.ACTIVATE_USER(userId)
      : USERS_ENDPOINTS.DEACTIVATE_USER(userId);
    await httpClient.get(endpoint, { signal });
  },

  getUserRoles: async (
    payload: GetRolesRequest,
    signal?: AbortSignal
  ): Promise<GetUserRolesResponse> => {
    const response: AxiosResponse<GetUserRolesResponse> = await httpClient.post(
      USERS_ENDPOINTS.GET_ROLES,
      payload,
      { signal }
    );
    return response.data;
  },

  getRoleById: async (
    roleId: string,
    signal?: AbortSignal
  ): Promise<GetRoleByIdResponse> => {
    const response: AxiosResponse<GetRoleByIdResponse> = await httpClient.get(
      USERS_ENDPOINTS.GET_ROLE_BY_ID(roleId),
      { signal }
    );
    return response.data;
  },

  getUserRolesByNodeId: async (
    nodeId: string,
    signal?: AbortSignal
  ): Promise<GetUserRolesByNodeIdResponse> => {
    const response: AxiosResponse<GetUserRolesByNodeIdResponse> = await httpClient.get(
      USERS_ENDPOINTS.GET_USER_ROLES_BY_NODE(nodeId),
      { signal }
    );
    return response.data;
  },

  changeUserRole: async (
    payload: ChangeUserRoleRequest,
    signal?: AbortSignal
  ): Promise<ChangeUserRoleResponse> => {
    const response: AxiosResponse<ChangeUserRoleResponse> = await httpClient.post(
      USERS_ENDPOINTS.CHANGE_USER_ROLE,
      payload,
      { signal }
    );
    return response.data;
  },

  createRole: async (
    payload: CreateRoleRequest,
    signal?: AbortSignal
  ): Promise<void> => {
    await httpClient.post(USERS_ENDPOINTS.CREATE_ROLE, payload, { signal });
  },

  updateRole: async (
    payload: UpdateRoleRequest,
    signal?: AbortSignal
  ): Promise<void> => {
    await httpClient.post(USERS_ENDPOINTS.UPDATE_ROLE, payload, { signal });
  },

  deleteRole: async (
    roleId: string,
    signal?: AbortSignal
  ): Promise<void> => {
    await httpClient.get(USERS_ENDPOINTS.DELETE_ROLE(roleId), { signal });
  },

  getLdapGroups: async (
    signal?: AbortSignal
  ): Promise<GetLdapGroupsResponse> => {
    const response: AxiosResponse<GetLdapGroupsResponse> = await httpClient.get(
      USERS_ENDPOINTS.GET_LDAP_GROUPS,
      { signal }
    );
    return response.data;
  },

  getLdapUserById: async (
    ldapUserId: string,
    signal?: AbortSignal
  ): Promise<GetLdapUserByIdResponse> => {
    const response: AxiosResponse<GetLdapUserByIdResponse> = await httpClient.get(
      USERS_ENDPOINTS.GET_LDAP_USER_BY_ID(ldapUserId),
      { signal }
    );
    return response.data;
  },

  resetPassword: async (
    payload: ResetPasswordRequest,
    signal?: AbortSignal
  ): Promise<void> => {
    await httpClient.post(USERS_ENDPOINTS.RESET_PASSWORD, payload, { signal });
  },

  changeUserGroup: async (
    payload: ChangeUserGroupRequest,
    signal?: AbortSignal
  ): Promise<void> => {
    await httpClient.post(USERS_ENDPOINTS.CHANGE_USER_GROUP, payload, { signal });
  },

  changeRoleClaim: async (
    payload: ChangeRoleClaimRequest,
    signal?: AbortSignal
  ): Promise<void> => {
    await httpClient.post(USERS_ENDPOINTS.CHANGE_ROLE_CLAIM, payload, { signal });
  },

  checkUsername: async (
    ldapChecked: boolean,
    username: string,
    signal?: AbortSignal
  ): Promise<any> => {
    const response: AxiosResponse<any> = await httpClient.get(
      USERS_ENDPOINTS.CHECK_USERNAME(ldapChecked, username),
      { signal }
    );
    return response.data;
  },

  getLdapUsers: async (
    fullname?: string,
    username?: string,
    email?: string,
    signal?: AbortSignal
  ): Promise<any> => {
    let payload: { fullname: string | null; username: string | null; email: string | null };
    
    if (fullname && fullname.trim()) {
      payload = {
        fullname: fullname.trim(),
        username: null,
        email: null,
      };
    } else if (username && username.trim()) {
      payload = {
        fullname: null,
        username: username.trim(),
        email: null,
      };
    } else if (email && email.trim()) {
      payload = {
        fullname: null,
        username: null,
        email: email.trim(),
      };
    } else {
      payload = {
        fullname: null,
        username: null,
        email: null,
      };
    }

    const response: AxiosResponse<any> = await httpClient.post(
      USERS_ENDPOINTS.GET_LDAP_USERS,
      payload,
      { signal }
    );
    return response.data;
  },

  createUser: async (
    personId: string,
    username: string,
    ldapChecked: boolean,
    signal?: AbortSignal
  ): Promise<any> => {
    const response: AxiosResponse<any> = await httpClient.get(
      USERS_ENDPOINTS.CREATE_USER(personId, username, ldapChecked),
      { signal }
    );
    return response.data;
  },

  getEmployees: async (
    params: GetEmployeesRequest,
    signal?: AbortSignal
  ): Promise<GetEmployeesResponse> => {
    const response: AxiosResponse<GetEmployeesResponse> = await httpClient.get(
      USERS_ENDPOINTS.GET_EMPLOYEES,
      { params, signal }
    );
    return response.data;
  },

  getUserCreationRequests: async (
    payload: GetUserCreationRequest,
    signal?: AbortSignal
  ): Promise<GetUserCreationRequestsResponse> => {
    const response: AxiosResponse<GetUserCreationRequestsResponse> = await httpClient.post(
      USERS_ENDPOINTS.GET_USER_CREATION_REQUESTS,
      payload,
      { signal }
    );
    return response.data;
  },

  rejectUserCreationRequest: async (
    payload: RejectUserCreationRequest,
    signal?: AbortSignal
  ): Promise<any> => {
    const response: AxiosResponse<any> = await httpClient.post(
      USERS_ENDPOINTS.REJECT_USER_CREATION_REQUEST,
      payload,
      { signal }
    );
    return response.data;
  },
};

