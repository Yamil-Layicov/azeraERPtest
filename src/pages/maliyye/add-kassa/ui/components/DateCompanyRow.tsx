import styles from "../AddKassa.module.css";
import { ModernDatePicker, CustomSelect } from "@/shared/ui";
import type { Option, FormData } from "@/shared/types";

interface DateCompanyRowProps {
  formData: FormData;
  updateField: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
  fieldErrors: Record<string, boolean>;
  clearFieldError: (field: string) => void;
  companyList: Option[];
  handleLoadOptions?: (type: "company") => void;
}

const DateCompanyRow: React.FC<DateCompanyRowProps> = ({
  formData,
  updateField,
  fieldErrors,
  clearFieldError,
  companyList,
  handleLoadOptions,
}) => {
  return (
    <div className={styles.row}>
      <div className={styles.formGroup}>
        <label htmlFor="selectedDate">
          Tarix<span className="required-star">*</span>
        </label>
        <ModernDatePicker
          id="selectedDate"
          value={formData.selectedDate}
          onChange={(date) => {
            updateField("selectedDate", date as FormData["selectedDate"]);
            if (date) clearFieldError("selectedDate");
          }}
          className={fieldErrors.selectedDate ? "error" : ""}
          disabled={false}
          minDate={new Date()}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="company">
          Şirkət<span className="required-star">*</span>
        </label>
        <CustomSelect
          id="company"
          options={companyList || []}
          defaultText="Şirkət seçin..."
          value={formData.company}
          onChange={(value) => {
            updateField("company", value as FormData["company"]);
            if (value) clearFieldError("company");
          }}
          className={fieldErrors.company ? "error" : ""}
          disabled={false}
          onMenuOpen={() => handleLoadOptions?.("company")}
        />
      </div>
    </div>
  );
};

export default DateCompanyRow;
