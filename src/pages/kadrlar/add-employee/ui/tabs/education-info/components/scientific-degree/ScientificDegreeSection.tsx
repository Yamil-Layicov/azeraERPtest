import React from "react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import {  FormInput, IconButton, ModernDatePicker } from "@/shared/ui";
import { EnumLookupSelect } from "@/features/lookups";
import { PermissionGuard } from "@/features/auth/components";
import { PERMISSIONS } from "@/shared/consts/permissions";
import type { Option } from "@/shared/types";
import styles from "./ScientificDegreeSection.module.css";

export type ScientificDegreeItem = {
  id: number;
  degree: Option | null;
  awardedDate: Date | null;
  diplomaSerialNumber: string;
};

export type NewScientificDegreeState = Omit<ScientificDegreeItem, "id">;

export interface ScientificDegreeSectionProps {
  degreeOptions: Option[];
  newDegree: NewScientificDegreeState;
  addedDegrees: ScientificDegreeItem[];
  onNewDegreeChange: (field: keyof NewScientificDegreeState, value: Option | null | Date | null | string) => void;
  onAddDegree: () => void;
  onRemoveDegree: (id: number) => void;
  onListDegreeChange: (id: number, field: keyof NewScientificDegreeState, value: Option | null | Date | null | string) => void;
  disableListedDegrees?: boolean;
  title?: string;
}

export const ScientificDegreeSection: React.FC<ScientificDegreeSectionProps> = ({
  // degreeOptions,
  newDegree,
  addedDegrees,
  onNewDegreeChange,
  onAddDegree,
  onRemoveDegree,
  onListDegreeChange,
  disableListedDegrees = false,
  title = "Elmi dərəcə",
}) => {
  const isAddDisabled = !newDegree.degree || !newDegree.diplomaSerialNumber.trim();

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <h3 className={styles.sectionTitle}>{title}</h3>
        <div className={styles.titleDivider} />
      </div>

      <div className={styles.row}>
        <div className={styles.selectCol}>
          <EnumLookupSelect
            id="new-degree"
            code="AcademicDegrees"
            value={newDegree.degree}
            onChange={(val) => onNewDegreeChange("degree", val)}
            defaultText="Elmi dərəcəni seçin"
            isClearable={true}
          />
        </div>

        <div className={styles.dateCol}>
          <ModernDatePicker
            id="new-degree-date"
            value={newDegree.awardedDate}
            onChange={(date) => onNewDegreeChange("awardedDate", date)}
            placeholder="Verildiyi tarix"
          />
        </div>

        <div className={styles.inputCol}>
          <FormInput
            label=""
            id="new-degree-diploma"
            type="text"
            placeholder="Diplom seriya və nömrəsi"
            value={newDegree.diplomaSerialNumber}
            onChange={(val) => onNewDegreeChange("diplomaSerialNumber", val)}
          />
        </div>

        <div className={styles.actions}>
          <PermissionGuard permission={PERMISSIONS.EMPLOYEE.CREATE}>
            <IconButton
              icon={PlusIcon}
              onClick={onAddDegree}
              disabled={isAddDisabled}
              title="Əlavə et"
              variant="primary"
            />
          </PermissionGuard>
        </div>
      </div>

      {addedDegrees.map((item) => (
        <div key={item.id} className={styles.row}>
          <div className={styles.selectCol}>
            <EnumLookupSelect
              id={`degree-${item.id}`}
              code="AcademicDegrees"
              value={item.degree}
              onChange={(val) => onListDegreeChange(item.id, "degree", val)}
              defaultText="Elmi dərəcəni seçin"
              isClearable={true}
              disabled={disableListedDegrees}
            />
          </div>

          <div className={styles.dateCol}>
            <ModernDatePicker
              id={`degree-date-${item.id}`}
              value={item.awardedDate}
              onChange={(date) => onListDegreeChange(item.id, "awardedDate", date)}
              disabled={disableListedDegrees}
            />
          </div>

          <div className={`${styles.inputCol} ${styles.listInputCol}`}>
            <FormInput
              label=""
              id={`degree-diploma-${item.id}`}
              type="text"
              placeholder=""
              value={item.diplomaSerialNumber}
              onChange={(val) => onListDegreeChange(item.id, "diplomaSerialNumber", val)}
              disabled={disableListedDegrees}
            />
          </div>

          <div className={styles.actions}>
            <PermissionGuard permission={PERMISSIONS.EMPLOYEE.DELETE}>
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => onRemoveDegree(item.id)}
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

