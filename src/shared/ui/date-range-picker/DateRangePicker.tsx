import { useState, useRef, useEffect } from "react";
import { DateRange } from "react-date-range";
import type { RangeKeyDict, Range } from "react-date-range";
import {
  addDays,
  addMonths,
  addYears,
  startOfDay,
  endOfDay,
  format,
  isSameDay,
} from "date-fns";
import { az } from "date-fns/locale";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import styles from "./DateRangePicker.module.css";
import { CalendarDaysIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { Button } from "@/shared/ui/button";

const predefinedRanges = [
  {
    label: "Bugün",
    range: {
      startDate: startOfDay(new Date()),
      endDate: endOfDay(new Date()),
    },
  },
  {
    label: "Dünən",
    range: {
      startDate: startOfDay(addDays(new Date(), -1)),
      endDate: endOfDay(addDays(new Date(), -1)),
    },
  },
  {
    label: "Son 7 gün",
    range: {
      startDate: startOfDay(addDays(new Date(), -7)),
      endDate: endOfDay(new Date()),
    },
  },
  {
    label: "Son 1 ay",
    range: {
      startDate: startOfDay(addMonths(new Date(), -1)),
      endDate: endOfDay(new Date()),
    },
  },
  {
    label: "Son 3 ay",
    range: {
      startDate: startOfDay(addMonths(new Date(), -3)),
      endDate: endOfDay(new Date()),
    },
  },
  {
    label: "Son 1 il",
    range: {
      startDate: startOfDay(addYears(new Date(), -1)),
      endDate: endOfDay(new Date()),
    },
  },
];

export interface DateRangePickerProps {
  onChange?: (range: { startDate?: Date; endDate?: Date }) => void;
  error?: boolean;
}

export const DateRangePicker = ({
  onChange,
  error,
}: DateRangePickerProps = {}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [state, setState] = useState<Range>({
    startDate: undefined,
    endDate: undefined,
    key: "selection",
  });
  const [tempState, setTempState] = useState<Range>(state);
  const [displayValue, setDisplayValue] = useState("Tarix seçin");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
        setIsCalendarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const handlePredefinedSelect = (range: {
    startDate: Date;
    endDate: Date;
  }) => {
    const rangeWithKey: Range = {
      ...range,
      key: "selection",
    };
    setState(rangeWithKey);
    if (range.startDate && range.endDate) {
      // DƏYİŞİKLİK 1: Formatlama dd.MM.yyyy
      const formatted = isSameDay(range.startDate, range.endDate)
        ? format(range.startDate, "dd.MM.yyyy")
        : `${format(range.startDate, "dd.MM.yyyy")} - ${format(range.endDate, "dd.MM.yyyy")}`;
      setDisplayValue(formatted);
    }
    setIsDropdownOpen(false);
    if (onChange)
      onChange({ startDate: range.startDate, endDate: range.endDate });
  };

  const handleOpenCalendar = () => {
    setIsDropdownOpen(false);
    setTempState(state);
    setIsCalendarOpen(true);
    setDisplayValue("Müddət aralığı seçin");
  };

  const handleCalendarChange = (ranges: RangeKeyDict) => {
    setTempState(ranges.selection as Range);
  };

  const handleCalendarCancel = () => {
    setIsCalendarOpen(false);
    if (state.startDate && state.endDate) {
      // DƏYİŞİKLİK 2: Formatlama dd.MM.yyyy
      const formatted = isSameDay(state.startDate, state.endDate)
        ? format(state.startDate, "dd.MM.yyyy")
        : `${format(state.startDate, "dd.MM.yyyy")} - ${format(state.endDate, "dd.MM.yyyy")}`;
      setDisplayValue(formatted);
    } else {
      setDisplayValue("Tarix seçin");
    }
  };

  const handleCalendarApply = () => {
    setState(tempState);
    if (tempState.startDate && tempState.endDate) {
      // DƏYİŞİKLİK 3: Formatlama dd.MM.yyyy
      const formatted = isSameDay(tempState.startDate, tempState.endDate)
        ? format(tempState.startDate, "dd.MM.yyyy")
        : `${format(tempState.startDate, "dd.MM.yyyy")} - ${format(tempState.endDate, "dd.MM.yyyy")}`;
      setDisplayValue(formatted);
    }
    setIsCalendarOpen(false);
    if (onChange)
      onChange({ startDate: tempState.startDate, endDate: tempState.endDate });
  };

  return (
    <div className={styles.datePickerWrapper} ref={wrapperRef}>
      <button
        className={`${styles.triggerButton} ${error ? styles.errorBorder : ""}`}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <CalendarDaysIcon width={20} height={20} />
        <span>{displayValue}</span>
        <ChevronDownIcon width={16} height={16} className={styles.chevron} />
      </button>

      {isDropdownOpen && (
        <div className={styles.dropdownContainer}>
          <ul>
            {predefinedRanges.map(({ label, range }) => (
              <li
                key={label}
                className={styles.dropdownItem}
                onClick={() => handlePredefinedSelect(range)}
              >
                {label}
              </li>
            ))}
            <li className={styles.separator}></li>
            <li className={styles.dropdownItem} onClick={handleOpenCalendar}>
              Müddət seç
            </li>
          </ul>
        </div>
      )}

      {isCalendarOpen && (
        <div className={styles.calendarContainer}>
          <DateRange
            onChange={handleCalendarChange}
            ranges={[tempState]}
            locale={az}
            months={isMobile ? 1 : 2}
            direction="horizontal"
            moveRangeOnFirstSelection={false}
            rangeColors={["var(--brand-primary)"]} // Qeyd: var(--primary-color) istifadə etsəniz daha yaxşı olar, amma mövcud kodu saxladım
            startDatePlaceholder="Başlanğıc tarix"
            endDatePlaceholder="Son tarix"
            dateDisplayFormat="d MMM yyyy" // Təqvimin içindəki input formatı
          />
          <div className={styles.calendarActions}>
            <Button
              type="button"
              variant="primary"
              onClick={handleCalendarApply}
              className={styles.pickerButton}
            >
              Tətbiq et
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleCalendarCancel}
              className={styles.pickerButton}
            >
              Ləğv et
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
