import { z } from "zod";
import type { Option } from "@/shared/types";

export type VacationFormValues = {
  vacationType: Option | null;
  startDate: Date | null;
  endDate: Date | null;
  orderDate: Date | null;
  orderNumber: string;
  rights: string;
  extraRights: string;
  mainDays: string;
  extraDays: string;
};

const addIssue = (ctx: z.RefinementCtx, path: (string | number)[], message: string) => {
  ctx.addIssue({ code: z.ZodIssueCode.custom, message, path });
};

export const vacationFormSchema = z
  .object({
    vacationType: z.custom<Option | null>().nullable(),
    startDate: z.date().nullable(),
    endDate: z.date().nullable(),
    orderDate: z.date().nullable(),
    orderNumber: z.string(),
    rights: z.string(),
    extraRights: z.string(),
    mainDays: z.string(),
    extraDays: z.string(),
  })
  .superRefine((data, ctx) => {
    const vt = data.vacationType;
    const isAnnual = vt?.id === "AnnualLeave";

    if (!vt?.id) {
      addIssue(ctx, ["vacationType"], "Məzuniyyət növü vacibdir");
    }
    if (!data.startDate) {
      addIssue(ctx, ["startDate"], "Başlama tarixi vacibdir");
    }
    if (!data.endDate) {
      addIssue(ctx, ["endDate"], "Bitmə tarixi vacibdir");
    }
    if (!data.orderDate) {
      addIssue(ctx, ["orderDate"], "Əmr tarixi vacibdir");
    }
    if (!data.orderNumber.trim()) {
      addIssue(ctx, ["orderNumber"], "Əmr nömrəsi vacibdir");
    }

    if (!isAnnual) return;

    const r = String(data.rights).trim();
    if (!r) {
      addIssue(ctx, ["rights"], " Hüququ(Gün) / Əsas vacibdir");
    } else {
      const eb = Number.parseFloat(r.replace(",", "."));
      if (Number.isNaN(eb)) {
        addIssue(ctx, ["rights"], "Əmək məzuniyyəti Hüququ(Gün) / Əsas düzgün daxil edilməyib");
      }
    }

    if (!String(data.extraRights).trim()) {
      addIssue(ctx, ["extraRights"], "Əmək məzuniyyəti Hüququ(Gün) / Əlavə vacibdir");
    }

    const md = String(data.mainDays).trim();
    if (!md) {
      addIssue(ctx, ["mainDays"], "İstifadə olunan əsas günlər vacibdir");
    } else {
      const ub = Number.parseInt(md, 10);
      if (Number.isNaN(ub)) {
        addIssue(ctx, ["mainDays"], "İstifadə olunan əsas günlər düzgün daxil edilməyib");
      }
    }

    const ed = String(data.extraDays).trim();
    if (!ed) {
      addIssue(ctx, ["extraDays"], "İstifadə olunan əlavə günlər vacibdir");
    } else {
      const ue = Number.parseInt(ed, 10);
      if (Number.isNaN(ue)) {
        addIssue(ctx, ["extraDays"], "İstifadə olunan əlavə günlər düzgün daxil edilməyib");
      }
    }
  });

export const defaultVacationFormValues: VacationFormValues = {
  vacationType: null,
  startDate: null,
  endDate: null,
  orderDate: null,
  orderNumber: "",
  rights: "",
  extraRights: "",
  mainDays: "",
  extraDays: "",
};
