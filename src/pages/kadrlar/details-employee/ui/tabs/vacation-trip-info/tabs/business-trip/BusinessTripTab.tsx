import { useState } from "react";
import { FormInput, ModernDatePicker, Button } from "@/shared/ui";
import { BusinessTripTable } from "./BusinessTripTable";
import type { BusinessTripItem } from "./BusinessTripTable";
import styles from "./BusinessTripTab.module.css";
import { toast } from "react-hot-toast";

export const BusinessTripTab = () => {
    const [list, setList] = useState<BusinessTripItem[]>([]);
    
    // Form fields
    const [destination, setDestination] = useState("");
    const [reason, setReason] = useState("");
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [orderDate, setOrderDate] = useState<Date | null>(null);
    const [orderNumber, setOrderNumber] = useState("");

    const handleAdd = () => {
         if (!destination || !reason || !startDate || !endDate || !orderDate || !orderNumber) {
            toast.error("Zəhmət olmasa bütün vacib xanaları doldurun");
            return;
        }

        // Calculate duration based on milliseconds
        // Adding 1 day to be inclusive (e.g. 1st to 1st is 1 day)
        const diff = endDate.getTime() - startDate.getTime();
        const duration = Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;

        if (duration <= 0) {
             toast.error("Bitmə tarixi başlama tarixindən tez ola bilməz");
             return;
        }

        const newItem: BusinessTripItem = {
            id: Date.now().toString(),
            destination,
            reason,
            startDate,
            endDate,
            returnToWorkDate: null,
            duration,
            orderDate,
            orderNumber
        };

        setList([...list, newItem]);
        handleClear();
        toast.success("Ezamiyyət əlavə edildi");
    };

    const handleClear = () => {
        setDestination("");
        setReason("");
        setStartDate(null);
        setEndDate(null);
        setOrderDate(null);
        setOrderNumber("");
    };

     const handleDelete = (id: string) => {
        setList(list.filter(item => item.id !== id));
        toast.success("Silindi");
    };

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                 {/* Row 1 */}
                 <div className={styles.fieldGroup}>
                    <FormInput
                        id="trip-destination"
                        type="text"
                        label="Getdiyi yer"
                        required={true}
                        placeholder="Daxil edin"
                        value={destination}
                        onChange={setDestination}
                    />
                 </div>
                 <div className={styles.fieldGroup}>
                    <FormInput
                        id="trip-reason"
                        type="text"
                        label="Səbəb"
                        required={true}
                        placeholder="Daxil edin"
                        value={reason}
                        onChange={setReason}
                    />
                 </div>
                 <div className={styles.fieldGroup}>
                     <div className={styles.twoColumnGroup}>
                        <div className={styles.subField}>
                            <label className={styles.label}>
                                Başlama tarixi <span className={styles.required}>*</span>
                            </label>
                            <ModernDatePicker
                                id="trip-start"
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
                                id="trip-end"
                                placeholder="dd.mm.yyyy"
                                value={endDate}
                                onChange={setEndDate}
                                align="right"
                            />
                        </div>
                     </div>
                 </div>

                 {/* Row 2 */}
                  <div className={styles.fieldGroup}>
                     <div className={styles.twoColumnGroup}>
                        <div className={styles.subField}>
                            <label className={styles.label}>
                                Əmr tarixi <span className={styles.required}>*</span>
                            </label>
                            <ModernDatePicker
                                id="trip-order-date"
                                placeholder="dd.mm.yyyy"
                                value={orderDate}
                                onChange={setOrderDate}
                            />
                        </div>
                        <div className={styles.subField}>
                            <FormInput
                                id="trip-order-number"
                                type="text"
                                placeholder="Daxil edin"
                                label="Əmr nömrəsi" 
                                required={true}
                                value={orderNumber}
                                onChange={setOrderNumber}
                            />
                        </div>
                    </div>
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

            <BusinessTripTable 
                data={list}
                onDelete={handleDelete}
            />
        </div>
    );
};
