import { forwardRef } from 'react';
import { Icon } from '@iconify/react';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const SelectInput = forwardRef<HTMLSelectElement, SelectInputProps>(
  (
    { label, error, hint, options, placeholder = 'Select an option', id, name, required, disabled, className = '', ...rest },
    ref,
  ) => {
    const inputId = id ?? name;

    return (
      <div className={`flex flex-col gap-1 ${className}`}>
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={inputId}
            name={name}
            required={required}
            disabled={disabled}
            className={`w-full appearance-none border rounded-lg px-4 py-2.5 pr-9 text-sm text-gray-700 outline-none cursor-pointer transition-colors shadow-sm
              ${error ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-primary-400'}
              ${disabled ? 'opacity-50 bg-gray-50 cursor-not-allowed' : 'bg-white'}
            `}
            {...rest}
          >
            <option value="">{placeholder}</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <Icon
            icon="mdi:chevron-down"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
          />
        </div>

        {error ? (
          <p className="text-xs text-red-500 flex items-center gap-1">
            <Icon icon="mdi:alert-circle-outline" className="w-3 h-3" />
            {error}
          </p>
        ) : hint ? (
          <p className="text-xs text-gray-400">{hint}</p>
        ) : null}
      </div>
    );
  },
);

SelectInput.displayName = 'SelectInput';