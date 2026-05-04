import { z } from "zod";

export const createLdapDirectoryFormSchema = z.object({
  name: z
    .string()
    .min(1, "Ad vacibdir")
    .trim(),
  domain: z
    .string()
    .min(1, "Domain vacibdir")
    .trim(),
  host: z
    .string()
    .min(1, "Host vacibdir")
    .trim(),
  port: z
    .string()
    .min(1, "Port vacibdir")
    .refine((val) => /^-?\d+$/.test(val), "Port yalnız rəqəm olmalıdır")
    .refine((val) => !val.startsWith("-"), "Port mənfi ola bilməz")
    .refine((val) => val.replace("-", "").length <= 4, "Port maksimum 4 rəqəm olmalıdır")
    .transform((val) => {
      const parsed = parseInt(val, 10);
      return isNaN(parsed) ? 0 : parsed;
    })
    .refine((val) => val >= 0 && val <= 9999, "Port 0 ilə 9999 arasında olmalıdır"),
  useSsl: z.boolean().default(false),
  useTls: z.boolean().default(false),
  baseDn: z
    .string()
    .min(1, "Base DN vacibdir")
    .trim(),
  username: z
    .string()
    .min(1, "İstifadəçi adı vacibdir")
    .trim(),
  password: z
    .string()
    .min(1, "Şifrə vacibdir"),
  searchFilter: z
    .string()
    .min(1, "LDAP vacibdir")
    .trim(),
  timeout: z
    .string()
    .min(1, "Timeout  vacibdir")
    .refine((val) => /^-?\d+$/.test(val), "Timeout yalnız rəqəm olmalıdır")
    .refine((val) => !val.startsWith("-"), "Timeout mənfi ola bilməz")
    .transform((val) => {
      const parsed = parseInt(val, 10);
      return isNaN(parsed) ? 0 : parsed;
    })
    .refine((val) => val >= 0 && val <= 20, "Timeout 0 ilə 20 arasında olmalıdır"),
  isActive: z.boolean().default(true),
});

export type CreateLdapDirectoryFormInput = z.input<typeof createLdapDirectoryFormSchema>;
export type CreateLdapDirectoryFormValues = z.infer<typeof createLdapDirectoryFormSchema>;
