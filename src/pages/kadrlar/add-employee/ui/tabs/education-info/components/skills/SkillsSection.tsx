import React from "react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { IconButton, SegmentedToggle } from "@/shared/ui";
import { EnumLookupSelect } from "@/features/lookups";
import { useEnumItemsByCode } from "@/features/lookups/hooks";
import { PermissionGuard } from "@/features/auth/components";
import { PERMISSIONS } from "@/shared/consts/permissions";
import type { Option } from "@/shared/types";
import styles from "./SkillsSection.module.css";

export type SkillLevel = string; // Artıq dinamik ID-lər gələcək

export type SkillItem = {
  id: string | number;
  skill: Option | null;
  level: string;
};

export type NewSkillState = {
  skill: Option | null;
  level: string | "";
};

export interface SkillsSectionProps {
  languageOptions: Option[];
  technicalOptions: Option[];

  newLanguage: NewSkillState;
  addedLanguages: SkillItem[];
  onNewLanguageChange: (field: keyof NewSkillState, value: Option | null | string | "") => void;
  onAddLanguage: () => void;
  onRemoveLanguage: (id: string | number) => void;
  onListLanguageChange: (
    id: string | number,
    field: keyof NewSkillState,
    value: Option | null | string | ""
  ) => void;

  newTechnical: NewSkillState;
  addedTechnical: SkillItem[];
  onNewTechnicalChange: (field: keyof NewSkillState, value: Option | null | string | "") => void;
  onAddTechnical: () => void;
  onRemoveTechnical: (id: string | number) => void;
  onListTechnicalChange: (
    id: string | number,
    field: keyof NewSkillState,
    value: Option | null | string | ""
  ) => void;

  disableListedLanguages?: boolean;
  disableListedTechnical?: boolean;
}

const SkillsBox: React.FC<{
  title: string;
  idPrefix: string;
  code: string;
  newItem: NewSkillState;
  items: SkillItem[];
  levelOptions: { value: string; label: string | undefined }[];
  onNewChange: SkillsSectionProps["onNewLanguageChange"];
  onAdd: () => void;
  onRemove: (id: string | number) => void;
  onListChange: SkillsSectionProps["onListLanguageChange"];
  disableListed?: boolean;
}> = ({
  title,
  idPrefix,
  code,
  newItem,
  items,
  levelOptions,
  onNewChange,
  onAdd,
  onRemove,
  onListChange,
  disableListed = true,
}) => {
  const isAddDisabled = !newItem.skill || !newItem.level;

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <h3 className={styles.sectionTitle}>{title}</h3>
        <div className={styles.titleDivider} />
      </div>

      <div className={styles.row}>
        <div className={styles.selectCol}>
          <EnumLookupSelect
            id={`new-${idPrefix}-skill`}
            code={code}
            value={newItem.skill}
            onChange={(val) => onNewChange("skill", val)}
            defaultText="Seçin"
            isClearable={true}
          />
        </div>

        <div className={styles.levelCol}>
          {newItem.skill ? (
            <SegmentedToggle
              id={`new-${idPrefix}-level`}
              name={`new-${idPrefix}-level`}
              value={String(newItem.level ?? "")}
              onChange={(val) => onNewChange("level", val)}
              options={levelOptions as { value: string; label: string }[]}
            />
          ) : (
            <div className={styles.levelPlaceholder}>Səviyyə seçmək üçün əvvəlcə seçim edin</div>
          )}
        </div>

        <div className={styles.actions}>
          <PermissionGuard permission={PERMISSIONS.EMPLOYEE.CREATE}>
            <IconButton
              icon={PlusIcon}
              onClick={onAdd}
              disabled={isAddDisabled}
              title="Əlavə et"
              variant="primary"
            />
          </PermissionGuard>
        </div>
      </div>

      {items.map((item) => (
        <div key={item.id} className={`${styles.row} ${disableListed ? styles.listedRow : ""}`}>
          <div className={styles.selectCol}>
            <EnumLookupSelect
              id={`${idPrefix}-skill-${item.id}`}
              code={code}
              value={item.skill}
              onChange={(val) => onListChange(item.id, "skill", val)}
              defaultText="Seçin"
              isClearable={true}
              disabled={disableListed}
            />
          </div>

          <div className={styles.levelCol}>
            <SegmentedToggle
              id={`${idPrefix}-level-${item.id}`}
              name={`${idPrefix}-level-${item.id}`}
              value={item.level}
              onChange={(val) => onListChange(item.id, "level", val)}
              options={levelOptions as { value: string; label: string }[]}
              disabled={disableListed}
              display={disableListed ? "selectedOnly" : "segments"}
            />
          </div>

          <div className={styles.actions}>
            <PermissionGuard permission={PERMISSIONS.EMPLOYEE.DELETE}>
              <button
                type="button"
                className={styles.removeBtn}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onRemove(item.id);
                }}
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

export const SkillsSection: React.FC<SkillsSectionProps> = ({
  // languageOptions,
  // technicalOptions,
  newLanguage,
  addedLanguages,
  onNewLanguageChange,
  onAddLanguage,
  onRemoveLanguage,
  onListLanguageChange,
  newTechnical,
  addedTechnical,
  onNewTechnicalChange,
  onAddTechnical,
  onRemoveTechnical,
  onListTechnicalChange,
  disableListedLanguages = true,
  disableListedTechnical = true,
}) => {
  const { options: proficiencyOptions, refetch } = useEnumItemsByCode("ProficiencyLevels", true);

  React.useEffect(() => {
    refetch();
  }, [refetch]);

  const levelOptions = proficiencyOptions.map((opt) => ({
    value: String(opt.id),
    label: opt.fullName,
  }));

  return (
    <div className={styles.skillsRow}>
      <div className={styles.halfColumn}>
        <SkillsBox
          title="Dil bilikləri"
          idPrefix="language"
          code="LanguageSkills"
          newItem={newLanguage}
          items={addedLanguages}
          levelOptions={levelOptions}
          onNewChange={onNewLanguageChange}
          onAdd={onAddLanguage}
          onRemove={onRemoveLanguage}
          onListChange={onListLanguageChange}
          disableListed={disableListedLanguages}
        />
      </div>

      <div className={styles.halfColumn}>
        <SkillsBox
          title="Texniki biliklər"
          idPrefix="technical"
          code="ProgramSkills"
          newItem={newTechnical}
          items={addedTechnical}
          levelOptions={levelOptions}
          onNewChange={onNewTechnicalChange}
          onAdd={onAddTechnical}
          onRemove={onRemoveTechnical}
          onListChange={onListTechnicalChange}
          disableListed={disableListedTechnical}
        />
      </div>
    </div>
  );
};

