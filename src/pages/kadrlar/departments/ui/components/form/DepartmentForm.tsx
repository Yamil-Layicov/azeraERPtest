import React from "react";
import { useCompaniesLookup, useOrganizationUnitTypeLookup } from "@/features/kadrlar/departments";
import { useLookups } from "@/features/lookups";
import { mapEnumItemsToOptions } from "@/features/lookups/lib/mapEnumItemsToOptions";
import { useDepartmentForm } from "./hooks/useDepartmentForm";
import { useDepartmentFormValidation } from "./hooks/useDepartmentFormValidation";
import { DepartmentFormFields } from "./components/DepartmentFormFields";
import { DepartmentFormFooter } from "./components/DepartmentFormFooter";
import type { DepartmentFormProps } from "./types";
import { VALIDATION_MESSAGES } from "./schema";
import { VOEN_MAX_LENGTH } from "./constants";
import { Button } from "@/shared/ui";
import { XMarkIcon } from "@heroicons/react/24/outline";
import styles from "./DepartmentForm.module.css";
import type { Option } from "@/shared/types";

type ExtendedInitialData = DepartmentFormProps["initialData"] & {
  isVacancy?: boolean;
  vacancyDetails?: {
    staff: Option | null;
    workSchedule: Option | null;
  };
};

const DepartmentForm: React.FC<DepartmentFormProps> = ({
  title,
  initialData,
  defaultParent,
  onSave,
  onCancel,
  onDelete,
  onChange,
  isLoading = false,
  fullWidth = false,
  isEditMode = true,
  isOpen = true,
  cancelButtonText,
  onClose,
  fieldsAfterType,
  fieldsAfterName,
  hideSortOrder,
  hideActive,
  hideType,
  hideName,
  renderActiveControl,
  savePermission,
  deletePermission,
}) => {
  const [hasOpenedCompanies, setHasOpenedCompanies] = React.useState(false);
  const [hasOpenedTypes, setHasOpenedTypes] = React.useState(false);

  const { data: companiesOptions = [] } = useCompaniesLookup(hasOpenedCompanies);
  const { data: companyTypesOptions = [] } = useOrganizationUnitTypeLookup(hasOpenedTypes || !!initialData);
  const { data: lookupsData } = useLookups();
  const workScheduleOptions = React.useMemo(() => {
    return mapEnumItemsToOptions(lookupsData?.result?.workSchedules);
  }, [lookupsData]);

  const handleOpenCompanies = () => setHasOpenedCompanies(true);
  const handleOpenTypes = () => setHasOpenedTypes(true);

  const { form, updateField } = useDepartmentForm({
    initialData,
    defaultParent,
    companyTypesOptions,
    companiesOptions,
    workScheduleOptions,
    isOpen,
    onChange,
  });

  const { errors, setErrors, validateForm, clearError } = useDepartmentFormValidation();

  const handleFieldChange = <K extends keyof typeof form>(
    key: K,
    value: typeof form[K]
  ) => {
    updateField(key, value);
    clearError(key as keyof typeof errors);
  };

  const handleVoenChange = (value: string) => {
    if (value.length > VOEN_MAX_LENGTH) {
      setErrors((prev) => ({
        ...prev,
        voen: VALIDATION_MESSAGES.VOEN_MAX_LENGTH,
      }));
      return;
    }

    if (value === "") {
      handleFieldChange("voen", value);
      clearError("voen");
    } else {
      const hasNonDigit = /[^0-9]/.test(value);
      if (hasNonDigit) {
        setErrors((prev) => ({
          ...prev,
          voen: VALIDATION_MESSAGES.VOEN_ONLY_DIGITS,
        }));
      } else {
        handleFieldChange("voen", value);
        clearError("voen");
      }
    }
  };

  const handleSubmit = () => {
    const validationErrors = validateForm(form);
    
    // Əgər sahələr gizlidirsə, onların validasiya xətalarını görməzdən gəlirik
    if (hideType) delete validationErrors.type;
    if (hideName) delete validationErrors.fullName;

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSave(form);
  };

  const fieldClass = (fullWidth ? styles.fullWidth : styles.halfWidth) || "";

  return (
    <div className={styles.container}>
      {title && (
        <div className={styles.headerTitleWrapper}>
          <h3 className={styles.headerTitle}>{title}</h3>
          {onClose && (
            <Button 
              type="button" 
              variant="clear" 
              onClick={onClose}
              className={styles.closeBtn}
            >
              <XMarkIcon width={20} />
            </Button>
          )}
        </div>
      )}

      <DepartmentFormFields
        form={form}
        errors={errors}
        fieldClass={fieldClass}
        companyTypesOptions={companyTypesOptions}
        companiesOptions={companiesOptions}
        isLoading={isLoading}
        isEditMode={isEditMode}
        disableParentField={!!defaultParent}
        onFieldChange={handleFieldChange}
        onVoenChange={handleVoenChange}
        // Xətaları qarşısını almaq üçün tipləri "Cast" edirik
        isVacancy={(initialData as ExtendedInitialData)?.isVacancy} 
        initialData={initialData as ExtendedInitialData}
        fieldsAfterType={fieldsAfterType}
        fieldsAfterName={fieldsAfterName}
        hideSortOrder={hideSortOrder}
        hideActive={hideActive}
        hideType={hideType}
        hideName={hideName}
        renderActiveControl={renderActiveControl}
        onOpenCompanies={handleOpenCompanies}
        onOpenTypes={handleOpenTypes}
      />

      <DepartmentFormFooter
        isLoading={isLoading}
        initialData={initialData}
        onSave={handleSubmit}
        onCancel={onCancel}
        onDelete={onDelete}
        cancelButtonText={cancelButtonText}
        savePermission={savePermission}
        deletePermission={deletePermission}
      />
    </div>
  );
};

export default DepartmentForm;
