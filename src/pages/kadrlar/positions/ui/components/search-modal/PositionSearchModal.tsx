import React, { useState, useEffect, useRef } from 'react';
import styles from './PositionSearchModal.module.css';
import { Button } from '@/shared/ui/button';
import { CustomSelect } from '@/shared/ui/select';
import { FormInput } from '@/shared/ui/input';
import { Modal } from '@/shared/ui/modal/base'; 
import type { Option } from '@/shared/types';


interface PositionSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (searchData: PositionSearchFormData) => void;
  onClear?: () => void;
  initialData?: PositionSearchFormData;
  onChange?: (searchData: PositionSearchFormData) => void;
}

export interface PositionSearchFormData {
  positionName: string;
  status: Option | null;
}

const statusOptions: Option[] = [
  { id: 'active', fullName: 'Aktiv', role: '' },
  { id: 'inactive', fullName: 'Qeyri-aktiv', role: '' },
];

const PositionSearchModal: React.FC<PositionSearchModalProps> = ({ 
  isOpen, 
  onClose, 
  onSearch,
  onClear,
  initialData,
  onChange
}) => {
  
  const [formData, setFormData] = useState<PositionSearchFormData>(
    initialData || {
      positionName: '',
      status: null,
    }
  );
  
  const prevInitialDataRef = useRef(initialData);
  const isUserTypingRef = useRef(false);

  useEffect(() => {
    if (isOpen) {
      const prevData = prevInitialDataRef.current;
      const currentData = initialData;
      
      if (!isUserTypingRef.current && prevData !== currentData) {
        if (currentData) {
          setFormData(currentData);
        }
        prevInitialDataRef.current = currentData;
      }
    }
  }, [isOpen, initialData]);

  useEffect(() => {
    if (onChange) {
      isUserTypingRef.current = true;
      onChange(formData);
      setTimeout(() => {
        isUserTypingRef.current = false;
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  const handleInputChange = <K extends keyof PositionSearchFormData>(
    field: K, 
    value: PositionSearchFormData[K]
  ) => {
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
      positionName: '',
      status: null,
    });
    if (onClear) {
      onClear();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Vəzifələr üzrə axtarış"
      size="md"
      className={styles.customModalWidth}
    >
      <div className={styles.formContainer}>
        <div className={styles.formRow}>
          <FormInput
            label="Vəzifə adı"
            id="positionName"
            type="text"
            placeholder="Daxil edin"
            value={formData.positionName}
            onChange={(val) => handleInputChange('positionName', val)}
          />
          <div className={styles.formGroup}>
            <label className={styles.label}>Status</label>
            <CustomSelect
              options={statusOptions}
              value={formData.status}
              onChange={(val) => handleInputChange('status', val)}
              defaultText="Seçin"
              variant="form"
              isSearchable={false}
            />
          </div>
        </div>

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
              variant="secondary"
              onClick={handleClear}
              className={styles.clearButton}
            >
              Təmizlə
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PositionSearchModal;