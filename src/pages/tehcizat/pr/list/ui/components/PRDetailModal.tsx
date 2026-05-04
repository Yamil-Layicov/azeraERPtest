import React from "react";
import styles from "./PRDetailModal.module.css";
import { Modal, Button } from "@/shared/ui";
import type { PurchaseRequest, PRStatus } from "../../model/types";

interface PRDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  pr: PurchaseRequest | null;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

const PRDetailModal: React.FC<PRDetailModalProps> = ({
  isOpen,
  onClose,
  pr,
  onApprove,
  onReject,
}) => {
  if (!pr) return null;

  const statusMap: Record<PRStatus, { label: string }> = {
    draft: { label: "Draft" },
    pending: { label: "Gözləyir" },
    approved: { label: "Təsdiqləndi" },
    rejected: { label: "Rədd edildi" },
  };

  const config = statusMap[pr.status] || {
    label: pr.status,
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Satınalma Tələbi: ${pr.prNo}`}
      size="lg"
    >
      <div className={styles.container}>
        <div className={styles.summaryGrid}>
          <div className={styles.detailField}>
            <label>İstəyən Şəxs</label>
            <span>{pr.requester}</span>
          </div>
          <div className={styles.detailField}>
            <label>Şöbə / Departament</label>
            <span>{pr.department}</span>
          </div>
          <div className={styles.detailField}>
            <label>Yaranma Tarixi</label>
            <span>{new Date(pr.createdDate).toLocaleDateString("az-AZ")}</span>
          </div>
          <div className={styles.detailField}>
            <label>Status</label>
            <span className={styles.statusText}>{config.label}</span>
          </div>
        </div>

        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Məqsəd və Əsaslandırma</h4>
          <div className={styles.descriptionText}>{pr.description}</div>
        </div>

        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Məhsullar və Xidmətlər</h4>
          <table className={styles.simpleTable}>
            <thead>
              <tr>
                <th>Məhsulun adı</th>
                <th>Miqdar</th>
                <th>Vahid Qiymət</th>
                <th>Cəmi</th>
              </tr>
            </thead>
            <tbody>
              {pr.products.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.quantity}</td>
                  <td>{p.value.toLocaleString()} AZN</td>
                  <td>{(p.quantity * p.value).toLocaleString()} AZN</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3}>Yekun Məbləğ:</td>
                <td>{pr.totalAmount.toLocaleString()} AZN</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {pr.files && pr.files.length > 0 && (
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Sənədlər</h4>
            <div className={styles.fileGrid}>
              {pr.files.map((file, index) => (
                <div key={index} className={styles.fileLink}>
                  <span>{file}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={styles.actions}>
          <Button variant="outline" onClick={onClose}>
            Bağla
          </Button>
          {pr.status === "pending" && onReject && onApprove && (
            <div className={styles.approvalButtons}>
              <Button variant="danger" onClick={() => onReject(pr.id)}>
                İnkar et
              </Button>
              <Button variant="primary" onClick={() => onApprove(pr.id)}>
                Təsdiqlə
              </Button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default PRDetailModal;
