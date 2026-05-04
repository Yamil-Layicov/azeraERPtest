import { useState } from "react";
import { Button } from "@/shared/ui";
import { PrivilegeTypesLookupSelect } from "@/features/lookups";
import type { Option } from "@/shared/types";
import { toast } from "react-hot-toast";
import styles from "./PrivilegesForm.module.css";
import type { PrivilegeItem } from "../types";

interface PrivilegesFormProps {
    onSubmit: (item: PrivilegeItem) => void;
}

interface PrivilegeOption extends Option {
    legalBasisCode?: string;
}

export const PrivilegesForm = ({ onSubmit }: PrivilegesFormProps) => {
    const [privilege, setPrivilege] = useState<PrivilegeOption | null>(null);

    const handleAdd = () => {
        if (!privilege) {
            toast.error("Zəhmət olmasa imtiyaz seçin");
            return;
        }
        onSubmit({
            id: Date.now().toString(),
            privilege: privilege.fullName || privilege.label || "",
            legalBasis: privilege.legalBasisCode || ""
        });
        handleClear();
    };

    const handleClear = () => {
        setPrivilege(null);
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
            <div className={styles.actions}>
                <Button type="button" variant="secondary" className={styles.addButton} onClick={handleAdd}>
                    Əlavə et
                </Button>
            </div>
        </div>
    );
};
