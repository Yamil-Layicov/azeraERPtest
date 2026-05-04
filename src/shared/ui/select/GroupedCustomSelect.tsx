import { useState, useEffect, useRef, useMemo, useCallback, useId, Fragment } from "react";
import { createPortal } from "react-dom";
import styles from "./CustomSelect.module.css";
import { ChevronDownIcon, XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import type { Option, GroupedCustomSelectProps } from "@/shared/types";
import { useClickOutside } from "@/shared/lib/hooks";

const GroupedCustomSelect: React.FC<GroupedCustomSelectProps> = ({
  options,
  defaultText = "Seçin...",
  value,
  onChange,
  className,
  variant = "default",
  id,
  error,
  disabled = false,
  ariaLabel,
  icon: Icon,
  isClearable = true,
  isSearchable = false,
  searchPlaceholder = "Axtarış...",
  dropdownWidthExtra = 0,
  dataContext,
  onMenuOpen,
  onOpen,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    left: number;
    width: number;
    openUpward: boolean;
    maxHeight: number;
    bottom: number | "auto";
  }>({ top: -9999, left: -9999, width: 0, openUpward: false, maxHeight: 300, bottom: "auto" });

  const uniqueId = useId();
  const finalId = id || uniqueId;
  
  const selectRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    if (selectRef.current && isOpen) {
      const rect = selectRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const dropdownMaxHeight = 300;
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;
      const openUpward = spaceBelow < dropdownMaxHeight && spaceAbove > spaceBelow;
      
      const maxHeight = openUpward 
        ? Math.min(dropdownMaxHeight, spaceAbove - 8)
        : dropdownMaxHeight;
      
      setDropdownPosition({
        top: openUpward ? rect.top - maxHeight - 4 : rect.bottom + 4,
        left: rect.left,
        width: rect.width + dropdownWidthExtra,
        openUpward,
        maxHeight,
        bottom: openUpward ? viewportHeight - rect.top + 4 : 'auto',
      });
    }
  }, [isOpen, dropdownWidthExtra]);

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);
    }
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen, updatePosition]);

  useEffect(() => {
    if (!isOpen) {
       setDropdownPosition({ top: -9999, left: -9999, width: 0, openUpward: false, maxHeight: 300, bottom: 'auto' });
    }
  }, [isOpen]);

  useClickOutside(dropdownRef, (event) => {
    if (selectRef.current && selectRef.current.contains(event.target as Node)) {
      return;
    }
    setIsOpen(false);
    setSearchQuery("");
  }, isOpen);

  useEffect(() => {
    if (isOpen && isSearchable && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen, isSearchable]);

  const filteredGroups = useMemo(() => {
    if (!isSearchable || !searchQuery.trim()) {
      return options;
    }
    const query = searchQuery.toLowerCase().trim();
    
    return options.map(group => ({
      ...group,
      options: group.options.filter(opt => 
        (opt.fullName || opt.label || "").toLowerCase().includes(query) || 
        (opt.role && opt.role.toLowerCase().includes(query))
      )
    })).filter(group => group.options.length > 0);
  }, [options, searchQuery, isSearchable]);

  const handleOptionClick = (option: Option) => {
    if (option.disabled) return;
    onChange(option);
    setIsOpen(false);
    setSearchQuery(""); 
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSearchQuery("");
    searchInputRef.current?.focus();
  };

  const handleTriggerClick = () => {
    if (!disabled) {
      if (!isOpen) {
        if (onMenuOpen) onMenuOpen();
        if (onOpen) onOpen();
      }
      setIsOpen(!isOpen);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    onChange(null); 
  };

  const displayValue = value ? (value.fullName || value.label || "") : defaultText;

  const dropdownContent = (
    <div
      ref={dropdownRef}
      className={`${styles.optionsContainer} ${styles[variant]} ${dropdownPosition.openUpward ? styles.openUpward : ''}`}
      role="listbox"
      {...(dataContext ? { [`data-${dataContext}`]: "true" } : {})}
      style={{
        position: 'fixed',
        top: dropdownPosition.openUpward ? 'auto' : dropdownPosition.top,
        bottom: dropdownPosition.bottom,
        left: dropdownPosition.left,
        width: dropdownPosition.width,
        maxHeight: dropdownPosition.maxHeight,
        zIndex: 99999, 
        visibility: dropdownPosition.top === -9999 ? 'hidden' : 'visible', 
      }}
    >
      {isSearchable && (
        <div className={styles.searchWrapper}>
          <div className={styles.searchInputContainer}>
            <MagnifyingGlassIcon className={styles.searchIcon} />
            <input
              ref={searchInputRef}
              type="text"
              className={styles.searchInput}
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={handleSearchChange}
              onClick={(e) => e.stopPropagation()}
              name={`search-${finalId}`}
              id={`search-input-${finalId}`}
              autoComplete="on"
              aria-label="Axtarış"
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setIsOpen(false);
                  setSearchQuery("");
                }
              }}
            />
            {searchQuery && (
              <button
                type="button"
                className={styles.searchClearButton}
                onClick={handleSearchClear}
                aria-label="Axtarışı təmizlə"
              >
                <XMarkIcon className={styles.searchClearIcon} />
              </button>
            )}
          </div>
        </div>
      )}

      <ul className={isSearchable ? styles.optionsListWithSearch : ""}>
      {filteredGroups.length > 0 ? (
          filteredGroups.map((group, groupIdx) => (
            <Fragment key={`group-${groupIdx}`}>
              <div className={styles.groupLabel}>{group.label}</div>
              {group.options.map((option) => {
                const isSelected = value?.id === option.id; 
                const isDisabled = option.disabled === true;
                return (
                  <li
                    key={option.id}
                    className={`${styles.optionItem} ${styles.groupedItem} ${isSelected ? styles.optionSelected : ""} ${isDisabled ? styles.optionDisabled : ""}`}
                    onClick={() => !isDisabled && handleOptionClick(option)}
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={isDisabled}
                  >
                    <span className={styles.optionName}>{option.fullName || option.label}</span>
                  </li>
                );
              })}
            </Fragment>
          ))
        ) : (
          <li className={styles.noResults}>
            <span>Nəticə tapılmadı</span>
          </li>
        )}
      </ul>
    </div>
  );

  return (
    <div
      className={`${styles.selectWrapper} ${styles[variant]} ${
        className || ""
      } ${error ? styles.error : ""} ${disabled ? styles.disabled : ""}`}
      ref={selectRef}
      data-is-open={isOpen}
    >
      <button
        type="button"
        className={styles.selectTrigger}
        onClick={handleTriggerClick}
        id={id}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        disabled={disabled}
      >
        {Icon && <Icon className={styles.prefixIcon} />}
        <span className={`${styles.selectedOption} ${!value ? styles.defaultText : ""}`} data-placeholder={!value ? "true" : undefined}>
          {displayValue}
        </span>
        {value && !disabled && isClearable && (
          <span role="button" className={styles.clearButton} onClick={handleClear} title="Təmizlə">
            <XMarkIcon className={styles.clearIcon} />
          </span>
        )}
        <ChevronDownIcon className={`${styles.arrowIcon} ${isOpen ? styles.arrowOpen : ""}`} />
      </button>
      {isOpen && createPortal(dropdownContent, document.body)}
    </div>
  );
};

export default GroupedCustomSelect;
