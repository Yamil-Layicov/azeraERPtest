import React, { useState } from "react";
import Modal from "@/shared/ui/modal/base/Modal";
import { Button, FormInput } from "@/shared/ui";
import styles from "./TwoFactorAuthModal.module.css";
import {
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  CpuChipIcon,
  ChevronLeftIcon,
  CheckCircleIcon,
  ClipboardDocumentIcon,
  QrCodeIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

interface TwoFactorAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = "select" | "verify";
type Method = "email" | "phone" | "app";

export const TwoFactorAuthModal: React.FC<TwoFactorAuthModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [step, setStep] = useState<Step>("select");
  const [method, setMethod] = useState<Method | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  const handleMethodSelect = (selectedMethod: Method) => {
    setMethod(selectedMethod);
  };

  const handleConfirmMethod = () => {
    if (method) {
      setStep("verify");
    }
  };

  const handleBack = () => {
    setStep("select");
    setInputValue("");
    setError("");
  };

  const handleClose = () => {
    setStep("select");
    setMethod(null);
    setInputValue("");
    setError("");
    onClose();
  };

  const renderSelection = () => (
    <div className={styles.selectionContainer}>
      <p className={styles.description}>
        Hesabınızın təhlükəsizliyini artırmaq üçün iki faktorlu autentifikasiya
        metodunu seçin.
      </p>

      <div className={styles.methodList}>
        <div
          className={`${styles.methodItem} ${method === "email" ? styles.active : ""}`}
          onClick={() => handleMethodSelect("email")}
        >
          <div className={styles.methodIcon}>
            <EnvelopeIcon width={24} />
          </div>
          <div className={styles.methodInfo}>
            <span className={styles.methodName}>E-poçt</span>
            <span className={styles.methodDesc}>
              Təsdiq kodu e-poçt ünvanınıza göndəriləcək.
            </span>
          </div>
          <div className={styles.radioWrapper}>
            <input type="radio" checked={method === "email"} readOnly />
          </div>
        </div>

        <div
          className={`${styles.methodItem} ${method === "phone" ? styles.active : ""}`}
          onClick={() => handleMethodSelect("phone")}
        >
          <div className={styles.methodIcon}>
            <DevicePhoneMobileIcon width={24} />
          </div>
          <div className={styles.methodInfo}>
            <span className={styles.methodName}>Mobil Nömrə</span>
            <span className={styles.methodDesc}>
              Təsdiq kodu SMS vasitəsilə nömrənizə göndəriləcək.
            </span>
          </div>
          <div className={styles.radioWrapper}>
            <input type="radio" checked={method === "phone"} readOnly />
          </div>
        </div>

        <div
          className={`${styles.methodItem} ${method === "app" ? styles.active : ""}`}
          onClick={() => handleMethodSelect("app")}
        >
          <div className={styles.methodIcon}>
            <CpuChipIcon width={24} />
          </div>
          <div className={styles.methodInfo}>
            <span className={styles.methodName}>Mobil tətbiq</span>
            <span className={styles.methodDesc}>
              Google Authenticator və ya bənzər tətbiqdən istifadə edin.
            </span>
          </div>
          <div className={styles.radioWrapper}>
            <input type="radio" checked={method === "app"} readOnly />
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <Button
          variant="default"
          onClick={handleClose}
          className={styles.cancelBtn}
        >
          İmtina et
        </Button>
        <Button
          variant="primary"
          onClick={handleConfirmMethod}
          disabled={!method}
          className={styles.confirmBtn}
        >
          Növbəti
        </Button>
      </div>
    </div>
  );

  const renderVerification = () => {
    let content = null;

    if (method === "email") {
      content = (
        <FormInput
          label="E-poçt ünvanı"
          id="2fa-email"
          type="email"
          placeholder="nümunə@mail.com"
          value={inputValue}
          onChange={(val) => {
            setInputValue(val);
            if (error) setError("");
          }}
          error={error}
        />
      );
    } else if (method === "phone") {
      content = (
        <FormInput
          label="Mobil nömrə"
          id="2fa-phone"
          type="text"
          placeholder="+994 -- --- -- --"
          value={inputValue}
          onChange={(val) => {
            setInputValue(val);
            if (error) setError("");
          }}
          error={error}
        />
      );
    } else if (method === "app") {
      content = (
        <div className={styles.appVerification}>
          <div className={styles.qrSection}>
            <div className={styles.qrFrame}>
              <div className={styles.qrBox}>
                <div className={styles.qrPattern}></div>
                <QrCodeIcon className={styles.qrIconOverlay} />
              </div>
            </div>
            <div className={styles.qrMethodDivider}>və ya</div>
            <div className={styles.secretKeySection}>
              <span className={styles.secretKeyLabel}>Quraşdırma açarı:</span>
              <div className={styles.secretKeyGroup}>
                <code className={styles.secretKeyCode}>
                  ABCD EFGH IJKL MNOP
                </code>
                <button
                  className={styles.copyBtn}
                  onClick={() => {
                    navigator.clipboard.writeText("ABCD EFGH IJKL MNOP");
                    toast.success("Açar kopyalandı");
                  }}
                  title="Kopyala"
                >
                  <ClipboardDocumentIcon width={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    const handleConfirmVerification = () => {
      if (!inputValue.trim()) {
        setError("Bu sahə doldurulmalıdır");
        return;
      }

      if (method === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(inputValue)) {
          setError("Elektron poçt ünvanı düzgün deyil");
          return;
        }
      } else if (method === "phone") {
        if (inputValue.length < 10) {
          setError("Mobil nömrə formatı yanlışdır");
          return;
        }
      } else if (method === "app") {
        if (inputValue.replace(/\s/g, "").length !== 6) {
          setError("Kod 6 rəqəmli olmalıdır");
          return;
        }
      }

      // Submit logic here
      toast.success("İkili autentifikasiya aktivləşdirildi");
      handleClose();
    };

    return (
      <div className={styles.verifyContainer}>
        <h3 className={styles.bodyTitleText}>{titleText}</h3>

        <div className={styles.verifyMainContent}>{content}</div>

        <div className={styles.footer}>
          <Button
            variant="default"
            onClick={handleClose}
            className={styles.cancelBtn}
          >
            İmtina et
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirmVerification}
            className={styles.confirmBtn}
          >
            <CheckCircleIcon width={20} className={styles.btnIcon} />
            Təsdiqlə
          </Button>
        </div>
      </div>
    );
  };

  const titleText =
    method === "email"
      ? "E-poçt təsdiqləmə"
      : method === "phone"
        ? "Mobil nömrə təsdiqləmə"
        : "Autentifikator tətbiqi";

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        step === "select" ? (
          "İkili autentifikasiya"
        ) : (
          <div className={styles.modalHeaderVerify}>
            <button className={styles.backLink} onClick={handleBack}>
              <ChevronLeftIcon width={16} />
              Geri
            </button>
          </div>
        )
      }
      size="md"
    >
      {step === "select" ? renderSelection() : renderVerification()}
    </Modal>
  );
};
