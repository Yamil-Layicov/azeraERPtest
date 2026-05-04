import React from "react";
import { FormInput } from "@/shared/ui";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { MdOutlineLockReset } from "react-icons/md";
import { handlePhoneChange } from "../../lib/phoneMask";
import styles from "@/pages/login-page/ui/Login.module.css";
import forgotStyles from "../ForgotPasswordPage.module.css";

interface UsernameStepProps {
  activeTab: "username" | "phone" | "email";
  setActiveTab: (tab: "username" | "phone" | "email") => void;
  username: string;
  setUsername: (val: string) => void;
  phone: string;
  setPhone: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  phoneInputRef: React.RefObject<HTMLInputElement>;
  moveCursorToEndOfDigits: () => void;
  handleNext: () => void;
  onBack: () => void;
  isNextDisabled: boolean;
}

export const UsernameStep: React.FC<UsernameStepProps> = ({
  activeTab,
  setActiveTab,
  username,
  setUsername,
  phone,
  setPhone,
  email,
  setEmail,
  phoneInputRef,
  moveCursorToEndOfDigits,
  handleNext,
  onBack,
  isNextDisabled,
}) => {
  return (
    <>
      <div className={styles.iconWrapper}>
        <div className={styles.lockIconCircle}>
          <MdOutlineLockReset className={styles.lockIcon} />
        </div>
      </div>
      <h2 className={styles.pageTitle + " " + styles.newPasswordTitle}>
        Hesabı seçin
      </h2>

      <div className={forgotStyles.tabsContainer}>
        <button
          type="button"
          className={`${forgotStyles.tabItem} ${activeTab === "username" ? forgotStyles.tabItemActive : ""}`}
          onClick={() => setActiveTab("username")}
        >
          İstifadəçi adı
        </button>
        <button
          type="button"
          className={`${forgotStyles.tabItem} ${activeTab === "phone" ? forgotStyles.tabItemActive : ""}`}
          onClick={() => setActiveTab("phone")}
        >
          Mobil
        </button>
        <button
          type="button"
          className={`${forgotStyles.tabItem} ${activeTab === "email" ? forgotStyles.tabItemActive : ""}`}
          onClick={() => setActiveTab("email")}
        >
          E-poçt
        </button>
      </div>

      <div className={`${styles.formGroup} ${forgotStyles.formGroupExtended}`}>
        {activeTab === "username" && (
          <FormInput
            id="forgot-username"
            type="text"
            label="İstifadəçi adı"
            placeholder="İstifadəçi adı"
            className={styles.input}
            value={username}
            onChange={setUsername}
          />
        )}
        {activeTab === "phone" && (
          <FormInput
            ref={phoneInputRef}
            id="forgot-phone"
            type="text"
            label="Telefon nömrəsi"
            placeholder=""
            className={styles.input}
            value={phone}
            onChange={(val) => handlePhoneChange(val, phone, setPhone)}
            onFocus={moveCursorToEndOfDigits}
            onClick={moveCursorToEndOfDigits}
          />
        )}
        {activeTab === "email" && (
          <FormInput
            id="forgot-email"
            type="email"
            label="E-poçt ünvanı"
            placeholder="nümunə@azera.az"
            className={styles.input}
            value={email}
            onChange={setEmail}
          />
        )}
      </div>

      <div className={styles.buttonGroup}>
        <button
          type="button"
          className={`${styles.submitButton} ${styles.secondaryBtn}`}
          onClick={onBack}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <ArrowLeftIcon width={20} height={20} strokeWidth={3.5} />
          Geri
        </button>

        <button
          type="button"
          className={styles.submitButton}
          onClick={handleNext}
          disabled={isNextDisabled}
        >
          Növbəti
        </button>
      </div>
    </>
  );
};
