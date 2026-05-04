import { useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import type { NewContactState, Contact } from "../../employee-shared/model/types";
import {
  isEmailContactType,
  isMobileContactType,
  emailContactValueSchema,
  mobileContactValueSchema,
  normalizeMobileValue,
} from "../../employee-shared/model/contacts-documents-schema";

export const useEmployeeContacts = () => {
  const [newContact, setNewContact] = useState<NewContactState>({
    type: null,
    value: "",
    isPrimary: false,
  });
  const [addedContacts, setAddedContacts] = useState<Contact[]>([]);

  const handleNewContactChange = useCallback((field: "type" | "value", data: any) => {
    setNewContact((prev) => ({ ...prev, [field]: data }));
  }, []);

  const handleNewContactPrimaryChange = useCallback((checked: boolean) => {
    setNewContact((prev) => ({ ...prev, isPrimary: checked }));
  }, []);

  const handleAddContact = useCallback(() => {
    if (!newContact.type || !newContact.value.trim()) return;

    if (isEmailContactType(newContact.type)) {
      const r = emailContactValueSchema.safeParse(newContact.value.trim());
      if (!r.success) {
        toast.error(r.error.issues[0]?.message ?? "Düzgün E-poçt formatı daxil edin");
        return;
      }
    } else if (isMobileContactType(newContact.type)) {
      const r = mobileContactValueSchema.safeParse(newContact.value.trim());
      if (!r.success) {
        toast.error(r.error.issues[0]?.message ?? "Mobil nömrə 9 rəqəm olmalıdır");
        return;
      }
    }

    let currentContacts = [...addedContacts];
    if (newContact.isPrimary) {
      currentContacts = currentContacts.map((c) => {
        if (c.type?.id === newContact.type?.id) {
          return { ...c, isPrimary: false };
        }
        return c;
      });
    }
    const valueToStore = isMobileContactType(newContact.type)
      ? (normalizeMobileValue(newContact.value) ?? newContact.value)
      : newContact.value;
    setAddedContacts([{ ...newContact, value: valueToStore, id: Date.now() }, ...currentContacts]);
    setNewContact({ type: null, value: "", isPrimary: false });
  }, [newContact, addedContacts]);

  const handleRemoveContact = useCallback((id: number) => {
    setAddedContacts((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const handleListContactChange = useCallback((id: number, field: "type" | "value", data: any) => {
    setAddedContacts((prev) =>
      prev.map((contact) =>
        contact.id === id ? { ...contact, [field]: data } : contact
      )
    );
  }, []);

  const handleListContactPrimaryToggle = useCallback((id: number, isChecked: boolean, typeId?: string | number) => {
    if (!typeId) return;
    setAddedContacts((prev) =>
      prev.map((contact) => {
        if (contact.id === id) {
          return { ...contact, isPrimary: isChecked };
        }
        if (isChecked && contact.type?.id === typeId) {
          return { ...contact, isPrimary: false };
        }
        return contact;
      })
    );
  }, []);

  const resetContacts = useCallback(() => {
    setNewContact({ type: null, value: "", isPrimary: false });
    setAddedContacts([]);
  }, []);

  return {
    newContact,
    addedContacts,
    setAddedContacts,
    handleNewContactChange,
    handleNewContactPrimaryChange,
    handleAddContact,
    handleRemoveContact,
    handleListContactChange,
    handleListContactPrimaryToggle,
    resetContacts,
  };
};

