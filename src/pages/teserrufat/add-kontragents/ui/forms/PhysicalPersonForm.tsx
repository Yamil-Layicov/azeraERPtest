import React from "react";
import styles from "./Tabs.module.css";
import {
  FormInput,
  CustomSelect,
  Checkbox,
  FormTextarea,
  ModernDatePicker,
} from "@/shared/ui";
import type { KontragentFormData } from "../../model/useAddKontragentsPage";

interface Props {
  formData: KontragentFormData;
  updateField: <K extends keyof KontragentFormData>(
    field: K,
    value: KontragentFormData[K],
  ) => void;
}

const PhysicalPersonForm: React.FC<Props> = ({ formData, updateField }) => {
  return (
    <>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Ümumi məlumatlar</h3>
        <div className={styles.grid4}>
          <FormInput
            type="text"
            id="firstName"
            placeholder="Ad"
            label="Ad"
            value={formData.firstName}
            onChange={(e) => updateField("firstName", e as unknown as string)}
          />
          <FormInput
            type="text"
            id="lastName"
            placeholder="Soyad"
            label="Soyad"
            value={formData.lastName}
            onChange={(e) => updateField("lastName", e as unknown as string)}
          />
          <FormInput
            type="text"
            id="fatherName"
            placeholder="Ata adı"
            label="Ata adı"
            value={formData.fatherName}
            onChange={(e) => updateField("fatherName", e as unknown as string)}
          />
          <div>
            <label htmlFor="">Status</label>
            <CustomSelect
              id="status"
              defaultText="Status"
              options={[
                { id: "active", label: "Aktiv" },
                { id: "passive", label: "Passiv" },
              ]}
              value={formData.status}
              onChange={(val) => updateField("status", val)}
            />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Şəxsiyyət məlumatları</h3>
        <div className={styles.grid4}>
          <FormInput
            type="text"
            id="finCode"
            placeholder="FİN kod"
            label="FİN kod"
            value={formData.finCode}
            onChange={(e) => updateField("finCode", e as unknown as string)}
          />
          <FormInput
            type="text"
            id="idSeries"
            placeholder="Ş/V seriyası və nömrəsi"
            label="Ş/V seriyası və nömrəsi"
            value={formData.idSeries}
            onChange={(e) => updateField("idSeries", e as unknown as string)}
          />
          <ModernDatePicker
            label="Doğum tarixi"
            value={formData.birthDate}
            onChange={(date) => updateField("birthDate", date)}
          />
          <div>
            <label htmlFor="">Cins</label>
            <CustomSelect
              id="gender"
              defaultText="Cins"
              options={[
                { id: "male", label: "Kişi" },
                { id: "female", label: "Qadın" },
              ]}
              value={formData.gender}
              onChange={(val) => updateField("gender", val)}
            />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Ünvan məlumatları</h3>
        <div className={styles.grid4}>
          <div>
            <label htmlFor="">Ölkə</label>
            <CustomSelect
              id="country"
              defaultText="Ölkə"
              options={[]}
              value={formData.country}
              onChange={(val) => updateField("country", val)}
            />
          </div>
          <div>
            <label htmlFor="">Şəhər</label>
            <CustomSelect
              id="city"
              defaultText="Şəhər"
              options={[]}
              value={formData.city}
              onChange={(val) => updateField("city", val)}
            />
          </div>
          <FormInput
            type="text"
            id="postalCode"
            placeholder="Poçt indeksi"
            label="Poçt indeksi"
            value={formData.postalCode}
            onChange={(e) => updateField("postalCode", e as unknown as string)}
          />

          <FormInput
            type="text"
            id="address"
            placeholder="Ünvan"
            label="Ünvan"
            value={formData.address}
            onChange={(e) => updateField("address", e as unknown as string)}
          />
        </div>
        <div className={styles.row}></div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Bank məlumatları</h3>
        <div className={styles.grid3}>
          <FormInput
            type="text"
            id="bankName"
            placeholder="Bank adı"
            label="Bank adı"
            value={formData.bankName}
            onChange={(e) => updateField("bankName", e as unknown as string)}
          />
          <FormInput
            type="text"
            id="iban"
            placeholder="IBAN"
            label="IBAN"
            value={formData.iban}
            onChange={(e) => updateField("iban", e as unknown as string)}
          />
          <FormInput
            type="text"
            id="swift"
            placeholder="SWIFT (xarici ödəniş üçün)"
            label="SWIFT (xarici ödəniş üçün)"
            value={formData.swift}
            onChange={(e) => updateField("swift", e as unknown as string)}
          />
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Əlaqə məlumatları</h3>
        <div className={styles.grid3}>
          <FormInput
            type="text"
            id="phone"
            placeholder="Telefon"
            label="Telefon"
            value={formData.phone}
            onChange={(e) => updateField("phone", e as unknown as string)}
          />
          <FormInput
            type="text"
            id="email"
            placeholder="E-poçt"
            label="E-poçt"
            value={formData.email}
            onChange={(e) => updateField("email", e as unknown as string)}
          />
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Kontragent tipi</h3>
            <div className={styles.checkboxRow}>
              <Checkbox
                id="isCustomer"
                label="Müştəri"
                checked={formData.isCustomer}
                onChange={(e) => updateField("isCustomer", e)}
              />
              <Checkbox
                id="isSupplier"
                label="Tədarükçü"
                checked={formData.isSupplier}
                onChange={(e) => updateField("isSupplier", e)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Əlavə məlumatlar</h3>
        <div className={styles.row}>
          <FormTextarea
            id="note"
            placeholder="Qeyd"
            label=""
            value={formData.note}
            onChange={(e) => updateField("note", e as unknown as string)}
          />
        </div>
      </div>
    </>
  );
};

export default PhysicalPersonForm;
