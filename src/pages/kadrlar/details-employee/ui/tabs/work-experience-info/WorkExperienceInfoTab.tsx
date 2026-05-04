import { useState } from "react";
import styles from "./WorkExperienceInfoTab.module.css";
import { EmploymentTypeCards } from "./components/employment-type-cards";
import { WorkInputForm } from "./components/work-input-form";
import { WorkTable } from "./components/work-table";
import type { Option } from "@/shared/types";
import type { WorkInputFormValue } from "./components/work-input-form";
import type { WorkTableItem } from "./components/work-table";

const experienceTypeOptions: Option[] = [
  { id: "internal", fullName: "Daxili staj", role: "" },
  { id: "external", fullName: "Xarici staj", role: "" },
];

const positionOptions: Option[] = [
  { id: "dev", fullName: "Proqramçı", role: "" },
  { id: "manager", fullName: "Menecer", role: "" },
];

const initialWorkForm: WorkInputFormValue = {
  experienceType: null,
  workplace: "",
  position: null,
  appointmentDate: null,
  appointmentOrderNumber: "",
  releaseDate: null,
  releaseOrderNumber: "",
  releaseLegalBasis: null,
  resignationReason: "",
};

export const WorkExperienceInfoTab = () => {
  const [workForm, setWorkForm] = useState<WorkInputFormValue>(initialWorkForm);
  const [workTableItems, setWorkTableItems] = useState<WorkTableItem[]>([]);

  const handleWorkFormChange = (field: keyof WorkInputFormValue, val: Option | null | Date | null | string) => {
    setWorkForm((prev) => ({ ...prev, [field]: val }));
  };

  const handleWorkAddClick = () => {
    const id = Date.now();
    setWorkTableItems((prev) => [
      ...prev,
      {
        id,
        workplace: workForm.workplace,
        position: workForm.position?.fullName ?? "",
        appointmentDate: workForm.appointmentDate,
        appointmentOrderNumber: workForm.appointmentOrderNumber,
        releaseDate: workForm.releaseDate,
        releaseOrderNumber: workForm.releaseOrderNumber,
        releaseReason: workForm.resignationReason,
        experienceType: workForm.experienceType?.fullName ?? "",
        legalBasisOrTransfer: workForm.releaseLegalBasis?.fullName ?? "",
      },
    ]);
    setWorkForm(initialWorkForm);
  };

  const handleWorkRemove = (id: number) => {
    setWorkTableItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className={styles.container}>
      <EmploymentTypeCards />
      <WorkInputForm
        value={workForm}
        experienceTypeOptions={experienceTypeOptions}
        positionOptions={positionOptions}
        onChange={handleWorkFormChange}
        onAddClick={handleWorkAddClick}
        onClear={() => setWorkForm(initialWorkForm)}
      />
      <WorkTable data={workTableItems} onRemove={handleWorkRemove} />
    </div>
  );
};