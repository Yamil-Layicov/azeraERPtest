import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { FormInput, Button } from "@/shared/ui";
import { ContentLoading } from "@/shared/ui/loading";
import { EnumLookupSelect, useEnumItemsByCode } from "@/features/lookups";
import type { Option } from "@/shared/types";
import styles from "./StateAwardsPanel.module.css";
import type { StateAward } from "@/features/settings/state-awards";

interface StateAwardsPanelProps {
  mode: "edit" | "detail" | null;
  stateAwardDetail: StateAward | null;
  isLoadingStateAwardDetail?: boolean;
  onClose: () => void;
  onSave?: (data: Partial<StateAward> & { id: string }) => void;
  onSetActive?: (id: string, isActive: boolean) => void;
  isLoading?: boolean;
  isSettingActive?: boolean;
  title?: string;
  isModal?: boolean;
}

export const StateAwardsPanel = ({
  mode,
  stateAwardDetail,
  isLoadingStateAwardDetail = false,
  onClose,
  onSave,
  onSetActive,
  isLoading = false,
  isSettingActive = false,
  title,
  isModal = false,
}: StateAwardsPanelProps) => {
  const [name, setName] = useState("");
  const [legalBasisOption, setLegalBasisOption] = useState<Option | null>(null);
  const [sortOrder, setSortOrder] = useState<number>(0);

  const { options: stateAwardTypeOptions } = useEnumItemsByCode("StateAwardTypes", !!stateAwardDetail);

  useEffect(() => {
    if (stateAwardDetail) {
      setName(stateAwardDetail.name || "");
      setSortOrder(stateAwardDetail.sortOrder ?? 0);
      
      if (stateAwardTypeOptions.length > 0) {
        const matched = stateAwardTypeOptions.find(opt => String(opt.id) === String(stateAwardDetail.typeCode));
        setLegalBasisOption(matched || null);
      } else if (stateAwardDetail.typeCode) {
        setLegalBasisOption({ 
          id: stateAwardDetail.typeCode, 
          fullName: stateAwardDetail.typeCode, 
          role: "" 
        });
      }
    } else {
      setName("");
      setLegalBasisOption(null);
      setSortOrder(0);
    }
  }, [stateAwardDetail, stateAwardTypeOptions]);

  const handleSave = () => {
    if (!name.trim() || isLoading || !stateAwardDetail) return;

    if ((mode === "edit" || mode === "detail") && onSave) {
      onSave({
        id: stateAwardDetail.id,
        name: name.trim(),
        typeCode: legalBasisOption ? String(legalBasisOption.id) : "",
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
        {isLoadingStateAwardDetail ? (
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
              <label className={styles.label}>Mükafat növü</label>
              <EnumLookupSelect
                id="stateAwardTypeCode"
                code="StateAwardTypes"
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
        {stateAwardDetail && onSetActive && (
          <div className={styles.activeButtonWrap}>
            <Button
              type="button"
              variant="secondary"
              onClick={() => onSetActive(stateAwardDetail.id, !stateAwardDetail.isActive)}
              disabled={isSettingActive}
              className={styles.activeToggleBtn}
            >
              {isSettingActive ? "Yüklənir..." : stateAwardDetail.isActive ? "Deaktiv et" : "Aktiv et"}
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
