import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PageHeader,
  Button,
  FormInput,
  CustomSelect,
  ModernDatePicker,
  FormTextarea,
  FileDropzone,
} from "@/shared/ui";
import { CheckIcon } from "@heroicons/react/24/outline";
import styles from "./AddActiveInventoryPage.module.css";
import { ROUTES } from "@/app/routes/consts";
import type { Option } from "@/shared/types";

const statusOptions = [
  { id: "1", label: "Aktiv", value: "active" },
  { id: "2", label: "Təmirdə", value: "repair" },
  { id: "3", label: "Silinib", value: "deleted" },
];

const categoryOptions = [
  { id: "1", label: "İT Avadanlıqları", value: "it" },
  { id: "2", label: "Mebel", value: "furniture" },
  { id: "3", label: "Nəqliyyat", value: "transport" },
];

const businessUnitOptions = [
  { id: "1", label: "Azera Holding", value: "azera" },
  { id: "2", label: "Construction LLC", value: "const" },
];

const departmentOptions = [
  { id: "1", label: "İT Departamenti", value: "it" },
  { id: "2", label: "Maliyyə", value: "finance" },
  { id: "3", label: "Təsərrüfat", value: "teserrufat" },
];

const locationOptions = [
  { id: "1", label: "Baş Ofis", value: "main" },
  { id: "2", label: "Anbar 1", value: "warehouse1" },
];

const employeeOptions = [
  { id: "1", label: "Allahverdi Agamaliyev", value: "1" },
  { id: "2", label: "Turan Hasanov", value: "2" },
];

