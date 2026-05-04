export interface Transaction {
  [x: string]: any;
  id: number;
  type: string;
  source: string;
  amount: string;
  amountType: "up" | "down";
  person: string;
  status: string;
  statusType:
    | "approved"
    | "pending"
    | "rejected"
    | "cancelled"
    | "returned"
    | "created"
    | "treasurer_approved";
  createdBy: string;
  createdAt: string;
  personName?: string;
  company?: string;
  rate?: string;
  currency?: string;
  purpose?: string;
  business?: string;
  counterparty?: string;
  destination?: string;
  notes?: string;
  reference?: string;
  document?: string | string[];
  approvedDate?: string;
  approvedBy?: string;
  treasurerApprovedDate?: string;
  treasurerApprovedBy?: string;
  approveTime?: string;
  treasurerApproveTime?: string;
}
