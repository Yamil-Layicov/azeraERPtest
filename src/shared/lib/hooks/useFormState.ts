import { useState, useCallback } from "react";
import type { FormData } from "@/shared/types";
import { currencyOptions } from "@/shared/config";

export const useFormState = () => {
  const [formData, setFormData] = useState<FormData>({
    selectedDate: new Date(),
    transactionType: "mədaxil",
    amount: "",
    rate: "",
    purpose: null,
    personName: "",
    reference: "",
    notes: "",
    document: null,
    counterparty: null,
    currency: currencyOptions[0] || null,
    source: null,
    destination: null,
    business: null,
    company: null,
    showSuccessModal: false,
    showErrorModal: false,
  });

  const [fieldErrors, setFieldErrors] = useState<{
    amount: boolean;
    purpose: boolean;
    source: boolean;
    destination: boolean;
    selectedDate: boolean;
    rate: boolean;
  }>({
    amount: false,
    purpose: false,
    source: false,
    destination: false,
    selectedDate: false,
    rate: false,
  });

  const updateField = useCallback(
    <K extends keyof FormData>(field: K, value: FormData[K]) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  const updateFields = useCallback((updates: Partial<FormData>) => {
    setFormData((prev) => ({
      ...prev,
      ...updates,
    }));
  }, []);

  const clearForm = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      selectedDate: new Date(),
      transactionType: "mədaxil",
      amount: "",
      rate: "",
      purpose: null,
      personName: "",
      reference: "",
      notes: "",
      document: null,
      counterparty: null,
      currency: prev.currency, // retain current currency or default to first
      source: null,
      destination: null,
      business: null,
      company: null,
      showErrorModal: false,
    }));
    clearFieldErrors();
  }, []); 

  const clearFieldErrors = useCallback(() => {
    setFieldErrors({
      amount: false,
      purpose: false,
      source: false,
      destination: false,
      selectedDate: false,
      rate: false,
    });
  }, []);

  const clearFieldError = useCallback((field: keyof typeof fieldErrors) => {
    setFieldErrors((prev) => ({
      ...prev,
      [field]: false,
    }));
  }, []);

  const showSuccess = useCallback(() => {
    setFormData((prev) => ({ ...prev, showSuccessModal: true }));
  }, []);

  const hideSuccess = useCallback(() => {
    setFormData((prev) => ({ ...prev, showSuccessModal: false }));
  }, []);

  const showError = useCallback(() => {
    setFormData((prev) => ({ ...prev, showErrorModal: true }));
  }, []);

  const hideError = useCallback(() => {
    setFormData((prev) => ({ ...prev, showErrorModal: false }));
    setFieldErrors({
      amount: !formData.amount,
      purpose: formData.transactionType === 'məxaric' && !formData.purpose,
      source: !formData.source,
      destination: formData.transactionType === 'kocurme' && !formData.destination,
      selectedDate: !formData.selectedDate,
      rate: formData.currency?.fullName !== "AZN" && !formData.rate,
    });
  }, [
    formData.amount,
    formData.purpose,
    formData.source,
    formData.destination,
    formData.selectedDate,
    formData.currency,
    formData.rate,
    formData.transactionType,
  ]);

  return {
    formData,
    fieldErrors,
    updateField,
    updateFields,
    clearForm,
    showSuccess,
    hideSuccess,
    showError,
    hideError,
    clearFieldErrors,
    clearFieldError,
  };
};
