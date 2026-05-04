import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";
import styles from "./PrivilegesTab.module.css";
import { PrivilegesForm } from "./form";
import { PrivilegesTable } from "./table";
import type { PrivilegeItem } from "./types";
import { useAddEmployeeStore } from "@/features/kadrlar/create-worker/model/useAddEmployeeStore";
import { createWorkerService } from "@/features/kadrlar/create-worker/api/createWorkerService";
import type { PersonPrivilegeEntryRequest, PersonPrivilegesInfoListItem } from "@/features/kadrlar/create-worker/model/types";
import { formatDateToYMD } from "@/shared/lib/utils";
import { getBackendErrorMessage } from "@/shared/api";
import { ConfirmModal } from "@/shared/ui";
import { useEmployeeStore } from "@/features/kadrlar/create-worker/model/useEmployeeStore";

type InnerTab = "vacation" | "business-trip" | "permission" | "sick-leave" | "privileges" | "special-notes";

interface PrivilegesTabProps {
    activeInnerTab?: InnerTab;
    tabVisitKey?: number;
}

const parseApiDate = (s: string | null | undefined): Date => {
    if (!s) return new Date(NaN);
    const d = new Date(s);
    if (!Number.isNaN(d.getTime())) return d;
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(s).trim());
    if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    return new Date(NaN);
};

const pickStr = (...vals: unknown[]): string => {
    for (const v of vals) {
        if (v === null || v === undefined) continue;
        const t = String(v).trim();
        if (t !== "") return t;
    }
    return "";
};

const mapApiRowToItem = (
    row: PersonPrivilegesInfoListItem | Record<string, unknown>,
): PrivilegeItem => {
    const r = row as Record<string, unknown>;
    const privilegeId = pickStr(row.privilegeId, r.PrivilegeId);
    const apiPrivilegeName = pickStr(row.privilege, row.privilegeName, r.Privilege, r.PrivilegeName);
    return {
        id: pickStr(row.id, r.Id),
        privilegeId,
        privilege: apiPrivilegeName || "-",
        legalBasis: pickStr(row.legalBasisCode, r.LegalBasisCode),
        extraVacation: Number(row.extraVacation ?? r.ExtraVacation ?? 0) || 0,
        issueDate: parseApiDate(pickStr(row.issueDate, r.IssueDate)),
    };
};

export const PrivilegesTab = ({
    activeInnerTab = "privileges",
    tabVisitKey = 0,
}: PrivilegesTabProps) => {
    const [list, setList] = useState<PrivilegeItem[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [privilegeIdToDelete, setPrivilegeIdToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const personId = useAddEmployeeStore((state) => state.personId);
    const employeeId = useAddEmployeeStore((state) => state.employeeId);
    const rootCompanyIdFromAdd = useAddEmployeeStore((state) => state.rootCompanyId);
    const currentStep = useAddEmployeeStore((state) => state.currentStep);
    const currentRootCompanyId = useEmployeeStore((state) => state.rootCompanyId);
    const effectiveRootCompanyId = rootCompanyIdFromAdd ?? currentRootCompanyId;
    const normalizedEmployeeId =
        employeeId != null && String(employeeId).trim() !== ""
            ? String(employeeId).trim()
            : null;
    const normalizedRootCompanyId =
        effectiveRootCompanyId != null &&
        String(effectiveRootCompanyId).trim() !== ""
            ? String(effectiveRootCompanyId).trim()
            : null;

    const { data: privilegesData, refetch, isFetching } = useQuery({
        queryKey: ["personPrivilegesInfo", personId],
        queryFn: () => createWorkerService.getPersonPrivilegesInfoByPersonId(personId!),
        enabled: false,
    });

    useEffect(() => {
        if (!personId) return;
        if (currentStep !== 9) return;
        if (activeInnerTab !== "privileges") return;
        void refetch();
    }, [personId, currentStep, activeInnerTab, tabVisitKey, refetch]);

    const serverList = useMemo(() => {
        if (!privilegesData?.isSuccess || !Array.isArray(privilegesData.result)) return [];
        return privilegesData.result.map((row) => mapApiRowToItem(row));
    }, [privilegesData]);

    useEffect(() => {
        setList(serverList);
    }, [serverList]);

    const editingItem = useMemo(
        () => (editingId ? list.find((x) => x.id === editingId) ?? null : null),
        [list, editingId],
    );

    const handleAdd = async (newItem: PrivilegeItem): Promise<boolean> => {
        if (!personId) {
            toast.error("İşçi ID tapılmadı");
            return false;
        }
        const issueDate = formatDateToYMD(newItem.issueDate);
        if (!issueDate) {
            toast.error("Verilmə tarixi düzgün deyil");
            return false;
        }
        const payload: PersonPrivilegeEntryRequest = {
            personId,
            id: editingId ? String(editingId) : null,
            isModify: Boolean(editingId),
            privilegeId: newItem.privilegeId,
            issueDate,
            employeeId: normalizedEmployeeId,
            rootCompanyId: normalizedRootCompanyId,
        };
        try {
            const response = (await createWorkerService.addOrEditPersonPrivilegeInfo(payload)) as {
                isSuccess?: boolean;
                errorMessage?: string | null;
            };
            if (response?.isSuccess === false) {
                toast.error(response?.errorMessage ?? "");
                return false;
            }
            await refetch();
            toast.success(editingId ? "Yeniləndi" : "Əlavə edildi");
            setEditingId(null);
            return true;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                toast.error(getBackendErrorMessage(error));
            } else {
                toast.error("Xəta baş verdi");
            }
            return false;
        }
    };

    const requestDelete = (id: string) => {
        setPrivilegeIdToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        if (isDeleting) return;
        setIsDeleteModalOpen(false);
        setPrivilegeIdToDelete(null);
    };

    const confirmDelete = async () => {
        if (!privilegeIdToDelete) return;
        setIsDeleting(true);
        try {
            const response = (await createWorkerService.removePersonPrivilegeInfo(privilegeIdToDelete)) as {
                isSuccess?: boolean;
                errorMessage?: string | null;
            };
            if (response?.isSuccess === false) {
                toast.error(response?.errorMessage ?? "Silinərkən xəta baş verdi");
                return;
            }
            if (editingId === privilegeIdToDelete) {
                setEditingId(null);
            }
            await refetch();
            toast.success("Silindi");
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                toast.error(getBackendErrorMessage(error));
            } else {
                toast.error("Silinmə zamanı xəta baş verdi");
            }
        } finally {
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
            setPrivilegeIdToDelete(null);
        }
    };

    const handleEdit = (id: string) => {
        const item = list.find((x) => x.id === id);
        if (!item) {
            toast.error("Məlumat tapılmadı");
            return;
        }
        setEditingId(id);
    };

    const handleClearEdit = () => {
        setEditingId(null);
    };

    return (
        <div className={styles.container}>
            {isFetching && <p className={styles.fetchingText}>Yüklənir...</p>}
            <PrivilegesForm onSubmit={handleAdd} editItem={editingItem} onClearEdit={handleClearEdit} />
            <PrivilegesTable data={list} onDelete={requestDelete} onEdit={handleEdit} />

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                onConfirm={() => void confirmDelete()}
                title="İmtiyaz məlumatını silmək istədiyinizə əminsiniz?"
                description="Bu məlumatı sildikdə geri qaytara bilməyəcəksiniz."
                confirmText="Sil"
                cancelText="Ləğv et"
                variant="danger"
                isLoading={isDeleting}
            />
        </div>
    );
};
