import React from "react";
import { Button } from "@/shared/ui";
import { PermissionGuard } from "@/features/auth/components/PermissionGuard";
import type { DepartmentNode } from "../../../../model/types";
import styles from "../DepartmentForm.module.css";

interface DepartmentFormFooterProps {
  isLoading: boolean;
  initialData?: DepartmentNode | null;
  onSave: () => void;
  onCancel: () => void;
  onDelete?: (id: string) => void;
  cancelButtonText?: string;
  savePermission?: string;
  deletePermission?: string;
}

export const DepartmentFormFooter: React.FC<DepartmentFormFooterProps> = ({
  isLoading,
  initialData,
  onSave,
  onCancel,
  onDelete,
  cancelButtonText,
  savePermission,
  deletePermission,
}) => {
  const saveButton = (
    <Button
      type="button"
      variant="primary"
      onClick={onSave}
      className={styles.formBtn}
      disabled={isLoading}
    >
      {isLoading ? "Yüklənir..." : "Yadda saxla"}
    </Button>
  );

  const deleteButton =
    initialData && onDelete ? (
      <Button
        type="button"
        variant="secondary"
        className={`${styles.formBtn} ${styles.deleteBtn}`}
        onClick={() => onDelete(initialData.id)}
        disabled={isLoading}
      >
        Sil
      </Button>
    ) : null;

  return (
    <div className={styles.footer}>
      <div className={styles.deleteBtnWrapper}>
      {deletePermission && deleteButton ? (
        <PermissionGuard permission={deletePermission}>{deleteButton}</PermissionGuard>
      ) : (
        deleteButton
      )}
      </div>
      <div className={styles.saveBtnWrapper}>
      {savePermission ? (
        <PermissionGuard permission={savePermission}>{saveButton}</PermissionGuard>
      ) : (
        saveButton
      )}
        <Button
        type="button"
        variant="secondary"
        onClick={onCancel}
        className={`${styles.formBtn} ${!initialData ? styles.leftAligned : ""}`}
        disabled={isLoading}
      >
        {cancelButtonText || (initialData ? "İmtina et" : "Təmizlə")}
      </Button>
      </div>
    </div>
  );
};

