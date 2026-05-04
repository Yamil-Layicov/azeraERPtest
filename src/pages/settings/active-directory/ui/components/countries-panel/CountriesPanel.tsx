import { useState, useEffect } from "react";
import {  CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { XMarkIcon as XMarkOutlineIcon } from "@heroicons/react/24/outline";
import { FormInput, Button } from "@/shared/ui";
import { ContentLoading } from "@/shared/ui/loading";
import styles from "./CountriesPanel.module.css";
import type { LdapDirectory } from "../../../model/types";
import { LdapCompaniesModal } from "../ldap-companies-modal/LdapCompaniesModal";
import type { Option } from "@/shared/types";

interface CountriesPanelProps {
  mode: "edit" | "detail" | null;
  countryDetail: LdapDirectory | null;
  isLoadingCountryDetail?: boolean;
  onClose: () => void;
  onSave?: (data: LdapDirectory) => void;
  onSetActive?: (id: string, isActive: boolean) => void;
  onUpdateCompanies?: (directoryId: string, companyIds: string[]) => void;
  onTestConnection?: any;
  isLoading?: boolean;
  isUpdatingCompanies?: boolean;
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
  onUpdateCompanies,
  onTestConnection,
  isLoading = false,
  isUpdatingCompanies = false,
  isSettingActive = false,
  title,
  isModal = false,
}: CountriesPanelProps) => {
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [host, setHost] = useState("");
  const [port, setPort] = useState<number>(0);
  const [useSsl, setUseSsl] = useState(false);
  const [useTls, setUseTls] = useState(false);
  const [baseDn, setBaseDn] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [timeout, setTimeout] = useState<number>(30);
  const [isActive, setIsActive] = useState(true);
  const [testResult, setTestResult] = useState<boolean | null>(null);
  const [isCompaniesModalOpen, setIsCompaniesModalOpen] = useState(false);

  useEffect(() => {
    if (countryDetail) {
      setName(countryDetail.name || "");
      setDomain(countryDetail.domain || "");
      setHost(countryDetail.host || "");
      setPort(countryDetail.port ?? 0);
      setUseSsl(countryDetail.useSsl ?? false);
      setUseTls(countryDetail.useTls ?? false);
      setBaseDn(countryDetail.baseDn || "");
      setUsername(countryDetail.username || "");
      setPassword(countryDetail.password || "");
      setSearchFilter(countryDetail.searchFilter || "");
      setTimeout(countryDetail.timeout ?? 30);
      setIsActive(countryDetail.isActive ?? true);
      setTestResult(null);
    } else {
      setName("");
      setDomain("");
      setHost("");
      setPort(0);
      setUseSsl(false);
      setUseTls(false);
      setBaseDn("");
      setUsername("");
      setPassword("");
      setSearchFilter("");
      setTimeout(30);
      setIsActive(true);
      setTestResult(null);
    }
  }, [countryDetail]);

  const handleSave = () => {
    if (!name.trim() || isLoading || !countryDetail) return;

    if ((mode === "edit" || mode === "detail") && onSave) {
      onSave({
        id: countryDetail.id,
        name: name.trim(),
        domain: domain.trim(),
        host: host.trim(),
        port,
        useSsl,
        useTls,
        baseDn: baseDn.trim(),
        username: username.trim(),
        password,
        searchFilter: searchFilter.trim(),
        timeout,
        isActive,
      });
    }
  };

  const handleTestConnection = () => {
    if (!countryDetail || !onTestConnection) return;
    setTestResult(null);
    onTestConnection.mutate(countryDetail.id, {
      onSuccess: (response: any) => {
        setTestResult(response.isSuccess);
      },
      onError: () => {
        setTestResult(false);
      }
    });
  };

  const handleSaveCompanies = (selectedOptions: Option[]) => {
    if (!countryDetail || !onUpdateCompanies) return;
    
    const companyIds = selectedOptions.map(opt => String(opt.id));
    
    onUpdateCompanies(countryDetail.id, companyIds);
    
    setIsCompaniesModalOpen(false);
  };

  return (
    <div className={styles.panelContainer}>
      {title && (
        <div className={styles.panelHeader}>
          <h3 className={styles.panelTitle}>{title}</h3>
          <button onClick={onClose} className={styles.closeBtn} title="Bağla">
            <XMarkOutlineIcon width={20} />
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
              id="name"
              placeholder="Məs: Active Directory"
              value={name}
              onChange={(val) => setName(val)}
            />
            <FormInput
              label="Domain"
              type="text"
              id="domain"
              placeholder="Məs: example.com"
              value={domain}
              onChange={(val) => setDomain(val)}
            />
            <FormInput
              label="Ünvan"
              type="text"
              id="host"
              placeholder="Məs: ldap.example.com"
              value={host}
              onChange={(val) => setHost(val)}
            />
            <FormInput
              label="Port"
              type="number"
              id="port"
              placeholder="389"
              value={String(port)}
              onChange={(val) => setPort(Number(val) || 0)}
            />
            
            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={useSsl}
                  onChange={(e) => { const checked = e.target.checked; setUseSsl(checked); if (checked) setUseTls(false); }}
                />
                <span>SSL istifadə et</span>
              </label>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={useTls}
                  onChange={(e) => { const checked = e.target.checked; setUseTls(checked); if (checked) setUseSsl(false); }}
                />
                <span>TLS istifadə et</span>
              </label>
            </div>

            <FormInput
              label="Base DN"
              type="text"
              id="baseDn"
              placeholder="Məs: DC=example,DC=com"
              value={baseDn}
              onChange={(val) => setBaseDn(val)}
            />
            <FormInput
              label="İstifadəçi adı"
              type="text"
              id="username"
              placeholder="Məs: admin@example.com"
              value={username}
              onChange={(val) => setUsername(val)}
            />
            <FormInput
              label="Şifrə"
              type="password"
              id="password"
              placeholder="Şifrəni daxil edin"
              value={password}
              onChange={(val) => setPassword(val)}
            />
            <FormInput
              label="LDAP Filter"
              type="text"
              id="searchFilter"
              placeholder="Məs: (objectClass=person)"
              value={searchFilter}
              onChange={(val) => setSearchFilter(val)}
            />
            <FormInput
              label="Gözləmə vaxtı (Timeout)"
              type="number"
              id="timeout"
              placeholder="30"
              value={String(timeout)}
              onChange={(val) => setTimeout(Number(val) || 0)}
            />
          </div>
        )}
      </div>

      <div className={styles.panelFooter}>
        <div className={styles.footerActions}>
          <div className={styles.testConnectionWrap}>
            <Button
              type="button"
              variant="secondary"
              onClick={handleTestConnection}
              disabled={onTestConnection?.isPending}
              className={styles.testBtn}
            >
              {onTestConnection?.isPending ? "Yoxlanılır..." : "Yoxla"}
            </Button>
            {testResult === true && (
              <CheckCircleIcon className={styles.successIcon} width={24} height={24} />
            )}
            {testResult === false && (
              <XCircleIcon className={styles.errorIcon} width={24} height={24} />
            )}
          </div>

          {countryDetail && (
            <div className={styles.activeButtonWrap}>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsCompaniesModalOpen(true)}
                className={styles.activeToggleBtn}
                style={{ marginRight: '8px' }}
              >
                Şirkət
              </Button>

              {onSetActive && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => onSetActive(countryDetail.id, !isActive)}
                  disabled={isSettingActive}
                  className={styles.activeToggleBtn}
                >
                  {isSettingActive ? "Yüklənir..." : isActive ? "Deaktiv et" : "Aktiv et"}
                </Button>
              )}
            </div>
          )}
        </div>
        
        {countryDetail && (
          <LdapCompaniesModal
            isOpen={isCompaniesModalOpen}
            onClose={() => setIsCompaniesModalOpen(false)}
            initialCompanies={
              (
                countryDetail.companies ??
                countryDetail.companyResponses ??
                []
              ).map((c: any) => ({
                id: c.companyId ?? c.id,
                fullName: c.companyName ?? c.name,
              }))
            }
            onSave={handleSaveCompanies}
            isLoading={isUpdatingCompanies}
          />
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


