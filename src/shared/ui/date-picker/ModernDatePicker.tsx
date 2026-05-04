import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useLayoutEffect,
  useId,
} from "react";
import styles from "./ModernDatePicker.module.css";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import type { ModernDatePickerProps } from "@/shared/types";
import { useClickOutside } from "@/shared/lib/hooks";

const WEEK_DAYS = ["B", "Be", "Ç", "Ç", "C", "Ş", "B"];
const AZ_MONTHS = [
  "Yanvar",
  "Fevral",
  "Mart",
  "Aprel",
  "May",
  "İyun",
  "İyul",
  "Avqust",
  "Sentyabr",
  "Oktyabr",
  "Noyabr",
  "Dekabr",
];

const TEMPLATE = "dd.mm.yyyy";
const YEAR_TEMPLATE = "yyyy";

const formatDate = (date: Date | null): string => {
  if (!date) return "";
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

const formatYear = (date: Date | null): string => {
  if (!date) return "";
  return String(date.getFullYear());
};

const formatWithTemplate = (
  rawValue: string,
): { formatted: string; cursorPosition: number; isComplete: boolean } => {
  let digits = rawValue.replace(/\D/g, "");

  if (digits.length >= 2) {
    const day = parseInt(digits.slice(0, 2));
    if (day > 31) digits = digits.slice(0, 1);
    if (day === 0) digits = digits.slice(0, 1);
  }

  if (digits.length >= 4) {
    const month = parseInt(digits.slice(2, 4));
    if (month > 12) digits = digits.slice(0, 3);
    if (month === 0) digits = digits.slice(0, 3);
  }

  if (digits.length > 8) digits = digits.slice(0, 8);

  let formatted = "";
  let digitIndex = 0;

  for (let i = 0; i < TEMPLATE.length; i++) {
    const char = TEMPLATE[i];

    if (char === ".") {
      formatted += ".";
    } else {
      if (digitIndex < digits.length) {
        formatted += digits[digitIndex++];
      } else {
        formatted += char;
      }
    }
  }

  let cursorPosition = 0;
  const firstLetterMatch = formatted.match(/[dmy]/);

  if (firstLetterMatch && firstLetterMatch.index !== undefined) {
    cursorPosition = firstLetterMatch.index;
  } else {
    cursorPosition = formatted.length;
  }

  return {
    formatted,
    cursorPosition,
    isComplete: digits.length === 8,
  };
};

const parseDate = (dateString: string): Date | null => {
  if (/[dmy]/.test(dateString)) return null;

  const parts = dateString.split(".");
  if (parts.length !== 3) return null;

  const dayStr = parts[0];
  const monthStr = parts[1];
  const yearStr = parts[2];

  if (!dayStr || !monthStr || !yearStr) return null;

  const d = parseInt(dayStr, 10);
  const m = parseInt(monthStr, 10) - 1;
  const y = parseInt(yearStr, 10);

  if (isNaN(d) || isNaN(m) || isNaN(y)) return null;
  if (y < 1900 || y > 2100) return null;
  if (m < 0 || m > 11) return null;
  if (d < 1 || d > 31) return null;

  const date = new Date(y, m, d);
  if (date.getFullYear() !== y || date.getMonth() !== m || date.getDate() !== d)
    return null;

  return date;
};

const parseYear = (yearString: string): Date | null => {
  const digits = yearString.replace(/\D/g, "").slice(0, 4);
  if (digits.length !== 4) return null;
  const y = parseInt(digits, 10);
  if (isNaN(y)) return null;
  if (y < 1900 || y > 2100) return null;
  return new Date(y, 0, 1);
};

export default function ModernDatePicker({
  value,
  onChange,
  onBlur, // onBlur eklendi
  label,
  disabled,
  id,
  className = "",
  placeholder,
  mode = "date",
  align,
  error,
  minDate,
  maxDate,
  required = false,
}: ModernDatePickerProps & {
  align?: "left" | "right";
  error?: string;
  required?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState<Date>(() => value ?? new Date());
  const [showYearPanel, setShowYearPanel] = useState(false);
  const [panelAlignRight, setPanelAlignRight] = useState(false);

  const uniqueId = useId();
  const finalId = id || uniqueId;

  const [inputValue, setInputValue] = useState<string>(
    value ? (mode === "year" ? formatYear(value) : formatDate(value)) : "",
  );
  const [cursor, setCursor] = useState<number | null>(null);

  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const blurTimeoutRef = useRef<number | null>(null);
  const isFocusedRef = useRef<boolean>(false);

  useClickOutside(ref, () => setOpen(false), open);

  useLayoutEffect(() => {
    if (cursor !== null && inputRef.current) {
      inputRef.current.setSelectionRange(cursor, cursor);
    }
  }, [inputValue, cursor]);

  const PANEL_WIDTH = 300;
  useLayoutEffect(() => {
    if (!open || !ref.current) return;

    if (align === "right") {
      setPanelAlignRight(true);
      return;
    }
    if (align === "left") {
      setPanelAlignRight(false);
      return;
    }

    const rect = ref.current.getBoundingClientRect();
    const overflowRight = rect.left + PANEL_WIDTH > window.innerWidth - 16;
    setPanelAlignRight(overflowRight);
  }, [open, align]);

  useEffect(() => {
    if (!isFocusedRef.current) {
      if (value) {
        const formatted =
          mode === "year" ? formatYear(value) : formatDate(value);
        setInputValue(formatted);
        setViewDate(value);
      } else {
        setInputValue("");
      }
    }
  }, [value, mode]);

  useEffect(() => {
    return () => {
      if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    if (!val) {
      setInputValue("");
      onChange(null);
      return;
    }

    if (mode === "year") {
      const digits = val.replace(/\D/g, "").slice(0, 4);
      setInputValue(digits);
      setCursor(digits.length);

      if (digits.length === 4) {
        const parsed = parseYear(digits);
        if (parsed) {
          onChange(parsed);
          setViewDate(parsed);
        }
      } else {
        if (value) onChange(null);
      }
      return;
    }

    const { formatted, cursorPosition, isComplete } = formatWithTemplate(val);

    setInputValue(formatted);
    setCursor(cursorPosition);

    if (isComplete) {
      const parsedDate = parseDate(formatted);
      if (parsedDate) {
        onChange(parsedDate);
        setViewDate(parsedDate);
      }
    } else {
      if (value) onChange(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      const selectionStart = e.currentTarget.selectionStart;

      if (
        selectionStart &&
        selectionStart > 0 &&
        inputValue[selectionStart - 1] === "."
      ) {
        e.preventDefault();

        if (selectionStart >= 2) {
          const newVal =
            inputValue.slice(0, selectionStart - 2) +
            inputValue.slice(selectionStart - 1);
          const { formatted, cursorPosition } = formatWithTemplate(newVal);
          setInputValue(formatted);
          setCursor(cursorPosition);
          onChange(null);
        }
      }
    }
  };

  const handleInputFocus = () => {
    if (!disabled) {
      isFocusedRef.current = true;
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
        blurTimeoutRef.current = null;
      }

      if (mode === "year") {
        setViewDate(value ?? new Date());
      } else if (!inputValue) {
        setInputValue(TEMPLATE);
        setTimeout(() => setCursor(0), 0);
      }

      setOpen(true);
    }
  };

  const handleInputBlur = () => {
    blurTimeoutRef.current = setTimeout(() => {
      isFocusedRef.current = false;
      if (open && document.activeElement !== inputRef.current) {
        setOpen(false);
      }

      if (onBlur) onBlur();

      if (mode === "year") {
        if (!inputValue) {
          onChange(null);
          return;
        }

        const parsed = parseYear(inputValue);
        if (!parsed) {
          setInputValue(value ? formatYear(value) : "");
          if (!value) onChange(null);
          return;
        }

        setInputValue(formatYear(parsed));
        return;
      }

      if (/[dmy]/.test(inputValue)) {
        if (value) {
          setInputValue(formatDate(value));
        } else {
          setInputValue("");
          onChange(null);
        }
      } else {
        const parsed = parseDate(inputValue);
        if (!parsed) {
          setInputValue(value ? formatDate(value) : "");
          if (!value) onChange(null);
        }
      }
    }, 200);
  };

  const handlePanelMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }
  };

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthLabel = useMemo(() => AZ_MONTHS[month], [month]);
  const shouldShowYearPanel = mode === "year" || showYearPanel;
  const years = useMemo(() => {
    const current = new Date().getFullYear();
    const list: number[] = [];

    if (mode === "year") {
      // Year mode: cari ildən 1900-dək (azalan)
      for (let y = current; y >= 1900; y--) {
        list.push(y);
      }
      return list;
    }

    // Date mode: 1900-dən cari il + 10-dək (artan)
    // Əgər çox geniş olarsa, range-i məhdudlaşdıra bilərik
    const minYear = 1920;
    const maxYear = current + 10;

    for (let y = minYear; y <= maxYear; y++) {
      list.push(y);
    }
    return list;
  }, [mode]);
  const firstDayOfMonth = new Date(year, month, 1);
  const startWeekDay = (firstDayOfMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = useMemo(() => {
    const arr: (Date | null)[] = [];
    for (let i = 0; i < startWeekDay; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(new Date(year, month, d));
    return arr;
  }, [startWeekDay, daysInMonth, year, month]);
  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
  const today = new Date();

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
        type="text"
        className={`${styles.input} ${className} ${error ? styles.error : ""}`} // Error sınıfı eklendi
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onClick={handleInputFocus}
        placeholder={
          placeholder ?? (mode === "year" ? YEAR_TEMPLATE : "dd.mm.yyyy")
        }
        disabled={disabled}
        id={finalId}
        name={finalId}
        autoComplete="on"
        aria-label={label || "Tarix seçimi"}
        inputMode="numeric"
        spellCheck={false}
      />

      {open && (
        <div
          className={`${styles.panel} ${panelAlignRight ? styles.panelAlignRight : ""}`}
          onMouseDown={handlePanelMouseDown}
        >
          <div className={styles.header}>
            {mode !== "year" && (
              <div className={styles.monthNav}>
                <button
                  type="button"
                  className={styles.navBtn}
                  onClick={() =>
                    setViewDate(
                      (d) => new Date(d.getFullYear(), d.getMonth() - 1, 1),
                    )
                  }
                >
                  <ChevronLeftIcon className={styles.icon} />
                </button>
                <span className={styles.monthLabelText}>{monthLabel}</span>
                <button
                  type="button"
                  className={styles.navBtn}
                  onClick={() =>
                    setViewDate(
                      (d) => new Date(d.getFullYear(), d.getMonth() + 1, 1),
                    )
                  }
                >
                  <ChevronRightIcon className={styles.icon} />
                </button>
              </div>
            )}
            <button
              type="button"
              className={styles.yearTrigger}
              onClick={() => {
                if (mode === "year") return;
                setShowYearPanel((p) => !p);
              }}
            >
              {year}
              {mode !== "year" && (
                <ChevronDownIcon
                  className={`${styles.caret} ${showYearPanel ? styles.caretOpen : ""}`}
                />
              )}
            </button>
          </div>

          {shouldShowYearPanel ? (
            <div className={styles.yearGrid}>
              {years.map((y) => (
                <button
                  key={y}
                  type="button"
                  className={
                    y === year ? styles.yearItemSelected : styles.yearItem
                  }
                  onClick={() => {
                    if (mode === "year") {
                      const selected = new Date(y, 0, 1);
                      setViewDate(selected);
                      onChange(selected);
                      setInputValue(formatYear(selected));
                      setOpen(false);
                      return;
                    }

                    setViewDate(new Date(y, month, 1));
                    setShowYearPanel(false);
                  }}
                >
                  {y}
                </button>
              ))}
            </div>
          ) : (
            <div className={styles.grid}>
              {WEEK_DAYS.map((d, idx) => (
                <div key={idx} className={styles.dow}>
                  {d}
                </div>
              ))}
              {days.map((d, idx) => {
                const isToday = d && isSameDay(d, today);
                const isSelected = d && value && isSameDay(d, value);

                let isDateDisabled = !d;
                if (d) {
                  if (minDate) {
                    const min = new Date(minDate);
                    min.setHours(0, 0, 0, 0);
                    if (d < min) isDateDisabled = true;
                  }
                  if (maxDate) {
                    const max = new Date(maxDate);
                    max.setHours(23, 59, 59, 999);
                    if (d > max) isDateDisabled = true;
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    className={[
                      styles.day,
                      isToday ? styles.dayToday : "",
                      isSelected ? styles.daySelected : "",
                    ].join(" ")}
                    onClick={() => {
                      if (!d || isDateDisabled) return;
                      onChange(d);
                      setInputValue(formatDate(d));
                      setOpen(false);
                      if (blurTimeoutRef.current) {
                        clearTimeout(blurTimeoutRef.current);
                        blurTimeoutRef.current = null;
                      }
                    }}
                    disabled={isDateDisabled}
                  >
                    {d ? d.getDate() : ""}
                  </button>
                );
              })}
            </div>
          )}

          <div className={styles.footer}>
            <button
              type="button"
              className={styles.actionBtn}
              onClick={() => {
                const now = new Date();
                if (mode === "year") {
                  const selected = new Date(now.getFullYear(), 0, 1);
                  setViewDate(selected);
                  onChange(selected);
                  setInputValue(formatYear(selected));
                } else {
                  setViewDate(now);
                  onChange(now);
                  setInputValue(formatDate(now));
                }
                setOpen(false);
              }}
            >
              {mode === "year" ? "Cari il" : "Bu gün"}
            </button>
            <button
              type="button"
              className={styles.actionBtn}
              onClick={() => {
                onChange(null);
                setInputValue(mode === "year" ? "" : TEMPLATE);
                setTimeout(() => setCursor(0), 0);
              }}
            >
              Təmizlə
            </button>
          </div>
        </div>
      )}
      {error && (
        <span className={styles.errorMessage} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
