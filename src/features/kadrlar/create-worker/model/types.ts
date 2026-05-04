// --- REFRESHED TYPES FOR TAB 2 ---
export interface CreateWorkerAddress {
  actualCityId: number | null; 
  actualAddress: string;
  isRegistrationSameAsActual: boolean;
  registrationCountryCode: string | null;
  registrationCityId: number | null; 
  registrationForeignCity: string | null;
  registrationAddress: string | null;
}

export interface CreateWorkerContact {
  id?: string | null;
  type: string | null;
  value: string | null;
  isCorporate: boolean;
  isCreate: boolean;
  isDeleted: boolean;
}

export interface CreateWorkerDocument {
  id: string | null;
  type: string | null;
  series: string | null;
  number: string | null;
  issuedAt: string | null;
  expireAt: string | null;
  issuer: string | null;
  isCreate: boolean;
  isDeleted: boolean;
}

export interface CreateWorkerSocialAccount {
  id?: string | null;
  type: string | null;
  value: string | null;
  isCreate: boolean;
  isDeleted: boolean;
}

export interface CreateWorkerExternalAccount {
  id?: string | null;
  type: string | null;
  value: string | null;
  isCreate: boolean;
  isDeleted: boolean;
}

export interface CreateWorkerRequest {
  rootCompanyId: string | null;
  referrerName: string | null;
  employmentTypeCode: string | null;
  pinChecked: boolean;
  pin: string | null;
  name: string | null;
  surname: string | null;
  patronymic: string | null;
  gender: string | null;
  maritalStatus: string | null;
  birthDate: string | null;
  citizenshipCode: string | null;
  birthCountryCode: string | null;
  birthCityId: number | null; 
  foreignBirthCity: string | null;
  photoId: string | null;
  address: CreateWorkerAddress;
  documents: CreateWorkerDocument[] | null;
}

export interface CreateWorkerResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result: {
    personId: string;
    employeeId?: string;
  };
}

export interface FileUploadResult {
  attachId: string;
  fileName: string;
  contentType: string;
  status: string;
}

export interface FileUploadResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result: FileUploadResult[];
}

// --- EDUCATION INFO (TAB 2) ---

export interface EducationEntryRequest {
  personId: string;
  id: string | null;
  isModify: boolean;
  educationLevelCode: string;
  institutionNameCode: string;
  specialtyCode: string;
  startYear: number;
  endYear: number | null;
  documentNumber: string | null;
}

export interface AcademicDegreeEntryRequest {
  personId: string;
  degreeCode: string;
  issueDate: string | null;
  diplomaNumber: string | null;
}

export interface SkillEntryRequest {
  personId: string;
  skillCategoryCode: string;
  skillCode: string;
  proficiencyLevelCode: string;
}

// --- SALARY INFO (TAB 3) ---

export interface SalaryCalcEntryRequest {
  personId: string;
  employeeId: string | null;
  rootCompanyId: string | null;
  id: string | null;
  isModify: boolean;
  isSalaryIncrease: boolean;
  salaryIncreaseDate: string | null;
  includeTradeUnionFee: boolean;
  calculationYear: string;
  grossSalary: number;
  cashSalary: number;
  bonus: number;
}

// --- CONTACT INFO (TAB 2 NEW) ---

export interface ContactEntryRequest {
  personId: string;
  type: string;
  value: string;
  isCorporate: boolean;
}

// --- WORK EXPERIENCE INFO (TAB 5) ---

export interface WorkExperienceEntryRequest {
  id: string | null;
  isModify: boolean;
  personId: string;
  employeeId: string | null;
  rootCompanyId: string | null;
  staffingId: string | null;
  experienceTypeCode: string | null;
  workPlace: string | null;
  positionName: string | null;
  appointmentDate: string | null;
  appointmentOrderNumber: string | null;
  isTerminated: boolean;
  terminationDate: string | null;
  terminationOrderNumber: string | null;
  terminationReasonCode: string | null;
  terminationNote: string | null;
}

export interface TerminateWorkExperienceRequest {
  id: string;
  employeeId: string | null;
  terminationDate: string | null;
  terminationOrderNumber: string | null;
  terminationReasonCode: string | null;
  terminationNote: string | null;
}

/** GET personalInfoForm/getWorkExperienceInfoByPersonId/{personId} */
export interface WorkExperienceInfoListItem {
  id: string;
  employeeId?: string | null;
  status?: string | null;
  statusValue?: string | null;
  rootCompanyId?: string | null;
  experienceTypeCode: string;
  workPlace: string;
  positionName: string;
  appointmentDate: string | null;
  appointmentOrderNumber: string | null;
  isTerminated: boolean;
  terminationDate: string | null;
  terminationOrderNumber: string | null;
  terminationReasonCode: string | null;
  terminationNote: string | null;
  /** Optional when row comes from org/staffing pickers */
  organizationUnitId?: string | null;
  staffingId?: string | null;
}

