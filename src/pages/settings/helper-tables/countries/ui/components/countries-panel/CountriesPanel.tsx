import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { FormInput, Button } from "@/shared/ui";
import { ContentLoading } from "@/shared/ui/loading";
import styles from "./CountriesPanel.module.css";
import type { CountryEntry } from "@/features/settings/countries";

interface CountriesPanelProps {
  mode: "edit" | "detail" | null;
  countryDetail: CountryEntry | null;
  isLoadingCountryDetail?: boolean;
  onClose: () => void;
  onSave?: (data: { id: number; name: string; code: string; sortOrder: number; nativeName: string; phoneCode: string; currencyCode: string }) => void;
  onSetActive?: (id: number, isActive: boolean) => void;
  isLoading?: boolean;
  isSettingActive?: boolean;
  title?: string;
  isModal?: boolean;
}

export const CountriesPanel = ({
  mode,
  countryDetail,
  isLoadingCountryDetail = false,
  onClose,
  onSave,
  onSetActive,
  isLoading = false,
  isSettingActive = false,
  title,
  isModal = false,
}: CountriesPanelProps) => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [sortOrder, setSortOrder] = useState<number>(0);
  const [nativeName, setNativeName] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [currencyCode, setCurrencyCode] = useState("");

  useEffect(() => {
    if (countryDetail) {
      setName(countryDetail.name || "");
      setCode(countryDetail.code || "");
      setSortOrder(countryDetail.sortOrder ?? 0);
      setNativeName(countryDetail.nativeName || "");
      setPhoneCode(countryDetail.phoneCode || "");
      setCurrencyCode(countryDetail.currencyCode || "");
    } else {
      setName("");
      setCode("");
      setSortOrder(0);
      setNativeName("");
      setPhoneCode("");
      setCurrencyCode("");
    }
  }, [countryDetail]);

  const isSystem = Boolean(countryDetail?.isSystem);

  const handleSave = () => {
    if (!name.trim() || isLoading || isSystem || !countryDetail) return;

    if ((mode === "edit" || mode === "detail") && onSave) {
      onSave({
        id: countryDetail.id,
        name: name.trim(),
        code: code.trim(),
        sortOrder,
        nativeName: nativeName.trim(),
        phoneCode: phoneCode.trim(),
        currencyCode: currencyCode.trim(),
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
        {isLoadingCountryDetail ? (
          <ContentLoading />
        ) : (
          <div className={styles.formWrapper}>
            <FormInput
              label="Ölkə adı"
              type="text"
              id="name"
              placeholder="Məs: Azərbaycan"
              value={name}
              onChange={(val) => setName(val)}
            />
            <FormInput
              label="Kod"
              type="text"
              id="code"
              placeholder="Məs: AZE"
              value={code}
              onChange={(val) => setCode(val)}
            />
            <FormInput
              label="Sıra nömrəsi"
              type="number"
              id="sortOrder"
              placeholder="Məs: 1"
              value={String(sortOrder)}
              onChange={(val) => setSortOrder(Number(val) || 0)}
            />
            <FormInput
              label="Yerli ad"
              type="text"
              id="nativeName"
              placeholder="Məs: Azərbaycan"
              value={nativeName}
              onChange={(val) => setNativeName(val)}
            />
            <FormInput
              label="Telefon kodu"
              type="text"
              id="phoneCode"
              placeholder="Məs: +994"
              value={phoneCode}
              onChange={(val) => setPhoneCode(val)}
            />
            <FormInput
              label="Valyuta"
              type="text"
              id="currencyCode"
              placeholder="Məs: AZN"
              value={currencyCode}
              onChange={(val) => setCurrencyCode(val)}
            />
          </div>
        )}
      </div>

      <div className={styles.panelFooter}>
        {countryDetail && onSetActive && (
          <div className={styles.activeButtonWrap}>
            <Button
              type="button"
              variant="secondary"
              onClick={() => onSetActive(countryDetail.id, !(countryDetail.isActive ?? false))}
              disabled={isSettingActive}
              className={styles.activeToggleBtn}
            >
              {isSettingActive ? "Yüklənir..." : (countryDetail.isActive ?? false) ? "Deaktiv et" : "Aktiv et"}
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
            disabled={isLoading || !name.trim() || isSystem}
            title={isSystem ? "Sistem ölkəsi redaktə oluna bilməz" : undefined}
          >
            {isLoading ? "Yüklənir..." : "Yadda saxla"}
          </Button>
        </div>
      </div>
    </div>
  );
};
