import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { FormInput, Button } from "@/shared/ui";
import styles from "./EnumTypeDetailPanel.module.css";
import type { EnumTypeEntry } from "@/features/settings/enum-types";

interface EnumTypeDetailPanelProps {
  enumTypeDetail: EnumTypeEntry | null;
  onClose: () => void;
  onSave?: (data: { id: number; displayName: string; description: string }) => void;
  isLoading?: boolean;
  title?: string;
  isModal?: boolean;
}

export const EnumTypeDetailPanel = ({
  enumTypeDetail,
  onClose,
  onSave,
  isLoading = false,
  title,
  isModal = false,
}: EnumTypeDetailPanelProps) => {
  const [displayName, setDisplayName] = useState("");
  const [description, setDescription] = useState("");

  const isReadOnly = enumTypeDetail?.isSystem ?? false;

  useEffect(() => {
    if (enumTypeDetail) {
      setDisplayName(enumTypeDetail.displayName || "");
      setDescription(enumTypeDetail.description ?? "");
    } else {
      setDisplayName("");
      setDescription("");
    }
  }, [enumTypeDetail]);

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
            placeholder="Kod"
            value={enumTypeDetail?.code ?? ""}
            onChange={() => {}}
            disabled
          />
          <FormInput
            label="Adı"
            type="text"
            id="displayName"
            placeholder="Məs: Əlaqə növləri"
            value={displayName}
            onChange={(val) => setDisplayName(val)}
            disabled={isReadOnly}
          />
          <FormInput
            label="Təsvir"
            type="text"
            id="description"
            placeholder="Təsvir"
            value={description}
            onChange={(val) => setDescription(val)}
            disabled={isReadOnly}
          />
        </div>
      </div>

      <div className={styles.panelFooter}>
        {enumTypeDetail && onSave && (
          <div className={styles.footerButtons}>
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className={styles.footerBtn}
              disabled={isLoading}
            >
              Ləğv et
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={() =>
                onSave({
                  id: enumTypeDetail.id,
                  displayName: displayName,
                  description: description ?? "",
                })
              }
              disabled={isLoading || !displayName.trim() || isReadOnly}
              className={styles.footerBtn}
            >
              {isLoading ? "Yüklənir..." : "Yadda saxla"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
