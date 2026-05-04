import { useMutation, useQueryClient } from "@tanstack/react-query";
import { workExperienceService } from "../api/workExperienceService";
import { useAddEmployeeStore } from "../model/useAddEmployeeStore";
import toast from "react-hot-toast";

export const useWorkExperienceMutation = () => {
  const { personId, nextStep, setStepCompleted } = useAddEmployeeStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: any) => workExperienceService.addOrEditWorkExperienceInfo(payload),
    onSuccess: (response) => {
      if (response.isSuccess) {
        toast.success("İş təcrübəsi məlumatları uğurla yadda saxlanıldı");
        queryClient.invalidateQueries({ queryKey: ["personnel", "workExperience", personId] });
        setStepCompleted(4); // Tab 5
        nextStep();
      } else {
        toast.error(response.errorMessage || "Xəta baş verdi");
      }
    },
    onError: (error: any) => {
      const data = error.response?.data;
      toast.error(data?.errorMessage || "Yadda saxlanılarkən xəta baş verdi");
    }
  });
};
