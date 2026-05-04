import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { createWorkerService } from "../api/createWorkerService";
import { useAddEmployeeStore } from "../model/useAddEmployeeStore";
import type { WorkExperienceInfoListItem } from "../model/types";

interface UsePendingWorkExperienceApprovalOptions {
  enabled?: boolean;
  workExperienceList?: WorkExperienceInfoListItem[] | null;
}

export const usePendingWorkExperienceApproval = ({
  enabled = true,
  workExperienceList,
}: UsePendingWorkExperienceApprovalOptions = {}) => {
  const personId = useAddEmployeeStore((state) => state.personId);
  const employeeId = useAddEmployeeStore((state) => state.employeeId);
  const setHasPendingWorkExperienceApproval = useAddEmployeeStore(
    (state) => state.setHasPendingWorkExperienceApproval,
  );
  const effectiveEmployeeId = employeeId;

  const shouldFetchList = enabled && !!personId && !workExperienceList;

  const { data } = useQuery({
    queryKey: ["workExperienceList", personId],
    queryFn: () => createWorkerService.getWorkExperienceInfoByPersonId(personId!),
    enabled: shouldFetchList,
    staleTime: 0,
    gcTime: 0,
  });

  const resolvedList = workExperienceList ?? data?.result ?? [];

  const hasPendingWorkExperienceApproval = useMemo(() => {
    if (!enabled || !Array.isArray(resolvedList)) return false;

    const selectedEmployeeId = String(effectiveEmployeeId ?? "").trim().toLowerCase();
    if (!selectedEmployeeId) return false;

    return resolvedList.some((item) => {
      const itemEmployeeId = String(item.employeeId ?? "").trim().toLowerCase();
      const isPending = String(item.status ?? "").trim().toLowerCase() === "pending";
      return itemEmployeeId === selectedEmployeeId && isPending;
    });
  }, [enabled, resolvedList, effectiveEmployeeId]);

  useEffect(() => {
    if (!enabled) return;
    setHasPendingWorkExperienceApproval(hasPendingWorkExperienceApproval);
  }, [enabled, hasPendingWorkExperienceApproval, setHasPendingWorkExperienceApproval]);

  useEffect(() => {
    if (!enabled) return;
    if (!personId) {
      setHasPendingWorkExperienceApproval(false);
    }
  }, [enabled, personId, setHasPendingWorkExperienceApproval]);

  return { hasPendingWorkExperienceApproval };
};
