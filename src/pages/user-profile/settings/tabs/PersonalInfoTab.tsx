import { useState} from "react";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import { FormInput } from "@/shared/ui";
import { useUser, useChangeUserContact, useProfilePhoto, useSentConfirmCode, useConfirmCode } from "@/features/auth/hooks";
import styles from "../ProfileSettings.module.css";
import { EditableInputField } from "../ui/components/EditableInputField";
import { EditInfoModal } from "../ui/components/EditInfoModal";
import { VerifyOtpModal } from "../ui/components/VerifyOtpModal";
import type { GetUserProfileResponseType } from "@/features/auth/model/schema";
import { useLookups } from "@/pages/kadrlar/employees/ui/components/cv-page/models/useLookups";
import { useFormatDate } from "@/shared/hooks";
import { UserIcon } from "@heroicons/react/24/outline";
import { getBackendErrorMessage } from "@/shared/api";

export const PersonalInfoTab = ({
  profileInfo,
}: {
  profileInfo: GetUserProfileResponseType | null;
}) => {
  const { data: meData } = useUser();
  const user = meData?.result?.user;
  const profile = profileInfo?.result;
  const { getGenderLabel } = useLookups();
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpModalTitle, setOtpModalTitle] = useState("");
  const [verifyingType, setVerifyingType] = useState<"email" | "phone" | null>(null);
  const { photoUrl, isLoading: isPhotoLoading } = useProfilePhoto(profile?.photoId);
  const [editingField, setEditingField] = useState<{
    label: string;
    value: string;
    key: "email" | "phone";
  } | null>(null);

  const { mutate: changeContact, isPending: isChangingContact } = useChangeUserContact();
  const { mutate: sendCode, isPending: isSendingCode } = useSentConfirmCode();
  const { mutate: confirmCode } = useConfirmCode();

  const handleEdit = (label: string, value: string, key: "email" | "phone") => {
    setEditingField({ label, value, key });
    setIsModalOpen(true);
  };
  const { formatDate } = useFormatDate();

  const handleSave = (newValue: string) => {
    if (editingField) {
      const type = editingField.key === "phone" ? "Mobile" : "Email";
      const finalValue = editingField.key === "phone" ? newValue.replace(/\D/g, "") : newValue;

      changeContact({
        type: type,
        value: finalValue,
      }, {
        onSuccess: (res) => {
          if (res.isSuccess) {
            setIsModalOpen(false);
          } else {
            toast.error(res.errorMessage || "Xəta baş verdi");
          }
        },
        onError: (err) => {
          toast.error(getBackendErrorMessage(err as AxiosError));
        }
      });
    }
  };

  const handleVerify = (type: "email" | "phone") => {
    const apiType = type === "email" ? "Email" : "Mobile";
    setVerifyingType(type);

    sendCode(apiType, {
      onSuccess: (res) => {
        if (res.isSuccess) {
          setOtpModalTitle(
            type === "email"
              ? "E-poçt təsdiqlənməsi"
              : "Telefon nömrəsinin təsdiqlənməsi",
          );
          setIsOtpModalOpen(true);
        } else {
          toast.error(res.errorMessage || "Xəta baş verdi");
        }
      },
      onError: (err) => {
        toast.error(getBackendErrorMessage(err as AxiosError));
      }
    });
  };

  const handleOtpVerify = (otp: string) => {
    if (verifyingType) {
      confirmCode({ type: verifyingType, code: otp }, {
        onSuccess: (res) => {
          if (res.isSuccess) {
            setIsOtpModalOpen(false);
          } else {
            toast.error(res.errorMessage || "Kod yanlışdır");
          }
        },
        onError: (err) => {
          toast.error(getBackendErrorMessage(err as AxiosError));
        }
      });
    }
  };


  return (
    <div>
      <div className={styles.tabContent}>
        <div className={styles.tabHeader}>
          <h2 className={styles.tabTitle}>Şəxsi məlumatlar</h2>
        </div>

        <div className={styles.profileAvatarSection}>
          <div className={styles.avatarContainer}>
            {isPhotoLoading ? (
              <div className={styles.avatarPlaceholder}>Yüklənir...</div>
            ) : profile?.photoId ? (
              <img
                src={photoUrl || ""}
                alt="Avatar"
                className={styles.avatar}
              />
            ) : (
              <div className={styles.avatarPlaceholder}>
                <UserIcon className={styles.profileAvatarIcon} />
              </div>
            )}
          </div>
          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <FormInput
                label="Tam Adı"
                id="fullName"
                type="text"
                placeholder="-"
                value={profile?.fullname || user?.fullname || ""}
                onChange={() => {}}
                disabled={true}
              />
            </div>

            <div className={styles.inputGroup}>
              <FormInput
                label="İstifadəçi Adı"
                id="username"
                type="text"
                placeholder="-"
                value={profile?.userName || user?.username || ""}
                onChange={() => {}}
                disabled={true}
              />
            </div>
            <div className={styles.inputGroup}>
              <FormInput
                label="Dogum tarixi"
                id="birthDate"
                type="text"
                placeholder="-"
                value={formatDate(profile?.birthDate) || "-"}
                onChange={() => {}}
                disabled={true}
              />
            </div>
            <div className={styles.inputGroup}>
              <FormInput
                label="Cinsi"
                id="gender"
                type="text"
                placeholder="-"
                value={getGenderLabel(profile?.gender) || "-"}
                onChange={() => {}}
                disabled={true}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.tabContentContact}>
        <div className={styles.tabHeader}>
          <h2 className={styles.tabTitle}>Əlaqə məlumatları</h2>
        </div>

        <div className={styles.profileContactSection}>
          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <EditableInputField
                label="E-poçt"
                value={profile?.email || user?.email || ""}
                onEdit={() =>
                  handleEdit(
                    "E-poçt",
                    profile?.email || user?.email || "",
                    "email",
                  )
                }
                onVerify={() => handleVerify("email")}
                isVerified={profile?.emailConfirmed}
                isLoading={verifyingType === "email" && isSendingCode}
              />
            </div>

            <div className={styles.inputGroup}>
              <EditableInputField
                label="Telefon"
                value={profile?.phoneNumber || user?.phone || ""}
                onEdit={() =>
                  handleEdit(
                    "Telefon",
                    profile?.phoneNumber || user?.phone || "",
                    "phone",
                  )
                }
                onVerify={() => handleVerify("phone")}
                isVerified={profile?.phoneNumberConfirmed}
                isLoading={verifyingType === "phone" && isSendingCode}
              />
            </div>
          </div>
        </div>
      </div>

      <EditInfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        title={`${editingField?.label || ""} redaktə et`}
        label={editingField?.label || ""}
        initialValue={editingField?.value || ""}
        placeholder={`Yeni ${editingField?.label?.toLowerCase() || ""} daxil edin`}
        type={editingField?.key === "email" ? "email" : "phone"}
        isLoading={isChangingContact}
      />

      <VerifyOtpModal
        isOpen={isOtpModalOpen}
        onClose={() => setIsOtpModalOpen(false)}
        onVerify={handleOtpVerify}
        title={otpModalTitle}
        target={
          verifyingType === "email"
            ? profile?.email || user?.email || ""
            : profile?.phoneNumber || user?.phone || ""
        }
      />
    </div>
  );
};
