import { useMutation, useQueryClient } from "@tanstack/react-query";
import { salaryService } from "../api/salaryService";
import { useAddEmployeeStore } from "../model/useAddEmployeeStore";
import toast from "react-hot-toast";

export const useSalaryMutation = () => {
  const { personId, nextStep, setStepCompleted } = useAddEmployeeStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: any) => salaryService.addOrEditSalaryCalcInfo(payload),
    onSuccess: (response) => {
      if (response.isSuccess) {
        toast.success("Əmək haqqı məlumatları uğurla yadda saxlanıldı");
        queryClient.invalidateQueries({ queryKey: ["personnel", "salary", personId] });
        setStepCompleted(3); // Tab 3
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
