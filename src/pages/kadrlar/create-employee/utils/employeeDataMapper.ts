import type { Contact, EmployeeFormData, EmployeeDocument } from "../../employee-shared/model/types";
import { CONTACT_TYPE_OPTIONS } from "../../employee-shared/ui/info-tab/consts";
import type { Option } from "@/shared/types";
import type { CreateEmployeeRequest, CreateEmployeeContact, CreateEmployeeDocument } from "@/features/kadrlar/create-employee/model/types";
import {
  isMobileContactType,
  isMobileContactTypeId,
  normalizeMobileValue,
} from "../../employee-shared/model/contacts-documents-schema";
import { formatDateToYMD } from "@/shared/lib/utils";

// Component dışında bir kere oluştur - sabit değer olduğu için useMemo'ya gerek yok
const CONTACT_TYPE_MAP = new Map(
  CONTACT_TYPE_OPTIONS.map((option) => [option.id, option])
);

export interface EmployeeApiResponse {
  id?: string;
  name: string;
  surname: string;
  patronymic: string;
  birthDate: string;
  gender: string;
  pin?: string;
  username?: string | null;
  contacts?: Array<{
    id?: string;
    type: string;
    value: string;
    isMain: boolean;
  }>;
  documents?: Array<{
    id?: string;
    type: string;
    series: string;
    number: string;
    issuedAt: string;
    expireAt: string;
  }>;
  employees?: Array<{
    id?: string;
    companyName: string;
    createdAt: string;
  }>;
  relativesWhoAreEmployees?: Array<{
    id: string;
    fullname: string;
    companyName: string;
    status: string;
    createdAt: string;
  }>;
}

export interface MappedEmployeeFormData {
  firstName: string;
  lastName: string;
  fatherName: string;
  birthDate: Date | null;
  gender: { id: string; fullName: string; role: string } | null;
  fin: string;
  username: string;
}

export interface MappedContacts {
  contacts: Contact[];
}

export interface MappedDocuments {
  documents: EmployeeDocument[];
}

/**
 * Maps API response to form data format
 * Single Responsibility: Only responsible for data transformation
 */
export class EmployeeDataMapper {
  /**
   * Maps API employee data to form data format
   */
  static mapToFormData(data: EmployeeApiResponse): MappedEmployeeFormData {
    return {
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
    };
  }

  /**
   * Maps API contacts to form contacts format
   * @param data - API response data
   * @param contactTypesLookup - Contact types lookup options from API
   */
  static mapToContacts(
    data: EmployeeApiResponse,
    contactTypesLookup: Option[] = []
  ): MappedContacts {
    const contacts: Contact[] = [];

    // Create a map for quick lookup (convert id to string for comparison)
    const contactTypeMap = new Map(
      contactTypesLookup.map((option) => [String(option.id), option])
    );

    if (data.contacts && Array.isArray(data.contacts)) {
      data.contacts.forEach((contact, index) => {
        // Try to find matching contact type from lookup
        // First try exact match by id, then try case-insensitive match
        let contactType = contactTypeMap.get(contact.type) || null;
        
        if (!contactType) {
          // Try case-insensitive match
          const found = contactTypesLookup.find(
            (option) => String(option.id).toLowerCase() === contact.type.toLowerCase()
          );
          contactType = found || null;
        }

        // Fallback to old CONTACT_TYPE_MAP if lookup doesn't have it
        if (!contactType) {
          contactType = CONTACT_TYPE_MAP.get(contact.type) || null;
        }

        // If still not found, create a fallback option
        if (!contactType) {
          contactType = { id: contact.type, fullName: contact.type, role: "" };
        }

        // Generate a numeric ID from GUID or use timestamp
        let numericId: number;
        if (contact.id) {
          const hash = contact.id.split('').reduce((acc, char) => {
            return ((acc << 5) - acc) + char.charCodeAt(0);
          }, 0);
          numericId = Math.abs(hash) + Date.now() + index;
        } else {
          numericId = Date.now() + index;
        }

        contacts.push({
          id: numericId,
          type: contactType,
          value: contact.value || "",
          isPrimary: contact.isMain || false,
          originalApiId: contact.id, // Store original API ID for tracking
        });
      });
    }

    return { contacts };
  }

