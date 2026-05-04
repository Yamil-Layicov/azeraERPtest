import type { Option } from "@/shared/types";
import type { EmployeeFormData, EmployeeDocument, NewDocumentState } from "../../model/types";

export interface InfoTabProps {
  companiesOptions: Option[];
  isEditMode?: boolean;
  readOnlyFields?: ('fin' | 'company')[]; // Edit modunda sadece bu alanlar disabled olur, contacts/documents aktif kalır
  
  // Optional - will use context if not provided
  formData?: EmployeeFormData;
  newContact?: {
    type: Option | null;
    value: string;
    isPrimary: boolean;
  };
  addedContacts?: Array<{
    id: number;
    type: Option | null;
    value: string;
    isPrimary: boolean;
  }>;
  newDocument?: NewDocumentState;
  addedDocuments?: EmployeeDocument[];
  onInputChange?: (field: keyof EmployeeFormData, value: any) => void;
  onNewContactChange?: (field: "type" | "value", value: any) => void;
  onNewContactPrimaryChange?: (checked: boolean) => void;
  onAddContact?: () => void;
  onRemoveContact?: (id: number) => void;
  onListContactChange?: (id: number, field: "type" | "value", value: any) => void;
  onListContactPrimaryToggle?: (id: number, checked: boolean, typeId?: string | number) => void;
  onNewDocumentChange?: (field: keyof NewDocumentState, value: any) => void;
  onAddDocument?: () => void;
  onRemoveDocument?: (id: number) => void;
  onListDocumentChange?: (id: number, field: keyof EmployeeDocument, value: any) => void;
}
