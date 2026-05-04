import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { FormInput, Button } from "@/shared/ui";
import { ContentLoading } from "@/shared/ui/loading";
import { EnumLookupSelect, useEnumItemsByCode } from "@/features/lookups";
import type { Option } from "@/shared/types";
import styles from "./PrivilegesPanel.module.css";
import type { Privilege } from "@/features/settings/privileges";

interface PrivilegesPanelProps {
  mode: "edit" | "detail" | null;
  privilegeDetail: Privilege | null;
  isLoadingPrivilegeDetail?: boolean;
  onClose: () => void;
  onSave?: (data: Partial<Privilege> & { id: number }) => void;
  onSetActive?: (id: number, isActive: boolean) => void;
  isLoading?: boolean;
  isSettingActive?: boolean;
  title?: string;
  isModal?: boolean;
}

export const PrivilegesPanel = ({
  mode,
  privilegeDetail,
  isLoadingPrivilegeDetail = false,
  onClose,
  onSave,
  onSetActive,
  isLoading = false,
  isSettingActive = false,
  title,
  isModal = false,
}: PrivilegesPanelProps) => {
  const [name, setName] = useState("");
  const [legalBasisOption, setLegalBasisOption] = useState<Option | null>(null);
  const [sortOrder, setSortOrder] = useState<number>(0);
  const [extraVacation, setExtraVacation] = useState<number>(0);

  const { options: legalBasisOptions } = useEnumItemsByCode(
    "LegalBasis",
    !!privilegeDetail,
  );

  useEffect(() => {
    if (privilegeDetail) {
      setName(privilegeDetail.name || "");
      setSortOrder(privilegeDetail.sortOrder ?? 0);
      setExtraVacation(privilegeDetail.extraVacation ?? 0);

      // İlk yükleme veya satır değiştiğinde eşleştirme yap
      if (legalBasisOptions.length > 0) {
        const matched = legalBasisOptions.find(
          (opt) => String(opt.id) === String(privilegeDetail.legalBasisCode),
        );
        setLegalBasisOption(matched || null);
      } else if (privilegeDetail.legalBasisCode) {
        // Seçenekler gelene kadar ID'yi göster
        setLegalBasisOption({
          id: privilegeDetail.legalBasisCode,
          fullName: privilegeDetail.legalBasisCode,
          role: "",
        });
      }
    } else {
      setName("");
      setLegalBasisOption(null);
      setSortOrder(0);
      setExtraVacation(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [privilegeDetail, legalBasisOptions]);

  const handleSave = () => {
    if (!name.trim() || isLoading || !privilegeDetail) return;

    if ((mode === "edit" || mode === "detail") && onSave) {
      onSave({
        id: privilegeDetail.id,
        name: name.trim(),
        legalBasisCode: legalBasisOption ? String(legalBasisOption.id) : "",
        sortOrder,
        extraVacation,
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
        {isLoadingPrivilegeDetail ? (
          <ContentLoading />
        ) : (
          <div className={styles.formWrapper}>
            <FormInput
              label="Ad"
              type="text"
              id="name"
              placeholder="Daxil edin"
              value={name}
              onChange={(val) => setName(val)}
            />
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Hüquqi Əsas</label>
              <EnumLookupSelect
                id="legalBasisCode"
                code="LegalBasis"
                value={legalBasisOption}
                onChange={(option) => setLegalBasisOption(option)}
                defaultText="Seçin"
                disabled={isLoading}
                isClearable={true}
              />
            </div>

            <FormInput
              label="Əlavə məzuniyyət"
              type="number"
              id="extraVacation"
              placeholder="0"
              value={String(extraVacation)}
              onChange={(val) => setExtraVacation(Number(val) || 0)}
            />
            <FormInput
              label="Sıra №"
              type="number"
              id="sortOrder"
              placeholder="0"
              value={String(sortOrder)}
              onChange={(val) => setSortOrder(Number(val) || 0)}
            />
          </div>
        )}
      </div>

      <div className={styles.panelFooter}>
        {privilegeDetail && onSetActive && (
          <div className={styles.activeButtonWrap}>
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                onSetActive(privilegeDetail.id, !privilegeDetail.isActive)
              }
              disabled={isSettingActive}
              className={styles.activeToggleBtn}
            >
              {isSettingActive
                ? "Yüklənir..."
                : privilegeDetail.isActive
                  ? "Deaktiv et"
                  : "Aktiv et"}
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
            disabled={isLoading || !name.trim()}
          >
            {isLoading ? "Yüklənir..." : "Yadda saxla"}
          </Button>
        </div>
      </div>
    </div>
  );
};
