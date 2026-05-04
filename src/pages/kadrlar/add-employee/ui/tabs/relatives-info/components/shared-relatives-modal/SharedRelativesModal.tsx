import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Modal } from "@/shared/ui";
import { createWorkerService } from "@/features/kadrlar/create-worker/api/createWorkerService";
import { useEnumItemsByCode } from "@/features/lookups/hooks";
import { SharedRelativesTable, type SharedRelativeItem } from "./SharedRelativesTable";
import styles from "./SharedRelativesModal.module.css";

interface SharedRelativesModalProps {
  isOpen: boolean;
  onClose: () => void;
  personId: string | null;
}

export const SharedRelativesModal: React.FC<SharedRelativesModalProps> = ({
  isOpen,
  onClose,
  personId,
}) => {
  const { data, isLoading } = useQuery({
    queryKey: ["shared-relatives", personId],
    queryFn: () => createWorkerService.getSharedRelativesByPersonId(personId!),
    enabled: !!personId && isOpen,
  });

  const { options: relationshipTypes } = useEnumItemsByCode("RelationshipTypes", true);

  const sharedRelativesList = useMemo<SharedRelativeItem[]>(() => {
    if (!data?.isSuccess || !data?.result) return [];

    return (data.result as any[]).map((item: any) => {
      const relOption = relationshipTypes.find(
        (t) => String(t.id) === String(item.otherEmployeeRelationship)
      );

      return {
        id: item.otherEmployeeId || item.id,
        relativeFullName: item.relativeFullName || "-",
        relativePin: item.relativePin || "-",
        otherEmployeeRelationship: relOption?.fullName || item.otherEmployeeRelationship || "-",
        otherEmployeeFullName: item.otherEmployeeFullName || "-",
        otherEmployeePin: item.otherEmployeePin || "-",
      };
    });
  }, [data, relationshipTypes]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Əlaqəli şəxsə keçid et"
      size="xl"
    >
      <div className={styles.container}>
        {isLoading ? (
          <div className={styles.loading}>Yüklənir...</div>
        ) : (
          <SharedRelativesTable data={sharedRelativesList} />
        )}
      </div>
    </Modal>
  );
};
