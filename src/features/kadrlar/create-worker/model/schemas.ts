import { z } from "zod";

/** DocumentTypes lookup `value` / `Code` — şəxsiyyət və ya bu yaşama/qaçqın vəsiqələrindən biri olarsa növbəti addıma keçidə icazə verilir */
export const PRIMARY_IDENTITY_DOCUMENT_TYPE_CODES = [
  "IdCard",
  "PRC",
  "TRC",
  "RefugeeCard",
  // Backward-compatible aliases (if some environments still return old codes)
  "PermanentResidencePermit",
  "TemporaryResidencePermit",
  "RefugeePermit",
] as const;

const primaryDocumentTypeIdSet = new Set(
  PRIMARY_IDENTITY_DOCUMENT_TYPE_CODES.map((c) => c.toLowerCase())
);

const optionSchema = z.object({
  id: z.union([z.string(), z.number()]),
  fullName: z.string().optional(),
  label: z.string().optional(),
  role: z.string().optional(),
  disabled: z.boolean().optional(),
});

const onlyLettersRegex = /^[a-zA-ZİıƏəŞşÇçĞğÖöÜü\s]+$/;
const onlyDigitsRegex = /^\d+$/;

const documentSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  originalId: z.string().nullable().optional(),
  type: optionSchema.nullable(),
  series: z.string().nullable().optional(),
  number: z.string()
    .min(1, "Nömrə vacibdir")
    .regex(onlyDigitsRegex, "Nömrə yalnız rəqəmlərdən ibarət olmalıdır"),
  issueDate: z.date().nullable().optional(),
  expiryDate: z.date().nullable().optional(),
  issuer: z.string().nullable().optional(),
});

const contactSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  originalId: z.string().nullable().optional(),
  type: optionSchema.nullable(),
  value: z.string(),
  isPrimary: z.boolean().optional(),
});

const socialMediaSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  originalId: z.string().nullable().optional(),
  type: optionSchema.nullable(),
  value: z.string(),
});

const programUserSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  originalId: z.string().nullable().optional(),
  type: optionSchema.nullable(),
  value: z.string(),
});

export const personalInfoSchema = z.object({
  fin: z.string()
    .min(5, "FİN minimum 5 simvoldan ibarət olmalıdır")
    .max(7, "FİN maksimum 7 simvoldan ibarət ola bilər")
    .regex(/^[a-zA-Z0-9]+$/, "FİN yalnız rəqəm ve hərflərdən ibarət olmalıdır"),
    
  sirket: optionSchema.nullable().refine((val) => val !== null, "Şirkət vacibdir"),
  resmilesmeFormasi: optionSchema.nullable().refine((val) => val !== null, "Rəsmiləşmə vacibdir"),
  vetendasliq: optionSchema.nullable().refine((val) => val !== null, "Vətəndaşlıq vacibdir"),
  
  ad: z.string()
    .min(1, "Ad vacibdir")
    .regex(onlyLettersRegex, "Ad yalnız hərflərdən ibarət olmalıdır"),
    
  soyad: z.string()
    .min(1, "Soyad vacibdir")
    .regex(onlyLettersRegex, "Soyad yalnız hərflərdən ibarət olmalıdır"),
    
  ataAdi: z.string()
    .min(1, "Ata adı vacibdir")
    .regex(onlyLettersRegex, "Ata adı yalnız hərflərdən ibarət olmalıdır"),
    
  dogumTarixi: z.date({
    required_error: "Doğum tarixi vacibdir",
    invalid_type_error: "Düzgün tarih daxil edin"
  }).nullable().refine((val) => val !== null, "Doğum tarixi vacibdir"),
  
  dogumOlkesi: optionSchema.nullable().refine((val) => val !== null, "Doğulduğu ölkə vacibdir"),
  cinsi: optionSchema.nullable().refine((val) => val !== null, "Cins vacibdir"),
  dogumSeheri: z.string().nullable().optional(), 
  aileVeziyyeti: optionSchema.nullable().refine((val) => val !== null, "Ailə vəziyyəti vacibdir"),
  
  tovsiyeEden: z.string()
    .min(1, "Tövsiyyə edən vacibdir")
    .regex(onlyLettersRegex, "Tövsiyyə edən yalnız hərflərdən ibarət olmalıdır"),
  
  avatar: z.any().refine((file) => !!file, "Şəkil vacibdir"),

  faktikiSeher: z.string().min(1, "Şəhər qeyd vacibdir"),
  faktikiUnvan: z.string().min(1, "Ünvan qeyd vacibdir"),
  qeydiyyatEynidir: z.boolean(),
  qeydiyyatOlke: optionSchema.nullable().optional(), 
  qeydiyyatSeher: z.string().optional(),
  qeydiyyatUnvan: z.string().optional(),

  documents: z.array(documentSchema),
  contacts: z.array(contactSchema).optional(),
  socialMedia: z.array(socialMediaSchema).optional(),
  programUsers: z.array(programUserSchema).optional(),
  pinChecked: z.boolean(),
}).superRefine((data, ctx) => {
  if (data.dogumOlkesi && !data.dogumSeheri?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Doğulduğu şəhər/rayon vacibdir",
      path: ["dogumSeheri"],
    });
  }

  if (!data.qeydiyyatEynidir) {
    if (!data.qeydiyyatOlke) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Qeydiyyatda olduğu ölkə vacibdir",
        path: ["qeydiyyatOlke"],
      });
    }
    if (!data.qeydiyyatSeher?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Qeydiyyatda olduğu şəhər qeyd vacibdir",
        path: ["qeydiyyatSeher"],
      });
    }
  }

  const hasRequiredIdentityDocument = (data.documents || []).some((doc) => {
    const id = String(doc?.type?.id ?? "").trim().toLowerCase();
    return primaryDocumentTypeIdSet.has(id);
  });

  if (!hasRequiredIdentityDocument) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message:
        "Şəxsiyyət vəsiqəsi, daimi və ya müvəqqəti yaşama vəsiqəsi və ya qaçqın vəsiqəsindən biri vacibdir",
      path: ["documents"],
    });
  }
});