export interface WorkExperienceInfoListResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result: WorkExperienceInfoListItem[];
}

/** GET personalInfoForm/getTrainingsInfoByPersonId/{personId} — nested attachment rows */
export interface TrainingsInfoAttachmentRow {
  attachment?: {
    id?: string;
    fileName?: string | null;
    fileExtension?: string | null;
    fileSize?: number | null;
    contentType?: string | null;
  } | null;
}

/** GET personalInfoForm/getTrainingsInfoByPersonId/{personId} */
export interface TrainingsInfoListItem {
  id: string;
  trainingTypeCode: string;
  courseName: string;
  startDate: string | null;
  endDate: string | null;
  certificateDate: string | null;
  certificateNumber: string | null;
  /** Some responses return flat id list */
  attachments?: string[] | null;
  /** Typical response: nested attachment metadata */
  trainingAttachments?: TrainingsInfoAttachmentRow[] | null;
}

export interface TrainingsInfoListResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result: TrainingsInfoListItem[];
}

/** POST personalInfoForm/addOrEditTrainingInfo */
export interface TrainingEntryRequest {
  personId: string;
  id: string | null;
  isModify: boolean;
  trainingTypeCode: string | null;
  courseName: string | null;
  startDate: string | null;
  endDate: string | null;
  certificateDate: string | null;
  certificateNumber: string | null;
  attachments: string[];
}

/** POST personalInfoForm/addOrEditPerformanceInfo */
export interface PerformanceEntryRequest {
  personId: string;
  id: string | null;
  isModify: boolean;
  year: number;
  rating: number;
  annualBonus: number;
  employeeId: string | null;
  rootCompanyId: string | null;
}

/** POST personalInfoForm/addPersonnelActionInfo */
export interface PersonnelActionEntryRequest {
  personId: string;
  personnelActionTypeCode: string;
  rewardTypeCode: string | null;
  disciplinaryActionTypeCode: string | null;
  issueDate: string | null;
  reason: string | null;
  orderNumber: string | null;
  employeeId: string | null;
  rootCompanyId: string | null;
}

/** POST personalInfoForm/addOrEditMilitaryServiceInfo */
export interface MilitaryServiceEntryRequest {
  personId: string;
  id: string | null;
  isModify: boolean;
  militaryBookNumber: string;
  issueDate: string | null;
  militaryRankCode: string | null;
  militaryStatusCode: string | null;
}

/** POST personalInfoForm/addPersonSpecialRankInfo */
export interface PersonSpecialRankEntryRequest {
  personId: string;
  specialRankId: string;
  issueDate: string;
}

/** GET personalInfoForm/getMilitaryServicesInfoByPersonId/{personId} */
export interface MilitaryServiceInfoListItem {
  id: string;
  militaryBookNumber: string | null;
  issueDate: string | null;
  militaryRankCode: string | null;
  militaryStatusCode: string | null;
}

export interface PersonSpecialRankListItem {
  id: string;
  specialRankId: string;
  organCode: string;
  issueDate: string;
  /** GET cavabında göstərmə üçün xüsusi rütbə adı (məs. "polis general-leytenantı") */
  specialRank?: string | null;
}

export interface MilitaryServiceInfoListResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result: {
    militaryService: MilitaryServiceInfoListItem | null;
    specialRankList: PersonSpecialRankListItem[];
  };
}

/** POST personalInfoForm/addOrEditVacationInfo */
export interface VacationEntryRequest {
  personId: string;
  id: string | null;
  isModify: boolean;
  vacationTypeCode: string;
  workYearDate: string | null;
  startDate: string | null;
  endDate: string | null;
  /** Yalnız AnnualLeave üçün; digər növlərdə `null` */
  entitledBaseDays: number | null;
  usedBaseDays: number | null;
  usedExtraDays: number | null;
  orderNumber: string | null;
  orderDate: string | null;
  employeeId: string | null;
  rootCompanyId: string | null;
}

/** GET personalInfoForm/getVacationsInfoByPersonId/{personId} */
export interface VacationsInfoListItem {
  id: string;
  employeeId?: string | null;
  vacationTypeCode: string;
  startDate: string | null;
  endDate: string | null;
  entitledBaseDays: number;
  usedBaseDays: number;
  usedExtraDays: number;
  orderNumber: string | null;
  orderDate: string | null;
  /** İş ili: GET cavabında əsas sahələr */
  workYearStartDate?: string | null;
  workYearEndDate?: string | null;
  /** @deprecated Köhnə adlar (uyğunluq üçün) */
  workYearStart?: string | null;
  workYearEnd?: string | null;
  /** İşə çıxma tarixi */
  returnToWorkDate?: string | null;
  /** Əmək məzuniyyəti hüququ / əlavə günlər */
  entitledExtraDays?: number | null;
  /** Qalıq (birbaşa backend göndərərsə) */
  remainingBaseDays?: number | null;
  remainingExtraDays?: number | null;
}

