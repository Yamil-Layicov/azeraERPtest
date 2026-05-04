import type { DepartmentNode } from "../../../model/types";
import type { Option } from "@/shared/types";
import type React from "react";

export interface FormValues {
  type: Option | null;
  fullName: string;
  legalName: string;
  parent: Option | null;
  workSchedule: Option | null;
  voen: string;
  note: string;
  website: string;
  fax: string;
  phone: string;

  isActive: boolean;
  sortOrder: number | "";
  sayi: number | "";
  createdAt?: string;
  createdBy?: string | null;
}

export interface FormErrors {
  fullName?: string;
  legalName?: string;
  type?: string;
  parent?: string;
  voen?: string;
  sortOrder?: string;
  workSchedule?: string;
  sayi?: string;
}

export interface DepartmentFormProps {
  title?: string;
  initialData?: DepartmentNode | null;
  defaultParent?: Option | null;
  onSave: (data: FormValues) => void;
  onCancel: () => void;
  onDelete?: (id: string) => void;
  onChange?: (data: FormValues) => void;
  isLoading?: boolean;
  fullWidth?: boolean;
  isEditMode?: boolean;
  isOpen?: boolean;
  cancelButtonText?: string;
  onClose?: () => void;
  fieldsAfterType?: React.ReactNode;
  fieldsAfterName?: React.ReactNode;
  hideSortOrder?: boolean;
  hideActive?: boolean;
  hideType?: boolean;
  hideName?: boolean;
  renderActiveControl?: React.ReactNode;
  savePermission?: string;
  deletePermission?: string;
}

