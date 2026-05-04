import React, { useEffect, useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import styles from "./RelativesInputForm.module.css";
import { FormInput } from "@/shared/ui/input";
import {
  EnumLookupSelect,
  CountriesLookupSelect,
  isAzerbaijanCountry,
  getCountryIdForCitiesApi,
  useCitiesByCountryCode,
} from "@/features/lookups";
import type { EnumLookupItem } from "@/features/lookups";
import { useEnumItemsByCode } from "@/features/lookups/hooks";
import { ModernDatePicker } from "@/shared/ui/date-picker";
import { CustomSelect } from "@/shared/ui";
import { Checkbox } from "@/shared/ui/checkbox";
import { Button } from "@/shared/ui/button";
import { toast } from "react-hot-toast";
import { FinSearchField } from "@/pages/kadrlar/employee-shared/ui/fin-search-field";
import { FormLabel } from "@/shared/ui/label/FormLabel";
import { createWorkerService } from "@/features/kadrlar/create-worker/api/createWorkerService";
import { useAddEmployeeStore } from "@/features/kadrlar/create-worker/model/useAddEmployeeStore";
import { getBackendErrorMessage } from "@/shared/api/httpClient";
import { capitalizeFirstLetter } from "@/shared/hooks";
import { format } from "date-fns";
import { SharedRelativesModal } from "../shared-relatives-modal/SharedRelativesModal";
import { PermissionGuard } from "@/features/auth/components/PermissionGuard";
import { PERMISSIONS } from "@/shared/consts/permissions";

const relativesSchema = z
  .object({
    degree: z.any().refine((val) => val !== null, "Qohumluq dərəcəsi vacibdir"),
    surname: z.string().min(1, "Soyad vacibdir"),
    name: z.string().min(1, "Ad vacibdir"),
    patronymic: z.string().min(1, "Ata adı vacibdir"),
    birthDate: z.any().refine((val) => val !== null, "Doğum tarixi vacibdir"),
    pin: z.string().default(""),
    isForeignCitizen: z.boolean().default(false),
    birthCountry: z.any().nullable().default(null),
    birthCity: z.string().default(""),
    workplace: z.string().default(""),
    address: z.string().default(""),
    socialStatuses: z.array(z.string()).default([]),
    pinChecked: z.boolean().default(false),
  })
  .superRefine((data, ctx) => {
    if (!data.isForeignCitizen && (!data.pin || data.pin.trim().length === 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "FİN daxil edilməlidir",
        path: ["pin"],
      });
    }

    if (!data.birthCountry) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Doğulduğu ölkə vacibdir",
        path: ["birthCountry"],
      });
    }

    if (!data.birthCity || data.birthCity.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Doğulduğu şəhər/rayon vacibdir",
        path: ["birthCity"],
      });
    }

    if (!data.socialStatuses || data.socialStatuses.length === 0) {
      if (!data.workplace || data.workplace.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "İş yeri daxil edilməlidir",
          path: ["workplace"],
        });
      }
      if (!data.address || data.address.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Yaşadığı ünvan daxil edilməlidir",
          path: ["address"],
        });
      }
    }
  });

export type RelativesFormValues = z.infer<typeof relativesSchema>;

interface RelativesInputFormProps {
  onSuccess?: () => void;
  editData?: any;
}

const RELATIVES_DEFAULT_VALUES: RelativesFormValues = {
  degree: null,
  surname: "",
  name: "",
  patronymic: "",
  birthDate: null,
  isForeignCitizen: false,
  pin: "",
  birthCountry: null,
  birthCity: "",
  workplace: "",
  address: "",
  socialStatuses: [],
  pinChecked: false,
};

