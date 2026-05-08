import { Icon } from '@iconify/react';
import { SelectInput } from './SelectInput';

interface FilterDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  label?: string;
  placeholder?: string;
  className?: string;
  selectClassName?: string;
  showClearButton?: boolean;
  clearLabel?: string;
}

export function FilterDropdown({
  value,
  onChange,
  options,
  label,
  placeholder = 'All',
  className = '',
  selectClassName = '',
  showClearButton = true,
  clearLabel = 'Clear filter',
}: FilterDropdownProps) {
  const hasValue = value.trim().length > 0;
  const shouldShowClear = showClearButton && hasValue;

  return (
    <div className={`w-full sm:w-48 ${className}`}>
      {label && <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>}
      <div className="relative">
        <SelectInput
          value={value}
          onChange={(event) => onChange(event.target.value)}
          options={options}
          placeholder={placeholder}
          className={`w-full ${selectClassName}`}
          controlClassName={shouldShowClear ? '!pr-16' : ''}
        />

        {shouldShowClear ? (
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute right-9 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            aria-label={clearLabel}
          >
            <Icon icon="mdi:close-circle" className="h-4 w-4" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