  /**
   * Maps API documents to form documents format
   * @param data - API response data
   * @param documentTypesLookup - Document types lookup options from API
   */
  static mapToDocuments(
    data: EmployeeApiResponse,
    documentTypesLookup: Option[] = []
  ): MappedDocuments {
    const documents: MappedDocuments["documents"] = [];

    // Create a map for quick lookup (convert id to string for comparison)
    const documentTypeMap = new Map(
      documentTypesLookup.map((option) => [String(option.id), option])
    );

    if (data.documents && Array.isArray(data.documents)) {
      data.documents.forEach((doc, index) => {
        // Try to find matching document type from lookup
        // First try exact match by id, then try case-insensitive match
        let documentType = documentTypeMap.get(doc.type) || null;
        
        if (!documentType) {
          // Try case-insensitive match
          const found = documentTypesLookup.find(
            (option) => String(option.id).toLowerCase() === doc.type.toLowerCase()
          );
          documentType = found || null;
        }

        // If still not found, create a fallback option
        if (!documentType) {
          documentType = { id: doc.type, fullName: doc.type, role: doc.type };
        }

        // Generate a numeric ID from GUID or use timestamp
        // GUID'ler numeric değil, bu yüzden hash veya timestamp kullanıyoruz
        let numericId: number;
        if (doc.id) {
          // GUID'den numeric ID oluştur (basit hash)
          const hash = doc.id.split('').reduce((acc, char) => {
            return ((acc << 5) - acc) + char.charCodeAt(0);
          }, 0);
          numericId = Math.abs(hash) + Date.now() + index;
        } else {
          numericId = Date.now() + index;
        }

        documents.push({
          id: numericId,
          type: documentType,
          series: doc.series || "",
          number: doc.number || "",
          issueDate: doc.issuedAt ? new Date(doc.issuedAt) : null,
          expiryDate: doc.expireAt ? new Date(doc.expireAt) : null,
          originalApiId: doc.id, // Store original API ID for tracking
        });
      });
    }

    return { documents };
  }

  /**
   * Extracts display data for modal
   */
  static extractDisplayData(data: EmployeeApiResponse) {
    return {
      name: data.name || "",
      surname: data.surname || "",
      patronymic: data.patronymic || "",
      birthDate: data.birthDate || "",
      gender: data.gender || "",
      pin: data.pin || "",
      employees: data.employees || [],
      relativesWhoAreEmployees: data.relativesWhoAreEmployees || [],
    };
  }

