import { z } from "zod";

export const createCityFormSchema = z.object({
  name: z
    .string()
    .min(1, "Adı vacibdir")
    .refine((val) => val.trim().length > 0, {
      message: "Adı boş ola bilməz",
    }),
});

/** Form state / input type (react-hook-form) */
export type CreateCityFormInput = z.input<typeof createCityFormSchema>;
/** Parsed / submit output */
export type CreateCityFormValues = z.infer<typeof createCityFormSchema>;
