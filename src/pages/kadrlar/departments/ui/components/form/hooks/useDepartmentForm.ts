import { useState, useEffect, useRef } from "react";
import type { DepartmentNode } from "../../../../model/types";
import type { Option } from "@/shared/types";
import type { FormValues } from "../types";
import { DEFAULT_FORM_VALUES, HOLDING_TYPE_ID, COMPANY_TYPE_ID } from "../constants";
import { transformInitialDataToFormValues } from "../utils/formHelpers";

interface UseDepartmentFormProps {
  initialData?: DepartmentNode | null;
  defaultParent?: Option | null;
  companyTypesOptions: Option[];
  companiesOptions: Option[];
  workScheduleOptions: Option[];
  isOpen: boolean;
  onChange?: (data: FormValues) => void;
}

export const useDepartmentForm = ({
  initialData,
  defaultParent,
  companyTypesOptions,
  companiesOptions,
  workScheduleOptions,
  isOpen,
  onChange,
}: UseDepartmentFormProps) => {
  const getInitialFormState = (): FormValues => {
    if (initialData) {
      return transformInitialDataToFormValues(
        initialData,
        companyTypesOptions,
        companiesOptions,
        workScheduleOptions
      );
    }
    if (defaultParent) {
      const matchedParent = companiesOptions.find(
        (opt) => String(opt.id) === String(defaultParent.id)
      ) || defaultParent;
      return { ...DEFAULT_FORM_VALUES, parent: matchedParent };
    }
    return DEFAULT_FORM_VALUES;
  };

  const [form, setForm] = useState<FormValues>(getInitialFormState);
  const prevInitialDataRef = useRef<DepartmentNode | null | undefined>(undefined);
  const prevIsOpenRef = useRef<boolean>(false);
  const isUserTypingRef = useRef(false);
  const isFirstMountRef = useRef(true);

  // Sync form state with initialData zamanı parent-i qorumaq üçün
  useEffect(() => {
    if (!isOpen) {
      prevInitialDataRef.current = undefined;
      prevIsOpenRef.current = false;
      return;
    }

    const isOpening = !prevIsOpenRef.current && isOpen;
    const currentData = initialData;
    const prevData = prevInitialDataRef.current;

    // 1. Modal yeni açılırsa və ya Record dəyişirsə (Edit rejimi)
    if (isOpening || prevData !== currentData) {
      if (currentData) {
        // Edit rejimi: Bütün məlumatları yüklə
        const formValues = transformInitialDataToFormValues(
          currentData,
          companyTypesOptions,
          companiesOptions,
          workScheduleOptions
        );
        setForm(formValues);
      } else {
        // Create rejimi: Digər xanaları SIFIRLA, amma mövcud Parent-i MÜTLƏQ SAXLA
        const matchedParent = companiesOptions.find(
          (opt) => String(opt.id) === String(defaultParent?.id)
        ) || defaultParent;
        
        setForm(prev => ({
          ...DEFAULT_FORM_VALUES,
          // Əgər yeni matchedParent varsa onu, yoxdursa köhnə parent-i saxla (heç vaxt null etmə)
          parent: matchedParent || prev.parent 
        }));
      }
      
      prevInitialDataRef.current = currentData;
      prevIsOpenRef.current = isOpen;
      isUserTypingRef.current = false;
    }
    // 2. Parent-in gecikmiş yüklənməsi və ya stabilləşdirilməsi
    else if (!currentData && defaultParent) {
      const matchedParent = companiesOptions.find(
        (opt) => String(opt.id) === String(defaultParent.id)
      ) || defaultParent;
      
      if (matchedParent && (!form.parent || (String(form.parent.id) === String(matchedParent.id) && form.parent !== matchedParent))) {
        setForm(prev => ({ ...prev, parent: matchedParent }));
      }
    }
  }, [isOpen, initialData, defaultParent, companyTypesOptions, companiesOptions, workScheduleOptions, form.parent]);

  // Notify parent of form changes (skip first mount)
  useEffect(() => {
    if (onChange && isOpen && !isFirstMountRef.current) {
      onChange(form);
    }
    if (isFirstMountRef.current) {
      isFirstMountRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, isOpen]);

  const updateField = <K extends keyof FormValues>(
    key: K,
    value: FormValues[K]
  ) => {
    isUserTypingRef.current = true; 

    // Special handling for type field: clear parent if Holding; clear legalName if not Company
    if (key === "type") {
      const newType = value as Option | null;
      setForm((prev) => {
        const next = { ...prev, [key]: value };
        if (newType?.id === HOLDING_TYPE_ID) {
          next.parent = null;
        }
        if (newType?.id !== COMPANY_TYPE_ID) {
          next.legalName = "";
        }
        return next;
      });
    } else {
      setForm((prev) => ({ ...prev, [key]: value }));
    }
  };

  return {
    form,
    updateField,
  };
};

