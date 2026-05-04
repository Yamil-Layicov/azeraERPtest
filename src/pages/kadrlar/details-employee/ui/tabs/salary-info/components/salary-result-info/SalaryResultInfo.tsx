import React from "react";
import styles from "./SalaryResultInfo.module.css";

interface SalaryResultData {
  calculationYear: string;
  grossSalary: number;
  cashSalary: number;
  bonus: number;
  netSalary: number;
  totalCost: number;
  incomeTax: number;
  dsmfEmployee: number;
  unemploymentEmployee: number;
  itsEmployee: number;
  dsmfEmployer: number;
  unemploymentEmployer: number;
  itsEmployer: number;
  unionDues: number;
  totalEmployeeDeductions: number;
  totalEmployerDeductions: number;
  totalDeductions: number;
  payableAmount: number;
}

interface SalaryResultInfoProps {
  data?: SalaryResultData | null;
}

export const SalaryResultInfo: React.FC<SalaryResultInfoProps> = ({ data }) => {
  const formatMoney = (amount?: number) => {
    return (amount || 0).toFixed(2);
  };

  const safeData: SalaryResultData = data ?? {
    calculationYear: "",
    grossSalary: 0,
    cashSalary: 0,
    bonus: 0,
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
  };

  return (
    <div className={styles.container}>
      {/* HEADER */}
      <div className={styles.header}>
        <span className={styles.headerTitle}>Əmək haqqı üzrə göstəricilər</span>
        <span className={styles.headerSubtitle}>Məbləğ (AZN)</span>
      </div>

      {/* ROWS */}
      <ResultRow
        label="Hesablama ili"
        value={safeData.calculationYear?.trim() ? safeData.calculationYear : "—"}
        isPrimary
      />
      <ResultRow
        label="Əmək haqqı (GROSS)"
        value={formatMoney(safeData.grossSalary)}
        isPrimary
      />
      <ResultRow
        label="Əmək haqqı (kassa)"
        value={formatMoney(safeData.cashSalary)}
        isPrimary
      />
      <ResultRow
        label="Bonus"
        value={formatMoney(safeData.bonus)}
        isPrimary
      />
      <ResultRow
        label="Yekun əmək haqqı NET"
        value={formatMoney(safeData.netSalary)}
        isBold
        isSummary
        isPrimary
      />

      <ResultRow
        label="Cəmi əmək haqqı xərci"
        value={formatMoney(safeData.totalCost)}
        isBold
        isSummary
        dividerAfter
      />

      <ResultRow
        label="Gəlir vergisi (işçidən tutulan)"
        value={formatMoney(safeData.incomeTax)}
      />
      <ResultRow
        label="DSMF ayırmaları (işçidən tutulan)"
        value={formatMoney(safeData.dsmfEmployee)}
      />
      <ResultRow
        label="İşsizlikdən sığorta haqqı (işçidən tutulan)"
        value={formatMoney(safeData.unemploymentEmployee)}
      />
      <ResultRow
        label="İcbari tibbi sığorta haqqı (işçidən tutulan)"
        value={formatMoney(safeData.itsEmployee)}
      />

      <ResultRow
        label="DSMF ayırmaları (işəgötürəndən tutulan)"
        value={formatMoney(safeData.dsmfEmployer)}
      />
      <ResultRow
        label="İşsizlikdən sığorta haqqı (işəgötürəndən tutulan)"
        value={formatMoney(safeData.unemploymentEmployer)}
      />
      <ResultRow
        label="İcbari tibbi sığorta haqqı (işəgötürəndən tutulan)"
        value={formatMoney(safeData.itsEmployer)}
      />

      <ResultRow
        label="Həmkarlar haqqı (əgər seçilibsə)"
        value={formatMoney(safeData.unionDues)}
      />

      <ResultRow
        label="Cəmi işçidən tutulmuşdur"
        value={formatMoney(safeData.totalEmployeeDeductions)}
      />
      <ResultRow
        label="Cəmi işəgötürəndən tutulmuşdur"
        value={formatMoney(safeData.totalEmployerDeductions)}
        dividerAfter
      />

      <ResultRow
        label="Cəmi tutulmalar"
        value={formatMoney(safeData.totalDeductions)}
        isBold
        isSummary
      />

      <ResultRow
        label="Rəsmi əmək haqqından işçiyə ödənilməli məbləğ"
        value={formatMoney(safeData.payableAmount)}
        isBold
        isFinal
      />
    </div>
  );
};

const ResultRow = ({
  label,
  value,
  isBold = false,
  isPrimary = false,
  isSummary = false,
  isFinal = false,
  dividerAfter = false,
}: {
  label: string;
  value: string;
  isBold?: boolean;
  isPrimary?: boolean;
  isSummary?: boolean;
  isFinal?: boolean;
  dividerAfter?: boolean;
}) => {
  const rowClass = [
    styles.row,
    isPrimary && styles.rowPrimary,
    isSummary && styles.rowSummary,
    isFinal && styles.rowFinal,
    dividerAfter && styles.rowDividerAfter,
  ]
    .filter(Boolean)
    .join(" ");
  const labelClass = [
    styles.label,
    isBold && styles.boldText,
    isPrimary && styles.primaryText,
  ]
    .filter(Boolean)
    .join(" ");
  const valueClass = [
    styles.value,
    isBold && styles.boldText,
    isPrimary && styles.primaryText,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={rowClass}>
      <span className={labelClass}>{label}</span>
      <span className={valueClass}>{value}</span>
    </div>
  );
};
