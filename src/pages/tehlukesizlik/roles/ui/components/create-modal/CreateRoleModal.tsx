import { useState, useEffect } from "react";
import {  FormInput, FormTextarea, Button } from "@/shared/ui";
import { Modal } from "@/shared/ui/modal/base";
import styles from "./CreateRoleModal.module.css";

interface CreateRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; description: string }) => void;
  isLoading?: boolean;
}

export const CreateRoleModal = ({ isOpen, onClose, onSave, isLoading = false }: CreateRoleModalProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setName("");
      setDescription("");
    }
  }, [isOpen]);

  const handleSave = () => {
    if (!name || isLoading) return;
    onSave({ name, description });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Yeni Rol Yarat"
      size="sm"
      className={styles.modal}
    >
      <div className={styles.formContainer}>
        <FormInput
          label="Rolun Adı"
          id="create-role-name"
          type="text"
          placeholder="Məs: Kadrlar üzrə mütəxəssis"
          value={name}
          onChange={(val) => setName(val)}
          required
          autoComplete="off"
        />

        <FormTextarea
          label="Açıqlama"
          id="create-role-description"
          placeholder="Rol haqqında qısa məlumat..."
          rows={4}
          value={description}
          onChange={(value) => setDescription(value)}
        />
      </div>

      <div className={styles.footer}>
      <Button 
          type="button"
          variant="primary" 
          onClick={handleSave} 
          className={styles.footerButton}
          disabled={isLoading || !name.trim()}
        >
          {isLoading ? "Yüklənir..." : "Yadda saxla"}
        </Button>
        <Button 
          type="button" 
          variant="secondary" 
          onClick={onClose} 
          className={styles.footerButton}
          disabled={isLoading}
        >
          Ləğv et
        </Button>
      </div>
    </Modal>
  );
};