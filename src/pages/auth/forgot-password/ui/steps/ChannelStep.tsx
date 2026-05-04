import React from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { MdOutlineLockReset } from "react-icons/md";
import { maskEmail, maskPhone } from "../../lib/validation";
import styles from "@/pages/login-page/ui/Login.module.css";
import forgotStyles from "../ForgotPasswordPage.module.css";

interface ChannelStepProps {
  deliveryChannel: "email" | "phone";
  setDeliveryChannel: (channel: "email" | "phone") => void;
  onBack: () => void;
  onNext: () => void;
}

export const ChannelStep: React.FC<ChannelStepProps> = ({
  deliveryChannel,
  setDeliveryChannel,
  onBack,
  onNext,
}) => {
  return (
    <>
      <div className={styles.iconWrapper}>
        <div className={styles.lockIconCircle}>
          <MdOutlineLockReset className={styles.lockIcon} />
        </div>
      </div>
      <h2 className={styles.pageTitle + " " + styles.newPasswordTitle}>
        Kodu göndərmək üçün bir üsul seçin
      </h2>

      <div className={forgotStyles.channelList}>
        <div
          className={`${forgotStyles.channelBtn} ${
            deliveryChannel === "email" ? forgotStyles.channelBtnActive : ""
          }`}
          onClick={() => setDeliveryChannel("email")}
        >
          <div className={forgotStyles.channelRadioWrapper}>
            <div
              className={`${forgotStyles.customRadio} ${
                deliveryChannel === "email" ? forgotStyles.customRadioChecked : ""
              }`}
            />
          </div>
          <div className={forgotStyles.channelInfo}>
            <span className={forgotStyles.channelData}>
              {maskEmail("yamil.layicov@azera.az")}
            </span>
          </div>
        </div>

        <div
          className={`${forgotStyles.channelBtn} ${
            deliveryChannel === "phone" ? forgotStyles.channelBtnActive : ""
          }`}
          onClick={() => setDeliveryChannel("phone")}
        >
          <div className={forgotStyles.channelRadioWrapper}>
            <div
              className={`${forgotStyles.customRadio} ${
                deliveryChannel === "phone" ? forgotStyles.customRadioChecked : ""
              }`}
            />
          </div>
          <div className={forgotStyles.channelInfo}>
            <span className={forgotStyles.channelData}>
              {maskPhone("994501234567")}
            </span>
          </div>
        </div>
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
          onClick={onNext}
        >
          Növbəti
        </button>
      </div>
    </>
  );
};
