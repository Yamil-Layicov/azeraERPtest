  import { useState, useEffect, useRef, useMemo, useCallback, useId } from "react";
  import { createPortal } from "react-dom";
  import styles from "./CustomSelect.module.css";
  import { ChevronDownIcon, XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
  import type { Option, CustomSelectProps } from "@/shared/types";
  import { useClickOutside } from "@/shared/lib/hooks";

  const CustomSelect = ({
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
    onBlur,
    onScroll,
    onSearch,
    isLoading = false,
  }: CustomSelectProps) => {
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
        const dropdownMaxHeight = 300; // max-height from CSS
        const spaceBelow = viewportHeight - rect.bottom;
        const spaceAbove = rect.top;
        const openUpward = spaceBelow < dropdownMaxHeight && spaceAbove > spaceBelow;
        
        // Yuxarıda açılanda, hündürlüyü məhdudlaşdırırıq
        const maxHeight = openUpward 
          ? Math.min(dropdownMaxHeight, spaceAbove - 8) // 8px padding üçün
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

    const filteredOptions = useMemo(() => {
      if (!isSearchable || !searchQuery.trim()) {
        return options;
      }
      const query = searchQuery.toLowerCase().trim();
      return options.filter(
        (option) =>
          (option.fullName || option.label || "").toLowerCase().includes(query) ||
          (option.role && option.role.toLowerCase().includes(query))
      );
    }, [options, searchQuery, isSearchable]);

    const handleOptionClick = (option: Option) => {
      // Don't allow selecting disabled options
      if (option.disabled) {
        return;
      }
      onChange(option);
      setIsOpen(false);
      setSearchQuery(""); 
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      setSearchQuery(query);
      if (onSearch) {
        onSearch(query);
      }
    };

    const handleSearchClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      setSearchQuery("");
      if (onSearch) {
        onSearch("");
      }
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

    const displayValue = value
      ? value.role
        ? `${value.fullName || value.label || ""} - ${value.role}`
        : (value.fullName || value.label || "")
      : defaultText;

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
                  if (e.key === "Enter" && filteredOptions.length > 0 && filteredOptions[0]) {
                    const firstOption = filteredOptions[0];
                    if (!firstOption.disabled) {
                      handleOptionClick(firstOption);
                    }
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

        <ul 
          className={isSearchable ? styles.optionsListWithSearch : ""}
          onScroll={onScroll}
        >
        {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => {
              // Bu sətri əlavə et: Seçilən elementdirmi?
              const isSelected = value?.id === option.id; 
              const isDisabled = option.disabled === true;
              
              return (
                <li
                  key={option.id}
                  className={`${styles.optionItem} ${isSelected ? styles.optionSelected : ""} ${isDisabled ? styles.optionDisabled : ""}`}
                  onClick={() => !isDisabled && handleOptionClick(option)}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={isDisabled}
                >
                  <span className={styles.optionName}>{option.fullName || option.label}</span>
                  {option.role && (
                    <span className={styles.optionRole}>{option.role}</span>
                  )}
                </li>
              );
            })
          ) : (
            !isLoading && (
              <li className={styles.noResults}>
                <span>Nəticə tapılmadı</span>
              </li>
            )
          )}
          {isLoading && (
            <li className={styles.loadingItem}>
              <span>Yüklənir...</span>
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
          onBlur={onBlur}
        >
          {Icon && <Icon className={styles.prefixIcon} />}
          
          <span
            className={`${styles.selectedOption} ${
              !value ? styles.defaultText : ""
            }`}
            data-placeholder={!value ? "true" : undefined}
          >
            {displayValue}
          </span>

          {value && !disabled && isClearable && (
            <span 
              role="button"
              className={styles.clearButton}
              onClick={handleClear}
              title="Təmizlə"
            >
              <XMarkIcon className={styles.clearIcon} />
            </span>
          )}

          <ChevronDownIcon className={`${styles.arrowIcon} ${isOpen ? styles.arrowOpen : ""}`} />
        </button>

        {isOpen && createPortal(dropdownContent, document.body)}

        {error && (
          <span className={styles.errorMessage} role="alert">
            {error}
          </span>
        )}
      </div>
    );
  };

  export default CustomSelect;