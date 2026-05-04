import React from "react";
import styles from "./PendingApprovalDetailModal.module.css";
import { Modal } from "@/shared/ui/modal/base";
import { Button, StatusBadge } from "@/shared/ui";
import {
  useGetCashOperationById,
  useApproveCashOperation,
  useReverseCashOperation,
  cashOperationsService,
} from "@/features/maliyye/cash-operations";
import type { PendingApprovalEntry } from "../../model/types";
import toast from "react-hot-toast";

interface PendingApprovalDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PendingApprovalEntry | null;
}

const PendingApprovalDetailModal: React.FC<PendingApprovalDetailModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  if (!isOpen || !data) return null;

  const { data: detailResponse, isFetching } = useGetCashOperationById(
    String(data.id),
  );
  const detailData = detailResponse?.result;
  const { mutate: approveMutation, isPending: isApproving } =
    useApproveCashOperation();
  const { mutate: reverseMutation, isPending: isReversing } =
    useReverseCashOperation();

  const getInitials = (name?: string) => {
    if (!name) return "X";
    return name.substring(0, 2).toUpperCase();
  };

  const handleDownload = async (docId: string) => {
    try {
      const blob = await cashOperationsService.downloadFile(docId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `document_${docId}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast.error("Faylı yükləmək mümkün olmadı");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Təsdiq Gözləyən Əməliyyat"
      size="lg"
      className={styles.modalWidth}
    >
      <div className={styles.container}>
        {isFetching ? (
          <div style={{ textAlign: "center", padding: "4rem" }}>
            Yüklənir...
          </div>
        ) : detailData ? (
          <>
            <div className={styles.headerRow}>
              <StatusBadge
                label={
                  detailData.status === 1
                    ? "Təsdiq gözləyir"
                    : detailData.status === 2
                      ? "Yaradıldı"
                      : detailData.status === 3
                        ? "Təsdiq olundu"
                        : "Digər"
                }
                variant={
                  detailData.status === 1
                    ? "warning"
                    : detailData.status === 3
                      ? "success"
                      : "neutral"
                }
                className={styles.statusBadge}
              />
            </div>

            {/* QUICK STATS */}
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Məbləğ</span>
                <span className={styles.statValueAmount}>
                  {detailData.amount}{" "}
                  {detailData.currencyType === 1
                    ? "AZN"
                    : detailData.currencyType === 2
                      ? "USD"
                      : "EUR"}
                </span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Növ</span>
                <span className={styles.statValue}>
                  {detailData.cashOperationType === 1
                    ? "Mədaxil"
                    : detailData.cashOperationType === 2
                      ? "Məxaric"
                      : "Köçürmə"}
                </span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Tarix</span>
                <span className={styles.statValue}>
                  {detailData.createdDate
                    ? new Date(detailData.createdDate).toLocaleDateString(
                        "az-AZ",
                      )
                    : "-"}
                </span>
              </div>
            </div>

            {/* DETAILED INFORMATION */}
            <div className={styles.detailsSection}>
              <h4 className={styles.sectionTitle}>Əsas Məlumatlar</h4>
              <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Təyinat</span>
                  <span className={styles.detailValue}>
                    {detailData.cashPurposeName || "-"}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Ödəyən/Alan şəxs</span>
                  <span className={styles.detailValue}>
                    {detailData.payerOrRecipientName || "-"}
                  </span>
                </div>

                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Mənbədən (Kassa)</span>
                  <span className={styles.detailValue}>
                    {detailData.fromCashBoxName || "-"}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Mənbəyə (Kassa)</span>
                  <span className={styles.detailValue}>
                    {detailData.toCashBoxName || "-"}
                  </span>
                </div>

                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Şirkət</span>
                  <span className={styles.detailValue}>
                    {detailData.rootCompanyName || "-"}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Kontragent</span>
                  <span className={styles.detailValue}>
                    {detailData.counterPartyName || "-"}
                  </span>
                </div>

                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Xəzinədar</span>
                  <span className={styles.detailValue}>
                    {detailData.treasurerId || "-"}
                  </span>
                </div>
              </div>
            </div>

            {/* NOTES */}
            {detailData.note && (
              <div className={styles.noteBox}>
                <span
                  style={{
                    fontWeight: 600,
                    display: "block",
                    marginBottom: "0.25rem",
                  }}
                >
                  Qeyd:
                </span>
                {detailData.note}
              </div>
            )}

            {/* APPROVERS: SOURCE */}
            {detailData.fromCashBoxApprovers &&
              detailData.fromCashBoxApprovers.length > 0 && (
                <div>
                  <h4 className={styles.sectionTitle}>
                    Təsdiqləyənlər (Mənbə)
                  </h4>
                  <div className={styles.approversGrid}>
                    {detailData.fromCashBoxApprovers.map(
                      (approver, index: number) => (
                        <div key={index} className={styles.approverCard}>
                          <div className={styles.approverAvatar}>
                            {getInitials(approver.nameId)}
                          </div>
                          <div className={styles.approverInfo}>
                            <span className={styles.approverName}>
                              {approver.nameId}
                            </span>
                            <span className={styles.approverLimit}>
                              Limit: {approver.minAmount} - {approver.maxAmount}
                            </span>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

            {/* APPROVERS: TARGET */}
            {detailData.toCashBoxApprovers &&
              detailData.toCashBoxApprovers.length > 0 && (
                <div>
                  <h4 className={styles.sectionTitle}>
                    Təsdiqləyənlər (Hədəf)
                  </h4>
                  <div className={styles.approversGrid}>
                    {detailData.toCashBoxApprovers.map(
                      (approver, index: number) => (
                        <div key={index} className={styles.approverCard}>
                          <div className={styles.approverAvatar}>
                            {getInitials(approver.nameId)}
                          </div>
                          <div className={styles.approverInfo}>
                            <span className={styles.approverName}>
                              {approver.nameId}
                            </span>
                            <span className={styles.approverLimit}>
                              Limit: {approver.minAmount} - {approver.maxAmount}
                            </span>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

            {detailData.attachments &&
              detailData.attachments.length > 0 && (
                <div>
                  <h4 className={styles.sectionTitle}>Əlavə Sənədlər</h4>
                  <div className={styles.documentsGrid}>
                    {detailData.attachments.map(
                      (attachment: any, index: number) => {
                        const docId = typeof attachment === "string" ? attachment : attachment?.id;
                        const fileName = typeof attachment === "string" ? `Sənəd ${index + 1}` : attachment?.fileName || `Sənəd ${index + 1}`;
                        
                        return (
                          <div
                            key={docId || index}
                            className={styles.documentCard}
                            onClick={() => handleDownload(docId)}
                            style={{ cursor: "pointer" }}
                          >
                            <span className={styles.docIcon}>📄</span>
                            <span className={styles.docName}>
                              {fileName}
                            </span>
                          </div>
                        );
                      },
                    )}
                  </div>
                </div>
              )}
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "4rem" }}>
            Məlumat tapılmadı
          </div>
        )}

        <div className={styles.footer}>
          <Button
            type="button"
            variant="default"
            onClick={onClose}
            style={{ padding: "0.4rem 0.8rem", fontSize: "0.75rem" }}
          >
            İmtina et
          </Button>
          <Button
            type="button"
            variant="danger-ghost"
            disabled={isReversing || isApproving}
            style={{ padding: "0.4rem 0.8rem", fontSize: "0.75rem" }}
            onClick={() => {
              reverseMutation(
                { cashOperationId: String(data.id) },
                {
                  onSuccess: () => {
                    onClose();
                  },
                },
              );
            }}
          >
            {isReversing ? "Geri qaytarılır..." : "Geri qaytar"}
          </Button>
          <Button
            type="button"
            variant="primary"
            disabled={isApproving || isReversing}
            style={{ padding: "0.4rem 0.8rem", fontSize: "0.75rem" }}
            onClick={() => {
              approveMutation(
                { cashOperationId: String(data.id), approverId: null },
                {
                  onSuccess: () => {
                    onClose();
                  },
                },
              );
            }}
          >
            {isApproving ? "Təsdiqlənir..." : "Təsdiq et"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PendingApprovalDetailModal;
