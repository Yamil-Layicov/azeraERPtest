import type { Option } from "@/shared/types";

export type AnbarTransferStatus = "Draft" | "Completed";

export interface AnbarTransferGeneralInfo {
  operationDate: string;
  documentNumber: string;
  senderWarehouse: Option | null;
  receiverWarehouse: Option | null;
  company: Option | null;
  responsiblePerson: Option | null;
  status: AnbarTransferStatus;
  note: string;
}

export interface AnbarTransferItem {
  id: string;
  nomenklatura: Option | null;
  systemQuantity: number;
  transferQuantity: number;
  price: number;
  amount: number;
}
