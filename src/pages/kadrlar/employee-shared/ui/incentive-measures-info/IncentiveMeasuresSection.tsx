import React from "react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { FormInput, ModernDatePicker, IconButton } from "@/shared/ui";
import { EnumLookupSelect, SpecialRanksLookupSelect, StateAwardsLookupSelect } from "@/features/lookups";
import { PermissionGuard } from "@/features/auth/components/PermissionGuard";
// import type { Option } from "@/shared/types";
import type { IncentiveItem, NewIncentiveState } from "../../model/types";
import styles from "./IncentiveMeasuresSection.module.css";

export interface IncentiveMeasuresSectionProps {
  title?: string;
  showOrgansField?: boolean;
  organsFieldLabel?: string;
  showReasonAndOrderFields?: boolean;
  showReasonField?: boolean;
  firstFieldLabel?: string;
  firstFieldType?: "rewardType" | "specialRank";
  showSecondSelect?: boolean;
  secondSelectLabel?: string;
  dateFieldLabel?: string;
  orderNumberFieldLabel?: string;
  lookupCode?: string;
  /** Bump to remount Verilmə tarixi picker (clears stuck UI after add). */
  newIncentiveVerilmeResetKey?: number;
  newIncentive: NewIncentiveState;
  addedIncentives: IncentiveItem[];
  onNewIncentiveChange: <K extends keyof NewIncentiveState>(
    field: K,
    value: NewIncentiveState[K]
  ) => void;
  onAddIncentive: () => void;
  onRemoveIncentive: (id: string | number) => void;
  onListIncentiveChange: <K extends keyof IncentiveItem>(
    id: string | number,
    field: K,
    value: IncentiveItem[K]
  ) => void;
  disableListedIncentives?: boolean;
  canManageRow?: (item: IncentiveItem) => boolean;
  createPermission?: string;
  deletePermission?: string;
}

