  import React, { useEffect, useState } from "react";
import styles from "./PositionsFormPanel.module.css";
import { FormInput } from "@/shared/ui/input";
import { Checkbox } from "@/shared/ui/checkbox";
import { Button } from "@/shared/ui/button";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Loading } from "@/shared/ui/loading";

interface PositionsFormPanelProps {
  title: string;
  initialData?: { name: string; isActive: boolean; sortOrder?: number; createdAt?: string; createdBy?: string | null } | null;
  onClose?: () => void;
  onSave?: (data: { name: string; isActive: boolean; sortOrder: number }) => void;
  onChange?: (data: { name: string; isActive: boolean; sortOrder: number }) => void;
  formId?: string;
  isPending?: boolean;
  isOpen?: boolean;
  isEditMode?: boolean; 
  isLoadingDetail?: boolean;
}

const PositionsFormPanel: React.FC<PositionsFormPanelProps> = ({
  title,
  initialData,
  onClose,
  onSave,
  onChange,
  formId = "default",
  isPending = false,
  isOpen = true,
  isEditMode = true,
  isLoadingDetail = false
}) => {
  const [formName, setFormName] = useState(
    initialData?.name || ""
  );
  const [sortOrder, setSortOrder] = useState<number>(
    initialData?.sortOrder ?? 0
  );
  const [isActive, setIsActive] = useState(
    initialData?.isActive ?? true
  );

  useEffect(() => {
    if (isOpen && initialData) {
      setFormName(initialData.name || "");
      setSortOrder(initialData.sortOrder ?? 0);
      setIsActive(initialData.isActive ?? true);
    }
  }, [isOpen, initialData]);

  useEffect(() => {
    if (onChange) {
      onChange({ name: formName, isActive, sortOrder });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formName, isActive, sortOrder]);

  const handleSave = () => {
    if (!formName || !formName.trim()) return;
    
    const data = { name: formName.trim(), isActive, sortOrder };
    if (onSave) {
      onSave(data);
    }
  };

  return (
    <div className={styles.panelContainer}>
      {title && (
        <div className={styles.panelHeader}>
          <h3 className={styles.panelTitle}>{title}</h3>
          {onClose && (
            <Button 
              type="button" 
              variant="clear" 
              onClick={onClose}
              className={styles.closeBtn}
            >
              <XMarkIcon width={20} />
            </Button>
          )}
        </div>
      )}
      
      <div className={styles.panelBody}>
        {isLoadingDetail ? (
          <div style={{ padding: "20px", display: "flex", justifyContent: "center" }}>
            <Loading />
          </div>
        ) : (
          <>
            <FormInput 
              label="Vəzifə adı" 
              id={`posName-${formId}`}
              type="text" 
              placeholder="Daxil edin" 
              value={formName} 
              onChange={setFormName} 
              className={styles.formGroup}
            />

            <FormInput 
              label="Sira №" 
              id={`posSortOrder-${formId}`}
              type="number" 
              placeholder="Daxil edin" 
              value={String(sortOrder)} 
              onChange={(val) => setSortOrder(val === "" ? 0 : Math.max(0, parseInt(val, 10) || 0))} 
              className={styles.formGroup}
            />
            
            {isEditMode && (
              <div className={styles.checkboxWrapper}>
                <Checkbox
                  id={`position-active-${formId}`}
                  label="Aktiv"
                  checked={isActive}
                  onChange={setIsActive}
                />
              </div>
            )}

            {/* Created At and Created By (only in edit mode, read-only) */}
            {isEditMode && (initialData?.createdAt || initialData?.createdBy) && (
              <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
                {initialData?.createdAt && (
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <label
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: 600,
                        minWidth: "140px",
                        color: "#868e96",
                        fontStyle: "italic",
                      }}
                    >
                      Yaranma tarixi:
                    </label>
                    <span
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: 500,
                        color: "#868e96",
                        fontStyle: "italic",
                      }}
                    >
                      {new Date(initialData.createdAt).toLocaleString("az-AZ", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                )}

                {initialData?.createdBy && (
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <label
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: 600,
                        minWidth: "140px",
                        color: "#868e96",
                        fontStyle: "italic",
                      }}
                    >
                      Daxil edən:
                    </label>
                    <span
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: 500,
                        color: "#868e96",
                        fontStyle: "italic",
                      }}
                    >
                      {initialData.createdBy}
                    </span>
                  </div>
                )}
              </div>
            )}
            
            <div className={styles.panelFooter}>
              <Button 
                type="button" 
                variant="primary" 
                onClick={handleSave}
                className={styles.panelButton}
                disabled={!formName || !formName.trim() || isPending}
              >
                {isPending 
                  ? "Göndərilir..." 
                  : (!isEditMode ? "Yadda saxla" : "Yenilə")
                }
              </Button>
              
              <Button 
                type="button" 
                variant="secondary" 
                onClick={onClose} 
                className={styles.panelButton}
                disabled={isPending}
              >
                İmtina et 
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PositionsFormPanel;