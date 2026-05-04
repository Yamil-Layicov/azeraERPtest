import type { EmployeeFormData } from "../../model/types"; 
import type { LdapUser } from "../ldap-search-modal/LdapSearchModal";

export interface SecurityTabProps {
  // Optional - will use context if not provided
  formData?: EmployeeFormData;
  onInputChange?: (field: keyof EmployeeFormData, value: EmployeeFormData[keyof EmployeeFormData]) => void;
  onLdapSearch?: () => void;
  onLdapConfirm?: (user: LdapUser) => void;
  onSave?: () => void;
}

