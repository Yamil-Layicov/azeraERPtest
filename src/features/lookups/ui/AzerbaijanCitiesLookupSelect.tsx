import { useState } from "react";
import { CustomSelect } from "@/shared/ui";
import type { Option } from "@/shared/types";
import { useCitiesByCountryCode } from "../hooks/useCitiesByCountryCode";
import styles from "@/shared/ui/input/FormInput.module.css";

export const AZERBAIJAN_COUNTRY_CODE = "AZE";

export interface AzerbaijanCitiesLookupSelectProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  id?: string;
  label?: string;
  disabled?: boolean;
  error?: string;
  required?: boolean;
}

export const AzerbaijanCitiesLookupSelect: React.FC<AzerbaijanCitiesLookupSelectProps> = ({
  value,
  onChange,
  onBlur,
  id = "azerbaijan-cities-select",
  label,
  disabled = false,
  error,
  required,
}) => {
  const [hasOpened, setHasOpened] = useState(false);
  // Enabled if opened OR if there is an existing value to resolve
  const { options, isLoading } = useCitiesByCountryCode(AZERBAIJAN_COUNTRY_CODE, hasOpened || !!value);

  const selectedOption = value
    ? options.find((o) => o.fullName === value || o.id === value || String(o.id) === value || o.label === value) ?? null
    : null;

  const handleChange = (opt: Option | null) => {
    onChange(opt ? String(opt.id) : "");
  };

  return (
    <div className={styles.formGroup}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label} {required && <span className="required-star">*</span>}
        </label>
      )}
      <CustomSelect
        id={id}
        options={options}
        value={selectedOption}
        onChange={handleChange}
        onBlur={onBlur}
        defaultText="Şəhər seçin"
        variant="form"
        isSearchable={true}
        searchPlaceholder="Axtar..."
        disabled={disabled || isLoading}
        onOpen={() => {
          if (!hasOpened) setHasOpened(true);
        }}
        error={error}
      />
    </div>
  );
};
