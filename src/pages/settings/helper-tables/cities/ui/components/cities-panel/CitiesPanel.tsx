import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { FormInput, Button } from "@/shared/ui";
import { ContentLoading } from "@/shared/ui/loading";
import styles from "./CitiesPanel.module.css";
import type { City } from "../../../model/types";
import type { CityEntry } from "@/features/settings/countries/model/cityTypes";

interface CitiesPanelProps {
  mode: "detail" | null;
  selectedCity: City | null;
  cityDetail?: CityEntry | null;
  isLoadingCityDetail?: boolean;
  onClose: () => void;
  onSave?: (data: { id: number; name: string }) => void;
  onSetActive?: (id: number, isActive: boolean) => void;
  isLoading?: boolean;
  isSettingActive?: boolean;
  title?: string;
  isModal?: boolean;
}

export const CitiesPanel = ({
  mode,
  selectedCity,
  cityDetail,
  isLoadingCityDetail = false,
  onClose,
  onSave,
  onSetActive,
  isLoading = false,
  isSettingActive = false,
  title,
  isModal: _isModal = false,
}: CitiesPanelProps) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (mode === "detail" && cityDetail) {
      setName(cityDetail.name || "");
    } else if (selectedCity) {
      setName(selectedCity.name || "");
    } else {
      setName("");
    }
  }, [selectedCity, cityDetail, mode]);

  const isSystem = Boolean(cityDetail?.isSystem ?? selectedCity?.isSystem);

  const handleSave = () => {
    if (!name.trim() || isLoading || isSystem) return;

    if (mode === "detail" && cityDetail && onSave) {
      onSave({
        id: cityDetail.id,
        name: name.trim(),
      });
    } else if (selectedCity && onSave) {
      onSave({
        id: selectedCity.id,
        name: name.trim(),
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

      <div className={styles.panelContent}>
        {isLoadingCityDetail ? (
          <ContentLoading />
        ) : (
          <>
            <div className={styles.formSection}>
              <FormInput
                label="Adı"
                id="city-name"
                type="text"
                value={name}
                onChange={(val) => setName(val)}
                placeholder="Şəhər adı"
                required
                autoComplete="off"
              />
            </div>

            <div className={styles.panelFooter}>
              {onSetActive && (cityDetail ?? selectedCity) && (
                <div className={styles.activeButtonWrap}>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      const city = cityDetail ?? selectedCity!;
                      onSetActive(city.id, !(city.isActive ?? false));
                    }}
                    disabled={isSettingActive}
                    className={styles.activeToggleBtn}
                  >
                    {isSettingActive ? "Yüklənir..." : ((cityDetail ?? selectedCity)!.isActive ?? false) ? "Deaktiv et" : "Aktiv et"}
                  </Button>
                </div>
              )}
              <div className={styles.footerButtons}>
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleSave}
                  disabled={isLoading || !name.trim() || isSystem}
                  className={styles.saveButton}
                  title={isSystem ? "Sistem şəhəri redaktə oluna bilməz" : undefined}
                >
                  {isLoading ? "Yüklənir..." : "Yadda saxla"}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
