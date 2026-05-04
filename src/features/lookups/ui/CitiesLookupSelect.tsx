import { useState, useEffect } from "react";
import { CustomSelect } from "@/shared/ui";
import type { Option } from "@/shared/types";
import { useCitiesByCountryCode } from "../hooks/useCitiesByCountryCode";

export interface CitiesLookupSelectProps {
  countryCode: string;
  value: Option | null;
  onChange: (value: Option | null) => void;
  id?: string;
  defaultText?: string;
  variant?: "default" | "navbar" | "form" | "compact";
  isSearchable?: boolean;
  disabled?: boolean;
}

/**
 * Cities select based on country code with lazy load.
 */
export const CitiesLookupSelect: React.FC<CitiesLookupSelectProps> = ({
  countryCode,
  value,
  onChange,
  id = "cities-select",
  defaultText = "Seçin",
  variant = "form",
  isSearchable = true,
  disabled = false,
}) => {
  // Şəhər select-i hansı ölkə üçün açılıbsa onu yadda saxlayırıq
  const [openedForCountry, setOpenedForCountry] = useState<string | null>(null);

  const isEnabled = !!countryCode && openedForCountry === countryCode;

  const { options, isLoading } = useCitiesByCountryCode(
    countryCode || null,
    isEnabled,
  );

  // Ölkə dəyişəndə əvvəlki açılmış ölkə ilə eyni deyilsə, auto-request olmasın
  useEffect(() => {
    if (openedForCountry && openedForCountry !== countryCode) {
      setOpenedForCountry(null);
    }
  }, [countryCode, openedForCountry]);

  return (
    <CustomSelect
      id={id}
      options={options}
      value={value}
      onChange={onChange}
      defaultText={defaultText}
      variant={variant}
      isSearchable={isSearchable}
      searchPlaceholder="Axtar..."
      disabled={disabled || isLoading}
      onOpen={() => {
        if (!countryCode) return;
        // Hər dəfə şəhər select-inə klik olanda həmin ölkə üçün açılmış kimi işarələyirik
        setOpenedForCountry(countryCode);
      }}
    />
  );
};