export const IncentiveMeasuresSection: React.FC<IncentiveMeasuresSectionProps> = ({
  title = "Həvəsləndirmə tədbirləri barədə məlumat",
  showOrgansField = false,
  organsFieldLabel = "Orqanlar",
  showReasonAndOrderFields = true,
  showReasonField = true,
  firstFieldLabel = "Adı",
  firstFieldType = "rewardType",
  showSecondSelect = false,
  secondSelectLabel = "Növü",
  dateFieldLabel = "Verilmə tarixi",
  orderNumberFieldLabel = "Əmr nömrəsi",
  lookupCode = "RewardTypes",
  newIncentiveVerilmeResetKey = 0,
  newIncentive,
  addedIncentives,
  onNewIncentiveChange,
  onAddIncentive,
  onRemoveIncentive,
  onListIncentiveChange,
  disableListedIncentives = true,  canManageRow,  createPermission,
  deletePermission,
}) => {
  const hasNewOrganSelected = !!newIncentive.organ?.id;
  const isAddDisabled =
    (showOrgansField && !hasNewOrganSelected) ||
    !newIncentive.adi ||
    (showSecondSelect && !newIncentive.nov) ||
    !newIncentive.verilmeTarixi ||
    (showReasonAndOrderFields && showReasonField && !newIncentive.sebebi.trim()) ||
    (showReasonAndOrderFields && !newIncentive.emrNomresi.trim());

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <h3 className={styles.sectionTitle}>{title}</h3>
        <div className={styles.titleDivider} />
      </div>

      <div className={styles.row}>
        {showOrgansField && (
          <div className={styles.field}>
            <label className={styles.label} htmlFor="new-incentive-organ">
              {organsFieldLabel}
            </label>
            <EnumLookupSelect
              id="new-incentive-organ"
              code="Organs"
              defaultText="Seçin..."
              value={newIncentive.organ ?? null}
              onChange={(opt) => {
                onNewIncentiveChange("organ", opt);
                // Organ dəyişəndə əvvəlki xüsusi rütbə seçimini sıfırla.
                onNewIncentiveChange("adi", null);
              }}
            />
          </div>
        )}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="new-incentive-adi">
            {firstFieldLabel}
          </label>
          {firstFieldType === "specialRank" ? (
            <SpecialRanksLookupSelect
              id="new-incentive-adi"
              value={newIncentive.adi}
              onChange={(opt) => onNewIncentiveChange("adi", opt)}
              organCode={newIncentive.organ ? String(newIncentive.organ.id) : undefined}
              onlyFetchWithOrganCode={showOrgansField}
              disabled={showOrgansField && !hasNewOrganSelected}
            />
          ) : (
            <EnumLookupSelect
              id="new-incentive-adi"
              code={lookupCode}
              defaultText="Seçin..."
              value={newIncentive.adi}
              onChange={(opt) => {
                onNewIncentiveChange("adi", opt);
                if (showSecondSelect) onNewIncentiveChange("nov", null);
              }}
            />
          )}
        </div>
        {showSecondSelect && (
          <div className={styles.field}>
            <label className={styles.label} htmlFor="new-incentive-nov">
              {secondSelectLabel}
            </label>
            <StateAwardsLookupSelect
              id="new-incentive-nov"
              typeCode={newIncentive.adi ? String(newIncentive.adi.id) : undefined}
              value={newIncentive.nov ?? null}
              onChange={(opt) => onNewIncentiveChange("nov", opt)}
              disabled={!newIncentive.adi}
            />
          </div>
        )}
        {showReasonAndOrderFields && (
          <div className={styles.field}>
            <FormInput
              label={orderNumberFieldLabel}
              id="new-incentive-emr-nomresi"
              type="text"
              placeholder="Daxil edin"
              value={newIncentive.emrNomresi}
              onChange={(val) => onNewIncentiveChange("emrNomresi", val)}
            />
          </div>
        )}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="new-incentive-verilme-tarixi">
            {dateFieldLabel}
          </label>
          <ModernDatePicker
            key={`new-incentive-verilme-${newIncentiveVerilmeResetKey}`}
            id="new-incentive-verilme-tarixi"
            value={newIncentive.verilmeTarixi}
            onChange={(val) => onNewIncentiveChange("verilmeTarixi", val)}
            placeholder="dd.mm.yyyy"
          />
        </div>
        {showReasonAndOrderFields && showReasonField && (
          <div className={styles.field}>
            <FormInput
              label="Səbəbi"
              id="new-incentive-sebebi"
              type="text"
              placeholder="Daxil edin"
              value={newIncentive.sebebi}
              onChange={(val) => onNewIncentiveChange("sebebi", val)}
            />
          </div>
        )}
        <div className={styles.actions}>
          {createPermission ? (
            <PermissionGuard permission={createPermission}>
              <IconButton
                icon={PlusIcon}
                onClick={onAddIncentive}
                disabled={isAddDisabled}
                title="Əlavə et"
                variant="primary"
              />
            </PermissionGuard>
          ) : (
            <IconButton
              icon={PlusIcon}
              onClick={onAddIncentive}
              disabled={isAddDisabled}
              title="Əlavə et"
              variant="primary"
            />
          )}
        </div>
      </div>

      {addedIncentives.map((item) => (
        <div key={item.id} className={styles.row}>
          {showOrgansField && (
            <div className={styles.field}>
              <label className={styles.label} htmlFor={`incentive-organ-${item.id}`}>
                {organsFieldLabel}
              </label>
              <EnumLookupSelect
                id={`incentive-organ-${item.id}`}
                code="Organs"
                defaultText="Seçin..."
                value={item.organ ?? null}
                onChange={(opt) => {
                  onListIncentiveChange(item.id, "organ", opt);
                  onListIncentiveChange(item.id, "adi", null);
                }}
                disabled={disableListedIncentives}
              />
            </div>
          )}
          <div className={styles.field}>
            <label className={styles.label} htmlFor={`incentive-adi-${item.id}`}>
              {firstFieldLabel}
            </label>
            <FormInput
              id={`incentive-adi-${item.id}`}
              type="text"
              label=""
              value={item.adi?.fullName || ""}
              onChange={() => undefined}
              disabled={true}
              placeholder="-"
            />
          </div>
          {showSecondSelect && (
            <div className={styles.field}>
              <label className={styles.label} htmlFor={`incentive-nov-${item.id}`}>
                {secondSelectLabel}
              </label>
              <FormInput
                id={`incentive-nov-${item.id}`}
                type="text"
                label=""
                value={item.nov?.fullName || ""}
                onChange={() => undefined}
                disabled={true}
                placeholder="-"
              />
            </div>
          )}
          {showReasonAndOrderFields && (
            <div className={styles.field}>
              <FormInput
                label={orderNumberFieldLabel}
                id={`incentive-emr-${item.id}`}
                type="text"
                placeholder=""
                value={item.emrNomresi}
                onChange={(val) => onListIncentiveChange(item.id, "emrNomresi", val)}
                disabled={disableListedIncentives}
              />
            </div>
          )}
          <div className={styles.field}>
            <label className={styles.label} htmlFor={`incentive-verilme-${item.id}`}>
              {dateFieldLabel}
            </label>
            <ModernDatePicker
              id={`incentive-verilme-${item.id}`}
              value={item.verilmeTarixi}
              onChange={(val) => onListIncentiveChange(item.id, "verilmeTarixi", val)}
              placeholder="dd.mm.yyyy"
              disabled={disableListedIncentives}
            />
          </div>
          {showReasonAndOrderFields && showReasonField && (
            <div className={styles.field}>
              <FormInput
                label="Səbəbi"
                id={`incentive-sebebi-${item.id}`}
                type="text"
                placeholder=""
                value={item.sebebi}
                onChange={(val) => onListIncentiveChange(item.id, "sebebi", val)}
                disabled={disableListedIncentives}
              />
            </div>
          )}
          <div className={styles.actions}>
            {(canManageRow?.(item) ?? true) && (
              <>
                {deletePermission ? (
                  <PermissionGuard permission={deletePermission}>
                    <button
                      type="button"
                      className={styles.removeBtn}
                      onClick={() => onRemoveIncentive(item.id)}
                      title="Sil"
                    >
                      <TrashIcon className={styles.icon} />
                    </button>
                  </PermissionGuard>
                ) : (
                  <button
                    type="button"
                    className={styles.removeBtn}
                    onClick={() => onRemoveIncentive(item.id)}
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
