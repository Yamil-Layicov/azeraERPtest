import React, { useEffect } from "react";
import { Button, Checkbox,  FormInput, FormTextarea, ModernDatePicker, CustomSelect } from "@/shared/ui";
import { EnumLookupSelect } from "@/features/lookups";
import { PermissionGuard } from "@/features/auth/components/PermissionGuard";
import { PERMISSIONS } from "@/shared/consts/permissions";
import type { Option } from "@/shared/types";
import styles from "./WorkInputForm.module.css";
import { useEmployeeStore } from "@/features/kadrlar/create-worker/model/useEmployeeStore";
import { useQuery } from "@tanstack/react-query";
import { lookupsService } from "@/features/lookups/api/lookupsService";
import type { EnumLookupItem } from "@/features/lookups/model/types";
import type { FieldErrors } from "react-hook-form";
import { z } from "zod";
import { workExperienceSchema } from "@/features/kadrlar/create-worker/model/schemas";

export type WorkInputFormValue = z.input<typeof workExperienceSchema>;

export interface WorkInputFormProps {
  value: WorkInputFormValue;
  onChange: <K extends keyof WorkInputFormValue>(field: K, val: WorkInputFormValue[K]) => void;
  onAddClick?: () => void;
  onClear?: () => void;
  errors?: FieldErrors<WorkInputFormValue>;
  isEditMode?: boolean; 
  isLoading?: boolean;
}

const HOLDING_TYPES = ["HoldingExperience", "HoldingMedicalExperience"];

