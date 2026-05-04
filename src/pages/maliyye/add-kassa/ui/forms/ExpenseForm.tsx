import styles from "../AddKassa.module.css";
import {
  FormInput,
  CustomSelect,
  IconButton,
  FormTextarea,
  FileDropzone,
} from "@/shared/ui";
import { PlusIcon } from "@heroicons/react/24/outline";
import DateCompanyRow from "../components/DateCompanyRow";
import AmountRateRow from "../components/AmountRateRow";
import { useEffect, useMemo, useRef } from "react";
import type { Option, FormData } from "@/shared/types";

interface ExpenseFormProps {
  formData: FormData;
  updateField: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
  fieldErrors: Record<string, boolean>;
  clearFieldError: (field: string) => void;
  counterpartyList: Option[];
  purposeList: Option[];
  sourceList: Option[];
  handleOpenAddModal: (target: "counterparty" | "purpose" | "business") => void;
  handleFileChange: (val: File | File[] | null) => void;
  fileError?: string | null;
  handleLoadOptions?: (
    type: "purpose" | "counterparty" | "source" | "company" | "currency",
  ) => void;
  companyList: Option[];
  currencyList: Option[];
}

const ExpenseForm = ({ props }: { props: ExpenseFormProps }) => {
  const {
    formData,
    updateField,
    fieldErrors,
    clearFieldError,
    counterpartyList,
    purposeList,
    sourceList,
    handleOpenAddModal,
    handleLoadOptions,
  } = props;

  const businessPurposeId = useMemo(() => {
    if (!purposeList) return null;
    const businessOption = purposeList.find(
      (opt: Option) =>
        opt.fullName?.toString().toLowerCase().trim() === "biznes",
    );
    return businessOption ? businessOption.id : null;
  }, [purposeList]);

  const isBusinessSelected = useMemo(() => {
    if (businessPurposeId === null || !formData.purpose) {
      return false;
    }
    return String(formData.purpose.id) === String(businessPurposeId);
  }, [formData.purpose, businessPurposeId]);

  const isCounterpartyDisabled = useMemo(() => {
    return formData.purpose?.isCounterParty === false;
  }, [formData.purpose]);

  const prevIsBusinessSelected = useRef<boolean>(isBusinessSelected);

  useEffect(() => {
    if (
      prevIsBusinessSelected.current &&
      !isBusinessSelected &&
      formData.counterparty
    ) {
      updateField("counterparty", null);
    }
    prevIsBusinessSelected.current = isBusinessSelected;
  }, [isBusinessSelected, formData.counterparty, updateField]);

  useEffect(() => {
    if (isCounterpartyDisabled && formData.counterparty) {
      updateField("counterparty", null);
    }
  }, [isCounterpartyDisabled, formData.counterparty, updateField]);

  return (
    <>
      <DateCompanyRow {...props} />

      <div className={styles.row}>
        <div className={styles.selectWrapperWithButton}>
          <div className={`${styles.formGroup} ${styles.selectGroup}`}>
            <label htmlFor="purpose">
              Təyinat<span className="required-star">*</span>
            </label>
            <CustomSelect
              id="purpose"
              options={purposeList}
              value={formData.purpose}
              onChange={(val) => {
                updateField("purpose", val);
                if (val) clearFieldError("purpose");
              }}
              className={fieldErrors.purpose ? "error" : ""}
              defaultText="Təyinat seçin..."
              isSearchable={true}
              searchPlaceholder="Axtar..."
              onMenuOpen={() => handleLoadOptions?.("purpose")}
            />
          </div>
          <IconButton
            icon={PlusIcon}
            onClick={() => handleOpenAddModal("purpose")}
            variant="primary"
          />
        </div>
        <div className={styles.selectWrapperWithButton}>
          <div className={`${styles.formGroup} ${styles.selectGroup}`}>
            <label htmlFor="counterparty">
              Kontragent{" "}
              {isBusinessSelected && <span className="required-star">*</span>}
            </label>
            <CustomSelect
              id="counterparty"
              options={counterpartyList}
              value={formData.counterparty}
              onChange={(val) => updateField("counterparty", val)}
              className=""
              defaultText="Kontragent seçin..."
              isSearchable={true}
              searchPlaceholder="Axtar..."
              disabled={isCounterpartyDisabled}
              onMenuOpen={() => handleLoadOptions?.("counterparty")}
            />
          </div>
          <IconButton
            icon={PlusIcon}
            onClick={() => handleOpenAddModal("counterparty")}
            variant="primary"
          />
        </div>
      </div>

      <div className={styles.row}>
        <FormInput
          label="Pulu verən / alan"
          id="personName"
          type="text"
          value={formData.personName}
          onChange={(val) => updateField("personName", val)}
          placeholder="Ad daxil edin"
          labelClassName={styles.labelWeight500}
        />
        <div className={styles.formGroup}>
          <label htmlFor="source">
            Mənbə<span className="required-star">*</span>
          </label>
          <CustomSelect
            id="source"
            options={sourceList || []}
            value={formData.source}
            onChange={(val) => {
              updateField("source", val);
              if (val) clearFieldError("source");
            }}
            className={fieldErrors.source ? "error" : ""}
            defaultText="Mənbə seçin..."
            isSearchable={true}
            searchPlaceholder="Axtar..."
            onMenuOpen={() => handleLoadOptions?.("source")}
          />
        </div>
      </div>

      <AmountRateRow {...props} />

      <div className={styles.row}>
        <FormTextarea
          label="Qeyd"
          id="notes"
          value={formData.notes || ""}
          onChange={(val) => updateField("notes", val)}
          placeholder="Qeyd daxil edin..."
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

export default ExpenseForm;
