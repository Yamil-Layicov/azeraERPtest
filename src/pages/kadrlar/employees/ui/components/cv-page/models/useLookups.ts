import { lookupsService } from "@/features/lookups";
import { getBackendErrorMessage } from "@/shared/api/httpClient";
import type { AxiosError } from "axios";
import { useState, useEffect, useMemo, useCallback } from "react";
import toast from "react-hot-toast";

let cachedLookupsData: any = null;
let cachedSocialStatusesData: any[] | null = null;
let isFetching = false;
let fetchPromise: Promise<any> | null = null;

export const useLookups = (shouldFetch = true) => {
  const [lookupsData, setLookupsData] = useState<any>(cachedLookupsData);

  const [socialStatusesData, setSocialStatusesData] = useState<any[]>(
    cachedSocialStatusesData || [],
  );

  const [isLoading, setIsLoading] = useState(!cachedLookupsData && shouldFetch);

  useEffect(() => {
    if (!shouldFetch) return;

    if (cachedLookupsData) return;

    if (isFetching && fetchPromise) {
      setIsLoading(true);
      fetchPromise.then(() => {
        setLookupsData(cachedLookupsData);

        setSocialStatusesData(cachedSocialStatusesData || []);
        setIsLoading(false);
      });
      return;
    }

    isFetching = true;
    setIsLoading(true);

    fetchPromise = Promise.all([
      lookupsService.getLookups(),
    ])
      .then(
        ([
          lookups,
        ]) => {
          cachedLookupsData = lookups;
          setLookupsData(lookups);
        },
      )
      .catch((err) => toast.error(getBackendErrorMessage(err as AxiosError) || "Lookups məlumatları alınarkən xəta baş verdi"))
      .finally(() => {
        isFetching = false;
        fetchPromise = null;
        setIsLoading(false);
      });
  }, [shouldFetch]);
  const gender = useMemo(
    () => lookupsData?.result?.genders || [],
    [lookupsData],
  );
  const cities = useMemo(
    () => lookupsData?.result?.cities || [],
    [lookupsData],
  );
  const countries = useMemo(
    () => lookupsData?.result?.countries || [],
    [lookupsData],
  );
  const Languages = useMemo(
    () => lookupsData?.result?.languageSkills || [],
    [lookupsData],
  );
  const socialPlatforms = useMemo(
    () => lookupsData?.result?.socialPlatforms || [],
    [lookupsData],
  );

  const ProgramSkills = useMemo(
    () => lookupsData?.result?.programSkills || [],
    [lookupsData],
  );
  const proficiencyLevels = useMemo(
    () => lookupsData?.result?.proficiencyLevels || [],
    [lookupsData],
  );
  const contactTypes = useMemo(
    () => lookupsData?.result?.contactTypes || [],
    [lookupsData],
  );
  const maritalStatuses = useMemo(
    () => lookupsData?.result?.maritalStatuses || [],
    [lookupsData],
  );
  const documentTypes = useMemo(
    () => lookupsData?.result?.documentTypes || [],
    [lookupsData],
  );
  const educationInstitutions = useMemo(
    () => lookupsData?.result?.educationInstitutionNames || [],
    [lookupsData],
  );
  const specialties = useMemo(
    () => lookupsData?.result?.specialties || [],
    [lookupsData],
  );
  const rewardTypes = useMemo(
    () => lookupsData?.result?.rewardTypes || [],
    [lookupsData],
  );
  const disciplinaryActionTypes = useMemo(
    () => lookupsData?.result?.disciplinaryActionTypes || [],
    [lookupsData],
  );

  const legalBasises = useMemo(
    () => lookupsData?.result?.legalBasis || [],
    [lookupsData],
  );
  const relationshipTypes = useMemo(
    () => lookupsData?.result?.relationshipTypes || [],
    [lookupsData],
  );
  const organs = useMemo(
    () => lookupsData?.result?.organs || [],
    [lookupsData],
  );
  const militaryStatuses = useMemo(
    () => lookupsData?.result?.militaryStatuses || [],
    [lookupsData],
  );
  const militaryRanks = useMemo(
    () => lookupsData?.result?.militaryRanks || [],
    [lookupsData],
  );
  const socialStatuses = useMemo(
    () => lookupsData?.result?.socialStatus || [],
    [lookupsData],
  );
  const otherPrograms = useMemo(
    () => lookupsData?.result?.otherPrograms || [],
    [lookupsData],
  );
  const educationLevels = useMemo(
    () => lookupsData?.result?.educationLevels || [],
    [lookupsData],
  );
  const stateAwardTypes = useMemo(
    () => lookupsData?.result?.stateAwardTypes || [],
    [lookupsData],
  );
  const getGenderLabel = useCallback((genderId: string | number | null | undefined) => {
    if (!genderId) return "";
    const Gender = gender.find((c: any) => String(c.value) === String(genderId));
    return Gender ? Gender.label : genderId;
  }, [gender]);
  const getCityLabel = useCallback((cityId: string | number | null | undefined) => {
    if (!cityId) return "";
    const city = cities.find((c: any) => String(c.value) === String(cityId));
    return city ? city.label : cityId;
  }, [cities]);

  const getCountryLabel = useCallback((countryCode: string | number | null | undefined) => {
    if (!countryCode) return "";
    const country = countries.find(
      (c: any) => String(c.value) === String(countryCode),
    );
    return country ? country.label : countryCode;
  }, [countries]);

  const getLanguageLabel = useCallback((code: string | null | undefined) => {
    if (!code) return "";
    const language = Languages.find(
      (c: any) => String(c.value) === String(code),
    );
    return language ? language.label : code;
  }, [Languages]);

  const getProgramSkillLabel = useCallback((code: string | null | undefined) => {
    if (!code) return "";
    const skill = ProgramSkills.find(
      (c: any) => String(c.value) === String(code),
    );
    return skill ? skill.label : code;
  }, [ProgramSkills]);

  const getOtherProgramLabel = useCallback((code: string | null | undefined) => {
    if (!code) return "";
    const program = otherPrograms.find(
      (c: any) => String(c.value) === String(code),
    );
    return program ? program.label : code;
  }, [otherPrograms]);

  const getProficiencyLevelLabel = useCallback((code: string | null | undefined) => {
    if (!code) return "";
    const level = proficiencyLevels.find(
      (c: any) => String(c.value) === String(code),
    );
    return level ? level.label : code;
  }, [proficiencyLevels]);

  const getContactTypeLabel = useCallback((code: string | null | undefined) => {
    if (!code) return "";
    const contactType = contactTypes.find(
      (c: any) => String(c.value) === String(code),
    );
    return contactType ? contactType.label : code;
  }, [contactTypes]);

  const getSocialPlatformLabel = useCallback((code: string | null | undefined) => {
    if (!code) return "";
    const platform = socialPlatforms.find(
      (c: any) => String(c.value) === String(code),
    );
    return platform ? platform.label : code;
  }, [socialPlatforms]);

  const getMaritalStatusLabel = useCallback((value: string | number | null | undefined) => {
    if (!value) return "";
    const marital = maritalStatuses.find(
      (c: any) => String(c.value) === String(value),
    );
    return marital ? marital.label : value;
  }, [maritalStatuses]);

  const getDocumentTypeLabel = useCallback((code: string | null | undefined) => {
    if (!code) return "";
    const docType = documentTypes.find(
      (t: any) => String(t.value) === String(code),
    );
    return docType ? docType.label : code;
  }, [documentTypes]);

  const getSocialStatusLabel = useCallback((code: string | null | undefined) => {
    if (!code) return "";
    const social = socialStatuses.find(
      (t: any) => String(t.value) === String(code),
    );
    return social ? social.label : code;
  }, [socialStatuses]);

  const getEducationInstitutionLabel = useCallback((code: string | null | undefined) => {
    if (!code) return "";
    const eduInst = educationInstitutions.find(
      (t: any) => String(t.value) === String(code),
    );
    return eduInst ? eduInst.label : code;
  }, [educationInstitutions]);

  const getSpecialtyLabel = useCallback((code: string | null | undefined) => {
    if (!code) return "";
    const spec = specialties.find((t: any) => String(t.value) === String(code));
    return spec ? spec.label : code;
  }, [specialties]);

  const getRewardTypeLabel = useCallback((code: string | null | undefined) => {
    if (!code) return "";
    const reward = rewardTypes.find(
      (t: any) => String(t.value) === String(code),
    );
    return reward ? reward.label : code;
  }, [rewardTypes]);

  const getDisciplinaryActionTypeLabel = useCallback((code: string | null | undefined) => {
    if (!code) return "";
    const discip = disciplinaryActionTypes.find(
      (t: any) => String(t.value) === String(code),
    );
    return discip ? discip.label : code;
  }, [disciplinaryActionTypes]);

  const getLegalBasisLabel = useCallback((code: string | null | undefined) => {
    if (!code) return "";
    const legal = legalBasises.find(
      (t: any) => String(t.value) === String(code),
    );
    return legal ? legal.label : code;
  }, [legalBasises]);

  const getRelationshipTypeLabel = useCallback((code: string | null | undefined) => {
    if (!code) return "";
    const relation = relationshipTypes.find(
      (t: any) => String(t.value) === String(code),
    );
    return relation ? relation.label : code;
  }, [relationshipTypes]);

  const getOrganLabel = useCallback((code: string | null | undefined) => {
    if (!code) return "";
    const organ = organs.find((t: any) => String(t.value) === String(code));
    return organ ? organ.label : code;
  }, [organs]);

  const getMilitaryStatusLabel = useCallback((code: string | null | undefined) => {
    if (!code) return "";
    const status = militaryStatuses.find(
      (t: any) => String(t.value) === String(code),
    );
    return status ? status.label : code;
  }, [militaryStatuses]);

  const getMilitaryRankLabel = useCallback((code: string | null | undefined) => {
    if (!code) return "";
    const rank = militaryRanks.find(
      (t: any) => String(t.value) === String(code),
    );
    return rank ? rank.label : code;
  }, [militaryRanks]);

  const getEducationLevelLabel = useCallback((code: string | null | undefined) => {
    if (!code) return "";
    const eduLevel = educationLevels.find(
      (t: any) => String(t.value) === String(code),
    );
    return eduLevel ? eduLevel.label : code;
  }, [educationLevels]);

  const getStateAwardTypeLabel = useCallback((code: string | null | undefined) => {
    if (!code) return "";
    const awardType = stateAwardTypes.find(
      (t: any) => String(t.value) === String(code),
    );
    return awardType ? awardType.label : code;
  }, [stateAwardTypes]);

  return {
    cities,
    countries,
    documentTypes,
    educationInstitutions,
    specialties,
    rewardTypes,
    disciplinaryActionTypes,
    legalBasises,
    relationshipTypes,
    organs,
    militaryStatuses,
    militaryRanks,
    getMilitaryRankLabel,
    getCityLabel,
    getCountryLabel,
    getLanguageLabel,
    getProgramSkillLabel,
    getOtherProgramLabel,
    getProficiencyLevelLabel,
    getContactTypeLabel,
    getSocialPlatformLabel,
    getDocumentTypeLabel,
    getEducationInstitutionLabel,
    getSpecialtyLabel,
    getRewardTypeLabel,
    getDisciplinaryActionTypeLabel,
    getLegalBasisLabel,
    getRelationshipTypeLabel,
    getOrganLabel,
    getMilitaryStatusLabel,
    isLoading,
    maritalStatuses,
    getMaritalStatusLabel,
    socialStatusesData,
    getSocialStatusLabel,
    getEducationLevelLabel,
    getStateAwardTypeLabel,
    getGenderLabel,
  };
};
