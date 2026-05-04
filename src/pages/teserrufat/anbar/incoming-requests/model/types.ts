export type IncomingRequestStatus = "pending" | "active" | "closed";

export interface IncomingProduct {
  id: string;
  name: string;
  requestedQty: number;
  inStockQty: number;
  fulfilledQty: number;
}

export interface IncomingRequest {
  id: string;
  prNo: string;
  requester: string;
  department: string;
  description: string;
  approvedDate: string;
  totalAmount: number;
  products: IncomingProduct[];
  status: IncomingRequestStatus;
  note?: string;
}
