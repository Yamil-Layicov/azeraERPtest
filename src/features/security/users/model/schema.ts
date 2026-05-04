import { z } from "zod";

const baseResponse = {
  version: z.string().optional(),
  isSuccess: z.boolean(),
  errorCode: z.string().nullable().optional(),
  errorMessage: z.string().nullable().optional(),
};

const userNodeSchema = z.object({
  value: z.string(),
  label: z.string(),
  disabled: z.boolean(),
});

const userEntrySchema = z.object({
  id: z.string(),
  ldapUserId: z.string().nullable(),
  username: z.string(),
  isActive: z.boolean(),
  lockoutEnabled: z.boolean(),
  lockoutEnd: z.string().nullable(),
  email: z.string().nullable(),
  emailConfirmed: z.boolean(),
  phoneNumber: z.string().nullable(),
  phoneNumberConfirmed: z.boolean(),
  createdAt: z.string(),
  userNodes: z.array(userNodeSchema),
});

const usersResultSchema = z.object({
  pageIndex: z.number(),
  pageSize: z.number(),
  totalCount: z.number(),
  data: z.array(userEntrySchema),
});

export const getUsersResponseSchema = z.object({
  ...baseResponse,
  result: usersResultSchema,
});

export const getUserByIdResponseSchema = z.object({
  ...baseResponse,
  result: userEntrySchema,
});


const roleItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  noAction: z.boolean(),
  claims: z.array(z.unknown()),
});

const rolesResultSchema = z.object({
  pageIndex: z.number(),
  pageSize: z.number(),
  totalCount: z.number(),
  data: z.array(roleItemSchema),
});

export const getUserRolesResponseSchema = z.object({
  ...baseResponse,
  result: rolesResultSchema,
});

export const getUserRolesByNodeIdResponseSchema = z.object({
  ...baseResponse,
  result: z.array(z.string()),
});

export const changeUserRoleResponseSchema = z.object({
  ...baseResponse,
});


const ldapGroupSchema = z.object({
  name: z.string(),
  samAccountName: z.string(),
  distinguishedName: z.string(),
  id: z.string(),
});

export const getLdapGroupsResponseSchema = z.object({
  ...baseResponse,
  result: z.array(ldapGroupSchema),
});

const ldapUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  surname: z.string(),
  patronymic: z.string(),
  email: z.string(),
  phone: z.string(),
  mobile: z.string(),
  fullname: z.string(),
  username: z.string(),
  organization: z.string(),
  accountStatus: z.string(),
  memberOf: z.array(z.string()),
});

export const getLdapUserByIdResponseSchema = z.object({
  ...baseResponse,
  result: ldapUserSchema,
});


export type GetUsersResponseType = z.infer<typeof getUsersResponseSchema>;
export type GetUserByIdResponseType = z.infer<typeof getUserByIdResponseSchema>;
export type GetUserRolesResponseType = z.infer<typeof getUserRolesResponseSchema>;
export type GetUserRolesByNodeIdResponseType = z.infer<typeof getUserRolesByNodeIdResponseSchema>;
export type ChangeUserRoleResponseType = z.infer<typeof changeUserRoleResponseSchema>;
export type GetLdapGroupsResponseType = z.infer<typeof getLdapGroupsResponseSchema>;
export type GetLdapUserByIdResponseType = z.infer<typeof getLdapUserByIdResponseSchema>;