export const WorkInputForm: React.FC<WorkInputFormProps> = ({
  value,
  onChange,
  onAddClick,
  onClear,
  errors,
  isEditMode,
  isLoading,
}) => {
  const rootCompanyId = useEmployeeStore((state) => state.rootCompanyId);
  const isHolding = (value.experienceType?.id ? HOLDING_TYPES.includes(String(value.experienceType.id)) : false) && value.azadOlChecked;
  const organizationUnitId = (value.workplace as Option | null)?.id ? String((value.workplace as Option).id) : null;

  const { 
    data: subCompaniesResp, 
    isLoading: isSubCompaniesLoading, 
    refetch: refetchSubCompanies 
  } = useQuery({
    queryKey: ["lookups", "subCompanies", rootCompanyId],
    queryFn: () => lookupsService.getSubCompanies(rootCompanyId!),
    enabled: !!rootCompanyId && isHolding, // ID varsa ve holdingse otomatik çek
  });

  const { 
    data: staffVacantResp, 
    isLoading: isStaffVacantLoading, 
    refetch: refetchStaffVacant 
  } = useQuery({
    queryKey: ["lookups", "staffVacant", organizationUnitId],
    queryFn: () => lookupsService.getStaffVacant(organizationUnitId!),
    enabled: false,
  });

  const subCompanyOptions: Option[] = (subCompaniesResp?.result || []).map((item: EnumLookupItem) => ({
    id: item.value,
    fullName: item.label
  }));

  const staffVacantOptions: Option[] = (staffVacantResp?.result || []).map((item: EnumLookupItem) => ({
    id: item.value,
    fullName: item.label
  }));

  useEffect(() => {
    if (!isHolding) return;
    if (!organizationUnitId) return;
    void refetchStaffVacant();
  }, [isHolding, organizationUnitId, refetchStaffVacant]);

  return (
    <div className={styles.container} data-work-input-form>
      {/* ... rest of the rows ... */}
      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="work-experienceType">
            Staj növü<span className={styles.required}>*</span>
          </label>
          <div className={styles.controlWrap}>
            <EnumLookupSelect
              id="work-experienceType"
              code="ExperienceTypes"
              value={value.experienceType}
              disabled={!!isEditMode}
              onChange={(val) => {
                onChange("experienceType", val);
                onChange("workplace", "");
                onChange("position", "");
              }}
              defaultText="Seçin"
              isClearable={true}
              error={errors?.experienceType?.message as string}
            />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label} aria-hidden="true">
            &nbsp;
          </label>
          <div className={styles.checkboxWrapTop}>
            <Checkbox
              id="work-azadOl"
              checked={!!value.azadOlChecked}
              onChange={(checked) => {
                onChange("azadOlChecked", checked);
                // Clear workplace and position when switching modes to prevent [object Object]
                onChange("workplace", "");
                onChange("position", "");
              }}
              label="Hal hazırda işləyir"
            />
          </div>
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="work-workplace">
            İş yeri<span className={styles.required}>*</span>
          </label>
          <div className={styles.controlWrap}>
            {isHolding ? (
              <CustomSelect
                id="work-workplace-select"
                options={subCompanyOptions}
                value={value.workplace as Option | null}
                onChange={(val) => {
                  onChange("workplace", val);
                  onChange("position", "");
                }}
                onOpen={() => {
                  if (rootCompanyId) refetchSubCompanies();
                }}
                defaultText="Seçin"
                isSearchable={true}
                disabled={isSubCompaniesLoading}
                error={errors?.workplace?.message as string}
              />
            ) : (
              <FormInput
                label=""
                id="work-workplace"
                type="text"
                placeholder="Daxil edin"
                value={value.workplace as string}
                onChange={(val) => onChange("workplace", val)}
                error={errors?.workplace?.message as string}
              />
            )}
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="work-position">
            Vəzifəsi<span className={styles.required}>*</span>
          </label>
          <div className={styles.controlWrap}>
            {isHolding ? (
              <CustomSelect
                id="work-position-select"
                options={staffVacantOptions}
                value={value.position as Option | null}
                onChange={(val) => onChange("position", val)}
                onOpen={() => {
                  if (organizationUnitId) refetchStaffVacant();
                }}
                defaultText="Seçin"
                isSearchable={true}
                disabled={isStaffVacantLoading || !organizationUnitId}
                error={errors?.position?.message as string}
              />
            ) : (
              <FormInput
                label=""
                id="work-position"
                type="text"
                placeholder="Daxil edin"
                value={value.position as string}
                onChange={(val) => onChange("position", val)}
                error={errors?.position?.message as string}
              />
            )}
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="work-appointmentDate">
            Təyinat tarixi<span className={styles.required}>*</span>
          </label>
          <div className={styles.controlWrap}>
            <ModernDatePicker
              id="work-appointmentDate"
              value={value.appointmentDate as Date | null}
              onChange={(date) => onChange("appointmentDate", date)}
              placeholder="dd.mm.yy"
              className={styles.datePicker}
              error={errors?.appointmentDate?.message as string}
            />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="work-appointmentOrderNumber">
            Təyinat əmr nömrəsi
          </label>
          <div className={styles.controlWrap}>
            <FormInput
              label=""
              id="work-appointmentOrderNumber"
              type="text"
              placeholder="Daxil edin"
              value={(value.appointmentOrderNumber as string) || ""}
              onChange={(val) => onChange("appointmentOrderNumber", val)}
            />
          </div>
        </div>
      </div>

      {/* 3. Bölüm: İşten Ayrılma Detayları - Sadece 'Hal-hazırda işləmir' ise (unchecked) gösterilir */}
      <div
        className={!value.azadOlChecked ? styles.azadOlSection : styles.azadOlSectionClosed}
        aria-hidden={value.azadOlChecked}
      >
        <div className={styles.rowAzadFull}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="work-releaseDate">
              Azad olma tarixi<span className={styles.required}>*</span>
            </label>
            <div className={styles.controlWrap}>
              <ModernDatePicker
                id="work-releaseDate"
                value={value.releaseDate as Date | null}
                onChange={(date) => onChange("releaseDate", date)}
                placeholder="dd.mm.yyyy"
                className={styles.datePicker}
                error={errors?.releaseDate?.message as string}
              />
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="work-releaseOrderNumber">
              Azad olma əmr nömrəsi
            </label>
            <div className={styles.controlWrap}>
              <FormInput
                label=""
                id="work-releaseOrderNumber"
                type="text"
                placeholder="Daxil edin"
                value={(value.releaseOrderNumber as string) || ""}
                onChange={(val) => onChange("releaseOrderNumber", val)}
              />
            </div>
          </div>
          <div className={`${styles.field} ${styles.fieldLongLabel}`}>
            <label className={styles.label} htmlFor="work-releaseLegalBasis">
              İşdən azad olmanın hüquqi əsası və ya yerdəyişmə<span className={styles.required}>*</span>
            </label>
            <div className={styles.controlWrap}>
              <EnumLookupSelect
                id="work-releaseLegalBasis"
                code="TerminationReasons"
                value={(value.releaseLegalBasis as Option | null) ?? null}
                onChange={(val) => onChange("releaseLegalBasis", val)}
                defaultText="Seçin"
                isSearchable={true}
                variant="form"
                error={errors?.releaseLegalBasis?.message as string}
              />
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="work-resignationReason">
              İşdən ayrılma səbəbi
            </label>
            <div className={styles.controlWrap}>
              <FormTextarea
                id="work-resignationReason"
                label=""
                placeholder="Daxil edin"
                value={(value.resignationReason as string) || ""}
                onChange={(val) => onChange("resignationReason", val)}
                rows={3}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <PermissionGuard
          permission={isEditMode ? PERMISSIONS.EMPLOYEE.UPDATE : PERMISSIONS.EMPLOYEE.CREATE}
        >
          <Button 
            type="button" 
            variant="secondary" 
            className={styles.addButton} 
            onClick={onAddClick}
            isLoading={isLoading}
          >
            {isEditMode ? "Yenilə" : "Əlavə et"}
          </Button>
        </PermissionGuard>
        <Button type="button" variant="outline" className={styles.clearButton} onClick={onClear}>
          Təmizlə
        </Button>
      </div>
    </div> 
  );
};
