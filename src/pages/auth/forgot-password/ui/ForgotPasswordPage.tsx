import { useState, useRef, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PHONE_MASK } from "../lib/phoneMask";
import {
  isValidEmail,
  isPhoneComplete,
  isValidUsername,
} from "../lib/validation";
import { useForgotSteps, FORGOT_STEPS } from "../model/useForgotSteps";
import { UsernameStep } from "./steps/UsernameStep";
import { ChannelStep } from "./steps/ChannelStep";
import { OtpStep } from "./steps/OtpStep";
import { PasswordStep } from "./steps/PasswordStep";
import styles from "@/pages/login-page/ui/Login.module.css";

type DeliveryChannel = "email" | "phone";
type ForgotTab = "username" | "phone" | "email";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { currentStep, goToStep } = useForgotSteps();
  const [activeTab, setActiveTab] = useState<ForgotTab>("username");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState(PHONE_MASK);
  const [email, setEmail] = useState("");
  const [deliveryChannel, setDeliveryChannel] = useState<DeliveryChannel>("email");
  const [otpDigits, setOtpDigits] = useState(["", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [cameFromChannel, setCameFromChannel] = useState(false);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const getCursorPos = (phoneVal: string) => {
    for (let i = phoneVal.length - 1; i >= 0; i--) {
      const char = phoneVal[i];
      if (char && /\d/.test(char)) return Math.max(i + 1, 4);
    }
    return 4;
  };

  useLayoutEffect(() => {
    if (activeTab === "phone" && phoneInputRef.current) {
      const lastDigitPos = getCursorPos(phone);

      if (phoneInputRef.current.selectionStart !== lastDigitPos) {
        phoneInputRef.current.setSelectionRange(lastDigitPos, lastDigitPos);
      }
    }
  }, [phone, activeTab]);

  const handleNext = () => {
    if (!isCurrentInputValid) {
      return;
    }

    if (activeTab === "phone") {
      setDeliveryChannel("phone");
      setCameFromChannel(false);
      goToStep(FORGOT_STEPS.CODE);
    } else if (activeTab === "email") {
      setDeliveryChannel("email");
      setCameFromChannel(false);
      goToStep(FORGOT_STEPS.CODE);
    } else {
      goToStep(FORGOT_STEPS.CHANNEL);
    }
  };

  const handleChannelNext = () => {
    setCameFromChannel(true);
    goToStep(FORGOT_STEPS.CODE);
  };

  const handleOtpChange = (index: number, value: string) => {
    const safeValue = value.replace(/\D/g, "").slice(-1);
    
    setOtpDigits((prev) => {
      const next = [...prev];
      next[index] = safeValue;
      return next;
    });

    if (safeValue && index < otpDigits.length - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const moveCursorToEndOfDigits = () => {
    if (phoneInputRef.current) {
      const lastDigitPos = getCursorPos(phone);
      phoneInputRef.current.setSelectionRange(lastDigitPos, lastDigitPos);
    }
  };

  const isOtpComplete = otpDigits.every((digit) => digit.length === 1);
  const isPasswordStepValid =
    newPassword.trim().length > 0 &&
    confirmPassword.trim().length > 0 &&
    newPassword === confirmPassword;

  const isCurrentInputValid =
    (activeTab === "username" && isValidUsername(username)) ||
    (activeTab === "phone" && isPhoneComplete(phone)) ||
    (activeTab === "email" && isValidEmail(email));

  const renderStep = () => {
    switch (currentStep) {
      case FORGOT_STEPS.USERNAME:
        return (
          <UsernameStep
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            username={username}
            setUsername={setUsername}
            phone={phone}
            setPhone={setPhone}
            email={email}
            setEmail={setEmail}
            phoneInputRef={phoneInputRef as React.RefObject<HTMLInputElement>}
            moveCursorToEndOfDigits={moveCursorToEndOfDigits}
            handleNext={handleNext}
            onBack={() => navigate("/login")}
            isNextDisabled={!isCurrentInputValid}
          />
        );
      case FORGOT_STEPS.CHANNEL:
        return (
          <ChannelStep
            deliveryChannel={deliveryChannel}
            setDeliveryChannel={setDeliveryChannel}
            onBack={() => goToStep(FORGOT_STEPS.USERNAME)}
            onNext={handleChannelNext}
          />
        );
      case FORGOT_STEPS.CODE:
        return (
          <OtpStep
            otpDigits={otpDigits}
            otpRefs={otpRefs}
            handleOtpChange={handleOtpChange}
            handleOtpKeyDown={handleOtpKeyDown}
            isOtpComplete={isOtpComplete}
            onBack={() => {
              if (cameFromChannel) {
                goToStep(FORGOT_STEPS.CHANNEL);
              } else {
                goToStep(FORGOT_STEPS.USERNAME);
              }
            }}
            onNext={() => goToStep(FORGOT_STEPS.PASSWORD)}
          />
        );
      case FORGOT_STEPS.PASSWORD:
        return (
          <PasswordStep
            newPassword={newPassword}
            confirmPassword={confirmPassword}
            setNewPassword={setNewPassword}
            setConfirmPassword={setConfirmPassword}
            isNextDisabled={!isPasswordStepValid}
            onBack={() => goToStep(FORGOT_STEPS.CODE)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        {renderStep()}
      </div>
      <div className={styles.copyright}>
        <a
          href="https://netrone.com/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "inherit", textDecoration: "none" }}
        >
          Powered By NETRONE
        </a>
      </div>
    </div>
  );
}
