import React, { useState } from "react";
import { Modal, Button, FormTextarea } from "@/shared/ui";

interface RejectReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  title?: string;
}

export const RejectReasonModal: React.FC<RejectReasonModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "İnkar Etmə Səbəbi",
}) => {
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    if (!reason.trim()) return;
    onConfirm(reason);
    setReason("");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="md">
      <div style={{ padding: "1rem 0" }}>
        <FormTextarea
          label="Səbəb yazın (məcburi)"
          id="reject-reason"
          placeholder="Məsələn: Büdcədən kənar xərc..."
          value={reason}
          onChange={setReason}
          rows={4}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "1rem",
          marginTop: "1rem",
        }}
      >
        <Button variant="secondary" onClick={onClose}>
          Ləğv et
        </Button>
        <Button
          variant="danger"
          onClick={handleSubmit}
          disabled={!reason.trim()}
        >
          Təsdiqlə və İnkar Et
        </Button>
      </div>
    </Modal>
  );
};
