/** Azərbaycan üçün şəhər select, digər ölkələr üçün text input */

export const AZERBAIJAN_COUNTRY_ID = "1";

export const AZERBAIJAN_OPTION = {
  id: AZERBAIJAN_COUNTRY_ID,
  fullName: "Azərbaycan",
  role: "",
} as const;
const AZERBAIJAN_FULL_NAME = "Azərbaycan";

export interface CountryLike {
  id?: number | string;
  fullName?: string;
}

export const isAzerbaijanCountry = (country: CountryLike | null): boolean => {
  if (!country) return false;
  const id = country.id != null ? String(country.id) : "";
  return id === AZERBAIJAN_COUNTRY_ID || (country.fullName ?? "").trim() === AZERBAIJAN_FULL_NAME;
};

export const getCountryIdForCitiesApi = (country: CountryLike | null): string | null => {
  if (!country) return null;
  if (country.id != null) return String(country.id);
  return isAzerbaijanCountry(country) ? AZERBAIJAN_COUNTRY_ID : null;
};
