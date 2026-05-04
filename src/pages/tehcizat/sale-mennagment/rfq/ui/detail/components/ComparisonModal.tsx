import React, { useState } from "react";
import { Modal, Button } from "@/shared/ui";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import styles from "./ComparisonModal.module.css";

interface VendorBid {
  id: string;
  vendorName: string;
  amount?: number;
  currency?: string;
  status: string;
  date?: string;
}

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  bids: VendorBid[];
  rfqTitle: string;
  onSelectWinner: (bidId: string) => void;
}

const ComparisonModal: React.FC<ComparisonModalProps> = ({
  isOpen,
  onClose,
  bids,
  rfqTitle,
  onSelectWinner,
}) => {
  const [selectedWinnerId, setSelectedWinnerId] = useState<string | null>(null);

  const handleWinnerClick = (bidId: string) => {
    setSelectedWinnerId(bidId);
  };

  const handleConfirm = () => {
    if (selectedWinnerId) {
      onSelectWinner(selectedWinnerId);
    }
  };

  const allBids = bids;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Qiymət Müqayisəsi və Qalibin Seçilməsi"
      size="lg"
    >
      <div className={styles.modalBody}>
        <p style={{ color: "var(--text-muted)", marginBottom: "1rem" }}>
          <strong>{rfqTitle}</strong> üzrə təklifləri müqayisə edin və ən uyğun
          olanı seçin.
        </p>

        <div className={styles.tableContainer}>
          <table className={styles.comparisonTable}>
            <thead>
              <tr>
                <th>Təchizatçı</th>
                <th>Təklif Məbləği</th>
                <th>Tarix</th>
                <th style={{ textAlign: "center" }}>Seçim</th>
              </tr>
            </thead>
            <tbody>
              {allBids.map((bid: VendorBid) => (
                <tr key={bid.id}>
                  <td>
                    <div className={styles.vendorName}>{bid.vendorName}</div>
                  </td>
                  <td>
                    <span className={styles.amount}>
                      {bid.amount?.toLocaleString("az-AZ")} {bid.currency}
                    </span>
                  </td>
                  <td
                    style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}
                  >
                    {bid.date
                      ? new Date(bid.date).toLocaleDateString("az-AZ")
                      : "-"}
                  </td>
                  <td className={styles.winnerSection}>
                    {selectedWinnerId === bid.id ? (
                      <div className={styles.winnerBadge}>
                        <CheckCircleIcon width={18} />
                        Seçildi
                      </div>
                    ) : (
                      <button
                        className={styles.selectWinnerBtn}
                        onClick={() => handleWinnerClick(bid.id)}
                      >
                        Qalib Seç
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {allBids.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    style={{
                      textAlign: "center",
                      padding: "3rem",
                      color: "var(--text-muted)",
                    }}
                  >
                    Müqayisə üçün təqdim edilmiş təklif tapılmadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className={styles.actions}>
          <Button variant="outline" onClick={onClose}>
            Bağla
          </Button>
          <Button
            variant="primary"
            disabled={!selectedWinnerId}
            onClick={handleConfirm}
          >
            Təsdiqlə
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ComparisonModal;
