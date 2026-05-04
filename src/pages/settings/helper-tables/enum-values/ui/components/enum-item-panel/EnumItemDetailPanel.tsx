import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { FormInput, Button } from "@/shared/ui";
import styles from "./EnumItemDetailPanel.module.css";
import type { EnumItemEntry } from "@/features/settings/enum-types";

interface EnumItemDetailPanelProps {
  enumItemDetail: EnumItemEntry | null;
  onClose: () => void;
  onSave?: (data: { id: number; displayName: string; sortOrder: number }) => void;
  onSetActive?: (id: number, isActive: boolean) => void;
  isLoading?: boolean;
  isSettingActive?: boolean;
  title?: string;
  isModal?: boolean;
}

export const EnumItemDetailPanel = ({
  enumItemDetail,
  onClose,
  onSave,
  onSetActive,
  isLoading = false,
  isSettingActive = false,
  title,
  isModal = false,
}: EnumItemDetailPanelProps) => {
  const [code, setCode] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [sortOrder, setSortOrder] = useState<number>(0);

  useEffect(() => {
    if (enumItemDetail) {
      setCode(enumItemDetail.code || "");
      setDisplayName(enumItemDetail.displayName || "");
      setSortOrder(enumItemDetail.sortOrder ?? 0);
    } else {
      setCode("");
      setDisplayName("");
      setSortOrder(0);
    }
  }, [enumItemDetail]);

  const isSystem = Boolean(enumItemDetail?.isSystem);

  const handleSave = () => {
    if (!enumItemDetail || isLoading || isSystem) return;
    if (onSave) {
      onSave({
        id: enumItemDetail.id,
        displayName: displayName.trim(),
        sortOrder: sortOrder,
      });
    }
  };

  return (
    <div className={styles.panelContainer}>
      {title && (
        <div className={styles.panelHeader}>
          <h3 className={styles.panelTitle}>{title}</h3>
          <button onClick={onClose} className={styles.closeBtn} title="Bağla">
            <XMarkIcon width={20} />
          </button>
        </div>
      )}

      <div className={`${styles.panelBody} ${isModal ? styles.noPadding : ""}`}>
        <div className={styles.formWrapper}>
          <FormInput
            label="Kod"
            type="text"
            id="code"
            placeholder="Məs: CorporateEmail"
            value={code}
            onChange={() => {}}
            disabled
          />
          <FormInput
            label="Adı"
            type="text"
            id="displayName"
            placeholder="Məs: Korporativ e-poçt"
            value={displayName}
            onChange={(val) => setDisplayName(val)}
            disabled={isSystem}
          />
          <FormInput
            label="Sıra"
            type="number"
            id="sortOrder"
            placeholder="0"
            value={String(sortOrder)}
            onChange={(val) => {
              const num = parseInt(val, 10);
              if (!isNaN(num)) {
                setSortOrder(num);
              }
            }}
            disabled={isSystem}
          />
        </div>
      </div>

      <div className={styles.panelFooter}>
        {enumItemDetail && onSetActive && (
          <div className={styles.activeButtonWrap}>
            <Button
              type="button"
              variant="secondary"
              onClick={() => onSetActive(enumItemDetail.id, !(enumItemDetail.isActive ?? false))}
              disabled={isSettingActive}
              className={styles.activeToggleBtn}
            >
              {isSettingActive ? "Yüklənir..." : (enumItemDetail.isActive ?? false) ? "Deaktiv et" : "Aktiv et"}
            </Button>
          </div>
        )}
        <div className={styles.footerButtons}>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className={styles.footerBtn}
          >
            Ləğv et
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            className={styles.footerBtn}
            type="button"
            disabled={isLoading || !displayName.trim() || isSystem}
            title={isSystem ? "Sistem dəyəri redaktə oluna bilməz" : undefined}
          >
            {isLoading ? "Yüklənir..." : "Yadda saxla"}
          </Button>
        </div>
      </div>
    </div>
  );
};
