import React from "react";
import styles from "./IncomingFilterModal.module.css";
import { Modal, Button } from "@/shared/ui";
import type { IncomingRequestStatus } from "../../model/types";

interface IncomingFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStatuses: IncomingRequestStatus[];
  onFilterChange: (statuses: IncomingRequestStatus[]) => void;
}

const statusOptions: { value: IncomingRequestStatus; label: string }[] = [
  { value: "pending", label: "Gözləyən (Yeni)" },
  { value: "active", label: "Bağlanmamış Telebler)" },
  { value: "closed", label: "Tamamlanmış (Bağlanmış)" },
];

const IncomingFilterModal: React.FC<IncomingFilterModalProps> = ({
  isOpen,
  onClose,
  selectedStatuses,
  onFilterChange,
}) => {
  const toggleStatus = (status: IncomingRequestStatus) => {
    if (selectedStatuses.includes(status)) {
      onFilterChange(selectedStatuses.filter((s) => s !== status));
    } else {
      onFilterChange([...selectedStatuses, status]);
    }
  };

  const selectAll = () => onFilterChange(["pending", "active", "closed"]);
  const clearAll = () => onFilterChange([]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tələbləri Filterlə"
      size="sm"
    >
      <div className={styles.container}>
        <div className={styles.section}>
          <div className={styles.header}>
            <span className={styles.title}>Statusa görə seçin:</span>
            <div className={styles.actions}>
              <button onClick={selectAll} className={styles.textBtn}>Hamısını seç</button>
              <button onClick={clearAll} className={styles.textBtn}>Təmizlə</button>
            </div>
          </div>
          <div className={styles.optionsGrid}>
            {statusOptions.map((opt) => (
              <label key={opt.value} className={styles.optionLabel}>
                <input
                  type="checkbox"
                  checked={selectedStatuses.includes(opt.value)}
                  onChange={() => toggleStatus(opt.value)}
                  className={styles.checkbox}
                />
                <span className={styles.optionText}>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className={styles.footer}>
          <Button variant="primary" onClick={onClose} className={styles.applyBtn}>
            Tətbiq et
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default IncomingFilterModal;
