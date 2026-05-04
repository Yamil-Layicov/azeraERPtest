import React from "react";
import { FormInput, ModernDatePicker, FormTextarea } from "@/shared/ui";
import styles from "./AssignmentInfoForm.module.css";
import type { Option } from "@/shared/types";

interface Props {
  responsiblePerson: string;
  setResponsiblePerson: (v: string) => void;
  responsibleFin: string;
  setResponsibleFin: (v: string) => void;
  deliveryDate: Date | null;
  setDeliveryDate: (v: Date | null) => void;
  company: Option | null;
  department: Option | null;
}

const AssignmentInfoForm: React.FC<Props> = ({
  responsiblePerson,
  setResponsiblePerson,
  responsibleFin,
  setResponsibleFin,
  deliveryDate,
  setDeliveryDate,
  company,
  department,
}) => (
  <div className={styles.section}>
    <div>
      <h3 className={styles.sectionTitle}>Təhkim & təhvil</h3>
      <div className={styles.sectionSubtitle}>
        Məsul şəxs seçimi və təhvil tarixi
      </div>
    </div>
    <div className={styles.row2}>
      <div className={styles.field}>
        <label className={styles.fieldLabel}>
          Məsul şəxs (işçi) <span className={styles.required}>*</span>
        </label>
        <div className={styles.inputGroup}>
          <div className={styles.inputGroupField}>
            <FormInput
              id="responsiblePerson"
              type="text"
              label=""
              placeholder=""
              value={responsiblePerson}
              onChange={setResponsiblePerson}
              className={styles.formInput}
            />
          </div>
          <button
            className={styles.clearBtn}
            onClick={() => setResponsiblePerson("")}
          >
            ✕
          </button>
        </div>
        <span className={styles.hint}>
          İşçi seçimi yalnız seçilən Biznes vahidi + Departament üzrə edilir.
        </span>
      </div>
      <div className={styles.field}>
        <label className={styles.fieldLabel}>Təhvil tarixi</label>
        <ModernDatePicker
          id="assignDate"
          value={deliveryDate}
          onChange={setDeliveryDate}
          placeholder="mm/dd/yyyy"
        />
        <span className={styles.hint}>
          Boş saxlasanız sistem bugünkü tarixi götürəcək.
        </span>
      </div>
    </div>
    {responsiblePerson && (
      <div className={styles.personCard}>
        <div className={styles.personInfo}>
          <span className={styles.personName}>{responsiblePerson}</span>
          <span className={styles.personFin}>
            FİN: {responsibleFin || "---"}
          </span>
        </div>
        <button
          className={styles.deleteBtn}
          onClick={() => {
            setResponsiblePerson("");
            setResponsibleFin("");
          }}
        >
          Sil
        </button>
      </div>
    )}
    <div className={styles.row1}>
      <div className={styles.field}>
        <FormTextarea
          id="assignNote"
          label="Qeyd"
          placeholder="İlkin inventarlaşdırma qeydi..."
          value=""
          onChange={() => null}
          rows={2}
        />
      </div>
    </div>
    {!company || !department ? (
      <div className={`${styles.infoBox} ${styles.infoBoxWarning}`}>
        Məsul şəxs seçmək istəyirsinizsə, öncə <strong>Biznes vahidi</strong> və{" "}
        <strong>Departament</strong> seçilməlidir.
      </div>
    ) : null}
  </div>
);

export default AssignmentInfoForm;
