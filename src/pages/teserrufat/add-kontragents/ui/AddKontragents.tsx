import React from "react";
import styles from "./AddKontragents.module.css";
import { RadioSwitch, Button, PageHeader } from "@/shared/ui";
import { useAddKontragentsPage } from "../model/useAddKontragentsPage";
import LegalEntityForm from "./forms/LegalEntityForm";
import PhysicalPersonForm from "./forms/PhysicalPersonForm";

const AddKontragents: React.FC = () => {
  const { formData, updateField, handleTypeChange, handleSubmit, handleClear } =
    useAddKontragentsPage();

  return (
    <div className={styles.formContainer}>
      <PageHeader title="Kontragent Əlavə Et" className={styles.customHeader}>
       <div className={styles.radioSwitch}>
         <RadioSwitch
          label=""
          name="kontragentType"
          value={formData.type}
          onChange={handleTypeChange}
          options={[
            { value: "physical", label: "Fiziki şəxs" },
            { value: "legal", label: "Hüquqi şəxs" },
          ]}
          
        />
       </div>
      </PageHeader>

      <form className={styles.form} onSubmit={handleSubmit}>
        {formData.type === "physical" ? (
          <PhysicalPersonForm formData={formData} updateField={updateField} />
        ) : (
          <LegalEntityForm formData={formData} updateField={updateField} />
        )}

        <div className={styles.buttonGroup}>
          <Button type="button" variant="clear" onClick={handleClear}>
            Təmizlə
          </Button>
          <Button type="submit" variant="primary">
            Əlavə et
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddKontragents;
