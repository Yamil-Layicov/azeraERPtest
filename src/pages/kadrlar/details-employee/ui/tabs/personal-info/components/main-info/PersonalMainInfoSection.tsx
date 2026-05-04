import React, { useState } from "react";
import { FormInput } from "@/shared/ui/input";
import { CustomSelect, ModernDatePicker } from "@/shared/ui";
import { EnumLookupSelect, CountriesLookupSelect, RootCompaniesLookupSelect, useCitiesByCountryCode } from "@/features/lookups";
import { isAzerbaijanCountry, getCountryIdForCitiesApi } from "@/features/lookups/lib/birthPlaceUtils";
import type { Option } from "@/shared/types";
import { FinSearchField } from "@/pages/kadrlar/employee-shared/ui/fin-search-field";
import styles from "./PersonalMainInfoSection.module.css";

export interface PersonalMainInfoValue {
  fin: string;
  sirket: Option | null;
  vetendasliq: Option | null;
  ad: string;
  dogumTarixi: Date | null;
  dogumOlkesi: Option | null;
  soyad: string;
  cinsi: Option | null;
  dogumSeheri: string;
  ataAdi: string;
  aileVeziyyeti: Option | null;
  tovsiyeEden: string;
}

export interface PersonalMainInfoSectionProps {
  value: PersonalMainInfoValue;
  isFinDisabled?: boolean;
  onFieldChange: (
    field: keyof Omit<
      PersonalMainInfoValue,
      "sirket" | "dogumTarixi" | "cinsi" | "aileVeziyyeti" | "vetendasliq" | "dogumOlkesi"
    >,
    value: string
  ) => void;
  onCompanyChange: (value: Option | null) => void;
  onCitizenshipChange: (value: Option | null) => void;
  onBirthCountryChange: (value: Option | null) => void;
  onBirthDateChange: (date: Date | null) => void;
  onGenderChange: (value: Option | null) => void;
  onMaritalStatusChange: (value: Option | null) => void;
  onFinSearch: () => void;
  onFinClear: () => void;
}

