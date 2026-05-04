export type RFQStatus = "draft" | "published" | "closed";

export interface PendingRFQItem {
  id: string;
  prId: string;
  prNo: string;
  itemName: string;
  requestedQty: number;
  requester: string;
  department: string;
  approvedDate: string;
}

export interface VendorBid {
  id: string;
  vendorId: string;
  vendorName: string;
  status: "unread" | "viewed" | "submitted" | "declined";
  amount?: number;
  currency?: string;
  date?: string;
}

export interface ActiveRFQ {
  id: string;
  rfqNo: string;
  title: string;
  deadline: string;
  vendorCount: number;
  status: RFQStatus;
  deliveryTerms?: string;
  warranty?: string;
  notes?: string;
  vendorBids?: VendorBid[];
}

export interface Vendor {
  id: string;
  name: string;
  contactPerson?: string;
}

export interface RFQFormData {
  lotType: "single" | "combined";
  deadline: string;
  description: string;
  deliveryTerms: string;
  warranty: string;
  vendors: string[]; // Vendor IDs
  notes?: string;
}