export interface VacationsInfoListResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result: VacationsInfoListItem[];
}

/** POST personalInfoForm/addOrEditBusinessTripInfo */
export interface BusinessTripEntryRequest {
  personId: string;
  id: string | null;
  isModify: boolean;
  destination: string;
  reason: string;
  startDate: string;
  endDate: string;
  orderNumber: string;
  orderDate: string;
  employeeId: string | null;
  rootCompanyId: string | null;
}

/** GET personalInfoForm/getBusinessTripsInfoByPersonId/{personId} */
export interface BusinessTripsInfoListItem {
  id: string;
  employeeId?: string | null;
  destination: string;
  reason: string;
  startDate: string | null;
  endDate: string | null;
  /** İşə çıxma tarixi (API cavabında) */
  returnToWorkDate?: string | null;
  orderNumber: string | null;
  orderDate: string | null;
}

export interface BusinessTripsInfoListResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result: BusinessTripsInfoListItem[];
}

/** POST personalInfoForm/addOrEditTimeOffInfo */
export interface TimeOffEntryRequest {
  personId: string;
  id: string | null;
  isModify: boolean;
  timeOffTypeCode: string;
  timeOffReasonCode: string;
  issueDate: string;
  startTime: string;
  endTime: string;
  approvedBy: string;
  note: string;
  employeeId: string | null;
  rootCompanyId: string | null;
}

/** GET personalInfoForm/getTimeOffsInfoByPersonId/{personId} */
export interface TimeOffsInfoListItem {
  id: string;
  employeeId?: string | null;
  timeOffTypeCode?: string | null;
  timeOffReasonCode?: string | null;
  timeOffTypeName?: string | null;
  timeOffReasonName?: string | null;
  issueDate?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  approvedBy?: string | null;
  note?: string | null;
}

export interface TimeOffsInfoListResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result: TimeOffsInfoListItem[];
}

/** POST personalInfoForm/addOrEditIncapacityInfo */
export interface IncapacityEntryRequest {
  personId: string;
  id: string | null;
  isModify: boolean;
  documentNumber: string;
  medicalInstitution: string;
  diagnosis: string;
  startDate: string;
  endDate: string;
  employeeId: string | null;
  rootCompanyId: string | null;
}

/** GET personalInfoForm/getIncapacitiesInfoByPersonId/{personId} */
export interface IncapacitiesInfoListItem {
  id: string;
  employeeId?: string | null;
  documentNumber?: string | null;
  medicalInstitution?: string | null;
  diagnosis?: string | null;
  startDate?: string | null;
  endDate?: string | null;
}

export interface IncapacitiesInfoListResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result: IncapacitiesInfoListItem[];
}

/** POST personalInfoForm/addOrEditPersonPrivilegeInfo */
export interface PersonPrivilegeEntryRequest {
  personId: string;
  id: string | null;
  isModify: boolean;
  privilegeId: string;
  issueDate: string;
  employeeId: string | null;
  rootCompanyId: string | null;
}

/** GET personalInfoForm/getPersonPrivilegesInfoByPersonId/{personId} */
export interface PersonPrivilegesInfoListItem {
  id: string;
  privilegeId?: string | null;
  privilege?: string | null;
  privilegeName?: string | null;
  legalBasisCode?: string | null;
  extraVacation?: number | null;
  issueDate?: string | null;
}

export interface PersonPrivilegesInfoListResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result: PersonPrivilegesInfoListItem[];
}

export interface SpecialNoteAttachmentRequest {
  isCreate: boolean;
  isDeleted: boolean;
  id: string | null;
  attachmentId: string;
  type: string;
}

/** POST personalInfoForm/addOrEditSpecialNoteInfo */
export interface SpecialNoteEntryRequest {
  personId: string;
  employeeId: string | null;
  rootCompanyId: string | null;
  note: string;
  attachments: SpecialNoteAttachmentRequest[];
}

export interface SpecialNoteInfoAttachmentItem {
  id?: string | null;
  attachment?: {
    id?: string | null;
    fileName?: string | null;
    fileExtension?: string | null;
    fileSize?: number | null;
    contentType?: string | null;
  } | null;
  specialNoteAttachType?: string | null;
}

/** GET personalInfoForm/getSpecialNoteInfoByPersonId/{personId} */
export interface SpecialNoteInfoResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result:
    | {
        id?: string | null;
        note?: string | null;
        specialNoteAttachments?: SpecialNoteInfoAttachmentItem[] | null;
      }
    | null;
}

/** POST employee/complete — işçi yaradılma axınının son təsdiqi */
export interface EmployeeCompleteRequest {
  personId: string;
  employeeId: string;
  rootCompanyId: string;
  isCreateUsername: boolean;
  /** Boş olduqda `null` göndərilir */
  note: string | null;
}
