import { useState, useEffect } from "react";
import { XMarkIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import { FormInput, FormTextarea, Button } from "@/shared/ui";
import styles from "./RolesPanel.module.css";
import type { Role } from "../../../model/types";
import { PermissionsModal } from "../permissions-modal/PermissionsModal";

interface RolesPanelProps {
  mode: "create" | "edit" | "detail" | null;
  selectedRole: Role | null;
  roleDetail?: {
    id: string;
    name: string;
    description: string;
    noAction: boolean;
    claims: unknown[];
  } | null;
  isLoadingRoleDetail?: boolean;
  onClose: () => void;
  onSave?: (roleData: {
    id: string;
    name: string;
    description: string;
  }) => void;
  isLoading?: boolean;
  title?: string;
  isModal?: boolean;
}

export const RolesPanel = ({
  mode,
  selectedRole,
  roleDetail,
  isLoadingRoleDetail = false,
  onClose,
  onSave,
  isLoading = false,
  title,
  isModal = false,
}: RolesPanelProps) => {
  // --- STATES ---
  const [isPermModalOpen, setIsPermModalOpen] = useState(false);

  // Form sahələri üçün lokal state-lər (Redaktə edilə bilməsi üçün)
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [currentPermissions, setCurrentPermissions] = useState<string[]>([]);

  useEffect(() => {
    if (mode === "detail" && roleDetail) {
      // API'den gelen veriyi kullan
      setName(roleDetail.name || "");
      setDescription(roleDetail.description || "");
      // claims array'ini permissions olarak set et
      if (roleDetail.claims && Array.isArray(roleDetail.claims)) {
        setCurrentPermissions(roleDetail.claims.map((claim) => String(claim)));
      } else {
        setCurrentPermissions([]);
      }
    } else if (selectedRole) {
      // Tablodan gelen veriyi kullan (edit mode için)
      setName(selectedRole.name || "");
      setDescription(selectedRole.description || "");
      setCurrentPermissions([]);
    } else {
      setName("");
      setDescription("");
      setCurrentPermissions([]);
    }
  }, [selectedRole, roleDetail, mode]);

  const handlePermissionsSave = (newPermissions: string[]) => {
    setCurrentPermissions(newPermissions);
  };

  const handleSave = () => {
    if (!name.trim() || isLoading) return;

    // Edit mode için
    if (mode === "edit" && selectedRole && onSave) {
      onSave({
        id: selectedRole.id,
        name: name.trim(),
        description: description.trim(),
      });
    }

    // Detail mode için (roleDetail varsa)
    if (mode === "detail" && roleDetail && onSave) {
      onSave({
        id: roleDetail.id,
        name: name.trim(),
        description: description.trim(),
      });
    }
  };

  return (
    <>
      <div className={styles.panelContainer}>
        {/* --- HEADER --- Yalnız title varsa göstər (panel olduqda) */}
        {title && (
          <div className={styles.panelHeader}>
            <h3 className={styles.panelTitle}>{title}</h3>
            <button onClick={onClose} className={styles.closeBtn} title="Bağla">
              <XMarkIcon width={20} />
            </button>
          </div>
        )}

        {/* --- BODY --- */}
        <div className={`${styles.panelBody} ${isModal ? styles.noPadding : ''}`}>
          {isLoadingRoleDetail ? (
            <div style={{ padding: "2rem", textAlign: "center" }}>
              <p>Yüklənir...</p>
            </div>
          ) : (
            <div className={styles.formWrapper}>
              {/* 1. Rolun Adı */}
              <FormInput
                label="Rolun Adı"
                type="text"
                id="name"
                placeholder="Məs: HR Menecer"
                value={name}
                onChange={(val) => setName(val)}
              />

              {/* 2. Təsvir */}
              <FormTextarea
                label="Təsvir"
                id="description"
                placeholder="Rol haqqında qısa məlumat..."
                value={description}
                onChange={(val) => setDescription(val)}
                rows={4}
              />

              <div className={styles.permissionsRow}>
                <Button
                  type="button"
                  variant="secondary"
                  className={styles.permBtn}
                  onClick={() => setIsPermModalOpen(true)}
                >
                  <ShieldCheckIcon width={18} />
                  Səlahiyyətlər
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className={styles.panelFooter}>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className={styles.footerBtn}
          >
            Ləğv et
          </Button>

          <Button
            variant="primary"
            onClick={handleSave}
            className={styles.footerBtn}
            type="button"
            disabled={
              isLoading || !name.trim() || roleDetail?.noAction === true
            }
          >
            {isLoading ? "Yüklənir..." : "Yadda saxla"}
          </Button>
        </div>
      </div>

      <PermissionsModal
        isOpen={isPermModalOpen}
        onClose={() => setIsPermModalOpen(false)}
        initialPermissions={currentPermissions}
        onSave={handlePermissionsSave}
        noAction={roleDetail?.noAction === true}
        roleId={roleDetail?.id || selectedRole?.id || null}
      />
    </>
  );
};
