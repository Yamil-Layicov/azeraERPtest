import React from "react";
import { CustomSelect } from "@/shared/ui";
import styles from "./StructureInfoForm.module.css";
import type { Option } from "@/shared/types";

interface Props {
  company: Option | null;
  setCompany: (v: Option | null) => void;
  companyOptions: Option[];
  department: Option | null;
  setDepartment: (v: Option | null) => void;
  departmentOptions: Option[];
  location: Option | null;
  setLocation: (v: Option | null) => void;
  locationOptions: Option[];
}

const StructureInfoForm: React.FC<Props> = ({
  company,
  setCompany,
  companyOptions,
  department,
  setDepartment,
  departmentOptions,
  location,
  setLocation,
  locationOptions,
}) => (
  <div className={styles.section}>
    <div>
      <h3 className={styles.sectionTitle}>Struktur</h3>
      <div className={styles.sectionSubtitle}>
        Biznes vahidi, departament və lokasiya məlumatları
      </div>
    </div>
    <div className={styles.row2}>
      <div className={styles.row1}>
        <div className={styles.field}>
          <label className={styles.fieldLabel}>Şirkət</label>
          <CustomSelect
            id="company"
            options={companyOptions}
            value={company}
            onChange={setCompany}
            defaultText="Seçin..."
            isSearchable={true}
            searchPlaceholder="Şirkət axtar..."
          />
        </div>
      </div>
      <div className={styles.row1}>
        <div className={styles.field}>
          <label className={styles.fieldLabel}>Departament</label>
          <CustomSelect
            id="department"
            options={departmentOptions}
            value={department}
            onChange={setDepartment}
            defaultText="Seçin..."
            isSearchable={true}
            searchPlaceholder="Departament axtar..."
          />
        </div>
      </div>
    </div>
    <div className={styles.row1}>
      <div className={styles.field}>
        <label className={styles.fieldLabel}>Lokasiya</label>
        <CustomSelect
          id="location"
          options={locationOptions}
          value={location}
          onChange={setLocation}
          defaultText="Seçin..."
          isSearchable={true}
          searchPlaceholder="Lokasiya axtar..."
        />
      </div>
    </div>
  </div>
);

export default StructureInfoForm;
