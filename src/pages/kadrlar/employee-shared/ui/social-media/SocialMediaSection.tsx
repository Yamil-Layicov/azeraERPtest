import React from "react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { FormInput, IconButton } from "@/shared/ui";
import { EnumLookupSelect } from "@/features/lookups";
import { PermissionGuard } from "@/features/auth/components";
import { PERMISSIONS } from "@/shared/consts/permissions";
import type { Option } from "@/shared/types";
import type { NewSocialMediaState, SocialMediaItem } from "../../model/types";
import styles from "./SocialMediaSection.module.css";
export interface SocialMediaSectionProps {
  newSocialMedia: NewSocialMediaState;
  addedSocialMedia: SocialMediaItem[];
  onNewSocialMediaChange: (field: "type" | "value", data: Option | null | string) => void;
  onAddSocialMedia: () => void;
  onRemoveSocialMedia: (id: any) => void;
  onListSocialMediaChange: (id: any, field: "type" | "value", data: Option | null | string) => void;
  title?: string;
  disableListedSocialMedia?: boolean;
}

export const SocialMediaSection: React.FC<SocialMediaSectionProps> = ({
  newSocialMedia,
  addedSocialMedia,
  onNewSocialMediaChange,
  onAddSocialMedia,
  onRemoveSocialMedia,
  onListSocialMediaChange,
  title = "Sosial hesablar",
  disableListedSocialMedia = true,
}) => {
  const isEmailLike = (id: string | number | undefined) =>
    ["email", "gmail"].includes(String(id ?? "").toLowerCase());

  const isAddDisabled = !newSocialMedia.type || !newSocialMedia.value.trim();

  return (
    <div className={styles.socialMediaSection}>
      <div className={styles.header}>
        <h3 className={styles.sectionTitle}>{title}</h3>
        <div className={styles.titleDivider} />
      </div>

      {/* Eyni dizayn, amma Əsas/aktiv checkbox yoxdur */}
      <div className={styles.row}>
        <div className={styles.typeSelect}>
          <EnumLookupSelect
            id="new-social-media-type"
            code="SocialPlatforms"
            value={newSocialMedia.type}
            onChange={(val) => onNewSocialMediaChange("type", val)}
            defaultText="Növ seçin"
            variant="form"
          />
        </div>

        <div className={styles.valueInput}>
          <FormInput
            label=""
            id="new-social-media-value"
            type={isEmailLike(newSocialMedia.type?.id) ? "email" : "text"}
            placeholder="Məlumatı daxil edin"
            value={newSocialMedia.value}
            onChange={(val) => onNewSocialMediaChange("value", val)}
          />
        </div>

        <div className={styles.actions}>
          <PermissionGuard permission={PERMISSIONS.EMPLOYEE.CREATE}>
            <IconButton
              icon={PlusIcon}
              onClick={onAddSocialMedia}
              disabled={isAddDisabled}
              title="Əlavə et"
              variant="primary"
            />
          </PermissionGuard>
        </div>
      </div>

      {addedSocialMedia.map((item) => (
        <div key={item.id} className={styles.row}>
          <div className={styles.typeSelect}>
            <EnumLookupSelect
              id={`social-media-type-${item.id}`}
              code="SocialPlatforms"
              value={item.type}
              onChange={(val) => onListSocialMediaChange(item.id, "type", val)}
              defaultText="Növ seçin"
              variant="form"
              disabled={disableListedSocialMedia}
            />
          </div>

          <div className={styles.valueInput}>
            <FormInput
              label=""
              id={`social-media-${item.id}`}
              type={isEmailLike(item.type?.id) ? "email" : "text"}
              placeholder=""
              value={item.value}
              onChange={(val) => onListSocialMediaChange(item.id, "value", val)}
              disabled={disableListedSocialMedia}
            />
          </div>

          <div className={styles.actions}>
            <PermissionGuard permission={PERMISSIONS.EMPLOYEE.DELETE}>
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => onRemoveSocialMedia(item.id)}
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

