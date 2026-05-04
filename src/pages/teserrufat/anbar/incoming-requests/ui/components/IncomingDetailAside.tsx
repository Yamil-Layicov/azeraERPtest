import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { FormInput, Button } from "@/shared/ui";
import styles from "./IncomingDetailAside.module.css";
import type { IncomingRequest } from "../../model/types";

interface IncomingDetailAsideProps {
  request: IncomingRequest | null;
  onClose: () => void;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  isLoading?: boolean;
}

export const IncomingDetailAside: React.FC<IncomingDetailAsideProps> = ({
  request,
  onClose,
  onAccept,
  onReject,
  isLoading = false,
}) => {
  if (!request) return null;

  return (
    <div className={styles.panelContainer}>
      <div className={styles.panelHeader}>
        <h3 className={styles.panelTitle}>Tələb: {request.prNo}</h3>
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
            value={request.requester}
            onChange={() => {}}
            disabled
          />
          <FormInput
            label="Şöbə / Departament"
            placeholder="Şöbə / Departament"
            type="text"
            id="department"
            value={request.department}
            onChange={() => {}}
            disabled
          />
          <FormInput
            label="Təsdiq Tarixi"
            id="approvedDate"
            type="text"
            placeholder="Təsdiq Tarixi"
            value={new Date(request.approvedDate).toLocaleDateString("az-AZ")}
            onChange={() => {}}
            disabled
          />

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Məqsəd və Əsaslandırma</h4>
            <div className={styles.descriptionText}>{request.description}</div>
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Məhsullar — Stok Vəziyyəti</h4>
            <table className={styles.simpleTable}>
              <thead>
                <tr>
                  <th>Məhsul Adı</th>
                  <th>İstənilən</th>
                  <th>Anbarda Olan</th>
                  <th>Fərq</th>
                </tr>
              </thead>
              <tbody>
                {request.products.map((p) => {
                  const diff = p.inStockQty - p.requestedQty;
                  const isLow = diff < 0;
                  return (
                    <tr key={p.id}>
                      <td>{p.name}</td>
                      <td>{p.requestedQty}</td>
                      <td
                        className={
                          isLow ? styles.lowStock : styles.sufficientStock
                        }
                      >
                        {p.inStockQty}
                      </td>
                      <td
                        className={
                          isLow ? styles.lowStock : styles.sufficientStock
                        }
                      >
                        {isLow ? diff : `+${diff}`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {request.note && (
            <div className={styles.section}>
              <h4 className={styles.sectionTitle}>Qeyd</h4>
              <div className={styles.noteBox}>{request.note}</div>
            </div>
          )}
        </div>
      </div>

      <div className={styles.panelFooter}>
        {request.status === "pending" && (
          <div className={styles.footerButtons}>
            <Button
              variant="danger"
              onClick={() => onReject(request.id)}
              disabled={isLoading}
              className={styles.footerBtn}
            >
              Rədd et
            </Button>
            <Button
              variant="primary"
              onClick={() => onAccept(request.id)}
              disabled={isLoading}
              className={styles.footerBtn}
            >
              Qəbul et
            </Button>
          </div>
        )}
        {request.status !== "pending" && (
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
