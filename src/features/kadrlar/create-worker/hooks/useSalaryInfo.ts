import { useQuery } from "@tanstack/react-query";
import { salaryService } from "../api/salaryService";
import { useAddEmployeeStore } from "../model/useAddEmployeeStore";

export const useSalaryInfo = () => {
  const { personId, currentStep } = useAddEmployeeStore();
  const isEnabled = !!personId && currentStep === 5;

  return useQuery({
    queryKey: ["personnel", "salary", personId],
    queryFn: ({ signal }) => salaryService.getSalaryCalcInfoByPersonId(personId!, signal),
    enabled: isEnabled,
    staleTime: 0, 
    gcTime: 1000 * 60 * 30, 
    refetchOnMount: true,
    retry: 1,
  });
};
