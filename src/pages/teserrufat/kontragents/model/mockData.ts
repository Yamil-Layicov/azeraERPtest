import type { KontragentFormData } from "../../add-kontragents/model/useAddKontragentsPage";

export const MOCK_KONTRAGENTS: Partial<KontragentFormData>[] = [
  {
    type: "legal",
    legalName: "Azera Soft MMC",
    shortName: "Azera",
    voen: "1234567891",
    status: { id: "active", label: "Aktiv" },
    phone: "+994 50 123 45 67",
    email: "info@azera.az",
  },
  {
    type: "physical",
    firstName: "Əli",
    lastName: "Məmmədov",
    fatherName: "Vəli",
    finCode: "7ABC123",
    status: { id: "active", label: "Aktiv" },
    phone: "+994 55 987 65 43",
    email: "ali.m@mail.com",
  },
  {
    type: "legal",
    legalName: "Tech Solutions ASC",
    shortName: "TechSol",
    voen: "9876543210",
    status: { id: "passive", label: "Passiv" },
    phone: "+994 12 444 33 22",
    email: "contact@techsol.az",
  },
  {
    type: "physical",
    firstName: "Günay",
    lastName: "Həsənova",
    fatherName: "Rasim",
    finCode: "5XYZ789",
    status: { id: "active", label: "Aktiv" },
    phone: "+994 70 555 44 33",
    email: "gunay.h@gmail.com",
  },
];
