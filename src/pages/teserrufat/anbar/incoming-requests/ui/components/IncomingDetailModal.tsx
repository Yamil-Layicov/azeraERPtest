import React, { useState, useMemo, useCallback } from "react";
import styles from "./IncomingDetailModal.module.css";
import { Modal, Button } from "@/shared/ui";
import type {
  IncomingRequest,
  IncomingRequestStatus,
  IncomingProduct,
} from "../../model/types";
import {
  UserIcon,
  BuildingOfficeIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

export type ProductDecision = "accepted" | "rejected" | null;

export interface ProductDecisionItem {
  productId: string;
  decision: ProductDecision;
  giveQty: number;
}

interface IncomingDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: IncomingRequest | null;
  onSubmitDecisions?: (
    requestId: string,
    decisions: ProductDecisionItem[],
    note?: string,
  ) => void;
}

const statusConfig: Record<
  IncomingRequestStatus,
  { label: string; bannerClass: string; icon: React.ElementType }
> = {
  pending: {
    label: "Bu tələb hələ cavablandırılmayıb",
    bannerClass: "bannerPending",
    icon: ClockIcon,
  },
  active: {
    label: "Bu tələb qismən təmin edilib (Anbar borcludur)",
    bannerClass: "bannerPending",
    icon: ClockIcon,
  },
  closed: {
    label: "Bu tələb tam şəkildə bağlanıb",
    bannerClass: "bannerAccepted",
    icon: CheckCircleIcon,
  },
};

