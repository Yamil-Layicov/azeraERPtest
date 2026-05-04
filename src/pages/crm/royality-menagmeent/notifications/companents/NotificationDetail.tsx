import React from "react";
import styles from "./NotificationDetail.module.css";
import type { Notification } from "@/pages/settings/notifications/models";

interface NotificationDetailProps {
  selectedNotification: Notification | null;
}

const NotificationDetail: React.FC<NotificationDetailProps> = ({
  selectedNotification,
}) => {
  return (
    <div className={styles.detailPanel}>
      {selectedNotification ? (
        <>
          <div className={styles.detailHeader}>
            <h3 className={styles.detailTitle}>{selectedNotification.title}</h3>
          </div>
          <div className={styles.detailMeta}>
            <span
              className={`${styles.statusBadge} ${
                selectedNotification.isActive ? styles.active : styles.deactive
              }`}
            >
              <span className={styles.statusDot} />
              Status:
              <span className={styles.statusText}>
                {selectedNotification.isActive ? "Aktiv" : "Deaktiv"}
              </span>
            </span>
            <span>
              Tarix:{" "}
              <span className={styles.date}>{selectedNotification.date}</span>
            </span>
            <span>
              Baxış:{" "}
              <span className={styles.views}>{selectedNotification.views}</span>
            </span>
          </div>
          <div
            className={styles.detailDescription}
            dangerouslySetInnerHTML={{
              __html: selectedNotification.description,
            }}
          />
        </>
      ) : (
        <div className={styles.emptyDetailPanel}>
          <span>Detallara baxmaq üçün sətir seçin</span>
        </div>
      )}
    </div>
  );
};

export default NotificationDetail;
