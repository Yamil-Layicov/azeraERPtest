import React from "react";
import styles from "./TransactionDetailModal.module.css";
import { Modal } from "@/shared/ui/modal/base";
import { Button, StatusBadge } from "@/shared/ui";
import {
  useGetCashOperationById,
  useTreasurerApproveCashOperation,
  cashOperationsService,
} from "@/features/maliyye/cash-operations";
import type { Transaction } from "../../model/types";
import toast from "react-hot-toast";
import { getBackendErrorMessage } from "@/shared/api/httpClient";

interface TransactionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: Transaction | null;
  onApproveSuccess?: () => void;
}

const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  isOpen,
  onClose,
  data,
  onApproveSuccess,
}) => {
  const id = data?.id ? String(data.id) : undefined;
  const { data: detailResponse, isFetching } = useGetCashOperationById(id);
  const detailData = detailResponse?.result;
  const { mutate: treasurerApproveMutation, isPending: isApproving } =
    useTreasurerApproveCashOperation();
  if (!isOpen || !data) return null;

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
      toast.error(
        getBackendErrorMessage(error as any) ||
          "Sənəd yüklənərkən xəta baş verdi",
      );
    }
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Ətraflı"
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
                    ? "Gözləmədə"
                    : detailData.status === 2
                      ? "Təsdiqlənib"
                      : "İmtina"
                }
                variant={
                  detailData.status === 1
                    ? "warning"
                    : detailData.status === 2
                      ? "success"
                      : "danger"
                }
              />
            </div>
            {/* QUICK STATS */}
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Məbləğ</span>
                <span className={styles.statValueAmount}>
                  {detailData.amount || data.amount}{" "}
                  {detailData.currencyType === 1
                    ? "AZN"
                    : detailData.currencyType === 2
                      ? "USD"
                      : detailData.currencyType === 3
                        ? "EUR"
                        : ""}
                </span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Növ</span>
                <span className={styles.statValue}>
                  {detailData.cashOperationType === 1
                    ? "Mədaxil"
                    : detailData.cashOperationType === 2
                      ? "Məxaric"
                      : detailData.cashOperationType === 3
                        ? "Transfer"
                        : data.type}
                </span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Tarix</span>
                <span className={styles.statValue}>
                  {detailData.createdDate
                    ? new Date(detailData.createdDate).toLocaleDateString(
                        "az-AZ",
                      )
                    : data.createdAt?.split(" ")[0] || "-"}
                </span>
              </div>
            </div>

            {/* DETAILED INFORMATION */}
            <div className={styles.detailsSection}>
              <h4 className={styles.sectionTitle}>Əsas Məlumatlar</h4>
              <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Şirkət</span>
                  <span className={styles.detailValue}>
                    {detailData?.rootCompanyName || "-"}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Mənbə</span>
                  <span className={styles.detailValue}>
                    {detailData?.fromCashBoxName ||
                      detailData?.toCashBoxName ||
                      "-"}
                  </span>
                </div>

                {detailData?.cashOperationType === 3 && (
                  <>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>
                        Mənbədən (Kassa)
                      </span>
                      <span className={styles.detailValue}>
                        {detailData?.fromCashBoxName || "-"}
                      </span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>
                        Mənbəyə (Kassa)
                      </span>
                      <span className={styles.detailValue}>
                        {detailData?.toCashBoxName || "-"}
                      </span>
                    </div>
                  </>
                )}

                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Kontragent</span>
                  <span className={styles.detailValue}>
                    {detailData?.counterPartyName || "-"}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Təyinat</span>
                  <span className={styles.detailValue}>
                    {detailData?.cashPurposeName || "-"}
                  </span>
                </div>

                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Pulu alan/verən</span>
                  <span className={styles.detailValue}>
                    {detailData?.payerOrRecipientName || "-"}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Daxilolma Tarixi</span>
                  <span className={styles.detailValue}>
                    {detailData?.createdDate?.split("T").join(" ") || "-"}
                  </span>
                </div>

                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Daxil edən</span>
                  <span className={styles.detailValue}>
                    {data.createdBy || "-"}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Təsdiq tarixi</span>
                  <span className={styles.detailValue}>
                    {data.approveTime || "-"}
                  </span>
                </div>

                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Təsdiq edən</span>
                  <span className={styles.detailValue}>
                    {detailData?.treasurerId
                      ? `Xəzinədar: ${detailData.treasurerId}`
                      : "-"}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>
                    Təsdiq tarixi (Xəzinədar)
                  </span>
                  <span className={styles.detailValue}>
                    {data.treasurerApproveTime || "-"}
                  </span>
                </div>

                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>
                    Təsdiq edən (Xəzinədar)
                  </span>
                  <span className={styles.detailValue}>
                    {detailData?.treasurerId || "-"}
                  </span>
                </div>
              </div>
            </div>

            {/* NOTES */}
            {((detailData as any)?.note || data.notes) && (
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
                {(detailData as any)?.note || data.notes}
              </div>
            )}

            {/* REFERENCE */}
            {data.reference && (
              <div className={styles.noteBox}>
                <span
                  style={{
                    fontWeight: 600,
                    display: "block",
                    marginBottom: "0.25rem",
                  }}
                >
                  İstinad:
                </span>
                {data.reference}
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

            {((detailData?.attachments &&
              detailData.attachments.length > 0) ||
              (data?.document &&
                (Array.isArray(data.document)
                  ? data.document.length > 0
                  : true))) && (
              <div>
                <h4 className={styles.sectionTitle}>Əlavə Sənədlər</h4>
                <div className={styles.documentsGrid}>
                  {detailData?.attachments?.length > 0
                    ? detailData.attachments.map(
                        (attachment: any, index: number) => {
                          const docId =
                            typeof attachment === "string"
                              ? attachment
                              : attachment?.id;
                          const fileName =
                            typeof attachment === "string"
                              ? `Sənəd ${index + 1}`
                              : attachment?.fileName || `Sənəd ${index + 1}`;

                          return (
                            <div
                              key={docId || index}
                              className={styles.documentCard}
                              onClick={() => handleDownload(docId)}
                            >
                              <span className={styles.docIcon}>📄</span>
                              <span className={styles.docName}>{fileName}</span>
                            </div>
                          );
                        },
                      )
                    : (Array.isArray(data?.document)
                        ? data.document
                        : [data?.document]
                      )
                        .filter((d): d is string => typeof d === "string")
                        .map((docId: string, index: number) => (
                          <div
                            key={docId || `doc-${index}`}
                            className={styles.documentCard}
                            onClick={() => handleDownload(docId)}
                          >
                            <span className={styles.docIcon}>📄</span>
                            <span className={styles.docName}>
                              Sənəd {index + 1} ({docId})
                            </span>
                          </div>
                        ))}
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
            variant="primary"
            disabled={isApproving || detailData?.status !== 3}
            onClick={() => {
              if (id) {
                treasurerApproveMutation(
                  { cashOperationId: id, treasurerId: null },
                  {
                    onSuccess: () => {
                      onClose();
                      onApproveSuccess?.();
                    },
                  },
                );
              }
            }}
            className={styles.approveButton}
          >
            {isApproving ? "Təsdiqlənir..." : "Xəzinədarın təsdiqi"}
          </Button>
          <Button
            type="button"
            variant="default"
            onClick={onClose}
            className={styles.closeButton}
          >
            Bağla
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default TransactionDetailModal;