export type PersonalInfoValues = z.output<typeof personalInfoSchema>;
export type PersonalInfoFormValues = z.input<typeof personalInfoSchema>;

export const staffInfoSchema = z.object({
  departament: optionSchema.nullable().refine((val) => val !== null, "Departament / Şöbə / Bölmə vacibdir"),
  vezife: optionSchema.nullable().refine((val) => val !== null, "Vəzifə vacibdir"),
  stajNovu: optionSchema.nullable().refine((val) => val !== null, "Staj növü vacibdir"),
  teyinatTarixi: z.date({
    required_error: "Təyinat tarixi vacibdir",
    invalid_type_error: "Düzgün tarix daxil edin"
  }).nullable().refine((val) => val !== null, "Təyinat tarixi vacibdir"),
  teyinatEmrNomresi: z.string().optional(),
});

export type StaffInfoValues = z.output<typeof staffInfoSchema>;
export type StaffInfoFormValues = z.input<typeof staffInfoSchema>;

export const workExperienceSchema = z.object({
  experienceType: optionSchema.nullable().refine((val) => val !== null, "Staj növü vacibdir"),
  workplace: z.union([z.string(), optionSchema])
    .nullable()
    .refine((val) => val !== null && val !== "", "İş yeri vacibdir"),
  position: z.union([z.string(), optionSchema])
    .nullable()
    .refine((val) => val !== null && val !== "", "Vəzifəsi vacibdir"),
  appointmentDate: z.date({
    required_error: "Təyinat tarixi vacibdir",
    invalid_type_error: "Düzgün tarix daxil edin"
  }).nullable().refine((val) => val !== null, "Təyinat tarixi vacibdir"),
  appointmentOrderNumber: z.string().nullable().default(""),
  azadOlChecked: z.boolean().default(false),
  releaseDate: z.date().nullable().default(null),
  releaseOrderNumber: z.string().nullable().default(""),
  releaseLegalBasis: optionSchema.nullable().default(null),
  resignationReason: z.string().nullable().default(""),
}).superRefine((data, ctx) => {
  if (!data.azadOlChecked) {
    if (!data.releaseDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Azad olma tarixi vacibdir",
        path: ["releaseDate"],
      });
    }
    if (!data.releaseLegalBasis) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Hüquqi əsas vacibdir",
        path: ["releaseLegalBasis"],
      });
    }
  }
});

export type WorkExperienceValues = z.output<typeof workExperienceSchema>;
export type WorkExperienceFormValues = z.input<typeof workExperienceSchema>;
