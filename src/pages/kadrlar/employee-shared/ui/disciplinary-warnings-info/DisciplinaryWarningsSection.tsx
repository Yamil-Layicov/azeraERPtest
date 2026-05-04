import React from "react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { FormInput, ModernDatePicker, IconButton } from "@/shared/ui";
import { EnumLookupSelect } from "@/features/lookups";
import { PermissionGuard } from "@/features/auth/components/PermissionGuard";
// import type { Option } from "@/shared/types";
import type { DisciplinaryWarningItem, NewDisciplinaryWarningState } from "../../model/types";
import styles from "./DisciplinaryWarningsSection.module.css";

export interface DisciplinaryWarningsSectionProps {
  title?: string;
  newItem: NewDisciplinaryWarningState;
  addedItems: DisciplinaryWarningItem[];
  onNewItemChange: <K extends keyof NewDisciplinaryWarningState>(
    field: K,
    value: NewDisciplinaryWarningState[K]
  ) => void;
  onAddItem: () => void;
  onRemoveItem: (id: string | number) => void;
  onListItemChange: <K extends keyof DisciplinaryWarningItem>(
    id: string | number,
    field: K,
    value: DisciplinaryWarningItem[K]
  ) => void;
  disableListedItems?: boolean;
  canManageRow?: (item: DisciplinaryWarningItem) => boolean;
  createPermission?: string;
  deletePermission?: string;
}

export const DisciplinaryWarningsSection: React.FC<DisciplinaryWarningsSectionProps> = ({
  title = "İntizam tənbehi tədbirləri və yazılı xəbərdarlıq barədə məlumat",
  newItem,
  addedItems,
  onNewItemChange,
  onAddItem,
  onRemoveItem,
  onListItemChange,
  disableListedItems = true,
  canManageRow,
  createPermission,
  deletePermission,
}) => {
  const isAddDisabled =
    !newItem.adi ||
    !newItem.verilmeTarixi ||
    !newItem.sebebi.trim() ||
    !newItem.emrNomresi.trim();

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <h3 className={styles.sectionTitle}>{title}</h3>
        <div className={styles.titleDivider} />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="new-disciplinary-adi">
            Adı
          </label>
          <EnumLookupSelect
            id="new-disciplinary-adi"
            code="DisciplinaryActionTypes"
            defaultText="Seçin..."
            value={newItem.adi}
            onChange={(opt) => onNewItemChange("adi", opt)}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="new-disciplinary-verilme-tarixi">
            Verilmə tarixi
          </label>
          <ModernDatePicker
            id="new-disciplinary-verilme-tarixi"
            value={newItem.verilmeTarixi}
            onChange={(val) => onNewItemChange("verilmeTarixi", val)}
            placeholder="dd.mm.yyyy"
          />
        </div>
        <div className={styles.field}>
          <FormInput
            label="Səbəbi"
            id="new-disciplinary-sebebi"
            type="text"
            placeholder="Daxil edin"
            value={newItem.sebebi}
            onChange={(val) => onNewItemChange("sebebi", val)}
          />
        </div>
        <div className={styles.field}>
          <FormInput
            label="Əmr nömrəsi"
            id="new-disciplinary-emr-nomresi"
            type="text"
            placeholder="Daxil edin"
            value={newItem.emrNomresi}
            onChange={(val) => onNewItemChange("emrNomresi", val)}
          />
        </div>
        <div className={styles.actions}>
          {createPermission ? (
            <PermissionGuard permission={createPermission}>
              <IconButton
                icon={PlusIcon}
                onClick={onAddItem}
                disabled={isAddDisabled}
                title="Əlavə et"
                variant="primary"
              />
            </PermissionGuard>
          ) : (
            <IconButton
              icon={PlusIcon}
              onClick={onAddItem}
              disabled={isAddDisabled}
              title="Əlavə et"
              variant="primary"
            />
          )}
        </div>
      </div>

      {addedItems.map((item) => (
        <div key={item.id} className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor={`disciplinary-adi-${item.id}`}>
              Adı
            </label>
            <EnumLookupSelect
              id={`disciplinary-adi-${item.id}`}
              code="DisciplinaryActionTypes"
              defaultText="Seçin..."
              value={item.adi}
              onChange={(opt) => onListItemChange(item.id, "adi", opt)}
              disabled={disableListedItems}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor={`disciplinary-verilme-${item.id}`}>
              Verilmə tarixi
            </label>
            <ModernDatePicker
              id={`disciplinary-verilme-${item.id}`}
              value={item.verilmeTarixi}
              onChange={(val) => onListItemChange(item.id, "verilmeTarixi", val)}
              placeholder="dd.mm.yyyy"
              disabled={disableListedItems}
            />
          </div>
          <div className={styles.field}>
            <FormInput
              label="Səbəbi"
              id={`disciplinary-sebebi-${item.id}`}
              type="text"
              placeholder=""
              value={item.sebebi}
              onChange={(val) => onListItemChange(item.id, "sebebi", val)}
              disabled={disableListedItems}
            />
          </div>
          <div className={styles.field}>
            <FormInput
              label="Əmr nömrəsi"
              id={`disciplinary-emr-${item.id}`}
              type="text"
              placeholder=""
              value={item.emrNomresi}
              onChange={(val) => onListItemChange(item.id, "emrNomresi", val)}
              disabled={disableListedItems}
            />
          </div>
          <div className={styles.actions}>
            {(canManageRow?.(item) ?? true) && (
              <>
                {deletePermission ? (
                  <PermissionGuard permission={deletePermission}>
                    <button
                      type="button"
                      className={styles.removeBtn}
                      onClick={() => onRemoveItem(item.id)}
                      title="Sil"
                    >
                      <TrashIcon className={styles.icon} />
                    </button>
                  </PermissionGuard>
                ) : (
                  <button
                    type="button"
                    className={styles.removeBtn}
                    onClick={() => onRemoveItem(item.id)}
                    title="Sil"
                  >
                    <TrashIcon className={styles.icon} />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
