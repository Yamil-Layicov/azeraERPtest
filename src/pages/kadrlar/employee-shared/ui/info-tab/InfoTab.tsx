import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "./InfoTab.module.css";
import {
  FormInput,
  CustomSelect,
  ModernDatePicker,
} from "@/shared/ui";
import {
  GENDER_OPTIONS,
} from "./consts";
import type { InfoTabProps } from "./types";
import { useCreateEmployeeContext } from "../../../create-employee/contexts/CreateEmployeeContext";
import { createEmployeeFormSchema } from "../../../create-employee/model/schema";
import { DocumentInfoSection } from "../document-info";
import { FinSearchField } from "../fin-search-field";
import { ContactInfoSection } from "../contact-info";

const InfoTab: React.FC<InfoTabProps> = ({
  companiesOptions,
  isEditMode = false,
  readOnlyFields = [],
}) => {
  const isFinReadOnly = readOnlyFields.includes('fin');
  const isCompanyReadOnly = readOnlyFields.includes('company');
  const {
    formData,
    newContact,
    addedContacts,
    newDocument,
    addedDocuments,
    handleInputChange: onInputChange,
    handleNewContactChange: onNewContactChange,
    handleNewContactPrimaryChange: onNewContactPrimaryChange,
    handleAddContact: onAddContact,
    handleRemoveContact: onRemoveContact,
    handleListContactChange: onListContactChange,
    handleListContactPrimaryToggle: onListContactPrimaryToggle,
    handleNewDocumentChange: onNewDocumentChange,
    handleAddDocument: onAddDocument,
    handleRemoveDocument: onRemoveDocument,
    handleListDocumentChange: onListDocumentChange,
    handleSearchByPin,
    handleClearAll,
    setValidationTrigger,
    isFinDisabled,
    pinSearchError,
    setPinSearchError,
  } = useCreateEmployeeContext();

  // React Hook Form - only for validation in create mode
  const {
    setValue,
    formState: { errors },
    trigger,
    clearErrors,
  } = useForm({
    resolver: zodResolver(createEmployeeFormSchema),
    mode: "onSubmit", 
    defaultValues: {
      fin: formData.fin,
      company: formData.company,
      firstName: formData.firstName,
      lastName: formData.lastName,
    },
  });

  // Sync form values with React Hook Form when formData changes (without validation)
  useEffect(() => {
    if (!isEditMode) {
      setValue("fin", formData.fin, { shouldValidate: false });
      setValue("company", formData.company, { shouldValidate: false });
      setValue("firstName", formData.firstName, { shouldValidate: false });
      setValue("lastName", formData.lastName, { shouldValidate: false });
      setValue("fatherName", formData.fatherName, { shouldValidate: false });
      setValue("gender", formData.gender, { shouldValidate: false });
    }
  }, [formData.fin, formData.company, formData.firstName, formData.lastName, formData.fatherName, formData.gender, setValue, isEditMode]);
  
  // Track if validation should be shown (set to true when save button is clicked)
  const [shouldShowValidation, setShouldShowValidation] = React.useState(false);
  
  // Expose validation trigger function to context
  useEffect(() => {
    if (!isEditMode && setValidationTrigger) {
      const validationFn = async (): Promise<boolean> => {
        // Update form values first
        setValue("fin", formData.fin, { shouldValidate: true });
        setValue("company", formData.company, { shouldValidate: true });
        setValue("firstName", formData.firstName, { shouldValidate: true });
        setValue("lastName", formData.lastName, { shouldValidate: true });
        setValue("fatherName", formData.fatherName, { shouldValidate: true });
        setValue("gender", formData.gender, { shouldValidate: true });
        
        // Trigger validation for all fields
        const results = await Promise.all([
          trigger("fin"),
          trigger("company"),
          trigger("firstName"),
          trigger("lastName"),
          trigger("fatherName"),
          trigger("gender"),
        ]);
        
        // Show validation errors
        setShouldShowValidation(true);
        
        // Return true if all validations passed
        return results.every(result => result === true);
      };
      
      setValidationTrigger(validationFn);
    }
  }, [isEditMode, setValidationTrigger, setValue, trigger, formData.fin, formData.company, formData.firstName, formData.lastName, formData.fatherName, formData.gender]);

  return (
    <div className={styles.container}>
      {/* PERSONAL INFO SECTION */}
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="fin">
            FİN
            <span className="required-star">*</span>
          </label>
          <FinSearchField
            id="fin"
            value={formData.fin}
            disabled={isFinReadOnly || isFinDisabled}
            inputClassName={!isEditMode && shouldShowValidation && errors.fin ? "error" : ""}
            onChange={(value) => {
              onInputChange("fin", value);
              if (!isEditMode) {
                setValue("fin", value, { shouldValidate: false });
                clearErrors("fin");
                if (setPinSearchError) {
                  setPinSearchError(null);
                }
              }
            }}
            onClear={handleClearAll}
            onSearch={() => {
              if (handleSearchByPin && formData.fin) {
                handleSearchByPin(formData.fin);
              }
            }}
            clearTitle="Hamısını təmizlə"
            searchLabel="Axtar"
            clearButtonAlwaysEnabled={!isEditMode && !isFinReadOnly}
          />
          {!isEditMode && shouldShowValidation && errors.fin && (
            <span className={styles.errorMessage}>{errors.fin.message}</span>
          )}
          {!isEditMode && pinSearchError && (
            <span className={styles.errorMessage}>{pinSearchError}</span>
          )}
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="company">
            Şirkət
            <span className="required-star">*</span>
          </label>
          <CustomSelect
            id="company"
            options={companiesOptions}
            value={formData.company}
            onChange={(val) => {
              onInputChange("company", val);
              if (!isEditMode) {
                setValue("company", val, { shouldValidate: false });
                clearErrors("company");
              }
            }}
            defaultText="Şirkət seçin"
            isSearchable={true}
            searchPlaceholder="Axtar..."
            disabled={isCompanyReadOnly}
            error={!isEditMode && shouldShowValidation && !!errors.company}
          />
          {!isEditMode && shouldShowValidation && errors.company && (
            <span className={styles.errorMessage}>{errors.company.message}</span>
          )}
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <FormInput
            label="Ad"
            id="firstName"
            type="text"
            placeholder="Ad daxil edin"
            value={formData.firstName}
            onChange={(val) => {
              onInputChange("firstName", val);
              if (!isEditMode) {
                setValue("firstName", val, { shouldValidate: false });
                clearErrors("firstName");
              }
            }}
            required={true}
            className={!isEditMode && shouldShowValidation && errors.firstName ? "error" : ""}
          />
          {!isEditMode && shouldShowValidation && errors.firstName && (
            <span className={styles.errorMessage}>{errors.firstName.message}</span>
          )}
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="birthDate">
            Doğum tarixi
          </label>
          <ModernDatePicker
            id="birthDate"
            value={formData.birthDate}
            onChange={(date) => onInputChange("birthDate", date)}
          />
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <FormInput
            label="Soyad"
            id="lastName"
            type="text"
            placeholder="Soyad daxil edin"
            value={formData.lastName}
            onChange={(val) => {
              onInputChange("lastName", val);
              if (!isEditMode) {
                setValue("lastName", val, { shouldValidate: false });
                clearErrors("lastName");
              }
            }}
            required={true}
            className={!isEditMode && shouldShowValidation && errors.lastName ? "error" : ""}
          />
          {!isEditMode && shouldShowValidation && errors.lastName && (
            <span className={styles.errorMessage}>{errors.lastName.message}</span>
          )}
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="gender">
            Cins
            <span className="required-star">*</span>
          </label>
          <CustomSelect
            id="gender"
            options={GENDER_OPTIONS}
            value={formData.gender}
            onChange={(val) => {
              onInputChange("gender", val);
              if (!isEditMode) {
                setValue("gender", val, { shouldValidate: false });
                clearErrors("gender");
              }
            }}
            defaultText="Seçin"
            searchPlaceholder="Axtar..."
            error={!isEditMode && shouldShowValidation && !!errors.gender}
          />
          {!isEditMode && shouldShowValidation && errors.gender && (
            <span className={styles.errorMessage}>{errors.gender.message}</span>
          )}
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <FormInput
            label="Ata adı"
            id="fatherName"
            type="text"
            placeholder="Ata adını daxil edin"
            value={formData.fatherName}
            onChange={(val) => {
              onInputChange("fatherName", val);
              if (!isEditMode) {
                setValue("fatherName", val, { shouldValidate: false });
                clearErrors("fatherName");
              }
            }}
            required={true}
            className={!isEditMode && shouldShowValidation && errors.fatherName ? "error" : ""}
          />
          {!isEditMode && shouldShowValidation && errors.fatherName && (
            <span className={styles.errorMessage}>{errors.fatherName.message}</span>
          )}
        </div>
        <div className={styles.formGroup}></div>
      </div>

<div className={styles.componentContainer}>
      <DocumentInfoSection
        newDocument={newDocument}
        addedDocuments={addedDocuments}
        onNewDocumentChange={onNewDocumentChange}
        onAddDocument={onAddDocument}
        onRemoveDocument={onRemoveDocument}
        onListDocumentChange={onListDocumentChange}
        title="Sənəd məlumatları"
        disableListedDocuments={true}
      />

      <ContactInfoSection
        newContact={newContact}
        addedContacts={addedContacts}
        onNewContactChange={onNewContactChange}
        onNewContactPrimaryChange={onNewContactPrimaryChange}
        onAddContact={onAddContact}
        onRemoveContact={onRemoveContact}
        onListContactChange={onListContactChange}
        onListContactPrimaryToggle={onListContactPrimaryToggle}
        title="Əlaqə məlumatları"
          disableListedContacts={true}
        />
      </div>
    </div>
  );
};

export default InfoTab;
