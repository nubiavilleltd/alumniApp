import { Icon } from '@iconify/react';
import { forwardRef } from 'react';

interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onSearch?: () => void;
  showSearchButton?: boolean;
  onValueChange?: (value: string) => void;
  /** Show clear button when there's text (default: true) */
  showClearButton?: boolean;
  /** Called when clear button is clicked */
  onClear?: () => void;
  error?: string;
  hint?: string;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      onSearch,
      showSearchButton = false,
      showClearButton = true,
      onClear,
      onValueChange,
      onChange,
      onKeyDown,
      value,
      error,
      hint,
      className = '',
      disabled,
      ...rest
    },
    ref,
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
      onValueChange?.(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') onSearch?.();
      onKeyDown?.(e);
    };

    const handleClear = () => {
      // Call custom onClear if provided
      if (onClear) {
        onClear();
      } else {
        // Otherwise, trigger onValueChange with empty string
        onValueChange?.('');

        // Also create synthetic event for onChange
        const syntheticEvent = {
          target: { value: '' },
          currentTarget: { value: '' },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange?.(syntheticEvent);
      }
    };

    // Show clear button if there's text and showClearButton is true
    const hasValue = value !== undefined && value !== null && String(value).length > 0;
    const shouldShowClear = showClearButton && hasValue && !showSearchButton;

    return (
      <div className={`flex flex-col gap-1 ${className}`}>
        <div className="relative flex items-center">
          {/* Search icon */}
          <Icon
            icon="mdi:magnify"
            className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none z-10"
          />

          {/* Input */}
          <input
            ref={ref}
            type="search"
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            className={`
              w-full pl-9 pr-${shouldShowClear ? '10' : showSearchButton ? '28' : '4'} py-2 
              rounded-full border bg-white text-sm placeholder-gray-400 
              outline-none transition-all shadow-sm
              ${error ? 'border-red-400 focus:ring-2 focus:ring-red-100' : 'border-gray-200 focus:ring-2 focus:ring-primary-300'}
              ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}
            `}
            {...rest}
          />

          {/* Clear button OR Search button */}
          {showSearchButton ? (
            <button
              type="button"
              onClick={onSearch}
              disabled={disabled}
              className="absolute right-1 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-1.5 rounded-full transition-colors"
            >
              Search
            </button>
          ) : shouldShowClear ? (
            <button
              type="button"
              onClick={handleClear}
              disabled={disabled}
              className="absolute right-3 p-0.5 rounded-full hover:bg-gray-100 transition-colors group"
              aria-label="Clear search"
              tabIndex={-1}
            >
              <Icon
                icon="mdi:close-circle"
                className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors"
              />
            </button>
          ) : null}
        </div>

        {/* Error / hint */}
        {error ? (
          <p className="text-xs text-red-500 flex items-center gap-1 pl-3">
            <Icon icon="mdi:alert-circle-outline" className="w-3 h-3" />
            {error}
          </p>
        ) : hint ? (
          <p className="text-xs text-gray-400 pl-3">{hint}</p>
        ) : null}
      </div>
    );
  },
);

SearchInput.displayName = 'SearchInput';