const IncomingDetailModal: React.FC<IncomingDetailModalProps> = ({
  isOpen,
  onClose,
  request,
  onSubmitDecisions,
}) => {
  const [decisions, setDecisions] = useState<
    Map<string, { decision: ProductDecision; giveQty: number }>
  >(new Map());
  const [note, setNote] = useState("");

  // Reset decisions when request changes
  const initDecisions = useCallback((products: IncomingProduct[]) => {
    const map = new Map<
      string,
      { decision: ProductDecision; giveQty: number }
    >();
    products.forEach((p) => {
      const remaining = p.requestedQty - p.fulfilledQty;
      const autoGive = Math.min(remaining, p.inStockQty);
      map.set(p.id, {
        decision: null,
        giveQty: autoGive,
      });
    });
    return map;
  }, []);

  // Initialize on open
  const currentDecisions = useMemo(() => {
    if (!request) return new Map();
    // Re-initialize if the request changes or decisions are empty
    if (decisions.size === 0 || !decisions.has(request.products[0]?.id ?? "")) {
      return initDecisions(request.products);
    }
    return decisions;
  }, [request, decisions, initDecisions]);

  if (!request) return null;

  const config = statusConfig[request.status];
  const StatusIcon = config.icon || ClockIcon;
  const isEditable = request.status === "pending" || request.status === "active";

  const setProductDecision = (productId: string, decision: ProductDecision) => {
    setDecisions((prev) => {
      const next = new Map(prev.size ? prev : currentDecisions);
      const existing = next.get(productId);
      if (existing) {
        next.set(productId, {
          ...existing,
          decision: existing.decision === decision ? null : decision,
        });
      }
      return next;
    });
  };

  const setGiveQty = (productId: string, qty: number) => {
    setDecisions((prev) => {
      const next = new Map(prev.size ? prev : currentDecisions);
      const existing = next.get(productId);
      if (existing) {
        next.set(productId, { ...existing, giveQty: qty });
      }
      return next;
    });
  };

  const acceptAll = () => {
    setDecisions(() => {
      const next = new Map(currentDecisions);
      request.products.forEach((p) => {
        const existing = next.get(p.id);
        if (existing) {
          next.set(p.id, { ...existing, decision: "accepted" });
        }
      });
      return next;
    });
  };

  const rejectAll = () => {
    setDecisions(() => {
      const next = new Map(currentDecisions);
      request.products.forEach((p) => {
        const existing = next.get(p.id);
        if (existing) {
          next.set(p.id, { ...existing, decision: "rejected", giveQty: 0 });
        }
      });
      return next;
    });
  };

  const allDecided = request.products.every(
    (p) => currentDecisions.get(p.id)?.decision !== null,
  );

  const acceptedCount = request.products.filter(
    (p) => currentDecisions.get(p.id)?.decision === "accepted",
  ).length;

  const rejectedCount = request.products.filter(
    (p) => currentDecisions.get(p.id)?.decision === "rejected",
  ).length;

  const handleSubmit = () => {
    if (!onSubmitDecisions || !allDecided) return;
    const items: ProductDecisionItem[] = request.products.map((p) => {
      const d = currentDecisions.get(p.id);
      return {
        productId: p.id,
        decision: d?.decision ?? null,
        giveQty: d?.decision === "accepted" ? (d?.giveQty ?? 0) : 0,
      };
    });
    onSubmitDecisions(request.id, items, note);
    setDecisions(new Map());
    setNote("");
  };

  const handleClose = () => {
    setDecisions(new Map());
    setNote("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Anbara Gələn Tələb: ${request.prNo}`}
      size="lg"
    >
      <div className={styles.container}>
        {/* Status Banner */}
        <div className={`${styles.statusBanner} ${styles[config.bannerClass]}`}>
          <StatusIcon />
          {config.label}
        </div>

        {/* Info Cards Grid */}
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
              <span className={styles.infoLabel}>Təsdiq Tarixi</span>
              <span className={styles.infoValue}>
                {new Date(request.approvedDate).toLocaleDateString("az-AZ")}
              </span>
            </div>
          </div>
          <div className={styles.infoCard}>
            <CurrencyDollarIcon className={styles.infoIcon} />
            <div className={styles.infoContent}>
              <span className={styles.infoLabel}>Məbləğ</span>
              <span className={styles.infoValue}>
                {request.totalAmount.toLocaleString()} AZN
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Təsvir</h4>
          <div className={styles.descriptionBox}>{request.description}</div>
        </div>

        {/* Products Decision Table */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h4 className={styles.sectionTitle}>Məhsullar — Qərar</h4>
            {isEditable && (
              <div className={styles.bulkActions}>
                <button
                  className={styles.bulkBtn}
                  onClick={acceptAll}
                  type="button"
                >
                  <CheckCircleIcon className={styles.bulkIcon} />
                  Hamısını qəbul et
                </button>
                <button
                  className={`${styles.bulkBtn} ${styles.bulkBtnDanger}`}
                  onClick={rejectAll}
                  type="button"
                >
                  <XCircleIcon className={styles.bulkIcon} />
                  Hamısını rədd et
                </button>
              </div>
            )}
          </div>

          <table className={styles.productTable}>
            <thead>
               <tr>
                <th>Məhsul</th>
                <th>İstənilən</th>
                <th>Verilən</th>
                <th>Anbarda</th>
                {isEditable && <th>Veriləcək</th>}
                <th>Qərar</th>
              </tr>
            </thead>
            <tbody>
              {request.products.map((p) => {
                const d = currentDecisions.get(p.id);
                const diff = p.inStockQty - (p.requestedQty - p.fulfilledQty);
                const isLow = diff < 0;
                const ratio = Math.min(
                  (p.inStockQty / (p.requestedQty - p.fulfilledQty)) * 100,
                  100,
                );

                return (
                  <tr
                    key={p.id}
                    className={
                      d?.decision === "accepted"
                        ? styles.rowAccepted
                        : d?.decision === "rejected"
                          ? styles.rowRejected
                          : ""
                    }
                  >
                     <td>{p.name}</td>
                    <td>{p.requestedQty}</td>
                    <td>{p.fulfilledQty}</td>
                    <td>
                      <div className={styles.stockCell}>
                        <span
                          className={
                            isLow ? styles.lowStock : styles.sufficientStock
                          }
                        >
                          {p.inStockQty}
                        </span>
                        <div className={styles.stockBar}>
                          <div
                            className={`${styles.stockBarFill} ${isLow ? styles.fillLow : styles.fillSufficient}`}
                            style={{ width: `${isNaN(ratio) ? 0 : ratio}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    {isEditable && (
                      <td>
                        <input
                          type="number"
                          className={styles.giveInput}
                          min={0}
                          max={p.requestedQty - p.fulfilledQty}
                          value={
                            d?.decision === "rejected" ? 0 : (d?.giveQty ?? 0)
                          }
                          disabled={d?.decision === "rejected"}
                          onChange={(e) => {
                            const val = Math.max(
                              0,
                              Math.min(p.requestedQty - p.fulfilledQty, Number(e.target.value)),
                            );
                            setGiveQty(p.id, val);
                          }}
                        />
                      </td>
                    )}
                    <td>
                      {isEditable ? (
                        <div className={styles.decisionBtns}>
                          <button
                            type="button"
                            className={`${styles.decisionBtn} ${styles.decisionAccept} ${d?.decision === "accepted" ? styles.decisionActive : ""}`}
                            onClick={() => setProductDecision(p.id, "accepted")}
                            title="Qəbul et"
                          >
                            <CheckCircleIcon />
                          </button>
                          <button
                            type="button"
                            className={`${styles.decisionBtn} ${styles.decisionReject} ${d?.decision === "rejected" ? styles.decisionActive : ""}`}
                            onClick={() => setProductDecision(p.id, "rejected")}
                            title="Rədd et"
                          >
                            <XCircleIcon />
                          </button>
                        </div>
                      ) : (
                        <span
                          className={`${styles.diffBadge} ${isLow ? styles.diffNegative : styles.diffPositive}`}
                        >
                          {isLow ? diff : `+${diff}`}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Decision Summary */}
          {isEditable && (acceptedCount > 0 || rejectedCount > 0) && (
            <div className={styles.decisionSummary}>
              {acceptedCount > 0 && (
                <span className={styles.summaryAccepted}>
                  ✓ {acceptedCount} məhsul qəbul
                </span>
              )}
              {rejectedCount > 0 && (
                <span className={styles.summaryRejected}>
                  ✕ {rejectedCount} məhsul rədd (satınalmaya qaytarılacaq)
                </span>
              )}
            </div>
          )}
        </div>

         {/* Note */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Anbarın Qeydi</h4>
          {isEditable ? (
            <textarea
              className={styles.noteTextArea}
              placeholder="Fulfillment qeydlərini bura yazın..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          ) : (
            <div className={styles.noteBox}>{request.note || "Qeyd yoxdur."}</div>
          )}
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <Button variant="outline" onClick={handleClose}>
            Bağla
          </Button>
          {isEditable && onSubmitDecisions && (
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={!allDecided}
            >
              {allDecided
                ? "Qərarları Təsdiqlə"
                : `Qərar verin (${request.products.length - acceptedCount - rejectedCount} qalıb)`}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default IncomingDetailModal;
