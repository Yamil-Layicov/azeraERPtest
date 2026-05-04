import { z } from "zod";
import type { Option } from "@/shared/types";

export type PermissionFormValues = {
  timeOffType: Option | null;
  timeOffReason: Option | null;
  issueDate: Date | null;
  startTime: string | null;
  endTime: string | null;
  approvedBy: string;
  note: string;
};

const addIssue = (ctx: z.RefinementCtx, path: (string | number)[], message: string) => {
  ctx.addIssue({ code: z.ZodIssueCode.custom, message, path });
};

const TIME_RE = /^(\d{2}):(\d{2})$/;
const parseHm = (s: string): number | null => {
  const m = TIME_RE.exec(s);
  if (!m) return null;
  const h = Number(m[1]);
  const mi = Number(m[2]);
  if (h < 0 || h > 23 || mi < 0 || mi > 59) return null;
  return h * 60 + mi;
};

export const permissionFormSchema = z
  .object({
    timeOffType: z.custom<Option | null>().nullable(),
    timeOffReason: z.custom<Option | null>().nullable(),
    issueDate: z.date().nullable(),
    startTime: z.string().nullable(),
    endTime: z.string().nullable(),
    approvedBy: z.string(),
    // Qeyd sahəsi vacib deyil (amma tip həmişə string qalır)
    note: z.string(),
  })
  .superRefine((data, ctx) => {
    const vt = data.timeOffType;
    if (!vt?.id) {
      addIssue(ctx, ["timeOffType"], "Növü vacibdir");
    }
    const vr = data.timeOffReason;
    if (!vr?.id) {
      addIssue(ctx, ["timeOffReason"], "Səbəb vacibdir");
    }
    if (!data.issueDate) {
      addIssue(ctx, ["issueDate"], "İcazə verilən tarix vacibdir");
    }
    const st = data.startTime;
    if (!st || !String(st).trim()) {
      addIssue(ctx, ["startTime"], "Başlama saatı vacibdir");
    } else if (parseHm(st) === null) {
      addIssue(ctx, ["startTime"], "Başlama saatı düzgün daxil edilməyib");
    }
    const et = data.endTime;
    if (!et || !String(et).trim()) {
      addIssue(ctx, ["endTime"], "Bitmə saatı vacibdir");
    } else if (parseHm(et) === null) {
      addIssue(ctx, ["endTime"], "Bitmə saatı düzgün daxil edilməyib");
    }

    if (!data.approvedBy.trim()) {
      addIssue(ctx, ["approvedBy"], "İcazəni təsdiq edən rəhbər vacibdir");
    }

    const a = st ? parseHm(st) : null;
    const b = et ? parseHm(et) : null;
    if (a != null && b != null && b <= a) {
      addIssue(ctx, ["endTime"], "Bitmə saatı başlama saatından sonra olmalıdır");
    }
  });

export const defaultPermissionFormValues: PermissionFormValues = {
  timeOffType: null,
  timeOffReason: null,
  issueDate: null,
  startTime: null,
  endTime: null,
  approvedBy: "",
  note: "",
};