export const RelativesInputForm: React.FC<RelativesInputFormProps> = ({
  onSuccess,
  editData,
}) => {
  const { rawData, refetch } = useEnumItemsByCode("SocialStatus", true);
  const personId = useAddEmployeeStore((state) => state.personId);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSharedModalOpen, setIsSharedModalOpen] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
    trigger,
  } = useForm<RelativesFormValues>({
    resolver: zodResolver(relativesSchema) as any,
    defaultValues: RELATIVES_DEFAULT_VALUES,
  });

  const isForeignCitizen = useWatch({ control, name: "isForeignCitizen" });
  const birthCountry = useWatch({ control, name: "birthCountry" });
  const [hasOpenedCitySelect, setHasOpenedCitySelect] = useState(false);
  const isAzerbaijan = isAzerbaijanCountry(birthCountry);
  const countryId = getCountryIdForCitiesApi(birthCountry);
  const { options: cityOptions } = useCitiesByCountryCode(
    countryId,
    isAzerbaijan && !!countryId && hasOpenedCitySelect,
  );
  const socialStatuses = useWatch({ control, name: "socialStatuses" });
  const pinValue = useWatch({ control, name: "pin" });
  const pinChecked = useWatch({ control, name: "pinChecked" });
  const isDeceased = socialStatuses?.includes("Deceased");
  const isEditWithEmptyPin = !!editData && !String(pinValue || "").trim();

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (editData) {
      const raw = editData.raw || {};
      const person = raw.personRelative || {};

      reset({
        degree: editData.degree,
        surname: editData.surname || "",
        name: editData.name || "",
        patronymic: editData.patronymic || "",
        birthDate: editData.birthDate,
        isForeignCitizen: !!person.isForeignCitizen,
        pin: editData.pin || "",
        birthCountry: person.birthCountryCode
          ? {
              id: person.birthCountryCode,
              fullName:
                person.birthCountryCode === "AZE"
                  ? "Azərbaycan"
                  : person.birthCountryCode,
            }
          : null,
        birthCity:
          person.birthCountryCode === "AZE"
            ? String(person.birthCityId || "")
            : person.foreignBirthCity || "",
        workplace: editData.workplace || "",
        address: editData.address || "",
        socialStatuses: raw.socialStatusCode ? [raw.socialStatusCode] : [],
        pinChecked: !!editData.pin && !person.isForeignCitizen,
      });
    } else {
      reset(RELATIVES_DEFAULT_VALUES);
    }
  }, [editData, reset]);

  const socialStatusItems: { value: string; label: string }[] = (
    (rawData as EnumLookupItem[]) || []
  )
    .filter((item) => item.disabled === false)
    .map((item) => ({
      value: item.value,
      label: item.label,
    }));

  const handleSearchByPin = async () => {
    if (!pinValue || isSearching) return;

    setIsSearching(true);
    try {
      const response =
        await createWorkerService.getPersonRelativeByPin(pinValue);
      const isSuccess = response.isSuccess ?? true;
      const result = response.result;

      if (!isSuccess || !result || (!result.name && !result.surname)) {
        toast.error("Məlumat tapılmadı");
        setValue("pinChecked", false);
        return;
      }

      setValue("name", result.name || "");
      setValue("surname", result.surname || "");
      setValue("patronymic", result.patronymic || "");
      setValue(
        "birthDate",
        result.birthDate ? new Date(result.birthDate) : null,
      );
      setValue("isForeignCitizen", !!result.isForeignCitizen);
      setValue("pin", result.pin || pinValue);
      setValue(
        "birthCountry",
        result.birthCountryCode
          ? {
              id: result.birthCountryCode,
              fullName:
                result.birthCountryCode === "AZE"
                  ? "Azərbaycan"
                  : result.birthCountryCode,
            }
          : null,
      );
      setValue(
        "birthCity",
        result.birthCountryCode === "AZE"
          ? String(result.birthCityId || "")
          : result.foreignBirthCity || "",
      );
      setValue("pinChecked", true);

      toast.success("Məlumatlar əlavə edildi");
      trigger();
    } catch (error: any) {
      const message = getBackendErrorMessage(error);
      toast.error(message);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSocialStatusToggle = (code: string, checked: boolean) => {
    const newStatuses = checked ? [code] : [];
    setValue("socialStatuses", newStatuses);

    if (checked && code === "Deceased") {
      setValue("workplace", "");
      setValue("address", "");
    }
  };

  const onFormSubmit = async (data: RelativesFormValues) => {
    if (!personId) {
      toast.error(
        "İşçi ID tapılmadı. Zəhmət olmasa əvvəlcə şəxsi məlumatları tamamlayın.",
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        personId: personId,
        id: editData ? editData.id : "00000000-0000-0000-0000-000000000000",
        isModify: !!editData,
        pinChecked: data.isForeignCitizen ? false : !!data.pinChecked,
        relationshipTypeCode: String(data.degree?.id || "") || null,
        socialStatusCode: String(data.socialStatuses?.[0] || "") || null,
        workPlace: data.workplace || null,
        address: data.address || null,
        name: data.name,
        surname: data.surname,
        patronymic: data.patronymic,
        birthDate:
          data.birthDate instanceof Date
            ? format(data.birthDate, "yyyy-MM-dd")
            : null,
        pin: data.pin?.trim() ? data.pin.trim() : null,
        isForeignCitizen: !!data.isForeignCitizen,
        birthCountryCode: String(data.birthCountry?.id || "") || null,
        birthCityId:
          data.birthCountry?.id === "AZE"
            ? Number(data.birthCity) || null
            : null,
        foreignBirthCity:
          data.birthCountry?.id !== "AZE" ? data.birthCity : null,
      };

      const response = await createWorkerService.addOrEditRelativeInfo(payload);
      if (!response?.isSuccess) {
        toast.error(response?.errorMessage || "Xəta baş verdi");
        return;
      }

      toast.success(
        editData ? "Məlumatlar yeniləndi" : "Məlumatlar əlavə edildi",
      );
      if (!editData) {
        reset(RELATIVES_DEFAULT_VALUES);
      }
      onSuccess?.();
    } catch (error: any) {
      const message = getBackendErrorMessage(error);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.rowOne}>
        <div className={`${styles.selectWrapper} ${styles.field}`}>
          <span className={styles.label}>
            Qohumluq dərəcəsi <span className="required-star">*</span>
          </span>
          <Controller
            control={control}
            name="degree"
            render={({ field }) => (
              <EnumLookupSelect
                id="relatives-degree"
                code="RelationshipTypes"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                defaultText="Seçin"
                error={errors.degree?.message as string}
              />
            )}
          />
        </div>

        <div className={styles.checkboxGroup}>
          {socialStatusItems.map((item) => (
            <Checkbox
              key={item.value}
              id={`relatives-${item.value}`}
              label={item.label}
              checked={socialStatuses?.includes(item.value) || false}
              onChange={(checked) =>
                handleSocialStatusToggle(item.value, checked)
              }
            />
          ))}
        </div>
      </div>
      {/* /////////////////////////////////////////////////////////// */}
      <div className={styles.gridThree}>
        <div className={styles.checkboxItems}>
          <div className={styles.field}>
            <FormLabel
              label="FİN"
              required={!isForeignCitizen}
              htmlFor="relatives-pin"
            />
            <Controller
              control={control}
              name="pin"
              render={({ field }) => (
                <FinSearchField
                  id="relatives-pin"
                  value={field.value || ""}
                  onChange={field.onChange}
                  onClear={() => reset(RELATIVES_DEFAULT_VALUES)}
                  onSearch={handleSearchByPin}
                  disabled={
                    isSearching ||
                    (!!pinChecked && !isForeignCitizen) ||
                    isEditWithEmptyPin
                  }
                  placeholder="7 simvol"
                  maxLength={7}
                  searchIconOnly
                  searchLabel="Axtar"
                  error={errors.pin?.message as string}
                />
              )}
            />
          </div>
          <div className={styles.checkboxItemMargin}>
            <Controller
              control={control}
              name="isForeignCitizen"
              render={({ field }) => (
                <Checkbox
                  id="relatives-isForeignCitizen"
                  label="Xarici vətəndaş"
                  checked={!!field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
        </div>
        <div className={styles.field}>
          <Controller
            control={control}
            name="surname"
            render={({ field }) => (
              <FormInput
                id="relatives-surname"
                type="text"
                label="Soyad"
                required={true}
                value={field.value}
                onChange={(val) => field.onChange(capitalizeFirstLetter(val))}
                onBlur={field.onBlur}
                placeholder="Daxil edin"
                error={errors.surname?.message as string}
              />
            )}
          />
        </div>

        <div className={styles.field}>
          <span className={styles.label}>
            Doğum tarixi <span className="required-star">*</span>
          </span>
          <Controller
            control={control}
            name="birthDate"
            render={({ field }) => (
              <ModernDatePicker
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={errors.birthDate?.message as string}
              />
            )}
          />
        </div>

        <Controller
          control={control}
          name="birthCountry"
          render={({ field }) => (
            <div className={styles.field}>
              <label className={styles.label}>
                Doğulduğu ölkə <span className="required-star">*</span>
              </label>
              <CountriesLookupSelect
                id="birth-country-select"
                value={field.value}
                onChange={(val) => {
                  field.onChange(val);
                  setValue("birthCity", "");
                  setHasOpenedCitySelect(false);
                }}
                onBlur={field.onBlur}
                defaultText="Ölkə seçin"
                variant="form"
                isSearchable={true}
                searchPlaceholder="Axtar..."
                error={errors.birthCountry?.message as string}
              />
            </div>
          )}
        />

        <div className={styles.field}>
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <FormInput
                id="relatives-name"
                type="text"
                label="Ad"
                required={true}
                value={field.value}
                onChange={(val) => field.onChange(capitalizeFirstLetter(val))}
                onBlur={field.onBlur}
                placeholder="Daxil edin"
                error={errors.name?.message as string}
              />
            )}
          />
        </div>
        <div className={styles.field}>
          <Controller
            control={control}
            name="workplace"
            render={({ field }) => (
              <FormInput
                id="relatives-workplace"
                type="text"
                label="İş yeri və vəzifəsi"
                required={!socialStatuses || socialStatuses.length === 0}
                value={field.value || ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                placeholder="Daxil edin"
                disabled={isDeceased}
                error={errors.workplace?.message as string}
              />
            )}
          />
        </div>

        <Controller
          control={control}
          name="birthCity"
          render={({ field }) => (
            <div className={styles.field}>
              <label className={styles.label}>
                Doğulduğu şəhər/rayon <span className="required-star">*</span>
              </label>
              {isAzerbaijan ? (
                <CustomSelect
                  id="birth-city-select"
                  options={cityOptions}
                  value={
                    field.value
                      ? (cityOptions.find(
                          (o) =>
                            o.fullName === field.value || o.id === field.value,
                        ) ?? null)
                      : null
                  }
                  onChange={(opt) => field.onChange(String(opt?.id ?? ""))}
                  onBlur={field.onBlur}
                  defaultText="Şəhər seçin"
                  variant="form"
                  isSearchable={true}
                  searchPlaceholder="Axtar..."
                  disabled={!countryId}
                  error={errors.birthCity?.message as string}
                  onOpen={() => setHasOpenedCitySelect(true)}
                />
              ) : (
                <FormInput
                  id="birth-city-input"
                  type="text"
                  label=""
                  placeholder="Şəhər"
                  value={field.value}
                  onChange={(val) => field.onChange(val)}
                  onBlur={field.onBlur}
                  disabled={!countryId}
                  error={errors.birthCity?.message as string}
                />
              )}
            </div>
          )}
        />

        <div className={styles.field}>
          <Controller
            control={control}
            name="patronymic"
            render={({ field }) => (
              <FormInput
                id="relatives-patronymic"
                type="text"
                label="Ata adı"
                required={true}
                value={field.value}
                onChange={(val) => field.onChange(capitalizeFirstLetter(val))}
                onBlur={field.onBlur}
                placeholder="Daxil edin"
                error={errors.patronymic?.message as string}
              />
            )}
          />
        </div>

        <div className={styles.field}>
          <Controller
            control={control}
            name="address"
            render={({ field }) => (
              <FormInput
                id="relatives-address"
                type="text"
                label="Yaşadığı ünvan"
                required={!socialStatuses || socialStatuses.length === 0}
                value={field.value || ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                placeholder="Daxil edin"
                disabled={isDeceased}
                error={errors.address?.message as string}
              />
            )}
          />
        </div>
      </div>

      <div className={styles.actions}>
        <Button
          type="button"
          variant="outline"
          className={styles.sharedButton}
          onClick={() => setIsSharedModalOpen(true)}
        >
          Əlaqəli şəxslər
        </Button>
        <PermissionGuard
          permission={
            editData ? PERMISSIONS.EMPLOYEE.UPDATE : PERMISSIONS.EMPLOYEE.CREATE
          }
        >
          <Button
            type="button"
            variant="secondary"
            className={styles.addButton}
            onClick={handleSubmit((data) =>
              onFormSubmit(data as RelativesFormValues),
            )}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Göndərilir..." : editData ? "Yenilə" : "Əlavə et"}
          </Button>
        </PermissionGuard>
        <Button
          type="button"
          variant="outline"
          className={styles.clearButton}
          onClick={() => {
            reset(RELATIVES_DEFAULT_VALUES);
            onSuccess?.();
          }}
        >
          {editData ? "Ləğv et" : "Təmizlə"}
        </Button>
      </div>

      <SharedRelativesModal
        isOpen={isSharedModalOpen}
        onClose={() => setIsSharedModalOpen(false)}
        personId={personId}
      />
    </div>
  );
};
