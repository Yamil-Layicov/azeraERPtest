import React, { useState, useEffect } from "react";
import {
  Modal,
  FormInput,
  FormLabel,
  Button,
  ModernDatePicker,
} from "@/shared/ui";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import styles from "./NotificationModal.module.css"; // Lazımi stilləri köçür
import type { Notification } from "@/pages/settings/notifications/models";

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  editingNotification: Notification | null;
  parseDate: (dateStr: string | undefined) => Date | null;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingNotification,
  parseDate,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Modal hər dəfə açılanda və ya redaktə datası dəyişəndə state-ləri yenilə
  useEffect(() => {
    if (isOpen) {
      if (editingNotification) {
        setTitle(editingNotification.title);
        setDescription(editingNotification.description);
        setStartDate(parseDate(editingNotification.startDate || editingNotification.date));
        setEndDate(parseDate(editingNotification.endDate || editingNotification.date));
      } else {
        setTitle("");
        setDescription("");
        setStartDate(null);
        setEndDate(null);
      }
    }
  }, [isOpen, editingNotification, parseDate]);

  const handleLocalSave = () => {
    onSave({ title, description, startDate, endDate });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingNotification ? "Yeniliyi Redaktə Et" : "Yeni Yenilik Yarat"}
      size="lg"
      className={styles.modal}
    >
      <div className={styles.formGroup}>
        <FormInput
          type="text"
          id="notif-title"
          label="Başlıq"
          value={title}
          onChange={setTitle}
          required
          placeholder="Yenilik başlığını daxil edin"
        />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <ModernDatePicker
            id="notif-start-date"
            value={startDate}
            onChange={setStartDate}
            label="Başlama Tarixi"
            required
          />
          <ModernDatePicker
            id="notif-end-date"
            value={endDate}
            onChange={setEndDate}
            label="Bitmə Tarixi"
            required
          />
        </div>

        <div>
          <FormLabel label="Təsvir" required />
          <div className={styles.quillWrapper}>
            <ReactQuill
              theme="snow"
              value={description}
              onChange={setDescription}
              placeholder="Yenilik haqqında ətraflı məlumat yazın..."
              modules={{
                toolbar: [
                  [{ header: [1, 2, false] }],
                  ["bold", "italic", "underline", "strike"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["link", "clean"],
                ],
              }}
            />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
          <Button variant="secondary" onClick={onClose}>
            İmtina
          </Button>
          <Button
            variant="primary"
            onClick={handleLocalSave}
            disabled={!title || !description || !startDate || !endDate}
          >
            {editingNotification ? "Yadda Saxla" : "Yarat"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default NotificationModal;