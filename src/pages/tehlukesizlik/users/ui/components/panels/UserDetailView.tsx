import type { User } from "../../../model/types"; // User model importunu dəqiqləşdirin
import { Button } from "@/shared/ui";
import {
  KeyIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import styles from "./UserPanel.module.css";
import { useFormatDate } from "@/shared/hooks";

interface UserDetailViewProps {
  user: User | undefined | null;
  isLoading: boolean;
  isActive: boolean;
  isRestricted: boolean;
  isChangingStatus: boolean;
  isTogglingLockout: boolean;
  statusMessage: { type: "success" | "error"; text: string } | null;
  // Actions (Callback-lər)
  onToggleStatus: () => void;
  onToggleRestriction: () => void;
  onPasswordChange: () => void;
  onLdapGroups: () => void;
  onRoles: () => void;
}

export const UserDetailView = ({
  user,
  isLoading,
  isActive,
  isRestricted,
  isChangingStatus,
  isTogglingLockout,
  statusMessage,
  onToggleStatus,
  onToggleRestriction,
  onPasswordChange,
  onLdapGroups,
  onRoles,
}: UserDetailViewProps) => {
  const { formatDateTime } = useFormatDate();

  if (isLoading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>Yüklənir...</div>
    );
  }

  if (!user) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        Məlumat tapılmadı
      </div>
    );
  }

  return (
    <div className={styles.contentBox}>
      {/* 1. Username */}
      <div className={styles.infoRow}>
        <span className={styles.label}>İstifadəçi adı:</span>
        <span className={styles.value}>{user.username}</span>
      </div>

      {/* 2. Email */}
      <div className={styles.infoRow}>
        <span className={styles.label}>E-poçt:</span>
        <div className={styles.value}>
          {user.email ? (
            <>
              <span>{user.email}</span>
              <span
                className={`${styles.badge} ${user.emailConfirmed ? styles.badgeSuccess : styles.badgeError}`}
              >
                {user.emailConfirmed ? "Təsdiqlənib" : "Təsdiq edilməyib"}
              </span>
            </>
          ) : (
            <span>Yoxdur</span>
          )}
        </div>
      </div>

      {/* 3. Phone */}
      <div className={styles.infoRow}>
        <span className={styles.label}>Mobil:</span>
        <div className={styles.value}>
          {user.phoneNumber ? (
            <>
              <span>{user.phoneNumber}</span>
              <span
                className={`${styles.badge} ${user.phoneNumberConfirmed ? styles.badgeSuccess : styles.badgeError}`}
              >
                {user.phoneNumberConfirmed ? "Təsdiqlənib" : "Təsdiq edilməyib"}
              </span>
            </>
          ) : (
            <span>Yoxdur</span>
          )}
        </div>
      </div>

      {/* 4. Aktiv */}
      <div className={styles.infoRow} style={{ justifyContent: "flex-start" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            flexWrap: "nowrap",
          }}
        >
          <span className={styles.label}>Aktiv:</span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexWrap: "nowrap",
            }}
          >
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={isActive}
                onChange={onToggleStatus}
                disabled={isChangingStatus}
              />
              <span className={styles.slider}></span>
            </label>
            {statusMessage && (
              <div
                className={`${styles.statusFeedback} ${statusMessage.type === "success" ? styles.statusFeedbackSuccess : styles.statusFeedbackError}`}
                style={{ whiteSpace: "nowrap" }}
              >
                <InformationCircleIcon width={16} />
                <span>{statusMessage.text}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5. Giriş Məhdudiyyəti */}
      <div className={styles.infoRow}>
        <span className={styles.label}>Giriş məhdudlaşdırılıb:</span>
        <div className={styles.value}>
          <label className={styles.switch}>
            <input
              type="checkbox"
              checked={isRestricted}
              onChange={onToggleRestriction}
              disabled={isTogglingLockout}
            />
            <span className={styles.slider}></span>
          </label>
        </div>
      </div>

      {/* 6. Məhdudiyyət Bitmə Tarixi */}
      <div className={styles.infoRow}>
        <span className={styles.label}>Məhdudiyyət bitir:</span>
        <div className={styles.value}>
          <span>{formatDateTime(user.lockoutEnd || null)}</span>
        </div>
      </div>

      {/* 7. Yaranma Tarixi */}
      <div className={styles.infoRow}>
        <span className={styles.label}>Yaranma tarixi:</span>
        <span className={styles.value}>
          {formatDateTime(user.createdAt || null)}
        </span>
      </div>

      {/* BUTTONS */}
      <div style={{ padding: "0 16px" }}>
        <div className={styles.buttonGroup}>
          <Button
            className={styles.actionBtn}
            variant="secondary"
            type="button"
            onClick={onPasswordChange}
          >
            <KeyIcon width={18} /> Şifrəni dəyiş
          </Button>
          <Button
            className={styles.actionBtn}
            variant="secondary"
            type="button"
            onClick={onLdapGroups}
            disabled={!user.ldapUserId}
          >
            <UserGroupIcon width={18} /> Ldap Qrup
          </Button>
          <Button
            className={styles.actionBtn}
            variant="secondary"
            type="button"
            onClick={onRoles}
          >
            <ShieldCheckIcon width={18} /> Rollar
          </Button>
        </div>
      </div>
    </div>
  );
};
