export interface PendingApprovalEntry {
  id: string;
  operationType: string;
  date: string;
  isToday?: boolean;
  isFuture?: boolean;
  source: string;
  amount: number;
  currency: string;
  destination: string;
}
