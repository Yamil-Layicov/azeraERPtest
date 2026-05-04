export type ReviewStatus = "pending" | "approved" | "rejected";

export interface ReviewProduct {
  id: string;
  name: string;
  requestedQty: number;
}

export interface ReviewRequest {
  id: string;
  prNo: string;
  requester: string;
  department: string;
  description: string;
  rejectedDate: string;
  products: ReviewProduct[];
  status: ReviewStatus;
  rejectedFrom: string;
  note?: string;
}
