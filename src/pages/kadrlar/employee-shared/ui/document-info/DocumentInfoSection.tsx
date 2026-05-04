import React from "react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { FormInput, IconButton, ModernDatePicker } from "@/shared/ui";
import { EnumLookupSelect } from "@/features/lookups";
import { PermissionGuard } from "@/features/auth/components";
import { PERMISSIONS } from "@/shared/consts/permissions";
import type { Option } from "@/shared/types";
import type { EmployeeDocument, NewDocumentState } from "../../model/types";
import styles from "./DocumentInfoSection.module.css";

export interface DocumentInfoSectionProps {
  newDocument: NewDocumentState;
  newDocumentResetKey?: number;
  addedDocuments: EmployeeDocument[];
  onNewDocumentChange: (field: keyof NewDocumentState, value: Option | null | string | Date | null) => void;
  onAddDocument: () => void;
  onRemoveDocument: (id: number) => void;
  onListDocumentChange: (
    id: number,
    field: keyof EmployeeDocument,
    value: Option | null | string | Date | null | undefined
  ) => void;
  title?: string;
  disableListedDocuments?: boolean;
}

export const DocumentInfoSection: React.FC<DocumentInfoSectionProps> = ({
  newDocument,
  newDocumentResetKey = 0,
  addedDocuments,
  onNewDocumentChange,
  onAddDocument,
  onRemoveDocument,
  onListDocumentChange,
  title = "Sənəd məlumatları",
  disableListedDocuments = true,
}) => {
  const isAddDocumentDisabled =
    !newDocument.type || !newDocument.expiryDate;

  return (
    <div className={styles.contactsSection}>
      <div className={styles.header}>
        <h3 className={styles.sectionTitle}>{title}</h3>
        <div className={styles.titleDivider} />
      </div>
      {/* ADD NEW DOCUMENT */}
      <div className={styles.contactRow}>
        <div className={styles.docTypeWrapper}>
          <EnumLookupSelect
            code="DocumentTypes"
            value={newDocument.type}
            onChange={(val) => onNewDocumentChange("type", val)}
            defaultText="Sənəd növü"
            variant="form"
            isSearchable
            loadOnValue={!disableListedDocuments}
            searchPlaceholder="Axtar..."
          />
        </div>
        <div className={styles.docSeriesWrapper}>
          <FormInput
            label=""
            id="new-doc-series"
            type="text"
            placeholder="Seriya"
            value={newDocument.series}
            onChange={(val) => onNewDocumentChange("series", val)}
          />
        </div>
        <div className={styles.docNumberWrapper}>
          <FormInput
            label=""
            id="new-doc-number"
            type="text"
            placeholder="Nömrə"
            value={newDocument.number}
            onChange={(val) => onNewDocumentChange("number", val)}
          />
        </div>
        <div className={styles.docDateWrapper}>
          <ModernDatePicker
            key={`new-doc-issue-${newDocumentResetKey}`}
            value={newDocument.issueDate}
            onChange={(date) => onNewDocumentChange("issueDate", date)}
            placeholder="Verilmə tarixi"
          />
        </div>
        <div className={styles.docDateWrapper}>
          <ModernDatePicker
            key={`new-doc-expiry-${newDocumentResetKey}`}
            value={newDocument.expiryDate}
            onChange={(date) => onNewDocumentChange("expiryDate", date)}
            placeholder="Bitmə tarixi"
          />
        </div>

        <div className={styles.contactActions}>
          <PermissionGuard permission={PERMISSIONS.EMPLOYEE.CREATE}>
            <IconButton
              icon={PlusIcon}
              onClick={onAddDocument}
              disabled={isAddDocumentDisabled}
              title="Əlavə et"
              variant="primary"
            />
          </PermissionGuard>
        </div>
      </div>
      {/* LIST DOCUMENTS */}
      {addedDocuments.map((doc) => (
        <div key={doc.id} className={styles.contactRow}>
          <div className={styles.docTypeWrapper}>
            <EnumLookupSelect
              code="DocumentTypes"
              value={doc.type}
              onChange={(val) => onListDocumentChange(doc.id, "type", val)}
              defaultText="Sənəd növü"
              variant="form"
              disabled={disableListedDocuments}
              isSearchable
              loadOnValue={!disableListedDocuments}
              searchPlaceholder="Axtar..."
            />
          </div>
          <div className={styles.docSeriesWrapper}>
            <FormInput
              label=""
              id={`doc-series-${doc.id}`}
              type="text"
              placeholder="Seriya"
              value={doc.series}
              onChange={(val) => onListDocumentChange(doc.id, "series", val)}
              disabled={disableListedDocuments}
            />
          </div>
          <div className={styles.docNumberWrapper}>
            <FormInput
              label=""
              id={`doc-number-${doc.id}`}
              type="text"
              placeholder="Nömrə"
              value={doc.number}
              onChange={(val) => onListDocumentChange(doc.id, "number", val)}
              disabled={disableListedDocuments}
            />
          </div>
          <div className={styles.docDateWrapper}>
            <ModernDatePicker
              value={doc.issueDate}
              onChange={(date) => onListDocumentChange(doc.id, "issueDate", date)}
              placeholder="-"
              disabled={disableListedDocuments}
            />
          </div>
          <div className={styles.docDateWrapper}>
            <ModernDatePicker
              value={doc.expiryDate}
              onChange={(date) => onListDocumentChange(doc.id, "expiryDate", date)}
              placeholder="-"
              disabled={disableListedDocuments}
            />
          </div>
          <div className={styles.contactActions}>
            <PermissionGuard permission={PERMISSIONS.EMPLOYEE.DELETE}>
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => onRemoveDocument(doc.id)}
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

