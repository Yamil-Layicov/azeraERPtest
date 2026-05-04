import { z } from "zod";
import type { Option } from "@/shared/types";

const optionRef = z.custom<Option | null>().refine((v) => v != null, {
  message: "Seçim vacibdir",
});

export function isEmailContactType(opt: Option | null): boolean {
  if (!opt) return false;
  const id = String(opt.id).toLowerCase();
  const fn = (opt.fullName ?? "").toLowerCase();
  return fn === "e-poçt" || fn === "e-poct" || id === "email";
}

export function isMobileContactType(opt: Option | null): boolean {
  if (!opt) return false;
  const id = String(opt.id).toLowerCase();
  const fn = (opt.fullName ?? "").toLowerCase();
  return fn.includes("mobil") || id === "mobile" || id === "mobil" || id === "phone";
}

export function isMobileContactTypeId(typeId: string | null | undefined): boolean {
  if (!typeId) return false;
  const s = String(typeId).toLowerCase();
  return s === "mobile" || s === "mobil" || s === "phone";
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const emailContactValueSchema = z
  .string()
  .min(1, "E-poçt daxil edilməlidir")
  .refine((val) => EMAIL_REGEX.test(val.trim()), {
    message: "Düzgün E-poçt formatı daxil edin",
  });

export function normalizeMobileValue(raw: string | null | undefined): string | null {
  const s = (raw ?? "").trim();
  if (!s) return null;
  const digits = s.replace(/\D/g, "");
  let nine: string;
  if (digits.length === 12 && digits.startsWith("994")) nine = digits.slice(3, 12);
  else if (digits.length === 10 && digits.startsWith("0")) nine = digits.slice(1, 10);
  else if (digits.length === 9) nine = digits;
  else return null;
  if (nine.length !== 9 || !/^\d{9}$/.test(nine)) return null;
  return "+994" + nine;
}

  export function extractMobileDigits(raw: string | null | undefined): string {
  const s = (raw ?? "").trim();
  if (!s) return "";
  const digits = s.replace(/\D/g, "");
  if (digits.length >= 12 && digits.startsWith("994")) return digits.slice(3, 12);
  if (digits.length >= 10 && digits.startsWith("0")) return digits.slice(1, 10).slice(0, 9);
  if (digits.length >= 9) return digits.slice(0, 9);
  return digits;
}

export const mobileContactValueSchema = z
  .string()
  .min(1, "Mobil nömrə daxil edilməlidir")
  .refine((val) => normalizeMobileValue(val) != null, {
    message: "Mobil nömrə 9 rəqəm olmalıdır",
  });

export const contactItemSchema = z.object({
  type: optionRef,
  value: z.string().min(1, "Məlumat boş buraxıla bilməz"),
  isPrimary: z.boolean(),
});

export const newContactSchema = contactItemSchema;

export const contactsArraySchema = z.array(contactItemSchema);

export type ContactItemFormValues = z.infer<typeof contactItemSchema>;
export type NewContactFormValues = z.infer<typeof newContactSchema>;


const SERIES_LETTERS_ONLY = /^[a-zA-ZəğıöüçşƏĞIÖÜÇŞ\s]*$/;
export const seriesSchema = z
  .string()
  .refine((val) => {
    const s = (val ?? "").trim();
    if (s === "" || s === "-") return true;
    return SERIES_LETTERS_ONLY.test(val);
  }, {
    message: "Seriya yalnız hərflərdən ibarət ola bilər; rəqəm və ya simvol yazıla bilməz",
  });

export const documentItemSchema = z.object({
  type: optionRef,
  series: seriesSchema,
  number: z.string().min(1, "Nömrə vacibdir"),
  issueDate: z.date().nullable(),
  expiryDate: z.date().nullable(),
  issuer: z.string().optional(),
});

export const newDocumentSchema = documentItemSchema;

export const documentsArraySchema = z.array(documentItemSchema);

export type DocumentItemFormValues = z.infer<typeof documentItemSchema>;
export type NewDocumentFormValues = z.infer<typeof newDocumentSchema>;


export const contactsDocumentsFormSchema = z.object({
  contacts: contactsArraySchema,
  documents: documentsArraySchema,
});

export type ContactsDocumentsFormValues = z.infer<
  typeof contactsDocumentsFormSchema
>;
