import React, { useState } from 'react';
import {
  Modal,
  FormInput,
  FormTextarea,
  Button,
  CustomSelect,
} from '@/shared/ui';
import styles from './AddProgramModal.module.css';
import FolderIcon from '@mui/icons-material/Folder';
import InfoIcon from '@mui/icons-material/Info';
import type { Option } from '@/shared/types';

interface AddProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  departmentOptions: Option[];
}

const AddProgramModal: React.FC<AddProgramModalProps> = ({
  isOpen,
  onClose,
  departmentOptions,
}) => {
  const [formData, setFormData] = useState({
    department: null as Option | null,
    programName: '',
    description: '',
    features: '',
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log('Saving new program:', formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className={styles.modalTitleWrapper}>
          <div className={styles.titleIconContainer}>
            <FolderIcon className={styles.titleIcon} />
          </div>
          <span className={styles.modalTitle}>Yeni Proqram</span>
        </div>
      }
      size="md"
    >
      <div className={styles.formContainer}>
        <div className={styles.formRow}>
          <div className={styles.formField}>
            <label className={styles.label}>Departament</label>
            <CustomSelect
              options={departmentOptions}
              value={formData.department}
              onChange={(opt) => handleInputChange('department', opt)}
              defaultText="Seçin..."
              isClearable
            />
            <span className={styles.subLabel}>
              Departamentlər Admin panelindən də idarə olunur.
            </span>
          </div>
          <div className={styles.formField}>
            <FormInput
              type="text"
              label="Proqramın adı"
              id="programName"
              placeholder="Məs: ERP, CRM..."
              value={formData.programName}
              onChange={(val) => handleInputChange('programName', val)}
            />
          </div>
        </div>

        <FormTextarea
          label="Təyinatı"
          id="description"
          placeholder="Bu proqram nə üçündür?"
          value={formData.description}
          onChange={(val) => handleInputChange('description', val)}
          rows={3}
        />

        <FormTextarea
          label="Funksionallıqlar (hər sətrə bir bənd)"
          id="features"
          placeholder="- İstifadəçi idarəetməsi\n- Hesabatlar\n- İnteqrasiyalar"
          value={formData.features}
          onChange={(val) => handleInputChange('features', val)}
          rows={4}
        />

        <div className={styles.imageSection}>
          <span className={styles.imageTitle}>Şəkillər (istəyə bağlı)</span>
          <span className={styles.imageSubTitle}>Bir neçə faylı eyni anda yükləyə bilərsiniz</span>
          
          <div className={styles.imageWarning}>
            <InfoIcon className={styles.warningIcon} />
            <span>
              Əvvəlcə yuxarıdakı formu <strong>Yadda saxlayın</strong>. Sonra şəkil yükləmə aktiv olacaq.
            </span>
          </div>

          <div className={styles.imagePlaceholder}>
            Şəkillər üçün əvvəlcə proqramı yaradın
          </div>
        </div>

        <div className={styles.modalFooter}>
          <Button variant="primary" onClick={handleSave} type="button">
            Yadda saxla
          </Button>
          <Button variant="outline" onClick={onClose} type="button">
            İmtina
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddProgramModal;
