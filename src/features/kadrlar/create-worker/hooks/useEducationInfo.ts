import { useQuery } from "@tanstack/react-query";
import { educationService } from "../api/educationService";
import { useAddEmployeeStore } from "../model/useAddEmployeeStore";

export const useEducationInfo = () => {
  const { personId, currentStep } = useAddEmployeeStore();

  const isEnabled = !!personId && currentStep === 3;

  return useQuery({
    queryKey: ["personnel", "education", personId],
    queryFn: ({ signal }) => educationService.getEducationInfoByPersonId(personId!, signal),
    enabled: isEnabled,
    staleTime: 0, 
    gcTime: 1000 * 60 * 30, 
    refetchOnMount: true,
    retry: 1,
  });
};
