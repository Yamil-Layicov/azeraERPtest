import { useState } from "react";
import { CustomSelect } from "@/shared/ui";
import type { Option } from "@/shared/types";
import { useRootCompaniesLookup } from "@/features/kadrlar/departments";

export interface RootCompaniesLookupSelectProps {
  value: Option | null;
  onChange: (value: Option | null) => void;
  onBlur?: () => void;
  defaultText?: string;
  id?: string;
  variant?: "default" | "navbar" | "form" | "compact";
  isSearchable?: boolean;
  searchPlaceholder?: string;
  disabled?: boolean;
  refetchOnOpen?: boolean;
  error?: string;
}

/**
 * Root companies select with lazy load: fetches options only when the user opens the dropdown.
 * Follows the same pattern as EnumLookupSelect and CountriesLookupSelect.
 */
export const RootCompaniesLookupSelect: React.FC<RootCompaniesLookupSelectProps> = ({
  value,
  onChange,
  onBlur,
  defaultText = "Şirkət seçin",
  id = "root-companies-select",
  variant = "form",
  isSearchable = true,
  searchPlaceholder = "Axtar...",
  disabled = false,
  refetchOnOpen = false,
  error,
}) => {
  const [hasOpened, setHasOpened] = useState(false);
  const { data: options = [], isLoading, refetch } = useRootCompaniesLookup(hasOpened);

  const handleOpen = () => {
    if (!hasOpened) {
      setHasOpened(true);
      refetch();
      return;
    }

    if (refetchOnOpen) {
      refetch();
    }
  };

  return (
    <CustomSelect
      id={id}
      options={options}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      defaultText={defaultText}
      variant={variant}
      isSearchable={isSearchable}
      searchPlaceholder={searchPlaceholder}
      disabled={disabled || isLoading}
      onOpen={handleOpen}
      error={error}
    />
  );
};
