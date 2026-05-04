import type { Option } from "@/shared/types";

export type AnbarChangeStatus = "Draft" | "Completed";

export interface AnbarChangeGeneralInfo {
  company: Option | null;
  anbar: Option | null;
  responsiblePerson: Option | null;
  responsiblePersonName: string;
  reason: Option | null;
  status: AnbarChangeStatus;
  note: string;
}

export interface AnbarChangeItem {
  id: string;
  nomenklatura: Option | null;
  systemQuantity: number;
  actualQuantity: number;
  difference: number;
}

export const REASON_OPTIONS: Option[] = [
  { id: "1", label: "İnventar fərqi" },
  { id: "2", label: "İtki" },
  { id: "3", label: "Xarab olma" },
  { id: "4", label: "Daşınma zamanı zədələnmə"},
];
