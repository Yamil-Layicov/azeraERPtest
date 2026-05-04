import { useMutation } from "@tanstack/react-query";
import { salaryService, type SalaryCalculationRequest } from "../api/salaryService";

export const useSalaryCalculation = () => {
  return useMutation({
    mutationFn: (payload: SalaryCalculationRequest) => salaryService.calculateSalary(payload),
  });
};
