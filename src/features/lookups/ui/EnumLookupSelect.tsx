import { useState } from "react";
import { CustomSelect } from "@/shared/ui";
import type { Option } from "@/shared/types";
import { useEnumItemsByCode } from "../hooks";

export interface EnumLookupSelectProps {
  code: string;
  value: Option | null;
  onChange: (value: Option | null) => void;
  onBlur?: () => void;
  defaultText?: string;
  id?: string;
  variant?: "default" | "navbar" | "form" | "compact";
  isSearchable?: boolean;
  isClearable?: boolean;
  searchPlaceholder?: string;
  disabled?: boolean;
  refetchOnOpen?: boolean;
  loadOnValue?: boolean;
  error?: string; // Hata mesajı prop'u eklendi
}

export const EnumLookupSelect: React.FC<EnumLookupSelectProps> = ({
  code,
  value,
  onChange,
  onBlur,
  defaultText = "Seçin",
  id,
  variant = "form",
  isSearchable = false,
  isClearable = false,
  searchPlaceholder = "Axtar...",
  disabled = false,
  loadOnValue = true,
  error,
}) => {
  const [hasOpened, setHasOpened] = useState(false);
  const { options, isLoading, refetch } = useEnumItemsByCode(
    code,
    hasOpened || (loadOnValue && !!value),
  );

  const handleOpen = () => {
    if (!hasOpened) setHasOpened(true);
    refetch();
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
      isClearable={isClearable}
      searchPlaceholder={searchPlaceholder}
      disabled={disabled || isLoading}
      onOpen={handleOpen}
      error={error}
    />
  );
};
