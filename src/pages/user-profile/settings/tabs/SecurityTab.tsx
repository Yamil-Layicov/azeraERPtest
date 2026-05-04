import { FormInput, Button } from "@/shared/ui";
import { PasswordInputField } from "../ui/components/PasswordInputField";
import { TwoFactorAuthModal } from "../ui/components/TwoFactorAuthModal";
import styles from "../ProfileSettings.module.css";
import {
  ShieldCheckIcon,
  DevicePhoneMobileIcon,
  KeyIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { GrUpdate } from "react-icons/gr";
import { useState } from "react";
import { useProfileChangePassword } from "../model/useProfilChangePassword";

export const SecurityTab = () => {
  const { formData, errors, isLoading, handleChange, handleSubmit } =
    useProfileChangePassword();

  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);

  return (
    <div className={styles.tabContent}>
      <div className={styles.tabHeader}>
        <h2 className={styles.tabTitle}>Təhlükəsizlik və Şifrə</h2>
      </div>

      <div className={styles.securitySplitView}>
        <div className={styles.infoPanelsContainer}>
          <div className={styles.securityInfoPanel}>
            <div className={styles.securityHeader}>
              <div className={styles.securityIconWrapper}>
                <ShieldCheckIcon className={styles.largeIcon} />
              </div>
              <h3 className={styles.infoTitle}>Şifrə Qaydaları</h3>
            </div>
            <ul className={styles.infoList}>
              <li>Ən azı 8 simvoldan ibarət olmalıdır</li>
              <li>Böyük və kiçik hərflər daxil edilməlidir</li>
              <li>Ən azı bir rəqəm (0-9) olmalıdır</li>
              <li>Xüsusi bir simvol (@, #, $, vb.) olmalıdır</li>
            </ul>
          </div>

          <div className={styles.securityInfoPanel}>
            <div className={styles.securityHeader}>
              <div className={styles.securityIconWrapper}>
                <DevicePhoneMobileIcon className={styles.largeIcon} />
              </div>
              <h3 className={styles.infoTitle}>İkili Təhlükəsizlik </h3>
            </div>
            <Button
              variant="default"
              type="button"
              className={styles.twoFactorButton}
              onClick={() => setIs2FAModalOpen(true)}
            >
              <KeyIcon className={styles.buttonIcon} />
              Aktivləşdir
            </Button>
          </div>
        </div>

        <div className={styles.securityFormWrapper}>
          <form
            onSubmit={handleSubmit}
            className={styles.formContainer}
            autoComplete="off"
          >
            <div className={styles.inputGroup}>
              <FormInput
                label="İstifadəçi adı"
                id="username"
                type="text"
                placeholder="İstifadəçi adını daxil edin"
                value={formData.username}
                onChange={() => {}}
                autoComplete="off"
                disabled={true}
              />
            </div>

            <div className={styles.inputGroup}>
              <PasswordInputField
                label="Cari şifrə"
                id="currentPassword"
                autoComplete="current-password"
                placeholder="Hazırki şifrənizi daxil edin"
                value={formData.currentPassword}
                onChange={(value) => handleChange("currentPassword", value)}
                error={errors.currentPassword}
              />
            </div>

            <div className={styles.divider}></div>

            <div className={styles.inputGroup}>
              <PasswordInputField
                label="Yeni şifrə"
                id="newPassword"
                placeholder="Yeni şifrə təyin edin"
                value={formData.newPassword}
                onChange={(value) => handleChange("newPassword", value)}
                error={errors.newPassword}
              />
            </div>

            <div className={styles.inputGroup}>
              <PasswordInputField
                label="Yeni şifrənin təkrarı"
                id="confirmPassword"
                placeholder="Yeni şifrəni təkrar daxil edin"
                value={formData.confirmPassword}
                onChange={(value) => handleChange("confirmPassword", value)}
                error={errors.confirmPassword}
              />
            </div>

            <div className={styles.actions}>
              <Button
                type="submit"
                variant="default"
                disabled={isLoading}
                className={styles.submitButton}
              >
                {isLoading ? (
                  <>
                    <ArrowPathIcon className={styles.spinnerIcon} />
                    Gözləyin...
                  </>
                ) : (
                  <>
                    <GrUpdate className={styles.buttonIcon} />
                    Şifrəni Yenilə
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
      <TwoFactorAuthModal
        isOpen={is2FAModalOpen}
        onClose={() => setIs2FAModalOpen(false)}
      />
    </div>
  );
};
