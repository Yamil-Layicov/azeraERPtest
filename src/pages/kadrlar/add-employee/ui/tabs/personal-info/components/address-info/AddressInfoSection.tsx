import React from "react";
import { FormInput } from "@/shared/ui/input";
import { Checkbox } from "@/shared/ui";
import { AzerbaijanCitiesLookupSelect, BirthPlaceField } from "@/features/lookups";
import type { Option } from "@/shared/types";
import styles from "./AddressInfoSection.module.css";
import type { FieldErrors } from "react-hook-form";
import type { PersonalInfoValues } from "@/features/kadrlar/create-worker/model/schemas";

export interface AddressInfoSectionProps {
  actualCity: string;
  actualAddress: string;
  registrationSameAsActual: boolean;
  registrationCountry: Option | null;
  registrationCity: string;
  registrationAddress: string;
  onActualCityChange: (val: string) => void;
  onActualAddressChange: (val: string) => void;
  onRegistrationSameAsActualChange: (checked: boolean) => void;
  onRegistrationCountryChange: (val: Option | null) => void;
  onRegistrationCityChange: (val: string) => void;
  onRegistrationAddressChange: (val: string) => void;
  onBlur: (field: string) => void;
  errors?: FieldErrors<PersonalInfoValues>;
}

export const AddressInfoSection: React.FC<AddressInfoSectionProps> = ({
  actualCity,
  actualAddress,
  registrationSameAsActual,
  registrationCountry,
  registrationCity,
  registrationAddress,
  onActualCityChange,
  onActualAddressChange,
  onRegistrationSameAsActualChange,
  onRegistrationCountryChange,
  onRegistrationCityChange,
  onRegistrationAddressChange,
  onBlur,
  errors,
}) => {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h3 className={styles.title}>Ünvan məlumatları</h3>
        <div className={styles.titleDivider} />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <AzerbaijanCitiesLookupSelect
            id="actualCity"
            label="Faktiki yaşadığı şəhər"
            value={actualCity}
            onChange={onActualCityChange}
            onBlur={() => onBlur("faktikiSeher")}
            error={errors?.faktikiSeher?.message}
            required
          />
        </div>

        <div className={styles.fieldWideFact}>
          <FormInput
            id="actualAddress"
            type="text"
            label="Faktiki yaşayış ünvanı"
            placeholder="Ünvan"
            value={actualAddress}
            onChange={onActualAddressChange}
            onBlur={() => onBlur("faktikiUnvan")}
            error={errors?.faktikiUnvan?.message}
            required
          />
        </div>

        <div className={styles.checkboxWrap}>
          <Checkbox
            id="registrationSameAsActual"
            checked={registrationSameAsActual}
            onChange={onRegistrationSameAsActualChange}
            label="Qeydiyyatda olduğu ünvan yaşadığı ünvanla eynidir"
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.countryCityWrap}>
          <BirthPlaceField
            idPrefix="registration"
            birthCountry={registrationCountry}
            birthCity={registrationCity}
            onBirthCountryChange={onRegistrationCountryChange}
            onBirthCityChange={onRegistrationCityChange}
            onBirthCountryBlur={() => onBlur("qeydiyyatOlke")}
            onBirthCityBlur={() => onBlur("qeydiyyatSeher")}
            countryLabel="Qeydiyyatda olduğu ölkə"
            cityLabel="Qeydiyyatda olduğu şəhər"
            countryRequired={!registrationSameAsActual}
            cityRequired={!registrationSameAsActual}
            disabledCity={registrationSameAsActual}
            disabledCountry={registrationSameAsActual}
            classNames={{
              fieldGroup: styles.field,
              fieldLabel: styles.label,
            }}
            error={errors?.qeydiyyatOlke?.message || errors?.qeydiyyatSeher?.message}
          />
        </div>

        <div className={styles.registrationAddressWrapper}>
          <FormInput
            id="registrationAddress"
            type="text"
            label="Qeydiyyatda olduğu ünvan"
            placeholder="Ünvan"
            value={registrationAddress}
            onChange={onRegistrationAddressChange}
            onBlur={() => onBlur("qeydiyyatUnvan")}
            disabled={registrationSameAsActual}
            error={errors?.qeydiyyatUnvan?.message}
          />
        </div>
      </div>
    </section>
  );
};
