import { useState } from "react";
import { CustomSelect } from "@/shared/ui";
import type { Option } from "@/shared/types";
import { useCountries } from "../hooks/useCountries";

export interface CountriesLookupSelectProps {
  value: Option | null;
  onChange: (value: Option | null) => void;
  onBlur?: () => void;
  defaultText?: string;
  id?: string;
  variant?: "default" | "navbar" | "form" | "compact";
  isSearchable?: boolean;
  searchPlaceholder?: string;
  disabled?: boolean;
  error?: string;
}

export const CountriesLookupSelect: React.FC<CountriesLookupSelectProps> = ({
  value,
  onChange,
  onBlur,
  defaultText = "Ölkə seçin",
  id = "countries-select",
  variant = "form",
  isSearchable = true,
  searchPlaceholder = "Axtar...",
  disabled = false,
  error,
}) => {
  const [hasOpened, setHasOpened] = useState(false);
  const { options, isLoading, refetch } = useCountries(hasOpened);

  const handleOpen = () => {
    if (!hasOpened) {
      setHasOpened(true);
    } else {
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
