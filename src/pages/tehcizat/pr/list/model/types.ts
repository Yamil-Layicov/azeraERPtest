export type PRStatus = "draft" | "pending" | "approved" | "rejected";

export interface PRProduct {
  id: string;
  name: string;
  quantity: number;
  value: number;
}

export interface PurchaseRequest {
  id: string;
  prNo: string;
  createdDate: string;
  requester: string;
  authorId: string;
  department: string;
  description: string;
  totalAmount: number;
  status: PRStatus;
  category: string;
  costCenter: string;
  products: PRProduct[];
  files: string[];
}
