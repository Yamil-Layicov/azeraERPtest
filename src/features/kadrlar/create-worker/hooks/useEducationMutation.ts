import { useMutation, useQueryClient } from "@tanstack/react-query";
import { educationService } from "../api/educationService";
import { useAddEmployeeStore } from "../model/useAddEmployeeStore";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";

export const useEducationMutation = () => {
  const { personId,  setStepCompleted } = useAddEmployeeStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: any) => educationService.addOrEditEducationInfo(payload),
    onSuccess: (response) => {
      if (response.isSuccess) {
        toast.success("Təhsil məlumatları uğurla yadda saxlanıldı");
        queryClient.invalidateQueries({ queryKey: ["personnel", "education", personId] });
        setStepCompleted(2); // SENIOR FIX: Mark step as completed (Tab 2)
      } else {
        toast.error(response.errorMessage || "Xəta baş verdi");
      }
    },
    onError: (error: AxiosError) => {
      const data = error.response?.data as any;
      toast.error(data?.errorMessage || "Yadda saxlanılarkən xəta baş verdi");
    }
  });
};
