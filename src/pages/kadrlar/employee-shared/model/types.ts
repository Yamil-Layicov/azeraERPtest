import type { Option } from "@/shared/types";

export interface NewStateAwardInfoState {
  stateAward: Option | null;
  documentNumber: string;
  documentDate: Date | null;
}

export interface StateAwardInfoItem {
  id: string | number;
  stateAward: Option | null;
  documentNumber: string;
  documentDate: Date | null;
  employeeId?: string | number;
}

export interface EmployeeFormData {
  firstName: string;
  birthDate: Date | null;
  lastName: string;
  gender: Option | null;
  fatherName: string;
  fin: string;
  username: string;
  isActive: boolean;
  group: Option[];
  password?: string;
  company: Option | null;
  position: Option | null;
  experienceType: Option | null;
  isLeader: boolean;
}

export type TabKey = "info" | "security" | "staff";

export interface Contact {
  id: string | number;
  type: Option | null;
  value: string;
  isPrimary: boolean;
  originalApiId?: string;
}

export interface NewContactState {
  type: Option | null;
  value: string;
  isPrimary: boolean;
}

export interface SocialMediaItem {
  id: string | number;
  type: Option | null;
  value: string;
}

export interface NewSocialMediaState {
  type: Option | null;
  value: string;
}

export interface ProgramUserItem {
  id: string | number;
  type: Option | null;
  value: string;
}

export interface NewProgramUserState {
  type: Option | null;
  value: string;
}

export interface IncentiveItem {
  id: string | number;
  organ?: Option | null;
  adi: Option | null;
  nov?: Option | null;
  verilmeTarixi: Date | null;
  sebebi: string;
  emrNomresi: string;
  employeeId?: string | number;
}

export interface NewIncentiveState {
  organ?: Option | null;
  adi: Option | null;
  nov?: Option | null;
  verilmeTarixi: Date | null;
  sebebi: string;
  emrNomresi: string;
}

export interface DisciplinaryWarningItem {
  id: string | number;
  adi: Option | null;
  verilmeTarixi: Date | null;
  sebebi: string;
  emrNomresi: string;
  employeeId?: string | number;
}

export interface NewDisciplinaryWarningState {
  adi: Option | null;
  verilmeTarixi: Date | null;
  sebebi: string;
  emrNomresi: string;
}

export interface EmployeeDocument {
  id: number;
  type: Option | null;
  series: string;
  number: string;
  issueDate: Date | null;
  expiryDate: Date | null;
  issuer?: string;
  originalApiId?: string;
}

export interface NewDocumentState {
  type: Option | null;
  series: string;
  number: string;
  issueDate: Date | null;
  expiryDate: Date | null;
}
