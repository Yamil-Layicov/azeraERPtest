import type { CRMUser } from "./types";

export const MOCK_CRM_USERS: CRMUser[] = [
  {
    id: "1",
    fullName: "Əli Məmmədov",
    username: "ali.m",
    phone: "+994 50 123 45 67",
    role: "Menecer",
    lastLogin: "2024-03-31 10:45",
    status: "active",
  },
  {
    id: "2",
    fullName: "Leyla Əliyeva",
    username: "leyla.a",
    phone: "+994 70 987 65 43",
    role: "Satış təmsilçisi",
    lastLogin: "2024-03-30 15:20",
    status: "active",
  },
  {
    id: "3",
    fullName: "Vüsal Həsənov",
    username: "vusal.h",
    phone: "+994 55 555 55 55",
    role: "Admin",
    lastLogin: "2024-03-31 09:00",
    status: "inactive",
  },
];
