
export interface CreateEmployeeRequest {
  rootCompanyId?: string | null;
  pinChecked: boolean;
  name: string | null;
  surname: string | null;
  patronymic: string | null;
  gender: string | null;
  birthDate: string | null;
  pin: string | null;
  contacts?: CreateEmployeeContact[];
  documents?: CreateEmployeeDocument[];
}

export interface CreateEmployeeContact {
  id?: string | null;
  type: string | null;
  value: string | null;
  isMain: boolean;
  isCreate: boolean;
  isDeleted: boolean;
}

export interface CreateEmployeeDocument {
  id?: string | null;
  type: string | null;
  series: string | null;
  number: string | null;
  issuedAt: string | null;
  expireAt: string | null;
  issuer?: string | null;
  isCreate: boolean;
  isDeleted: boolean;
}

export interface UpdateEmployeeRequest extends Partial<CreateEmployeeRequest> {}


export interface CreateEmployeeResponse {
  id: string;
  firstName: string;
  lastName: string;
  fatherName: string;
  birthDate: string;
  gender: "Kişi" | "Qadın";
  createdAt: string;
}
