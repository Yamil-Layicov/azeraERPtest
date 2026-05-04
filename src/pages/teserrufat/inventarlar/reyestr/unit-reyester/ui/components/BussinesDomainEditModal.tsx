import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import BusinessIcon from "@mui/icons-material/Business";
import TimerIcon from "@mui/icons-material/Timer";
import PaymentsIcon from "@mui/icons-material/Payments";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import { Modal, FormInput, Button, ModernDatePicker } from "@/shared/ui";
import type { BusinessUnit } from "../../model/mockData";
import styles from "./BusinessUnitsTab.module.css";

interface BusinessUnitEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  unit: BusinessUnit | null;
}

const BusinessUnitEditModal: React.FC<BusinessUnitEditModalProps> = ({
  isOpen,
  onClose,
  unit,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    biznes: "",
    company: "",
    domain: "",
    expiryDate: null as Date | null,
    daysRemaining: 0,
    paymentAmount: "",
    lastPaymentDate: null as Date | null,
  });

  useEffect(() => {
    if (unit) {
      setFormData({
        biznes: unit.name || "",
        company: unit.company || "",
        domain: unit.domainInfo?.name || unit.domain || "",
        expiryDate: unit.domainInfo?.expiryDate
          ? new Date(unit.domainInfo.expiryDate)
          : null,
        daysRemaining: unit.domainInfo?.daysRemaining || 0,
        paymentAmount: unit.domainInfo?.paymentAmount || "",
        lastPaymentDate: unit.domainInfo?.lastPaymentDate
          ? new Date(unit.domainInfo.lastPaymentDate)
          : null,
      });
      setIsEditing(false);
    }
  }, [unit]);

  const handleInputChange = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleToggleEdit = () => {
    if (isEditing) {
      // If was editing, now saving
      console.log("Saving data:", formData);
      onClose();
    } else {
      setIsEditing(true);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <Box display="flex" alignItems="center" gap={1.5}>
          <Box
            sx={{
              p: 0.8,
              bgcolor: "rgba(184, 3, 12, 0.1)",
              borderRadius: "8px",
              display: "flex",
            }}
          >
            <LanguageIcon
              sx={{ color: "var(--primary-color)", fontSize: 22 }}
            />
          </Box>
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={800}
              sx={{ lineHeight: 1.2 }}
            >
              {isEditing ? "Məlumatların Redaktəsi" : "Domen Məlumatları"}
            </Typography>
            <Typography
              variant="caption"
              color="var(--text-muted)"
              fontWeight={600}
              sx={{ fontSize: "11px" }}
            >
              Domen və Biznes vahidi tənzimləmələri
            </Typography>
          </Box>
        </Box>
      }
      size="md"
    >
      <div className={styles.formContainer}>
        <div className={styles.formRow}>
          <div className={styles.formField}>
            <FormInput
              type="text"
              placeholder=""
              label="Adi"
              id="biznes"
              value={formData.biznes}
              onChange={(val) => handleInputChange("biznes", val)}
              disabled={!isEditing}
              icon={
                <BusinessIcon
                  sx={{ color: "var(--text-muted)", fontSize: 20 }}
                />
              }
            />
          </div>
        </div>

        <div className={styles.formSectionDivider}>
          <span className={styles.formSectionLabel}>DOMEN MƏLUMATLARI</span>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formFieldWide}>
            <FormInput
              type="text"
              placeholder=""
              label="Domen Adı"
              id="domain"
              value={formData.domain}
              onChange={(val) => handleInputChange("domain", val)}
              disabled={!isEditing}
              icon={
                <LanguageIcon
                  sx={{ color: "var(--primary-color)", fontSize: 20 }}
                />
              }
            />
          </div>
          <div className={styles.formFieldSmall}>
            <FormInput
              type="number"
              placeholder=""
              label="Qalan Gün"
              id="daysRemaining"
              value={String(formData.daysRemaining)}
              onChange={(val) =>
                handleInputChange("daysRemaining", Number(val))
              }
              disabled={!isEditing}
              icon={
                <TimerIcon
                  sx={{
                    color: formData.daysRemaining < 0 ? "#d32f2f" : "#2e7d32",
                    fontSize: 20,
                  }}
                />
              }
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formField}>
            <ModernDatePicker
              label="Bitmə Tarixi"
              id="expiryDate"
              value={formData.expiryDate}
              onChange={(val) => handleInputChange("expiryDate", val)}
              disabled={!isEditing}
            />
          </div>
          <div className={styles.formField}>
            <FormInput
              type="text"
              placeholder=""
              label="Ödəniş Məbləği"
              id="paymentAmount"
              value={formData.paymentAmount}
              onChange={(val) => handleInputChange("paymentAmount", val)}
              disabled={!isEditing}
              icon={
                <PaymentsIcon
                  sx={{ color: "var(--text-muted)", fontSize: 20 }}
                />
              }
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formField}>
            <ModernDatePicker
              label="Son Ödəniş Tarixi"
              id="lastPaymentDate"
              value={formData.lastPaymentDate}
              onChange={(val) => handleInputChange("lastPaymentDate", val)}
              disabled={!isEditing}
            />
          </div>
        </div>

        <Box
          display="flex"
          justifyContent="flex-end"
          gap={2}
          mt={2}
          pt={2}
          borderTop="1px solid var(--border-light)"
        >
          <Button
            variant="outline"
            onClick={onClose}
            className={styles.cancelButton}
          >
            Ləğv et
          </Button>
          <Button
            variant={isEditing ? "default" : "outline"}
            onClick={handleToggleEdit}
            className={isEditing ? styles.saveButton : styles.editButton}
          >
            <Box display="flex" alignItems="center" gap={1}>
              {isEditing ? (
                <SaveIcon sx={{ fontSize: 18 }} />
              ) : (
                <EditIcon sx={{ fontSize: 18 }} />
              )}
              {isEditing ? "Yadda Saxla" : "Redaktə et"}
            </Box>
          </Button>
        </Box>
      </div>
    </Modal>
  );
};

export default BusinessUnitEditModal;
