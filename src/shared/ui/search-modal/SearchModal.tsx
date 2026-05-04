import React, { useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import styles from './SearchModal.module.css';
import { Button } from '@/shared/ui/button';
import { CustomSelect } from '@/shared/ui/select';
import { FormInput } from '@/shared/ui/input';
import { ModernDatePicker } from '@/shared/ui/date-picker';
import type { Option } from '@/shared/types';
import { 
  useGetCashBoxes,
  useGetCounterparties,
  useGetCashPurposes,
  useGetOperationTypes
} from "@/features/maliyye/cash-operations";
import { cashOperationsService } from "@/features/maliyye/cash-operations/api/cashOperationsService";

/** API-dan gələn select option forması (value, label, disabled) */
type SelectOptionResponse = {
  value: string;
  label: string;
  disabled: boolean;
};

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (searchData: SearchFormData) => void;
  rootCompanyId?: string;
}

export interface SearchFormData {
  startDate: Date | null;
  endDate: Date | null;
  operationType: Option | null;
  source: Option | null;
  contractor: Option | null;
  business: Option | null;
  purpose: Option | null;
  person: string;
  status: Option | null;
}

// Removed static Options for Operation Type

function SearchModal({ isOpen, onClose, onSearch, rootCompanyId }: SearchModalProps) {
  const [formData, setFormData] = React.useState<SearchFormData>({
    startDate: null,
    endDate: null,
    operationType: null,
    source: null,
    contractor: null,
    business: null,
    purpose: null,
    person: '',
    status: null,
  });

  const [statusOptions, setStatusOptions] = React.useState<Option[]>([]);

  const fetchStatusTypes = async () => {
    try {
      const response = await cashOperationsService.getStatusTypes();
      if (response.isSuccess) {
        const mapped = response.result.map((s: SelectOptionResponse) => ({
          id: s.value,
          fullName: s.label,
          role: "",
          disabled: s.disabled,
        }));
        setStatusOptions(mapped);
      }
    } catch (error) {
      console.error("Error fetching status types:", error);
    }
  };

  const { data: cashBoxesData, refetch: refetchCashBoxes } = useGetCashBoxes(rootCompanyId || "", { enabled: false });
  const { data: counterpartiesData, refetch: refetchCounterparties } = useGetCounterparties({ enabled: false });
  const { data: purposesData, refetch: refetchPurposes } = useGetCashPurposes({ enabled: false });
  const { data: operationTypesData, refetch: refetchOperationTypes } = useGetOperationTypes({ enabled: false });

  const operationTypeOptions: Option[] = React.useMemo(() => {
    if (operationTypesData?.isSuccess && operationTypesData.result) {
      return operationTypesData.result.map(o => ({ id: o.value, fullName: o.label, role: '' }));
    }
    return [];
  }, [operationTypesData]);

  const sourceOptions: Option[] = React.useMemo(() => {
    if (cashBoxesData?.isSuccess && cashBoxesData.result) {
      return cashBoxesData.result.map(c => ({ id: c.value, fullName: c.label, role: '' }));
    }
    return [];
  }, [cashBoxesData]);

  const contractorOptions: Option[] = React.useMemo(() => {
    if (counterpartiesData?.isSuccess && counterpartiesData.result) {
      return counterpartiesData.result.map(c => ({ id: c.value, fullName: c.label, role: '' }));
    }
    return [];
  }, [counterpartiesData]);

  const purposeOptions: Option[] = React.useMemo(() => {
    if (purposesData?.isSuccess && purposesData.result) {
      return purposesData.result.map(p => ({ id: p.value, fullName: p.label, role: '' }));
    }
    return [];
  }, [purposesData]);



  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleInputChange = (field: keyof SearchFormData, value: string | Option | Date | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = () => {
    onSearch(formData);
    onClose();
  };

  const handleClear = () => {
    setFormData({
      startDate: null,
      endDate: null,
      operationType: null,
      source: null,
      contractor: null,
      business: null,
      purpose: null,
      person: '',
      status: null,
    });
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Axtarış</h2>
          <button
            type="button"
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Bağla"
          >
            <XMarkIcon className={styles.closeIcon} />
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              {/* DÜZƏLİŞ: htmlFor və id əlavə edildi */}
              <label className={styles.label} htmlFor="startDate">Başlanğıc tarixi</label>
              <ModernDatePicker
                id="startDate"
                value={formData.startDate}
                onChange={(date) => handleInputChange('startDate', date)}
              />
            </div>
            <div className={styles.formGroup}>
              {/* DÜZƏLİŞ: htmlFor və id əlavə edildi */}
              <label className={styles.label} htmlFor="endDate">Bitmə tarixi</label>
              <ModernDatePicker
                id="endDate"
                value={formData.endDate}
                onChange={(date) => handleInputChange('endDate', date)}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              {/* DÜZƏLİŞ: htmlFor və id əlavə edildi */}
              <label className={styles.label} htmlFor="source">Mənbə</label>
              <CustomSelect
                id="source"
                options={sourceOptions}
                value={formData.source}
                onChange={(value) => handleInputChange('source', value)}
                defaultText="Seçin"
                variant="form"
                isSearchable={true}
                searchPlaceholder="Mənbə axtar..."
                onMenuOpen={refetchCashBoxes}
              />
            </div>
              <FormInput
              label="Pulu alan/verən"
              type="text"
              id="person"
              value={formData.person}
              onChange={(value) => handleInputChange('person', value)}
              placeholder="Ad daxil edin"
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              {/* DÜZƏLİŞ: htmlFor və id əlavə edildi */}
              <label className={styles.label} htmlFor="operationType">Əməliyyatın növü</label>
              <CustomSelect
                id="operationType"
                options={operationTypeOptions}
                value={formData.operationType}
                onChange={(value) => handleInputChange('operationType', value)}
                defaultText="Seçin"
                variant="form"
                isSearchable={true}
                searchPlaceholder="Axtar..."
                onMenuOpen={refetchOperationTypes}
              />
            </div>
            <div className={styles.formGroup}>
              {/* DÜZƏLİŞ: htmlFor və id əlavə edildi */}
              <label className={styles.label} htmlFor="contractor">Kontragent</label>
              <CustomSelect
                id="contractor"
                options={contractorOptions}
                value={formData.contractor}
                onChange={(value) => handleInputChange('contractor', value)}
                defaultText="Seçin"
                variant="form"
                isSearchable={true}
                searchPlaceholder="Kontragent axtar..."
                onMenuOpen={refetchCounterparties}
              />
            </div>
           
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="purpose">Təyinat</label>
              <CustomSelect
                id="purpose"
                options={purposeOptions}
                value={formData.purpose}
                onChange={(value) => handleInputChange('purpose', value)}
                defaultText="Seçin"
                variant="form"
                isSearchable={true}
                searchPlaceholder="Təyinat axtar..."
                onMenuOpen={refetchPurposes}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="status">Status</label>
              <CustomSelect
                id="status"
                options={statusOptions}
                value={formData.status}
                onChange={(value) => handleInputChange("status", value)}
                onMenuOpen={fetchStatusTypes}
                defaultText="Status seçin"
                variant="form"
                isSearchable={true}
                searchPlaceholder="Status axtar..."
              />
            </div>
            
          
          </div>

          <div className={styles.modalFooter}>
            <div className={styles.actionButtons}>
              <Button type="button" variant="primary" onClick={handleSearch} className={styles.actionButton}>
                Axtar
              </Button>
              <Button type="button" variant="clear" onClick={handleClear} className={styles.actionButton}>
                Təmizlə
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchModal;