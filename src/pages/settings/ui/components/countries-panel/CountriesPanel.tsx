import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { FormInput, Button } from "@/shared/ui";
import { ContentLoading } from "@/shared/ui/loading";
import styles from "./CountriesPanel.module.css";

interface LdapDirectoryPanelProps {
  mode: "edit" | "detail" | null;
  countryDetail: any; // Using any for now to match current usage, but it represents LdapDirectory
  isLoadingCountryDetail?: boolean;
  onClose: () => void;
  onSave?: (data: any) => void;
  onSetActive?: (id: string, isActive: boolean) => void;
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
  isLoading = false,
  title,
  isModal = false,
}: LdapDirectoryPanelProps) => {
  const [formData, setFormData] = useState({
    name: "",
    domain: "",
    host: "",
    port: "",
    useSsl: false,
    useTls: false,
    baseDn: "",
    username: "",
    password: "",
    searchFilter: "",
    timeout: "",
    isActive: true,
  });

  useEffect(() => {
    if (countryDetail) {
      setFormData({
        name: countryDetail.name || "",
        domain: countryDetail.domain || "",
        host: countryDetail.host || "",
        port: String(countryDetail.port || ""),
        useSsl: countryDetail.useSsl ?? false,
        useTls: countryDetail.useTls ?? false,
        baseDn: countryDetail.baseDn || "",
        username: countryDetail.username || "",
        password: countryDetail.password || "",
        searchFilter: countryDetail.searchFilter || "",
        timeout: String(countryDetail.timeout || ""),
        isActive: countryDetail.isActive ?? true,
      });
    }
  }, [countryDetail]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!formData.name.trim() || isLoading || !countryDetail) return;

    if ((mode === "edit" || mode === "detail") && onSave) {
      onSave({
        ...formData,
        id: countryDetail.id,
        port: parseInt(formData.port, 10) || 0,
        timeout: parseInt(formData.timeout, 10) || 0,
      });
    }
  };

  const isDetail = mode === "detail";

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
              label="Ad"
              type="text"
              id="ldap-name"
              placeholder="Məs: Active Directory"
              value={formData.name}
              onChange={(val) => handleInputChange("name", val)}
              disabled={isDetail || isLoading}
            />
            <FormInput
              label="Domain"
              type="text"
              id="ldap-domain"
              placeholder="Məs: example.com"
              value={formData.domain}
              onChange={(val) => handleInputChange("domain", val)}
              disabled={isDetail || isLoading}
            />
            <FormInput
              label="Host"
              type="text"
              id="ldap-host"
              placeholder="Məs: ldap.example.com"
              value={formData.host}
              onChange={(val) => handleInputChange("host", val)}
              disabled={isDetail || isLoading}
            />
            <FormInput
              label="Port"
              type="number"
              id="ldap-port"
              placeholder="Məs: 389"
              value={formData.port}
              onChange={(val) => handleInputChange("port", val)}
              disabled={isDetail || isLoading}
            />
            <FormInput
              label="Base DN"
              type="text"
              id="ldap-baseDn"
              placeholder="Məs: DC=example,DC=com"
              value={formData.baseDn}
              onChange={(val) => handleInputChange("baseDn", val)}
              disabled={isDetail || isLoading}
            />
            <FormInput
              label="İstifadəçi adı"
              type="text"
              id="ldap-username"
              placeholder="Məs: admin@example.com"
              value={formData.username}
              onChange={(val) => handleInputChange("username", val)}
              disabled={isDetail || isLoading}
            />
            <FormInput
              label="Şifrə"
              type="password"
              id="ldap-password"
              placeholder="Şifrəni daxil edin"
              value={formData.password}
              onChange={(val) => handleInputChange("password", val)}
              disabled={isDetail || isLoading}
            />
            <FormInput
              label="LDAP Filter"
              type="text"
              id="ldap-searchFilter"
              placeholder="Məs: (objectClass=person)"
              value={formData.searchFilter}
              onChange={(val) => handleInputChange("searchFilter", val)}
              disabled={isDetail || isLoading}
            />
            <FormInput
              label="Timeout (san.)"
              type="number"
              id="ldap-timeout"
              placeholder="Məs: 30"
              value={formData.timeout}
              onChange={(val) => handleInputChange("timeout", val)}
              disabled={isDetail || isLoading}
            />
            
            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.useSsl}
                  onChange={(e) => handleInputChange("useSsl", e.target.checked)}
                  disabled={isDetail || isLoading}
                />
                <span>SSL istifadə et</span>
              </label>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.useTls}
                  onChange={(e) => handleInputChange("useTls", e.target.checked)}
                  disabled={isDetail || isLoading}
                />
                <span>TLS istifadə et</span>
              </label>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => handleInputChange("isActive", e.target.checked)}
                  disabled={isDetail || isLoading}
                />
                <span>Aktiv</span>
              </label>
            </div>
          </div>
        )}
      </div>

      <div className={styles.panelFooter}>
        <div className={styles.footerButtons}>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className={styles.footerBtn}
          >
            Bağla
          </Button>
          {!isDetail && (
            <Button
              variant="primary"
              onClick={handleSave}
              className={styles.footerBtn}
              type="button"
              disabled={isLoading || !formData.name.trim()}
            >
              {isLoading ? "Yüklənir..." : "Yadda saxla"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
