import { createContext, useContext, type ReactNode } from "react";
import type { Option } from "@/shared/types";
import type { 
  EmployeeFormData, 
  NewContactState, 
  Contact, 
  TabKey,
  EmployeeDocument,
  NewDocumentState
} from "../../employee-shared/model/types";

export interface CreateEmployeeContextValue {
  // Tab management
  activeTab: TabKey;
  setActiveTab: (tab: TabKey) => void;

  // Form data
  formData: EmployeeFormData;
  handleInputChange: (field: keyof EmployeeFormData, value: EmployeeFormData[keyof EmployeeFormData]) => void;

  // Contacts
  newContact: NewContactState;
  addedContacts: Contact[];
  handleNewContactChange: (field: "type" | "value", data: Option | null | string) => void;
  handleNewContactPrimaryChange: (checked: boolean) => void;
  handleAddContact: () => void;
  handleRemoveContact: (id: number) => void;
  handleListContactChange: (id: number, field: "type" | "value", data: Option | null | string) => void;
  handleListContactPrimaryToggle: (id: number, isChecked: boolean, typeId?: string | number) => void;

  // Documents
  newDocument: NewDocumentState;
  addedDocuments: EmployeeDocument[];
  handleNewDocumentChange: (field: keyof NewDocumentState, value: Option | null | string | Date | null) => void;
  handleAddDocument: () => void;
  handleRemoveDocument: (id: number) => void;
  handleListDocumentChange: (id: number, field: keyof EmployeeDocument, value: Option | null | string | Date | null | undefined) => void;

  // Avatar
  avatarPreview: string | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleAvatarClick: () => void;
  handleClearAvatar: () => void;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;

  // LDAP
  isLdapModalOpen: boolean;
  setIsLdapModalOpen: (open: boolean) => void;
  handleLdapConfirm: (user: { firstName: string; lastName: string; username: string; email: string }) => void;
  isLdapSelected: boolean;
  setIsLdapSelected?: (selected: boolean) => void; // Optional - for clearing LDAP selection

  // Save/Clear
  handleSave: () => void;
  handleClearAll: () => void;
  isSaving?: boolean;
  setValidationTrigger?: (trigger: () => Promise<boolean>) => void; // Set validation trigger from InfoTab
  
  // Success Modal
  isSuccessModalOpen: boolean;
  setIsSuccessModalOpen: (open: boolean) => void;
  handleSuccessModalCreateNew: () => void;
  handleSuccessModalContinue: () => void;
  
  // FIN Input Disabled State
  isFinDisabled: boolean;
  
  // Tabs Enabled State
  areTabsEnabled: boolean;
  
  // Root Company ID from create request payload
  rootCompanyId: string | null;
  
  // Employment ID from create response
  employmentId: string | null;

  // Staff Tab Save Handler
  handleStaffSave?: () => Promise<void>;
  setHandleStaffSave?: (handler: () => Promise<void>) => void;
  isStaffSaving?: boolean;

  // PIN Search
  handleSearchByPin?: (pin: string) => Promise<void>;
  handlePinSearchConfirm?: () => Promise<void>;
  handlePinSearchCancel?: () => void;
  isPinSearchResultModalOpen: boolean;
  setIsPinSearchResultModalOpen: (open: boolean) => void;
  pinSearchResultData: { name: string; surname: string; patronymic: string; birthDate: string; gender: string; pin: string; employees: Array<{ id?: string; companyName: string; createdAt: string }> } | null;
  setPinSearchResultData: (data: { name: string; surname: string; patronymic: string; birthDate: string; gender: string; pin: string; employees: Array<{ id?: string; companyName: string; createdAt: string }> } | null) => void;
  pinSearchRawData: unknown | null;
  setPinSearchRawData: (data: unknown | null) => void;
  pinSearchError: string | null;
  setPinSearchError: (error: string | null) => void;
  usernameFromPinSearch: string | null;
  originalUsername?: string | null; // Original username from API (for edit mode)

  // Loading state (for edit mode)
  isLoading?: boolean;

  // Lookup data (loaded after PIN search confirmation)
  companiesOptions: Option[];
  contactTypesOptions: Option[];
  isDataLoaded: boolean; // true when PIN search is confirmed and data is loaded
}

// eslint-disable-next-line react-refresh/only-export-components
export const CreateEmployeeContext = createContext<CreateEmployeeContextValue | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useCreateEmployeeContext = () => {
  const context = useContext(CreateEmployeeContext);
  if (!context) {
    throw new Error("useCreateEmployeeContext must be used within CreateEmployeeProvider");
  }
  return context;
};

interface CreateEmployeeProviderProps {
  children: ReactNode;
  value: CreateEmployeeContextValue;
}

export const CreateEmployeeProvider = ({ children, value }: CreateEmployeeProviderProps) => {
  return (
    <CreateEmployeeContext.Provider value={value}>
      {children}
    </CreateEmployeeContext.Provider>
  );
};
