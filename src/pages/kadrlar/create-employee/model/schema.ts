import { z } from "zod";
import type { Option } from "@/shared/types";

export const createEmployeeFormSchema = z.object({
  fin: z.string().min(1, "Boş buraxıla bilməz"),
  company: z.custom<Option | null>().refine((val) => val !== null, {
    message: "Boş buraxıla bilməz",
  }),
  firstName: z.string().min(1, "Boş buraxıla bilməz"),
  lastName: z.string().min(1, "Boş buraxıla bilməz"),
  fatherName: z.string().min(1, "Boş buraxıla bilməz"),
  gender: z.custom<Option | null>().refine((val) => val !== null, {
    message: "Boş buraxıla bilməz",
  }),
});

export type CreateEmployeeFormValues = z.infer<typeof createEmployeeFormSchema>;
