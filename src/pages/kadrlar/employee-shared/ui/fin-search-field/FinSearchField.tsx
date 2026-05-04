import React from "react";
import { XMarkIcon, MagnifyingGlassIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import styles from "./FinSearchField.module.css";

interface FinSearchFieldProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void; // Blur olayı eklendi
  onClear?: () => void;
  onSearch: () => void;
  disabled?: boolean;
  maxLength?: number;
  placeholder?: string;
  uppercase?: boolean;
  inputClassName?: string;
  clearTitle?: string;
  /** If true, search button shows only magnifying glass icon (like in table toolbar); otherwise shows searchLabel text */
  searchIconOnly?: boolean;
  searchLabel?: string;
  clearButtonAlwaysEnabled?: boolean;
  showClearButton?: boolean;
  useTableEditButton?: boolean;
  error?: string;
}

export const FinSearchField: React.FC<FinSearchFieldProps> = ({
  id = "fin",
  value,
  onChange,
  onBlur, // Blur karşılandı
  onClear,
  onSearch,
  disabled = false,
  maxLength = 7,
  placeholder = "Fin daxil edin",
  uppercase = true,
  inputClassName = "",
  clearTitle = "Hamısını təmizlə",
  searchIconOnly = false,
  searchLabel = "Axtar",
  showClearButton = true,
  useTableEditButton = false,
  error,
}) => {
  const isSearchDisabled = !value || value.trim().length === 0;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isSearchDisabled) {
      e.preventDefault();
      onSearch();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <input
          type="text"
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            const next = uppercase ? e.target.value.toUpperCase() : e.target.value;
            onChange(next);
          }}
          onBlur={onBlur} // Blur buraya bağlandı! Artık çalışacak.
          onKeyDown={handleKeyDown}
          maxLength={maxLength}
          disabled={disabled}
          className={`${styles.input} ${inputClassName} ${error ? styles.error : ""}`}
        />

        {showClearButton && (
          <button
            type="button"
            className={styles.clearButton}
            onClick={onClear}
            disabled={false}
            title={clearTitle}
          >
            <XMarkIcon className={styles.clearIcon} />
          </button>
        )}

        {useTableEditButton ? (
          <button
            type="button"
            className={`${styles.searchButton} ${styles.searchButtonIconOnly} ${styles.editButtonLikeTable}`}
            onClick={onSearch}
            title={searchLabel}
          >
            <PencilSquareIcon className={styles.searchIcon} />
          </button>
        ) : (
          <button
            type="button"
            className={`${styles.searchButton} ${searchIconOnly ? styles.searchButtonIconOnly : ""}`}
            disabled={isSearchDisabled}
            onClick={onSearch}
            title={searchIconOnly ? searchLabel : undefined}
          >
            {searchIconOnly ? (
              <MagnifyingGlassIcon className={styles.searchIcon} />
            ) : (
              searchLabel
            )}
          </button>
        )}
      </div>
      {error && (
        <span className={styles.errorMessage} role="alert">
          {error}
        </span>
      )}
    </div>
  );
};
