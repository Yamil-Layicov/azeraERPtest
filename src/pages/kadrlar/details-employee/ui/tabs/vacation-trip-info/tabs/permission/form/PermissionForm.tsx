
import { useState } from "react";
import { FormInput, ModernDatePicker, Button,  FormTextarea, TimePicker } from "@/shared/ui";
import { EnumLookupSelect } from "@/features/lookups";
import type { Option } from "@/shared/types";
import { toast } from "react-hot-toast";
import styles from "./PermissionForm.module.css";
import type { PermissionItem } from "../types";

interface PermissionFormProps {
    onSubmit: (item: PermissionItem) => void;
}

export const PermissionForm = ({ onSubmit }: PermissionFormProps) => {
    const [type, setType] = useState<Option | null>(null);
    const [reason, setReason] = useState<Option | null>(null);
    const [date, setDate] = useState<Date | null>(null);
    const [startTime, setStartTime] = useState<string | null>(null);
    const [endTime, setEndTime] = useState<string | null>(null);
    const [approver, setApprover] = useState("");
    const [note, setNote] = useState("");

    const handleAdd = () => {
        if (!type || !reason || !date || !startTime || !endTime || !approver) {
            toast.error("Zəhmət olmasa bütün vacib xanaları doldurun");
            return;
        }

        const newItem: PermissionItem = {
            id: Date.now().toString(),
            type: type.fullName || type.label || "",
            reason: reason.fullName || reason.label || "",
            timeOffTypeCode: String(type.id),
            timeOffReasonCode: String(reason.id),
            date,
            startTime,
            endTime,
            approver,
            note
        };

        onSubmit(newItem);
        handleClear();
    };

    const handleClear = () => {
        setType(null);
        setReason(null);
        setDate(null);
        setStartTime(null);
        setEndTime(null);
        setApprover("");
        setNote("");
    };

    return (
        <div className={styles.grid}>
            <div className={styles.fieldGroup}>
                    <label className={styles.label}>
                    Növü <span className={styles.required}>*</span>
                </label>
                <EnumLookupSelect
                    id="permission-type"
                    code="TimeOffTypes"
                    defaultText="Seçin"
                    value={type}
                    onChange={setType}
                />
            </div>
            <div className={styles.fieldGroup}>
                    <label className={styles.label}>
                    Səbəb <span className={styles.required}>*</span>
                </label>
                <EnumLookupSelect
                    id="permission-reason"
                    code="TimeOffReasons"
                    defaultText="Seçin"
                    value={reason}
                    onChange={setReason}
                />
            </div>
            <div className={styles.fieldGroup}>
                <label className={styles.label}>
                    İcazə verilən tarix <span className={styles.required}>*</span>
                </label>
                <ModernDatePicker
                    value={date}
                    onChange={setDate}
                    placeholder="dd.mm.yyyy"
                />
            </div>

            <div className={styles.fieldGroup}>
                <div className={styles.twoColumnGroup}>
                        <div className={styles.subField}>
                        <TimePicker
                            label="Başlama saatı"
                            value={startTime}
                            onChange={setStartTime}
                            placeholder="HH:mm"
                        />
                    </div>
                    <div className={styles.subField}>
                            <TimePicker
                            label="Bitmə saatı"
                            value={endTime}
                            onChange={setEndTime}
                            placeholder="HH:mm"
                        />
                    </div>
                </div>
            </div>
                <div className={styles.fieldGroup}>
                <FormInput
                    id="approver"
                    type="text"
                    label="İcazəni təsdiq edən rəhbər"
                    placeholder="Daxil edin"
                    value={approver}
                    onChange={setApprover}
                    required={true}
                />
            </div>
                <div className={styles.fieldGroup}>
                <FormTextarea
                        id="note"
                        label="Qeyd"
                        placeholder="Daxil edin"
                        value={note}
                        onChange={(val) => setNote(val)}
                        rows={1}
                />
            </div>

            <div className={styles.actions}>
                <Button type="button" variant="secondary" className={styles.addButton} onClick={handleAdd}>
                    Əlavə et
                </Button>
                <Button type="button" variant="outline" className={styles.clearButton} onClick={handleClear}>
                    Təmizlə
                </Button>
            </div>
        </div>
    );
};
