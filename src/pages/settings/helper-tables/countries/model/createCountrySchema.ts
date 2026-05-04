import { z } from "zod";

const lettersOnlyRegex = /^[\p{L}\s]*$/u;
const currencyCodeRegex = /^[A-Za-z]{0,3}$/;

export const createCountryFormSchema = z.object({
  name: z
    .string()
    .min(1, "Ölkə adı vacibdir")
    .refine((val) => lettersOnlyRegex.test(val.trim()), {
      message: "Ölkə adı yalnız hərflərdən ibarət ola bilər",
    }),
  code: z
    .string()
    .min(1, "Kod vacibdir")
    .transform((val) => val.trim().toUpperCase())
    .refine((val) => val.length === 3, "Kod 3 hərfdən ibarət olmalıdır")
    .refine((val) => /^[A-Z]{3}$/.test(val), "Kod yalnız hərf olmalıdır (3 böyük hərf)"),
  sortOrder: z
    .union([
      z.number().int("Sıra nömrəsi yalnız rəqəm ola bilər").min(0, "Sıra nömrəsi mənfi ola bilməz"),
      z.nan(),
    ])
    .transform((n) => (typeof n === "number" && !Number.isNaN(n) ? n : null)),
  nativeName: z
    .string()
    .refine((val) => !val || lettersOnlyRegex.test(val.trim()), {
      message: "Yerli ad yalnız hərflərdən ibarət ola bilər",
    })
    .transform((val) => (val?.trim() || null)),
  phoneCode: z
    .string()
    .transform((val) => (val?.trim() || null)),
  currencyCode: z
    .string()
    .refine((val) => !val || currencyCodeRegex.test(val.trim()), {
      message: "Valyuta yalnız 3 hərfdən ibarət ola bilər, rəqəm və simvol olmamalıdır",
    })
    .transform((val) => (val?.trim() ? val.trim().toUpperCase() : null)),
});

export type CreateCountryFormInput = z.input<typeof createCountryFormSchema>;
export type CreateCountryFormValues = z.infer<typeof createCountryFormSchema>;
