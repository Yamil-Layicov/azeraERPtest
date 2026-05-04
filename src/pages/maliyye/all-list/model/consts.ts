import type { StatusVariant } from "@/shared/ui/status-badge/StatusBadge";
import type { Transaction } from "./types";

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 1,
    type: "Mədaxil",
    source: "Kassa - 01",
    amount: "1500.00 AZN",
    amountType: "down",
    person: "Elvin Həsənov",
    status: "Gözləyir",
    statusType: "pending",
    createdBy: "Nəzir Əliyev",
    createdAt: "2025-10-28 09:15",
  },
  {
    id: 2,
    type: "Məxaric",
    source: "Bank - 02",
    amount: "50.00 USD",
    amountType: "up",
    person: "Ayşə Quliyeva",
    status: "Təsdiq edildi",
    statusType: "approved",
    createdBy: "Şəhlə Məmmədova",
    createdAt: "2025-10-27 10:30",
  },
  {
    id: 3,
    type: "Mədaxil",
    source: "POS - 01",
    amount: "320.50 AZN",
    amountType: "down",
    person: "Coşqun Rzazadə",
    status: "Rədd edildi",
    statusType: "rejected",
    createdBy: "Ruslan Həsənov",
    createdAt: "2025-10-26 11:45",
  },
  {
    id: 4,
    type: "Mədaxil",
    source: "POS - 01",
    amount: "320.50 AZN",
    amountType: "down",
    person: "Rəşad Məmmədov",
    status: "Ləğv edildi",
    statusType: "cancelled",
    createdBy: "Günelə Quliyeva",
    createdAt: "2025-10-26 13:20",
  },
  {
    id: 5,
    type: "Məxaric",
    source: "POS - 01",
    amount: "320.50 AZN",
    amountType: "up",
    person: "Həsan Əliyev",
    status: "Geri qaytarılma",
    statusType: "returned",
    createdBy: "Elvin Bayramov",
    createdAt: "2025-10-26 14:35",
  },
  {
    id: 6,
    type: "Məxaric",
    source: "POS - 01",
    amount: "320.50 AZN",
    amountType: "up",
    person: "Ali Abdullayev",
    status: "Gözləyir",
    statusType: "pending",
    createdBy: "Aysu Həsənova",
    createdAt: "2025-10-26 15:50",
  },
  {
    id: 7,
    type: "Mədaxil",
    source: "POS - 01",
    amount: "320.50 AZN",
    amountType: "down",
    person: "Cavid Balayev",
    status: "Təsdiq edildi",
    statusType: "approved",
    createdBy: "Cavid Məlikov",
    createdAt: "2025-10-26 16:10",
  },
  {
    id: 8,
    type: "Məxaric",
    source: "Kassa - 02",
    amount: "150.00 AZN",
    amountType: "up",
    person: "Leyla Məmmədova",
    status: "Rədd edildi",
    statusType: "rejected",
    createdBy: "Ləman Rzayeva",
    createdAt: "2025-10-25 08:25",
  },
  {
    id: 9,
    type: "Mədaxil",
    source: "Bank - 03",
    amount: "2000.00 USD",
    amountType: "down",
    person: "Nigar Əliyeva",
    status: "Ləğv edildi",
    statusType: "cancelled",
    createdBy: "Tural Qurbanov",
    createdAt: "2025-10-24 12:40",
  },
  {
    id: 10,
    type: "Məxaric",
    source: "POS - 02",
    amount: "75.25 AZN",
    amountType: "up",
    person: "Rəşad Həsənov",
    status: "Geri qaytarılma",
    statusType: "returned",
    createdBy: "Aynur Məmmədova",
    createdAt: "2025-10-23 17:15",
  },
];

export const getStatusVariant = (statusType: string): StatusVariant => {
  switch (statusType) {
    case "approved": return "success";
    case "pending": return "warning";
    case "created": return "info";
    case "treasurer_approved": return "purple";
    case "rejected": 
    case "cancelled": return "danger";
    case "returned": return "orange";
    default: return "neutral";
  }
};