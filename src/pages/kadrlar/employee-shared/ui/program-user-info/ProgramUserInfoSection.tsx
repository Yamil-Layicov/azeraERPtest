import React from "react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { FormInput, IconButton } from "@/shared/ui";
import { EnumLookupSelect } from "@/features/lookups";
import { PermissionGuard } from "@/features/auth/components";
import { PERMISSIONS } from "@/shared/consts/permissions";
import type { Option } from "@/shared/types";
import type { NewProgramUserState, ProgramUserItem } from "../../model/types";
import styles from "./ProgramUserInfoSection.module.css";

export interface ProgramUserInfoSectionProps {
  newProgramUser: NewProgramUserState;
  addedProgramUsers: ProgramUserItem[];
  onNewProgramUserChange: (field: "type" | "value", data: Option | null | string) => void;
  onAddProgramUser: () => void;
  onRemoveProgramUser: (id: any) => void;
  onListProgramUserChange: (id: any, field: "type" | "value", data: Option | null | string) => void;
  title?: string;
  enumCode?: string;
  disableListedProgramUsers?: boolean;
}

export const ProgramUserInfoSection: React.FC<ProgramUserInfoSectionProps> = ({
  newProgramUser,
  addedProgramUsers,
  onNewProgramUserChange,
  onAddProgramUser,
  onRemoveProgramUser,
  onListProgramUserChange,
  title = "Proqram istifadəçi məlumatları",
  enumCode = "OtherProgram",
  disableListedProgramUsers = true,
}) => {
  const isAddDisabled = !newProgramUser.type || !newProgramUser.value.trim();

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <h3 className={styles.sectionTitle}>{title}</h3>
        <div className={styles.titleDivider} />
      </div>

      <div className={styles.row}>
        <div className={styles.typeSelect}>
          <EnumLookupSelect
            id="new-program-user-type"
            code={enumCode}
            value={newProgramUser.type}
            onChange={(val) => onNewProgramUserChange("type", val)}
            defaultText="Növ seçin"
            variant="form"
          />
        </div>

        <div className={styles.valueInput}>
          <FormInput
            label=""
            id="new-program-user-value"
            type="text"
            placeholder="Məlumatı daxil edin"
            value={newProgramUser.value}
            onChange={(val) => onNewProgramUserChange("value", val)}
          />
        </div>

        <div className={styles.actions}>
          <PermissionGuard permission={PERMISSIONS.EMPLOYEE.CREATE}>
            <IconButton
              icon={PlusIcon}
              onClick={onAddProgramUser}
              disabled={isAddDisabled}
              title="Əlavə et"
              variant="primary"
            />
          </PermissionGuard>
        </div>
      </div>

      {addedProgramUsers.map((item) => (
        <div key={item.id} className={styles.row}>
          <div className={styles.typeSelect}>
            <EnumLookupSelect
              id={`program-user-type-${item.id}`}
              code={enumCode}
              value={item.type}
              onChange={(val) => onListProgramUserChange(item.id, "type", val)}
              defaultText="Növ seçin"
              variant="form"
              disabled={disableListedProgramUsers}
            />
          </div>

          <div className={styles.valueInput}>
            <FormInput
              label=""
              id={`program-user-${item.id}`}
              type="text"
              placeholder=""
              value={item.value}
              onChange={(val) => onListProgramUserChange(item.id, "value", val)}
              disabled={disableListedProgramUsers}
            />
          </div>

          <div className={styles.actions}>
            <PermissionGuard permission={PERMISSIONS.EMPLOYEE.DELETE}>
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => onRemoveProgramUser(item.id)}
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
