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

const LegalEntityForm: React.FC<Props> = ({ formData, updateField }) => {
  return (
    <>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Ümumi məlumatlar</h3>
        <div className={styles.grid4}>
          <FormInput
            id="legalName"
            type="text"
            label="Hüquqi Adı"
            value={formData.legalName}
            onChange={(e) => updateField("legalName", e)}
            placeholder="ABC Tech MMC"
          />
          <FormInput
            id="shortName"
            type="text"
            placeholder="Qısa adı"
            label="Qısa adı"
            value={formData.shortName}
            onChange={(e) => updateField("shortName", e)}
          />
          <div>
            <label htmlFor="">Hüquqi forma</label>
            <CustomSelect
              id="legalForm"
              defaultText="Hüquqi forma"
              options={[
                { id: "mmc", label: "MMC" },
                { id: "asc", label: "ASC" },
                { id: "ojsc", label: "QSC" },
              ]}
              value={formData.legalForm}
              onChange={(val) => updateField("legalForm", val)}
            />
          </div>
          <div>
            <label htmlFor="">Status</label>
            <CustomSelect
              id="Status"
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
        <h3 className={styles.sectionTitle}>Vergi və qeydiyyat məlumatları</h3>
        <div className={styles.grid4}>
          <FormInput
            placeholder="VÖEN"
            id="voen"
            type="text"
            label="VÖEN"
            value={formData.voen}
            onChange={(e) => updateField("voen", e)}
          />
          <FormInput
            placeholder="Qeydiyyat nömrəsi"
            id="registrationNumber"
            type="text"
            label="Qeydiyyat nömrəsi"
            value={formData.registrationNumber}
            onChange={(e) => updateField("registrationNumber", e)}
          />
          <FormInput
            placeholder="Vergi orqanı"
            id="taxAuthority"
            type="text"
            label="Vergi orqanı"
            value={formData.taxAuthority}
            onChange={(e) => updateField("taxAuthority", e)}
          />
          <ModernDatePicker
            label="Qeydiyyat tarixi"
            value={formData.registrationDate}
            onChange={(date) => updateField("registrationDate", date)}
          />
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Ölkə və ünvan məlumatları</h3>
        <div className={styles.grid5}>
          <div>
            <label htmlFor="">Ölkə</label>
            <CustomSelect
              defaultText="Ölkə"
              options={[]}
              value={formData.country}
              onChange={(val) => updateField("country", val)}
            />
          </div>
          <div>
            <label htmlFor="">Şəhər</label>
            <CustomSelect
              defaultText="Ölkə"
              options={[]}
              value={formData.country}
              onChange={(val) => updateField("country", val)}
            />
          </div>

          <FormInput
            placeholder="Hüquqi ünvan"
            id="legalAddress"
            type="text"
            label="Hüquqi ünvan"
            value={formData.legalAddress}
            onChange={(e) => updateField("legalAddress", e)}
          />
          <FormInput
            placeholder="Faktiki ünvan"
            id="actualAddress"
            type="text"
            label="Faktiki ünvan"
            value={formData.actualAddress}
            onChange={(e) => updateField("actualAddress", e)}
          />
          <FormInput
            placeholder="Poçt indeksi"
            id="postalCode"
            type="text"
            label="Poçt indeksi"
            value={formData.postalCode}
            onChange={(e) => updateField("postalCode", e)}
          />
        </div>
      </div>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Əlaqəli şəxslər</h3>
        <div className={styles.grid5}>
          <FormInput
            placeholder="Ad"
            id="relatedPersonName"
            type="text"
            label="Ad"
            value={formData.relatedPersonName}
            onChange={(e) => updateField("relatedPersonName", e)}
          />
          <FormInput
            placeholder="Soyad"
            id="relatedPersonSurname"
            type="text"
            label="Soyad"
            value={formData.relatedPersonSurname}
            onChange={(e) => updateField("relatedPersonSurname", e)}
          />
          <FormInput
            id="relatedPersonPosition"
            type="text"
            placeholder="Vəzifə"
            label="Vəzifə"
            value={formData.relatedPersonPosition}
            onChange={(e) => updateField("relatedPersonPosition", e)}
          />
          <FormInput
            id="relatedPersonPhone"
            type="text"
            placeholder="Telefon nömrəsi"
            label="Telefon nömrəsi"
            value={formData.relatedPersonPhone}
            onChange={(e) => updateField("relatedPersonPhone", e)}
          />
          <FormInput
            id="relatedPersonEmail"
            type="text"
            placeholder="E-poçt"
            label="E-poçt"
            value={formData.relatedPersonEmail}
            onChange={(e) => updateField("relatedPersonEmail", e)}
          />
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Bank məlumatları</h3>
        <div className={styles.grid5}>
          <FormInput
            id="bankName"
            type="text"
            label="Bank adı"
            placeholder="Bank adı"
            value={formData.bankName}
            onChange={(e) => updateField("bankName", e)}
          />
          <FormInput
            id="iban"
            type="text"
            label="IBAN"
            placeholder="IBAN"
            value={formData.iban}
            onChange={(e) => updateField("iban", e)}
          />
          <FormInput
            label="SWIFT / BIC"
            id="swift"
            type="text"
            placeholder="SWIFT / BIC"
            value={formData.swift}
            onChange={(e) => updateField("swift", e)}
          />
          <div>
            <label htmlFor="">Valyuta</label>
            <CustomSelect
              defaultText="Valyuta"
              options={[
                { id: "azn", label: "AZN" },
                { id: "usd", label: "USD" },
                { id: "eur", label: "EUR" },
              ]}
              value={formData.currency}
              onChange={(val) => updateField("currency", val)}
            />
          </div>
          <div>
            <label htmlFor="">Əsas hesab</label>
            <Checkbox
              id="isMainAccount"
              label="Əsas hesab"
              checked={formData.isMainAccount}
              onChange={(e) => updateField("isMainAccount", e)}
            />
          </div>
        </div>
      </div>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Əlaqə məlumatları</h3>
        <div className={styles.grid3}>
          <FormInput
            id="phone"
            type="text"
            placeholder="Telefon nömrəsi"
            label="Telefon nömrəsi"
            value={formData.phone}
            onChange={(e) => updateField("phone", e)}
          />
          <FormInput
            id="email"
            type="text"
            placeholder="E-poçt"
            label="E-poçt"
            value={formData.email}
            onChange={(e) => updateField("email", e)}
          />
          <FormInput
            placeholder="Veb sayt"
            id="website"
            type="text"
            label="Veb sayt"
            value={formData.website}
            onChange={(e) => updateField("website", e)}
          />
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          Kontragent tipi ve ƏDV məlumatı{" "}
        </h3>
        <div className={styles.grid5}>
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
          <Checkbox
            id="isVatPayer"
            label="ƏDV ödəyiciqqqsi"
            checked={formData.isVatPayer}
            onChange={(e) => updateField("isVatPayer", e)}
          />
          {formData.isVatPayer && (
            <FormInput
              id="vatRate"
              label="ƏDV faizi (%)"
              placeholder="ƏDV faizi (%)"
              type="number"
              value={formData.vatRate}
              onChange={(e) => updateField("vatRate", e)}
            />
          )}
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.checkboxRow}></div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Əlavə məlumatlar</h3>
        <div className={styles.row}>
          <FormTextarea
            id="note"
            label=""
            placeholder="Qeyd"
            value={formData.note}
            onChange={(e) => updateField("note", e)}
          />
        </div>
      </div>
    </>
  );
};

export default LegalEntityForm;
