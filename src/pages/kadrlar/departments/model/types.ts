import type { Option } from "@/shared/types";

export interface DepartmentNode {
  id: string;
  name: string;
  legalName?: string | null;
  shortName?: string | null;
  type?: string | null;
  activity?: string | null;
  isActive?: boolean;
  voen?: string | null;
  workScheduleCode?: string | null;
  parentDepartmentId?: string | null;
  parentDepartmentName?: string | null;
  sortOrder?: number | null;
  sayi?: number | null;
  createdAt?: string;
  createdBy?: string | null;
  website?: string | null;
  fax?: string | null;
  phone?: string | null;

  children?: DepartmentNode[];
}

export interface DepartmentFormData {
  id?: string;
  fullName: string;
  shortName: string;
  parent: Option | null;
  companyType: Option | null;
  voen: string;
  note: string;
  isActive: boolean;
}