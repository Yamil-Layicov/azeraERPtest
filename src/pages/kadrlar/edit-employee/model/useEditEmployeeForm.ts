import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { employeesService } from "@/features/kadrlar/employees/api/employeesService";
import { departmentsService } from "@/features/kadrlar/departments";
import { lookupsService } from "@/features/lookups";
import { mapEnumItemsToOptions } from "@/features/lookups/lib/mapEnumItemsToOptions";
import { CONTACT_TYPE_OPTIONS } from "../../employee-shared/ui/info-tab/consts";
import type { TabKey, Contact } from "../../employee-shared/model/types";
import type { Option } from "@/shared/types";
import { useEmployeeFormData } from "../../create-employee/hooks/useEmployeeFormData";
import { useEmployeeContacts } from "../../create-employee/hooks/useEmployeeContacts";
import { useEmployeeDocuments } from "../../create-employee/hooks/useEmployeeDocuments";
import { useEmployeeAvatar } from "../../create-employee/hooks/useEmployeeAvatar";
import type { CreateEmployeeContextValue } from "../../create-employee/contexts/CreateEmployeeContext";
import { ROUTES } from "@/app/routes/consts";
import {
  isMobileContactType,
  isMobileContactTypeId,
  normalizeMobileValue,
} from "../../employee-shared/model/contacts-documents-schema";
import type { AxiosError } from "axios";
import { getBackendErrorMessage } from "@/shared/api/httpClient";

const CONTACT_TYPE_MAP = new Map(
  CONTACT_TYPE_OPTIONS.map((option) => [option.id, option]),
);

