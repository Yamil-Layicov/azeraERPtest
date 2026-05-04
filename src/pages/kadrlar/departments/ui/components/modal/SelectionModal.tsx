import React, { useEffect, useState, useMemo } from 'react';
import styles from './SelectionModal.module.css';
import { Modal } from '@/shared/ui/modal/base';
import DepartmentForm from '../form/DepartmentForm';
import VacancyForm from '../vacancy/VacancyForm';
import Checkbox from '@/shared/ui/checkbox/Checkbox';
import { usePermission } from '@/features/auth/hooks/usePermission';
import { PERMISSIONS } from '@/shared/consts/permissions';
import type { DepartmentNode } from '../../../model/types';
import type { FormValues } from '../form/types';
import type { VacancyFormPayload } from '../vacancy/VacancyForm';

type SelectionType = 'structure' | 'vacancy' | null;

interface SelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  parentNode: DepartmentNode | null;
  onSaveStructure?: (formData: FormValues) => void;
  onSaveVacancy?: (payload: VacancyFormPayload) => void;
  isLoading?: boolean;
  resetKey?: number;
}

const SelectionModal: React.FC<SelectionModalProps> = ({
  isOpen,
  onClose,
  parentNode,
  onSaveStructure,
  onSaveVacancy,
  isLoading = false,
  resetKey = 0
}) => {
  const [selectedType, setSelectedType] = useState<SelectionType>(null);
  const canCreateStructure = usePermission(PERMISSIONS.COMPANY.CREATE);
  const canCreateVacancy = usePermission(PERMISSIONS.STAFFING.CREATE);

  useEffect(() => {
    if (selectedType === 'structure' && !canCreateStructure) {
      setSelectedType(null);
    }
    if (selectedType === 'vacancy' && !canCreateVacancy) {
      setSelectedType(null);
    }
  }, [selectedType, canCreateStructure, canCreateVacancy]);

  const handleCheckboxChange = (type: SelectionType, checked: boolean) => {
    if (checked) {
      setSelectedType(type);
    } else {
      if (selectedType === type) {
        setSelectedType(null);
      }
    }
  };

  const handleClose = () => {
    setSelectedType(null);
    onClose();
  };

  const defaultParentOption = useMemo(() => parentNode
    ? { id: parentNode.id, fullName: parentNode.name, role: "" }
    : null, [parentNode]);

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose}
      title="Əlavə Et"
      size="md"
    >
      <div className={styles.selectionContainer}>
        <div className={styles.checkboxGroup}>
          {canCreateStructure ? (
            <div className={`${styles.checkboxWrapper} ${selectedType === 'structure' ? styles.active : ''}`}>
              <Checkbox
                id="checkbox-structure"
                checked={selectedType === 'structure'}
                onChange={(checked) => handleCheckboxChange('structure', checked)}
                label="Yeni struktur"
              />
            </div>
          ) : null}
          {canCreateVacancy ? (
            <div className={`${styles.checkboxWrapper} ${selectedType === 'vacancy' ? styles.active : ''}`}>
              <Checkbox
                id="checkbox-vacancy"
                checked={selectedType === 'vacancy'}
                onChange={(checked) => handleCheckboxChange('vacancy', checked)}
                label="Yeni Vakant"
              />
            </div>
          ) : null}
        </div>

        {selectedType === 'structure' && canCreateStructure && onSaveStructure && (
          <div className={styles.formContainer}>
            <DepartmentForm
              key={`new-structure-form-${resetKey}`} 
              initialData={null}
              defaultParent={defaultParentOption}
              onSave={onSaveStructure}
              onCancel={handleClose}
              isEditMode={false}
              isLoading={isLoading}
              isOpen={isOpen} 
              cancelButtonText="Bağla"
              fullWidth={true}
            />
          </div>
        )}

        {selectedType === 'vacancy' && canCreateVacancy && onSaveVacancy && (
          <div className={styles.formContainer}>
            <VacancyForm
              key={`vacancy-${resetKey}`}
              onSave={onSaveVacancy}
              isLoading={isLoading}
              defaultParent={defaultParentOption}
            />
          </div>
        )}
      </div>
    </Modal>
  );
};

export default SelectionModal;
