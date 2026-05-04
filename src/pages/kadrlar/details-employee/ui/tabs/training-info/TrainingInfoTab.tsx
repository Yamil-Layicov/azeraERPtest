import React, { useState } from "react";
import { TrainingForm } from "./components/training-form";
import type { TrainingFormValue } from "./components/training-form";
import { TrainingTable, type TrainingTableItem } from "./components/training-table";
import styles from "./TrainingInfoTab.module.css";

const initialFormValue: TrainingFormValue = {
  telimNovu: null,
  kursunAdi: "",
  baslamaTarixi: null,
  bitmeTarixi: null,
  sertifikatTarixi: null,
  sertifikatNomresi: "",
  uploadedFiles: [],
};

const TrainingInfoTab: React.FC = () => {
  const [formValue, setFormValue] = useState<TrainingFormValue>(initialFormValue);
  const [items, setItems] = useState<TrainingTableItem[]>([]);

  const handleClear = () => {
    setFormValue(initialFormValue);
  };

  const handleAdd = () => {
    const newItem: TrainingTableItem = {
      id: Date.now(),
      telimNovu: formValue.telimNovu,
      kursunAdi: formValue.kursunAdi,
      baslamaTarixi: formValue.baslamaTarixi,
      bitmeTarixi: formValue.bitmeTarixi,
      sertifikatTarixi: formValue.sertifikatTarixi,
      sertifikatNomresi: formValue.sertifikatNomresi,
      fileCount: formValue.uploadedFiles.length,
    };
    setItems((prev) => [...prev, newItem]);
    handleClear();
  };

  const handleRemove = (id: number) => {
    setItems((prev) => prev.filter((row) => row.id !== id));
  };

  return (
    <div className={styles.container}>
      <TrainingForm
        value={formValue}
        onChange={setFormValue}
        onAdd={handleAdd}
        onClear={handleClear}
      />
      <TrainingTable items={items} onRemove={handleRemove} />
    </div>
  );
};

export default TrainingInfoTab;