const AddActiveInventoryPage = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState<Option | null>(null);
  const [subCategory, setSubCategory] = useState<Option | null>(null);
  const [status, setStatus] = useState<Option | null>(null);
  const [businessUnit, setBusinessUnit] = useState<Option | null>(null);
  const [department, setDepartment] = useState<Option | null>(null);
  const [location, setLocation] = useState<Option | null>(null);
  const [employee, setEmployee] = useState<Option | null>(null);

  const handleBack = () => {
    navigate(ROUTES.TESERRUFAT.IS_SIFARISLERI.LIST.LINK);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  return (
    <div className={styles.container}>
      <PageHeader title="Yeni aktiv əlavə et" />

      <form className={styles.formContent} onSubmit={handleSubmit}>
        <div className={styles.mainGrid}>
          {/* Left Column */}
          <div className={styles.column}>
            {/* Esas Melumatlar Section */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Əsas məlumatlar</h3>
                <p className={styles.sectionSubtitle}>
                  Aktivin adı və kateqoriya/status məlumatları
                </p>
              </div>

              <div className={styles.fieldGroup}>
                <FormInput
                  id="name"
                  type="text"
                  label="Ad"
                  placeholder="Ad daxil edin"
                  required
                />
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
                    onChange={(option) => {
                      setCategory(option);
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
                    options={[]}
                    value={subCategory}
                    onChange={(option) => setSubCategory(option)}
                    defaultText="Seçin..."
                    disabled={!category}
                  />
                  <span className={styles.hint}>
                    Üst kateqoriya seçdikdən sonra uyğun altlar görünəcək.
                  </span>
                </div>
              </div>
              <div className={styles.row2}>
                <div className={`${styles.field} ${styles.statusSelect}`}>
                  <label className={styles.fieldLabel}>
                    Status <span className={styles.required}>*</span>
                  </label>
                  <CustomSelect
                    options={statusOptions}
                    value={status}
                    onChange={(option) => setStatus(option)}
                    defaultText="Seçin..."
                    className={styles.customSelectStatus}
                  />
                </div>
                <FormInput
                  label="Serial nömrə"
                  placeholder="SN..."
                  id="serialNumber"
                  type="text"
                />
              </div>

              <div className={styles.row2}>
                <div className={styles.field}>
                  <FormInput
                    label="Marka"
                    placeholder="məs: HP, Dell, Apple"
                    id="brand"
                    type="text"
                  />
                </div>
                <div className={styles.field}>
                  <FormInput
                    label="Model"
                    placeholder="məs: 257sa, XPS"
                    id="model"
                    type="text"
                  />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Şəkillər</label>
                <FileDropzone
                  id="filezoneid"
                  label="Fayl əlavə et"
                  onChange={(files: File[] | null) => console.log(files)}
                />
              </div>
            </section>

            {/* Alis Melumatlari Section */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Alış məlumatları</h3>
                <p className={styles.sectionSubtitle}>
                  İstəyə bağlı: tarix və məbləğ
                </p>
              </div>

              <div className={styles.row2}>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>Alış tarixi</label>
                  <ModernDatePicker
                    placeholder="mm/dd/yyyy"
                    id="purchaseDate"
                    value={null}
                    onChange={(date) => console.log(date)}
                  />
                </div>
                <div className={styles.field}>
                  <FormInput
                    label="Alış məbləği"
                    placeholder="məs: 1250.50"
                    type="number"
                    id="purchasePrice"
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className={styles.column}>
            {/* Struktur Section */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Struktur</h3>
                <p className={styles.sectionSubtitle}>
                  Biznes vahidi, departament və lokasiya seçimi
                </p>
              </div>

              <div className={styles.row2}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>
                    Biznes vahidi <span className={styles.required}>*</span>
                  </label>
                  <CustomSelect
                    options={businessUnitOptions}
                    defaultText="Seçin..."
                    id="businessUnit"
                    value={businessUnit}
                    onChange={(value) => {
                      setBusinessUnit(value);
                      setDepartment(null);
                      setLocation(null);
                      setEmployee(null);
                    }}
                    isSearchable={true}
                    searchPlaceholder="Biznes vahidi axtar..."
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Departament</label>
                  <CustomSelect
                    options={departmentOptions}
                    defaultText="Seçin..."
                    id="department"
                    value={department}
                    onChange={(value) => {
                      setDepartment(value);
                      setLocation(null);
                      setEmployee(null);
                    }}
                    disabled={!businessUnit}
                    isSearchable={true}
                    searchPlaceholder="Departament axtar..."
                  />
                  {/* <span className={styles.hint}>
                  Biznes vahidi seçildikdən sonra uyğun departamentlər
                  görünəcək.
                </span> */}
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Lokasiya / şöbə</label>
                <CustomSelect
                  options={locationOptions}
                  defaultText="Seçin..."
                  id="location"
                  value={location}
                  onChange={(value) => setLocation(value)}
                  disabled={!department}
                />
                <span className={styles.hint}>
                  Departament seçildikdən sonra uyğun lokasiyalar görünəcək.
                </span>
              </div>
            </section>

            {/* Tehkim & Tehvil Section */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Təhkim & təhvil</h3>
                <p className={styles.sectionSubtitle}>
                  Məsul şəxs seçimi və təhvil tarixi
                </p>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                  Məsul şəxs (işçi) <span className={styles.required}>*</span>
                </label>
                <CustomSelect
                  options={employeeOptions}
                  defaultText="Öncə biznes vahidi və departament seçin..."
                  id="employee"
                  value={employee}
                  onChange={(value) => setEmployee(value)}
                  disabled={!businessUnit || !department}
                  isSearchable={true}
                  searchPlaceholder="İşçi axtar..."
                />
                <span className={styles.hint}>
                  İşçi seçimi yalnız seçilən Biznes vahidi + Departament üzrə
                  edilir.
                </span>
              </div>

              <div className={styles.row1}>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>Təhvil tarixi</label>
                  <ModernDatePicker
                    placeholder="mm/dd/yyyy"
                    id="grantDate"
                    onChange={(date) => console.log(date)}
                    value={null}
                  />
                  <span className={styles.hint}>
                    Boş saxlasanız sistem bugünkü tarixi götürəcək.
                  </span>
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <FormTextarea
                  label="Qeyd"
                  placeholder="İlkin inventarlaşdırma qeydi..."
                  rows={4}
                  id="note"
                  value=""
                  onChange={(value) => console.log(value)}
                />
              </div>

              <div className={styles.infoBox}>
                <p>
                  Məsul şəxs seçmək istəyirsinizsə, öncə{" "}
                  <strong>Biznes vahidi</strong> və <strong>Departament</strong>{" "}
                  seçilməlidir.
                </p>
              </div>
            </section>
            <div>
              <div className={styles.headerActions}>
                <Button
                  variant="default"
                  onClick={handleBack}
                  className={styles.cancelBtn}
                >
                  Ləğv et
                </Button>
                <Button
                  variant="primary"
                  className={styles.saveBtn}
                  onClick={() => {}}
                >
                  <CheckIcon className={styles.btnIcon} />
                  Yadda saxla
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddActiveInventoryPage;