export const PersonalMainInfoSection: React.FC<PersonalMainInfoSectionProps> = ({
  value,
  isFinDisabled = false,
  onFieldChange,
  onCompanyChange,
  onCitizenshipChange,
  onBirthCountryChange,
  onBirthDateChange,
  onGenderChange,
  onMaritalStatusChange,
  onFinSearch,
  onFinClear,
}) => {
  const [hasOpenedCitySelect, setHasOpenedCitySelect] = useState(false);
  const isAzerbaijan = isAzerbaijanCountry(value.dogumOlkesi);
  const countryId = getCountryIdForCitiesApi(value.dogumOlkesi);
  const { options: cityOptions } = useCitiesByCountryCode(
    countryId,
    isAzerbaijan && !!countryId && hasOpenedCitySelect
  );

  return (
    <div className={styles.rightGrid}>
      {/* ROW 1: Fin - Şirkət - Vətəndaşlıq */}
      <div className={styles.fieldGroup}>
        <label className={styles.fieldLabel} htmlFor="fin">
          FİN <span className="required-star">*</span>
        </label>
        <FinSearchField
          id="fin"
          value={value.fin}
          placeholder="Fin daxil edin"
          maxLength={7}
          disabled={isFinDisabled}
          onChange={(val) => onFieldChange("fin", val)}
          onClear={onFinClear}
          onSearch={onFinSearch}
          clearTitle="Təmizlə"
          searchIconOnly
          searchLabel="Axtar"
        />
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.fieldLabel} htmlFor="company-select">
          Şirkət
          <span className="required-star">*</span>
        </label>
        <RootCompaniesLookupSelect
          id="company-select"
          value={value.sirket}
          onChange={onCompanyChange}
          defaultText="Şirkət seçin"
          variant="form"
          isSearchable={true}
          searchPlaceholder="Axtar..."
        />
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.fieldLabel} htmlFor="citizenship-select">
          Vətəndaşlıq <span className="required-star">*</span>
        </label>
        <CountriesLookupSelect
          id="citizenship-select"
          value={value.vetendasliq}
          onChange={onCitizenshipChange}
          defaultText="Ölkə seçin"
          variant="form"
          isSearchable={true}
          searchPlaceholder="Axtar..."
        />
      </div>

      {/* ROW 2: Ad - Doğum tarixi - Doğulduğu ölkə */}
      <FormInput
        id="ad"
        type="text"
        label="Ad"
        placeholder="Ad"
        value={value.ad}
        onChange={(val) => onFieldChange("ad", val)}
        required
      />
      <div className={styles.fieldGroup}>
        <label className={styles.fieldLabel} htmlFor="dogumTarixi">
          Doğum tarixi
          <span className="required-star">*</span>
        </label>
        <ModernDatePicker
          id="dogumTarixi"
          value={value.dogumTarixi}
          onChange={onBirthDateChange}
          placeholder="dd.mm.yyyy"
        />
      </div>
      <div className={styles.fieldGroup}>
        <label className={styles.fieldLabel} htmlFor="birth-country-select">
          Doğulduğu ölkə <span className="required-star">*</span>
        </label>
        <CountriesLookupSelect
          id="birth-country-select"
          value={value.dogumOlkesi}
          onChange={(val) => {
            onBirthCountryChange(val);
            onFieldChange("dogumSeheri", "");
            setHasOpenedCitySelect(false);
          }}
          defaultText="Ölkə seçin"
          variant="form"
          isSearchable={true}
          searchPlaceholder="Axtar..."
        />
      </div>

      {/* ROW 3: Soyad - Cinsi - Doğulduğu şəhər/rayon */}
      <FormInput
        id="soyad"
        type="text"
        label="Soyad"
        placeholder="Soyad"
        value={value.soyad}
        onChange={(val) => onFieldChange("soyad", val)}
        required
      />
      <div className={styles.fieldGroup}>
        <label className={styles.fieldLabel} htmlFor="gender-select">
          Cinsi
          <span className="required-star">*</span>
        </label>
        <EnumLookupSelect
          id="gender-select"
          code="Genders"
          value={value.cinsi}
          onChange={onGenderChange}
          defaultText="Seçin"
          variant="form"
        />
      </div>
      {isAzerbaijan ? (
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="birth-city-select">
            Doğulduğu şəhər/rayon
          </label>
          <CustomSelect
            id="birth-city-select"
            options={cityOptions}
            value={
              value.dogumSeheri
                ? cityOptions.find((o) => o.fullName === value.dogumSeheri || o.id === value.dogumSeheri) ?? null
                : null
            }
            onChange={(opt) => onFieldChange("dogumSeheri", opt?.fullName ?? "")}
            defaultText="Şəhər seçin"
            variant="form"
            isSearchable={true}
            searchPlaceholder="Axtar..."
            disabled={!countryId}
            onOpen={() => setHasOpenedCitySelect(true)}
          />
        </div>
      ) : (
        <FormInput
          id="dogumSeheri"
          type="text"
          label="Doğulduğu şəhər/rayon"
          placeholder="Şəhər"
          value={value.dogumSeheri}
          onChange={(val) => onFieldChange("dogumSeheri", val)}
          disabled={!countryId}
        />
      )}

      {/* ROW 4: Ata adı - Ailə vəziyyəti - Tövsiyyə edən */}
      <FormInput
        id="ataAdi"
        type="text"
        label="Ata adı"
        placeholder="Ata adı"
        value={value.ataAdi}
        onChange={(val) => onFieldChange("ataAdi", val)}
        required
      />
      <div className={styles.fieldGroup}>
        <label className={styles.fieldLabel} htmlFor="marital-status-select">
          Ailə vəziyyəti
          <span className="required-star">*</span>
        </label>
        <EnumLookupSelect
          id="marital-status-select"
          code="MaritalStatuses"
          value={value.aileVeziyyeti}
          onChange={onMaritalStatusChange}
          defaultText="Seçin"
          variant="form"
        />
      </div>
      <FormInput
        id="tovsiyeEden"
        type="text"
        label="Tövsiyyə edən"
        placeholder="Daxil edin"
        value={value.tovsiyeEden}
        onChange={(val) => onFieldChange("tovsiyeEden", val)}
      />
    </div>
  );
};

