import React, { useState } from "react";
import { CustomSelect } from "@/shared/ui";
import type { Option } from "@/shared/types";
import { useSubCompanies } from "../hooks/useSubCompanies";

interface SubCompaniesLookupSelectProps {
  rootCompanyId: string | null;
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
  loadOnValue?: boolean;
}

export const SubCompaniesLookupSelect: React.FC<SubCompaniesLookupSelectProps> = ({
  rootCompanyId,
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
  loadOnValue = true,
}) => {
  const [openedForId, setOpenedForId] = useState<string | null>(null);

  const isCurrentlyOpened = openedForId === rootCompanyId;

  const { options, isLoading, refetch } = useSubCompanies(
    rootCompanyId, 
    isCurrentlyOpened || (loadOnValue && !!value)
  );

  const handleOpen = () => {
    if (openedForId !== rootCompanyId && rootCompanyId) {
      setOpenedForId(rootCompanyId);
      refetch();
    }
  };

  return (
    <CustomSelect
      id={id}
      options={options}
      value={value}
      onChange={onChange}
      defaultText={isLoading ? "Yüklənir..." : !rootCompanyId ? "Şirkət seçilməyib" : defaultText}
      variant={variant}
      isSearchable={isSearchable}
      isClearable={isClearable}
      searchPlaceholder={searchPlaceholder}
      disabled={disabled || isLoading || !rootCompanyId}
      onBlur={onBlur}
      onOpen={handleOpen}
      error={error}
    />
  );
};
