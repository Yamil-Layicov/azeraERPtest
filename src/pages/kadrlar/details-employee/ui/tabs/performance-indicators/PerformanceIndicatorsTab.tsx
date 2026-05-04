import React, { useState } from "react";
import { PerformanceForm, type PerformanceFormValue } from "./components/performance-form";
import { PerformanceTable } from "./components/performance-table";
import { IncentiveMeasuresSection } from "../../../../employee-shared/ui/incentive-measures-info";
import { DisciplinaryWarningsSection } from "../../../../employee-shared/ui/disciplinary-warnings-info";
import type {
  DisciplinaryWarningItem,
  IncentiveItem,
  NewDisciplinaryWarningState,
  NewIncentiveState,
} from "../../../../employee-shared/model/types";
import type { PerformanceTableItem } from "./components/performance-table";
import styles from "./PerformanceIndicatorsTab.module.css";

const initialPerformanceFormValue: PerformanceFormValue = {
  il: null,
  qiymet: "",
  illikBonusMeblegi: "",
};

const PerformanceIndicatorsTab: React.FC = () => {
  const [performanceFormValue, setPerformanceFormValue] =
    useState<PerformanceFormValue>(initialPerformanceFormValue);
  const [performanceItems, setPerformanceItems] = useState<PerformanceTableItem[]>([]);

  const handlePerformanceFieldChange = (
    field: keyof PerformanceFormValue,
    value: Date | null | string
  ) => {
    setPerformanceFormValue((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddPerformance = () => {
    const { il, qiymet, illikBonusMeblegi } = performanceFormValue;
    if (il == null || !qiymet.trim() || !illikBonusMeblegi.trim()) return;
    setPerformanceItems((prev) => [
      ...prev,
      { id: Date.now(), il, qiymet: qiymet.trim(), illikBonusMeblegi: illikBonusMeblegi.trim() },
    ]);
    setPerformanceFormValue(initialPerformanceFormValue);
  };

  const handleRemovePerformance = (id: string | number) => {
    setPerformanceItems((prev) => prev.filter((x) => x.id !== id));
  };

  const [newIncentive, setNewIncentive] = useState<NewIncentiveState>({
    adi: null,
    verilmeTarixi: null,
    sebebi: "",
    emrNomresi: "",
  });
  const [addedIncentives, setAddedIncentives] = useState<IncentiveItem[]>([]);

  const handleNewIncentiveChange = <K extends keyof NewIncentiveState>(
    field: K,
    value: NewIncentiveState[K]
  ) => {
    setNewIncentive((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddIncentive = () => {
    if (
      !newIncentive.adi ||
      !newIncentive.verilmeTarixi ||
      !newIncentive.sebebi.trim() ||
      !newIncentive.emrNomresi.trim()
    )
      return;
    const nextId = Date.now();
    setAddedIncentives((prev) => [
      ...prev,
      {
        id: nextId,
        adi: newIncentive.adi,
        verilmeTarixi: newIncentive.verilmeTarixi,
        sebebi: newIncentive.sebebi.trim(),
        emrNomresi: newIncentive.emrNomresi.trim(),
      },
    ]);
    setNewIncentive({ adi: null, verilmeTarixi: null, sebebi: "", emrNomresi: "" });
  };

  const handleRemoveIncentive = (id: string | number) => {
    setAddedIncentives((prev) => prev.filter((x) => x.id !== id));
  };

  const handleListIncentiveChange = <K extends keyof IncentiveItem>(
    id: string | number,
    field: K,
    value: IncentiveItem[K]
  ) => {
    setAddedIncentives((prev) =>
      prev.map((x) => (x.id === id ? { ...x, [field]: value } : x))
    );
  };

  // --- Disciplinary and written warnings (İntizam tənbehi tədbirləri və yazılı xəbərdarlıq) ---
  const [newDisciplinary, setNewDisciplinary] = useState<NewDisciplinaryWarningState>({
    adi: null,
    verilmeTarixi: null,
    sebebi: "",
    emrNomresi: "",
  });
  const [addedDisciplinary, setAddedDisciplinary] = useState<DisciplinaryWarningItem[]>([]);

  const handleNewDisciplinaryChange = <K extends keyof NewDisciplinaryWarningState>(
    field: K,
    value: NewDisciplinaryWarningState[K]
  ) => {
    setNewDisciplinary((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddDisciplinary = () => {
    if (
      !newDisciplinary.adi ||
      !newDisciplinary.verilmeTarixi ||
      !newDisciplinary.sebebi.trim() ||
      !newDisciplinary.emrNomresi.trim()
    )
      return;
    const nextId = Date.now();
    setAddedDisciplinary((prev) => [
      ...prev,
      {
        id: nextId,
        adi: newDisciplinary.adi,
        verilmeTarixi: newDisciplinary.verilmeTarixi,
        sebebi: newDisciplinary.sebebi.trim(),
        emrNomresi: newDisciplinary.emrNomresi.trim(),
      },
    ]);
    setNewDisciplinary({ adi: null, verilmeTarixi: null, sebebi: "", emrNomresi: "" });
  };

  const handleRemoveDisciplinary = (id: string | number) => {
    setAddedDisciplinary((prev) => prev.filter((x) => x.id !== id));
  };

  const handleListDisciplinaryChange = <K extends keyof DisciplinaryWarningItem>(
    id: string | number,
    field: K,
    value: DisciplinaryWarningItem[K]
  ) => {
    setAddedDisciplinary((prev) =>
      prev.map((x) => (x.id === id ? { ...x, [field]: value } : x))
    );
  };

  return (
    <div className={styles.container}>
      <PerformanceForm
        value={performanceFormValue}
        onChange={handlePerformanceFieldChange}
        onAdd={handleAddPerformance}
      />
      <PerformanceTable items={performanceItems} onRemove={handleRemovePerformance} />
      <IncentiveMeasuresSection
        newIncentive={newIncentive}
        addedIncentives={addedIncentives}
        onNewIncentiveChange={handleNewIncentiveChange}
        onAddIncentive={handleAddIncentive}
        onRemoveIncentive={handleRemoveIncentive}
        onListIncentiveChange={handleListIncentiveChange}
        title="Həvəsləndirmə tədbirləri barədə məlumat"
        disableListedIncentives={true}
      />
      <DisciplinaryWarningsSection
        title="İntizam tənbehi tədbirləri və yazılı xəbərdarlıq barədə məlumat"
        newItem={newDisciplinary}
        addedItems={addedDisciplinary}
        onNewItemChange={handleNewDisciplinaryChange}
        onAddItem={handleAddDisciplinary}
        onRemoveItem={handleRemoveDisciplinary}
        onListItemChange={handleListDisciplinaryChange}
        disableListedItems={true}
      />
    </div>
  );
};

export default PerformanceIndicatorsTab;
