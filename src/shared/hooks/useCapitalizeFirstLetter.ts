import { useCallback } from "react";

export const capitalizeFirstLetter = (value: string): string => {
  if (!value) return value;
  return value.charAt(0).toLocaleUpperCase("az-AZ") + value.slice(1);
};

export const useCapitalizeFirstLetter = () => {
  const transform = useCallback((value: string) => capitalizeFirstLetter(value), []);

  const createCapitalizedOnChange = useCallback(
    (onChange: (value: string) => void) => {
      return (value: string) => onChange(capitalizeFirstLetter(value));
    },
    []
  );

  return {
    transform,
    createCapitalizedOnChange,
  };
};

