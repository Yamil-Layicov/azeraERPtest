import React from "react";
import { FormInput, CustomSelect, FileDropzone } from "@/shared/ui";
import styles from "./InventoryMainInfoForm.module.css";
import type { Option } from "@/shared/types";

interface Props {
  activeName: string;
  setActiveName: (v: string) => void;
  category: Option | null;
  setCategory: (v: Option | null) => void;
  categoryOptions: Option[];
  subCategory: Option | null;
  setSubCategory: (v: Option | null) => void;
  subCategoryOptions: Option[];
  status: Option | null;
  setStatus: (v: Option | null) => void;
  statusOptions: Option[];
  serialNumber: string;
  setSerialNumber: (v: string) => void;
}

const activeNameOptions: Option[] = [
  { id: 1, label: "MacBook Pro 16" },
  { id: 2, label: "Dell XPS 15" },
  { id: 3, label: "iPhone 14 Pro" },
  { id: 4, label: "Monitor LG 27\"" },
  { id: 5, label: "Ofis masası" },
];

const InventoryMainInfoForm: React.FC<Props> = ({
  activeName,
  setActiveName,
  category,
  setCategory,
  categoryOptions,
  subCategory,
  setSubCategory,
  subCategoryOptions,
  status,
  setStatus,
  statusOptions,
  serialNumber,
  setSerialNumber,
}) => (
  <div className={styles.section}>
    <div>
      <h3 className={styles.sectionTitle}>Əsas məlumatlar</h3>
      <div className={styles.sectionSubtitle}>
        Aktivin adı və kateqoriya/status məlumatları
      </div>
    </div>
    <div className={styles.row1}>
      <div className={styles.field}>
        <CustomSelect
          id="activeName"
         
          defaultText="Aktiv adı"
          options={activeNameOptions}
          value={activeNameOptions.find((opt) => opt.label === activeName) || null}
          onChange={(opt) => setActiveName(opt?.label || "")}
          isSearchable={true}
        />
      </div>
    </div>
    <div className={styles.row2}>
      <div className={styles.field}>
        <label className={styles.fieldLabel}>
          Üst kateqoriya <span className={styles.required}>*</span>
        </label>
        <CustomSelect
          id="category"
          options={categoryOptions}
          value={category}
          onChange={(opt) => {
            setCategory(opt);
            setSubCategory(null);
          }}
          defaultText="Seçin..."
          isSearchable={true}
          searchPlaceholder="Kateqoriya axtar..."
        />
        <span className={styles.hint}>
          Məs: "İT Avadanlıqları", "Mebel", "Nəqliyyat" və s.
        </span>
      </div>
      <div className={styles.field}>
        <label className={styles.fieldLabel}>
          Alt kateqoriya <span className={styles.required}>*</span>
        </label>
        <CustomSelect
          id="subCategory"
          options={subCategoryOptions}
          value={subCategory}
          onChange={setSubCategory}
          defaultText="Seçin..."
          disabled={!category}
        />
        <span className={styles.hint}>
          Üst kateqoriya seçdikdən sonra uyğun altlar görünəcək.
        </span>
      </div>
    </div>
    <div className={styles.row2}>
      <div className={styles.field}>
        <label className={styles.fieldLabel}>
          Status <span className={styles.required}>*</span>
        </label>
        <CustomSelect
          id="status"
          options={statusOptions}
          value={status}
          onChange={setStatus}
          defaultText="Seçin..."
        />
      </div>
      <div className={styles.row2Gap8}>
        <div className={styles.field}>
          <FormInput
            id="brand"
            type="text"
            label="Marka"
            placeholder=""
            value=""
            onChange={() => null}
          />
        </div>
        <div className={styles.field}>
          <FormInput
            id="model"
            type="text"
            label="Model"
            placeholder=""
            value=""
            onChange={() => null}
          />
        </div>
      </div>
    </div>
    <div className={styles.row1}>
      <div className={styles.field}>
        <FormInput
          id="serialNumber"
          type="text"
          label="Serial nömrə"
          placeholder="Seriya nomresi"
          value={serialNumber}
          onChange={setSerialNumber}
        />
      </div>
    </div>
    <div className={styles.row1}>
      <div className={styles.field}>
        <label className={styles.fieldLabel}>Şəkillər</label>
        <FileDropzone id="detailFilezone" label="" onChange={() => null} />
        <span className={styles.hint}>
          Mobil: kameradan çəkə bilərsiniz. PC: fayl seçimi açılacaq. Maks: 12
          şəkil, hər biri 5.7MB.
        </span>
      </div>
    </div>
  </div>
);

export default InventoryMainInfoForm;
