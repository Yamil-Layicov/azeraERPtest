import React, { useState, useEffect } from "react";
import { FormInput, FormTextarea, CustomSelect, Button } from "@/shared/ui";
import Checkbox from "@/shared/ui/checkbox/Checkbox";
import type { FormValues, FormErrors } from "../types";
import type { Option } from "@/shared/types";
import { ErrorMessage } from "./ErrorMessage";
import { HOLDING_TYPE_ID, COMPANY_TYPE_ID } from "../constants";
import styles from "../DepartmentForm.module.css";
import type { DepartmentNode } from "../../../../model/types"; 
import { useLookups } from "@/features/lookups";
import { mapEnumItemsToOptions } from "@/features/lookups/lib/mapEnumItemsToOptions";

interface DepartmentFormFieldsProps {
  form: FormValues;
  errors: FormErrors;
  fieldClass: string;
  companyTypesOptions: Option[];
  companiesOptions: Option[];
  isLoading: boolean;
  isEditMode: boolean;
  disableParentField?: boolean;
  onFieldChange: <K extends keyof FormValues>(key: K, value: FormValues[K]) => void; // any silindi
  onVoenChange: (value: string) => void;
  isVacancy?: boolean; 
  fieldsAfterType?: React.ReactNode;
  fieldsAfterName?: React.ReactNode;
  hideSortOrder?: boolean;
  initialData?: DepartmentNode & { // any silindi
    isVacancy?: boolean;
    vacancyDetails?: {
      staff: Option | null;
      workSchedule: Option | null;
    };
  } | null;
  hideActive?: boolean;
  hideType?: boolean;
  hideName?: boolean;
  renderActiveControl?: React.ReactNode;
  onOpenCompanies?: () => void;
  onOpenTypes?: () => void;
}

