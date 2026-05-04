import { z } from "zod";
import type { MenuItem } from "@/shared/types/navigation";

export const loginFormSchema = z.object({
  username: z.string().min(1, "İstifadəçi adı daxil edilməlidir"),
  password: z.string().min(1, "Şifrə daxil edilməlidir"),
  rememberMe: z.boolean(),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

export const changePasswordFormSchema = z
  .object({
    currentPassword: z.string().min(1, "Cari şifrə daxil edilməlidir"),
    newPassword: z
      .string()
      .min(6, "Şifrə ən azı 6 simvol olmalıdır")
      .regex(/[a-z]/, "Şifrədə ən azı bir kiçik hərf olmalıdır")
      .regex(/[A-Z]/, "Şifrədə ən azı bir böyük hərf olmalıdır")
      .regex(/[0-9]/, "Şifrədə ən azı bir rəqəm olmalıdır")
      .regex(/[^a-zA-Z0-9]/, "Şifrədə ən azı bir simvol olmalıdır")
      .refine(
        (password) => {
          return !password.includes("123");
        },
        {
          message: "Şifrədə '123' rəqəmləri ola bilməz",
        },
      ),
    confirmNewPassword: z.string().min(1, "Şifrə təsdiqlənməlidir"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Şifrələr eyni deyil",
    path: ["confirmNewPassword"],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordFormSchema>;

const menuItemSchema: z.ZodType<MenuItem> = z.lazy(() =>
  z.object({
    title: z.string(),
    icon: z.string().nullable().optional(),
    type: z.enum(["item", "collapse"]).optional(),
    path: z.string().nullable().optional(),
    children: z.array(menuItemSchema).nullable().optional(),
  }),
);

const nodeSchema = z.object({
  value: z.string(),
  label: z.string(),
  disabled: z.boolean().optional(),
});

export type UserNode = z.infer<typeof nodeSchema>;

export const authUserSchema = z.object({
  id: z.string(),
  fullname: z.string().nullable().optional().default(""),
  username: z.string(),
  nodeId: z.string().nullable().optional(),
  avatar: z.string().nullable().optional(),
  roles: z.array(z.string()),
  permissions: z.array(z.string()).nullable().optional(),
  email: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
});

const baseResponse = {
  version: z.string().optional(),
  isSuccess: z.boolean(),
  errorCode: z.string().nullable().optional(),
  errorMessage: z.string().nullable().optional(),
};

export const loginResponseSchema = z.object({
  ...baseResponse,
  // Backend yeni response formatında `result.token` döndürüyor (örn: ldap.pwd_expired).
  // Geriye dönük uyumluluk için hem `data` hem de `result` opsiyonel tutulur.
  data: z.null().optional(),
  result: z
    .object({
      token: z.string().nullable().optional(),
      refreshToken: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
});

export const authMeResponseSchema = z.object({
  ...baseResponse,

  result: z
    .object({
      user: authUserSchema,
      nodes: z.array(nodeSchema).nullable().optional(),

      navigation: z
        .object({
          menu: z.array(menuItemSchema),
        })
        .nullable()
        .optional(),
    })
    .nullable()
    .optional(),
});

export const renewPasswordSchema = z
  .object({
    username: z.string(),
    newPassword: z.string().min(6, "Şifrə ən azı 6 simvol olmalıdır"),
    confirmPassword: z.string().min(6, "Şifrə ən azı 6 simvol olmalıdır"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Şifrələr eyni deyil",
    path: ["confirmPassword"],
  });

export type RenewPasswordValues = z.infer<typeof renewPasswordSchema>;

export const userProfileSchema = z.object({
  photoId: z.string().nullable().optional(),
  fullname: z.string().nullable().optional(),
  userName: z.string(),
  birthDate: z.string().nullable().optional(),
  gender: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  emailConfirmed: z.boolean(),
  phoneNumber: z.string().nullable().optional(),
  phoneNumberConfirmed: z.boolean(),
});

export type UserProfileType = z.infer<typeof userProfileSchema>;

export const getUserProfileResponseSchema = z.object({
  ...baseResponse,
  result: userProfileSchema.nullable().optional(),
});

export type GetUserProfileResponseType = z.infer<typeof getUserProfileResponseSchema>;

export type LoginResponseType = z.infer<typeof loginResponseSchema>;
export type MeResponseType = z.infer<typeof authMeResponseSchema>;
