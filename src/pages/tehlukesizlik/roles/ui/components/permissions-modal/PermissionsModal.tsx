import React, { useState, useEffect } from "react";
import { Modal } from "@/shared/ui/modal/base";
import { Button } from "@/shared/ui/button";
import {
  PlusIcon,
  TrashIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import styles from "./PermissionsModal.module.css";
import { FormInput } from "@/shared/ui/input";
import { IconButton } from "@/shared/ui";
import { useChangeRoleClaim } from "@/features/security/roles/hooks";

interface PermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPermissions?: string[];
  onSave: (permissions: string[]) => void;
  noAction?: boolean;
  roleId?: string | null;
}

export const PermissionsModal = ({
  isOpen,
  onClose,
  initialPermissions = [],
  onSave,
  noAction = false,
  roleId = null,
}: PermissionsModalProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [addValue, setAddValue] = useState("");
  const [activeInput, setActiveInput] = useState<"search" | "add" | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [filteredPermissions, setFilteredPermissions] = useState<string[]>([]);
  
  const { mutate: changeRoleClaim, isPending: isChangingRoleClaim } = useChangeRoleClaim();

  useEffect(() => {
    if (isOpen) {
      setPermissions(initialPermissions);
      setFilteredPermissions(initialPermissions);
      setSearchValue("");
      setAddValue("");
      setActiveInput(null);
    }
  }, [isOpen, initialPermissions]);

  useEffect(() => {
    if (!searchValue.trim()) {
      setFilteredPermissions(permissions);
    } else {
      const filtered = permissions.filter((perm) =>
        perm.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredPermissions(filtered);
    }
  }, [searchValue, permissions]);

  const handleAdd = () => {
    if (!addValue.trim()) return;
    
    const newClaim = addValue.trim();
    
    // Eğer zaten varsa ekleme
    if (permissions.includes(newClaim)) {
      setAddValue("");
      setActiveInput(null);
      return;
    }
    
    // Sadece local state'i güncelle (API çağrısı yapma)
    const newPermissions = [...permissions, newClaim];
    setPermissions(newPermissions);
    setFilteredPermissions(newPermissions);
    setAddValue("");
    setActiveInput(null);
  };

  const handleDelete = (indexToDelete: number) => {
    setPermissions(permissions.filter((_, index) => index !== indexToDelete));
  };

  const handleSave = () => {
    if (!roleId) {
      // Eğer roleId yoksa sadece callback çağır
      onSave(permissions);
      onClose();
      return;
    }
    
    // API'ye request gönder
    changeRoleClaim(
      {
        roleId: roleId,
        claimList: permissions,
      },
      {
        onSuccess: () => {
          // Başarılı olduğunda callback çağır ve modal'ı kapat
          onSave(permissions);
          onClose();
        },
        onError: () => {
          // Hata durumunda modal açık kalır
        },
      }
    );
  };

  // Esc düyməsi ilə resetləmək üçün
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setActiveInput(null);
    }
    if (e.key === "Enter" && activeInput === "add") {
      handleAdd();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Səlahiyyətlər"
      size="md"
      className={styles.modal}
    >
      <div className={styles.container}>
        <div className={styles.inputGroup} onKeyDown={handleKeyDown}>
          
          {/* 1. SEARCH BUTTON (Solda) */}
          <IconButton
            icon={MagnifyingGlassIcon}
            variant="default"
            className={styles.iconBtn}
            title="Axtarış"
          />

          {/* 2. SEARCH INPUT WRAPPER */}
          {/* onFocus və onBlur-u bura keçirdik! */}
          <div
            className={`${styles.inputWrapper} ${
              activeInput === "search"
                ? styles.inputExpanded
                : activeInput === "add"
                ? styles.inputCollapsed
                : ""
            }`}
            onFocus={() => setActiveInput("search")}
            onBlur={(e) => {
              // Əgər yeni fokuslanan element bu wrapper-in içində deyilsə, bağla
              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                setActiveInput(null);
              }
            }}
          >
            <FormInput
              label=""
              id="permission-search"
              type="text"
              placeholder="Səlahiyyət axtar..."
              value={searchValue}
              onChange={(val) => setSearchValue(val)}
              className={styles.input}
              // onFocus və onBlur-u burdan sildik, artıq xəta verməyəcək
            />
          </div>

          {/* 3. ADD INPUT WRAPPER */}
          {/* onFocus və onBlur-u bura keçirdik! */}
          <div
            className={`${styles.inputWrapper} ${
              activeInput === "add"
                ? styles.inputExpanded
                : activeInput === "search"
                ? styles.inputCollapsed
                : ""
            }`}
            onFocus={() => setActiveInput("add")}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                setActiveInput(null);
              }
            }}
          >
            <FormInput
              label=""
              id="permission-add"
              type="text"
              placeholder="Yeni səlahiyyət..."
              value={addValue}
              onChange={(val) => setAddValue(val)}
              className={styles.input}
              // onFocus və onBlur-u burdan sildik
            />
          </div>

          {/* 4. ADD BUTTON (Sağda) */}
          <IconButton
            icon={PlusIcon}
            variant="default"
            onClick={handleAdd}
            className={styles.iconBtn}
            title="Əlavə et"
            disabled={!addValue.trim()}
          />
        </div>

        {/* List Container */}
        <div className={styles.listContainer}>
          {filteredPermissions.length === 0 ? (
            <div className={styles.emptyState}>
              {permissions.length === 0
                ? "Hələ heç bir səlahiyyət əlavə edilməyib"
                : "Axtarışa uyğun nəticə tapılmadı"}
            </div>
          ) : (
            filteredPermissions.map((perm) => {
              const originalIndex = permissions.indexOf(perm);
              return (
                <div key={originalIndex} className={styles.listItem}>
                  <span>{perm}</span>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(originalIndex)}
                    title="Sil"
                  >
                    <TrashIcon width={18} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        <div className={styles.footer}>
          <Button
            type="button"
            variant="primary"
            onClick={handleSave}
            className={styles.footerButton}
            disabled={noAction === true || isChangingRoleClaim || !roleId}
          >
            {isChangingRoleClaim ? "Yüklənir..." : "Yadda saxla"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className={styles.footerButton}
          >
            Ləğv et
          </Button>
        </div>
      </div>
    </Modal>
  );
};