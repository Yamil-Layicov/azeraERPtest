import type { Option } from "@/shared/types";
import type { EmployeeFormData } from "../../../../employee-shared/model/types"; 

export interface StaffTabProps {
  // Optional - will use context if not provided
  formData?: {
    isLeader: boolean;
    company: Option | null;
    position: Option | null;
  };
  onInputChange?: (field: keyof EmployeeFormData, value: EmployeeFormData[keyof EmployeeFormData]) => void;
}