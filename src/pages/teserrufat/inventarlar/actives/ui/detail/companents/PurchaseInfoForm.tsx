import React from "react";
import { FormInput, ModernDatePicker } from "@/shared/ui";
import styles from "./PurchaseInfoForm.module.css";

interface Props {
  purchaseDate: Date | null;
  setPurchaseDate: (v: Date | null) => void;
  purchaseAmount: string;
  setPurchaseAmount: (v: string) => void;
}

const PurchaseInfoForm: React.FC<Props> = ({
  purchaseDate,
  setPurchaseDate,
  purchaseAmount,
  setPurchaseAmount,
}) => (
  <div className={styles.section}>
    <div>
      <h3 className={styles.sectionTitle}>Alış məlumatları</h3>
      <div className={styles.sectionSubtitle}>
        İstəyə bağlı: tarix və məbləğ
      </div>
    </div>
    <div className={styles.row2}>
      <div className={`${styles.field} ${styles.fieldV2}`}>
        <label className={styles.fieldLabel}>Alış tarixi</label>
        <ModernDatePicker
          id="purchaseDate"
          value={purchaseDate}
          onChange={setPurchaseDate}
          placeholder="mm/dd/yyyy"
        />
      </div>
      <div className={styles.field}>
        <FormInput
          id="purchaseAmount"
          type="text"
          label="Alış məbləği"
          placeholder="məs: 1250.50"
          value={purchaseAmount}
          onChange={setPurchaseAmount}
        />
      </div>
    </div>
  </div>
);

export default PurchaseInfoForm;