  /**
   * Maps form data to API create request format
   * Single Responsibility: Only responsible for data transformation to API format
   * @param originalContactsFromPin - Original contacts from PIN search (to detect deleted items)
   * @param originalDocumentsFromPin - Original documents from PIN search (to detect deleted items)
   * @param pinChecked - Whether PIN search was performed
   */
  static mapFormDataToCreateRequest(
    formData: EmployeeFormData,
    contacts: Contact[],
    originalContactsFromPin: Array<{ id?: string; type?: string; value?: string; isMain?: boolean }>,
    documents: EmployeeDocument[],
    originalDocumentsFromPin: Array<{ id?: string; type?: string; series?: string; number?: string; issuedAt?: string; expireAt?: string }>,
    pinChecked: boolean
  ): CreateEmployeeRequest {
    // Helper function to convert empty string to null
    const emptyToNull = (value: string | undefined | null): string | null => {
      return value && value.trim() !== "" ? value.trim() : null;
    };

    // Convert gender from Option to API format (Male/Female)
    let genderString: string | null = null;
    if (formData.gender?.id === "male" || formData.gender?.id === "Male") {
      genderString = "Male";
    } else if (formData.gender?.id === "female" || formData.gender?.id === "Female") {
      genderString = "Female";
    }

    // Convert date to string format using shared utility
    const birthDateString = formatDateToYMD(formData.birthDate);

    // Create a Set of original contact IDs from PIN search
    // const originalContactIds = new Set(
    //   originalContactsFromPin.map(c => c.id).filter((id): id is string => !!id)
    // );
    
    // Create a Set of current contact original IDs
    const currentContactOriginalIds = new Set(
      contacts
        .map(c => c.originalApiId)
        .filter((id): id is string => !!id)
    );

    // Map contacts to API format
    const apiContacts: CreateEmployeeContact[] = contacts.map((contact) => {
      const isFromPinSearch = !!contact.originalApiId;
      const rawVal = contact.value ?? "";
      const value = isMobileContactType(contact.type)
        ? (normalizeMobileValue(rawVal) ?? emptyToNull(rawVal))
        : emptyToNull(rawVal);
      const contactObj: CreateEmployeeContact = {
        id: contact.originalApiId || null, // Include original ID if exists
        type: emptyToNull(contact.type?.id?.toString()),
        value,
        isMain: contact.isPrimary || false,
        isCreate: !isFromPinSearch, // New contact = true, from PIN search = false
        isDeleted: false, // Current contacts are not deleted
      };
      return contactObj;
    });

    // Add deleted contacts (were in PIN search but removed from list)
    originalContactsFromPin.forEach((originalContact) => {
      if (originalContact.id && !currentContactOriginalIds.has(originalContact.id)) {
        const rawVal = originalContact.value ?? "";
        const value = isMobileContactTypeId(originalContact.type)
          ? (normalizeMobileValue(rawVal) ?? emptyToNull(rawVal))
          : emptyToNull(rawVal);
        apiContacts.push({
          id: originalContact.id || null,
          type: emptyToNull(originalContact.type),
          value,
          isMain: originalContact.isMain || false,
          isCreate: false,
          isDeleted: true,
        });
      }
    });

    // Create a Set of current document original IDs
    const currentDocumentOriginalIds = new Set(
      documents
        .map(d => d.originalApiId)
        .filter((id): id is string => !!id)
    );

    // Map documents to API format
    const apiDocuments: CreateEmployeeDocument[] = documents.map((doc) => {
      const issuedAt = formatDateToYMD(doc.issueDate);
      const expireAt = formatDateToYMD(doc.expiryDate);

      const isFromPinSearch = !!doc.originalApiId;
      const seriesVal = doc.series === "-" ? "" : (doc.series ?? "");
      const docObj: CreateEmployeeDocument = {
        id: doc.originalApiId || null, // Include original ID if exists
        type: emptyToNull(doc.type?.id?.toString()),
        series: emptyToNull(seriesVal),
        number: emptyToNull(doc.number),
        issuedAt: issuedAt,
        expireAt: expireAt,
        issuer: null, // Not in form, can be null
        isCreate: !isFromPinSearch, // New document = true, from PIN search = false
        isDeleted: false, // Current documents are not deleted
      };
      return docObj;
    });

    // Add deleted documents (were in PIN search but removed from list)
    originalDocumentsFromPin.forEach((originalDoc) => {
      if (originalDoc.id && !currentDocumentOriginalIds.has(originalDoc.id)) {
        // This document was deleted - use original data
        const origSeriesVal = originalDoc.series === "-" ? "" : (originalDoc.series ?? "");
        apiDocuments.push({
          id: originalDoc.id || null,
          type: emptyToNull(originalDoc.type),
          series: emptyToNull(origSeriesVal),
          number: emptyToNull(originalDoc.number),
          issuedAt: emptyToNull(originalDoc.issuedAt),
          expireAt: emptyToNull(originalDoc.expireAt),
          issuer: null,
          isCreate: false,
          isDeleted: true,
        });
      }
    });

    const request: CreateEmployeeRequest = {
      pinChecked: pinChecked,
      name: emptyToNull(formData.firstName),
      surname: emptyToNull(formData.lastName),
      patronymic: emptyToNull(formData.fatherName),
      gender: genderString,
      birthDate: birthDateString,
      pin: emptyToNull(formData.fin),
    };

    // Add optional fields only if they have values
    if (formData.company?.id) {
      request.rootCompanyId = formData.company.id.toString();
    } else {
      request.rootCompanyId = null;
    }

    // Add contacts if any
    if (apiContacts.length > 0) {
      request.contacts = apiContacts;
    }

    // Add documents if any
    if (apiDocuments.length > 0) {
      request.documents = apiDocuments;
    }

    return request;
  }
}

