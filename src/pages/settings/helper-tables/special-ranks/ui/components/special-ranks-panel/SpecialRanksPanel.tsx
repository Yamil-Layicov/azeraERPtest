import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { FormInput, Button } from "@/shared/ui";
import { ContentLoading } from "@/shared/ui/loading";
import { EnumLookupSelect, useEnumItemsByCode } from "@/features/lookups";
import type { Option } from "@/shared/types";
import styles from "./SpecialRanksPanel.module.css";
import type { SpecialRank } from "@/features/settings/special-ranks";

interface SpecialRanksPanelProps {
  mode: "edit" | "detail" | null;
  specialRankDetail: SpecialRank | null;
  isLoadingSpecialRankDetail?: boolean;
  onClose: () => void;
  onSave?: (data: Partial<SpecialRank> & { id: number }) => void;
  onSetActive?: (id: number, isActive: boolean) => void;
  isLoading?: boolean;
  isSettingActive?: boolean;
  title?: string;
  isModal?: boolean;
}

export const SpecialRanksPanel = ({
  mode,
  specialRankDetail,
  isLoadingSpecialRankDetail = false,
  onClose,
  onSave,
  onSetActive,
  isLoading = false,
  isSettingActive = false,
  title,
  isModal = false,
}: SpecialRanksPanelProps) => {
  const [name, setName] = useState("");
  const [legalBasisOption, setLegalBasisOption] = useState<Option | null>(null);
  const [sortOrder, setSortOrder] = useState<number>(0);

  const { options: organOptions } = useEnumItemsByCode("Organs", !!specialRankDetail);

  useEffect(() => {
    if (specialRankDetail) {
      setName(specialRankDetail.name || "");
      setSortOrder(specialRankDetail.sortOrder ?? 0);
      
      if (organOptions.length > 0) {
        const matched = organOptions.find(opt => String(opt.id) === String(specialRankDetail.organCode));
        setLegalBasisOption(matched || null);
      } else if (specialRankDetail.organCode) {
        setLegalBasisOption({ 
          id: specialRankDetail.organCode, 
          fullName: specialRankDetail.organCode, 
          role: "" 
        });
      }
    } else {
      setName("");
      setLegalBasisOption(null);
      setSortOrder(0);
    }
  }, [specialRankDetail, organOptions]);

  const handleSave = () => {
    if (!name.trim() || isLoading || !specialRankDetail) return;

    if ((mode === "edit" || mode === "detail") && onSave) {
      onSave({
        id: specialRankDetail.id,
        name: name.trim(),
        organCode: legalBasisOption ? String(legalBasisOption.id) : "",
        sortOrder,
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
        {isLoadingSpecialRankDetail ? (
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
              <label className={styles.label}>Orqan</label>
              <EnumLookupSelect
                id="organCode"
                code="Organs"
                value={legalBasisOption}
                onChange={(option) => setLegalBasisOption(option)}
                defaultText="Seçin"
                disabled={isLoading}
                isClearable={true}
              />
            </div>
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
        {specialRankDetail && onSetActive && (
          <div className={styles.activeButtonWrap}>
            <Button
              type="button"
              variant="secondary"
              onClick={() => onSetActive(specialRankDetail.id, !specialRankDetail.isActive)}
              disabled={isSettingActive}
              className={styles.activeToggleBtn}
            >
              {isSettingActive ? "Yüklənir..." : specialRankDetail.isActive ? "Deaktiv et" : "Aktiv et"}
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
