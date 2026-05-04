import React, { useState } from "react";
import { Modal, FormInput, FormTextarea, Checkbox, Button } from "@/shared/ui";
import styles from "./AddBusinessUnitModal.module.css";
import BusinessIcon from "@mui/icons-material/Business";

interface AddBusinessUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddBusinessUnitModal: React.FC<AddBusinessUnitModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    mainEmail: "",
    website: "",
    myBusiness: "",
    webViews: 0,
    isActive: true,
    notes: "",
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log("Saving new business unit:", formData);
    onClose(); // Close modal after save
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className={styles.modalTitleWrapper}>
          <div className={styles.titleIconContainer}>
            <BusinessIcon className={styles.titleIcon} />
          </div>
          <span className={styles.modalTitle}>Yeni Biznes Vahidi</span>
        </div>
      }
      size="md"
    >
      <div className={styles.formContainer}>
        <div className={styles.formRow}>
          <FormInput
            type="text"
            label="Ad"
            id="name"
            placeholder=""
            value={formData.name}
            onChange={(val) => handleInputChange("name", val)}
          />
          <FormInput
            type="email"
            label="Əsas mail (Domenlərdən auto)"
            id="mainEmail"
            placeholder=""
            value={formData.mainEmail}
            onChange={(val) => handleInputChange("mainEmail", val)}
          />
        </div>
        <div className={styles.formRow}>
          <FormInput
            type="text"
            label="Website (Domenlərdən auto)"
            id="website"
            placeholder=""
            value={formData.website}
            onChange={(val) => handleInputChange("website", val)}
          />
          <FormInput
            type="text"
            label="MyBusiness"
            id="myBusiness"
            placeholder=""
            value={formData.myBusiness}
            onChange={(val) => handleInputChange("myBusiness", val)}
          />
        </div>
        <div className={styles.formRow}>
          <FormInput
            type="number"
            label="Web views"
            id="webViews"
            placeholder=""
            value={String(formData.webViews)}
            onChange={(val) => handleInputChange("webViews", Number(val))}
          />
          <div className={styles.checkboxContainer}>
            <Checkbox
              id="isActive"
              label="Aktiv"
              checked={formData.isActive}
              onChange={(val) => handleInputChange("isActive", val)}
            />
          </div>
        </div>
        <FormTextarea
          label="Qeyd"
          id="notes"
          placeholder=""
          value={formData.notes}
          onChange={(val) => handleInputChange("notes", val)}
          rows={3}
        />
        <div className={styles.modalFooter}>
          <Button variant="outline" onClick={onClose}>
            Bağla
          </Button>
          <Button variant="primary" onClick={handleSave} type="button">
            Yadda saxla
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddBusinessUnitModal;