export const DepartmentFormFields: React.FC<DepartmentFormFieldsProps> = ({
  form,
  errors,
  fieldClass,
  companyTypesOptions,
  companiesOptions,
  isLoading,
  isEditMode,
  disableParentField = false,
  onFieldChange,
  onVoenChange,
  isVacancy = false,
  fieldsAfterType,
  fieldsAfterName,
  hideSortOrder = false,
  initialData,
  hideActive,
  hideType = false,
  hideName = false,
  renderActiveControl,
  onOpenCompanies,
  onOpenTypes,
}) => {
  const isHolding = form.type?.id === HOLDING_TYPE_ID;
  const isCompany = form.type?.id === COMPANY_TYPE_ID;
  const isParentRequired = !isHolding;

  const [showCompanyExtra, setShowCompanyExtra] = useState(false);

  const { data: lookupsData } = useLookups(isCompany);
  const workScheduleOptions = React.useMemo(() => {
    return mapEnumItemsToOptions(lookupsData?.result?.workSchedules);
  }, [lookupsData]);

  // Select-lərin dəyərlərinin itməməsi üçün render zamanı referans uyğunlaşdırması edirik
  const parentValue = React.useMemo(() => {
    if (!form.parent) return null;
    if (form.parent.fullName) return form.parent;
    const matched = companiesOptions.find(opt => String(opt.id) === String(form.parent?.id));
    return matched || form.parent;
  }, [form.parent, companiesOptions]);

  const typeValue = React.useMemo(() => {
    if (!form.type) return null;
    return companyTypesOptions.find(opt => String(opt.id) === String(form.type?.id)) || form.type;
  }, [form.type, companyTypesOptions]);

  const workScheduleValue = React.useMemo(() => {
    if (!form.workSchedule) return null;
    return workScheduleOptions.find(opt => String(opt.id) === String(form.workSchedule?.id)) || form.workSchedule;
  }, [form.workSchedule, workScheduleOptions]);

  useEffect(() => {
    if (!isCompany) setShowCompanyExtra(false);
  }, [isCompany]);

  if (isVacancy) {
    const positions: Option[] = [
      { id: '1', fullName: 'Proqramçı', role: '' },
      { id: '2', fullName: 'Dizayner', role: '' },
      { id: '3', fullName: 'Menecer', role: '' },
      { id: '4', fullName: 'Analitik', role: '' },
    ];
    const staffOptions: Option[] = [
      { id: '1', fullName: '1', role: '' },
      { id: '2', fullName: '2', role: '' },
      { id: '3', fullName: '3', role: '' },
      { id: '4', fullName: '4', role: '' },
      { id: '5', fullName: '5', role: '' },
    ];
    const workSchedules: Option[] = [
      { id: '1', fullName: 'Tam ştat (8 saat)', role: '' },
      { id: '2', fullName: 'Yarım ştat (4 saat)', role: '' },
      { id: '3', fullName: 'Sərbəst qrafik', role: '' },
      { id: '4', fullName: 'Uzaqdan iş', role: '' },
    ];

    const currentPosition = positions.find(p => p.fullName === initialData?.name) || { id: 'custom', fullName: initialData?.name, role: '' };

    return (
      <>
        <div className={fieldClass}>
          <label style={{ fontSize: "0.9rem", fontWeight: 500, marginBottom: "4px", display: "block" }}>
            Əsas qurum {isParentRequired && <span style={{ color: "red" }}>*</span>}
          </label>
          <CustomSelect
            id="vacancy-parent"
            options={companiesOptions}
            defaultText="Əsas qurum seçin..."
            value={parentValue}
            onChange={(option) => onFieldChange("parent", option)}
            onOpen={onOpenCompanies}
            variant="form"
            disabled={isLoading || isEditMode || isHolding || disableParentField}
            isClearable={!isEditMode && !isHolding && !disableParentField}
            error={!!errors.parent}
            isSearchable={true}
          />
          {errors.parent && <ErrorMessage message={errors.parent} />}
        </div>
        
        {/* ... digər hissələr eynidir ... */}
        <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
          <div className={fieldClass} style={{ flex: 1 }}>
            <label style={{ fontSize: "0.9rem", fontWeight: 500, marginBottom: "4px", display: "block" }}>
              Vəzifə <span style={{ color: "red" }}>*</span>
            </label>
            <CustomSelect
              id="vacancy-position"
              options={positions}
              value={currentPosition as Option}
              defaultText="Vəzifə seçin..." 
              onChange={(option) => onFieldChange("fullName", option ? (option.fullName || option.label || "") : "")} 
              variant="form"
              disabled={isLoading} 
            />
          </div>

          <div className={fieldClass} style={{ width: "120px" }}>
            <label style={{ fontSize: "0.9rem", fontWeight: 500, marginBottom: "4px", display: "block" }}>
              Sayı
            </label>
            <FormInput
              id="vacancy-sayi"
              type="number"
              placeholder="0"
              value={form.sayi === "" ? "" : String(form.sayi)}
              onChange={(val) => {
                const v = val.trim();
                onFieldChange("sayi", v === "" ? "" : Math.min(20, Math.max(1, (parseInt(v, 10) || 1))));
              }}
              disabled={isLoading}
              className={errors.sayi ? "error" : ""}
            />
          </div>
        </div>

        <div className={fieldClass}>
          <label style={{ fontSize: "0.9rem", fontWeight: 500, marginBottom: "4px", display: "block" }}>
            Heyyət <span style={{ color: "red" }}>*</span>
          </label>
          <CustomSelect
            id="vacancy-staff"
            options={staffOptions}
            value={initialData?.vacancyDetails?.staff || null}
            defaultText="Seçin..." 
            onChange={() => {}}
            variant="form"
          />
        </div>

        <div className={fieldClass}>
          <label style={{ fontSize: "0.9rem", fontWeight: 500, marginBottom: "4px", display: "block" }}>
            İş rejimi <span style={{ color: "red" }}>*</span>
          </label>
          <CustomSelect
            id="vacancy-work-schedule"
            options={workSchedules}
            value={initialData?.vacancyDetails?.workSchedule || null}
            defaultText="Seçin" 
            onChange={() => {}}
            variant="form"
          />
        </div>

        {!hideActive && (
          <div className={styles.checkboxWrapper}>
            {renderActiveControl ?? (
              <Checkbox
                id="dept-active"
                label="Aktiv"
                checked={form.isActive}
                onChange={(checked) => onFieldChange("isActive", checked)}
                disabled={isLoading}
              />
            )}
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <div className={fieldClass}>
        <label htmlFor="dept-parent" style={{ fontSize: "0.9rem", fontWeight: 500, marginBottom: "4px", display: "block" }}>
          Əsas qurum {isParentRequired && <span style={{ color: "red" }}>*</span>}
        </label>
        <CustomSelect
          id="dept-parent"
          options={companiesOptions}
          defaultText="Əsas qurum seçin..."
          value={parentValue}
          onChange={(option) => onFieldChange("parent", option)}
          onOpen={onOpenCompanies}
          variant="form"
          disabled={isLoading || isEditMode || isHolding || disableParentField}
          isClearable={!isEditMode && !isHolding && !disableParentField}
          error={!!errors.parent}
          isSearchable={true}
        />
        {errors.parent && <ErrorMessage message={errors.parent} />}
      </div>
      
      {!hideType && (
        <div className={fieldClass}>
          <label htmlFor="dept-type" style={{ fontSize: "0.9rem", fontWeight: 500, marginBottom: "4px", display: "block" }}>
            Növü <span style={{ color: "red" }}>*</span>
          </label>
          <CustomSelect
            id="dept-type"
            options={companyTypesOptions}
            defaultText="Növ seçin..."
            value={typeValue}
            onChange={(option) => onFieldChange("type", option)}
            onOpen={onOpenTypes}
            variant="form"
            disabled={isLoading || isEditMode}
            isClearable={!isEditMode}
            error={!!errors.type}
          />
          {errors.type && <ErrorMessage message={errors.type} />}
        </div>
      )}

      {fieldsAfterType && (
        <div className={fieldClass}>
          {fieldsAfterType}
        </div>
      )}

      {!hideName && (
        <div className={fieldClass}>
          <FormInput
            id="dept-name"
            label="Adı"
            type="text"
            placeholder="Daxil edin"
            value={form.fullName}
            onChange={(val) => onFieldChange("fullName", val)}
            disabled={isLoading}
            required={true}
            className={errors.fullName ? "error" : ""}
          />
          {errors.fullName && <ErrorMessage message={errors.fullName} />}
        </div>
      )}

      {!hideName && isCompany && (
        <div className={fieldClass}>
          <FormInput
            id="dept-legal-name"
            label="Hüquqi ad"
            type="text"
            placeholder="Daxil edin"
            value={form.legalName}
            onChange={(val) => onFieldChange("legalName", val)}
            disabled={isLoading}
            required={true}
            className={errors.legalName ? "error" : ""}
          />
          {errors.legalName && <ErrorMessage message={errors.legalName} />}
        </div>
      )}

      {isCompany && (
        <div className={fieldClass}>
          <label htmlFor="dept-work-schedule" style={{ fontSize: "0.9rem", fontWeight: 500, marginBottom: "4px", display: "block" }}>
            İş rejimi <span style={{ color: "red" }}>*</span>
          </label>
          <CustomSelect
            id="dept-work-schedule"
            options={workScheduleOptions}
            defaultText="Seçin"
            value={workScheduleValue}
            onChange={(option) => onFieldChange("workSchedule", option)}
            variant="form"
            disabled={isLoading}
            isClearable
            isSearchable
            error={!!errors.workSchedule}
          />
          {errors.workSchedule && <ErrorMessage message={errors.workSchedule} />}
        </div>
      )}

      {fieldsAfterName && (
        <div className={fieldClass}>
          {fieldsAfterName}
        </div>
      )}

      {!hideSortOrder && (
        <div className={fieldClass}>
          <FormInput
            id="dept-sort-order"
            label="Sira №"
            type="number"
            placeholder="0"
            value={form.sortOrder === "" ? "" : String(form.sortOrder)}
            onChange={(val) => {
              const v = val.trim();
              onFieldChange("sortOrder", v === "" ? "" : (parseInt(v, 10) || 0));
            }}
            disabled={isLoading}
            className={errors.sortOrder ? "error" : ""}
          />
          {errors.sortOrder && <ErrorMessage message={errors.sortOrder} />}
        </div>
      )}

      {isCompany && (
        <div className={styles.toggleButtonWrapper}>
          <Button
            type="button"
            variant="clear"
            onClick={() => setShowCompanyExtra(!showCompanyExtra)}
            className={styles.toggleButton}
          >
            {showCompanyExtra ? "Azalt" : "Daha çox"}
          </Button>
        </div>
      )}

      {isCompany && showCompanyExtra && (
        <>
          <div className={fieldClass}>
            <FormInput
              id="dept-voen"
              label="VÖEN"
              type="text"
              placeholder="VOEN daxil edin"
              value={form.voen}
              onChange={onVoenChange}
              disabled={isLoading}
              className={errors.voen ? "error" : ""}
            />
            {errors.voen && <ErrorMessage message={errors.voen} />}
          </div>
          <div className={fieldClass}>
            <FormTextarea
              id="dept-note"
              label="Fəaliyyət sahəsi"
              placeholder="Fəaliyyət sahəsi daxil edin..."
              value={form.note}
              onChange={(val) => onFieldChange("note", val)}
              rows={3}
              disabled={isLoading}
            />
          </div>
          <div className={fieldClass}>
            <FormInput
              id="dept-website"
              label="Vebsayt"
              type="text"
              placeholder="Daxil edin"
              value={form.website}
              onChange={(val) => onFieldChange("website", val)}
              disabled={isLoading}
            />
          </div>
          <div className={fieldClass}>
            <FormInput
              id="dept-fax"
              label="Faks"
              type="text"
              placeholder="Daxil edin"
              value={form.fax}
              onChange={(val) => onFieldChange("fax", val)}
              disabled={isLoading}
            />
          </div>
          <div className={fieldClass}>
            <FormInput
              id="dept-phone"
              label="Telefon"
              type="text"
              placeholder="Daxil edin"
              value={form.phone}
              onChange={(val) => onFieldChange("phone", val)}
              disabled={isLoading}
            />
          </div>

        </>
      )}

      {isEditMode && !hideActive && !renderActiveControl && (
        <div className={styles.checkboxWrapper}>
          <Checkbox
            id="dept-active"
            label="Aktiv"
            checked={form.isActive}
            onChange={(checked) => onFieldChange("isActive", checked)}
            disabled={isLoading}
          />
        </div>
      )}

      {isEditMode && (form.createdAt || form.createdBy) && (
        <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
          {form.createdAt && (
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <label style={{ fontSize: "0.9rem", fontWeight: 600, minWidth: "140px", color: "#868e96", fontStyle: "italic" }}>
                Yaranma tarixi:
              </label>
              <span style={{ fontSize: "0.9rem", fontWeight: 500, color: "#868e96", fontStyle: "italic" }}>
                {new Date(form.createdAt).toLocaleString("az-AZ", {
                  year: "numeric", month: "2-digit", day: "2-digit",
                  hour: "2-digit", minute: "2-digit",
                })}
              </span>
            </div>
          )}

          {form.createdBy && (
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <label style={{ fontSize: "0.9rem", fontWeight: 600, minWidth: "140px", color: "#868e96", fontStyle: "italic" }}>
                Daxil edən:
              </label>
              <span style={{ fontSize: "0.9rem", fontWeight: 500, color: "#868e96", fontStyle: "italic" }}>
                {form.createdBy}
              </span>
            </div>
          )}
          
          {renderActiveControl && (
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
              {renderActiveControl}
            </div>
          )}
        </div>
      )}
    </>
  );
};
