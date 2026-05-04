import React, { useState } from "react";
import styles from "./EmployeesFilterPanel.module.css";
import { Button } from "@/shared/ui/button";
import { CustomSelect } from "@/shared/ui/select";
import { EnumLookupSelect } from "@/features/lookups";
import { FormInput } from "@/shared/ui/input";
import { ModernDatePicker } from "@/shared/ui/date-picker";
import type { Option } from "@/shared/types";
import {
  useEmployeeStatuses,
  useSubCompanies,
  useCountries,
  useEnumItemsByCode,
  useCitiesByCountryCode,
  usePositions,
} from "@/features/lookups/hooks";
import { useDebounce } from "@/shared/hooks";

export interface EmployeesFilterState {
  firstName: string;
  lastName: string;
  fatherName: string;
  birthDate: Date | null;
  status: Option | null;
  hireDate: Date | null;
  department: Option | null;
  company: Option | null;
  fin: string;
  gender: Option | null;
  email: string;
  employmentType: Option | null;
  birthCountry: Option | null;
  birthCity: Option | string | null;
  citizenship: Option | null;
  maritalStatus: Option | null;
  phonePrefix: Option | null;
  phoneNumber: string;
  socialPlatform: Option | null;
  socialAccount: string;
  position: Option | null;
  username: string;
  fonetId: string;
  referrer: string;
  staffCategory: Option | null;
}

interface EmployeesFilterPanelProps {
  onSearch: (filters: EmployeesFilterState) => void;
  onClear?: () => void; // YENİ: Valideynə xəbər vermək üçün funksiya
  rootCompaniesOptions: Option[];
  onOpenCompany?: () => void;
  isCompaniesLoading?: boolean;
}