export const useEditEmployeeForm = (): CreateEmployeeContextValue => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<TabKey>("info");
  const [isLoading, setIsLoading] = useState(true);
  const [isLdapModalOpen, setIsLdapModalOpen] = useState(false);
  const [isPinSearchResultModalOpen, setIsPinSearchResultModalOpen] =
    useState(false);
  const [pinSearchResultData, setPinSearchResultData] = useState<{
    name: string;
    surname: string;
    patronymic: string;
    birthDate: string;
    gender: string;
    pin: string;
    employees: Array<{ id?: string; companyName: string; createdAt: string }>;
  } | null>(null);
  const [pinSearchRawData, setPinSearchRawData] = useState<any | null>(null);
  const [pinSearchError, setPinSearchError] = useState<string | null>(null);
  const [originalUsername, setOriginalUsername] = useState<string | null>(null);
  const [isLdapSelected, setIsLdapSelected] = useState(false);

  // Lookup data states
  const [companiesOptions, setCompaniesOptions] = useState<Option[]>([]);
  const [contactTypesOptions, setContactTypesOptions] = useState<Option[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Backend-dən gələn orijinal məlumatlar — silinənləri payload-da isDeleted: true ilə göndərmək üçün
  const [originalContactsFromApi, setOriginalContactsFromApi] = useState<
    Array<{ id: string; type: string; value: string; isMain: boolean }>
  >([]);
  const [originalDocumentsFromApi, setOriginalDocumentsFromApi] = useState<
    Array<{
      id: string;
      type: string;
      series: string;
      number: string;
      issuedAt?: string;
      expireAt?: string;
      issuer?: string;
    }>
  >([]);

  const formDataHook = useEmployeeFormData();
  const contactsHook = useEmployeeContacts();
  const documentsHook = useEmployeeDocuments();
  const avatarHook = useEmployeeAvatar();

  // Load lookups on page load
  useEffect(() => {
    const loadLookups = async () => {
      try {
        const [companiesLookup, contactTypesRes] = await Promise.all([
          departmentsService.getCompaniesLookup(),
          lookupsService.getEnumItemsByTypeCode("ContactTypes"),
        ]);
        setCompaniesOptions(companiesLookup);
        setContactTypesOptions(
          mapEnumItemsToOptions(
            contactTypesRes?.result ?? contactTypesRes?.data ?? [],
          ),
        );
        setIsDataLoaded(true);
      } catch (error) {
        toast.error(
          getBackendErrorMessage(error as AxiosError) ||
            "Şifrə yenilənərkən xəta baş verdi",
        );
      }
    };
    loadLookups();
  }, []);

  useEffect(() => {
    // Options yüklenene kadar bekle (companiesOptions, contactTypesOptions)
    if (
      id &&
      isDataLoaded &&
      companiesOptions.length > 0 &&
      contactTypesOptions.length > 0
    ) {
      setIsLoading(true);
      employeesService
        .getById(id)
        .then((data) => {
          // Find company from options using rootCompanyId
          const companyOption =
            companiesOptions.find(
              (opt) => String(opt.id) === String(data.rootCompanyId),
            ) || null;

          formDataHook.setFormData({
            firstName: data.name || "",
            lastName: data.surname || "",
            fatherName: data.patronymic || "",
            birthDate: data.birthDate ? new Date(data.birthDate) : null,

            gender:
              data.gender === "Male" || data.gender === "male"
                ? { id: "male", fullName: "Kişi", role: "" }
                : data.gender === "Female" || data.gender === "female"
                  ? { id: "female", fullName: "Qadın", role: "" }
                  : null,

            fin: data.pin || "",
            username: data.username || "",
            isActive: true,
            group: [],
            password: "",

            company: companyOption,
            position: null,
            experienceType: null,
            isLeader: false,
          });

          // Store original username for edit mode
          setOriginalUsername(data.username || null);

          // Silinən əlaqə/sənədləri payload-da isDeleted: true ilə göndərmək üçün orijinal məlumatları saxla
          setOriginalContactsFromApi(
            (data.contacts || []).map((c: any) => ({
              id: String(c.id || ""),
              type: String(c.type || ""),
              value: String(c.value || ""),
              isMain: !!c.isMain,
            })),
          );
          setOriginalDocumentsFromApi(
            (data.documents || []).map((d: any) => ({
              id: String(d.id || ""),
              type: String(d.type || ""),
              series: String(d.series || ""),
              number: String(d.number || ""),
              issuedAt: d.issuedAt || "",
              expireAt: d.expireAt || "",
              issuer: d.issuer || "",
            })),
          );

          const loadedContacts: Contact[] = [];

          if (data.contacts && Array.isArray(data.contacts)) {
            data.contacts.forEach((contact: any, index: number) => {
              // Case-insensitive eşleştirme: "Email" -> "email", "Phone" -> "phone", "Mobile" -> "phone"
              const normalizedType = contact.type?.toLowerCase();
              let contactType: Option | undefined =
                CONTACT_TYPE_MAP.get(normalizedType);

              // "Mobile" -> "phone" mapping
              if (
                !contactType &&
                (normalizedType === "mobile" || contact.type === "Mobile")
              ) {
                contactType = CONTACT_TYPE_MAP.get("phone");
              }

              // Eğer hala bulunamadıysa, options'dan case-insensitive arama yap
              if (!contactType && contactTypesOptions.length > 0) {
                contactType = contactTypesOptions.find(
                  (opt) =>
                    String(opt.id || "").toLowerCase() === normalizedType ||
                    String(opt.fullName || "").toLowerCase() === normalizedType,
                );
              }

              if (contactType) {
                loadedContacts.push({
                  id: contact.id || Date.now() + index,
                  type: contactType,
                  value: contact.value || "",
                  isPrimary: contact.isMain || false,
                });
              }
            });
          }

          contactsHook.setAddedContacts(loadedContacts);

          const loadedDocuments: any[] = [];

          if (data.documents && Array.isArray(data.documents)) {
            data.documents.forEach((doc: any, index: number) => {
              // DocumentTypes lazy-loaded in EnumLookupSelect; use raw value for display
              const docTypeOption: Option = {
                id: doc.type,
                fullName: doc.type,
                role: "",
              };

              loadedDocuments.push({
                id: doc.id || Date.now() + index,
                type: docTypeOption,
                series: doc.series || "",
                number: doc.number || "",
                issueDate: doc.issuedAt ? new Date(doc.issuedAt) : null,
                expiryDate: doc.expireAt ? new Date(doc.expireAt) : null,
                issuer: doc.issuer || "", // issuer alanını da ekle
              });
            });
          }

          documentsHook.setAddedDocuments(loadedDocuments);
        })
        .catch((err) => {
          toast.error(
            getBackendErrorMessage(err as AxiosError) ||
              "Məlumatları yükləyərkən xəta baş verdi",
          );
        })
        .finally(() => setIsLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isDataLoaded, companiesOptions, contactTypesOptions]);

  const handleLdapConfirm = useCallback(
    (user: {
      firstName: string;
      lastName: string;
      username: string;
      email: string;
    }) => {
      formDataHook.handleInputChange("firstName", user.firstName || "");
      formDataHook.handleInputChange("lastName", user.lastName || "");
      formDataHook.handleInputChange("username", user.username || "");
      setIsLdapSelected(true);
      if (user.email) {
        const emailOption = CONTACT_TYPE_MAP.get("email");
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
    [formDataHook, contactsHook],
  );

  const handleSave = useCallback(async () => {
    if (!id) return;

    if (!formDataHook.formData.firstName || !formDataHook.formData.lastName) {
      toast.error("Ad və Soyad vacibdir!");
      return;
    }

    try {
      setIsLoading(true);

      const genderValue =
        formDataHook.formData.gender?.id === "male"
          ? "Male"
          : formDataHook.formData.gender?.id === "female"
            ? "Female"
            : "";

      const formatDate = (date: Date | null): string | null => {
        if (!date) return null;
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      const emptyToNull = (
        v: string | number | null | undefined,
      ): string | null =>
        v == null || String(v).trim() === "" ? null : String(v).trim();

      // Backend id = UUID (içində "-" var). Yeni əlavə = Date.now() (rəqəm).
      const isBackendId = (id: string | number) =>
        typeof id === "string" ? id.includes("-") : String(id).includes("-");

      const currentContactIds = new Set(
        contactsHook.addedContacts.map((c) => String(c.id)),
      );
      const contacts: Array<{
        id: string | null;
        type: string | null;
        value: string | null;
        isMain: boolean;
        isCreate: boolean;
        isDeleted: boolean;
      }> = contactsHook.addedContacts.map((contact) => {
        const isNew = !isBackendId(contact.id);
        const rawVal = contact.value ?? "";
        const value = isMobileContactType(contact.type)
          ? (normalizeMobileValue(rawVal) ?? emptyToNull(rawVal))
          : emptyToNull(rawVal);
        return {
          id: isNew ? null : String(contact.id),
          type: emptyToNull(contact.type?.id ?? ""),
          value,
          isMain: contact.isPrimary,
          isCreate: isNew,
          isDeleted: false,
        };
      });
      originalContactsFromApi.forEach((orig) => {
        if (orig.id && !currentContactIds.has(orig.id)) {
          const rawVal = orig.value ?? "";
          const value = isMobileContactTypeId(orig.type)
            ? (normalizeMobileValue(rawVal) ?? emptyToNull(rawVal))
            : emptyToNull(rawVal);
          contacts.push({
            id: orig.id,
            type: emptyToNull(orig.type),
            value,
            isMain: orig.isMain,
            isCreate: false,
            isDeleted: true,
          });
        }
      });

      const currentDocumentIds = new Set(
        documentsHook.addedDocuments.map((d) => String(d.id)),
      );
      // doc.type?.id = API value (IdCard, Passport, ...). DocumentTypes lazy-loaded in EnumLookupSelect.
      const documents: Array<{
        id: string | null;
        type: string | null;
        series: string | null;
        number: string | null;
        issuedAt: string | null;
        expireAt: string | null;
        issuer: string | null;
        isCreate: boolean;
        isDeleted: boolean;
      }> = documentsHook.addedDocuments.map((doc) => {
        const isNew = !isBackendId(doc.id);
        const seriesVal = doc.series === "-" ? "" : (doc.series ?? "");
        return {
          id: isNew ? null : String(doc.id),
          type: emptyToNull(doc.type?.id ?? ""),
          series: emptyToNull(seriesVal),
          number: emptyToNull(doc.number),
          issuedAt: formatDate(doc.issueDate),
          expireAt: formatDate(doc.expiryDate),
          issuer: emptyToNull(doc.issuer),
          isCreate: isNew,
          isDeleted: false,
        };
      });
      originalDocumentsFromApi.forEach((orig) => {
        if (orig.id && !currentDocumentIds.has(orig.id)) {
          const origSeriesVal = orig.series === "-" ? "" : (orig.series ?? "");
          documents.push({
            id: orig.id,
            type: emptyToNull(orig.type),
            series: emptyToNull(origSeriesVal),
            number: emptyToNull(orig.number),
            issuedAt: emptyToNull(orig.issuedAt),
            expireAt: emptyToNull(orig.expireAt),
            issuer: emptyToNull(orig.issuer),
            isCreate: false,
            isDeleted: true,
          });
        }
      });

      const payload = {
        id: id,
        rootCompanyId: formDataHook.formData.company?.id
          ? String(formDataHook.formData.company.id)
          : undefined,
        name: formDataHook.formData.firstName,
        surname: formDataHook.formData.lastName,
        patronymic: emptyToNull(formDataHook.formData.fatherName),
        gender: genderValue || null,
        birthDate: formatDate(formDataHook.formData.birthDate),
        contacts,
        documents,
      };

      const res = (await employeesService.update(payload)) as {
        isSuccess?: boolean;
      };
      if (res?.isSuccess === true) {
        toast.success("Məlumatlar uğurla yeniləndi", { duration: 1000 });
      }
      navigate(ROUTES.KADRLAR.EMPLOYEES.LINK);
    } catch (error) {
      toast.error(
        getBackendErrorMessage(error as AxiosError) || "Xəta baş verdi",
      );
    } finally {
      setIsLoading(false);
    }
  }, [
    id,
    formDataHook.formData,
    contactsHook.addedContacts,
    documentsHook.addedDocuments,
    originalContactsFromApi,
    originalDocumentsFromApi,
    navigate,
  ]);

  const handleClearAll = useCallback(() => {
    navigate(ROUTES.KADRLAR.EMPLOYEES.LINK);
  }, [navigate]);

  const handleSearchByPin = useCallback(async (_pin: string) => {
    // PIN search not used in edit mode
  }, []);

  const handlePinSearchConfirm = useCallback(async () => {
    // PIN search confirm not used in edit mode
  }, []);

  const handlePinSearchCancel = useCallback(() => {
    setPinSearchRawData(null);
    setPinSearchResultData(null);
  }, []);

  return {
    // Tab management
    activeTab,
    setActiveTab,

    // Form data
    formData: formDataHook.formData,
    handleInputChange: formDataHook.handleInputChange,

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
    // In edit mode LDAP selection is supported, so expose real state
    isLdapSelected,
    setIsLdapSelected,

    // Save/Clear
    handleSave,
    handleClearAll,
    isSaving: false,
    setValidationTrigger: undefined,

    // Success Modal (not used in edit mode)
    isSuccessModalOpen: false,
    setIsSuccessModalOpen: () => {},
    handleSuccessModalCreateNew: () => {},
    handleSuccessModalContinue: () => {},

    // FIN Input Disabled State (not used in edit mode)
    isFinDisabled: false,

    // Tabs Enabled State (not used in edit mode)
    areTabsEnabled: true,

    // Root Company ID (not used in edit mode)
    rootCompanyId: null,

    // Employment ID (use employee ID from URL in edit mode)
    employmentId: id || null,

    // Staff Tab Save Handler (not used in edit mode)
    handleStaffSave: undefined,
    setHandleStaffSave: undefined,
    isStaffSaving: false,

    // PIN Search
    handleSearchByPin,
    handlePinSearchConfirm,
    handlePinSearchCancel,
    isPinSearchResultModalOpen,
    setIsPinSearchResultModalOpen,
    pinSearchResultData,
    setPinSearchResultData,
    pinSearchRawData,
    setPinSearchRawData,
    pinSearchError,
    setPinSearchError,
    usernameFromPinSearch: null,
    originalUsername,

    // Loading state
    isLoading,

    // Lookup data
    companiesOptions,
    contactTypesOptions,
    isDataLoaded,
  };
};
