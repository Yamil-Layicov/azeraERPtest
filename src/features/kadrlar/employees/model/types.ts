
export interface GetEmployeesRequest {
  pageSize: number;
  pageIndex: number;
  isDesc: boolean;
  orderBy: string | null;
  rootCompanyId: string | null;
  subCompanyId?: string | null;
  employeeStatus?: string | null;
  appointmentDate?: string | null;
  name: string | null;
  surname: string | null;
  fullname?: string | null;
  patronymic: string | null;
  gender: string | null;
  birthDate: string | null;
  pin: string | null;
  corporateEmail?: string | null;
  employmentTypeCode?: string | null;
  birthCountryCode?: string | null;
  birthCityId?: number | null;
  foreignBirthCity?: string | null;
  citizenshipCode?: string | null;
  maritalStatus?: string | null;
  contactType?: string | null;
  phoneNumber?: string | null;
  socialAccountType?: string | null;
  socialAccount?: string | null;
  positionId?: string | null;
  username: string | null;
  fonetId?: string | null;
  referrerName?: string | null;
  staffCategoryCode?: string | null;
  includeAddress?: boolean;
  includeContact?: boolean;
  includeSocialAccount?: boolean;
  includeSkill?: boolean;
  includeExternalAccount?: boolean;

}

export interface CreateEmployeeRequest {
  fullName: string; 
  email?: string;
  phone?: string;
  positionId: string;
  departmentId: string;
  isActive: boolean;
  firstName?: string;
  lastName?: string;
  fatherName?: string;
  birthDate?: string | null;
  gender?: string | null;
  fin?: string;
  username?: string;
}

export interface UpdateEmployeeContact {
  id: string | null; // Yeni əlavə (isCreate: true) üçün null; backend id yaradır
  type: string | null;
  value: string | null;
  isMain: boolean;
  isCreate: boolean;
  isDeleted: boolean;
}

export interface UpdateEmployeeDocument {
  id: string | null; // Yeni əlavə (isCreate: true) üçün null; backend id yaradır
  type: string | null;
  series: string | null;
  number: string | null;
  issuedAt: string | null;
  expireAt: string | null;
  issuer: string | null;
  isCreate: boolean;
  isDeleted: boolean;
}

export interface UpdateEmployeeRequest {
  id: string;
  rootCompanyId?: string;
  name: string;
  surname: string;
  patronymic?: string | null;
  gender: string | null;
  birthDate?: string | null;
  contacts: UpdateEmployeeContact[];
  documents: UpdateEmployeeDocument[];
}


export interface EmployeeEntry {
  id: string;
  name: string;
  surname: string;
  patronymic: string | null;
  birthDate: string;
  gender: string;
  maritalStatus: string;
  pin: string;
  isForeignCitizen: boolean;
  citizenshipCode: string | null;
  birthCountryCode: string | null;
  birthCityId: number | null;
  foreignBirthCity: string | null;
  photoId: string | null;
  username: string | null;
  rootCompanyId?: string | null;
  createdAt: string;
  status: string | null;
  createdBy: string | null;
  address: {
    id: string;
    actualCityId: number | null;
    actualAddress: string;
    isRegistrationSameAsActual: boolean;
    registrationCountryCode: string | null;
    registrationCityId: number | null;
    registrationForeignCity: string | null;
    registrationAddress: string | null;
  } | null;
  documents: {
    id: string;
    type: string;
    series: string | null;
    number: string | null;
    issuedAt: string | null;
    expireAt: string | null;
    issuer: string | null;
    createdAt: string;
  }[];
  contacts?: any[];
  socialAccounts?: any[];
  skills?: any[];
  externalAccounts?: any[];
  employees: any[];
  isPrimary?: boolean;
  employmentTypeCode?: string | null;
}


export interface EmployeesResult {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  data: EmployeeEntry[];
}

export interface GetEmployeesResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result: EmployeesResult;
}

export interface GetEmployeeByIdResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result: EmployeeEntry;
}

export interface UpdateEmployeeResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
}