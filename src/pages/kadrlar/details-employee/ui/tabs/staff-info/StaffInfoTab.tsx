import { useState } from "react";
import type { Option } from "@/shared/types";
import { StaffTableSection, type StaffTableFormData } from "./components/staff-table";
import styles from "./StaffInfoTab.module.css";

const DEFAULT_DEPARTAMENT_OPTIONS: Option[] = [
  { id: "dep-1", fullName: "Departament 1", role: "" },
  { id: "dep-2", fullName: "Departament 2", role: "" },
  { id: "dep-3", fullName: "Departament 3", role: "" },
];

const DEFAULT_VEZIFE_OPTIONS: Option[] = [
  { id: "vez-1", fullName: "Vəzifə 1", role: "" },
  { id: "vez-2", fullName: "Vəzifə 2", role: "" },
  { id: "vez-3", fullName: "Vəzifə 3", role: "" },
];

export const StaffInfoTab = () => {
  const [formData, setFormData] = useState<StaffTableFormData>({
    departament: null,
    vezife: null,
    resmilesmeFormasi: null,
  });

  const handleChange = (field: keyof StaffTableFormData, value: StaffTableFormData[keyof StaffTableFormData]) => {
    setFormData((prev) => ({ ...prev, [field]: value } as StaffTableFormData));
  };

  return (
    <div className={styles.container}>
      <StaffTableSection
        value={formData}
        departamentOptions={DEFAULT_DEPARTAMENT_OPTIONS}
        vezifeOptions={DEFAULT_VEZIFE_OPTIONS}
        onChange={handleChange}
      />
    </div>
  );
};

