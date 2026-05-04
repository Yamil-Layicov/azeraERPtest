import { useState } from "react";
import type { Option } from "@/shared/types";

export type KontragentType = "legal" | "physical";

export interface KontragentFormData {
  type: KontragentType;
  legalName: string;
  shortName: string;
  legalForm: Option | null;
  status: Option | null;
  voen: string;
  registrationNumber: string;
  taxAuthority: string;
  registrationDate: Date | null;
  country: Option | null;
  city: Option | null;
  legalAddress: string;
  actualAddress: string;
  postalCode: string;
  phone: string;
  email: string;
  website: string;
  relatedPersonName: string;
  relatedPersonSurname: string;
  relatedPersonPosition: string;
  relatedPersonPhone: string;
  relatedPersonEmail: string;
  bankName: string;
  iban: string;
  swift: string;
  currency: Option | null;
  isMainAccount: boolean;
  isCustomer: boolean;
  isSupplier: boolean;
  isVatPayer: boolean;
  vatRate: string;
  tags: string;
  note: string;
  firstName: string;
  lastName: string;
  fatherName: string;
  finCode: string;
  idSeries: string;
  birthDate: Date | null;
  gender: Option | null;
  address: string;
}

const getInitialFormData = (): KontragentFormData => ({
  type: "physical",
  legalName: "",
  shortName: "",
  legalForm: null,
  status: { id: "active", label: "Aktiv" },
  voen: "",
  registrationNumber: "",
  taxAuthority: "",
  registrationDate: null,
  country: null,
  city: null,
  legalAddress: "",
  actualAddress: "",
  postalCode: "",
  phone: "",
  email: "",
  website: "",
  relatedPersonName: "",
  relatedPersonSurname: "",
  relatedPersonPosition: "",
  relatedPersonPhone: "",
  relatedPersonEmail: "",
  bankName: "",
  iban: "",
  swift: "",
  currency: null,
  isMainAccount: false,
  isCustomer: false,
  isSupplier: false,
  isVatPayer: false,
  vatRate: "",
  tags: "",
  note: "",
  firstName: "",
  lastName: "",
  fatherName: "",
  finCode: "",
  idSeries: "",
  birthDate: null,
  gender: null,
  address: "",
});

export const useAddKontragentsPage = () => {
  const [formData, setFormData] = useState<KontragentFormData>(getInitialFormData());

  const updateField = <K extends keyof KontragentFormData>(
    field: K,
    value: KontragentFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTypeChange = (value: string) => {
    updateField("type", value as KontragentType);
  };

  const handleClear = () => {
    setFormData(getInitialFormData());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return {
    formData,
    updateField,
    handleTypeChange,
    handleSubmit,
    handleClear,
  };
};
