import React, { useState, useEffect } from "react";
import styles from "./RelativesInputForm.module.css";
import { FormInput } from "@/shared/ui/input";
import { EnumLookupSelect, CitiesLookupSelect } from "@/features/lookups";
import { useEnumItemsByCode } from "@/features/lookups/hooks";
import { ModernDatePicker } from "@/shared/ui/date-picker";
import { Checkbox } from "@/shared/ui/checkbox";
import { Button } from "@/shared/ui/button";
import type { Option } from "@/shared/types";
import { toast } from "react-hot-toast";

// Formun state tipi
export interface RelativesFormState {
  degree: Option | null;
  isDeceased: boolean;
  isPensioner: boolean;
  surname: string;
  name: string;
  patronymic: string;
  birthDate: Date | null;
  birthCountry: Option | null;
  birthCity: Option | null;
  workplace: string;
  pin: string;
  address: string;
  isChild: boolean;
  isForeignCitizen?: boolean;
  socialStatuses?: string[];
}

// Props: Valideynə məlumat ötürmək üçün
interface RelativesInputFormProps {
  onAdd: (data: RelativesFormState) => void;
}

// const emptyOptions: Option[] = []; // Əgər EnumLookupSelect boş gəlirsə, bu default olaraq istifadə ediləcək

export const RelativesInputForm: React.FC<RelativesInputFormProps> = ({ onAdd }) => {
  const { rawData, refetch } = useEnumItemsByCode("SocialStatus", true);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const socialStatusItems = (rawData || [])
    .filter((item: any) => item.disabled === false)
    .map((item: any) => ({
      value: item.value,
      label: item.label,
    }));

  const initialData: RelativesFormState = {
    degree: null,
    isDeceased: false,
    isPensioner: false,
    surname: "",
    name: "",
    patronymic: "",
    birthDate: null,
    birthCountry: null,
    birthCity: null,
    workplace: "",
    pin: "",
    address: "",
    isChild: false,
    isForeignCitizen: false,
    socialStatuses: [],
  };

  const [formData, setFormData] = useState<RelativesFormState>(initialData);

  const handleChange = (
    field: keyof RelativesFormState,
    value: RelativesFormState[keyof RelativesFormState]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSocialStatusToggle = (code: string, checked: boolean) => {
    setFormData((prev) => {
      // If checked, it becomes the only status. If unchecked, statuses become empty.
      const newStatuses = checked ? [code] : [];
      
      const newState = { 
        ...prev, 
        socialStatuses: newStatuses,
        // Reset legacy fields
        isDeceased: false,
        isPensioner: false,
        isChild: false
      };
      
      // Set the specific legacy field if it matches the current code
      if (checked) {
        if (code === "Deceased") newState.isDeceased = true;
        if (code === "Pensioner") newState.isPensioner = true;
        if (code === "Child") newState.isChild = true;
      }
      
      return newState;
    });
  };

  const handleSubmit = () => {
    if (!formData.surname || !formData.name) {
       toast.error("Zəhmət olmasa Ad və Soyad daxil edin");
       return;
    }
    onAdd(formData);
    setFormData(initialData);
  };

  const handleClear = () => {
    setFormData(initialData);
  };

  return (
    <div className={styles.container}>
      {/* --- ROW 1: Qohumluq dərəcəsi + Checkboxlar --- */}
      <div className={styles.rowOne}>
        <div className={`${styles.selectWrapper} ${styles.field}`}>
          <span className={styles.label}>Qohumluq dərəcəsi*</span>
          <EnumLookupSelect
            id="relatives-degree"
            code="RelationshipTypes"
            value={formData.degree}
            onChange={(val) => handleChange("degree", val)}
            defaultText="Seçin"
          />
        </div>
        
        <div className={styles.checkboxGroup}>
          {socialStatusItems.map((item: any) => (
            <Checkbox
              key={item.value}
              id={`relatives-${item.value}`}
              label={item.label}
              checked={formData.socialStatuses?.includes(item.value) || false}
              onChange={(checked) => handleSocialStatusToggle(item.value, checked)}
            />
          ))}
        </div>
      </div>

      {/* --- ROW 2: Soyad, Ad, Ata adı --- */}
      <div className={styles.gridThree}>
        <div className={styles.field}>
          <FormInput
            id="relatives-surname"
            type="text"
            label="Soyad"
            value={formData.surname}
            onChange={(val) => handleChange("surname", val)}
            placeholder="Daxil edin"
          />
        </div>
        <div className={styles.field}>
          <FormInput
            id="relatives-name"
            type="text"
            label="Ad"
            value={formData.name}
            onChange={(val) => handleChange("name", val)}
            placeholder="Daxil edin"
          />
        </div>
        <div className={styles.field}>
          <FormInput
            id="relatives-patronymic"
            type="text"
            label="Ata adı"
            value={formData.patronymic}
            onChange={(val) => handleChange("patronymic", val)}
            placeholder="Daxil edin"
          />
        </div>
      </div>

      {/* --- ROW 3: Doğum tarixi, Şəhər, İş yeri --- */}
      <div className={styles.gridThree}>
        <div className={styles.field}>
          <span className={styles.label}>Doğum tarixi</span>
          <ModernDatePicker
            value={formData.birthDate}
            onChange={(date) => handleChange("birthDate", date)}
          />
        </div>
        <div className={styles.field}>
          <span className={styles.label}>Doğulduğu şəhər/rayon</span>
          <CitiesLookupSelect
            id="relatives-birthCity"
            countryCode="AZE"
            value={formData.birthCity}
            onChange={(val) => handleChange("birthCity", val)}
            defaultText="Seçin"
          />
        </div>
        <div className={styles.field}>
          <FormInput
            id="relatives-workplace"
            type="text"
            label="İş yeri"
            value={formData.workplace}
            onChange={(val) => handleChange("workplace", val)}
            placeholder="Daxil edin"
          />
        </div>
      </div>

      {/* --- ROW 4: FIN, Ünvan --- */}
      <div className={styles.gridTwo}>
        <div className={styles.field}>
          <FormInput
            id="relatives-pin"
            type="text"
            label="FİN"
            value={formData.pin}
            onChange={(val) => handleChange("pin", (val ?? "").toUpperCase())}
            maxLength={7}
            placeholder="7 simvol"
            disabled={formData.isForeignCitizen}
          />
          <Checkbox
            id="relatives-isForeignCitizen"
            label="Xarici vətəndaş"
            checked={!!formData.isForeignCitizen}
            onChange={(checked) => {
              handleChange("isForeignCitizen", checked);
              if (checked) {
                handleChange("pin", "");
              }
            }}
          />
        </div>
        <div className={styles.field}>
          <FormInput
            id="relatives-address"
            type="text"
            label="Yaşadığı ünvan"
            value={formData.address}
            onChange={(val) => handleChange("address", val)}
            placeholder="Daxil edin"
          />
        </div>
      </div>

      {/* --- Buttons --- */}
      <div className={styles.actions}>
      <Button type="button" variant="secondary" className={styles.addButton} onClick={handleSubmit}>
          Əlavə et
        </Button>
        <Button type="button" variant="outline" className={styles.clearButton} onClick={handleClear}>
          Təmizlə
        </Button>
      </div>
    </div>
  );
};