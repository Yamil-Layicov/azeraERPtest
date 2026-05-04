import { useState } from "react";
import { FormInput } from "@/shared/ui/input";
import { CustomSelect } from "@/shared/ui";
import { CountriesLookupSelect } from "./CountriesLookupSelect";
import { useCitiesByCountryCode } from "../hooks/useCitiesByCountryCode";
import {
  isAzerbaijanCountry,
  getCountryIdForCitiesApi,
} from "../lib/birthPlaceUtils";
import type { Option } from "@/shared/types";

export interface BirthPlaceFieldProps {
  birthCountry: Option | null;
  birthCity: string;
  onBirthCountryChange: (value: Option | null) => void;
  onBirthCityChange: (value: string) => void;
  onBirthCountryBlur?: () => void;
  onBirthCityBlur?: () => void;
  countryLabel?: string;
  cityLabel?: string;
  countryRequired?: boolean;
  cityRequired?: boolean;
  disabled?: boolean;
  disabledCountry?: boolean;
  disabledCity?: boolean;
  idPrefix?: string;
  classNames?: {
    fieldGroup?: string;
    fieldLabel?: string;
    requiredStar?: string;
  };
  error?: string;
  cityError?: string;
}

export const BirthPlaceField: React.FC<BirthPlaceFieldProps> = ({
  birthCountry,
  birthCity,
  onBirthCountryChange,
  onBirthCityChange,
  onBirthCountryBlur,
  onBirthCityBlur,
  countryLabel = "Doğulduğu ölkə",
  cityLabel = "Doğulduğu şəhər/rayon",
  countryRequired = true,
  cityRequired = false,
  disabled = false,
  disabledCountry,
  disabledCity,
  idPrefix = "birth",
  classNames = {},
  error,
  cityError,
}) => {
  const c = classNames.fieldGroup ?? "fieldGroup";
  const countrySelectId = `${idPrefix}-country-select`;
  const cityId = `${idPrefix}-city`;
  const l = classNames.fieldLabel ?? "fieldLabel";
  const r = classNames.requiredStar ?? "required-star";
  const [hasOpenedCitySelect, setHasOpenedCitySelect] = useState(false);
  const isAzerbaijan = isAzerbaijanCountry(birthCountry);
  const countryId = getCountryIdForCitiesApi(birthCountry);

  const { options: cityOptions } = useCitiesByCountryCode(
    countryId,
    isAzerbaijan && !!countryId && hasOpenedCitySelect,
  );

  return (
    <>
      <div className={c}>
        <label
          className={l}
          htmlFor={countrySelectId}
          style={{ display: "block" }}
        >
          {countryLabel} {countryRequired && <span className={r}>*</span>}
        </label>
        <CountriesLookupSelect
          id={countrySelectId}
          value={birthCountry}
          onChange={(val) => {
            onBirthCountryChange(val);
            onBirthCityChange("");
            setHasOpenedCitySelect(false);
          }}
          onBlur={onBirthCountryBlur}
          defaultText="Ölkə seçin"
          variant="form"
          isSearchable={true}
          searchPlaceholder="Axtar..."
          disabled={disabledCountry ?? disabled}
          error={error}
        />
      </div>
      <div className={c}>
        <label
          className={l}
          htmlFor={cityId}
          style={{ display: "block" }}
        >
          {cityLabel} {cityRequired && <span className={r}>*</span>}
        </label>
        {isAzerbaijan ? (
          <CustomSelect
            id={`${cityId}-select`}
            options={cityOptions}
            value={
              birthCity
                ? (cityOptions.find(
                    (o) => o.fullName === birthCity || o.id === birthCity,
                  ) ?? null)
                : null
            }
            onChange={(opt) => onBirthCityChange(String(opt?.id ?? ""))}
            onBlur={onBirthCityBlur}
            defaultText="Şəhər seçin"
            variant="form"
            isSearchable={true}
            searchPlaceholder="Axtar..."
            disabled={(disabledCity ?? disabled) || !countryId}
            error={cityError}
            onOpen={() => setHasOpenedCitySelect(true)}
          />
        ) : (
          <FormInput
            id={`${cityId}-input`}
            type="text"
            label=""
            placeholder="Şəhər"
            value={birthCity}
            onChange={(val) => onBirthCityChange(val)}
            onBlur={onBirthCityBlur}
            disabled={(disabledCity ?? disabled) || !countryId}
            error={cityError}
          />
        )}
      </div>
    </>
  );
};
