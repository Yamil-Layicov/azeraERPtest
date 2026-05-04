import React from "react";
import styles from "./SalaryResultInfo.module.css";

interface SalaryResultData {
  calculationYear?: string | number;
  grossSalary?: number;
  informalSalary?: number;
  bonus?: number;
  includeTradeUnionFee?: boolean;
  finalNetSalary?: number;
  totalSalaryCost?: number;
  incomeTaxEmployee?: number;
  socialSecurityEmployee?: number;
  unemploymentInsuranceEmployee?: number;
  mandatoryHealthInsuranceEmployee?: number;
  socialSecurityEmployer?: number;
  unemploymentInsuranceEmployer?: number;
  mandatoryHealthInsuranceEmployer?: number;
  tradeUnionFee?: number;
  totalDeductionsFromEmployee?: number;
  totalDeductionsFromEmployer?: number;
  totalDeductions?: number;
  netOfficialSalary?: number;
}

interface SalaryResultInfoProps {
  data?: SalaryResultData | null;
}

export const SalaryResultInfo: React.FC<SalaryResultInfoProps> = ({ data }) => {
  const getVal = (val?: number): number => {
    return Number(val ?? 0);
  };

  const formatMoney = (val: number) => val.toFixed(2);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.headerTitle}>Əmək haqqı üzrə göstəricilər</span>
        <span className={styles.headerSubtitle}>Məbləğ (AZN)</span>
      </div>

      <ResultRow
        label="Hesablama ili"
        value={String(data?.calculationYear || "—")}
        isPrimary
      />
      <ResultRow
        label="Əmək haqqı (GROSS)"
        value={formatMoney(getVal(data?.grossSalary))}
        isPrimary
      />
      <ResultRow
        label="Əmək haqqı (Kassa)"
        value={formatMoney(getVal(data?.informalSalary))}
        isPrimary
      />
      <ResultRow
        label="Bonus (Mükafat)"
        value={formatMoney(getVal(data?.bonus))}
        isPrimary
      />
      <ResultRow
        label="Həmkarlar haqqı"
        value={data?.includeTradeUnionFee ? "var" : "yoxdur"}
        isPrimary
      />
      <ResultRow
        label="Net Əmək Haqqı (Cəmi)"
        value={formatMoney(getVal(data?.finalNetSalary))}
        isBold
        isSummary
        isPrimary
      />

      <ResultRow
        label="Ümumi əmək haqqı xərci (Şirkət)"
        value={formatMoney(getVal(data?.totalSalaryCost))}
        isBold
        isSummary
        dividerAfter
      />

      {/* İşçidən Tutulmalar */}
      <ResultRow
        label="Gəlir vergisi (İşçi)"
        value={formatMoney(getVal(data?.incomeTaxEmployee))}
      />
      <ResultRow
        label="DSMF (İşçi)"
        value={formatMoney(getVal(data?.socialSecurityEmployee))}
      />
      <ResultRow
        label="İşsizlikdən sığorta (İşçi)"
        value={formatMoney(getVal(data?.unemploymentInsuranceEmployee))}
      />
      <ResultRow
        label="İcbari tibbi sığorta (İşçi)"
        value={formatMoney(getVal(data?.mandatoryHealthInsuranceEmployee))}
      />
      <ResultRow
        label="Həmkarlar ittifaqı haqqı"
        value={formatMoney(getVal(data?.tradeUnionFee))}
      />

      {/* İşəgötürən Öhdəlikləri */}
      <ResultRow
        label="DSMF (İşəgötürən)"
        value={formatMoney(getVal(data?.socialSecurityEmployer))}
      />
      <ResultRow
        label="İşsizlikdən sığorta (İşəgötürən)"
        value={formatMoney(getVal(data?.unemploymentInsuranceEmployer))}
      />
      <ResultRow
        label="İcbari tibbi sığorta (İşəgötürən)"
        value={formatMoney(getVal(data?.mandatoryHealthInsuranceEmployer))}
      />

      <ResultRow
        label="Cəmi tutulmalar (İşçi)"
        value={formatMoney(getVal(data?.totalDeductionsFromEmployee))}
      />
      <ResultRow
        label="Cəmi öhdəliklər (İşəgötürən)"
        value={formatMoney(getVal(data?.totalDeductionsFromEmployer))}
        dividerAfter
      />

      <ResultRow
        label="Cəmi tutulmalar"
        value={formatMoney(getVal(data?.totalDeductions))}
        isBold
        isSummary
      />

      <ResultRow
        label="İşçiyə ödəniləcək məbləğ (Kart)"
        value={formatMoney(getVal(data?.netOfficialSalary))}
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
