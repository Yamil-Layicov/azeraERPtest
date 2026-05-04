
import { useEffect, useRef, useState, useLayoutEffect, useId } from "react";
import styles from "./TimePicker.module.css";
import { useClickOutside } from "@/shared/lib/hooks";

interface TimePickerProps {
    value: string | null; // Format: "HH:mm"
    onChange: (value: string | null) => void;
    label?: string;
    disabled?: boolean;
    id?: string;
    className?: string;
    placeholder?: string;
    align?: "left" | "right";
    error?: string;
    required?: boolean;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));
const MINUTES = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"));

const isValidTime = (time: string): boolean => {
    if (!/^\d{2}:\d{2}$/.test(time)) return false;
    const parts = time.split(":").map(Number);
    if (parts.length !== 2) return false;
    const [h, m] = parts;
    return typeof h === 'number' && typeof m === 'number' && h >= 0 && h < 24 && m >= 0 && m < 60;
};

export default function TimePicker({
    value,
    onChange,
    label,
    disabled,
    id,
    className = "",
    placeholder = "HH:mm",
    align = "left",
    error,
    required = false,
}: TimePickerProps) {
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState(value || "");
    const [panelAlignRight, setPanelAlignRight] = useState(false);
    
    const ref = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const hourRef = useRef<HTMLDivElement>(null);
    const minuteRef = useRef<HTMLDivElement>(null);

    const uniqueId = useId();
    const finalId = id || uniqueId;

    useClickOutside(ref, () => {
        if (open) handleBlur();
        setOpen(false);
    }, open);

    useEffect(() => {
        setInputValue(value || "");
    }, [value]);

    useLayoutEffect(() => {
        if (!open || !ref.current) return;
        
        if (align === "right") {
            setPanelAlignRight(true);
            return;
        }
        
        const rect = ref.current.getBoundingClientRect();
        const overflowRight = rect.left + 200 > window.innerWidth - 16;
        setPanelAlignRight(overflowRight);

        // Scroll to selected time
        if (value && isValidTime(value)) {
            const [h, m] = value.split(":");
            const hEl = hourRef.current?.querySelector(`[data-value="${h}"]`);
            const mEl = minuteRef.current?.querySelector(`[data-value="${m}"]`);
            hEl?.scrollIntoView({ block: "center" });
            mEl?.scrollIntoView({ block: "center" });
        }
    }, [open, align, value]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        
        // Simple mask logic
        const digits = val.replace(/\D/g, "");
        let formatted = "";
        
        if (digits.length > 0) formatted += digits.substring(0, 2);
        if (digits.length > 2) formatted += ":" + digits.substring(2, 4);
        
        setInputValue(formatted);

        if (isValidTime(formatted)) {
            onChange(formatted);
        } else if (formatted === "") {
            onChange(null);
        }
    };

    const handleBlur = () => {
        if (inputValue && !isValidTime(inputValue)) {
            // Revert to valid value or clear if invalid
            setInputValue(value || "");
        } else if (!inputValue && value) {
            onChange(null);
        }
    };

    const handleSelect = (type: "hour" | "minute", val: string) => {
        let current = inputValue;
        if (!isValidTime(current)) {
            const now = new Date();
            current = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
        }
        
        const [h, m] = current.split(":");
        let newTime = "";
        
        if (type === "hour") {
            newTime = `${val}:${m}`;
        } else {
            newTime = `${h}:${val}`;
        }
        
        setInputValue(newTime);
        onChange(newTime);
    };

    const handleCurrentTime = () => {
        const now = new Date();
        const time = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
        setInputValue(time);
        onChange(time);
        setOpen(false);
    };

    const handleClear = () => {
        setInputValue("");
        onChange(null);
        setOpen(false);
    };

    return (
        <div className={styles.wrapper} ref={ref}>
            {label && (
                <label htmlFor={finalId} className={styles.label}>
                    {label}
                    {required && <span className="required-star">*</span>}
                </label>
            )}
            <input
                ref={inputRef}
                id={finalId}
                type="text"
                className={`${styles.input} ${className} ${error ? styles.inputError : ""}`}
                value={inputValue}
                onChange={handleInputChange}
                onFocus={() => setOpen(true)}
                placeholder={placeholder}
                disabled={disabled}
                autoComplete="off"
                maxLength={5}
                aria-invalid={!!error}
                aria-describedby={error ? `${finalId}-error` : undefined}
            />

            {open && (
                <div className={`${styles.panel} ${panelAlignRight ? styles.panelAlignRight : ""}`}>
                     <div className={styles.columnHeader}>Saat : Dəqiqə</div>
                    <div className={styles.timeContainer}>
                        <div className={styles.column} ref={hourRef}>
                            {HOURS.map(h => (
                                <div
                                    key={h}
                                    data-value={h}
                                    className={`${styles.item} ${inputValue.startsWith(h) ? styles.itemSelected : ""}`}
                                    onClick={() => handleSelect("hour", h)}
                                >
                                    {h}
                                </div>
                            ))}
                        </div>
                        <div className={styles.column} ref={minuteRef}>
                            {MINUTES.map(m => (
                                <div
                                    key={m}
                                    data-value={m}
                                    className={`${styles.item} ${inputValue.endsWith(":" + m) ? styles.itemSelected : ""}`}
                                    onClick={() => handleSelect("minute", m)}
                                >
                                    {m}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={styles.footer}>
                        <button type="button" className={styles.actionBtn} onClick={handleCurrentTime}>
                            Hazırki
                        </button>
                        <button type="button" className={styles.actionBtn} onClick={handleClear}>
                            Təmizlə
                        </button>
                    </div>
                </div>
            )}
            {error && (
                <span id={`${finalId}-error`} className={styles.errorMessage} role="alert">
                    {error}
                </span>
            )}
        </div>
    );
}
