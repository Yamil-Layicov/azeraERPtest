import React, { useState } from "react";
import { CustomSelect } from "@/shared/ui";
import type { Option } from "@/shared/types";
import { useStateAwardsByType } from "../hooks/useStateAwardsByType";

export interface StateAwardsLookupSelectProps {
  typeCode: string | null | undefined;
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
  error?: string;
}

export const StateAwardsLookupSelect: React.FC<StateAwardsLookupSelectProps> = ({
  typeCode,
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
  error,
}) => {
  const [hasOpened, setHasOpened] = useState(false);
  const { options, isLoading, refetch } = useStateAwardsByType(
    typeCode,
    hasOpened && !!typeCode,
  );

  const handleOpen = () => {
    if (!hasOpened) setHasOpened(true);
    if (typeCode) refetch();
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
      disabled={disabled || !typeCode || isLoading}
      onOpen={handleOpen}
      error={error}
    />
  );
};
