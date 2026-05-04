import React from "react";
import { CustomSelect } from "@/shared/ui";
import type { Option } from "@/shared/types";
import { useStaffVacant } from "../hooks/useStaffVacant";

interface StaffVacantLookupSelectProps {
  subCompanyId: string | null;
  value: Option | null;
  onChange: (value: Option | null) => void;
  id?: string;
  defaultText?: string;
  variant?: "default" | "navbar" | "form" | "compact";
  isSearchable?: boolean;
  isClearable?: boolean;
  searchPlaceholder?: string;
  disabled?: boolean;
  onBlur?: () => void;
  error?: string;
}

export const StaffVacantLookupSelect: React.FC<StaffVacantLookupSelectProps> = ({
  subCompanyId,
  value,
  onChange,
  id,
  defaultText = "Seçin",
  variant = "form",
  isSearchable = true,
  isClearable = true,
  searchPlaceholder = "Axtar...",
  disabled = false,
  onBlur,
  error,
}) => {
  const { options, isLoading } = useStaffVacant(subCompanyId);

  return (
    <CustomSelect
      id={id}
      options={options}
      value={value}
      onChange={onChange}
      defaultText={isLoading ? "Yüklənir..." : !subCompanyId ? "Departament seçilməyib" : defaultText}
      variant={variant}
      isSearchable={isSearchable}
      isClearable={isClearable}
      searchPlaceholder={searchPlaceholder}
      disabled={disabled || isLoading || !subCompanyId}
      onBlur={onBlur}
      error={error}
    />
  );
};
