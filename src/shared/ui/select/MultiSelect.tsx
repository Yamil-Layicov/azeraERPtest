import { useState, useEffect, useRef } from "react";
import type { MouseEvent } from "react";
import styles from "./CustomSelect.module.css";
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/outline";
import type { Option, MultiSelectProps } from "@/shared/types";

const MultiSelect = ({
  options,
  defaultText,
  value,
  onChange,
  className,
  variant = "default",
  id,
  error,
  disabled = false,
  onMenuOpen,
}: MultiSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef(value);
  valueRef.current = value;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | globalThis.MouseEvent) {
      if (
        selectRef.current &&
        event.target instanceof Node &&
        !selectRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen && !disabled) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, disabled, selectRef]);

  const isOptionSelected = (option: Option): boolean => {
    return value.some((v) => String(v.id) === String(option.id));
  };

  const handleOptionClick = (option: Option) => {
    const currentValue = valueRef.current;
    const isSelected = currentValue.some((v) => String(v.id) === String(option.id));

    if (isSelected) {
      const newValues = currentValue.filter((v) => String(v.id) !== String(option.id));
      onChange(newValues);
    } else {
      onChange([...currentValue, option]);
    }
  };

  const handleTriggerClick = () => {
    if (!disabled) {
      if (!isOpen) onMenuOpen?.();
      setIsOpen(!isOpen);
    }
  };

  const handleRemoveTag = (option: Option, e: React.MouseEvent) => {
    e.stopPropagation();
    const newValues = valueRef.current.filter((v) => String(v.id) !== String(option.id));
    onChange(newValues);
  };

  return (
    <div
      className={`${styles.selectWrapper} ${styles[variant]} ${
        className || ""
      } ${error ? styles.error : ""} ${disabled ? styles.disabled : ""}`}
      ref={selectRef}
      data-is-open={isOpen}
    >
      <div
        className={styles.selectTrigger}
        onClick={handleTriggerClick}
        id={id}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        tabIndex={disabled ? -1 : 0}
      >
        {value.length > 0 ? (
          <div className={styles.selectedTags}>
            {value.map((option) => (
              <span key={option.id} className={styles.selectedTag}>
                {option.fullName}
                <button
                  type="button"
                  className={styles.removeTagButton}
                  onClick={(e) => handleRemoveTag(option, e)}
                  aria-label={`${option.fullName} seçimini sil`}
                >
                  <XMarkIcon className={styles.removeIcon} />
                </button>
              </span>
            ))}
          </div>
        ) : (
          <span className={styles.selectedOption + " " + styles.defaultText}>
            {defaultText}
          </span>
        )}
        <ChevronDownIcon
          className={`${styles.arrowIcon} ${isOpen ? styles.arrowOpen : ""}`}
        />
      </div>
      {isOpen && (
        <div className={styles.optionsContainer} role="listbox">
          <ul>
            {options.map((option) => {
              const selected = isOptionSelected(option);
              return (
                <li
                  key={option.id}
                  className={`${styles.optionItem} ${selected ? styles.optionSelected : ""}`}
                  onClick={() => handleOptionClick(option)}
                  role="option"
                  aria-selected={selected}
                >
                  <span className={styles.checkbox}>
                    {selected ? "✓" : ""}
                  </span>
                  <span className={styles.optionName}>{option.fullName}</span>
                  <span className={styles.optionRole}>{option.role}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MultiSelect;

