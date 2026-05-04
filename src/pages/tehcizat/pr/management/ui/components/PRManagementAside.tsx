import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { FormInput, Button } from "@/shared/ui";
import styles from "./PRManagementAside.module.css";
import type { PurchaseRequest } from "../../../list/model/types";

interface PRManagementAsideProps {
  pr: PurchaseRequest | null;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  isLoading?: boolean;
}

export const PRManagementAside: React.FC<PRManagementAsideProps> = ({
  pr,
  onClose,
  onApprove,
  onReject,
  isLoading = false,
}) => {
  if (!pr) return null;

  return (
    <div className={styles.panelContainer}>
      <div className={styles.panelHeader}>
        <h3 className={styles.panelTitle}>Tələb Məlumatları: {pr.prNo}</h3>
        <button onClick={onClose} className={styles.closeBtn} title="Bağla">
          <XMarkIcon width={20} />
        </button>
      </div>

      <div className={styles.panelBody}>
        <div className={styles.formWrapper}>
          <FormInput
            label="İstəyən Şəxs"
            placeholder="İstəyən Şəxs"
            type="text"
            id="requester"
            value={pr.requester}
            onChange={() => {}}
            disabled
          />
          <FormInput
            label="Şöbə / Departament"
            placeholder="Şöbə / Departament"
            type="text"
            id="department"
            value={pr.department}
            onChange={() => {}}
            disabled
          />
          <FormInput
            label="Yaranma Tarixi"
            id="createdDate"
            type="number"
            placeholder="Yaranma Tarixi"
            value={new Date(pr.createdDate).toLocaleDateString("az-AZ")}
            onChange={() => {}}
            disabled
          />

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Məqsəd və Əsaslandırma</h4>
            <div className={styles.descriptionText}>{pr.description}</div>
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Məhsullar və Xidmətlər</h4>
            <table className={styles.simpleTable}>
              <thead>
                <tr>
                  <th>Ad</th>
                  <th>Say</th>
                  <th>Qiymət</th>
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
                <tr className={styles.totalRow}>
                  <td colSpan={3}>Yekun Məbləğ:</td>
                  <td>{pr.totalAmount.toLocaleString()} AZN</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      <div className={styles.panelFooter}>
        {pr.status === "pending" && (
          <div className={styles.footerButtons}>
            <Button
              variant="danger"
              onClick={() => onReject(pr.id)}
              disabled={isLoading}
              className={styles.footerBtn}
            >
              İnkar et
            </Button>
            <Button
              variant="primary"
              onClick={() => onApprove(pr.id)}
              disabled={isLoading}
              className={styles.footerBtn}
            >
              Təsdiqlə
            </Button>
          </div>
        )}
        {pr.status !== "pending" && (
          <Button
            variant="secondary"
            onClick={onClose}
            className={styles.footerBtn}
          >
            Bağla
          </Button>
        )}
      </div>
    </div>
  );
};
