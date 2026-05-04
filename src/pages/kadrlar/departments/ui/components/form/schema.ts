import { z } from "zod";
import { HOLDING_TYPE_ID, VOEN_MAX_LENGTH } from "./constants";

export const departmentFormSchema = z
  .object({
    type: z
      .object({
        id: z.string(),
        fullName: z.string(),
        role: z.string(),
      })
      .nullable()
      .refine((val) => val !== null, {
        message: "Tip seçilməlidir",
      }),
    fullName: z
      .string()
      .min(1, "Adı boş ola bilməz")
      .trim(),
    shortName: z
      .string()
      .min(1, "Adı boş ola bilməz")
      .trim(),
    parent: z
      .object({
        id: z.string(),
        fullName: z.string(),
        role: z.string(),
      })
      .nullable(),
    voen: z
      .string()
      .regex(/^[0-9]*$/, "VÖEN yalnız rəqəmlərdən ibarət ola bilər")
      .max(VOEN_MAX_LENGTH, "VÖEN maksimum 10 rəqəmdən ibarət ola bilər")
      .optional()
      .or(z.literal("")),
    note: z.string().optional().or(z.literal("")),
    website: z.string().optional().or(z.literal("")),
    fax: z.string().optional().or(z.literal("")),
    phone: z.string().optional().or(z.literal("")),
    domain: z.string().optional().or(z.literal("")),
    isActive: z.boolean(),
    sortOrder: z.union([z.number().int().min(0, "Sira № mənfi ola bilməz"), z.literal("")]),
  })
  .refine(
    (data) => {
      const isHolding = data.type?.id === HOLDING_TYPE_ID;
      if (!isHolding && !data.parent) {
        return false;
      }
      return true;
    },
    {
      message: "Əsas qurum vacibdir",
      path: ["parent"],
    }
  );

export type DepartmentFormSchema = z.infer<typeof departmentFormSchema>;

export const VALIDATION_MESSAGES = {
  TYPE_REQUIRED: "Tip vacibdir",
  FULL_NAME_REQUIRED: "Adı vacibdir",
  LEGAL_NAME_REQUIRED: "Hüquqi ad vacibdir",
  SHORT_NAME_REQUIRED: "Adı vacibdir",
  PARENT_REQUIRED: "Əsas qurum vacibdir",
  VOEN_ONLY_DIGITS: "VÖEN yalnız rəqəmlərdən ibarət ola bilər",
  VOEN_MAX_LENGTH: "VÖEN maksimum 10 rəqəmdən ibarət ola bilər",
  SORT_ORDER_MIN: "Sira № mənfi ola bilməz",
  WORK_SCHEDULE_REQUIRED: "İş rejimi vacibdir",
} as const;