export const EmployeesFilterPanel: React.FC<EmployeesFilterPanelProps> = ({
  onSearch,
  onClear, 
  rootCompaniesOptions,
  onOpenCompany,
  isCompaniesLoading,
}) => {
  const [filters, setFilters] = useState({
    firstName: "",
    lastName: "",
    fatherName: "",
    birthDate: null as Date | null,
    status: null as Option | null,
    hireDate: null as Date | null,
    department: null as Option | null,
    company: null as Option | null,
    fin: "",
    gender: null as Option | null,
    email: "",
    employmentType: null as Option | null,
    birthCountry: null as Option | null,
    birthCity: null as Option | null,
    citizenship: null as Option | null,
    maritalStatus: null as Option | null,
    phonePrefix: null as Option | null,
    phoneNumber: "",
    socialPlatform: null as Option | null,
    socialAccount: "",
    position: null as Option | null,
    username: "",
    fonetId: "",
    referrer: "",
    staffCategory: null as Option | null,
  });

  const [hasOpenedStatuses, setHasOpenedStatuses] = useState(false);
  const { options: statusOptionsFromApi, isLoading: isStatusesLoading } =
    useEmployeeStatuses(hasOpenedStatuses || !!filters.status);

  const statusOptions = statusOptionsFromApi.filter(
    (option) => option.id !== "Draft",
  );

  const [hasOpenedGender, setHasOpenedGender] = useState(false);
  const { options: genderOptions, isLoading: isGenderLoading } =
    useEnumItemsByCode("Genders", hasOpenedGender || !!filters.gender);

  const [hasOpenedEmploymentType, setHasOpenedEmploymentType] = useState(false);
  const { options: employmentTypeOptions, isLoading: isEmploymentTypeLoading } =
    useEnumItemsByCode(
      "EmploymentTypes",
      hasOpenedEmploymentType || !!filters.employmentType,
    );

  const [hasOpenedCountries, setHasOpenedCountries] = useState(false);
  const { options: countryOptions, isLoading: isCountriesLoading } =
    useCountries(hasOpenedCountries || !!filters.birthCountry);

  const [hasOpenedCitizenship, setHasOpenedCitizenship] = useState(false);
  const { options: citizenshipOptions, isLoading: isCitizenshipLoading } =
    useCountries(hasOpenedCitizenship || !!filters.citizenship);

  const [hasOpenedPhonePrefix, setHasOpenedPhonePrefix] = useState(false);
  const { options: phonePrefixOptions, isLoading: isPhonePrefixLoading } =
    useEnumItemsByCode(
      "ContactTypes",
      hasOpenedPhonePrefix || !!filters.phonePrefix,
    );

  const [hasOpenedSocialPlatforms, setHasOpenedSocialPlatforms] =
    useState(false);
  const {
    options: socialPlatformOptions,
    isLoading: isSocialPlatformsLoading,
  } = useEnumItemsByCode(
    "SocialPlatforms",
    hasOpenedSocialPlatforms || !!filters.socialPlatform,
  );

  const [hasOpenedPositions, setHasOpenedPositions] = useState(false);
  const [positionSearch, setPositionSearch] = useState("");
  const debouncedPositionSearch = useDebounce(positionSearch, 500);
  const {
    options: positionOptions,
    isLoading: isPositionsLoading,
    fetchNextPage: fetchNextPositions,
    hasNextPage: hasNextPositions,
    isFetchingNextPage: isFetchingNextPositions,
  } = usePositions(
    debouncedPositionSearch,
    hasOpenedPositions || !!filters.position,
  );

  const [hasOpenedStaffCategories, setHasOpenedStaffCategories] =
    useState(false);
  const { options: staffCategoryOptions, isLoading: isStaffCategoriesLoading } =
    useEnumItemsByCode(
      "StaffCategories",
      hasOpenedStaffCategories || !!filters.staffCategory,
    );

  const [hasOpenedCities, setHasOpenedCities] = useState(false);
  const isAZE = filters.birthCountry?.id === "AZE";
  const { options: cityOptions, isLoading: isCitiesLoading } =
    useCitiesByCountryCode(
      isAZE ? "AZE" : null,
      hasOpenedCities || (isAZE && !!filters.birthCity),
    );

  const { options: departmentOptions, isLoading: isDepartmentsLoading } =
    useSubCompanies(filters.company ? String(filters.company.id) : null);

  const handleChange = (
    field: keyof EmployeesFilterState,
    value: string | Option | null | Date | null,
  ) => {
    setFilters((prev) => {
      const next = { ...prev, [field]: value };

      if (field === "company") {
        next.department = null;
      }

      if (field === "birthCountry") {
        next.birthCity = null;
      }

      return next;
    });
  };

  const handleSearchClick = () => {
    onSearch(filters);
  };

  const handleClear = () => {
    setFilters({
      firstName: "",
      lastName: "",
      fatherName: "",
      birthDate: null,
      status: null,
      hireDate: null,
      department: null,
      company: null,
      fin: "",
      gender: null,
      email: "",
      employmentType: null,
      birthCountry: null,
      birthCity: null,
      citizenship: null,
      maritalStatus: null,
      phonePrefix: null,
      phoneNumber: "",
      socialPlatform: null,
      socialAccount: "",
      position: null,
      username: "",
      fonetId: "",
      referrer: "",
      staffCategory: null,
    });
    setHasOpenedStatuses(false);
    setHasOpenedGender(false);
    setHasOpenedEmploymentType(false);
    setHasOpenedCountries(false);
    setHasOpenedCitizenship(false);
    setHasOpenedPhonePrefix(false);
    setHasOpenedSocialPlatforms(false);
    setHasOpenedPositions(false);
    setHasOpenedStaffCategories(false);
    setHasOpenedCities(false);

    if (onClear) {
      onClear();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {/* --- ROW 2 --- */}
        <div>
          <span className={styles.label}>Status</span>
          <CustomSelect
            dataContext="filterPanel"
            options={statusOptions}
            value={filters.status}
            onChange={(v) => handleChange("status", v)}
            defaultText={isStatusesLoading ? "Yüklənir..." : "Seçin"}
            onOpen={() => setHasOpenedStatuses(true)}
          />
        </div>
        <div className={styles.datePickerField}>
          <span className={styles.label}>İşə qəbul tarixi</span>
          <ModernDatePicker
            value={filters.hireDate}
            onChange={(d) => handleChange("hireDate", d)}
          />
        </div>
        <div>
          <span className={styles.label}>Şirkət</span>
          <CustomSelect
            dataContext="filterPanel"
            options={rootCompaniesOptions}
            value={filters.company}
            onChange={(v) => handleChange("company", v)}
            defaultText={isCompaniesLoading ? "Yüklənir..." : "Seçin"}
            onOpen={onOpenCompany}
            isSearchable={true}
            searchPlaceholder="Axtar..."
          />
        </div>
        <div>
          <span className={styles.label}>Departament / Şöbə / Bölmə</span>
          <CustomSelect
            dataContext="filterPanel"
            options={departmentOptions}
            value={filters.department}
            onChange={(v) => handleChange("department", v)}
            defaultText={
              isDepartmentsLoading
                ? "Yüklənir..."
                : !filters.company
                  ? "Əvvəlcə şirkət seçin"
                  : "Seçin"
            }
            disabled={!filters.company || isDepartmentsLoading}
            isSearchable={true}
            searchPlaceholder="Axtar..."
          />
        </div>

        {/* --- ROW 1 --- */}
        <FormInput
          type="text"
          id="filter-firstName"
          label="Ad"
          placeholder="Daxil edin"
          value={filters.firstName}
          onChange={(v) => handleChange("firstName", v)}
        />
        <FormInput
          type="text"
          id="filter-lastName"
          label="Soyad"
          placeholder="Daxil edin"
          value={filters.lastName}
          onChange={(v) => handleChange("lastName", v)}
        />
        <FormInput
          type="text"
          id="filter-fatherName"
          label="Ata adı"
          placeholder="Daxil edin"
          value={filters.fatherName}
          onChange={(v) => handleChange("fatherName", v)}
        />
        <div className={styles.datePickerField}>
          <span className={styles.label}>Doğum tarixi</span>
          <ModernDatePicker
            value={filters.birthDate}
            onChange={(d) => handleChange("birthDate", d)}
          />
        </div>

        {/* --- ROW 3 --- */}
        <FormInput
          type="text"
          id="filter-fin"
          label="FIN"
          placeholder="7 simvol"
          value={filters.fin}
          onChange={(v) =>
            handleChange("fin", typeof v === "string" ? v.toUpperCase() : v)
          }
          maxLength={7}
        />
        <div>
          <span className={styles.label}>Cins</span>
          <CustomSelect
            dataContext="filterPanel"
            options={genderOptions}
            value={filters.gender}
            onChange={(v) => handleChange("gender", v)}
            defaultText={isGenderLoading ? "Yüklənir..." : "Seçin"}
            onOpen={() => setHasOpenedGender(true)}
          />
        </div>
        <FormInput
          type="email"
          id="filter-email"
          label="Korporativ email"
          placeholder="example@comp.az"
          value={filters.email}
          onChange={(v) => handleChange("email", v)}
        />
        <div>
          <span className={styles.label}>Rəsmiləşmə forması</span>
          <CustomSelect
            dataContext="filterPanel"
            options={employmentTypeOptions}
            value={filters.employmentType}
            onChange={(v) => handleChange("employmentType", v)}
            defaultText={isEmploymentTypeLoading ? "Yüklənir..." : "Seçin"}
            onOpen={() => setHasOpenedEmploymentType(true)}
          />
        </div>

        {/* --- ROW 4 --- */}
        <div>
          <span className={styles.label}>Doğulduğu ölkə</span>
          <CustomSelect
            dataContext="filterPanel"
            options={countryOptions}
            value={filters.birthCountry}
            onChange={(v) => handleChange("birthCountry", v)}
            defaultText={isCountriesLoading ? "Yüklənir..." : "Seçin"}
            onOpen={() => setHasOpenedCountries(true)}
            isSearchable={true}
            searchPlaceholder="Axtar..."
          />
        </div>
        <div>
          <span className={styles.label}>Doğulduğu şəhər/rayon</span>
          {isAZE ? (
            <CustomSelect
              dataContext="filterPanel"
              options={cityOptions}
              value={
                typeof filters.birthCity !== "string" ? filters.birthCity : null
              }
              onChange={(v) => handleChange("birthCity", v)}
              defaultText={isCitiesLoading ? "Yüklənir..." : "Seçin"}
              onOpen={() => setHasOpenedCities(true)}
              disabled={!filters.birthCountry}
            />
          ) : (
            <FormInput
              type="text"
              id="filter-birthCity"
              label=""
              placeholder="Daxil edin"
              value={
                typeof filters.birthCity === "string" ? filters.birthCity : ""
              }
              onChange={(v) => handleChange("birthCity", v)}
              disabled={!filters.birthCountry}
            />
          )}
        </div>
        <div>
          <span className={styles.label}>Vətəndaşlığı</span>
          <CustomSelect
            dataContext="filterPanel"
            options={citizenshipOptions}
            value={filters.citizenship}
            onChange={(v) => handleChange("citizenship", v)}
            defaultText={isCitizenshipLoading ? "Yüklənir..." : "Seçin"}
            onOpen={() => setHasOpenedCitizenship(true)}
            isSearchable={true}
            searchPlaceholder="Axtar..."
          />
        </div>
        <div>
          <span className={styles.label}>Ailə vəziyyəti</span>
          <EnumLookupSelect
            code="MaritalStatuses"
            value={filters.maritalStatus}
            onChange={(v) => handleChange("maritalStatus", v)}
            defaultText="Seçin"
            variant="default"
          />
        </div>

        {/* --- ROW 5 (Composite Fields) --- */}
        <div>
          <span className={styles.label}>Telefonlar</span>
          <div className={styles.compositeGroup}>
            <div className={styles.compositeSelect}>
              <CustomSelect
                dataContext="filterPanel"
                options={phonePrefixOptions}
                value={filters.phonePrefix}
                onChange={(v) => handleChange("phonePrefix", v)}
                defaultText={isPhonePrefixLoading ? "..." : "Seçin"}
                onOpen={() => setHasOpenedPhonePrefix(true)}
                variant="default"
                dropdownWidthExtra={20}
              />
            </div>
            <div className={styles.compositeInput}>
              <FormInput
                type="text"
                id="filter-phoneNumber"
                label=""
                placeholder="XXX XX XX"
                value={filters.phoneNumber}
                onChange={(v) => handleChange("phoneNumber", v)}
              />
            </div>
          </div>
        </div>
        <div>
          <span className={styles.label}>Sosial hesablar</span>
          <div className={styles.compositeGroup}>
            <div className={styles.compositeSelect}>
              <CustomSelect
                dataContext="filterPanel"
                options={socialPlatformOptions}
                value={filters.socialPlatform}
                onChange={(v) => handleChange("socialPlatform", v)}
                defaultText={isSocialPlatformsLoading ? "Yüklənir..." : "Seçin"}
                onOpen={() => setHasOpenedSocialPlatforms(true)}
                dropdownWidthExtra={20}
              />
            </div>
            <div className={styles.compositeInput}>
              <FormInput
                type="text"
                id="filter-socialAccount"
                label=""
                placeholder="Link daxil edin"
                value={filters.socialAccount}
                onChange={(v) => handleChange("socialAccount", v)}
              />
            </div>
          </div>
        </div>
        <div>
          <span className={styles.label}>Vəzifə</span>
          <CustomSelect
            dataContext="filterPanel"
            options={positionOptions}
            value={filters.position}
            onChange={(v) => handleChange("position", v)}
            defaultText={isPositionsLoading ? "Yüklənir..." : "Seçin"}
            onOpen={() => setHasOpenedPositions(true)}
            isSearchable={true}
            onSearch={(q) => setPositionSearch(q)}
            isLoading={isFetchingNextPositions || isPositionsLoading}
            onScroll={(e) => {
              const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
              if (
                scrollHeight - scrollTop <= clientHeight + 10 &&
                hasNextPositions &&
                !isFetchingNextPositions
              ) {
                fetchNextPositions();
              }
            }}
          />
        </div>
        <FormInput
          type="text"
          id="filter-username"
          label="İstifadəçi adı"
          placeholder="username"
          value={filters.username}
          onChange={(v) => handleChange("username", v)}
        />

        {/* --- ROW 6 --- */}
        <FormInput
          type="text"
          id="filter-fonetId"
          label="Fonet İD (tibb heyəti)"
          placeholder="ID daxil edin"
          value={filters.fonetId}
          onChange={(v) => handleChange("fonetId", v)}
        />
        <FormInput
          type="text"
          id="filter-referrer"
          label="Tövsiyyə edən"
          placeholder="Ad Soyad"
          value={filters.referrer}
          onChange={(v) => handleChange("referrer", v)}
        />
        <div>
          <span className={styles.label}>Heyət</span>
          <CustomSelect
            dataContext="filterPanel"
            options={staffCategoryOptions}
            value={filters.staffCategory}
            onChange={(v) => handleChange("staffCategory", v)}
            defaultText={isStaffCategoriesLoading ? "Yüklənir..." : "Seçin"}
            onOpen={() => setHasOpenedStaffCategories(true)}
          />
        </div>
      </div>

      <div className={styles.actions}>
        <Button
          variant="primary"
          onClick={handleSearchClick}
          className={styles.actionBtn}
        >
          Axtar
        </Button>
        <Button
          variant="secondary"
          onClick={handleClear}
          className={styles.actionBtn}
        >
          Təmizlə
        </Button>
      </div>
    </div>
  );
};
