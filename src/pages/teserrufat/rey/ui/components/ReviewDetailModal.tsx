import React, { useState } from "react";
import styles from "./ReviewDetailModal.module.css";
import { Modal, Button } from "@/shared/ui";
import {
  UserIcon,
  BuildingOfficeIcon,
  CalendarDaysIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import type { ReviewRequest, ReviewStatus } from "../../model/types";

interface ReviewDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: ReviewRequest | null;
  onApprove?: (id: string, comment: string) => void;
  onReject?: (id: string, comment: string) => void;
}

const statusConfig: Record<
  ReviewStatus,
  { label: string; bannerClass: string; icon: React.ElementType }
> = {
  pending: {
    label: "Bu tələb şöbənizin rəyini gözləyir",
    bannerClass: "bannerPending",
    icon: ClockIcon,
  },
  approved: {
    label: "Rəy verildi — satınalmaya yönləndirildi",
    bannerClass: "bannerApproved",
    icon: CheckCircleIcon,
  },
  rejected: {
    label: "Rəy verildi — tələb rədd edildi",
    bannerClass: "bannerRejected",
    icon: XCircleIcon,
  },
};

const ReviewDetailModal: React.FC<ReviewDetailModalProps> = ({
  isOpen,
  onClose,
  request,
  onApprove,
  onReject,
}) => {
  const [comment, setComment] = useState("");
  const [hasError, setHasError] = useState(false);

  if (!request) return null;

  const config = statusConfig[request.status];
  const StatusIcon = config?.icon;
  const isPending = request.status === "pending";

  const handleApprove = () => {
    if (!comment.trim()) {
      setHasError(true);
      return;
    }
    onApprove?.(request.id, comment);
    setComment("");
    setHasError(false);
  };

  const handleReject = () => {
    if (!comment.trim()) {
      setHasError(true);
      return;
    }
    onReject?.(request.id, comment);
    setComment("");
    setHasError(false);
  };

  const handleClose = () => {
    setComment("");
    setHasError(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Rəy Tələbi: ${request.prNo}`}
      size="lg"
    >
      <div className={styles.container}>
        {/* Status Banner */}
        <div className={`${styles.statusBanner} ${styles[config.bannerClass]}`}>
          <StatusIcon />
          {config?.label}
        </div>

        {/* Info Cards */}
        <div className={styles.infoGrid}>
          <div className={styles.infoCard}>
            <UserIcon className={styles.infoIcon} />
            <div className={styles.infoContent}>
              <span className={styles.infoLabel}>İstəyən Şəxs</span>
              <span className={styles.infoValue}>{request.requester}</span>
            </div>
          </div>
          <div className={styles.infoCard}>
            <BuildingOfficeIcon className={styles.infoIcon} />
            <div className={styles.infoContent}>
              <span className={styles.infoLabel}>Şöbə</span>
              <span className={styles.infoValue}>{request.department}</span>
            </div>
          </div>
          <div className={styles.infoCard}>
            <CalendarDaysIcon className={styles.infoIcon} />
            <div className={styles.infoContent}>
              <span className={styles.infoLabel}>Rədd Tarixi</span>
              <span className={styles.infoValue}>
                {new Date(request.rejectedDate).toLocaleDateString("az-AZ")}
              </span>
            </div>
          </div>
          <div className={styles.infoCard}>
            <ExclamationTriangleIcon className={styles.infoIcon} />
            <div className={styles.infoContent}>
              <span className={styles.infoLabel}>Rədd Edilən Yer</span>
              <span className={styles.infoValue}>{request.rejectedFrom}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Səbəb</h4>
          <div className={styles.descriptionBox}>{request.description}</div>
        </div>

        {/* Products */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Tələb Olunan Məhsullar</h4>
          <table className={styles.productTable}>
            <thead>
              <tr>
                <th>Məhsul</th>
                <th>Miqdar</th>
              </tr>
            </thead>
            <tbody>
              {request.products.map((p: any) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.requestedQty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Existing Note */}
        {request.note && (
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Qeyd</h4>
            <div className={styles.noteBox}>{request.note}</div>
          </div>
        )}

        {/* Review Comment (only if pending) */}
        {isPending && (
          <div className={styles.section}>
            <h4
              className={styles.sectionTitle}
              style={{ color: hasError ? "#ef4444" : "var(--text-primary)" }}
            >
              Sizin Rəyiniz {hasError && "* (Məcburidir)"}
            </h4>
            <textarea
              className={`${styles.reviewTextarea} ${hasError ? styles.error : ""}`}
              placeholder="Rəyinizi yazın... (məs: Bu məhsul həqiqətən lazımdır, satınalma edilsin)"
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
                if (hasError) setHasError(false);
              }}
            />
          </div>
        )}

        {/* Actions */}
        <div className={styles.actions}>
          <Button variant="outline" onClick={handleClose}>
            Bağla
          </Button>
          {isPending && (
            <>
              <Button variant="danger" onClick={handleReject}>
                Rədd et
              </Button>
              <Button variant="primary" onClick={handleApprove}>
                Təsdiqlə — Satınalmaya göndər
              </Button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ReviewDetailModal;
