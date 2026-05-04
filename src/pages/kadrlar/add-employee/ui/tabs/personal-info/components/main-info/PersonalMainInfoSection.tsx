import React from "react";
import { FormInput } from "@/shared/ui/input";
import { ModernDatePicker } from "@/shared/ui";
import { EnumLookupSelect, CountriesLookupSelect, RootCompaniesLookupSelect, BirthPlaceField } from "@/features/lookups";
import type { Option } from "@/shared/types";
import { FinSearchField } from "@/pages/kadrlar/employee-shared/ui/fin-search-field";
import { capitalizeFirstLetter } from "@/shared/hooks";
import styles from "./PersonalMainInfoSection.module.css";
import type { FieldErrors } from "react-hook-form";
import type { PersonalInfoValues } from "@/features/kadrlar/create-worker/model/schemas";

export interface PersonalMainInfoValue {
  fin: string;
  sirket: Option | null;
  resmilesmeFormasi: Option | null;
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
  status?: string;
  username?: string;
}

export interface PersonalMainInfoSectionProps {
  value: PersonalMainInfoValue;
  errors?: FieldErrors<PersonalInfoValues>;
  isFinDisabled?: boolean;
  isDetailsMode?: boolean;
  onFieldChange: (
    field: keyof Omit<
      PersonalMainInfoValue,
      "sirket" | "dogumTarixi" | "cinsi" | "aileVeziyyeti" | "resmilesmeFormasi" | "vetendasliq" | "dogumOlkesi" | "status" | "username"
    >,
    value: string
  ) => void;
  onFieldBlur: (field: string) => void;
  onCompanyChange: (value: Option | null) => void;
  onResmilesmeFormasiChange: (value: Option | null) => void;
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
  errors,
  isFinDisabled = false,
  isDetailsMode = false,
  onFieldChange,
  onFieldBlur,
  onCompanyChange,
  onResmilesmeFormasiChange,
  onCitizenshipChange,
  onBirthCountryChange,
  onBirthDateChange,
  onGenderChange,
  onMaritalStatusChange,
  onFinSearch,
  onFinClear,
}) => {
  return (
    <div className={styles.rightGrid}>
      <div className={styles.column}>
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
            onBlur={() => onFieldBlur("fin")}
            onClear={onFinClear}
            onSearch={onFinSearch}
            showClearButton={!isDetailsMode}
            useTableEditButton={isDetailsMode}
            clearTitle="Təmizlə"
            searchIconOnly={!isDetailsMode}
            searchLabel={isDetailsMode ? "Düzəliş et" : "Axtar"}
            error={errors?.fin?.message}
          />
        </div>
        
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="ad">
            Ad <span className="required-star">*</span>
          </label>
          <FormInput
            id="ad"
            type="text"
            label=""
            placeholder="Ad"
            value={value.ad}
            onChange={(val) => onFieldChange("ad", capitalizeFirstLetter(val))}
            onBlur={() => onFieldBlur("ad")}
            error={errors?.ad?.message}
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="soyad">
            Soyad <span className="required-star">*</span>
          </label>
          <FormInput
            id="soyad"
            type="text"
            label=""
            placeholder="Soyad"
            value={value.soyad}
            onChange={(val) => onFieldChange("soyad", capitalizeFirstLetter(val))}
            onBlur={() => onFieldBlur("soyad")}
            error={errors?.soyad?.message}
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="ataAdi">
            Ata adı <span className="required-star">*</span>
          </label>
          <FormInput
            id="ataAdi"
            type="text"
            label=""
            placeholder="Ata adı"
            value={value.ataAdi}
            onChange={(val) => onFieldChange("ataAdi", capitalizeFirstLetter(val))}
            onBlur={() => onFieldBlur("ataAdi")}
            error={errors?.ataAdi?.message}
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="tovsiyeEden">
            Tövsiyyə edən <span className="required-star">*</span>
          </label>
          <FormInput
            id="tovsiyeEden"
            type="text"
            label=""
            placeholder="Daxil edin"
            value={value.tovsiyeEden}
            onChange={(val) => onFieldChange("tovsiyeEden", val)}
            onBlur={() => onFieldBlur("tovsiyeEden")}
            error={errors?.tovsiyeEden?.message}
          />
        </div>
      </div>

      <div className={styles.column}>
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="company-select">
            Şirkət <span className="required-star">*</span>
          </label>
          {isDetailsMode ? (
            <FormInput
              id="company-select"
              type="text"
              label=""
              placeholder="-"
              value={value.sirket?.fullName || ""}
              onChange={() => undefined}
              disabled={true}
            />
          ) : (
            <RootCompaniesLookupSelect
              id="company-select"
              value={value.sirket}
              onChange={onCompanyChange}
              onBlur={() => onFieldBlur("sirket")}
              defaultText="Şirkət seçin"
              variant="form"
              isSearchable={true}
              refetchOnOpen={true}
              disabled={false}
              searchPlaceholder="Axtar..."
              error={errors?.sirket?.message}
            />
          )}
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="dogumTarixi">
            Doğum tarixi <span className="required-star">*</span>
          </label>
          <ModernDatePicker
            id="dogumTarixi"
            value={value.dogumTarixi}
            onChange={onBirthDateChange}
            onBlur={() => onFieldBlur("dogumTarixi")}
            placeholder="dd.mm.yyyy"
            error={errors?.dogumTarixi?.message}
          />
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="gender-select">
            Cinsi <span className="required-star">*</span>
          </label>
          <EnumLookupSelect
            id="gender-select"
            code="Genders"
            value={value.cinsi}
            onChange={onGenderChange}
            onBlur={() => onFieldBlur("cinsi")}
            defaultText="Seçin"
            variant="form"
            loadOnValue={!isDetailsMode}
            error={errors?.cinsi?.message}
          />
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="marital-status-select">
            Ailə vəziyyəti <span className="required-star">*</span>
          </label>
          <EnumLookupSelect
            id="marital-status-select"
            code="MaritalStatuses"
            value={value.aileVeziyyeti}
            onChange={onMaritalStatusChange}
            onBlur={() => onFieldBlur("aileVeziyyeti")}
            defaultText="Seçin"
            variant="form"
            loadOnValue={!isDetailsMode}
            error={errors?.aileVeziyyeti?.message}
          />
        </div>
        {isDetailsMode && (
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="status">
              Status
            </label>
            <FormInput
              id="status"
              type="text"
              label=""
              placeholder="-"
              value={value.status || ""}
              onChange={() => undefined}
              disabled={true}
            />
          </div>
        )}
      </div>

      <div className={styles.column}>
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="resmilesme-formasi-select">
            Rəsmiləşmə forması <span className="required-star">*</span>
          </label>
          {isDetailsMode ? (
            <FormInput
              id="resmilesme-formasi-select"
              type="text"
              label=""
              placeholder="-"
              value={value.resmilesmeFormasi?.fullName || ""}
              onChange={() => undefined}
              disabled={true}
            />
          ) : (
            <EnumLookupSelect
              id="resmilesme-formasi-select"
              code="EmploymentTypes"
              value={value.resmilesmeFormasi}
              onChange={onResmilesmeFormasiChange}
              onBlur={() => onFieldBlur("resmilesmeFormasi")}
              defaultText="Seçin"
              variant="form"
              isSearchable={true}
              disabled={false}
              loadOnValue={true}
              searchPlaceholder="Axtar..."
              error={errors?.resmilesmeFormasi?.message}
            />
          )}
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="citizenship-select">
            Vətəndaşlıq <span className="required-star">*</span>
          </label>
          <CountriesLookupSelect
            id="citizenship-select"
            value={value.vetendasliq}
            onChange={onCitizenshipChange}
            onBlur={() => onFieldBlur("vetendasliq")}
            defaultText="Ölkə seçin"
            variant="form"
            isSearchable={true}
            searchPlaceholder="Axtar..."
            error={errors?.vetendasliq?.message}
          />
        </div>
        <BirthPlaceField
          birthCountry={value.dogumOlkesi}
          birthCity={value.dogumSeheri}
          onBirthCountryChange={onBirthCountryChange}
          onBirthCityChange={(val) => onFieldChange("dogumSeheri", val)}
          onBirthCountryBlur={() => onFieldBlur("dogumOlkesi")}
          onBirthCityBlur={() => onFieldBlur("dogumSeheri")}
          countryLabel="Doğulduğu ölkə"
          cityLabel="Doğulduğu şəhər/rayon"
          countryRequired={true}
          cityRequired={!!value.dogumOlkesi}
          classNames={{
            fieldGroup: styles.fieldGroup,
            fieldLabel: styles.fieldLabel,
            requiredStar: "required-star",
          }}
          error={errors?.dogumOlkesi?.message}
          cityError={errors?.dogumSeheri?.message}
        />
        {isDetailsMode && (
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="username">
              İstifadəçi adı
            </label>
            <FormInput
              id="username"
              type="text"
              label=""
              placeholder="-"
              value={value.username || ""}
              onChange={() => undefined}
              disabled={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};
