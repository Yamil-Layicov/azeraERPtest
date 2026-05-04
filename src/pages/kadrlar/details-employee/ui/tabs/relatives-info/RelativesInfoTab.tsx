import React, { useState } from "react";
import styles from "./RelativesInfoTab.module.css";
import { RelativesInputForm, type RelativesFormState } from "./components/relatives-form/RelativesInputForm";
import { RelativesTable, type RelativeItem } from "./components/relatives-table";
import toast from "react-hot-toast";

const RelativesInfoTab: React.FC = () => {
  const [relativesList, setRelativesList] = useState<RelativeItem[]>([]);

  const handleAdd = (formData: RelativesFormState) => {
    const newItem: RelativeItem = {
      id: Date.now().toString(), // Unikal ID
      degree: formData.degree,
      surname: formData.surname,
      name: formData.name,
      patronymic: formData.patronymic,
      birthDate: formData.birthDate,
      birthCity: formData.birthCity?.fullName ?? "",
      workplace: formData.workplace,
      pin: formData.pin,
      address: formData.address,
      isDeceased: formData.isDeceased,
      isPensioner: formData.isPensioner,
    };

    setRelativesList((prev) => [...prev, newItem]);
  };

  const handleRemove = (id: string) => {
    setRelativesList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleEdit = (item: RelativeItem) => {
    toast.error("Xəta baş verdi. item.id: " + item.id);
  };

  return (
    <div className={styles.container}>
      <RelativesInputForm onAdd={handleAdd} />
      <RelativesTable 
        data={relativesList} 
        onRemove={handleRemove}
        onEdit={handleEdit}
      />
    </div>
  );
};

export default RelativesInfoTab;