import { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import styles from "./modals/CashboxSearchModal.module.css";
import { Button } from "@/shared/ui/button";
import { CustomSelect } from "@/shared/ui/select";
import type { Option } from "@/shared/types";
import { cashOperationsService } from "@/features/maliyye/cash-operations/api/cashOperationsService";

type SelectOptionResponse = {
  value: string;
  label: string;
  disabled: boolean;
};

interface CashboxSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (searchData: CashboxSearchFormData) => void;
  rootCompanyId?: string | null;
}

export interface CashboxSearchFormData {
  source: Option | null;
  treasurer: Option | null;
}

function CashboxSearchModal({
  isOpen,
  onClose,
  onSearch,
  rootCompanyId,
}: CashboxSearchModalProps) {
  const [cashboxes, setCashboxes] = useState<Option[]>([]);
  const [treasurerOptions, setTreasurerOptions] = useState<Option[]>([]);

  const [formData, setFormData] = useState<CashboxSearchFormData>({
    source: null,
    treasurer: null,
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const fetchCashBoxes = async () => {
    if (!rootCompanyId) return;
    try {
      const response = await cashOperationsService.getCashBoxes(
        String(rootCompanyId),
      );
      if (response.isSuccess) {
        const mapped = response.result.map((cb: SelectOptionResponse) => ({
          id: cb.value,
          fullName: cb.label,
          role: "",
          disabled: cb.disabled,
        }));
        setCashboxes(mapped);
      }
    } catch (error) {
      console.error("Error fetching cashboxes:", error);
    }
  };

  const fetchTreasurers = async () => {
    if (!rootCompanyId) {
      setTreasurerOptions([]);
      return;
    }
    try {
      const response = await cashOperationsService.getNodes({
        rootCompanyId: String(rootCompanyId),
        pageIndex: 0,
      });
      if (response.isSuccess && response.result) {
        const list = Array.isArray(response.result)
          ? response.result
          : (response.result as any).data;

        const mapped = (list || []).map(
          (e: { value: string; label: string; disabled?: boolean }) => ({
            id: e.value,
            fullName: e.label,
            role: "",
            disabled: e.disabled ?? false,
          }),
        );
        setTreasurerOptions(mapped);    
      } else {
        setTreasurerOptions([]);
      }
    } catch (error) {
      console.error("Error fetching treasurers:", error);
      setTreasurerOptions([]);
    }
  };

  const handleInputChange = (
    field: keyof CashboxSearchFormData,
    value: Option | null,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    onSearch(formData);
    onClose();
  };

  const handleClear = () => {
    const clearedData: CashboxSearchFormData = {
      source: null,
      treasurer: null,
    };
    setFormData(clearedData);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Axtarış</h2>
          <button
            type="button"
            onClick={onClose}
            className={styles.closeButton}
          >
            <XMarkIcon className={styles.closeIcon} />
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="source">
                Mənbə
              </label>
              <CustomSelect
                id="source"
                options={cashboxes}
                value={formData.source}
                onChange={(value) => handleInputChange("source", value)}
                onMenuOpen={fetchCashBoxes}
                defaultText="Mənbə seçin"
                variant="form"
                isSearchable={true}
                searchPlaceholder="Mənbə axtar..."
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="treasurer">
                Xəzinədar
              </label>
              <CustomSelect
                id="treasurer"
                options={treasurerOptions}
                value={formData.treasurer}
                onChange={(value) => handleInputChange("treasurer", value)}
                onMenuOpen={fetchTreasurers}
                defaultText="Xəzinədar seçin"
                variant="form"
                isSearchable={true}
                searchPlaceholder="Xəzinədar axtar..."
              />
            </div>
          </div>

          <div className={styles.formRow}></div>

          <div className={styles.modalFooter}>
            <div className={styles.actionButtons}>
              <Button
                type="button"
                variant="primary"
                onClick={handleSearch}
                className={styles.searchButton}
              >
                Axtar
              </Button>
              <Button
                type="button"
                variant="clear"
                onClick={handleClear}
                className={styles.clearButton}
              >
                Təmizlə
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CashboxSearchModal;
