import styles from "../AddKassa.module.css";
import customSelectStyles from "@/shared/ui/select/CustomSelect.module.css";
import { FormInput, CustomSelect } from "@/shared/ui";
import type { Option, FormData } from "@/shared/types";

interface AmountRateRowProps {
  formData: FormData;
  updateField: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
  fieldErrors: Record<string, boolean>;
  clearFieldError: (field: string) => void;
  currencyList: Option[];
  handleLoadOptions?: (type: "currency") => void;
}

const AmountRateRow: React.FC<AmountRateRowProps> = ({
  formData,
  updateField,
  fieldErrors,
  clearFieldError,
  currencyList,
  handleLoadOptions,
}) => {
  return (
    <div className={styles.row}>
      <div className={styles.formGroup}>
        <label htmlFor="amount">
          Məbləğ<span className="required-star">*</span>
        </label>
        <div
          className={`${styles.inputGroup} ${fieldErrors.amount ? "error" : ""}`}
        >
          <input
            type="text"
            id="amount"
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) => {
              const value = e.target.value;
              const regex = /^[0-9]*([.,][0-9]{0,2})?$/;
              if (value === "" || regex.test(value)) {
                updateField("amount", value);
                if (value) clearFieldError("amount");
              }
            }}
            style={{ flexGrow: 1 }}
          />
          <div
            className={
              styles.currencySelectWrapper +
              " " +
              styles.currencySelectWrapperNoneBorderRadius
            }
          >
            <CustomSelect
              id="currency"
              ariaLabel="Valyuta"
              options={currencyList || []}
              defaultText=""
              value={formData.currency}
              onChange={(value) => {
                updateField("currency", value as FormData["currency"]);
                if (value && (value as Option).fullName === "AZN")
                  updateField("rate", "" as FormData["rate"]);
              }}
              isSearchable={false}
              isClearable={false}
              className={customSelectStyles.noBorderLeft}
              onMenuOpen={() => handleLoadOptions?.("currency")}
            />
          </div>
        </div>
      </div>

      <FormInput
        label="Məzənnə"
        type="text"
        id="rate"
        placeholder="0.0000"
        value={formData.rate}
        onChange={(value) => {
          const regex = /^[0-9]*([.,][0-9]{0,4})?$/;
          if (
            value === "" ||
            value === "Yüklənir..." ||
            value === "Xəta" ||
            regex.test(value)
          ) {
            updateField("rate", value);
            if (value) clearFieldError("rate");
          }
        }}
        disabled={formData.currency?.fullName === "AZN"}
        className={fieldErrors.rate ? "error" : ""}
        labelClassName={styles.labelWeight500}
      />
    </div>
  );
};

export default AmountRateRow;
