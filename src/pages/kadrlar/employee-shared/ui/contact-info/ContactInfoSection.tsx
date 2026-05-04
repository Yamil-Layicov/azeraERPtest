import React from "react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { FormInput, IconButton, Checkbox } from "@/shared/ui";
import { EnumLookupSelect } from "@/features/lookups";
import { PermissionGuard } from "@/features/auth/components";
import { PERMISSIONS } from "@/shared/consts/permissions";
import type { Option } from "@/shared/types";
import type { Contact, NewContactState } from "../../model/types";
import styles from "./ContactInfoSection.module.css";

export interface ContactInfoSectionProps {
  newContact: NewContactState;
  addedContacts: Contact[];
  onNewContactChange: (field: "type" | "value", data: Option | null | string) => void;
  onNewContactPrimaryChange: (checked: boolean) => void;
  onAddContact: () => void;
  onRemoveContact: (id: any) => void;
  onListContactChange: (id: any, field: "type" | "value", data: Option | null | string) => void;
  onListContactPrimaryToggle: (id: any, isChecked: boolean, typeId?: string | number) => void;
  title?: string;
  disableListedContacts?: boolean;
}

export const ContactInfoSection: React.FC<ContactInfoSectionProps> = ({
  newContact,
  addedContacts,
  onNewContactChange,
  onNewContactPrimaryChange,
  onAddContact,
  onRemoveContact,
  onListContactChange,
  onListContactPrimaryToggle,
  title = "Əlaqə məlumatları",
  disableListedContacts = true,
}) => {
  const isAddContactDisabled = !newContact.type || !newContact.value.trim();
  const isEmail = (id: string | number | undefined) => String(id ?? "").toLowerCase() === "email";

  return (
    <div className={styles.contactsSection}>
      <div className={styles.header}>
        <h3 className={styles.sectionTitle}>{title}</h3>
        <div className={styles.titleDivider} />
      </div>

      <div className={styles.contactRow}>
        <div className={styles.contactSelect}>
          <EnumLookupSelect
            id="new-contact-type"
            code="ContactTypes"
            value={newContact.type}
            onChange={(val) => onNewContactChange("type", val)}
            defaultText="Növ seçin"
            variant="form"
          />
        </div>

        <div className={styles.contactInput}>
          <FormInput
            label=""
            id="new-contact-value"
            type={isEmail(newContact.type?.id) ? "email" : "text"}
            placeholder="Məlumatı daxil edin"
            value={newContact.value}
            onChange={(val) => onNewContactChange("value", val)}
          />
        </div>

        <div className={styles.checkboxWrapper}>
          <Checkbox
            id="new-contact-primary"
            label="Korporativ"
            checked={newContact.isPrimary}
            onChange={onNewContactPrimaryChange}
          />
        </div>

        <div className={styles.contactActions}>
          <PermissionGuard permission={PERMISSIONS.EMPLOYEE.CREATE}>
            <IconButton
              icon={PlusIcon}
              onClick={onAddContact}
              disabled={isAddContactDisabled}
              title="Əlavə et"
              variant="primary"
            />
          </PermissionGuard>
        </div>
      </div>

      {addedContacts.map((contact) => (
        <div key={contact.id} className={styles.contactRow}>
          <div className={styles.contactSelect}>
            <EnumLookupSelect
              id={`contact-type-${contact.id}`}
              code="ContactTypes"
              value={contact.type}
              onChange={(val) => onListContactChange(contact.id, "type", val)}
              defaultText="Növ seçin"
              variant="form"
              disabled={disableListedContacts}
            />
          </div>

          <div className={styles.contactInput}>
            <FormInput
              label=""
              id={`contact-${contact.id}`}
              type={isEmail(contact.type?.id) ? "email" : "text"}
              placeholder=""
              value={contact.value}
              onChange={(val) => onListContactChange(contact.id, "value", val)}
              disabled={disableListedContacts}
            />
          </div>

          <div className={styles.checkboxWrapper}>
            <Checkbox
              id={`primary-${contact.id}`}
              label="Korporativ"
              checked={contact.isPrimary}
              onChange={(checked) =>
                onListContactPrimaryToggle(contact.id, checked, contact.type?.id)
              }
              disabled={disableListedContacts}
            />
          </div>

          <div className={styles.contactActions}>
            <PermissionGuard permission={PERMISSIONS.EMPLOYEE.DELETE}>
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => onRemoveContact(contact.id)}
                title="Sil"
              >
                <TrashIcon className={styles.icon} />
              </button>
            </PermissionGuard>
          </div>
        </div>
      ))}
    </div>
  );
};

