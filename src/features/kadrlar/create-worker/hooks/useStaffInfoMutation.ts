import { useMutation } from "@tanstack/react-query";
import { createEmployeeService, type CreateEmploymentRequest } from "@/features/kadrlar/create-employee/api/createEmployeeService";
import type { StaffInfoFormValues } from "../model/schemas";
import { useAddEmployeeStore } from "../model/useAddEmployeeStore";
import axios, { AxiosError } from "axios";
import { formatDateToYMD } from "@/shared/lib/utils";
import { getBackendErrorMessage } from "@/shared/api";
import toast from "react-hot-toast";



export const useStaffInfoMutation = (resetForm?: (data: any) => void) => {
  const employmentId = useAddEmployeeStore((state) => state.personId);
  const nextStep = useAddEmployeeStore((state) => state.nextStep);
  const setStepCompleted = useAddEmployeeStore((state) => state.setStepCompleted);
  const isStepCompleted = useAddEmployeeStore((state) => state.isStepCompleted);

  return useMutation<any, AxiosError, StaffInfoFormValues>({
    mutationFn: async (data: StaffInfoFormValues) => {
      if (!employmentId) {
        throw new Error("Employment ID tapılmadı. Zəhmət olmasa əvvəlki tabı tamamlayın.");
      }

      // TİP ZORLAMASI (Type Casting) İLE KESİN ÇÖZÜM
      const payload = {
        isMain: true,
        employmentId: employmentId,
        staffingId: data.vezife?.id ? String(data.vezife.id) : null,
        relatedNodeId: null,
        experienceTypeCode: data.stajNovu?.id ? String(data.stajNovu.id) : null,
        appointmentDate: formatDateToYMD(data.teyinatTarixi),
        appointmentOrderNumber: data.teyinatEmrNomresi ?? null,
      } as CreateEmploymentRequest;

      return createEmployeeService.createNode(payload);
    },
    onSuccess: (response, variables) => {
      if (response.isSuccess) {
        setStepCompleted(2);
        if (resetForm) resetForm(variables);
        toast.success("Kadr məlumatları uğurla yadda saxlanıldı");
        nextStep();
      } else {
        toast.error(response.errorMessage || "Xəta baş verdi");
        if (isStepCompleted(2)) {
          nextStep();
        }
      }
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        toast.error(getBackendErrorMessage(error));
      } else {
        toast.error("Məlumatlar yadda saxlanılarkən xəta baş verdi");
      }
      
      if (isStepCompleted(2)) {
        nextStep();
      }
    },
  });
};
