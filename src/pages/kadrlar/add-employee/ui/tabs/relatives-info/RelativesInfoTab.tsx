import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import styles from "./RelativesInfoTab.module.css";
import { RelativesInputForm } from "./components/relatives-form/RelativesInputForm";
import { RelativesTable } from "./components/relatives-table";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createWorkerService } from "@/features/kadrlar/create-worker/api/createWorkerService";
import { useAddEmployeeStore } from "@/features/kadrlar/create-worker/model/useAddEmployeeStore";
import { useEnumItemsByCode } from "@/features/lookups/hooks";
import { toast } from "react-hot-toast";
import axios from "axios";
import { ConfirmModal } from "@/shared/ui";

export interface RelativesInfoTabHandle {
  submit: () => void;
  isDirty?: () => boolean;
}

const RelativesInfoTab = forwardRef<RelativesInfoTabHandle, {}>((_, ref) => {
  const personId = useAddEmployeeStore((state) => state.personId);
  const nextStep = useAddEmployeeStore((state) => state.nextStep);
  const setStepCompleted = useAddEmployeeStore((state) => state.setStepCompleted);
  const queryClient = useQueryClient();

  // --- MODAL & EDIT STATES ---
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState<string | null>(null);
  const [editingRelative, setEditingRelative] = useState<any | null>(null);

  useEffect(() => {
    setIsDeleteModalOpen(false);
    setIdToDelete(null);
    setEditingRelative(null);
  }, [personId]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["relatives", personId],
    queryFn: () => createWorkerService.getRelativeInfoByPersonId(personId!),
    enabled: !!personId,
    staleTime: 0,
    gcTime: 0,
  });

  // Tabs use display: none, so we must manually refetch when currentStep matches this tab
  const currentStep = useAddEmployeeStore((state) => state.currentStep);
  useEffect(() => {
    if (currentStep === 6) {
      refetch();
    }
  }, [currentStep, refetch]);

  useEffect(() => {
    if (!error) return;
    // HTTP xətası üçün toast interceptor tərəfindən göstərilir.
  }, [error]);

  // Lookups for mapping codes to names
  const { rawData: relationshipTypes } = useEnumItemsByCode("RelationshipTypes", true);
  const { rawData: socialStatuses } = useEnumItemsByCode("SocialStatus", true);

  // Map API response to RelativeItem format
  const relativesList = React.useMemo(() => {
    if (!data?.isSuccess || !data?.result) return [];

    const relationshipItems = (relationshipTypes as any[]) || [];
    const socialItems = (socialStatuses as any[]) || [];

    return (data.result as any[]).map((item: any) => {
      const person = item.personRelative || {};
      
      // Find degree and social status from lookups
      const degreeOption = relationshipItems.find((t: any) => t.value === item.relationshipTypeCode) || null;
      const socialOption = socialItems.find((t: any) => t.value === item.socialStatusCode) || null;
      
      return {
        id: item.id,
        degree: degreeOption ? { id: degreeOption.value, fullName: degreeOption.label } : (item.relationshipTypeCode ? { id: item.relationshipTypeCode, fullName: item.relationshipTypeCode } : null),
        socialStatus: socialOption ? { id: socialOption.value, fullName: socialOption.label } : (item.socialStatusCode ? { id: item.socialStatusCode, fullName: item.socialStatusCode } : null),
        surname: person.surname || "",
        name: person.name || "",
        patronymic: person.patronymic || "",
        birthDate: person.birthDate ? new Date(person.birthDate) : null,
        birthCity: person.birthCountryCode === "AZE" ? (person.birthCityName || "") : (person.foreignBirthCity || ""),
        workplace: item.workPlace || "",
        pin: person.pin || "",
        address: item.address || "",
        isDeceased: item.socialStatusCode === "Deceased" || !!person.isDeceased,
        isPensioner: item.socialStatusCode === "Pensioner",
        raw: item, // Store raw data for editing
        personRelative: person, // Store personRelative data for editing
      };
    });
  }, [data, relationshipTypes, socialStatuses]);

  // Silmə funksiyası
  const handleRemove = (id: string) => {
    setIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!idToDelete) return;

    try {
      const response = await createWorkerService.removeRelativeInfo(idToDelete);
      if (response.isSuccess) {
        toast.success("Məlumat uğurla silindi");
        queryClient.invalidateQueries({ queryKey: ["relatives", personId] });
      } else {
        toast.error(response.errorMessage || "Silinərkən xəta baş verdi");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        // HTTP xətası üçün toast interceptor tərəfindən göstərilir.
        return;
      }
      toast.error("Silinmə zamanı xəta baş verdi");
    } finally {
      setIsDeleteModalOpen(false);
      setIdToDelete(null);
    }
  };

  // Edit funksiyası
  const handleEdit = (item: any) => {
    setEditingRelative(item);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useImperativeHandle(ref, () => ({
    submit: () => {
      if (relativesList.length === 0) {
        toast.error("Ən azı bir qohum haqqında məlumat daxil edilməlidir.");
        return;
      }
      setStepCompleted(6);
      nextStep();
    }
  }));

  return (
    <div className={styles.container}>
      <RelativesInputForm 
        editData={editingRelative}
        onSuccess={() => {
          setEditingRelative(null);
          queryClient.invalidateQueries({ queryKey: ["relatives", personId] });
        }} 
      />
      <div className={styles.tableSection}>
        {isLoading ? (
          <div className={styles.loading}>Yüklənir...</div>
        ) : (
          <RelativesTable 
            data={relativesList} 
            onRemove={handleRemove}
            onEdit={handleEdit}
          />
        )}
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => { setIsDeleteModalOpen(false); setIdToDelete(null); }}
        onConfirm={confirmDelete}
        title="Silmək istədiyinizə əminsiniz?"
        description="Bu məlumatı sildikdə geri qaytara bilməyəcəksiniz."
        confirmText="Sil"
        cancelText="Ləğv et"
        variant="danger"
      />
    </div>
  );
});

RelativesInfoTab.displayName = "RelativesInfoTab";

export default RelativesInfoTab;
