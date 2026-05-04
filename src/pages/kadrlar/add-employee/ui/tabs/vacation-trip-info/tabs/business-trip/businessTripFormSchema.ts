import { z } from "zod";

export type BusinessTripFormValues = {
  destination: string;
  reason: string;
  startDate: Date | null;
  endDate: Date | null;
  orderDate: Date | null;
  orderNumber: string;
};

const addIssue = (ctx: z.RefinementCtx, path: (string | number)[], message: string) => {
  ctx.addIssue({ code: z.ZodIssueCode.custom, message, path });
};

export const businessTripFormSchema = z
  .object({
    destination: z.string(),
    reason: z.string(),
    startDate: z.date().nullable(),
    endDate: z.date().nullable(),
    orderDate: z.date().nullable(),
    orderNumber: z.string(),
  })
  .superRefine((data, ctx) => {
    if (!data.destination.trim()) {
      addIssue(ctx, ["destination"], "Getdiyi yer vacibdir");
    }
    if (!data.reason.trim()) {
      addIssue(ctx, ["reason"], "Səbəb vacibdir");
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

    if (data.startDate && data.endDate) {
      const diff = data.endDate.getTime() - data.startDate.getTime();
      const durationDays = Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
      if (durationDays <= 0) {
        addIssue(ctx, ["endDate"], "Bitmə tarixi başlama tarixindən tez ola bilməz");
      }
    }
  });

export const defaultBusinessTripFormValues: BusinessTripFormValues = {
  destination: "",
  reason: "",
  startDate: null,
  endDate: null,
  orderDate: null,
  orderNumber: "",
};
