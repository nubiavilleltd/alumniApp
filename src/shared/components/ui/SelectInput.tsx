import { forwardRef, useState, useRef, useEffect, useCallback } from 'react';
import { Icon } from '@iconify/react';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectInputProps extends Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  'onChange' | 'onBlur'
> {
  label?: string;
  error?: string;
  hint?: string;
  options: readonly SelectOption[];
  placeholder?: string;
  controlClassName?: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLSelectElement>) => void;
}

export const SelectInput = forwardRef<HTMLSelectElement, SelectInputProps>(
  (
    {
      label,
      error,
      hint,
      options,
      placeholder = 'Select an option',
      controlClassName = '',
      id,
      name,
      required,
      disabled,
      className = '',
      value,
      onChange,
      onBlur,
      ...rest
    },
    ref,
  ) => {
    const inputId = id ?? name;
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const hiddenSelectRef = useRef<HTMLSelectElement>(null);
    const onChangeRef = useRef(onChange);
    const onBlurRef = useRef(onBlur);

    // Keep refs updated
    useEffect(() => {
      onChangeRef.current = onChange;
      onBlurRef.current = onBlur;
    }, [onChange, onBlur]);

    // Combine refs if needed
    useEffect(() => {
      if (ref) {
        if (typeof ref === 'function') {
          ref(hiddenSelectRef.current);
        } else {
          ref.current = hiddenSelectRef.current;
        }
      }
    }, [ref]);

    // Filter options based on search
    const filteredOptions = options.filter((option) =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    // Show search only if there are more than 5 options total
    const showSearch = options.length > 5;

    // Get display label for selected value
    const selectedOption = options.find((opt) => opt.value === value);
    const displayLabel = selectedOption?.label || '';

    // Ref for the options list to handle scrolling
    const optionsListRef = useRef<HTMLDivElement>(null);

    // Scroll highlighted item into view
    useEffect(() => {
      if (isOpen && optionsListRef.current) {
        const highlightedElement = optionsListRef.current.children[highlightedIndex] as HTMLElement;
        if (highlightedElement) {
          highlightedElement.scrollIntoView({
            block: 'nearest',
            behavior: 'smooth',
          });
        }
      }
    }, [highlightedIndex, isOpen]);

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
          setSearchQuery('');
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }
    }, [isOpen]);

    // Focus search input when dropdown opens
    useEffect(() => {
      if (isOpen && searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, [isOpen]);

    // Reset highlighted index when search changes
    useEffect(() => {
      setHighlightedIndex(0);
    }, [searchQuery]);

    const handleToggle = () => {
      if (!disabled) {
        setIsOpen(!isOpen);
        if (isOpen) {
          setSearchQuery('');
        }
      }
    };

    const handleSelect = useCallback((option: SelectOption) => {
      if (!hiddenSelectRef.current) return;

      // Update the hidden select's value first
      const prevValue = hiddenSelectRef.current.value;
      hiddenSelectRef.current.value = option.value;

      // Only trigger change if value actually changed
      if (prevValue !== option.value) {
        // Create a native-like change event
        const nativeEvent = new Event('change', { bubbles: true });
        Object.defineProperty(nativeEvent, 'target', {
          writable: false,
          value: hiddenSelectRef.current,
        });
        Object.defineProperty(nativeEvent, 'currentTarget', {
          writable: false,
          value: hiddenSelectRef.current,
        });

        // Dispatch the native event (for react-hook-form's register)
        hiddenSelectRef.current.dispatchEvent(nativeEvent);

        // Also call the onChange prop if provided (for manual handlers)
        if (onChangeRef.current) {
          const syntheticEvent = {
            ...nativeEvent,
            target: hiddenSelectRef.current,
            currentTarget: hiddenSelectRef.current,
          } as unknown as React.ChangeEvent<HTMLSelectElement>;
          onChangeRef.current(syntheticEvent);
        }
      }

      setIsOpen(false);
      setSearchQuery('');
    }, []);

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent) => {
        if (disabled) return;

        switch (event.key) {
          case 'Enter':
            event.preventDefault();
            if (isOpen && filteredOptions[highlightedIndex]) {
              handleSelect(filteredOptions[highlightedIndex]);
            } else if (!isOpen) {
              setIsOpen(true);
            }
            break;
          case 'Escape':
            event.preventDefault();
            setIsOpen(false);
            setSearchQuery('');
            break;
          case 'ArrowDown':
            event.preventDefault();
            if (!isOpen) {
              setIsOpen(true);
            } else {
              setHighlightedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : prev));
            }
            break;
          case 'ArrowUp':
            event.preventDefault();
            if (isOpen) {
              setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
            }
            break;
          case 'Tab':
            setIsOpen(false);
            setSearchQuery('');
            break;
        }
      },
      [disabled, isOpen, filteredOptions, highlightedIndex, handleSelect],
    );

    const handleBlur = useCallback(() => {
      // Small delay to check if focus moved outside the component
      setTimeout(() => {
        if (
          containerRef.current &&
          !containerRef.current.contains(document.activeElement) &&
          hiddenSelectRef.current
        ) {
          // Create a native-like blur event
          const nativeEvent = new FocusEvent('blur', { bubbles: true });
          Object.defineProperty(nativeEvent, 'target', {
            writable: false,
            value: hiddenSelectRef.current,
          });
          Object.defineProperty(nativeEvent, 'currentTarget', {
            writable: false,
            value: hiddenSelectRef.current,
          });

          // Dispatch the native event (for react-hook-form's register)
          hiddenSelectRef.current.dispatchEvent(nativeEvent);

          // Also call the onBlur prop if provided (for manual handlers)
          if (onBlurRef.current) {
            const syntheticEvent = {
              ...nativeEvent,
              target: hiddenSelectRef.current,
              currentTarget: hiddenSelectRef.current,
            } as unknown as React.FocusEvent<HTMLSelectElement>;
            onBlurRef.current(syntheticEvent);
          }
        }
      }, 0);
    }, []);

    return (
      <div className={`select-input flex flex-col gap-1 ${className}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="select-input__label block text-sm font-medium text-gray-700"
          >
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}

        <div ref={containerRef} className="select-input__control-wrap relative" onBlur={handleBlur}>
          {/* Hidden native select for form compatibility */}
          <select
            ref={hiddenSelectRef}
            id={inputId}
            name={name}
            required={required}
            disabled={disabled}
            value={value}
            onChange={() => {}} // Controlled by handleSelect
            className="sr-only"
            tabIndex={-1}
            aria-hidden="true"
            {...rest}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Custom dropdown trigger */}
          <button
            type="button"
            onClick={handleToggle}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            className={`w-full text-left border rounded-3xl px-4 py-2.5 pr-9 text-sm outline-none transition-all shadow-sm
              ${error ? 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100' : 'border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100'}
              ${disabled ? 'opacity-50 bg-gray-50 cursor-not-allowed' : 'bg-white cursor-pointer hover:border-gray-300'}
              ${isOpen ? 'border-primary-400 ring-2 ring-primary-100' : ''}
              ${controlClassName}
            `}
          >
            <span className={displayLabel ? 'text-gray-700' : 'text-gray-400'}>
              {displayLabel || placeholder}
            </span>
          </button>

          <Icon
            icon={isOpen ? 'mdi:chevron-up' : 'mdi:chevron-down'}
            className={`select-input__icon absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-colors
              ${disabled ? 'text-gray-300' : 'text-gray-400'}
            `}
          />

          {/* Dropdown menu */}
          {isOpen && !disabled && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
              {/* Search input */}
              {showSearch && (
                <div className="p-2 border-b border-gray-100">
                  <div className="relative">
                    <Icon
                      icon="mdi:magnify"
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                    />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Search..."
                      className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                    />
                  </div>
                </div>
              )}

              {/* Options list */}
              <div ref={optionsListRef} className="max-h-60 overflow-y-auto overscroll-contain">
                {filteredOptions.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-gray-400">
                    No options found
                  </div>
                ) : (
                  filteredOptions.map((option, index) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleSelect(option)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors
                        ${value === option.value ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-700'}
                        ${highlightedIndex === index && value !== option.value ? 'bg-gray-50' : ''}
                        hover:bg-gray-50
                      `}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate">{option.label}</span>
                        {value === option.value && (
                          <Icon
                            icon="mdi:check"
                            className="w-4 h-4 text-primary-600 flex-shrink-0"
                          />
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {error ? (
          <p className="select-input__message select-input__message--error text-xs text-red-500 flex items-center gap-1">
            <Icon icon="mdi:alert-circle-outline" className="w-3 h-3" />
            {error}
          </p>
        ) : hint ? (
          <p className="select-input__message select-input__message--hint text-xs text-gray-400">
            {hint}
          </p>
        ) : null}
      </div>
    );
  },
);

SelectInput.displayName = 'SelectInput';
