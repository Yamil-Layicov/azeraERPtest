import React from "react";
import { Modal, Table } from "@/shared/ui";
import { useInventarColumns } from "../../model/useInventarColumns";
import type { InventoryItem } from "../../model/types";
import styles from "./InventorySummaryModal.module.css";

interface InventorySummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  items: InventoryItem[];
}

const InventorySummaryModal: React.FC<InventorySummaryModalProps> = ({
  isOpen,
  onClose,
  title,
  items,
}) => {
  const columns = useInventarColumns();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="xl"
    >
      <div className={styles.container}>
        <div className={styles.summaryInfo}>
            <span>Cəmi: <strong>{items.length}</strong> məhsul</span>
        </div>
        <div className={styles.tableWrapper}>
            <Table
                columns={columns}
                data={items}
            />
        </div>
      </div>
    </Modal>
  );
};

export default InventorySummaryModal;
