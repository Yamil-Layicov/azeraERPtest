import { useQuery } from "@tanstack/react-query";
import { workExperienceService } from "../api/workExperienceService";
import { useAddEmployeeStore } from "../model/useAddEmployeeStore";

export const useWorkExperienceInfo = () => {
  const { personId, currentStep } = useAddEmployeeStore();

  // Tab 5: İş təcrübəsi
  const isEnabled = !!personId && currentStep === 5;

  return useQuery({
    queryKey: ["personnel", "workExperience", personId],
    queryFn: ({ signal }) => workExperienceService.getWorkExperienceInfoByPersonId(personId!, signal),
    enabled: isEnabled,
    staleTime: 0, 
    gcTime: 1000 * 60 * 30, 
    refetchOnMount: true,
    retry: 1,
  });
};
