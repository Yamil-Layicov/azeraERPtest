import { useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./SalaryInfoTab.module.css";
import { MainSalaryInfo, type SalaryFormValues } from "./components/main-salary-info/MainSalaryInfo";
import { SalaryResultInfo } from "./components/salary-result-info/SalaryResultInfo";

export const SalaryInfoTab = () => {
  const [showResult, setShowResult] = useState(false);
  const { control, getValues } = useForm<SalaryFormValues>({
    defaultValues: {
      grossSalary: "",
      cashSalary: "",
      bonus: "",
      calculationYear: null,
      includeUnionDues: false,
    },
  });

  const handleCalculate = () => {
    setShowResult(true);
  };

  const formValues = showResult ? getValues() : null;
  const resultData =
    formValues &&
    ({
      calculationYear: formValues.calculationYear?.fullName ?? "",
      grossSalary: Number(formValues.grossSalary) || 0,
      cashSalary: Number(formValues.cashSalary) || 0,
      bonus: Number(formValues.bonus) || 0,
      netSalary: 0,
      totalCost: 0,
      incomeTax: 0,
      dsmfEmployee: 0,
      unemploymentEmployee: 0,
      itsEmployee: 0,
      dsmfEmployer: 0,
      unemploymentEmployer: 0,
      itsEmployer: 0,
      unionDues: 0,
      totalEmployeeDeductions: 0,
      totalEmployerDeductions: 0,
      totalDeductions: 0,
      payableAmount: 0,
    });

  return (
    <div className={styles.container}>
      <MainSalaryInfo control={control} onCalculate={handleCalculate} />
      <SalaryResultInfo data={resultData} />
    </div>
  );
};