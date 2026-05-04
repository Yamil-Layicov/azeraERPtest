import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import styles from "./SecurityTab.module.css";
import { Button } from "@/shared/ui";
import type { SecurityTabProps } from "./types";
import {
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon
} from "@heroicons/react/24/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useCreateEmployeeContext } from "../../../create-employee/contexts/CreateEmployeeContext";
import { usersService } from "@/features/security/users";
import type { AxiosError } from "axios";
import { getBackendErrorMessage } from "@/shared/api/httpClient";

type CheckStatus = 'idle' | 'checking' | 'available' | 'taken';

const SecurityTab: React.FC<SecurityTabProps & { onCancel?: () => void }> = ({
  onLdapSearch,
  onCancel,
  onSave,
}) => {
  const {
    formData,
    handleInputChange: onInputChange,
    isLdapSelected,
    setIsLdapSelected,
    usernameFromPinSearch,
    employmentId,
    originalUsername,
  } = useCreateEmployeeContext();
  const [checkStatus, setCheckStatus] = useState<CheckStatus>('idle');
  const [isSaving, setIsSaving] = useState(false);
  const [isUsernameSaved, setIsUsernameSaved] = useState(false);

  const isUsernameFromPinSearch = !!(usernameFromPinSearch && formData.username && formData.username === usernameFromPinSearch);
  
  const hasOriginalUsername = !!(originalUsername && formData.username && formData.username === originalUsername);
  const hasUsername = isUsernameSaved || isUsernameFromPinSearch || hasOriginalUsername;
  

  const isUsernameModified = originalUsername 
    ? (formData.username?.trim() && formData.username !== originalUsername)
    : !!formData.username?.trim();
  
  const isUsernameValidated = checkStatus === 'available';
  const isLdapUsernameValidated = isLdapSelected && !!formData.username?.trim();

  useEffect(() => {
    if (isLdapSelected && formData.username?.trim()) {
      setCheckStatus('available');
      setIsUsernameSaved(false);
    }
  }, [isLdapSelected, formData.username]);

  const handleSecuritySave = async () => {
    if (!formData.username || !formData.username.trim()) {
      toast.error("İstifadəçi adı daxil edilməlidir");
      return;
    }

    if (onSave) {
      setIsSaving(true);
      try {
        await onSave();
        setIsUsernameSaved(true);
      } catch (error: any) {
         toast.error(
                getBackendErrorMessage(error as   AxiosError) ||
                  "Şifrə yenilənərkən xəta baş verdi",
              );  
        const errorMessage = error?.response?.data?.errorMessage || error?.message || "Xəta baş verdi";
        toast.error(errorMessage);
      } finally {
        setIsSaving(false);
      }
      return;
    }

    if (!employmentId) {
      toast.error("İşçi yaradılmamışdır");
      return;
    }

    setIsSaving(true);
    try {
      const ldapChecked = isLdapSelected || false;
      const response = await usersService.createUser(
        employmentId,
        formData.username.trim(),
        ldapChecked
      );

      const isSuccess = (response as any)?.isSuccess !== false;
      
      if (isSuccess) {
        toast.success("İstifadəçi uğurla yaradıldı");
        setIsUsernameSaved(true);
      } else {
        const errorMessage = (response as any)?.errorMessage || "Xəta baş verdi";
        toast.error(errorMessage);
      }
    } catch (error: any) {
      toast.error(
        getBackendErrorMessage(error as AxiosError) ||
          "Şifrə yenilənərkən xəta baş verdi",
      );
      const errorMessage = error?.response?.data?.errorMessage || error?.message || "Xəta baş verdi";
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUsernameChange = (val: string) => {
    onInputChange("username", val);
    if (checkStatus !== 'idle') {
      setCheckStatus('idle');
    }
    if (isUsernameSaved) {
      setIsUsernameSaved(false);
    }
  };

  const handleCheckUsername = async () => {
    if (!formData.username) return;

    setCheckStatus('checking');

    try {
      const ldapChecked = isLdapSelected || false;
      const response = await usersService.checkUsername(ldapChecked, formData.username);
      
      const isSuccess = (response as any)?.isSuccess !== false;
      
      if (isSuccess) {
        setCheckStatus('available');
      } else {
        setCheckStatus('taken');
      }
    } catch (error: any) {
      toast.error(
        getBackendErrorMessage(error as AxiosError) ||
          "Username check error",
      );
      setCheckStatus('taken');
    }
  };

  const handleClearUsername = () => {
    onInputChange("username", "");
    setCheckStatus('idle');
    setIsUsernameSaved(false);
    // LDAP seçimini reset et - input yenidən yazıla bilməlidir
    if (setIsLdapSelected) {
      setIsLdapSelected(false);
    }
  };

  return (
    <div className={styles.container}>
      
      <div className={styles.formRow}>
        <div className={styles.leftColumn}>
            <div className={`${styles.inputWithAction} ${styles[checkStatus] || ''}`}>
              <div className={styles.usernameFormGroup}>
                <label htmlFor="username" className={styles.label}>
                  İstifadəçi adı
                </label>
                <div className={styles.usernameInputWrapper}>
                  <input
                    id="username"
                    type="text"
                    placeholder="İstifadəçi adı daxil edin"
                    value={formData.username || ""}
                    onChange={(e) => handleUsernameChange(e.target.value)}
                    disabled={hasOriginalUsername || isUsernameFromPinSearch || isLdapSelected}
                    className={styles.usernameInput}
                  />
                  {formData.username && !isUsernameFromPinSearch && (
                    <button
                      type="button"
                      className={styles.clearUsernameButton}
                      onClick={handleClearUsername}
                      title="Təmizlə"
                      disabled={hasUsername}
                    >
                      <XMarkIcon className={styles.clearUsernameIcon} />
                    </button>
                  )}
                  <button 
                    className={styles.checkButton} 
                    onClick={handleCheckUsername}
                    type="button"
                    disabled={
                      hasOriginalUsername || 
                      isUsernameFromPinSearch || 
                      isLdapSelected || // LDAP-dan seçildikdə disabled - veri artıq təsdiqlənmişdir
                      !formData.username?.trim()
                    }
                  >
                    {checkStatus === 'checking' ? (
                      <ArrowPathIcon className={styles.spinner} />
                    ) : (
                      "Yoxla"
                    )}
                  </button>
                </div>
              </div>
              
              <div className={styles.iconContainer}>
                {checkStatus === 'available' && (
                  <CheckCircleIcon className={styles.statusSuccess} />
                )}
                {checkStatus === 'taken' && (
                  <XCircleIcon className={styles.statusError} />
                )}
              </div>
            </div>

            <div className={styles.buttonGroup}>
              {onLdapSearch && (
                <Button
                  type="button"
                  variant="primary"
                  className={styles.ldapBtn}
                  onClick={onLdapSearch}
                  disabled={
                    hasOriginalUsername || 
                    isUsernameFromPinSearch
                    // isLdapSelected kaldırıldı - LDAP-dan seçim yapıldıktan sonra da axtar butonu aktiv olmalıdır
                  }
                >
                  Axtar
                </Button>
              )}
            </div>
        </div>

        <div></div>
      </div>

      <div className={styles.divider}></div>

      <div className={styles.footer}>
         <Button
            type="button"
            variant="primary"
            onClick={onSave || handleSecuritySave}
            className={styles.footerBtn}
            disabled={
              hasOriginalUsername ||
              isSaving ||
              (
                !isLdapUsernameValidated &&
                (!isUsernameModified || !isUsernameValidated)
              )
            }
          >
            {isSaving ? "Yadda saxlanılır..." : "Yadda saxla"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            className={styles.footerBtn}
            disabled={false} 
          >
            İmtina et
          </Button>
      </div>
    </div>
  );
};

export default SecurityTab;
