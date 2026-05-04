import React, { useState } from "react";
import { CustomSelect } from "@/shared/ui/select";
import { ModernDatePicker } from "@/shared/ui/date-picker";
import { Button } from "@/shared/ui";
import type { Option } from "@/shared/types";

import { useReportLookups } from "@/features/lookups/hooks";
import styles from "./ReportForm.module.css";
import {
  RootCompaniesLookupSelect,
  SubCompaniesLookupSelect,
} from "@/features/lookups";

export interface ReportFormState {
  businessUnit: Option | null;
  department: Option | null;
  status: Option | null;
  dateFrom: Date | null;
  dateTo: Date | null;
  reportType: Option | null;
}

interface ReportFormProps {
  value: ReportFormState;
  onChange: (state: ReportFormState) => void;
  onSubmit?: () => void;
  onClear?: () => void;
}

export const ReportForm: React.FC<ReportFormProps> = ({
  value,
  onChange,
  onSubmit,
  onClear,
}) => {
  const [hasOpenedLookups, setHasOpenedLookups] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { reportTypeOptions, employeeStatusOptions, isLoading } =
    useReportLookups(hasOpenedLookups);

  const handleOpenLookups = () => {
    if (!hasOpenedLookups) {
      setHasOpenedLookups(true);
    }
  };

  const handleChange = <K extends keyof ReportFormState>(
    field: K,
    fieldValue: ReportFormState[K],
  ) => {
    if (field === "reportType") {
      setIsSubmitted(false);
    }

    if (field === "businessUnit") {
      onChange({
        ...value,
        businessUnit: fieldValue as Option | null,
        department: null,
      });
    } else {
      onChange({ ...value, [field]: fieldValue });
    }
  };

  const handleSearch = () => {
    setIsSubmitted(true);
    if (value.reportType && onSubmit) {
      onSubmit();
    }
  };

  const handleFormClear = () => {
    setIsSubmitted(false);
    if (onClear) {
      onClear();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <div className={styles.field}>
          <span className={styles.label}>
            Hesabatın növü <span className={styles.required}>*</span>
          </span>
          <CustomSelect
            dataContext="reportForm"
            options={reportTypeOptions}
            value={value.reportType}
            onChange={(v) => handleChange("reportType", v)}
            onOpen={handleOpenLookups}
            defaultText={isLoading ? "Yüklənir..." : "Seçin"}
            disabled={isLoading}
            error={isSubmitted && !value.reportType}
          />
        </div>
        <div className={styles.field}>
          <span className={styles.label}>Biznes vahidi</span>
          <RootCompaniesLookupSelect
            value={value.businessUnit}
            onChange={(v) => handleChange("businessUnit", v)}
            defaultText="Seçin"
          />
        </div>
        <div className={styles.field}>
          <span className={styles.label}>Departament / Şöbə / Bölmə</span>
          <SubCompaniesLookupSelect
            rootCompanyId={
              value.businessUnit?.id ? String(value.businessUnit.id) : null
            }
            value={value.department}
            onChange={(v) => handleChange("department", v)}
            defaultText="Seçin"
          />
        </div>
        {/* {value.reportType && value.reportType.id !== "EmployeeCount" && ( */}
          <>
            <div className={styles.field}>
              <span className={styles.label}>Status</span>
              <CustomSelect
                dataContext="reportForm"
                options={employeeStatusOptions.filter(
                  (option) => option.id !== "Draft",
                )}
                value={value.status}
                onChange={(v) => handleChange("status", v)}
                onOpen={handleOpenLookups}
                defaultText={isLoading ? "Yüklənir..." : "Seçin"}
                disabled={isLoading || !value.reportType || value.reportType.id === "EmployeeCount"}
              />
            </div>
            <div className={styles.dateRangeField}>
              <span className={styles.label}>Tarixdən – Tarixədək</span>
              <div className={styles.dateRangeInputs}>
                <ModernDatePicker
                  value={value.dateFrom}
                  onChange={(d) => handleChange("dateFrom", d)}
                  disabled={isLoading || !value.reportType || value.reportType.id === "EmployeeCount"}
                />
                <ModernDatePicker
                  value={value.dateTo}
                  onChange={(d) => handleChange("dateTo", d)}
                  disabled={isLoading || !value.reportType || value.reportType.id === "EmployeeCount"}
                />
              </div>
            </div>
          </>
      
      </div>

      <div className={styles.rowButtons}>
        <div className={styles.actions}>
          <Button
            type="button"
            variant="secondary"
            className={styles.btnSmall}
            onClick={handleSearch}
            title={
              !value.reportType
                ? "Hesabatın növü mütləq seçilməlidir"
                : undefined
            }
          >
            Axtar
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleFormClear}
            className={styles.btnSmall}
          >
            Təmizlə
          </Button>
        </div>
      </div>
    </div>
  );
};
