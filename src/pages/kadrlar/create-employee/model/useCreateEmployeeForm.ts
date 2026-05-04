import { useState, useCallback, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import type { TabKey } from "../../employee-shared/model/types";
import { CONTACT_TYPE_OPTIONS } from "../../employee-shared/ui/info-tab/consts";
import { useEmployeeFormData } from "../hooks/useEmployeeFormData";
import { useEmployeeContacts } from "../hooks/useEmployeeContacts";
import { useEmployeeDocuments } from "../hooks/useEmployeeDocuments";
import { useEmployeeAvatar } from "../hooks/useEmployeeAvatar";
import type { CreateEmployeeContextValue } from "../contexts/CreateEmployeeContext";
import { employeesService } from "@/features/kadrlar/employees/api/employeesService";
import { departmentsService } from "@/features/kadrlar/departments";
import { lookupsService } from "@/features/lookups";
import { mapEnumItemsToOptions } from "@/features/lookups/lib/mapEnumItemsToOptions";
import { createEmployeeService } from "@/features/kadrlar/create-employee/api";
import { EmployeeDataMapper, type EmployeeApiResponse } from "../utils/employeeDataMapper";
import type { Option } from "@/shared/types";
import { getBackendErrorMessage } from "@/shared/api/httpClient";
import type { AxiosError } from "axios";

export const useCreateEmployeeForm = (): CreateEmployeeContextValue => {
  const [activeTab, setActiveTab] = useState<TabKey>("info");
  const [isLdapModalOpen, setIsLdapModalOpen] = useState(false);
  const [isPinSearchResultModalOpen, setIsPinSearchResultModalOpen] = useState(false);
  const [pinSearchResultData, setPinSearchResultData] = useState<{
    name: string;
    surname: string;
    patronymic: string;
    birthDate: string;
    gender: string;
    pin: string;
    employees: Array<{ id?: string; companyName: string; createdAt: string }>;
  } | null>(null);
  const [pinSearchRawData, setPinSearchRawData] = useState<EmployeeApiResponse | null>(null);
  const [pinSearchError, setPinSearchError] = useState<string | null>(null);
  
  // Original data from PIN search (to track deleted items)
  const [originalContactsFromPin, setOriginalContactsFromPin] = useState<Array<{ id?: string; type?: string; value?: string; isMain?: boolean }>>([]);
  const [originalDocumentsFromPin, setOriginalDocumentsFromPin] = useState<Array<{ id?: string; type?: string; series?: string; number?: string; issuedAt?: string; expireAt?: string }>>([]);
  
  // Lookup data states (loaded after PIN search confirmation)
  const [companiesOptions, setCompaniesOptions] = useState<Option[]>([]);
  const [contactTypesOptions, setContactTypesOptions] = useState<Option[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isFinDisabled, setIsFinDisabled] = useState(false);
  const [areTabsEnabled, setAreTabsEnabled] = useState(false);
  const [rootCompanyId, setRootCompanyId] = useState<string | null>(null);
  const [employmentId, setEmploymentId] = useState<string | null>(null);
  const [handleStaffSave, setHandleStaffSave] = useState<(() => Promise<void>) | undefined>(undefined);
  const [isStaffSaving, setIsStaffSaving] = useState(false);
  const [isLdapSelected, setIsLdapSelected] = useState(false);
  const [usernameFromPinSearch, setUsernameFromPinSearch] = useState<string | null>(null);

  const setHandleStaffSaveWrapper = useCallback((handler: () => Promise<void>) => {
    setHandleStaffSave(() => async () => {
      setIsStaffSaving(true);
      try {
        await handler();
      } finally {
        setIsStaffSaving(false);
      }
    });
  }, []);
  const validationTriggerRef = useRef<(() => Promise<boolean>) | null>(null);
  
  const setValidationTrigger = useCallback((trigger: () => Promise<boolean>) => {
    validationTriggerRef.current = trigger;
  }, []);

  // Compose hooks
  const formDataHook = useEmployeeFormData();
  const contactsHook = useEmployeeContacts();
  const documentsHook = useEmployeeDocuments();
  const avatarHook = useEmployeeAvatar();

  // Load lookups on page load
  useEffect(() => {
    const loadLookups = async () => {
      try {
        const [companiesLookup, contactTypesRes] = await Promise.all([
          departmentsService.getRootCompaniesLookup(),
          lookupsService.getEnumItemsByTypeCode("ContactTypes"),
        ]);
        setCompaniesOptions(companiesLookup);
        setContactTypesOptions(mapEnumItemsToOptions(contactTypesRes?.result ?? contactTypesRes?.data ?? []));
      } catch (error) {
        toast.error(getBackendErrorMessage(error as AxiosError) || "Lookups yüklənərkən xəta baş verdi");
      }
    };
    loadLookups();
  }, []);

  const handleLdapConfirm = useCallback(
    (user: { firstName: string; lastName: string; username: string; email: string }) => {
      formDataHook.handleInputChange("firstName", user.firstName || "");
      formDataHook.handleInputChange("lastName", user.lastName || "");
      formDataHook.handleInputChange("username", user.username || "");
      setIsLdapSelected(true); // Mark as LDAP selected
      if (user.email) {
        const emailOption = CONTACT_TYPE_OPTIONS.find((o) => o.id === "email");
        contactsHook.setAddedContacts((prev) => [
          {
            id: Date.now(),
            type: emailOption || null,
            value: user.email,
            isPrimary: true,
          },
          ...prev,
        ]);
      }
    },
    [formDataHook, contactsHook]
  );

  /**
   * Handles save - creates employee with form data
   * Single Responsibility: Only responsible for saving employee data
   */
  const handleSave = useCallback(async () => {
    // Trigger validation from InfoTab if available
    if (validationTriggerRef.current) {
      const isValid = await validationTriggerRef.current();
      if (!isValid) {
        return; // Validation failed, errors are shown in InfoTab
      }
    }

    if (!validationTriggerRef.current) {
      // Fallback to manual validation if validation trigger is not available
      if (!formDataHook.formData.firstName || !formDataHook.formData.firstName.trim()) {
        toast.error("Ad daxil edilməlidir");
        return;
      }

      if (!formDataHook.formData.lastName || !formDataHook.formData.lastName.trim()) {
        toast.error("Soyad daxil edilməlidir");
        return;
      }

      if (!formDataHook.formData.fin || !formDataHook.formData.fin.trim()) {
        toast.error("FİN daxil edilməlidir");
        return;
      }

      if (!formDataHook.formData.company) {
        toast.error("İş yeri seçilməlidir");
        return;
      }
    }

    setIsSaving(true);

    try {
      // Check if PIN search was performed
      const pinChecked = !!pinSearchRawData;

      // Map form data to API format
      const requestData = EmployeeDataMapper.mapFormDataToCreateRequest(
        formDataHook.formData,
        contactsHook.addedContacts,
        originalContactsFromPin,
        documentsHook.addedDocuments,
        originalDocumentsFromPin,
        pinChecked
      );

      // Save rootCompanyId from payload for later use
      if (requestData.rootCompanyId) {
        setRootCompanyId(requestData.rootCompanyId);
      }

      // Create employee
      const response = await createEmployeeService.create(requestData);

      // Check if response is successful (response.ok is implicit if no exception thrown, check isSuccess === true)
      if (response && (response as any).isSuccess === true) {
        // Extract employmentId from response
        const result = (response as any).result;
        if (result && result.employmentId) {
          setEmploymentId(result.employmentId);
        }
        // Enable tabs after successful save
        setAreTabsEnabled(true);
        // Show success modal instead of navigating immediately
        setIsSuccessModalOpen(true);
      } else {
        const errorMessage = (response as any)?.errorMessage || "Xəta baş verdi";
        toast.error(errorMessage);
      }
    } catch (error: any) {
      toast.error(getBackendErrorMessage(error as AxiosError) || "Xəta baş verdi");
    } finally {
      setIsSaving(false);
    }
  }, [formDataHook.formData, contactsHook.addedContacts, documentsHook.addedDocuments, pinSearchRawData, originalContactsFromPin, originalDocumentsFromPin]);

  const handleClearAll = useCallback(() => {
    // Clear form data but preserve company select value (don't call handleInputChange for company)
    formDataHook.handleInputChange("firstName", "");
    formDataHook.handleInputChange("lastName", "");
    formDataHook.handleInputChange("fatherName", "");
    formDataHook.handleInputChange("birthDate", null);
    formDataHook.handleInputChange("gender", null);
    formDataHook.handleInputChange("fin", "");
    formDataHook.handleInputChange("username", "");

    // Clear contacts list
    contactsHook.setAddedContacts([]);
    // Reset newContact but preserve type (don't call handleNewContactChange for type)
    contactsHook.handleNewContactChange("value", "");
    contactsHook.handleNewContactPrimaryChange(false);

    // Clear documents list
    documentsHook.setAddedDocuments([]);
    // Reset newDocument but preserve type (don't call handleNewDocumentChange for type)
    documentsHook.handleNewDocumentChange("series", "");
    documentsHook.handleNewDocumentChange("number", "");
    documentsHook.handleNewDocumentChange("issueDate", null);
    documentsHook.handleNewDocumentChange("expiryDate", null);

    // Clear avatar
    avatarHook.resetAvatar();

    // Clear PIN search data
    setPinSearchRawData(null);
    setPinSearchResultData(null);
    setOriginalContactsFromPin([]);
    setOriginalDocumentsFromPin([]);
    
    // Re-enable FIN input when clearing
    setIsFinDisabled(false);
    
    // Disable tabs when clearing
    setAreTabsEnabled(false);
    
    // Clear rootCompanyId when clearing
    setRootCompanyId(null);
    
    // Clear employmentId when clearing
    setEmploymentId(null);
    
    // Clear LDAP selection when clearing
    setIsLdapSelected(false);
    
    // Clear username from PIN search tracking
    setUsernameFromPinSearch(null);

    // Keep lookup data (companiesOptions, contactTypesOptions remain available)
  }, [formDataHook, contactsHook, documentsHook, avatarHook]);

  // Success modal handlers
  const handleSuccessModalCreateNew = useCallback(() => {
    setIsSuccessModalOpen(false);
    handleClearAll();
  }, [setIsSuccessModalOpen, handleClearAll]);

  const handleSuccessModalContinue = useCallback(() => {
    setIsSuccessModalOpen(false);
    // Navigate to "Ştat cədvəli" tab instead of employees list
    setActiveTab("staff");
  }, [setIsSuccessModalOpen, setActiveTab]);

  /**
   * Handles PIN search - only fetches data and opens modal
   * Single Responsibility: Only responsible for API call and modal state
   */
  const handleSearchByPin = useCallback(
    async (pin: string) => {
      if (!pin || pin.trim().length === 0) {
        return;
      }

      // Clear previous error
      setPinSearchError(null);

      try {
        const response = await employeesService.getByPin(pin);
        
        // isSuccess kontrolü yap
        const isSuccess = (response as any).isSuccess !== undefined 
          ? (response as any).isSuccess 
          : true; // Eğer isSuccess yoksa, varsayılan olarak true kabul et
        
        if (!isSuccess) {
          setPinSearchError("Məlumat tapılmadı");
          return;
        }
        
        // result kontrolü yap
        const result = (response as any).result;
        if (!result) {
          setPinSearchError("Məlumat tapılmadı");
          return;
        }
        
        // Raw data'yı kaydet (tüm response'u kaydet, result'u sonra çıkarırız)
        setPinSearchRawData(response as any);
        
        // Modal'da gösterilecek veriyi kaydet (result içinden)
        const displayData = EmployeeDataMapper.extractDisplayData(result);
        setPinSearchResultData(displayData);
        
        // Modal'ı aç
        setIsPinSearchResultModalOpen(true);
      } catch (error) {
        toast.error(getBackendErrorMessage(error as AxiosError) || "Axtarış zamanı xəta baş verdi");
        setPinSearchError("Məlumat tapılmadı");
      }
    },
    []
  );

  /**
   * Handles PIN search confirmation - fills form with data
   * Single Responsibility: Only responsible for filling form data
   */
  const handlePinSearchConfirm = useCallback(async () => {
    if (!pinSearchRawData) return;

    try {
      // Extract employee data from response (response.result or direct response)
      const responseData = (pinSearchRawData as any).result || pinSearchRawData;
      
      // Check if response is successful
      const isSuccess = (pinSearchRawData as any).isSuccess !== undefined 
        ? (pinSearchRawData as any).isSuccess 
        : true;

      if (!isSuccess) {
        toast.error("Məlumat tapılmadı");
        return;
      }

      const currentContactTypesOptions = contactTypesOptions;

      // Map API data to form data (use responseData which is the actual employee data)
      const formData = EmployeeDataMapper.mapToFormData(responseData as EmployeeApiResponse);
      
      const { contacts } = EmployeeDataMapper.mapToContacts(responseData as EmployeeApiResponse, currentContactTypesOptions);
      const { documents } = EmployeeDataMapper.mapToDocuments(
        responseData as EmployeeApiResponse,
        [] // DocumentTypes lazy-loaded in EnumLookupSelect
      );

      // Fill form data
      if (formData.firstName) {
      formDataHook.handleInputChange("firstName", formData.firstName);
      }
      if (formData.lastName) {
      formDataHook.handleInputChange("lastName", formData.lastName);
      }
      if (formData.fatherName) {
      formDataHook.handleInputChange("fatherName", formData.fatherName);
      }
      if (formData.birthDate) {
      formDataHook.handleInputChange("birthDate", formData.birthDate);
      }
      if (formData.gender) {
      formDataHook.handleInputChange("gender", formData.gender);
      }
      if (formData.fin) {
      formDataHook.handleInputChange("fin", formData.fin);
      }
      if (formData.username) {
      formDataHook.handleInputChange("username", formData.username);
      // Store username from PIN search
      setUsernameFromPinSearch(formData.username);
      }

      // Store original data from PIN search (for tracking deleted items)
      const employeeData = responseData as EmployeeApiResponse;
      setOriginalContactsFromPin(employeeData.contacts || []);
      setOriginalDocumentsFromPin(employeeData.documents || []);

      // Fill contacts
      contactsHook.setAddedContacts(contacts);

      // Fill documents
      documentsHook.setAddedDocuments(documents);

      // Close modal
      setIsPinSearchResultModalOpen(false);
      
      // Disable FIN input after confirmation
      setIsFinDisabled(true);
    } catch (error) {
      toast.error(getBackendErrorMessage(error as AxiosError) || "Məlumat formaya doldurularkən xəta baş verdi");
      // Even if mapping fails, try to map documents and contacts with available data
      try {
        const responseData = (pinSearchRawData as any).result || pinSearchRawData;
        const { documents } = EmployeeDataMapper.mapToDocuments(responseData as EmployeeApiResponse, []);
      documentsHook.setAddedDocuments(documents);
        const { contacts } = EmployeeDataMapper.mapToContacts(responseData as EmployeeApiResponse, contactTypesOptions);
        contactsHook.setAddedContacts(contacts);
      } catch (mappingError) {
        toast.error(getBackendErrorMessage(mappingError as AxiosError) || "Əlaqə və sənədlər formaya doldurularkən xəta baş verdi");
      }
    }
  }, [pinSearchRawData, formDataHook, contactsHook, documentsHook, contactTypesOptions]);

  /**
   * Handles PIN search cancellation - clears data
   * Single Responsibility: Only responsible for clearing data
   */
  const handlePinSearchCancel = useCallback(() => {
    // Clear raw data
    setPinSearchRawData(null);
    setPinSearchResultData(null);
    // Clear original data
    setOriginalContactsFromPin([]);
    setOriginalDocumentsFromPin([]);
    // Clear lookup data
    setCompaniesOptions([]);
    setContactTypesOptions([]);
    setIsDataLoaded(false);
  }, []);

  const setPinSearchRawDataWrapper = useCallback((data: unknown | null) => {
    setPinSearchRawData(data as EmployeeApiResponse | null);
  }, []);

  return {
    // Tab management
    activeTab,
    setActiveTab,

    // Form data
    formData: formDataHook.formData,
    handleInputChange: useCallback((field: keyof typeof formDataHook.formData, value: any) => {
      formDataHook.handleInputChange(field, value);
      // Reset LDAP selection and PIN search username when username is manually changed
      if (field === "username") {
        setIsLdapSelected(false);
        // If username is manually changed, clear the PIN search username tracking
        if (value !== usernameFromPinSearch) {
          setUsernameFromPinSearch(null);
        }
      }
    }, [formDataHook, usernameFromPinSearch]),

    // Contacts
    newContact: contactsHook.newContact,
    addedContacts: contactsHook.addedContacts,
    handleNewContactChange: contactsHook.handleNewContactChange,
    handleNewContactPrimaryChange: contactsHook.handleNewContactPrimaryChange,
    handleAddContact: contactsHook.handleAddContact,
    handleRemoveContact: contactsHook.handleRemoveContact,
    handleListContactChange: contactsHook.handleListContactChange,
    handleListContactPrimaryToggle: contactsHook.handleListContactPrimaryToggle,

    // Documents
    newDocument: documentsHook.newDocument,
    addedDocuments: documentsHook.addedDocuments,
    handleNewDocumentChange: documentsHook.handleNewDocumentChange,
    handleAddDocument: documentsHook.handleAddDocument,
    handleRemoveDocument: documentsHook.handleRemoveDocument,
    handleListDocumentChange: documentsHook.handleListDocumentChange,

    // Avatar
    avatarPreview: avatarHook.avatarPreview,
    fileInputRef: avatarHook.fileInputRef,
    handleAvatarClick: avatarHook.handleAvatarClick,
    handleClearAvatar: avatarHook.handleClearAvatar,
    handleFileChange: avatarHook.handleFileChange,

    // LDAP
    isLdapModalOpen,
    setIsLdapModalOpen,
    handleLdapConfirm,
    isLdapSelected,
    setIsLdapSelected,

    // Save/Clear
    handleSave,
    handleClearAll,
    isSaving,
    setValidationTrigger,

    // Success Modal
    isSuccessModalOpen,
    setIsSuccessModalOpen,
    handleSuccessModalCreateNew,
    handleSuccessModalContinue,

    // FIN Input Disabled State
    isFinDisabled,

    // Tabs Enabled State
    areTabsEnabled,

    // Root Company ID
    rootCompanyId,

    // Employment ID
    employmentId,

    // Staff Tab Save Handler
    handleStaffSave,
    setHandleStaffSave: setHandleStaffSaveWrapper,
    isStaffSaving,

    // PIN Search
    handleSearchByPin,
    handlePinSearchConfirm,
    handlePinSearchCancel,
    isPinSearchResultModalOpen,
    setIsPinSearchResultModalOpen,
    pinSearchResultData,
    setPinSearchResultData,
    pinSearchRawData,
    setPinSearchRawData: setPinSearchRawDataWrapper,
    pinSearchError,
    setPinSearchError,
    usernameFromPinSearch,

    // Lookup data
    companiesOptions,
    contactTypesOptions,
    isDataLoaded,
  };
};