import React from "react";
import styles from "./SegmentedToggle.module.css";

export type SegmentedToggleOption<T extends string = string> = {
  value: T;
  label: string;
};

export interface SegmentedToggleProps<T extends string = string> {
  name: string;
  value: T | "";
  onChange: (value: T) => void;
  options: Array<SegmentedToggleOption<T>>;
  className?: string;
  disabled?: boolean;
  id?: string;
  display?: "segments" | "selectedOnly";
}

const SegmentedToggle = <T extends string = string,>({
  name,
  value,
  onChange,
  options,
  className = "",
  disabled = false,
  id,
  display = "segments",
}: SegmentedToggleProps<T>) => {
  const activeIndex = options.findIndex((o) => o.value === value);
  const hasSelection = activeIndex >= 0;
  const selected = hasSelection ? options[activeIndex] : null;

  const rootStyle = {
    ["--count" as never]: String(Math.max(options.length, 1)),
    ["--active-index" as never]: String(Math.max(activeIndex, 0)),
  } as React.CSSProperties;

  if (display === "selectedOnly") {
    return (
      <div
        className={`${styles.single} ${disabled ? styles.disabledSingle : ""} ${className}`}
        role="status"
        aria-label={`${name}-selected`}
      >
        <span className={styles.singleValue}>{selected?.label ?? ""}</span>
      </div>
    );
  }

  return (
    <div
      className={`${styles.switch} ${disabled ? styles.disabled : ""} ${className}`}
      style={rootStyle}
      role="radiogroup"
      aria-disabled={disabled}
      data-has-selection={hasSelection ? "true" : "false"}
    >
      {options.map((opt) => {
        const inputId = id ? `${id}-${opt.value}` : `${name}-${opt.value}`;
        const checked = opt.value === value;

        return (
          <React.Fragment key={opt.value}>
            <input
              className={styles.input}
              type="radio"
              id={inputId}
              name={name}
              value={opt.value}
              checked={checked}
              disabled={disabled}
              onChange={() => onChange(opt.value)}
            />
            <label
              className={`${styles.label} ${checked ? styles.labelActive : ""}`}
              htmlFor={inputId}
            >
              {opt.label}
            </label>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default SegmentedToggle;

