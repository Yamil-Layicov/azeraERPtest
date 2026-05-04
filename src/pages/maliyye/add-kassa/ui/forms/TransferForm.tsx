import styles from "../AddKassa.module.css";
import { CustomSelect, FileDropzone, FormTextarea } from "@/shared/ui";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import DateCompanyRow from "../components/DateCompanyRow";
import AmountRateRow from "../components/AmountRateRow";
import type { Option, FormData } from "@/shared/types";

interface TransferFormProps {
  formData: FormData;
  updateField: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
  fieldErrors: Record<string, boolean>;
  clearFieldError: (field: string) => void;
  handleFileChange: (file: File | File[] | null) => void;
  fileError?: string | null;
  sourceList: Option[];
  handleLoadOptions?: (type: "source" | "company" | "currency") => void;
  companyList: Option[];
  currencyList: Option[];
}

const TransferForm = ({ props }: { props: TransferFormProps }) => {
  const {
    formData,
    updateField,
    fieldErrors,
    clearFieldError,
    sourceList,
    handleLoadOptions,
  } = props;

  return (
    <>
      <DateCompanyRow {...props} />

      <div className={`${styles.row} ${styles.transferRow}`}>
        <div className={styles.formGroup}>
          <label htmlFor="sourceFrom">
            Mənbədən<span className="required-star">*</span>
          </label>
          <CustomSelect
            id="sourceFrom"
            options={
              sourceList?.map((opt: Option) => ({
                ...opt,
                disabled: opt.id === formData.destination?.id,
              })) || []
            }
            value={formData.source}
            onChange={(val) => {
              updateField("source", val);
              if (val) clearFieldError("source");
            }}
            className={fieldErrors.source ? "error" : ""}
            defaultText="Seçin..."
            searchPlaceholder="Axtar..."
            isSearchable={true}
            onMenuOpen={() => handleLoadOptions?.("source")}
          />
        </div>
        <div className={styles.transferArrowWrapper}>
          <div className={styles.transferArrow}>
            <ArrowRightIcon />
          </div>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="sourceTo">
            Mənbəyə<span className="required-star">*</span>
          </label>
          <CustomSelect
            id="sourceTo"
            options={
              sourceList?.map((opt: Option) => ({
                ...opt,
                disabled: opt.id === formData.source?.id,
              })) || []
            }
            value={formData.destination}
            onChange={(val) => {
              updateField("destination", val);
              if (val) clearFieldError("destination");
            }}
            className={fieldErrors.destination ? "error" : ""}
            defaultText="Seçin..."
            searchPlaceholder="Axtar..."
            isSearchable={true}
            onMenuOpen={() => handleLoadOptions?.("source")}
          />
        </div>
      </div>

      <AmountRateRow {...props} />

      <div className={styles.row}>
        <FormTextarea
          label="Qeyd"
          id="notes"
          placeholder="Qeyd daxil edin..."
          value={formData.notes || ""}
          onChange={(val) => updateField("notes", val)}
          className={styles.notesTextareaHeight}
          labelClassName={styles.labelWeight500}
        />
        <FileDropzone
          id="document"
          label="File"
          value={formData.document}
          onChange={props.handleFileChange}
          multiple={true}
          labelClassName={styles.labelWeight500}
          error={props.fileError}
        />
      </div>
    </>
  );
};

export default TransferForm;
