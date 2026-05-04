import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import styles from './InventorySearchModal.module.css';
import { Button } from '@/shared/ui/button';
import { CustomSelect } from '@/shared/ui/select';
import { rowCountOptions } from '@/shared/config/tableOptions';
import type { Option } from '@/shared/types';

interface InventorySearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (searchData: InventorySearchFormData) => void;
}

export interface InventorySearchFormData {
  businessUnit: Option | null;
  department: Option | null;
  location: Option | null;
  subCategory: Option | null;
  status: Option | null;
  rowCount: Option | null;
}

const InventorySearchModal: React.FC<InventorySearchModalProps> = ({ isOpen, onClose, onSearch }) => {
  const [formData, setFormData] = React.useState<InventorySearchFormData>({
    businessUnit: null,
    department: null,
    location: null,
    subCategory: null,
    status: null,
    rowCount: rowCountOptions[0] || null,
  });

  const handleInputChange = (field: keyof InventorySearchFormData, value: Option | null) => {
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
      businessUnit: null,
      department: null,
      location: null,
      subCategory: null,
      status: null,
      rowCount: rowCountOptions[0] || null,
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
              <label className={styles.label} htmlFor="businessUnit">Biznes vahidi</label>
              <CustomSelect
                id="businessUnit"
                options={[]} // Mock options for now
                value={formData.businessUnit}
                onChange={(value) => handleInputChange('businessUnit', value as Option)}
                defaultText="Seçin"
                variant="form"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="department">Departament</label>
              <CustomSelect
                id="department"
                options={[]} // Mock options for now
                value={formData.department}
                onChange={(value) => handleInputChange('department', value as Option)}
                defaultText="Hamısı"
                variant="form"
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="location">Lokasiya / şöbə</label>
              <CustomSelect
                id="location"
                options={[]} // Mock options for now
                value={formData.location}
                onChange={(value) => handleInputChange('location', value as Option)}
                defaultText="Hamısı"
                variant="form"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="subCategory">Alt kateqoriya</label>
              <CustomSelect
                id="subCategory"
                options={[]} // Mock options for now
                value={formData.subCategory}
                onChange={(value) => handleInputChange('subCategory', value as Option)}
                defaultText="Hamısı"
                variant="form"
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="status">Status</label>
              <CustomSelect
                id="status"
                options={[]} // Mock options for now
                value={formData.status}
                onChange={(value) => handleInputChange('status', value as Option)}
                defaultText="Hamısı"
                variant="form"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="rowCount">Satır</label>
              <CustomSelect
                id="rowCount"
                options={rowCountOptions}
                value={formData.rowCount}
                onChange={(value) => handleInputChange('rowCount', value as Option)}
                defaultText="25"
                variant="form"
              />
            </div>
          </div>

          <div className={styles.note}>
            Qeyd: Departament və Lokasiya seçimi "Biznes vahidi"nə görə avtomatik süzülür.
          </div>

          <div className={styles.modalFooter}>
            <div className={styles.actionButtons}>
              <Button type="button" variant="primary" onClick={handleSearch}>
                Filtrlə
              </Button>
              <Button type="button" variant="clear" onClick={handleClear}>
                Təmizlə
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventorySearchModal;
