import type { FormValues } from "./types";

export const DEFAULT_FORM_VALUES: FormValues = {
  type: null,
  fullName: "",
  legalName: "",
  parent: null,
  workSchedule: null,
  voen: "",
  note: "",
  website: "",
  fax: "",
  phone: "",

  isActive: true,
  sortOrder: 0,
  sayi: "",
  createdAt: undefined,
  createdBy: undefined,
};

export const HOLDING_TYPE_ID = "Holding";
export const COMPANY_TYPE_ID = "Company";
export const VOEN_MAX_LENGTH = 10;
export const VOEN_REGEX = /^[0-9]*$/;


