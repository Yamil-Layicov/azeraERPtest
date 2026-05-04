import { useState } from "react";
import type { Option } from "@/shared/types";
import type { FormValues, FormErrors } from "../types";
import { VALIDATION_MESSAGES } from "../schema";
import { HOLDING_TYPE_ID, COMPANY_TYPE_ID } from "../constants";

const SORT_ORDER_MIN = 0;

type FormFieldValue = string | Option | null | number | "";

export const useDepartmentFormValidation = () => {
  const [errors, setErrors] = useState<FormErrors>({});

  const validateField = (field: keyof FormErrors, value: FormFieldValue): string | undefined => {
    switch (field) {
      case "fullName":
        if (typeof value !== "string" || value.trim() === "") {
          return VALIDATION_MESSAGES.FULL_NAME_REQUIRED;
        }
        break;
      case "legalName":
        if (typeof value !== "string" || value.trim() === "") {
          return VALIDATION_MESSAGES.LEGAL_NAME_REQUIRED;
        }
        break;
      // shortName CASE-i TAMAMİLƏ SİLİNDİ
      case "type":
        if (!value) {
          return VALIDATION_MESSAGES.TYPE_REQUIRED;
        }
        break;
      case "parent":
        if (!value) {
          return VALIDATION_MESSAGES.PARENT_REQUIRED;
        }
        break;
      case "voen":
        if (typeof value === "string") {
          if (value && !/^[0-9]*$/.test(value)) {
            return VALIDATION_MESSAGES.VOEN_ONLY_DIGITS;
          }
          if (value.length > 10) {
            return VALIDATION_MESSAGES.VOEN_MAX_LENGTH;
          }
        }
        break;
      case "sortOrder":
        if (value !== "" && (typeof value !== "number" || value < SORT_ORDER_MIN)) {
          return VALIDATION_MESSAGES.SORT_ORDER_MIN;
        }
        break;
      case "workSchedule":
        if (!value) {
          return VALIDATION_MESSAGES.WORK_SCHEDULE_REQUIRED;
        }
        break;
    }
    return undefined;
  };

  const validateForm = (form: FormValues): FormErrors => {
    const newErrors: FormErrors = {};

    if (!form.type) {
      newErrors.type = VALIDATION_MESSAGES.TYPE_REQUIRED;
    }

    if (!form.fullName || form.fullName.trim() === "") {
      newErrors.fullName = VALIDATION_MESSAGES.FULL_NAME_REQUIRED;
    }

    const isCompany = form.type?.id === COMPANY_TYPE_ID;
    if (isCompany && (!form.legalName || form.legalName.trim() === "")) {
      newErrors.legalName = VALIDATION_MESSAGES.LEGAL_NAME_REQUIRED;
    }

    // shortName YOXLAMASI SİLİNDİ

    const isHolding = form.type?.id === HOLDING_TYPE_ID;
    if (!isHolding && !form.parent) {
      newErrors.parent = VALIDATION_MESSAGES.PARENT_REQUIRED;
    }

    if (isCompany && !form.workSchedule) {
      newErrors.workSchedule = VALIDATION_MESSAGES.WORK_SCHEDULE_REQUIRED;
    }

    if (form.voen) {
      if (!/^[0-9]*$/.test(form.voen)) {
        newErrors.voen = VALIDATION_MESSAGES.VOEN_ONLY_DIGITS;
      } else if (form.voen.length > 10) {
        newErrors.voen = VALIDATION_MESSAGES.VOEN_MAX_LENGTH;
      }
    }

    if (form.sortOrder !== "" && (typeof form.sortOrder !== "number" || form.sortOrder < SORT_ORDER_MIN)) {
      newErrors.sortOrder = VALIDATION_MESSAGES.SORT_ORDER_MIN;
    }

    return newErrors;
  };

  const clearError = (field: keyof FormErrors) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const clearAllErrors = () => {
    setErrors({});
  };

  return {
    errors,
    setErrors,
    validateField,
    validateForm,
    clearError,
    clearAllErrors,
  };
};