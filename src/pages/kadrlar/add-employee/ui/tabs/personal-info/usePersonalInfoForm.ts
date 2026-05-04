import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  personalInfoSchema,
  type PersonalInfoValues,
  type PersonalInfoFormValues,
} from "@/features/kadrlar/create-worker/model/schemas";
import { usePersonalInfoMutation } from "@/features/kadrlar/create-worker";
import { employeesService } from "@/features/kadrlar/employees/api/employeesService";
import { EmployeeDataMapper } from "@/pages/kadrlar/create-employee/utils/employeeDataMapper";
import { useAddEmployeeStore } from "@/features/kadrlar/create-worker/model/useAddEmployeeStore";
import { lookupsService } from "@/features/lookups/api/lookupsService";
import { useState, useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import { getBackendErrorMessage } from "@/shared/api/httpClient";
import axios from "axios";
import type { Option } from "@/shared/types";
import { queryClient } from "@/shared/lib/react-query";
import { LOOKUPS_QUERY_KEYS } from "@/features/lookups/hooks";
import { COUNTRIES_QUERY_KEY } from "@/features/lookups/hooks/useCountries";
import type { AxiosError } from "axios";

const DEFAULT_PERSONAL_INFO_VALUES: PersonalInfoFormValues = {
  fin: "",
  sirket: null,
  resmilesmeFormasi: null,
  vetendasliq: null,
  ad: "",
  soyad: "",
  ataAdi: "",
  dogumTarixi: null,
  dogumOlkesi: null,
  cinsi: null,
  dogumSeheri: "",
  aileVeziyyeti: null,
  tovsiyeEden: "",
  avatar: null,
  faktikiSeher: "",
  faktikiUnvan: "",
  qeydiyyatEynidir: true,
  qeydiyyatOlke: null,
  qeydiyyatSeher: "",
  qeydiyyatUnvan: "",
  documents: [],
  contacts: [],
  socialMedia: [],
  programUsers: [],
  pinChecked: false,
};

export const usePersonalInfoForm = ({
  onDirtyChange,
  pageMode = "add",
}: {
  onDirtyChange?: (isDirty: boolean) => void;
  pageMode?: "add" | "details";
} = {}) => {
  const setPinSearchRawDataStore = useAddEmployeeStore(
    (state) => state.setPinSearchRawData,
  );
  const pinSearchRawDataStore = useAddEmployeeStore(
    (state) => state.pinSearchRawData,
  );
  const setPhotoIdStore = useAddEmployeeStore((state) => state.setPhotoId);
  const globalResetCounter = useAddEmployeeStore(
    (state) => state.globalResetCounter,
  );
  const triggerGlobalReset = useAddEmployeeStore(
    (state) => state.triggerGlobalReset,
  );
  const employmentId = useAddEmployeeStore((state) => state.personId);
  const nextStep = useAddEmployeeStore((state) => state.nextStep);

  const [isPinSearchResultModalOpen, setIsPinSearchResultModalOpen] =
    useState(false);
  const [pinSearchResultData, setPinSearchResultData] = useState<any>(null); // TODO: Define specific type for display data
  const [tempRawData, setTempRawData] = useState<any>(null); // This comes from backend response
  const [isFinDisabled, setIsFinDisabled] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [employmentTypesMap, setEmploymentTypesMap] = useState<Map<
    string,
    Option
  > | null>(null);
  const [detailsStatus, setDetailsStatus] = useState("");
  const [detailsUsername, setDetailsUsername] = useState("");
  const [detailsPosition, setDetailsPosition] = useState("");
  const [detailsDepartment, setDetailsDepartment] = useState("");
  const [detailsStaffCategory, setDetailsStaffCategory] = useState("");
  const [avatarFileName, setAvatarFileName] = useState<string | null>(null);
  const [avatarFileSize, setAvatarFileSize] = useState<number | null>(null);

  const mapLookupItemsToOptionMap = useCallback(
    (items: Array<{ value: string; label: string }> = []) => {
      const nextMap = new Map<string, Option>();
      items.forEach((item) => {
        if (item?.value !== null && item?.value !== undefined) {
          nextMap.set(String(item.value).toLowerCase(), {
            id: item.value,
            fullName: item.label,
          });
        }
      });
      return nextMap;
    },
    [],
  );

  const getLookupsData = useCallback(async () => {
    return queryClient.fetchQuery({
      queryKey: ["lookups", "all"],
      queryFn: ({ signal }) => lookupsService.getLookups(signal),
      staleTime: 1000 * 60 * 60,
      gcTime: 1000 * 60 * 60 * 2,
    });
  }, []);

  const getEnumLookup = useCallback(async (code: string) => {
    return queryClient.fetchQuery({
      queryKey: LOOKUPS_QUERY_KEYS.enumByCode(code),
      queryFn: ({ signal }) =>
        lookupsService.getEnumItemsByTypeCode(code, signal),
      staleTime: 1000 * 60 * 60,
      gcTime: 1000 * 60 * 60 * 2,
    });
  }, []);

  const getCountriesLookup = useCallback(async () => {
    return queryClient.fetchQuery({
      queryKey: COUNTRIES_QUERY_KEY,
      queryFn: ({ signal }) => lookupsService.getCountries(signal),
      staleTime: 1000 * 60 * 60,
      gcTime: 1000 * 60 * 60 * 2,
    });
  }, []);

  const loadEmploymentTypesMap = useCallback(async () => {
    const nextEmploymentTypesMap = new Map<string, Option>();
    try {
      if (pageMode === "details") {
        const response = await getLookupsData();
        const items = response?.result?.employmentTypes ?? [];
        items.forEach((e: any) => {
          if (e.value !== null && e.value !== undefined) {
            nextEmploymentTypesMap.set(String(e.value), {
              id: e.value,
              fullName: e.label,
            });
          }
        });
      } else {
        const response = await getEnumLookup("EmploymentTypes");
        if (response?.isSuccess && response.result) {
          response.result.forEach((e: any) => {
            if (e.value !== null && e.value !== undefined) {
              nextEmploymentTypesMap.set(String(e.value), {
                id: e.value,
                fullName: e.label,
              });
            }
          });
        }
      }
    } catch (err) {
      toast.error(
        getBackendErrorMessage(err as AxiosError) || "Xəta baş verdi",
      );
    }
    setEmploymentTypesMap(nextEmploymentTypesMap);
    return nextEmploymentTypesMap;
  }, [getEnumLookup, getLookupsData, pageMode]);

  const form = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(personalInfoSchema),
    mode: "onTouched",
    defaultValues: DEFAULT_PERSONAL_INFO_VALUES,
  });

  const {
    getValues,
    reset,
    setError,
    clearErrors,
    trigger,
    setValue,
    formState: { isDirty },
  } = form;

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  const { mutate: savePersonalInfo, isPending } = usePersonalInfoMutation(
    (data) => reset(data as PersonalInfoFormValues),
    pageMode,
  );

  useEffect(() => {
    if (globalResetCounter > 0) {
      reset(DEFAULT_PERSONAL_INFO_VALUES);
      setIsFinDisabled(false);
      setAvatarPreview(null);
      setEmploymentTypesMap(null);
      setTempRawData(null);
      setPinSearchResultData(null);
      setIsPinSearchResultModalOpen(false);
      setPinSearchRawDataStore(null);
      setAvatarFileName(null);
      setAvatarFileSize(null);
    }
  }, [globalResetCounter, reset, setPinSearchRawDataStore]);

  useEffect(() => {
    void loadEmploymentTypesMap();
  }, [loadEmploymentTypesMap]);

  const handleSearchByPin = useCallback(async () => {
    const pin = getValues("fin");
    if (!pin || pin.trim().length === 0) {
      setError("fin", { message: "FİN daxil edilməlidir" });
      return;
    }

    clearErrors("fin");

    try {
      const response =
        pageMode === "add"
          ? await employeesService.getByPinAddEmployee(pin)
          : await employeesService.getByPin(pin);
      const data = response;
      const isSuccess = (data as any).isSuccess ?? true;
      const result = (data as any).result;

      if (!isSuccess || !result) {
        const backendMessage = data.errorMessage || "Məlumat tapılmadı";
        setError("fin", { message: backendMessage });
        return;
      }

      setTempRawData(data);
      const displayData = EmployeeDataMapper.extractDisplayData(result as any);
      setPinSearchResultData(displayData);
      setIsPinSearchResultModalOpen(true);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) return;
        const message = getBackendErrorMessage(error as AxiosError);
        if (message) setError("fin", { message });
        return;
      }
      // Axios olmayan hata — interceptor devreye girmez, toast göster
      toast.error("Axtarış zamanı xəta baş verdi");

      const message = getBackendErrorMessage(error as any);
      setError("fin", { message });
    }
  }, [getValues, setError, clearErrors, pageMode]);

  const applyRawDataToForm = useCallback(
    async (rawData: any, showSuccessToast: boolean = true) => {
      if (!rawData) return;

      const result = rawData.result || rawData;
      const rootCompanyId = result?.rootCompanyId ?? null;
      const rootCompanyName =
        result?.rootCompanyName ?? (rootCompanyId ? String(rootCompanyId) : "");
      const employmentTypeCode = result?.employmentTypeCode ?? null;
      const referrerName = result?.referrerName ?? "";
      const statusText = result?.status ?? "";
      const usernameText = result?.username ?? "";
      const positionText =
        result?.positionName ??
        (result?.positionId ? String(result.positionId) : "");
      const departmentText =
        result?.organizationUnit ??
        result?.organizationUnitName ??
        (result?.organizationUnitId ? String(result.organizationUnitId) : "");

      const countryLookupMap = new Map<string, Option>();
      const maritalStatusMap = new Map<string, Option>();
      const genderMap = new Map<string, Option>();
      const documentTypeMap = new Map<string, Option>();
      const staffCategoryMap = new Map<string, Option>();
      let employmentTypeLookupMap: Map<string, Option> | null = null;

      try {
        if (pageMode === "details") {
          const lookupsResp = await getLookupsData();
          const lookupsResult = lookupsResp?.result ?? {};

          (lookupsResult.countries ?? []).forEach((c: any) => {
            if (c?.value)
              countryLookupMap.set(String(c.value).toUpperCase(), {
                id: c.value,
                fullName: c.label,
              });
          });

          const maritalMap = mapLookupItemsToOptionMap(
            lookupsResult.maritalStatuses ?? [],
          );
          maritalMap.forEach((value, key) => maritalStatusMap.set(key, value));

          const genderLookupMap = mapLookupItemsToOptionMap(
            lookupsResult.genders ?? [],
          );
          genderLookupMap.forEach((value, key) => genderMap.set(key, value));

          const documentMap = mapLookupItemsToOptionMap(
            lookupsResult.documentTypes ?? [],
          );
          documentMap.forEach((value, key) => documentTypeMap.set(key, value));

          (lookupsResult.staffCategories ?? []).forEach((s: any) => {
            if (s?.value !== null && s?.value !== undefined) {
              staffCategoryMap.set(String(s.value), {
                id: s.value,
                fullName: s.label,
              });
            }
          });
        } else {
          const [
            countryResp,
            maritalResp,
            genderResp,
            documentResp,
            staffCategoryResp,
          ] = await Promise.all([
            getCountriesLookup(),
            getEnumLookup("MaritalStatuses"),
            getEnumLookup("Genders"),
            getEnumLookup("DocumentTypes"),
            getEnumLookup("StaffCategories"),
          ]);

          if (countryResp.isSuccess && countryResp.result) {
            countryResp.result.forEach((c) => {
              if (c.value)
                countryLookupMap.set(String(c.value).toUpperCase(), {
                  id: c.value,
                  fullName: c.label,
                });
            });
          }
          if (maritalResp.isSuccess && maritalResp.result) {
            maritalResp.result.forEach((m) => {
              maritalStatusMap.set(String(m.value).toLowerCase(), {
                id: m.value,
                fullName: m.label,
              });
            });
          }
          if (genderResp.isSuccess && genderResp.result) {
            genderResp.result.forEach((g) => {
              genderMap.set(String(g.value).toLowerCase(), {
                id: g.value,
                fullName: g.label,
              });
            });
          }
          if (documentResp.isSuccess && documentResp.result) {
            documentResp.result.forEach((d) => {
              documentTypeMap.set(String(d.value).toLowerCase(), {
                id: d.value,
                fullName: d.label,
              });
            });
          }
          if (staffCategoryResp.isSuccess && staffCategoryResp.result) {
            staffCategoryResp.result.forEach((s: any) => {
              staffCategoryMap.set(String(s.value), {
                id: s.value,
                fullName: s.label,
              });
            });
          }
        }

        employmentTypeLookupMap = await loadEmploymentTypesMap();
      } catch (err) {
        toast.error(
          getBackendErrorMessage(err as AxiosError) ||
            "Şifrə yenilənərkən xəta baş verdi",
        );
      }

      const newValues: PersonalInfoFormValues = {
        ...DEFAULT_PERSONAL_INFO_VALUES,
        fin: result.pin || getValues("fin"),
        sirket:
          pageMode === "details"
            ? rootCompanyId
              ? { id: rootCompanyId, fullName: rootCompanyName }
              : null
            : null,
        resmilesmeFormasi:
          pageMode === "details"
            ? employmentTypeCode
              ? (employmentTypeLookupMap?.get(String(employmentTypeCode)) ??
                employmentTypesMap?.get(String(employmentTypeCode)) ??
                null)
              : null
            : null,
        ad: result.name || "",
        soyad: result.surname || "",
        ataAdi: result.patronymic || "",
        dogumTarixi: result.birthDate ? new Date(result.birthDate) : null,
        cinsi: genderMap.get(String(result.gender).toLowerCase()) || null,
        aileVeziyyeti:
          maritalStatusMap.get(String(result.maritalStatus).toLowerCase()) ||
          null,
        vetendasliq:
          countryLookupMap.get(result.citizenshipCode?.toUpperCase()) || null,
        dogumOlkesi:
          countryLookupMap.get(result.birthCountryCode?.toUpperCase()) || null,
        dogumSeheri:
          result.birthCountryCode?.toUpperCase() === "AZE"
            ? String(result.birthCityId || "")
            : result.foreignBirthCity || "",
        tovsiyeEden: pageMode === "details" ? referrerName : "",
        faktikiSeher: String(result.address?.actualCityId || ""),
        faktikiUnvan: result.address?.actualAddress || "",
        qeydiyyatEynidir: !!result.address?.isRegistrationSameAsActual,
        pinChecked: true,
      };

      if (!newValues.qeydiyyatEynidir && result.address) {
        const addr = result.address;
        newValues.qeydiyyatOlke =
          countryLookupMap.get(addr.registrationCountryCode?.toUpperCase()) ||
          null;
        newValues.qeydiyyatSeher =
          addr.registrationCountryCode?.toUpperCase() === "AZE"
            ? String(addr.registrationCityId || "")
            : addr.registrationForeignCity || "";
        newValues.qeydiyyatUnvan = addr.registrationAddress || "";
      }

      if (result.contacts) {
        newValues.contacts = result.contacts.map((c: any) => ({
          id: Math.random(),
          originalId: c.id,
          type: { id: c.type, fullName: String(c.type) },
          value: c.value,
          isPrimary: !!c.isCorporate,
        }));
      }

      if (result.documents) {
        newValues.documents = result.documents.map((d: any) => {
          const typeInfo = documentTypeMap.get(String(d.type).toLowerCase());
          return {
            id: Math.random(),
            originalId: d.id,
            type: typeInfo
              ? { id: typeInfo.id, fullName: typeInfo.fullName }
              : { id: d.type, fullName: String(d.type) },
            series: d.series || "",
            number: d.number || "",
            issueDate: d.issuedAt ? new Date(d.issuedAt) : null,
            expiryDate: d.expireAt ? new Date(d.expireAt) : null,
          };
        });
      }

      if (result.socialAccounts) {
        newValues.socialMedia = result.socialAccounts.map((s: any) => ({
          id: Math.random(),
          originalId: s.id,
          type: { id: s.type, fullName: String(s.type) },
          value: s.value,
        }));
      }

      if (result.externalAccounts) {
        newValues.programUsers = result.externalAccounts.map((p: any) => ({
          id: Math.random(),
          originalId: p.id,
          type: { id: p.type, fullName: String(p.type) },
          value: p.value,
        }));
      }

      const photoIdFromResponse = result?.photo?.id || result?.photoId || null;
      setAvatarFileName(result?.photo?.fileName || null);
      setAvatarFileSize(
        typeof result?.photo?.fileSize === "number"
          ? result.photo.fileSize
          : null,
      );
      if (photoIdFromResponse) {
        const downloadUrl = `/api/proxy/identity/file/download/${photoIdFromResponse}`;
        setAvatarPreview(downloadUrl);
        setPhotoIdStore(photoIdFromResponse);
        newValues.avatar = "existing-photo" as any;
      }

      reset(newValues);
      setDetailsStatus(String(statusText || ""));
      setDetailsUsername(String(usernameText || ""));
      setDetailsPosition(String(positionText || ""));
      setDetailsDepartment(String(departmentText || ""));
      setDetailsStaffCategory(
        String(
          result?.staffCategoryCode
            ? staffCategoryMap.get(String(result.staffCategoryCode))
                ?.fullName || result.staffCategoryCode
            : "",
        ),
      );
      setPinSearchRawDataStore(rawData);
      setIsFinDisabled(true);
      setIsPinSearchResultModalOpen(false);
      trigger();
      if (showSuccessToast) {
        toast.success("Məlumatlar dolduruldu");
      }
    },
    [
      setPinSearchRawDataStore,
      setPhotoIdStore,
      trigger,
      reset,
      getValues,
      loadEmploymentTypesMap,
      employmentTypesMap,
      pageMode,
      getCountriesLookup,
      getEnumLookup,
      getLookupsData,
      mapLookupItemsToOptionMap,
    ],
  );

  const handlePinSearchConfirm = useCallback(async () => {
    if (!tempRawData) return;
    await applyRawDataToForm(tempRawData, true);
  }, [tempRawData, applyRawDataToForm]);

  useEffect(() => {
    if (pageMode !== "details") return;
    if (!employmentId) return;
    if (!pinSearchRawDataStore) return;
    if (getValues("pinChecked")) return;

    void applyRawDataToForm(pinSearchRawDataStore, false);
  }, [
    employmentId,
    pinSearchRawDataStore,
    applyRawDataToForm,
    getValues,
    pageMode,
  ]);

  const handleCompanyChangeDependentFields = useCallback(
    (company: Option | null) => {
      // Only fill when we have pin-search raw response.
      if (!tempRawData) return;

      const employees: any[] = tempRawData?.result?.employees ?? [];

      if (!company) {
        setValue("resmilesmeFormasi", null, {
          shouldDirty: true,
          shouldValidate: true,
          shouldTouch: true,
        });
        setValue("tovsiyeEden", "", {
          shouldDirty: true,
          shouldValidate: true,
          shouldTouch: true,
        });
        return;
      }

      const selectedCompanyId = company.id != null ? String(company.id) : "";
      const matchingEmployee = employees.find(
        (e) => String(e.companyId) === selectedCompanyId,
      );

      const employmentTypeCode: string | null =
        matchingEmployee?.employmentTypeCode ?? null;
      const referrerName: string = matchingEmployee?.referrerName ?? "";

      const applyEmploymentTypeValue = (
        mapToUse: Map<string, Option> | null,
      ) => {
        const mappedResmilesmeFormasi =
          employmentTypeCode && mapToUse?.get(String(employmentTypeCode))
            ? mapToUse.get(String(employmentTypeCode))!
            : null;

        setValue("resmilesmeFormasi", mappedResmilesmeFormasi, {
          shouldDirty: true,
          shouldValidate: true,
          shouldTouch: true,
        });
      };

      if (
        employmentTypeCode &&
        (!employmentTypesMap ||
          !employmentTypesMap.has(String(employmentTypeCode)))
      ) {
        void loadEmploymentTypesMap().then((loadedMap) =>
          applyEmploymentTypeValue(loadedMap),
        );
      } else {
        applyEmploymentTypeValue(employmentTypesMap);
      }

      setValue("tovsiyeEden", referrerName, {
        shouldDirty: true,
        shouldValidate: true,
        shouldTouch: true,
      });
    },
    [tempRawData, employmentTypesMap, setValue, loadEmploymentTypesMap],
  );

  const handlePinSearchCancel = useCallback(() => {
    setTempRawData(null);
    setPinSearchResultData(null);
    setEmploymentTypesMap(null);
    setIsPinSearchResultModalOpen(false);
  }, []);

  const handleFinClear = useCallback(() => {
    triggerGlobalReset();
    toast.success("Məlumatlar təmizləndi");
  }, [triggerGlobalReset]);

  const handleFinEdit = useCallback(() => {
    setIsFinDisabled(false);
    setValue("pinChecked", false, { shouldDirty: true, shouldTouch: true });
    setIsPinSearchResultModalOpen(false);
  }, [setValue]);

  const onSubmit = (data: PersonalInfoFormValues) => {
    if (employmentId && !isDirty) {
      nextStep();
      return;
    }
    savePersonalInfo(data as unknown as PersonalInfoValues);
  };

  return {
    form,
    onSubmit,
    isPending,
    isPinSearchResultModalOpen,
    setIsPinSearchResultModalOpen,
    pinSearchResultData,
    handleSearchByPin,
    handlePinSearchConfirm,
    handlePinSearchCancel,
    handleCompanyChangeDependentFields,
    isFinDisabled,
    handleFinClear,
    handleFinEdit,
    detailsStatus,
    detailsUsername,
    detailsPosition,
    detailsDepartment,
    detailsStaffCategory,
    avatarFileName,
    avatarFileSize,
    avatarPreview,
    setAvatarPreview,
    trigger,
  };
};
