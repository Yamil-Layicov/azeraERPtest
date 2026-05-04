import { useState } from "react";
import { FormInput, ModernDatePicker, Button } from "@/shared/ui";
import { EnumLookupSelect } from "@/features/lookups";
import type { Option } from "@/shared/types";
import styles from "./VacationInfoTab.module.css";
import { VacationTable, type VacationItem } from "./VacationTable";
import { toast } from "react-hot-toast";

export const VacationInfoTab = () => {
    // State management
    const [vacations, setVacations] = useState<VacationItem[]>([]);
    
    // Form fields
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [orderDate, setOrderDate] = useState<Date | null>(null);
    const [vacationType, setVacationType] = useState<Option | null>(null);
    const [rights, setRights] = useState("");
    const [mainDays, setMainDays] = useState("");
    const [extraDays, setExtraDays] = useState("");
    const [orderNumber, setOrderNumber] = useState("");

    const handleAdd = () => {
        if (!vacationType || !startDate || !endDate || !rights || !mainDays || !orderDate || !orderNumber) {
            toast.error("Zəhmət olmasa bütün vacib xanaları doldurun");
            return;
        }

        const newItem: VacationItem = {
            id: Date.now().toString(),
            type: vacationType,
            workYearDisplay: "-",
            startDate,
            endDate,
            returnToWorkDate: null,
            entitlementMain: rights,
            entitlementExtra: "-",
            usedMain: mainDays,
            usedExtra: extraDays.trim() ? extraDays : "-",
            remainingMain: "-",
            remainingExtra: "-",
            orderDate: orderDate!,
            orderNumber,
        };

        setVacations([...vacations, newItem]);
        handleClear();
        toast.success("Məzuniyyət əlavə edildi");
    };

    const handleClear = () => {
        setStartDate(null);
        setEndDate(null);
        setOrderDate(null);
        setVacationType(null);
        setRights("");
        setMainDays("");
        setExtraDays("");
        setOrderNumber("");
    };

    const handleDelete = (id: string) => {
        setVacations(vacations.filter(v => v.id !== id));
        toast.success("Məzuniyyət silindi");
    };

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                {/* Row 1 */}
                <div className={styles.fieldGroup}>
                    <label className={styles.label}>
                        Məzuniyyət növü <span className={styles.required}>*</span>
                    </label>
                    <div className={styles.controlWrap}>
                        <EnumLookupSelect
                            id="vacation-type"
                            code="LeaveTypes"
                            value={vacationType}
                            onChange={setVacationType}
                            defaultText="Seçin"
                        />
                    </div>
                </div>

                <div className={styles.fieldGroup}>
                     <div className={styles.twoColumnGroup}>
                        <div className={styles.subField}>
                            <label className={styles.label}>
                                Başlama tarixi <span className={styles.required}>*</span>
                            </label>
                            <ModernDatePicker
                                id="vacation-start-date"
                                placeholder="dd.mm.yyyy"
                                value={startDate}
                                onChange={setStartDate}
                            />
                        </div>
                        <div className={styles.subField}>
                            <label className={styles.label}>
                                Bitmə tarixi <span className={styles.required}>*</span>
                            </label>
                            <ModernDatePicker
                                id="vacation-end-date"
                                placeholder="dd.mm.yyyy"
                                value={endDate}
                                onChange={setEndDate}
                            />
                        </div>
                    </div>
                </div>

                <div className={styles.fieldGroup}>
                    <FormInput
                        id="vacation-rights"
                        type="number"
                        label="Əmək məzuniyyəti Hüququ(Gün) / Əsas"
                        required={true}
                        placeholder="Daxil edin"
                        value={rights}
                        onChange={setRights}
                    />
                </div>

                {/* Row 2 */}
                <div className={styles.fieldGroup}>
                    <FormInput
                        id="vacation-used-days"
                        type="number"
                        label="İstifadə olunan əsas günlər"
                        required={true}
                        placeholder="Daxil edin"
                        value={mainDays}
                        onChange={setMainDays}
                    />
                </div>

                <div className={styles.fieldGroup}>
                    <FormInput
                        id="vacation-extra-days"
                        type="number"
                        label="İstifadə olunan əlavə günlər"
                        placeholder="Daxil edin"
                        value={extraDays}
                        onChange={setExtraDays}
                    />
                </div>

                <div className={styles.fieldGroup}>
                     <div className={styles.twoColumnGroup}>
                        <div className={styles.subField}>
                            <label className={styles.label}>
                                Əmr tarixi <span className={styles.required}>*</span>
                            </label>
                            <ModernDatePicker
                                id="vacation-order-date"
                                placeholder="dd.mm.yyyy"
                                value={orderDate}
                                onChange={setOrderDate}
                            />
                        </div>
                        <div className={styles.subField}>
                            <FormInput
                                id="vacation-order-number"
                                placeholder="Daxil edin"
                                type="text"
                                label="Əmr nömrəsi" 
                                required={true}
                                value={orderNumber}
                                onChange={setOrderNumber}
                            />
                        </div>
                    </div>
                </div>

                <div className={styles.actions}>
                    <Button 
                        type="button" 
                        variant="secondary" 
                        className={styles.addButton}
                        onClick={handleAdd}
                    >
                        Əlavə et
                    </Button>
                    <Button 
                        type="button" 
                        variant="outline" 
                        className={styles.clearButton}
                        onClick={handleClear}
                    >
                        Təmizlə
                    </Button>
                </div>
            </div>
            
            <VacationTable 
                data={vacations}
                onDelete={handleDelete}
            />
        </div>
    );
};
