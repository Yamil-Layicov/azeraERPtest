import { useMutation } from "@tanstack/react-query";
import { createWorkerService } from "../api/createWorkerService";
import type { PersonalInfoValues } from "../model/schemas";
import { useAddEmployeeStore } from "../model/useAddEmployeeStore";
import type { CreateWorkerRequest, CreateWorkerResponse } from "../model/types";
import type { EmployeeEntry } from "../../employees/model/types";
import axios, { AxiosError } from "axios";
import { cleanPayload, formatDateToYMD } from "@/shared/lib/utils";
import { getBackendErrorMessage } from "@/shared/api";
import toast from "react-hot-toast";

interface EmployeeApiResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result: EmployeeEntry;
}


export const usePersonalInfoMutation = (
  resetForm?: (data: PersonalInfoValues) => void,
  pageMode: "add" | "details" = "add"
) => {
  const setPersonId = useAddEmployeeStore((state) => state.setPersonId);
  const setEmployeeId = useAddEmployeeStore((state) => state.setEmployeeId);
  const setRootCompanyId = useAddEmployeeStore((state) => state.setRootCompanyId);
  const nextStep = useAddEmployeeStore((state) => state.nextStep);
  const setPhotoId = useAddEmployeeStore((state) => state.setPhotoId);
  const photoIdFromStore = useAddEmployeeStore((state) => state.photoId);
  const pinSearchRawData = useAddEmployeeStore((state) => state.pinSearchRawData as EmployeeApiResponse | null);
  const setStepCompleted = useAddEmployeeStore((state) => state.setStepCompleted);

  return useMutation<CreateWorkerResponse, AxiosError, PersonalInfoValues>({
    mutationFn: async (data: PersonalInfoValues) => {
    

      let photoId = photoIdFromStore;

      // Daha etibarlı fayl yoxlaması
      const isFile = data.avatar instanceof File || (data.avatar && typeof data.avatar === 'object' && data.avatar.name && data.avatar.size);

      if (isFile) {
        try {
          const uploadResponse = await createWorkerService.uploadFiles([data.avatar], "Avatar");
          
          const firstFile = uploadResponse.result?.[0];
          if (uploadResponse.isSuccess && firstFile) {
            photoId = firstFile.attachId;
            setPhotoId(photoId);
          } else {
            throw new Error(uploadResponse.errorMessage || "Şəkil yüklənərkən xəta baş verdi.");
          }
        } catch (err) {
          const message = axios.isAxiosError(err) ? getBackendErrorMessage(err) : (err as Error)?.message || "Şəkil yüklənərkən xəta baş verdi.";
          throw new Error(message);
        }
      }


      const originalResult = pinSearchRawData?.result;

      const apiDocuments = (data.documents || []).map(d => {
        const isNew = !d.originalId;
        return {
          id: d.originalId || null,
          type: d.type?.id ? String(d.type.id) : null,
          series: d.series || null,
          number: d.number || null,
          issuedAt: formatDateToYMD(d.issueDate),
          expireAt: formatDateToYMD(d.expiryDate),
          issuer: d.issuer || null,
          isCreate: isNew,
          isDeleted: false
        };
      });

      // Backend'den gelen orijinal verilerle formdaki verileri karşılaştırıp silinenleri buluyoruz
      if (originalResult && Array.isArray(originalResult.documents)) {
        originalResult.documents.forEach((orig) => {
          const existsInForm = (data.documents || []).some(fd => String(fd.originalId) === String(orig.id));
          
          if (!existsInForm) {
            apiDocuments.push({ 
              id: orig.id, 
              type: orig.type, 
              series: orig.series, 
              number: orig.number, 
              issuedAt: orig.issuedAt, 
              expireAt: orig.expireAt, 
              issuer: orig.issuer, 
              isCreate: false, 
              isDeleted: true 
            });
          }
        });
      }

      const azeIdentifiers = ["AZE", "AZ", "1"];
      const isAzeBirth = !!data.dogumOlkesi && (
        azeIdentifiers.includes(String(data.dogumOlkesi?.id)) || 
        data.dogumOlkesi?.fullName?.toLowerCase().includes("azərbaycan")
      );
      const isAzeReg = !!data.qeydiyyatOlke && (
        azeIdentifiers.includes(String(data.qeydiyyatOlke?.id)) || 
        data.qeydiyyatOlke?.fullName?.toLowerCase().includes("azərbaycan")
      );

      const rawPayload: CreateWorkerRequest = {
        rootCompanyId: data.sirket?.id ? String(data.sirket.id) : null,
        referrerName: data.tovsiyeEden ?? null,
        employmentTypeCode: data.resmilesmeFormasi?.id ? String(data.resmilesmeFormasi.id) : null,
        pinChecked: data.pinChecked,
        pin: data.fin ?? null,
        name: data.ad ?? null,
        surname: data.soyad ?? null,
        patronymic: data.ataAdi ?? null,
        gender: data.cinsi?.id ? String(data.cinsi.id) : null,
        maritalStatus: data.aileVeziyyeti?.id ? String(data.aileVeziyyeti.id) : null,
        birthDate: formatDateToYMD(data.dogumTarixi),
        citizenshipCode: data.vetendasliq?.id ? String(data.vetendasliq.id) : null,
        birthCountryCode: data.dogumOlkesi?.id ? String(data.dogumOlkesi.id) : null,
        birthCityId: isAzeBirth ? (data.dogumSeheri ? Number(data.dogumSeheri) : null) : null,
        foreignBirthCity: !isAzeBirth ? (data.dogumSeheri || null) : null,
        photoId: photoId || null,
        address: {
          actualCityId: data.faktikiSeher ? Number(data.faktikiSeher) : null, 
          actualAddress: data.faktikiUnvan ?? "",
          isRegistrationSameAsActual: data.qeydiyyatEynidir,
          registrationCountryCode: !data.qeydiyyatEynidir ? (data.qeydiyyatOlke?.id ? String(data.qeydiyyatOlke.id) : null) : null,
          registrationCityId: (isAzeReg && !data.qeydiyyatEynidir) ? (data.qeydiyyatSeher ? Number(data.qeydiyyatSeher) : null) : null,
          registrationForeignCity: (!isAzeReg && !data.qeydiyyatEynidir) ? (data.qeydiyyatSeher || null) : null,
          registrationAddress: (!data.qeydiyyatEynidir ? data.qeydiyyatUnvan : null) ?? null,
        },
        documents: apiDocuments,
      };

      const cleanedPayload = cleanPayload(rawPayload);
      const targetEmployeeId =
        (pinSearchRawData?.result as any)?.employmentId ||
        (pinSearchRawData?.result as any)?.employeeId ||
        null;

      if (pageMode === "details") {
        if (!targetEmployeeId) {
          throw new Error("İşçi ID-si tapılmadı");
        }
        return createWorkerService.update({
          ...(cleanedPayload as CreateWorkerRequest),
          id: String(targetEmployeeId),
        });
      }

      return createWorkerService.create(cleanedPayload);
    },
    onSuccess: (data, variables) => {
      if (data.isSuccess) {
        if (pageMode === "details") {
          setRootCompanyId(variables.sirket?.id ? String(variables.sirket.id) : null);
          setStepCompleted(1);
          if (resetForm) resetForm(variables);
          toast.success("Məlumatlar uğurla yadda saxlanıldı");
          nextStep();
          return;
        }

        const pId = data?.result?.personId;
        const eId = data?.result?.employeeId;
        if (pId) {
          setPersonId(pId);
          setEmployeeId(eId ?? null);
          setRootCompanyId(variables.sirket?.id ? String(variables.sirket.id) : null);
          setStepCompleted(1); 
          if (resetForm) resetForm(variables);
          toast.success("Məlumatlar uğurla yadda saxlanıldı");
          nextStep();
        } else {
          toast.error("Şəxs ID-si tapılmadı");
        }
      } else {
        toast.error(data.errorMessage || "Xəta baş verdi");
      }
    },
    onError: (error: unknown) => {
      if (!axios.isAxiosError(error)) {
        toast.error("Məlumatlar yadda saxlanılarkən xəta baş verdi");
      }
    },
  });
};
