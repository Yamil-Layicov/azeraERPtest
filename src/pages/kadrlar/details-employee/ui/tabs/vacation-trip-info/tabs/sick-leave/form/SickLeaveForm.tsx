import { useState } from "react";
import { FormInput, ModernDatePicker, Button } from "@/shared/ui";
import { toast } from "react-hot-toast";
import styles from "./SickLeaveForm.module.css";
import type { SickLeaveItem } from "../types";

interface SickLeaveFormProps {
    onSubmit: (item: SickLeaveItem) => void;
}

export const SickLeaveForm = ({ onSubmit }: SickLeaveFormProps) => {
    const [seriesNumber, setSeriesNumber] = useState("");
    const [medicalInstitution, setMedicalInstitution] = useState("");
    const [diagnosis, setDiagnosis] = useState("");
    const [dateFrom, setDateFrom] = useState<Date | null>(null);
    const [dateTo, setDateTo] = useState<Date | null>(null);

    const handleAdd = () => {
        if (!seriesNumber.trim() || !medicalInstitution.trim() || !diagnosis.trim() || !dateFrom || !dateTo) {
            toast.error("Zəhmət olmasa bütün vacib xanaları doldurun");
            return;
        }
        if (dateTo < dateFrom) {
            toast.error("Bitmə tarixi başlama tarixindən əvvəl ola bilməz");
            return;
        }
        const newItem: SickLeaveItem = {
            id: Date.now().toString(),
            seriesNumber: seriesNumber.trim(),
            medicalInstitution: medicalInstitution.trim(),
            diagnosis: diagnosis.trim(),
            dateFrom,
            dateTo
        };
        onSubmit(newItem);
        handleClear();
    };

    const handleClear = () => {
        setSeriesNumber("");
        setMedicalInstitution("");
        setDiagnosis("");
        setDateFrom(null);
        setDateTo(null);
    };

    return (
        <div className={styles.grid}>
            <div className={styles.fieldGroup}>
                <FormInput
                    id="seriesNumber"
                    type="text"
                    label="Vərəqənin seriya və nömrəsi"
                    placeholder="Daxil edin"
                    value={seriesNumber}
                    onChange={setSeriesNumber}
                    required
                />
            </div>
            <div className={styles.fieldGroup}>
                <FormInput
                    id="medicalInstitution"
                    type="text"
                    label="Vərəqəni verən tibbi müəssisə"
                    placeholder="Daxil edin"
                    value={medicalInstitution}
                    onChange={setMedicalInstitution}
                    required
                />
            </div>
            <div className={styles.fieldGroup}>
                <FormInput
                    id="diagnosis"
                    type="text"
                    label="Diaqnoz"
                    placeholder="Daxil edin"
                    value={diagnosis}
                    onChange={setDiagnosis}
                    required
                />
            </div>
            <div className={styles.fieldGroup}>
                <label className={styles.label}>
                    Hansı gündən <span className={styles.required}>*</span>
                </label>
                <ModernDatePicker
                    value={dateFrom}
                    onChange={setDateFrom}
                    placeholder="dd.mm.yyyy"
                />
            </div>
            <div className={styles.fieldGroup}>
                <label className={styles.label}>
                    Hansı günədək <span className={styles.required}>*</span>
                </label>
                <ModernDatePicker
                    value={dateTo}
                    onChange={setDateTo}
                    placeholder="dd.mm.yyyy"
                />
            </div>
            <div className={styles.actions}>
                <Button type="button" variant="secondary" className={styles.addButton} onClick={handleAdd}>
                    Əlavə et
                </Button>
                <Button type="button" variant="outline" className={styles.clearButton} onClick={handleClear}>
                    Təmizlə
                </Button>
            </div>
        </div>
    );
};
