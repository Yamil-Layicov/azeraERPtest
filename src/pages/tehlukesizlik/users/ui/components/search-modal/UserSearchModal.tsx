import React, { useState, useEffect } from "react";
import { Modal } from "@/shared/ui/modal/base";
import { Button, CustomSelect } from "@/shared/ui"; 
import FormInput from "@/shared/ui/input/FormInput";
import styles from "./UserSearchModal.module.css";
import type { Option } from "@/shared/types";

interface UserSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (filters: { username: string; status: string }) => void;
  onClear?: () => void;
  initialData?: {
    username: string;
    status: string;
  };
  onChange?: (filters: { username: string; status: string }) => void;
}

// "Bütün statuslar" seçimini buradan sildik
const STATUS_OPTIONS: Option[] = [
  { id: "active", fullName: "Aktiv", role: "" },
  { id: "inactive", fullName: "Deaktiv", role: "" },
];

export const UserSearchModal: React.FC<UserSearchModalProps> = ({
  isOpen,
  onClose,
  onSearch,
  onClear,
  initialData,
  onChange,
}) => {
  const [username, setUsername] = useState(initialData?.username || "");
  const [selectedStatus, setSelectedStatus] = useState<Option | null>(
    initialData?.status 
      ? STATUS_OPTIONS.find(opt => opt.id === initialData.status) || null
      : null
  );

  // Initial data değiştiğinde form'u güncelle (sadece modal açıldığında)
  useEffect(() => {
    if (isOpen && initialData) {
      setUsername(initialData.username || "");
      setSelectedStatus(
        initialData.status 
          ? STATUS_OPTIONS.find(opt => opt.id === initialData.status) || null
          : null
      );
    }
  }, [isOpen, initialData?.username, initialData?.status]);

  // Form değişikliklerini parent'a bildir (sadece kullanıcı etkileşiminde)
  const handleUsernameChange = (val: string) => {
    setUsername(val);
    if (onChange) {
      onChange({
        username: val,
        status: selectedStatus?.id?.toString() || "",
      });
    }
  };

  const handleStatusChange = (val: Option | null) => {
    setSelectedStatus(val);
    if (onChange) {
      onChange({
        username,
        status: val?.id?.toString() || "",
      });
    }
  };

  const handleSearch = () => {
    onSearch({ 
        username, 
        status: selectedStatus?.id?.toString() || "" 
    });
    onClose();
  };

  const handleClear = () => {
    if (onClear) {
      onClear();
    }
    // Form'u da təmizlə
    setUsername("");
    setSelectedStatus(null);
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Axtarış" 
      size="sm" // Kiçik ölçü (ResetPasswordModal kimi)
    >
      <div className={styles.container}>
        
        {/* İstifadəçi Adı */}
        <div className={styles.inputWrapper}>
          <FormInput
            label="İstifadəçi adı"
            id="username"
            type="text"
            value={username}
            onChange={handleUsernameChange}
            placeholder="Daxil edin..."
          />
        </div>

        {/* Status */}
        <div className={styles.inputWrapper}>
            <label className={styles.label}>Status</label>
            <CustomSelect
                options={STATUS_OPTIONS}
                value={selectedStatus}
                onChange={handleStatusChange}
                defaultText="Status seçin" 
                variant="form"
                isSearchable={false}
                isClearable={true} 
            />
        </div>
      </div>

      <div className={styles.footer}>
        <Button type="button" variant="primary" onClick={handleSearch} className={styles.modalBtn}>
          Axtar
        </Button>
        <Button type="button" variant="secondary" onClick={handleClear} className={styles.modalBtn}>
          Təmizlə
        </Button>
      </div>
    </Modal>
  );
};