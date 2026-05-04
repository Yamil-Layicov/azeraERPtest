import React from "react";
import styles from "./WorkExperienceResultInfo.module.css";

interface WorkExperienceResultData {
    workplace: string;
    position: string;
    appointmentDate: Date | null;
    appointmentOrderNumber: string;
}

interface WorkExperienceResultInfoProps {
    data: WorkExperienceResultData | null;
}

const formatDate = (date: Date | null): string => {
    if (!date) return "—";
    const d = date.getDate().toString().padStart(2, "0");
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const y = date.getFullYear();
    return `${d}.${m}.${y}`;
};

export const WorkExperienceResultInfo: React.FC<WorkExperienceResultInfoProps> = ({ data }) => {
    if (!data) return null;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <span className={styles.headerTitle}>İş təcrübəsi məlumatları</span>
                <span className={styles.headerSubtitle}>Məlumat</span>
            </div>

            <ResultRow
                label="İş yeri"
                value={data.workplace || "—"}
                isPrimary
            />
            <ResultRow
                label="Vəzifəsi"
                value={data.position || "—"}
                isPrimary
            />
            <ResultRow
                label="Təyinat tarixi"
                value={formatDate(data.appointmentDate)}
                isPrimary
            />
            <ResultRow
                label="Əmr nömrəsi"
                value={data.appointmentOrderNumber || "—"}
                isPrimary
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
