import type { Option } from "@/shared/types";

export const GENDER_OPTIONS: Option[] = [
  { id: "male", fullName: "Kişi", role: "" },
  { id: "female", fullName: "Qadın", role: "" },
];

export const CONTACT_TYPE_OPTIONS: Option[] = [
  { id: "email", fullName: "E-poçt", role: "" },
  { id: "phone", fullName: "Mobil nömrə", role: "" },
  { id: "home", fullName: "Ev telefonu", role: "" },
  { id: "address", fullName: "Ünvan", role: "" },
];

export const DOCUMENT_TYPE_OPTIONS: Option[] = [
  { id: "id_card", fullName: "Şəxsiyyət vəsiqəsi", role: "" },
  { id: "passport", fullName: "Xarici pasport", role: "" },
  { id: "driver_license", fullName: "Sürücülük vəsiqəsi", role: "" },
];

