import type { ReactNode, ElementType } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import type { Option } from "./common";

export interface ButtonProps {
  type?: "button" | "submit";
  variant: "primary" | "secondary" | "outline" | "clear" | "default" | "danger" | "warning" | "danger-ghost";
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
  title?: string;
  style?: React.CSSProperties;
}

export interface FormInputProps {
  label?: ReactNode;
  type: "text" | "number" | "email" | "password";
  id: string;
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;
  register?: UseFormRegisterReturn;
  required?: boolean;
  step?: string;
  className?: string;
  disabled?: boolean;
  autoComplete?: string;
  maxLength?: number;
  readOnly?: boolean;
  icon?: ReactNode;
  error?: string;
  onBlur?: () => void;
  onFocus?: () => void;
  onClick?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onClear?: () => void;
  labelClassName?: string;
}

export interface FormTextareaProps {
  label: string;
  id: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
  disabled?: boolean;
  rows?: number;
  labelClassName?: string;
  error?: string;
}

export interface CustomSelectProps {
  options: Option[];
  defaultText: string;
  value: Option | null;
  onChange: (value: Option | null) => void;
  className?: string;
  variant?: "default" | "navbar" | "form" | "compact";
  id?: string;
  error?: string | boolean;
  disabled?: boolean;
  ariaLabel?: string;
  icon?: ElementType;
  isClearable?: boolean;
  isSearchable?: boolean;
  searchPlaceholder?: string;
  dropdownWidthExtra?: number;
  dataContext?: string;
  onOpen?: () => void;
  onMenuOpen?: () => void;
  onBlur?: () => void;
  onScroll?: (e: React.UIEvent<HTMLUListElement>) => void;
  onSearch?: (query: string) => void;
  isLoading?: boolean;
}

export interface GroupedOption {
  label: string;
  options: Option[];
}

export interface GroupedCustomSelectProps extends Omit<
  CustomSelectProps,
  "options"
> {
  options: GroupedOption[];
}

export interface MultiSelectProps {
  options: Option[];
  defaultText: string;
  value: Option[];
  onChange: (value: Option[]) => void;
  className?: string;
  variant?: "default" | "navbar" | "form";
  id?: string;
  error?: string | boolean;
  disabled?: boolean;
  onMenuOpen?: () => void;
}

export interface RadioSwitchProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{
    value: string;
    label: string;
  }>;
  id?: string;
  disabled?: boolean;
}

export type ModernDatePickerProps = {
  value: Date | null;
  onChange: (date: Date | null) => void;
  onBlur?: () => void;
  label?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
  placeholder?: string;
  mode?: "date" | "year";
  minDate?: Date | null;
  maxDate?: Date | null;
};

export interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  text?: string;
  buttonText?: string;
  // Two button support
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
}

export interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  text?: string;
  buttonText?: string;
}

export interface Message {
  id: number;
  title: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Message[];
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: "info" | "success" | "warning" | "error";
}

export interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
}

export interface NavbarProps {
  onToggleSidebar: () => void;
}

export interface SidebarProps {
  isCollapsed?: boolean;
}

export interface LayoutProps {
  children: ReactNode;
}

export interface ColumnDef<T> {
  header: ReactNode;
  accessor: keyof T | string;
  width?: string;
  maxWidth?: string;
  minWidth?: string;
  headerClassName?: string;
  className?: string;
  render?: (item: T, index?: number) => ReactNode;
  sortable?: boolean;
  sortKey?: string;
}

export interface TableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  className?: string;
  hideSortIcons?: boolean;
  selectedRowId?: string | number | null;
  rowIdKey?: keyof T | string;
  onSort?: (accessor: string, direction: "asc" | "desc") => void;
  sortColumn?: string | null;
  sortDirection?: "asc" | "desc";
  onRowClick?: (row: T) => void;
  onRowDoubleClick?: (row: T) => void;
  emptyMessage?: string;
  fixedLayout?: boolean;
  getRowClassName?: (item: T) => string | undefined;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  maxVisiblePages?: number;
  disabled?: boolean;
}
