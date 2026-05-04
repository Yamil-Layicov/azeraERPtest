import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";
import styles from "./SickLeaveTab.module.css";
import { SickLeaveForm } from "./form";
import { SickLeaveTable } from "./table";
import type { SickLeaveItem } from "./types";
import { useAddEmployeeStore } from "@/features/kadrlar/create-worker/model/useAddEmployeeStore";
import { createWorkerService } from "@/features/kadrlar/create-worker/api/createWorkerService";
import type { IncapacityEntryRequest, IncapacitiesInfoListItem } from "@/features/kadrlar/create-worker/model/types";
import { formatDateToYMD } from "@/shared/lib/utils";
import { getBackendErrorMessage } from "@/shared/api";
import { ConfirmModal } from "@/shared/ui";
import { useEmployeeStore } from "@/features/kadrlar/create-worker/model/useEmployeeStore";

type InnerTab = "vacation" | "business-trip" | "permission" | "sick-leave" | "privileges" | "special-notes";

interface SickLeaveTabProps {
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

const mapApiRowToItem = (row: IncapacitiesInfoListItem | Record<string, unknown>): SickLeaveItem => {
    const r = row as Record<string, unknown>;
    const id = pickStr(row.id, r.Id);
    const employeeId = pickStr((row as any).employeeId, r.EmployeeId);
    return {
        id,
        employeeId,
        seriesNumber: pickStr(row.documentNumber, r.DocumentNumber),
        medicalInstitution: pickStr(row.medicalInstitution, r.MedicalInstitution),
        diagnosis: pickStr(row.diagnosis, r.Diagnosis),
        dateFrom: parseApiDate(pickStr(row.startDate, r.StartDate)),
        dateTo: parseApiDate(pickStr(row.endDate, r.EndDate)),
    };
};

export const SickLeaveTab = ({
    activeInnerTab = "sick-leave",
    tabVisitKey = 0,
}: SickLeaveTabProps) => {
    const [list, setList] = useState<SickLeaveItem[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [incapacityIdToDelete, setIncapacityIdToDelete] = useState<string | null>(null);
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

    const { data: incapacitiesData, refetch, isFetching } = useQuery({
        queryKey: ["incapacitiesInfo", personId],
        queryFn: () => createWorkerService.getIncapacitiesInfoByPersonId(personId!),
        enabled: false,
    });

    useEffect(() => {
        if (!personId) return;
        if (currentStep !== 9) return;
        if (activeInnerTab !== "sick-leave") return;
        void refetch();
    }, [personId, currentStep, activeInnerTab, tabVisitKey, refetch]);

    const serverList = useMemo(() => {
        if (!incapacitiesData?.isSuccess || !Array.isArray(incapacitiesData.result)) return [];
        return incapacitiesData.result.map((row) => mapApiRowToItem(row));
    }, [incapacitiesData]);

    useEffect(() => {
        setList(serverList);
    }, [serverList]);

    const editingItem = useMemo(
        () => (editingId ? list.find((x) => x.id === editingId) ?? null : null),
        [list, editingId],
    );

    const handleAdd = async (newItem: SickLeaveItem): Promise<boolean> => {
        if (!personId) {
            toast.error("İşçi ID tapılmadı");
            return false;
        }

        const startDate = formatDateToYMD(newItem.dateFrom);
        const endDate = formatDateToYMD(newItem.dateTo);
        if (!startDate || !endDate) {
            toast.error("Tarixlər düzgün deyil");
            return false;
        }

        const payload: IncapacityEntryRequest = {
            personId,
            id: editingId ? String(editingId) : null,
            isModify: Boolean(editingId),
            documentNumber: newItem.seriesNumber.trim(),
            medicalInstitution: newItem.medicalInstitution.trim(),
            diagnosis: newItem.diagnosis.trim(),
            startDate,
            endDate,
            employeeId: normalizedEmployeeId,
            rootCompanyId: normalizedRootCompanyId,
        };

        try {
            const response = (await createWorkerService.addOrEditIncapacityInfo(payload)) as {
                isSuccess?: boolean;
                errorMessage?: string | null;
                result?: { id?: string } | string;
            };
            if (response?.isSuccess === false) {
                toast.error(response?.errorMessage ?? "");
                return false;
            }

            const resultId =
                typeof response?.result === "object" && response.result != null && "id" in response.result
                    ? String((response.result as { id?: string }).id ?? "")
                    : typeof response?.result === "string"
                        ? response.result
                        : "";
            const savedItem: SickLeaveItem = {
                ...newItem,
                id: resultId || newItem.id,
            };

            if (editingId) {
                setList((prev) => prev.map((x) => (x.id === editingId ? savedItem : x)));
            } else {
                setList((prev) => [...prev, savedItem]);
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
        setIncapacityIdToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        if (isDeleting) return;
        setIsDeleteModalOpen(false);
        setIncapacityIdToDelete(null);
    };

    const confirmDelete = async () => {
        if (!incapacityIdToDelete) return;
        setIsDeleting(true);
        try {
            const response = (await createWorkerService.removeIncapacityInfo(incapacityIdToDelete)) as {
                isSuccess?: boolean;
                errorMessage?: string | null;
            };
            if (response?.isSuccess === false) {
                toast.error(response?.errorMessage ?? "Silinərkən xəta baş verdi");
                return;
            }
            setList((prev) => prev.filter((item) => item.id !== incapacityIdToDelete));
            if (editingId === incapacityIdToDelete) setEditingId(null);
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
            setIncapacityIdToDelete(null);
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
            <SickLeaveForm onSubmit={handleAdd} editItem={editingItem} onClearEdit={handleClearEdit} />
            <SickLeaveTable data={list} onDelete={requestDelete} onEdit={handleEdit} />

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                onConfirm={() => void confirmDelete()}
                title="Əmək qabiliyyətsizlik məlumatını silmək istədiyinizə əminsiniz?"
                description="Bu məlumatı sildikdə geri qaytara bilməyəcəksiniz."
                confirmText="Sil"
                cancelText="Ləğv et"
                variant="danger"
                isLoading={isDeleting}
            />
        </div>
    );
};
