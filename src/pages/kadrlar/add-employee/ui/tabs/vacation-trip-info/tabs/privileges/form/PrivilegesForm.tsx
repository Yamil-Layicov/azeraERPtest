import { useEffect, useState } from "react";
import { Button, ModernDatePicker } from "@/shared/ui";
import { PrivilegeTypesLookupSelect } from "@/features/lookups";
import { PermissionGuard } from "@/features/auth/components/PermissionGuard";
import { PERMISSIONS } from "@/shared/consts/permissions";
import type { Option } from "@/shared/types";
import { toast } from "react-hot-toast";
import styles from "./PrivilegesForm.module.css";
import type { PrivilegeItem } from "../types";

interface PrivilegesFormProps {
    onSubmit: (item: PrivilegeItem) => Promise<boolean>;
    editItem?: PrivilegeItem | null;
    onClearEdit?: () => void;
}

interface PrivilegeOption extends Option {
    legalBasisCode?: string;
}

export const PrivilegesForm = ({ onSubmit, editItem = null, onClearEdit }: PrivilegesFormProps) => {
    const [privilege, setPrivilege] = useState<PrivilegeOption | null>(null);
    const [issueDate, setIssueDate] = useState<Date | null>(null);

    useEffect(() => {
        if (!editItem) return;
        setPrivilege({
            id: editItem.privilegeId,
            fullName: editItem.privilege,
            label: editItem.privilege,
            legalBasisCode: editItem.legalBasis,
        });
        setIssueDate(editItem.issueDate);
    }, [editItem]);

    const handleAdd = () => {
        if (!privilege || !issueDate) {
            toast.error("Zəhmət olmasa bütün vacib xanaları doldurun");
            return;
        }
        void onSubmit({
            id: editItem?.id ?? Date.now().toString(),
            privilegeId: String(privilege.id ?? ""),
            privilege: privilege.fullName || privilege.label || "",
            legalBasis: privilege.legalBasisCode || "",
            extraVacation: editItem?.extraVacation ?? 0,
            issueDate,
        }).then((ok) => {
            if (ok) {
                handleClear();
            }
        });
    };

    const handleClear = () => {
        setPrivilege(null);
        setIssueDate(null);
        onClearEdit?.();
    };

    return (
        <div className={styles.grid}>
            <div className={styles.fieldGroup}>
                <label className={styles.label}>
                    İmtiyazlar <span className={styles.required}>*</span>
                </label>
                <PrivilegeTypesLookupSelect
                    id="privilege-types"
                    value={privilege}
                    onChange={(val) => setPrivilege(val as PrivilegeOption)}
                />
            </div>
            <div className={styles.fieldGroup}>
                <label className={styles.label}>
                    Verilmə tarixi <span className={styles.required}>*</span>
                </label>
                <ModernDatePicker
                    id="privilege-issue-date"
                    value={issueDate}
                    onChange={setIssueDate}
                    placeholder="dd.mm.yyyy"
                />
            </div>
            <div className={styles.actions}>
                <PermissionGuard
                    permission={editItem ? PERMISSIONS.EMPLOYEE.UPDATE : PERMISSIONS.EMPLOYEE.CREATE}
                >
                    <Button type="button" variant="secondary" className={styles.addButton} onClick={handleAdd}>
                        {editItem ? "Yenilə" : "Əlavə et"}
                    </Button>
                </PermissionGuard>
            </div>
        </div>
    );
};
